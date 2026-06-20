import { Controller, Get } from '@nestjs/common';
import { NaraService } from './nara.service';

@Controller('nara')
export class NaraController {
  constructor(private readonly naraService: NaraService) {}

  @Get('test')
  test() {
    return this.naraService.testFetch();
  }

  @Get('sync')
  sync() {
    return this.naraService.sync();
  }

  @Get('contracts/sync')
  syncContracts() {
    return this.naraService.syncContracts();
  }

  @Get('contracts/test')
  testContracts() {
    return this.naraService.testContracts();
  }

  @Get('projects')
  projects() {
    return this.naraService.findAll();

  }

  @Get('dashboard')
  dashboard() {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>중기넷 나라장터 관리자</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f5f6f8; }
    header { background: #111827; color: white; padding: 16px 24px; font-size: 22px; font-weight: bold; }
    .wrap { padding: 20px; }
    .top { display: flex; gap: 12px; margin-bottom: 16px; }
    .card { background: white; padding: 16px; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.1); min-width: 180px; }
    .card b { display: block; font-size: 26px; margin-top: 8px; }
    select, input { padding: 10px; margin-right: 8px; border: 1px solid #ccc; border-radius: 6px; }
    button { padding: 10px 14px; border: 0; border-radius: 6px; background: #2563eb; color: white; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; background: white; margin-top: 16px; }
    th, td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 13px; text-align: left; }
    th { background: #f1f5f9; position: sticky; top: 0; }
    .badge { color: #b91c1c; font-weight: bold; }
    .smallBtn { padding: 6px 10px; font-size: 12px; background: #6b7280; }
  </style>
</head>
<body>
<header>중기넷 나라장터 관리자</header>

<div class="wrap">
  <div class="top">
    <div class="card">전체 데이터 <b id="total">-</b></div>
    <div class="card">화면 표시 <b id="shown">-</b></div>
  </div>

  <button onclick="loadData()">새로고침</button>

  <select id="sourceFilter" onchange="render()">
    <option value="">전체 출처</option>
    <option value="나라장터 입찰공고">입찰공고</option>
    <option value="나라장터 낙찰정보">낙찰정보</option>
    <option value="나라장터 계약정보">계약정보</option>
  </select>

  <input id="search" placeholder="공사명, 발주처, 지역 검색" oninput="render()" />

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>공사명</th>
        <th>지역</th>
        <th>발주처</th>
        <th>시공사</th>
        <th>협력사</th>
        <th>금액</th>
        <th>계약일</th>
      </tr>
    </thead>
    <tbody id="tbody"></tbody>
  </table>
</div>

<script>
  let rows = [];

  async function loadData() {
    const res = await fetch('/nara/projects');
    rows = await res.json();
    document.getElementById('total').innerText = rows.length;
    render();
  }

  function money(value) {
    if (value === undefined || value === null || value === '') return '';

    const cleaned = String(value)
      .replace(/,/g, '')
      .replace(/원/g, '')
      .trim();

    const num = Number(cleaned);

    if (Number.isNaN(num)) return String(value);

    return num.toLocaleString('ko-KR');
  }

  function onlyDate(value) {
    if (!value) return '';

    const s = String(value).trim();

    if (s.length === 8 && /^[0-9]+$/.test(s)) {
      return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8);
    }

    return s.slice(0, 10);
  }

  function getTitle(x) {
    return x.bidNtceNm || x.cntrctNm || x.cntrctName || x.prdctClsfcNoNm || x.title || '';
  }

  function getRegion(x) {
    return x.region || x.dminsttOfclAdres || x.ntceInsttOfclAdres || x.cntrctInsttOfclAdres || '';
  }

  function getOwner(x) {
    return x.ntceInsttNm || x.dminsttNm || x.cntrctInsttNm || x.orderAgency || '';
  }

  function getMainCompany(x) {
    return x.mainCompany || x.contractor || x.bidder || x.cntrctEntrpsNm || x.scsbidwinnrNm || x.opengCorpInfo || '';
  }

  function getPartner(x) {
    return x.partnerCompany || '';
  }

  function getAmount(x) {
    return x.amount || x.cntrctAmount || x.cntrctAmt || x.scsbidAmt || x.scsbidPrice || x.bidAmount || x.presmptPrce || x.bssamt || x.totAmount || '';
  }

  function getDate(x) {
    return x.contractDate || x.cntrctDate || x.cntrctDe || x.bidDate || x.opengDt || x.openDt || x.rgstDt || x.ntceDt || '';
  }

  function render() {
    const q = document.getElementById('search').value.trim();
    const source = document.getElementById('sourceFilter').value;

    let filtered = rows;

    if (source) {
      filtered = filtered.filter(function(x) {
        return x.source === source;
      });
    }

    if (q) {
      filtered = filtered.filter(function(x) {
        return JSON.stringify(x).includes(q);
      });
    }

    filtered.sort(function(a, b) {
      const rawDateA = getDate(a);
      const rawDateB = getDate(b);

      const dateA = rawDateA ? new Date(onlyDate(rawDateA)).getTime() : 0;
      const dateB = rawDateB ? new Date(onlyDate(rawDateB)).getTime() : 0;

      if (dateA !== dateB) return dateB - dateA;

      const amountA = Number(String(getAmount(a) || '0').replace(/,/g, '').replace(/원/g, ''));
      const amountB = Number(String(getAmount(b) || '0').replace(/,/g, '').replace(/원/g, ''));

      return amountB - amountA;
    });

    document.getElementById('shown').innerText = filtered.length;

    const showRows = filtered.slice(0, 500);

    document.getElementById('tbody').innerHTML = showRows.map(function(x) {
      const partner = getPartner(x);

      return '<tr>' +
        '<td>' + (x.id || '') + '</td>' +
        '<td>' + getTitle(x) + '</td>' +
        '<td>' + getRegion(x) + '</td>' +
        '<td>' + getOwner(x) + '</td>' +
        '<td>' + (getMainCompany(x) || '-') + '</td>' +
        '<td>' +
          (partner
            ? partner
            : '<span class="badge">미등록</span> <button class="smallBtn" onclick="alert(\\'협력사 제보 기능은 다음 단계에서 연결합니다.\\')">제보</button>'
          ) +
        '</td>' +
        '<td>' + money(getAmount(x)) + '</td>' +
        '<td>' + onlyDate(getDate(x)) + '</td>' +
      '</tr>';
    }).join('');
  }

  loadData();
</script>
</body>
</html>
`;
  }
}