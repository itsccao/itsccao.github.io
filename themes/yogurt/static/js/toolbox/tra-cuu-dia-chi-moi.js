(() => {
    const tool = document.querySelector(".address-lookup");
    const form = tool.querySelector("form");
    const query = form.elements.address;
    const status = tool.querySelector("[data-status]");
    const parsed = tool.querySelector("[data-parsed]");
    const results = tool.querySelector("[data-results]");
    const files = new Map();
    let request = 0;

    function normalize(value) {
        return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
    }

    function tokenize(value) {
        return [...value.matchAll(/[\p{L}\p{M}\p{N}]+/gu)]
            .map(match => ({ word: normalize(match[0]), start: match.index }));
    }

    function aliases(name, prefix) {
        const full = tokenize(name).map(token => token.word).join(" ");
        const short = full.replace(prefix, "");
        return [...new Set([full, short])];
    }

    function matchSuffix(tokens, end, names) {
        for (const name of names) {
            const words = name.split(" ");
            const start = end - words.length;
            if (start >= 0 && words.every((word, i) => word === tokens[start + i].word)) return start;
        }
        return -1;
    }

    function load(name) {
        if (!files.has(name)) {
            files.set(name, fetch(tool.dataset.directory + name + ".json").then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            }).catch(error => {
                files.delete(name);
                throw error;
            }));
        }
        return files.get(name);
    }

    function matchProvince(tokens, provinces) {
        let best;
        for (const [key, name] of provinces) {
            const short = key.replace(/-/g, " ");
            const names = [...new Set([`thanh pho ${short}`, `t p ${short}`, `tp ${short}`, `tinh ${short}`, short])];
            if (key === "ho-chi-minh") names.unshift("thanh pho hcm", "tp hcm", "tphcm", "hcm", "sai gon");
            const start = matchSuffix(tokens, tokens.length, names);
            if (start >= 0 && (!best || start < best.start)) best = { key, name, start };
        }
        return best;
    }

    function matchUnits(tokens, end, data) {
        const wardPrefix = /^(phuong|xa|thi tran|dac khu) /;
        const districtPrefix = /^(quan|huyen|thi xa|thanh pho|tp) /;
        let best = [];
        function consider(start, ward, district, province, codes) {
            if (start < 0 || (best.length && start > best[0].start)) return;
            if (best.length && start < best[0].start) best = [];
            best.push({ start, ward, district, province, codes });
        }

        for (const [ward, district, codes, province] of data.legacy) {
            const districtStart = district ? matchSuffix(tokens, end, aliases(district, districtPrefix)) : -1;
            const names = aliases(ward, district ? wardPrefix : districtPrefix);
            if (districtStart >= 0) consider(matchSuffix(tokens, districtStart, names), ward, district, province, codes);
            else consider(matchSuffix(tokens, end, names), ward, "", province, codes);
        }
        for (const code of data.current) {
            const [ward, province] = data.targets[code];
            const start = matchSuffix(tokens, end, aliases(ward, wardPrefix));
            if (!best.length || start < best[0].start) consider(start, ward, "", province, [code]);
        }
        return best;
    }

    function showResult(address, code, postalCode) {
        const row = document.createElement("li");
        row.className = "site-panel";
        const details = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = address;
        const codes = document.createElement("small");
        codes.textContent = postalCode ? `Mã đơn vị ${code} · Mã bưu chính ${postalCode}` : `Mã đơn vị ${code}`;
        details.append(name, codes);
        row.append(details);
        if (navigator.clipboard) {
            const copy = document.createElement("button");
            copy.type = "button";
            copy.className = "site-button";
            copy.textContent = "Sao chép";
            copy.setAttribute("aria-label", `Sao chép ${address}`);
            copy.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(address);
                    status.textContent = `Đã sao chép ${address}.`;
                } catch {
                    status.textContent = "Không thể sao chép tự động. Bạn có thể bôi đen địa chỉ để sao chép.";
                }
            });
            row.append(copy);
        }
        results.append(row);
    }

    query.addEventListener("input", () => {
        request++;
        results.replaceChildren();
        parsed.hidden = true;
        status.textContent = "";
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const lookup = ++request;
        const input = query.value.trim();
        const tokens = tokenize(input);
        if (tokens.at(-1)?.word === "nam" && tokens.at(-2)?.word === "viet") tokens.splice(-2);
        results.replaceChildren();
        parsed.hidden = true;
        status.textContent = "Đang tra cứu…";

        try {
            const provinces = await load("provinces");
            if (lookup !== request) return;
            const province = matchProvince(tokens, provinces);
            if (!province) {
                status.textContent = "Không nhận ra tỉnh/thành ở cuối địa chỉ. Hãy kiểm tra lại tên.";
                return;
            }
            const data = await load(province.key);
            if (lookup !== request) return;
            const matches = matchUnits(tokens, province.start, data);
            if (!matches.length) {
                status.textContent = `Đã nhận ra ${province.name}. Hãy kiểm tra phường/xã và quận/huyện cũ.`;
                return;
            }
            const street = input.slice(0, tokens[matches[0].start].start).replace(/[\s,;]+$/, "");
            const components = new Set(matches.map(match => [street, match.ward, match.district, match.province].filter(Boolean).join(", ")));
            parsed.textContent = [...components].join(" / ");
            parsed.hidden = false;
            const codes = [...new Set(matches.flatMap(match => match.codes))];
            for (const code of codes) {
                if (!Object.hasOwn(data.targets, code)) continue;
                const [ward, region, postalCode] = data.targets[code];
                showResult([street, ward, region].filter(Boolean).join(", "), code, postalCode);
            }

            if (codes.some(code => !Object.hasOwn(data.targets, code))) {
                status.textContent = "Một phần kết quả chưa đối chiếu được với danh mục hiện hành.";
            } else if (codes.length > 1) {
                status.textContent = "Có nhiều địa chỉ mới khả dĩ. Cần xác minh theo số nhà và tên đường.";
            } else {
                status.textContent = "Đã tìm thấy địa chỉ mới.";
            }
        } catch {
            if (lookup === request) status.textContent = "Không tải được dữ liệu. Hãy bấm Tra cứu để thử lại.";
        }
    });
})();
