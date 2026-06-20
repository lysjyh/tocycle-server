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
<title>중기넷 토사거래 관리자</title>
<style>
body{margin:0;font-family:Arial,sans-serif;background:#eef2f7;color:#111827}
header{background:linear-gradient(135deg,#111827,#1e3a8a);color:white;padding:26px 34px}
h1{margin:0;font-size:28px}
.wrap{padding:22px 28px}
.panel,.card,table{background:white;border-radius:16px;box-shadow:0 8px 20px rgba(15,23,42,.06)}
.cards{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:16px}
.card{padding:16px}.card span{color:#6b7280}.card b{display:block;font-size:26px;margin-top:6px}
.panel{padding:18px;margin-bottom:16px}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
input,select,textarea{padding:11px 12px;border:1px solid #d1d5db;border-radius:10px;font-size:14px}
textarea{font-family:Arial,sans-serif}
button{padding:11px 15px;border:0;border-radius:10px;background:#2563eb;color:white;font-weight:bold;cursor:pointer}
.green{background:#059669}.orange{background:#d97706}.gray{background:#374151}.red{background:#dc2626}
.status{margin-left:auto;background:#f3f4f6;padding:9px 12px;border-radius:999px;font-size:13px}
#mapBox{display:none;margin-bottom:16px;background:white;padding:14px;border-radius:18px}
#map{width:100%;height:520px;border-radius:14px}
table{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden}
th,td{border-bottom:1px solid #e5e7eb;padding:12px;font-size:13px;vertical-align:top}
th{background:#111827;color:white;position:sticky;top:0}
tr:hover{background:#f8fafc}
.badge{padding:5px 9px;border-radius:999px;font-size:12px;font-weight:bold;display:inline-block}
.b-dump{background:#fee2e2;color:#991b1b}
.b-take{background:#fef3c7;color:#92400e}
.b-gravel{background:#dcfce7;color:#166534}
.b-post{background:#dbeafe;color:#1d4ed8}
.b-need{background:#ede9fe;color:#6d28d9}
.small{color:#6b7280;font-size:12px;margin-top:4px}
.title{font-weight:800}
@media(max-width:1100px){.cards{grid-template-columns:repeat(2,1fr)}}
</style>
</head>
<body>
<header>
<h1>중기넷 토사거래 관리자</h1>
<div>사토장 · 토취장 · 골재업체 · 발생토 · 성토재필요 통합 관리</div>
</header>

<div class="wrap">
<div class="cards">
<div class="card"><span>전체</span><b id="statTotal">0</b></div>
<div class="card"><span>사토장</span><b id="statDump">0</b></div>
<div class="card"><span>토취장</span><b id="statTake">0</b></div>
<div class="card"><span>골재업체</span><b id="statGravel">0</b></div>
<div class="card"><span>발생토</span><b id="statPost">0</b></div>
<div class="card"><span>성토재필요</span><b id="statNeed">0</b></div>
</div>

<div class="panel">
<div class="row">
<input id="keyword" placeholder="지역 · 회사명 · 구분 · 대표자 · 담당자 · 토질 검색" style="width:390px" oninput="renderTable()" />
<select id="filterType" onchange="handleFilterChange()">
<option value="전체">전체</option>
<option value="사토장">사토장</option>
<option value="토취장">토취장</option>
<option value="골재업체">골재업체</option>
<option value="발생토">발생토</option>
<option value="성토재필요">성토재필요</option>
</select>
<button onclick="loadSites()">토석정보 목록</button>
<button onclick="loadSoilPosts()" class="orange">거래글 목록</button>
<button onclick="syncSites()" class="green">토석정보 수집</button>
<button id="mapToggleBtn" onclick="toggleMap()" class="gray">지도보기</button>
<span id="status" class="status">준비됨</span>
</div>
</div>

<div id="mapBox"><div id="map"></div></div>

<div class="panel">
<h2 style="margin-top:0">거래글 등록</h2>
<div class="row">
<select id="postCategory">
<option value="발생토">발생토</option>
<option value="사토장">사토장</option>
<option value="토취장">토취장</option>
<option value="성토재필요">성토재필요</option>
</select>
<input id="postTitle" placeholder="제목 예: A급 토사 반출" style="width:300px" />
<input id="postRegion" placeholder="지역 예: 양주 / 연천" />
<input id="postSoilType" placeholder="토질 예: 양질토" />
<input id="postQuantity" placeholder="물량 예: 500루베 / 25톤 20대" />
<input id="postContact" placeholder="연락처 또는 비공개" />
</div>
<br/>
<textarea id="postMemo" placeholder="메모: 출처, 반입/반출 조건, 특이사항" style="width:100%;height:72px"></textarea>
<br/><br/>
<button onclick="createSoilPost()" class="green">거래글 등록</button>
</div>

<table>
<thead>
<tr>
<th>번호</th><th>구분</th><th>회사명/제목</th><th>지역/주소</th><th>대표/담당</th><th>토질</th><th>물량/좌표</th><th>등록일</th>
</tr>
</thead>
<tbody id="rows"></tbody>
</table>
</div>

<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=a9ed4e2346ce8b1f27e13e75c0ad80a9&autoload=false"></script>
<script>
let allRows=[];
let currentMode='토석정보';
let map=null;
let markers=[];
let openedInfo=null;
let kakaoReady=false;

function cleanNum(v){
 if(v===null || v===undefined)return null;
 const n=Number(String(v).trim().replace(/,/g,''));
 return Number.isFinite(n)?n:null;
}

function onlyDate(v){return v?String(v).slice(0,10):''}

function badge(t){
 if(t==='사토장')return '<span class="badge b-dump">사토장</span>';
 if(t==='토취장')return '<span class="badge b-take">토취장</span>';
 if(t==='골재업체')return '<span class="badge b-gravel">골재업체</span>';
 if(t==='발생토')return '<span class="badge b-post">발생토</span>';
 if(t==='성토재필요')return '<span class="badge b-need">성토재필요</span>';
 return '<span class="badge">'+(t||'미분류')+'</span>';
}

function updateStats(){
 statTotal.innerText=allRows.length;
 statDump.innerText=allRows.filter(x=>x.type==='사토장').length;
 statTake.innerText=allRows.filter(x=>x.type==='토취장').length;
 statGravel.innerText=allRows.filter(x=>x.type==='골재업체').length;
 statPost.innerText=allRows.filter(x=>x.type==='발생토').length;
 statNeed.innerText=allRows.filter(x=>x.type==='성토재필요').length;
}

function handleFilterChange(){
 const f=filterType.value;

 if(f==='사토장' || f==='토취장' || f==='골재업체'){
  if(currentMode !== '토석정보'){
   loadSites(f);
   return;
  }
 }

 if(f==='발생토' || f==='성토재필요'){
  if(currentMode !== '거래글'){
   loadSoilPosts(f);
   return;
  }
 }

 renderTable();
}

function getFilteredRows(){
 const k=keyword.value.trim().toLowerCase();
 const f=filterType.value;

 return allRows.filter(r=>{
  const text=[r.type,r.name,r.addr,r.ownerName,r.managerName,r.soilType,r.quantity,r.memo].join(' ').toLowerCase();
  return (!k || text.includes(k)) && (f==='전체' || r.type===f);
 });
}

function renderTable(){
 const rows=getFilteredRows();

 document.getElementById('rows').innerHTML=rows.map((r,i)=>
 '<tr>'+
 '<td>'+(i+1)+'</td>'+
 '<td>'+badge(r.type)+'</td>'+
 '<td><div class="title">'+(r.name||'')+'</div><div class="small">'+(r.memo||'')+'</div></td>'+
 '<td>'+(r.addr||'')+'</td>'+
 '<td>'+(r.ownerName||'')+'<br/><span class="small">'+(r.managerName||'')+'</span></td>'+
 '<td>'+(r.soilType||'')+'</td>'+
 '<td>'+(r.quantity||'')+'</td>'+
 '<td>'+onlyDate(r.createdAt)+'</td>'+
 '</tr>'
 ).join('');

 status.innerText=currentMode+' · 검색결과 '+rows.length+'개';

 if(mapBox.style.display==='block'){
  drawMarkers(rows);
 }
}

async function loadSites(selectedType){
 currentMode='토석정보';
 status.innerText='토석정보 불러오는 중...';

 const res=await fetch('/tocycle/sites');
 const sites=await res.json();

 allRows=sites.map(s=>{
  const x=cleanNum(s.xpos);
  const y=cleanNum(s.ypos);

  return {
   type:s.siteType||'미분류',
   name:s.orgName||'',
   addr:s.addr||'',
   soilType:s.siteType||'',
   quantity:(x&&y)?y+', '+x:'',
   xpos:x,
   ypos:y,
   createdAt:'',
   ownerName:s.ownerName||'',
   managerName:s.managerName||'',
   memo:s.phone?'연락처: '+s.phone:''
  };
 });

 updateStats();

 if(selectedType){
  filterType.value=selectedType;
 }else{
  filterType.value='전체';
 }

 renderTable();

 if(mapBox.style.display==='block'){
  setTimeout(()=>drawMarkers(getFilteredRows()),300);
 }
}

async function syncSites(){
 status.innerText='토석정보 수집 중...';
 await fetch('/tocycle/sync');
 await loadSites();
}

async function loadSoilPosts(selectedType){
 currentMode='거래글';
 status.innerText='거래글 불러오는 중...';

 const res=await fetch('/soil-posts');
 const posts=await res.json();

 allRows=posts.map(p=>({
  type:p.category||'발생토',
  name:p.title||'',
  addr:p.region||'',
  soilType:p.soilType||'',
  quantity:p.quantity||'',
  xpos:null,
  ypos:null,
  createdAt:onlyDate(p.createdAt),
  ownerName:'',
  managerName:'',
  memo:p.contact?'연락처: '+p.contact+' / '+(p.memo||''):(p.memo||'')
 }));

 updateStats();

 if(selectedType){
  filterType.value=selectedType;
 }else{
  filterType.value='전체';
 }

 renderTable();
}

async function createSoilPost(){
 const title=postTitle.value.trim();
 const region=postRegion.value.trim();

 if(!title || !region){
  alert('제목과 지역은 필수입니다.');
  return;
 }

 status.innerText='거래글 등록 중...';

 const res=await fetch('/soil-posts',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
   category:postCategory.value,
   title:title,
   region:region,
   soilType:postSoilType.value.trim(),
   quantity:postQuantity.value.trim(),
   contact:postContact.value.trim(),
   memo:postMemo.value.trim()
  })
 });

 if(!res.ok){
  alert('거래글 등록 실패. soil-posts API 연결을 확인하세요.');
  status.innerText='거래글 등록 실패';
  return;
 }

 alert('거래글 등록 완료');

 const savedCategory=postCategory.value;

 postTitle.value='';
 postRegion.value='';
 postSoilType.value='';
 postQuantity.value='';
 postContact.value='';
 postMemo.value='';

 await loadSoilPosts(savedCategory);
}

function toggleMap(){
 const box=document.getElementById('mapBox');
 const btn=document.getElementById('mapToggleBtn');

 if(box.style.display==='block'){
  box.style.display='none';
  btn.innerText='지도보기';
  btn.className='gray';
  return;
 }

 box.style.display='block';
 btn.innerText='지도끄기';
 btn.className='red';
 status.innerText='지도 불러오는 중...';

 initKakaoMap();
}

function initKakaoMap(){
 if(typeof kakao==='undefined'){
  alert('카카오 지도 스크립트 로딩 실패');
  return;
 }

 kakao.maps.load(function(){
  kakaoReady=true;

  if(!map){
   const container=document.getElementById('map');

   map=new kakao.maps.Map(container,{
    center:new kakao.maps.LatLng(36.5,127.8),
    level:13
   });

   map.addControl(new kakao.maps.MapTypeControl(),kakao.maps.ControlPosition.TOPRIGHT);
   map.addControl(new kakao.maps.ZoomControl(),kakao.maps.ControlPosition.RIGHT);
  }

  setTimeout(function(){
   map.relayout();
   drawMarkers(getFilteredRows());
  },500);
 });
}

function drawMarkers(rows){
 if(!map || !kakaoReady)return;

 markers.forEach(m=>m.setMap(null));
 markers=[];

 if(openedInfo){
  openedInfo.close();
  openedInfo=null;
 }

 const bounds=new kakao.maps.LatLngBounds();
 let count=0;

 rows.forEach(r=>{
  let lat=cleanNum(r.ypos);
  let lng=cleanNum(r.xpos);

  if(lat===null || lng===null)return;

  if(lat > 100 && lng < 50){
   const temp=lat;
   lat=lng;
   lng=temp;
  }

  if(lat < 32 || lat > 39 || lng < 124 || lng > 132)return;

  const pos=new kakao.maps.LatLng(lat,lng);

  const marker=new kakao.maps.Marker({
   position:pos
  });

  marker.setMap(map);

  const info=new kakao.maps.InfoWindow({
   removable:true,
   content:
    '<div style="padding:12px;width:270px;font-size:13px;line-height:1.55;">'+
    '<b style="font-size:15px;">'+(r.name||'')+'</b><br/>'+
    '<span>구분: '+(r.type||'')+'</span><br/>'+
    '<span>주소: '+(r.addr||'')+'</span><br/>'+
    '<span>대표/담당: '+(r.ownerName||'')+' '+(r.managerName||'')+'</span><br/>'+
    '<span>좌표: '+lat+', '+lng+'</span>'+
    '</div>'
  });

  kakao.maps.event.addListener(marker,'click',function(){
   if(openedInfo)openedInfo.close();
   info.open(map,marker);
   openedInfo=info;
  });

  markers.push(marker);
  bounds.extend(pos);
  count++;
 });

 if(count > 1){
  map.setBounds(bounds);
 }else if(count === 1){
  map.setCenter(markers[0].getPosition());
  map.setLevel(5);
 }

 status.innerText=currentMode+' · 지도표시 '+count+'개';
}

loadSites();
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