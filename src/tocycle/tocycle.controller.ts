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
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>중기넷 토사거래 관리자</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;background:#f3f6fb;color:#111827}
header{background:linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb);color:white;padding:30px 36px;box-shadow:0 14px 35px rgba(15,23,42,.22)}
.header-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}
h1{margin:0;font-size:30px;letter-spacing:-.6px}.sub{margin-top:8px;color:#dbeafe;font-size:14px}
.brand-chip{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);padding:10px 14px;border-radius:999px;font-weight:800;white-space:nowrap}
.wrap{padding:24px 28px}.cards{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-bottom:16px}
.card,.panel,.table-wrap{background:white;border:1px solid #e5e7eb;border-radius:22px;box-shadow:0 14px 32px rgba(15,23,42,.07)}
.card{padding:18px}.card span{color:#64748b;font-size:13px;font-weight:700}.card b{display:block;font-size:30px;margin-top:8px}
.panel{padding:20px;margin-bottom:16px}.panel-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.panel-title h2{margin:0;font-size:22px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input,select,textarea{padding:13px 14px;border:1px solid #d1d5db;border-radius:13px;font-size:14px;background:white;outline:none}
input:focus,select:focus,textarea:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}
textarea{font-family:Arial,'Noto Sans KR',sans-serif;resize:vertical}
button{padding:13px 17px;border:0;border-radius:13px;background:#2563eb;color:white;font-weight:800;cursor:pointer;box-shadow:0 8px 18px rgba(37,99,235,.18)}
.green{background:#059669}.orange{background:#d97706}.gray{background:#334155}.red{background:#dc2626}.dark{background:#0f172a}
.status{margin-left:auto;background:#f1f5f9;color:#334155;padding:10px 13px;border-radius:999px;font-size:13px;font-weight:800}
.quick-tabs{display:flex;gap:8px;flex-wrap:wrap}.quick-tabs button{background:#f1f5f9;color:#334155;box-shadow:none;border:1px solid #e2e8f0}.quick-tabs button.active{background:#0f172a;color:white}
.notice{margin-top:14px;padding:13px 14px;background:#fff7d6;border:1px solid #fde68a;border-radius:14px;font-size:13px;line-height:1.55;color:#78350f}
#mapBox{display:none;margin-bottom:16px;background:white;padding:14px;border-radius:22px;border:1px solid #e5e7eb;box-shadow:0 14px 32px rgba(15,23,42,.07)}
#map{width:100%;height:540px;border-radius:18px}
.form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.form-grid-2{display:grid;grid-template-columns:1.2fr 1.6fr auto 1.2fr;gap:10px;margin-top:10px}.form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}
.photo-box{margin-top:12px;border:1px dashed #cbd5e1;border-radius:16px;padding:14px;background:#f8fafc}.photo-preview{margin-top:10px;display:none;max-width:260px;border-radius:14px;border:1px solid #e5e7eb}
.table-wrap{overflow:hidden}table{width:100%;border-collapse:separate;border-spacing:0}th,td{border-bottom:1px solid #e5e7eb;padding:13px;font-size:13px;vertical-align:top}th{background:#0f172a;color:white;position:sticky;top:0;z-index:2}tr:hover{background:#f8fafc}
.badge{padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900;display:inline-block;white-space:nowrap}.b-dump{background:#fee2e2;color:#991b1b}.b-take{background:#fef3c7;color:#92400e}.b-gravel{background:#dcfce7;color:#166534}.b-post{background:#dbeafe;color:#1d4ed8}.b-need{background:#ede9fe;color:#6d28d9}.b-public{background:#dcfce7;color:#166534}.b-user{background:#ffedd5;color:#9a3412}.b-soil-good{background:#dcfce7;color:#166534}.b-soil-bad{background:#fee2e2;color:#991b1b}.b-soil-masa{background:#e0f2fe;color:#075985}.b-soil-mix{background:#ffedd5;color:#9a3412}
.small{color:#64748b;font-size:12px;margin-top:5px;line-height:1.45}.title{font-weight:900;color:#0f172a}
.action-link,.mini-btn{display:inline-block;padding:7px 10px;border-radius:10px;text-decoration:none;color:white;font-weight:900;margin-top:7px;margin-right:5px;border:0;cursor:pointer;font-size:12px}
.call{background:#059669}.route{background:#2563eb}.detail{background:#0f172a}.private-note{color:#dc2626;font-weight:900}
#detailModal{display:none;position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;padding:30px;overflow:auto}
.modal-card{background:white;max-width:760px;margin:30px auto;border-radius:24px;padding:24px;box-shadow:0 25px 80px rgba(0,0,0,.25)}
.modal-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.modal-head h2{margin:0}.close-btn{background:#334155}
.detail-img{width:100%;max-height:360px;object-fit:cover;border-radius:18px;border:1px solid #e5e7eb;margin:14px 0}
.detail-grid{display:grid;grid-template-columns:140px 1fr;gap:10px;border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px}.detail-grid b{color:#475569}
@media(max-width:1100px){.cards{grid-template-columns:repeat(2,1fr)}.form-grid,.form-grid-2,.form-grid-3{grid-template-columns:1fr}.status{margin-left:0}input,select,textarea,button{width:100%}header{padding:24px 20px}.wrap{padding:18px}.detail-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
 <div class="header-top">
  <div>
   <h1>중기넷 토사거래 관리자</h1>
   <div class="sub">공공데이터는 정확 위치 · 사용자 등록글은 기본 읍면동 공개 · 거래/인허가는 당사자 확인</div>
  </div>
  <div class="brand-chip">TOCYCLE CONTROL</div>
 </div>
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
  <input id="keyword" placeholder="지역 · 회사명 · 구분 · 토질 검색" style="width:390px" oninput="renderTable()" />
  <select id="filterType" onchange="handleFilterChange()">
   <option value="전체">전체</option><option value="사토장">사토장</option><option value="토취장">토취장</option><option value="골재업체">골재업체</option><option value="발생토">발생토</option><option value="성토재필요">성토재필요</option>
  </select>
  <div class="quick-tabs">
   <button id="dateAll" class="active" onclick="setDateFilter('all')">전체</button>
   <button id="dateToday" onclick="setDateFilter('today')">오늘</button>
   <button id="date3" onclick="setDateFilter('3')">3일</button>
   <button id="date7" onclick="setDateFilter('7')">7일</button>
  </div>
  <button onclick="loadSites()">토석정보 목록</button>
  <button onclick="loadSoilPosts()" class="orange">거래글 목록</button>
  <button onclick="syncSites()" class="green">토석정보 수집</button>
  <button id="mapToggleBtn" onclick="toggleMap()" class="gray">지도보기</button>
  <span id="status" class="status">준비됨</span>
 </div>
</div>

<div id="mapBox"><div id="map"></div></div>

<div class="panel">
 <div class="panel-title"><h2>거래글 등록</h2><span class="small">현장용 간편 등록 · 기본값은 대략 위치 공개</span></div>
 <div class="form-grid">
  <select id="postCategory"><option value="발생토">발생토</option><option value="사토장">사토장</option><option value="토취장">토취장</option><option value="성토재필요">성토재필요</option></select>
  <select id="postVisibility"><option value="region">읍면동만 공개</option><option value="exact">정확한 위치 공개</option></select>
  <select id="postPermitStatus"><option value="미확인">허가/서류 미확인</option><option value="서류있음">서류 있음</option><option value="허가관련있음">허가 관련 있음</option></select>
 </div>
 <div class="form-grid-2">
  <input id="postTitle" placeholder="제목 예: A급 토사 반출" />
  <input id="postAddress" placeholder="주소 예: 화성시 우정읍" />
  <button onclick="searchAddress()" class="dark">주소검색</button>
  <input id="postRegion" placeholder="공개지역 예: 화성시 우정읍" />
 </div>
 <div class="form-grid-3">
  <input id="postSoilType" placeholder="토질 예: 양질토 / 불량토 / 마사토" />
  <input id="postQuantity" placeholder="물량 예: 500루베 / 25톤 20대" />
  <input id="postContact" placeholder="연락처 예: 010-1234-5678" oninput="formatPhone(this)" maxlength="13" />
 </div>
 <div class="photo-box">
  <b>사진 등록</b><div class="small">흙 상태, 진입로, 현장 사진을 올리면 신뢰도가 올라갑니다.</div>
  <input id="postImage" type="file" accept="image/*" onchange="previewImage(event)" style="margin-top:10px" />
  <img id="imagePreview" class="photo-preview" />
 </div>
 <br/>
 <textarea id="postMemo" placeholder="메모: 반입/반출 조건, 우천시 가능 여부, 사토비, 서류 필요 여부 등" style="width:100%;height:78px"></textarea>
 <input id="postLat" type="hidden" /><input id="postLng" type="hidden" /><input id="postImageData" type="hidden" />
 <div class="notice">등록자 제공 정보입니다. 중기넷은 정보공유 플랫폼이며 거래 및 인허가 여부는 이용자가 직접 확인하시기 바랍니다. 사용자 등록글은 기본적으로 읍면동만 공개됩니다.</div>
 <br/><button onclick="createSoilPost()" class="green">거래글 등록</button>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>번호</th><th>구분</th><th>출처</th><th>사진</th><th>회사명/제목</th><th>지역/주소</th><th>담당</th><th>토질</th><th>물량</th><th>액션</th><th>등록일</th></tr></thead>
<tbody id="rows"></tbody>
</table>
</div>
</div>

<div id="detailModal">
 <div class="modal-card">
  <div class="modal-head">
   <div><h2 id="detailTitle"></h2><div id="detailSub" class="small"></div></div>
   <button onclick="closeDetail()" class="close-btn">닫기</button>
  </div>
  <div id="detailImage"></div>
  <div class="detail-grid" id="detailBody"></div>
  <div id="detailActions" style="margin-top:16px"></div>
  <div class="notice">등록자 제공 정보입니다. 중기넷은 정보공유 플랫폼이며 거래 및 인허가 여부는 이용자가 직접 확인하시기 바랍니다.</div>
 </div>
</div>

<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=a9ed4e2346ce8b1f27e13e75c0ad80a9&autoload=false&libraries=services"></script>
<script>
let allRows=[];let currentMode='토석정보';let dateFilter='all';let map=null;let markers=[];let openedInfo=null;let kakaoReady=false;let geocoder=null;let visibleRows=[];

function cleanNum(v){if(v===null||v===undefined)return null;const n=Number(String(v).trim().replace(/,/g,''));return Number.isFinite(n)?n:null}
function formatPhone(input){let v=input.value.replace(/[^0-9]/g,'');if(v.length<4){input.value=v}else if(v.length<8){input.value=v.slice(0,3)+'-'+v.slice(3)}else{input.value=v.slice(0,3)+'-'+v.slice(3,7)+'-'+v.slice(7,11)}}
function onlyDate(v){return v?String(v).slice(0,10):''}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,function(m){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m]})}
function badge(t){if(t==='사토장')return '<span class="badge b-dump">사토장</span>';if(t==='토취장')return '<span class="badge b-take">토취장</span>';if(t==='골재업체')return '<span class="badge b-gravel">골재업체</span>';if(t==='발생토')return '<span class="badge b-post">발생토</span>';if(t==='성토재필요')return '<span class="badge b-need">성토재필요</span>';return '<span class="badge">'+escapeHtml(t||'미분류')+'</span>'}
function sourceBadge(s){return s==='public'?'<span class="badge b-public">공공데이터</span>':'<span class="badge b-user">사용자등록</span>'}
function soilBadge(v){const s=String(v||'');if(!s)return '';if(s.includes('양질'))return '<span class="badge b-soil-good">'+escapeHtml(s)+'</span>';if(s.includes('불량')||s.includes('폐토'))return '<span class="badge b-soil-bad">'+escapeHtml(s)+'</span>';if(s.includes('마사'))return '<span class="badge b-soil-masa">'+escapeHtml(s)+'</span>';if(s.includes('혼합')||s.includes('다짐'))return '<span class="badge b-soil-mix">'+escapeHtml(s)+'</span>';return escapeHtml(s)}
function updateStats(){statTotal.innerText=allRows.length;statDump.innerText=allRows.filter(x=>x.type==='사토장').length;statTake.innerText=allRows.filter(x=>x.type==='토취장').length;statGravel.innerText=allRows.filter(x=>x.type==='골재업체').length;statPost.innerText=allRows.filter(x=>x.type==='발생토').length;statNeed.innerText=allRows.filter(x=>x.type==='성토재필요').length}
function setDateFilter(v){dateFilter=v;['dateAll','dateToday','date3','date7'].forEach(id=>document.getElementById(id).classList.remove('active'));if(v==='all')dateAll.classList.add('active');if(v==='today')dateToday.classList.add('active');if(v==='3')date3.classList.add('active');if(v==='7')date7.classList.add('active');renderTable()}
function handleFilterChange(){const f=filterType.value;if((f==='사토장'||f==='토취장'||f==='골재업체')&&currentMode!=='토석정보'){loadSites(f);return}if((f==='발생토'||f==='성토재필요')&&currentMode!=='거래글'){loadSoilPosts(f);return}renderTable()}
function passDateFilter(r){if(dateFilter==='all')return true;if(!r.createdAt)return true;const d=new Date(r.createdAt);if(isNaN(d.getTime()))return true;const now=new Date();const diff=(now.getTime()-d.getTime())/(1000*60*60*24);if(dateFilter==='today')return onlyDate(r.createdAt)===onlyDate(now.toISOString());return diff<=Number(dateFilter)}
function getFilteredRows(){const k=keyword.value.trim().toLowerCase();const f=filterType.value;return allRows.filter(r=>{const text=[r.type,r.name,r.addr,r.ownerName,r.managerName,r.soilType,r.quantity,r.memo,r.source,r.permitStatus].join(' ').toLowerCase();return(!k||text.includes(k))&&(f==='전체'||r.type===f)&&passDateFilter(r)})}
function thumb(img){if(!img)return '<span class="small">없음</span>';return '<img src="'+img+'" style="width:62px;height:46px;object-fit:cover;border-radius:10px;border:1px solid #e5e7eb" />'}
function phoneButton(contact){const c=String(contact||'').replace(/[^0-9]/g,'');if(!c)return '';return '<a href="tel:'+c+'" class="action-link call">전화하기</a>'}
function routeButton(lat,lng,label,isApprox){if(!lat||!lng)return '';return '<a target="_blank" href="https://map.kakao.com/link/to/'+encodeURIComponent(label||'목적지')+','+lat+','+lng+'" class="action-link route">'+(isApprox?'대략길찾기':'길찾기')+'</a>'}

function rowActions(r,i){
 const lat=cleanNum(r.ypos),lng=cleanNum(r.xpos);
 const isApprox=r.source==='user'&&r.visibility!=='exact';
 return phoneButton(r.contact)+routeButton(lat,lng,r.name,isApprox)+'<button class="mini-btn detail" onclick="showDetail('+i+')">상세보기</button>';
}

function renderTable(){
 visibleRows=getFilteredRows();
 document.getElementById('rows').innerHTML=visibleRows.map((r,i)=>
 '<tr>'+
 '<td>'+(i+1)+'</td><td>'+badge(r.type)+'</td><td>'+sourceBadge(r.source)+'</td><td>'+thumb(r.imageData)+'</td>'+
 '<td><div class="title">'+escapeHtml(r.name||'')+'</div><div class="small">'+escapeHtml(r.memo||'')+'</div></td>'+
 '<td>'+escapeHtml(r.addr||'')+'</td><td>'+escapeHtml(r.ownerName||'')+'<br/><span class="small">'+escapeHtml(r.managerName||'')+'</span></td>'+
 '<td>'+soilBadge(r.soilType||'')+'</td><td>'+escapeHtml(r.quantity||'')+'</td><td>'+rowActions(r,i)+'</td><td>'+onlyDate(r.createdAt)+'</td>'+
 '</tr>').join('');
 status.innerText=currentMode+' · 검색결과 '+visibleRows.length+'개';
 if(mapBox.style.display==='block')drawMarkers(visibleRows);
}

async function loadSites(selectedType){currentMode='토석정보';status.innerText='토석정보 불러오는 중...';const res=await fetch('/tocycle/sites');const sites=await res.json();allRows=sites.map(s=>{const x=cleanNum(s.xpos),y=cleanNum(s.ypos);return{type:s.siteType||'미분류',name:s.orgName||'',addr:s.addr||'',soilType:s.siteType||'',quantity:(x&&y)?y+', '+x:'',xpos:x,ypos:y,createdAt:'',ownerName:s.ownerName||'',managerName:s.managerName||'',contact:s.phone||'',memo:s.phone?'연락처: '+s.phone:'',source:'public',visibility:'exact',permitStatus:'공공데이터',imageData:''}});updateStats();filterType.value=selectedType||'전체';renderTable();if(mapBox.style.display==='block')setTimeout(()=>drawMarkers(getFilteredRows()),300)}
async function syncSites(){status.innerText='토석정보 수집 중...';await fetch('/tocycle/sync');await loadSites()}
async function loadSoilPosts(selectedType){currentMode='거래글';status.innerText='거래글 불러오는 중...';const res=await fetch('/soil-posts');const posts=await res.json();allRows=posts.map(p=>({type:p.category||'발생토',name:p.title||'',addr:p.visibility==='exact'?(p.address||p.region||''):(p.displayRegion||p.region||''),soilType:p.soilType||'',quantity:p.quantity||'',xpos:p.longitude||null,ypos:p.latitude||null,createdAt:p.createdAt||'',ownerName:'',managerName:p.contact||'',contact:p.contact||'',memo:(p.permitStatus?'['+p.permitStatus+'] ':'')+(p.memo||''),source:'user',visibility:p.visibility||'region',permitStatus:p.permitStatus||'미확인',imageData:p.imageData||''}));updateStats();filterType.value=selectedType||'전체';renderTable()}
function ensureMapReady(callback){if(typeof kakao==='undefined'){alert('카카오 지도 스크립트 로딩 실패');return}kakao.maps.load(function(){kakaoReady=true;if(!geocoder)geocoder=new kakao.maps.services.Geocoder();if(callback)callback()})}
function makeDisplayRegion(address){const parts=String(address||'').trim().split(/\\s+/);if(parts.length>=3)return parts.slice(0,3).join(' ');if(parts.length>=2)return parts.slice(0,2).join(' ');return address}
function searchAddress(){const address=postAddress.value.trim();if(!address){alert('주소를 입력하세요.');return}status.innerText='주소 검색 중...';ensureMapReady(function(){geocoder.addressSearch(address,function(result,statusCode){if(statusCode===kakao.maps.services.Status.OK&&result.length>0){const item=result[0];const display=postRegion.value.trim()||makeDisplayRegion(item.address_name||address);postRegion.value=display;const targetAddress=postVisibility.value==='region'?display:(item.address_name||address);geocoder.addressSearch(targetAddress,function(r2,s2){const finalItem=(s2===kakao.maps.services.Status.OK&&r2.length>0)?r2[0]:item;postLat.value=finalItem.y;postLng.value=finalItem.x;status.innerText='주소검색 완료: '+postRegion.value;if(mapBox.style.display!=='block')toggleMap();setTimeout(function(){const pos=new kakao.maps.LatLng(Number(finalItem.y),Number(finalItem.x));map.setCenter(pos);map.setLevel(5)},600)})}else{alert('주소를 찾지 못했습니다. 예: 화성시 우정읍 처럼 입력해보세요.');status.innerText='주소검색 실패'}})})}
function previewImage(event){const file=event.target.files&&event.target.files[0];if(!file)return;if(file.size>700000)alert('사진 용량이 큽니다. 가능하면 캡처/압축된 사진을 사용하세요.');const reader=new FileReader();reader.onload=function(e){postImageData.value=e.target.result;imagePreview.src=e.target.result;imagePreview.style.display='block'};reader.readAsDataURL(file)}
async function createSoilPost(){const title=postTitle.value.trim();const address=postAddress.value.trim();const region=postRegion.value.trim()||makeDisplayRegion(address);if(!title||!region){alert('제목과 공개지역은 필수입니다.');return}status.innerText='거래글 등록 중...';const res=await fetch('/soil-posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:postCategory.value,title,region,address,displayRegion:region,visibility:postVisibility.value,latitude:postLat.value,longitude:postLng.value,soilType:postSoilType.value.trim(),quantity:postQuantity.value.trim(),contact:postContact.value.trim(),permitStatus:postPermitStatus.value,memo:postMemo.value.trim(),imageData:postImageData.value})});if(!res.ok){alert('거래글 등록 실패. soil-posts API 연결을 확인하세요.');status.innerText='거래글 등록 실패';return}alert('거래글 등록 완료');const savedCategory=postCategory.value;postTitle.value='';postAddress.value='';postRegion.value='';postLat.value='';postLng.value='';postSoilType.value='';postQuantity.value='';postContact.value='';postMemo.value='';postImage.value='';postImageData.value='';imagePreview.src='';imagePreview.style.display='none';postVisibility.value='region';postPermitStatus.value='미확인';await loadSoilPosts(savedCategory)}
function toggleMap(){const box=document.getElementById('mapBox');const btn=document.getElementById('mapToggleBtn');if(box.style.display==='block'){box.style.display='none';btn.innerText='지도보기';btn.className='gray';return}box.style.display='block';btn.innerText='지도끄기';btn.className='red';status.innerText='지도 불러오는 중...';initKakaoMap()}
function initKakaoMap(){ensureMapReady(function(){if(!map){const container=document.getElementById('map');map=new kakao.maps.Map(container,{center:new kakao.maps.LatLng(36.5,127.8),level:13});map.addControl(new kakao.maps.MapTypeControl(),kakao.maps.ControlPosition.TOPRIGHT);map.addControl(new kakao.maps.ZoomControl(),kakao.maps.ControlPosition.RIGHT)}setTimeout(function(){map.relayout();drawMarkers(getFilteredRows())},500)})}
function markerImage(type,source){let color='2563eb';if(source==='public')color='16a34a';if(type==='발생토')color='2563eb';if(type==='사토장')color='dc2626';if(type==='토취장')color='d97706';if(type==='골재업체')color='16a34a';if(type==='성토재필요')color='7c3aed';const svg='<svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42"><path fill="%23'+color+'" d="M18 0C8.1 0 0 8.1 0 18c0 13.5 18 24 18 24s18-10.5 18-24C36 8.1 27.9 0 18 0z"/><circle cx="18" cy="18" r="7" fill="white"/></svg>';return new kakao.maps.MarkerImage('data:image/svg+xml;charset=UTF-8,'+svg,new kakao.maps.Size(36,42),{offset:new kakao.maps.Point(18,42)})}
function drawMarkers(rows){if(!map||!kakaoReady)return;markers.forEach(m=>m.setMap(null));markers=[];if(openedInfo){openedInfo.close();openedInfo=null}const bounds=new kakao.maps.LatLngBounds();let count=0;rows.forEach(r=>{let lat=cleanNum(r.ypos),lng=cleanNum(r.xpos);if(lat===null||lng===null)return;if(lat>100&&lng<50){const temp=lat;lat=lng;lng=temp}if(lat<32||lat>39||lng<124||lng>132)return;const pos=new kakao.maps.LatLng(lat,lng);const marker=new kakao.maps.Marker({position:pos,image:markerImage(r.type,r.source)});marker.setMap(map);const isUser=r.source==='user';const isRegionOnly=isUser&&r.visibility!=='exact';const img=r.imageData?'<img src="'+r.imageData+'" style="width:100%;max-height:150px;object-fit:cover;border-radius:12px;margin:8px 0;border:1px solid #e5e7eb" />':'';const addressLine=isRegionOnly?'<span>공개지역: '+escapeHtml(r.addr||'')+'</span><br/><span class="private-note">상세위치 비공개 · 전화문의</span><br/>':'<span>주소: '+escapeHtml(r.addr||'')+'</span><br/>';const legal=isUser?'<div style="margin-top:8px;padding:8px;background:#fff7d6;border:1px solid #fde68a;border-radius:10px;font-size:12px;color:#78350f;">등록자 제공 정보입니다. 거래 및 인허가 여부는 이용자가 직접 확인하세요.</div>':'<div style="margin-top:8px;padding:8px;background:#dcfce7;border-radius:10px;font-size:12px;color:#166534;">공공데이터 기반 정보입니다.</div>';const buttons=phoneButton(r.contact)+routeButton(lat,lng,r.name,isRegionOnly);const info=new kakao.maps.InfoWindow({removable:true,content:'<div style="padding:14px;width:310px;font-size:13px;line-height:1.6;"><b style="font-size:16px;color:#0f172a;">'+escapeHtml(r.name||'')+'</b><br/>'+img+'<span>구분: '+escapeHtml(r.type||'')+'</span><br/><span>출처: '+(r.source==='public'?'공공데이터':'사용자등록')+'</span><br/><span>서류/허가: '+escapeHtml(r.permitStatus||'')+'</span><br/>'+addressLine+'<span>토질: '+escapeHtml(r.soilType||'')+'</span><br/><span>물량: '+escapeHtml(r.quantity||'')+'</span><br/>'+buttons+legal+'</div>'});kakao.maps.event.addListener(marker,'click',function(){if(openedInfo)openedInfo.close();info.open(map,marker);openedInfo=info});markers.push(marker);bounds.extend(pos);count++});if(count>1)map.setBounds(bounds);else if(count===1){map.setCenter(markers[0].getPosition());map.setLevel(5)}status.innerText=currentMode+' · 지도표시 '+count+'개'}
function showDetail(i){const r=visibleRows[i];if(!r)return;const lat=cleanNum(r.ypos),lng=cleanNum(r.xpos);const isApprox=r.source==='user'&&r.visibility!=='exact';detailTitle.innerText=r.name||'';detailSub.innerText=(r.type||'')+' · '+(r.source==='public'?'공공데이터':'사용자등록');detailImage.innerHTML=r.imageData?'<img class="detail-img" src="'+r.imageData+'" />':'<div class="small" style="margin:14px 0">등록된 사진 없음</div>';detailBody.innerHTML='<b>지역/주소</b><div>'+escapeHtml(r.addr||'')+(isApprox?' <span class="private-note">상세위치 비공개</span>':'')+'</div><b>연락처</b><div>'+escapeHtml(r.contact||'')+'</div><b>토질</b><div>'+escapeHtml(r.soilType||'')+'</div><b>물량</b><div>'+escapeHtml(r.quantity||'')+'</div><b>서류/허가</b><div>'+escapeHtml(r.permitStatus||'')+'</div><b>메모</b><div>'+escapeHtml(r.memo||'')+'</div>';detailActions.innerHTML=phoneButton(r.contact)+routeButton(lat,lng,r.name,isApprox);detailModal.style.display='block'}
function closeDetail(){detailModal.style.display='none'}
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