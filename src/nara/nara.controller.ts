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

@Get('projects')
projects() {
  return this.naraService.findAll();
}

@Get('dashboard')
dashboard() {
  return `
<html>
<head>
  <meta charset="utf-8" />
  <title>나라장터 관리자</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f5f6f8; }
    header { background: #111827; color: white; padding: 16px 24px; font-size: 22px; font-weight: bold; }
    .wrap { padding: 20px; }
    .top { display: flex; gap: 12px; margin-bottom: 16px; }
    .card { background: white; padding: 16px; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.1); min-width: 180px; }
    .card b { display: block; font-size: 26px; margin-top: 8px; }
    input, select { padding: 10px; margin-right: 8px; border: 1px solid #ccc; border-radius: 6px; }
    button { padding: 10px 14px; border: 0; border-radius: 6px; background: #2563eb; color: white; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; background: white; margin-top: 16px; }
    th, td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 13px; text-align: left; }
    th { background: #f1f5f9; position: sticky; top: 0; }
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
    </select>

    <input id="search" placeholder="공고명, 기관명, 지역 검색" oninput="render()" />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>출처</th>
          <th>공고명</th>
          <th>기관</th>
          <th>지역</th>
          <th>금액</th>
          <th>날짜</th>
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

    function render() {
      const q = document.getElementById('search').value.trim();
      const source = document.getElementById('sourceFilter').value;

      let filtered = rows;

      if (source) {
        filtered = filtered.filter(x => x.source === source);
      }

      if (q) {
        filtered = filtered.filter(x =>
          JSON.stringify(x).includes(q)
        );
      }

      document.getElementById('shown').innerText = filtered.length;

      const showRows = filtered.slice(0, 500);

      document.getElementById('tbody').innerHTML = showRows.map(x => \`
        <tr>
          <td>\${x.id || ''}</td>
          <td>\${x.source || ''}</td>
          <td>\${x.bidNtceNm || ''}</td>
          <td>\${x.ntceInsttNm || ''}</td>
          <td>\${x.region || ''}</td>
          <td>\${x.amount || ''}</td>
          <td>\${x.bidDate || ''}</td>
        </tr>
      \`).join('');
    }

    loadData();
  </script>
</body>
</html>
`;
}
}