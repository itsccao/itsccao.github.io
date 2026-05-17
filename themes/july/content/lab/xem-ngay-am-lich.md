+++
title = "Xem ngày Âm Lịch"
description = "Xem ngày Âm Lịch và ngày theo 12 con Giáp."
date = 2025-12-09
tags = [
    "javascript"
]
+++

<p> Thuật toán tính ngày Âm Lịch: <a href="https://www.xemamlich.uhm.vn/calrules.html" target="_blank">www.xemamlich.uhm.vn/calrules.html</a> </p>

<style>
    #am-lich-input {
        padding: 0.6rem;
        font-size: 1rem;
        border-radius: 0.5rem;
        border: 2px solid var(--box-shadow-hover);
        background-color: var(--off-background);
        color: var(--text);
        transition: border-color 0.2s ease;
        margin-left: 0.5rem;
        margin-bottom: 1.5rem;
    }
    #am-lich-input:focus {
        outline: none;
        border-color: var(--link-hover);
    }
    .date-info {
        background-color: var(--off-background);
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--box-shadow-hover);
    }
    .date-info p { margin-bottom: 0.5rem; }
</style>

<label for="am-lich" style="font-weight: 600;"> Chọn ngày: </label>
<input type="date" id="am-lich-input" name="am-lich">

<div class="date-info">
    <h3 style="margin-top: 0; color: var(--link-hover);"> Thông tin ngày </h3>
    <p> Ngày Âm Lịch: <span id="am-lich-result" class="link" style="font-weight:bold;"> </span> </p>
    <p> Thứ: <span id="am-lich-thu"> </span> </p>
    <p> Ngày: <span id="am-lich-ngay"> </span> </p>
    <p> Tháng: <span id="am-lich-thang"> </span> </p>
    <p> Năm: <span id="am-lich-nam"> </span> </p>
</div>

<script type="module" src="/js/am-lich.js"> </script>