import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getMapPage(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>TOCYCLE 전국 사토장 지도</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; }
    #header { padding: 12px 16px; font-size: 20px; font-weight: bold; }
    #map { width: 100%; height: calc(100vh - 50px); }
  </style>
</head>
<body>
  <div id="header">전국 사토장 / 토취장 / 골재업체 지도</div>
  <div id="map"></div>

  <script>
    async function loadSites() {
      const res = await fetch('/tocycle/sites');
      const sites = await res.json();

      document.getElementById('map').innerHTML =
        '<pre style="padding:16px; white-space:pre-wrap;">' +
        JSON.stringify(sites.slice(0, 50), null, 2) +
        '</pre>';
    }

    loadSites();
  </script>
</body>
</html>
    `;
  }
}