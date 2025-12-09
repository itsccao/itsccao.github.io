+++
title = "Xem ngày Âm Lịch"
description = "Xem ngày Âm Lịch và ngày theo 12 con Giáp."
date = 2025-12-09
tags = [
    "javascript"
]
+++

<p> Cách tính ngày Âm Lịch được lấy từ: <a href="https://www.xemamlich.uhm.vn/calrules.html" target="_blank">www.xemamlich.uhm.vn/calrules.html</a> </p>

<label for="am-lich"> Chọn ngày: </label>
<input type="date" id="am-lich-input" name="am-lich">

<p> Ngày Âm Lịch: <span id="am-lich-result" class="link"> </span> </p>

<p> Ngày: <span id="am-lich-ngay" class="highlight"> </span> </p>
<p> Tháng: <span id="am-lich-thang"> </span> </p>
<p> Năm: <span id="am-lich-nam"> </span> </p>

<script type="module" src="/js/am-lich.js"> </script>