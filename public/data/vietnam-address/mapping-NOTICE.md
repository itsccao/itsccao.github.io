# Data sources and notices

The tables in `src/data/` were built once from these sources (vietnamadminunits at commit
`7fac8c45805aad9916b17237c54baf4502303b93`, vn-local-plus 1.1.6) and are kept as committed data:

| Data | Source |
|---|---|
| Legacy provinces, districts, wards (state before 2025-07-01) | General Statistics Office of Viet Nam (GSO), danhmuchanhchinh.gso.gov.vn, export of 2025-07-18 |
| Current provinces and wards (from 2025-07-01) | GSO administrative-unit catalogue (production.cas.so), 2025-08-05 |
| Legacy → current ward conversion, default part of divided wards | sapnhap.bando.com.vn, processed by [vietnamadminunits](https://github.com/tranngocminhhieu/vietnamadminunits) (commit `7fac8c4`) |
| Successors of wards merged 2021–2025 | Alias list of vietnamadminunits (each row cites its source) |
| Retired codes (GSO 2021) | [vn-local-plus](https://www.npmjs.com/package/vn-local-plus) 1.1.6, ISC |

Administrative names and codes are public information published by the Vietnamese state.

## vietnamadminunits

MIT License

Copyright (c) 2025 Tran Ngoc Minh Hieu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
