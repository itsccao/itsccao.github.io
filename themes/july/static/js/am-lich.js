// Thuật toán được cung cấp bởi tác giả Hồ Ngọc Đức tại https://www.xemamlich.uhm.vn/calrules.html

const INT = Math.floor;
const PI = Math.PI;

export class CalendarConverter {
    constructor(timeZone = 7) { // Default to GMT+7
        this._timeZone = timeZone;
        console.log(`CalendarConverter initialized with timeZone: ${this._timeZone}`);
    }

    // Chuyển đổi ngày sang số ngày Julius
    _jdFromDate(dd, mm, yy) {
        var a, y, m, jd;
        a = INT((14 - mm) / 12);
        y = yy+4800-a;
        m = mm+12*a-3;
        jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
        if (jd < 2299161) {
            jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - 32083;
        }
        return jd;
    }

    // Chuyển đổi số ngày Julius jd ra ngày dd/mm/yyyy Dương lịch.
    _jdToDate(jd) {
        var a, b, c, d, e, m, day, month, year;
        if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
            a = jd + 32044;
            b = INT((4*a+3)/146097);
            c = a - INT((b*146097)/4);
        } else {
            b = 0;
            c = jd + 32082;
        }
        d = INT((4*c+3)/1461);
        e = c - INT((1461*d)/4);
        m = INT((5*e+2)/153);
        day = e - INT((153*m+2)/5) + 1;
        month = m + 3 - 12*INT(m/10);
        year = b*100 + d - 4800 + INT(m/10);
        return new Array(day, month, year);
    }

   
    // Tính ngày Sóc thứ k kể từ điểm Sóc ngày 1/1/1900. Kết quả trả về là số ngày Julius của ngày Sóc cần tìm.
    _getNewMoonDay(k) {
        var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
        T = k/1236.85; // Time in Julian centuries from 1900 January 0.5
        T2 = T * T;
        T3 = T2 * T;
        dr = PI/180;
        Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
        Jd1 = Jd1 + 0.00033*Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr); // Mean new moon
        M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3; // Sun's mean anomaly
        Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3; // Moon's mean anomaly
        F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3; // Moon's argument of latitude
        C1=(0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
        C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
        C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
        C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
        C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
        C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
        C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
        if (T < -11) {
            deltat= 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
        } else {
            deltat= -0.000278 + 0.000265*T + 0.000262*T2;
        };
        JdNew = Jd1 + C1 - deltat;
        return INT(JdNew + 0.5 + this._timeZone/24);
    }

    // Tính tọa độ mặt trời
    _getSunLongitude(jdn) {
        var T, T2, dr, M, L0, DL, L;
        T = (jdn - 2451545.5 - this._timeZone/24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
        T2 = T*T;
        dr = PI/180;
        M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
        L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
        DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
        DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
        L = L0 + DL; // true longitude, degree
        L = L*dr;
        L = L - PI*2*(INT(L/(PI*2))); // Normalize to (0, 2*PI)
        return INT(L / (PI/6));
    }

    // Tìm ngày bắt đầu tháng 11 âm lịch
    _getLunarMonth11(yy) {
        var k, off, nm, sunLong;
        off = this._jdFromDate(31, 12, yy) - 2415021;
        k = INT(off / 29.530588853);
        nm = this._getNewMoonDay(k);
        sunLong = this._getSunLongitude(nm); // sun longitude at local midnight
        if (sunLong >= 9) {
            nm = this._getNewMoonDay(k-1);
        }
        return nm;
    }

    // Xác định tháng nhuận
    _getLeapMonthOffset(a11) {
        var k, last, arc, i;
        k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        last = 0;
        i = 1; // We start with the month following lunar month 11
        arc = this._getSunLongitude(this._getNewMoonDay(k+i));
        do {
            last = arc;
            i++;
            arc = this._getSunLongitude(this._getNewMoonDay(k+i));
        } while (arc != last && i < 14);
        return i-1;
    }

    // Đổi ngày dương dd/mm/yyyy ra ngày âm
    convertSolar2Lunar(dd, mm, yy) {
        var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap, diff, leapMonthDiff;
        dayNumber = this._jdFromDate(dd, mm, yy);
        k = INT((dayNumber - 2415021.076998695) / 29.530588853);
        monthStart = this._getNewMoonDay(k);
        if (monthStart > dayNumber) {
            monthStart = this._getNewMoonDay(k - 1); // Sửa từ k thành k-1 theo logic gốc.
        }
        a11 = this._getLunarMonth11(yy);
        b11 = a11;
        if (a11 >= monthStart) {
            lunarYear = yy - 1; // Sửa từ yy thành yy-1 theo logic gốc.
            a11 = this._getLunarMonth11(yy - 1);
            b11 = this._getLunarMonth11(yy);
        } else {
            lunarYear = yy;
            a11 = this._getLunarMonth11(yy);
            b11 = this._getLunarMonth11(yy + 1);
        }
        lunarDay = dayNumber - monthStart + 1;
        diff = INT((monthStart - a11) / 29);

        lunarLeap = 0;
        lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            leapMonthDiff = this._getLeapMonthOffset(a11);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff == leapMonthDiff) {
                    lunarLeap = 1;
                }
            }
        }

        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }

        if (lunarMonth >= 11 && diff < 4) {
             lunarYear -= 1;
        }

        return {
            day: lunarDay,
            month: lunarMonth,
            year: lunarYear,
            isLeap: lunarLeap === 1
        };
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const amLichInput = document.getElementById("am-lich-input");
    const amLichResult = document.getElementById("am-lich-result");
    const chiNgay = document.getElementById("am-lich-ngay");
    const chiThang = document.getElementById("am-lich-thang");
    const chiNam = document.getElementById("am-lich-nam");
    
    const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

    if (!amLichInput || !amLichResult || !chiNgay || !chiThang || !chiNam) return;

    const converter = new CalendarConverter();
    const pad = (value) => String(value).padStart(2, "0");

    const tinhCanChi = (solarDate, lunarData) => {
        const lunarYear = lunarData.year;
        const lunarMonth = lunarData.month;
        
        // Tính số ngày Julius
        const jd = converter._jdFromDate(solarDate.getDate(), solarDate.getMonth() + 1, solarDate.getFullYear());
        
        // Can-Chi của Ngày: N + 9 cho Can, N + 1 cho Chi
        const canNgayIdx = (jd + 9) % 10;
        const chiNgayIdx = (jd + 1) % 12;
        
        // Can-Chi của Năm: Y + 6 cho Can, Y+8 cho Chi
        const canNamIdx = (lunarYear + 6) % 10;
        const chiNamIdx = (lunarYear + 8) % 12;
        
        // Can-Chi của Tháng: (Y * 12 + M + 3) cho Can, tháng 11 là Tý, 12 là Sửu, 1 là Dần...
        const canThangIdx = (lunarYear * 12 + lunarMonth + 3) % 10;
        const chiThangIdx = (lunarMonth + 1) % 12;

        return {
            day: `${CAN[canNgayIdx]} ${CHI[chiNgayIdx]}`,
            month: `${CAN[canThangIdx]} ${CHI[chiThangIdx]}`,
            year: `${CAN[canNamIdx]} ${CHI[chiNamIdx]}`
        };
    };

    const updateAmLichResult = () => {
        const value = amLichInput.value;
        if (!value) return;

        const [year, month, day] = value.split('-').map(Number);
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return;

        const lunar = converter.convertSolar2Lunar(day, month, year);
        
        lunar.year += 1;
        amLichResult.textContent = `Ngày ${pad(lunar.day)} Tháng ${pad(lunar.month)} Năm ${lunar.year}${lunar.isLeap ? " (nhuận)" : ""}`;

        const canChi = tinhCanChi(new Date(year, month - 1, day), lunar);
        
        chiNgay.textContent = canChi.day;
        chiThang.textContent = canChi.month;
        chiNam.textContent = canChi.year;
    };

    const today = new Date();
    amLichInput.value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    updateAmLichResult();

    amLichInput.addEventListener("change", updateAmLichResult);
});