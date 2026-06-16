import { Controller, Get } from '@nestjs/common';
import { TocycleService } from './tocycle.service';

@Controller('tocycle')
export class TocycleController {
  constructor(private readonly tocycleService: TocycleService) {}
@Get()
home() {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>TOCYCLE 관리자</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f5f6f8; }
    h1 { margin-bottom: 8px; }
    .box { background: white; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
    button { padding: 10px 14px; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
    th { background: #222; color: white; }
    #map{
  width:100%;
  height:700px;
  margin-bottom:20px;
  border-radius:12px;
}
  </style>
</head>
<body>
  <h1>전국 사토장 / 토취장 / 골재업체 관리자</h1>
  <div id="map"></div>

  <div class="box">
    <button onclick="loadSites()">목록 불러오기</button>
    <button onclick="syncSites()">데이터 수집 실행</button>
    <span id="status"></span>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>업체명</th>
        <th>주소</th>
        <th>위도</th>
        <th>경도</th>
      </tr>
    </thead>
    <tbody id="rows"></tbody>
  </table>

  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=404d486582fad1076a922f28939b1043"></script>
  <script>
    async function loadSites() {
      document.getElementById('status').innerText = '불러오는 중...';
      const res = await fetch('/tocycle/sites');
      const sites = await res.json();

      document.getElementById('rows').innerHTML = sites.map(site => \`
        <tr>
          <td>\${site.id ?? ''}</td>
          <td>\${site.orgName ?? ''}</td>
          <td>\${site.addr ?? ''}</td>
          <td>\${site.ypos ?? ''}</td>
          <td>\${site.xpos ?? ''}</td>
        </tr>
      \`).join('');

      document.getElementById('status').innerText = '총 ' + sites.length + '개';
    }

    async function syncSites() {
      document.getElementById('status').innerText = '수집 중...';
      await fetch('/tocycle/sync');
      await loadSites();
    }
</script>

<script>
loadSites();

/*
const mapContainer = document.getElementById('map');

const map = new kakao.maps.Map(
  mapContainer,
  {
    center: new kakao.maps.LatLng(36.5, 127.8),
    level: 13
  }
);
*/
</script>

</body>
</html>
  `;
}

  @Get('test')
  test() {
    return this.tocycleService.testFetch();
  }

  @Get('sync')
  sync() {
    return this.tocycleService.sync();
  }

  @Get('sites')
  sites() {
    return this.tocycleService.findAll();
  }
}