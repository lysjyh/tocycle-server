import { Body, Controller, Get, Post } from '@nestjs/common';
import { TocycleService } from './tocycle.service';

@Controller('tocycle')
export class TocycleController {
  constructor(private readonly tocycleService: TocycleService) {}

  @Get()
  home() {
    return this.renderPage(false);
  }

  @Get('admin')
  adminLogin() {
    return this.renderAdminLogin(false);
  }

  @Post('admin')
  adminSubmit(@Body('password') password: string) {
    if (String(password || '') === '8904') {
      return this.renderPage(true);
    }

    return this.renderAdminLogin(true);
  }

  private renderAdminLogin(hasError: boolean) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>관리자 로그인</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;background:#f3f6fb;color:#111827;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:430px;background:white;border:1px solid #e5e7eb;border-radius:24px;padding:30px;box-shadow:0 24px 70px rgba(15,23,42,.18);text-align:center}
h1{margin:0 0 10px;font-size:26px;color:#0f172a}
p{margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.5}
input{width:100%;padding:14px;border:1px solid #d1d5db;border-radius:13px;text-align:center;font-size:22px;font-weight:900;letter-spacing:6px;margin-bottom:12px;outline:none}
input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}
button{width:100%;padding:14px 17px;border:0;border-radius:13px;background:#0f172a;color:white;font-weight:900;cursor:pointer;box-shadow:0 8px 18px rgba(15,23,42,.18)}
.err{display:${hasError ? 'block' : 'none'};color:#dc2626;font-size:13px;font-weight:900;margin:12px 0 0}
a{display:inline-block;margin-top:16px;color:#2563eb;text-decoration:none;font-weight:900;font-size:13px}
</style>
</head>
<body>
  <form class="card" method="POST" action="/tocycle/admin">
    <h1>관리자 로그인</h1>
    <p>관리자 비밀번호를 입력하세요.<br/>나갔다가 다시 들어오면 다시 입력해야 합니다.</p>
    <input name="password" type="password" placeholder="비밀번호" autocomplete="off" autofocus />
    <button type="submit">관리자 접속</button>
    <div class="err">비밀번호가 틀렸습니다.</div>
    <a href="/tocycle">일반 화면으로 이동</a>
  </form>
</body>
</html>`;
  }

  private renderPage(isAdmin: boolean) {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>중기넷 토사거래</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;background:#f3f6fb;color:#111827}
header{background:linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb);color:white;padding:30px 36px;box-shadow:0 14px 35px rgba(15,23,42,.22)}
.header-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}
h1{margin:0;font-size:30px;letter-spacing:-.6px}.sub{margin-top:8px;color:#dbeafe;font-size:14px}
.brand-chip{background:#facc15;color:#111827;border:1px solid #eab308;padding:10px 14px;border-radius:999px;font-weight:900;white-space:nowrap;text-decoration:none;box-shadow:0 8px 18px rgba(250,204,21,.22)}
.wrap{padding:24px 28px}.cards{display:grid;grid-template-columns:repeat(9,1fr);gap:14px;margin-bottom:16px}
.card,.panel,.table-wrap{background:white;border:1px solid #e5e7eb;border-radius:22px;box-shadow:0 14px 32px rgba(15,23,42,.07)}
.card{padding:18px}.card span{color:#64748b;font-size:13px;font-weight:700}.card b{display:block;font-size:30px;margin-top:8px}
.panel{padding:20px;margin-bottom:16px}.panel-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.panel-title h2{margin:0;font-size:22px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
input,select,textarea{padding:13px 14px;border:1px solid #d1d5db;border-radius:13px;font-size:14px;background:white;outline:none}
input:focus,select:focus,textarea:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}
textarea{font-family:Arial,'Noto Sans KR',sans-serif;resize:vertical}
button{padding:13px 17px;border:0;border-radius:13px;background:#2563eb;color:white;font-weight:800;cursor:pointer;box-shadow:0 8px 18px rgba(37,99,235,.18)}
.green{background:#059669}.orange{background:#d97706}.gray{background:#334155}.red{background:#dc2626}.dark{background:#0f172a}.purple{background:#7c3aed}
.status{margin-left:auto;background:#f1f5f9;color:#334155;padding:10px 13px;border-radius:999px;font-size:13px;font-weight:800}
.quick-tabs{display:flex;gap:8px;flex-wrap:wrap}.quick-tabs button{background:#f1f5f9;color:#334155;box-shadow:none;border:1px solid #e2e8f0}.quick-tabs button.active{background:#0f172a;color:white}
.notice{margin-top:14px;padding:13px 14px;background:#fff7d6;border:1px solid #fde68a;border-radius:14px;font-size:13px;line-height:1.55;color:#78350f}
#mapBox{display:none;margin-bottom:16px;background:white;padding:14px;border-radius:22px;border:1px solid #e5e7eb;box-shadow:0 14px 32px rgba(15,23,42,.07)}
#map{width:100%;height:540px;border-radius:18px}
.form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}.form-grid-2{display:grid;grid-template-columns:1.7fr auto;gap:10px;margin-top:10px}.form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}
.photo-box{margin-top:12px;border:1px dashed #cbd5e1;border-radius:16px;padding:14px;background:#f8fafc}.photo-preview{margin-top:10px;display:none;max-width:260px;border-radius:14px;border:1px solid #e5e7eb}
.table-wrap{overflow:hidden}table{width:100%;border-collapse:separate;border-spacing:0}th,td{border-bottom:1px solid #e5e7eb;padding:13px;font-size:13px;vertical-align:top}th{background:#0f172a;color:white;position:sticky;top:0;z-index:2}tr:hover{background:#f8fafc}
.badge{padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900;display:inline-block;white-space:nowrap}.b-dump{background:#fee2e2;color:#991b1b}.b-take{background:#fef3c7;color:#92400e}.b-gravel{background:#dcfce7;color:#166534}.b-post{background:#dbeafe;color:#1d4ed8}.b-need{background:#ede9fe;color:#6d28d9}.b-dumpjob{background:#cffafe;color:#155e75}.b-excavator{background:#ede9fe;color:#5b21b6}.b-driver{background:#e0f2fe;color:#075985}.b-public{background:#dcfce7;color:#166534}.b-user{background:#ffedd5;color:#9a3412}.b-soil-good{background:#dcfce7;color:#166534}.b-soil-bad{background:#fee2e2;color:#991b1b}.b-soil-masa{background:#e0f2fe;color:#075985}.b-soil-mix{background:#ffedd5;color:#9a3412}.b-open{background:#dcfce7;color:#166534}.b-done{background:#e5e7eb;color:#374151}.b-hold{background:#fef3c7;color:#92400e}.b-closed{background:#fee2e2;color:#991b1b}
.small{color:#64748b;font-size:12px;margin-top:5px;line-height:1.45}.title{font-weight:900;color:#0f172a}
.action-link,.mini-btn{
 display:inline-flex;
 align-items:center;
 justify-content:center;
 padding:6px 9px;
 border-radius:9px;
 text-decoration:none;
 color:white;
 font-weight:900;
 margin:0 4px 0 0;
 border:0;
 cursor:pointer;
 font-size:12px;
 line-height:1;
 white-space:nowrap;
}
td:nth-child(11){
 white-space:nowrap;
 min-width:190px;
}
.call{background:#059669}.route{background:#2563eb}.kakao{background:#facc15;color:#111827}.detail{background:#0f172a}.edit{background:#7c3aed}.complete{background:#0891b2}.hide{background:#d97706}.delete{background:#dc2626}.private-note{color:#dc2626;font-weight:900}
#detailModal,#editModal{display:none;position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;padding:30px;overflow:auto}
.modal-card{background:white;max-width:760px;margin:30px auto;border-radius:24px;padding:24px;box-shadow:0 25px 80px rgba(0,0,0,.25)}
.modal-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.modal-head h2{margin:0}.close-btn{background:#334155}
.detail-img{width:100%;max-height:360px;object-fit:cover;border-radius:18px;border:1px solid #e5e7eb;margin:14px 0}
.detail-grid{display:grid;grid-template-columns:140px 1fr;gap:10px;border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px}.detail-grid b{color:#475569}
#adminLoginGate{display:none;position:fixed;inset:0;background:#f3f6fb;z-index:20000;align-items:center;justify-content:center;padding:24px}
.admin-login-card{width:100%;max-width:430px;background:white;border:1px solid #e5e7eb;border-radius:24px;padding:30px;box-shadow:0 24px 70px rgba(15,23,42,.18);text-align:center}
.admin-login-card h2{margin:0 0 10px;font-size:26px;color:#0f172a}.admin-login-card p{margin:0 0 18px;color:#64748b;font-size:14px;line-height:1.5}
.admin-login-card input{width:100%;text-align:center;font-size:22px;font-weight:900;letter-spacing:6px;margin-bottom:12px}.admin-login-card button{width:100%;margin-top:4px}.admin-login-error{display:none;color:#dc2626;font-size:13px;font-weight:900;margin-top:12px}
.admin-login-links{margin-top:16px}.admin-login-links a{color:#2563eb;text-decoration:none;font-weight:900;font-size:13px}
@media(max-width:1100px){.cards{grid-template-columns:repeat(2,1fr)}.form-grid,.form-grid-2,.form-grid-3{grid-template-columns:1fr}.status{margin-left:0}input,select,textarea,button{width:100%}header{padding:24px 20px}.wrap{padding:18px}.detail-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<div id="adminLoginGate">
  <div class="admin-login-card">
    <h2>관리자 로그인</h2>
    <p>관리자 비밀번호를 입력하세요.<br/>이 화면을 나갔다가 다시 들어오면 다시 입력해야 합니다.</p>
    <input id="adminPassword" type="password" placeholder="비밀번호" autocomplete="off" onkeydown="if(event.key==='Enter')adminLogin()" />
    <button onclick="adminLogin()" class="dark">관리자 접속</button>
    <div id="adminLoginError" class="admin-login-error">비밀번호가 틀렸습니다.</div>
    <div class="admin-login-links"><a href="/tocycle">일반 화면으로 이동</a></div>
  </div>
</div>
<header><div class="header-top"><div><h1 id="pageTitle">중기넷 토사거래</h1><div class="sub">공공데이터는 정확 위치 · 사용자 등록글은 기본 읍면동 공개 · 거래/인허가는 당사자 확인</div></div><a class="brand-chip" href="https://open.kakao.com/o/g5NbSfph" target="_blank">오픈톡 문의/제보</a></div></header>

<div class="wrap">
<div class="cards">
<div class="card"><span>전체</span><b id="statTotal">0</b></div><div class="card"><span>사토장</span><b id="statDump">0</b></div><div class="card"><span>토취장</span><b id="statTake">0</b></div><div class="card"><span>골재업체</span><b id="statGravel">0</b></div><div class="card"><span>발생토</span><b id="statPost">0</b></div><div class="card"><span>성토재필요</span><b id="statNeed">0</b></div><div class="card"><span>덤프 모집</span><b id="statDumpJob">0</b></div><div class="card"><span>굴삭기 모집</span><b id="statExcavator">0</b></div><div class="card"><span>기사 구함</span><b id="statDriver">0</b></div>
</div>

<div class="panel"><div class="row">
<input id="keyword" placeholder="지역 · 회사명 · 구분 · 토질 검색" style="width:390px" oninput="renderTable()" />
<select id="filterType" onchange="handleFilterChange()"><option value="전체">전체</option><option value="사토장">사토장</option><option value="토취장">토취장</option><option value="골재업체">골재업체</option><option value="발생토">발생토</option><option value="성토재필요">성토재필요</option><option value="덤프 모집">덤프 모집</option><option value="굴삭기 모집">굴삭기 모집</option><option value="기사 구함">기사 구함</option></select>
<select id="dealFilter" onchange="renderTable()"><option value="전체">상태 전체</option><option value="모집중">모집중만</option><option value="완료">완료</option><option value="마감">마감</option><option value="보류">보류</option></select>
<div class="quick-tabs"><button id="dateAll" class="active" onclick="setDateFilter('all')">전체</button><button id="dateToday" onclick="setDateFilter('today')">오늘</button><button id="date3" onclick="setDateFilter('3')">3일</button><button id="date7" onclick="setDateFilter('7')">7일</button></div>
<button onclick="loadSites()">토석정보 목록</button><button onclick="loadSoilPosts()" class="orange">거래글 목록</button><button onclick="loadDispatchPosts()" class="purple">장비 배차</button><a href="https://open.kakao.com/o/g5NbSfph" target="_blank" class="action-link kakao" style="padding:13px 17px">오픈톡 문의/제보</a><button id="adminSyncBtn" onclick="syncSites()" class="green" style="display:none">토석정보 수집</button><button id="adminHiddenBtn" onclick="loadHiddenPosts()" class="purple" style="display:none">숨김 목록</button><button id="mapToggleBtn" onclick="toggleMap()" class="gray">지도보기</button><span id="status" class="status">준비됨</span>
</div></div>

<div id="mapBox"><div id="map"></div></div>

<div class="panel">
<div class="panel-title"><h2>장비 배차 등록 바로선택</h2><span class="small">아래 버튼을 누르면 거래글 등록란이 장비배차용으로 바뀝니다.</span></div>
<div class="row">
<button onclick="setDispatchCategory('덤프 모집')" class="purple">덤프 모집 입력</button>
<button onclick="setDispatchCategory('굴삭기 모집')" class="purple">굴삭기 모집 입력</button>
<button onclick="setDispatchCategory('기사 구함')" class="purple">기사 구함 입력</button>
<span class="small">주소검색 후 제목/장비/수량/단가/결제조건/연락처를 입력하면 지도와 목록에 같이 표시됩니다.</span>
</div>
</div>

<div class="panel">
<div class="panel-title"><h2>거래글 등록</h2><span class="small">주소는 1개만 입력 · 공개범위에 따라 자동 노출</span></div>
<div class="form-grid">
<select id="postCategory" onchange="applyCategoryTemplate()"><option value="발생토">발생토</option><option value="사토장">사토장</option><option value="토취장">토취장</option><option value="성토재필요">성토재필요</option><option value="덤프 모집">덤프 모집</option><option value="굴삭기 모집">굴삭기 모집</option><option value="기사 구함">기사 구함</option></select>
<select id="postVisibility"><option value="region">읍면동만 공개</option><option value="exact">정확한 위치 공개</option></select>
<select id="postPermitStatus"><option value="미확인">허가/서류 미확인</option><option value="서류있음">서류 있음</option><option value="허가관련있음">허가 관련 있음</option></select>
<select id="postDealStatus"><option value="모집중">모집중</option><option value="완료">완료</option><option value="마감">마감</option><option value="보류">보류</option></select>
</div>
<div class="form-grid-2"><input id="postAddress" placeholder="주소 예: 경기 안성시 양성면" /><button onclick="searchAddress()" class="dark">주소검색</button></div>
<div class="form-grid-3"><input id="postTitle" placeholder="제목 예: A급 토사 반출" /><input id="postSoilType" placeholder="토질 예: 양질토 / 불량토 / 마사토" /><input id="postQuantity" placeholder="물량 예: 500루베 / 25톤 20대" /></div>
<div class="form-grid-3"><input id="postContact" placeholder="연락처 예: 010-1234-5678" oninput="formatPhone(this)" maxlength="13" /></div>
<input id="postDisplayRegion" type="hidden" /><input id="postCoordText" type="hidden" />
<div class="photo-box"><b>사진 등록</b><div class="small">흙 상태, 진입로, 현장 사진을 올리면 신뢰도가 올라갑니다.</div><input id="postImage" type="file" accept="image/*" onchange="previewImage(event)" style="margin-top:10px" /><img id="imagePreview" class="photo-preview" /></div>
<br/><textarea id="postMemo" placeholder="메모: 반입/반출 조건, 우천시 가능 여부, 사토비, 서류 필요 여부 등" style="width:100%;height:78px"></textarea>
<input id="postLat" type="hidden" /><input id="postLng" type="hidden" /><input id="postImageData" type="hidden" />
<div class="notice">등록자 제공 정보입니다. 중기넷은 정보공유 플랫폼이며 거래 및 인허가 여부는 이용자가 직접 확인하시기 바랍니다. 사용자 등록글은 기본적으로 읍면동만 공개됩니다. 스팸·광고·불법성 문구는 자동 차단되거나 숨김 처리됩니다. 문의/제보는 오픈카카오톡으로 가능합니다.</div>
<br/><button onclick="createSoilPost()" class="green">거래글 등록</button>
</div>

<div class="table-wrap"><table><thead><tr><th>번호</th><th>구분</th><th>상태</th><th>출처</th><th>사진</th><th>회사명/제목</th><th>지역/주소</th><th>담당</th><th>토질</th><th>물량</th><th>액션</th><th>등록일</th></tr></thead><tbody id="rows"></tbody></table></div>
</div>

<div id="detailModal"><div class="modal-card"><div class="modal-head"><div><h2 id="detailTitle"></h2><div id="detailSub" class="small"></div></div><button onclick="closeDetail()" class="close-btn">닫기</button></div><div id="detailImage"></div><div class="detail-grid" id="detailBody"></div><div id="detailActions" style="margin-top:16px"></div><div class="notice">등록자 제공 정보입니다. 중기넷은 정보공유 플랫폼이며 거래 및 인허가 여부는 이용자가 직접 확인하시기 바랍니다.</div></div></div>

<div id="editModal"><div class="modal-card"><div class="modal-head"><div><h2>거래글 수정</h2><div id="editHelpText" class="small">본인이 올린 글은 내용 수정만 가능합니다.</div></div><button onclick="closeEdit()" class="close-btn">닫기</button></div>
<input id="editId" type="hidden" />
<div class="form-grid">
<select id="editCategory"><option value="발생토">발생토</option><option value="사토장">사토장</option><option value="토취장">토취장</option><option value="성토재필요">성토재필요</option><option value="덤프 모집">덤프 모집</option><option value="굴삭기 모집">굴삭기 모집</option><option value="기사 구함">기사 구함</option></select>
<select id="editVisibility"><option value="region">읍면동만 공개</option><option value="exact">정확한 위치 공개</option></select>
<select id="editPermitStatus"><option value="미확인">허가/서류 미확인</option><option value="서류있음">서류 있음</option><option value="허가관련있음">허가 관련 있음</option></select>
<select id="editDealStatus"><option value="모집중">모집중</option><option value="완료">완료</option><option value="마감">마감</option><option value="보류">보류</option></select>
</div>
<div class="form-grid-3" style="margin-top:10px"><input id="editTitle" placeholder="제목" /><input id="editSoilType" placeholder="토질" /><input id="editQuantity" placeholder="물량" /></div>
<div class="form-grid-3" style="margin-top:10px"><input id="editContact" placeholder="연락처" oninput="formatPhone(this)" maxlength="13" /><input id="editRegion" placeholder="공개지역" /><input id="editAddress" placeholder="주소" /></div>
<textarea id="editMemo" placeholder="메모" style="width:100%;height:90px;margin-top:10px"></textarea>
<div style="margin-top:16px">
<button onclick="saveEdit()" class="green">수정 저장</button>
<button id="hideBtn" onclick="hidePost()" class="orange" style="display:none">숨김 처리</button>
<button id="restoreBtn" onclick="restorePost()" class="purple" style="display:none">숨김 해제</button>
<button id="deleteBtn" onclick="deletePost()" class="red" style="display:none">완전 삭제</button>
</div>
</div></div>

<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=a9ed4e2346ce8b1f27e13e75c0ad80a9&autoload=false&libraries=services"></script>
<script>
const isAdminPage = ${isAdmin ? 'true' : 'false'};
const OPEN_KAKAO_URL = 'https://open.kakao.com/o/g5NbSfph';
const ADMIN_PASSWORD = '8904';
let adminUnlocked = false;

let allRows=[];let currentMode='토석정보';let dateFilter='all';let map=null;let markers=[];let openedInfo=null;let kakaoReady=false;let geocoder=null;let visibleRows=[];let lastSavedPosition=null;

function cleanNum(v){if(v===null||v===undefined)return null;const n=Number(String(v).trim().replace(/,/g,''));return Number.isFinite(n)?n:null}
function formatPhone(input){let v=input.value.replace(/[^0-9]/g,'');if(v.length<4){input.value=v}else if(v.length<8){input.value=v.slice(0,3)+'-'+v.slice(3)}else{input.value=v.slice(0,3)+'-'+v.slice(3,7)+'-'+v.slice(7,11)}}
function onlyDate(v){return v?String(v).slice(0,10):''}
function daysSince(v){if(!v)return 0;const d=new Date(v);if(isNaN(d.getTime()))return 0;return Math.floor((new Date().getTime()-d.getTime())/(1000*60*60*24))}
function isExpiredPost(r){return r&&r.source==='user'&&r.createdAt&&daysSince(r.createdAt)>=30}
function effectiveDealStatus(r){if(isExpiredPost(r))return '마감';return r&&r.dealStatus?r.dealStatus:'모집중'}
function expireText(r){if(!isExpiredPost(r))return '';return '등록 후 30일이 지나 자동 마감 처리되었습니다.'}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,function(m){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m]})}
function badge(t){if(t==='사토장')return '<span class="badge b-dump">사토장</span>';if(t==='토취장')return '<span class="badge b-take">토취장</span>';if(t==='골재업체')return '<span class="badge b-gravel">골재업체</span>';if(t==='발생토')return '<span class="badge b-post">발생토</span>';if(t==='성토재필요')return '<span class="badge b-need">성토재필요</span>';if(t==='덤프 모집')return '<span class="badge b-dumpjob">덤프 모집</span>';if(t==='굴삭기 모집')return '<span class="badge b-excavator">굴삭기 모집</span>';if(t==='기사 구함')return '<span class="badge b-driver">기사 구함</span>';return '<span class="badge">'+escapeHtml(t||'미분류')+'</span>'}
function sourceBadge(s){return s==='public'?'<span class="badge b-public">공공데이터</span>':'<span class="badge b-user">사용자등록</span>'}
function statusBadge(s){if(s==='완료')return '<span class="badge b-done">완료</span>';if(s==='마감')return '<span class="badge b-closed">마감</span>';if(s==='보류')return '<span class="badge b-hold">보류</span>';return '<span class="badge b-open">모집중</span>'}
function soilBadge(v){const s=String(v||'');if(!s)return '';if(s.includes('양질'))return '<span class="badge b-soil-good">'+escapeHtml(s)+'</span>';if(s.includes('불량')||s.includes('폐토'))return '<span class="badge b-soil-bad">'+escapeHtml(s)+'</span>';if(s.includes('마사'))return '<span class="badge b-soil-masa">'+escapeHtml(s)+'</span>';if(s.includes('혼합')||s.includes('다짐'))return '<span class="badge b-soil-mix">'+escapeHtml(s)+'</span>';return escapeHtml(s)}
function setText(id,v){const el=document.getElementById(id);if(el)el.innerText=String(v)}
function updateStats(){setText('statTotal',allRows.length);setText('statDump',allRows.filter(x=>x.type==='사토장').length);setText('statTake',allRows.filter(x=>x.type==='토취장').length);setText('statGravel',allRows.filter(x=>x.type==='골재업체').length);setText('statPost',allRows.filter(x=>x.type==='발생토').length);setText('statNeed',allRows.filter(x=>x.type==='성토재필요').length);setText('statDumpJob',allRows.filter(x=>x.type==='덤프 모집').length);setText('statExcavator',allRows.filter(x=>x.type==='굴삭기 모집').length);setText('statDriver',allRows.filter(x=>x.type==='기사 구함').length)}
function setDateFilter(v){dateFilter=v;['dateAll','dateToday','date3','date7'].forEach(id=>document.getElementById(id).classList.remove('active'));if(v==='all')dateAll.classList.add('active');if(v==='today')dateToday.classList.add('active');if(v==='3')date3.classList.add('active');if(v==='7')date7.classList.add('active');renderTable()}
function handleFilterChange(){const f=filterType.value;if((f==='사토장'||f==='토취장'||f==='골재업체')&&currentMode!=='토석정보'){loadSites(f);return}if((f==='발생토'||f==='성토재필요'||f==='덤프 모집'||f==='굴삭기 모집'||f==='기사 구함')&&currentMode!=='거래글'){loadSoilPosts(f);return}renderTable()}
function passDateFilter(r){if(dateFilter==='all')return true;if(!r.createdAt)return true;const d=new Date(r.createdAt);if(isNaN(d.getTime()))return true;const now=new Date();const diff=(now.getTime()-d.getTime())/(1000*60*60*24);if(dateFilter==='today')return onlyDate(r.createdAt)===onlyDate(now.toISOString());return diff<=Number(dateFilter)}
function getFilteredRows(){const k=keyword.value.trim().toLowerCase();const f=filterType.value;const ds=dealFilter.value;return allRows.filter(r=>{const effectiveStatus=effectiveDealStatus(r);const text=[r.type,r.name,r.addr,r.ownerName,r.managerName,r.soilType,r.quantity,r.memo,r.source,r.permitStatus,effectiveStatus].join(' ').toLowerCase();return(!k||text.includes(k))&&(f==='전체'||r.type===f)&&(ds==='전체'||effectiveStatus===ds)&&passDateFilter(r)})}
function thumb(img){if(!img)return '<span class="small">없음</span>';return '<img src="'+img+'" style="width:62px;height:46px;object-fit:cover;border-radius:10px;border:1px solid #e5e7eb" />'}
function phoneButton(contact){const c=String(contact||'').replace(/[^0-9]/g,'');if(!c)return '';return '<a href="tel:'+c+'" class="action-link call">전화</a>'}
function openKakaoButton(){return '<a href="'+OPEN_KAKAO_URL+'" target="_blank" class="action-link kakao">오픈톡</a>'}
function routeButton(lat,lng,label,isApprox){
  if(!lat || !lng) return '';
  const url = 'https://map.kakao.com/link/to/목적지,' + lat + ',' + lng;
  return '<a target="_blank" href="' + url + '" class="action-link route">길찾기</a>';
}
function completeButton(i,r){if(isAdminPage||!r||r.source!=='user'||!r.id||effectiveDealStatus(r)==='마감')return '';return '<button class="mini-btn complete" onclick="completePost('+i+')">완료</button>'}

const BLOCK_KEYWORDS=['바카라','카지노','도박','토토','스포츠토토','대출','개인돈','작업대출','성인','야동','섹스','안마','마사지','마약','필로폰','대마','불법','리딩방','코인투자','고수익보장','다단계'];
const SUSPICIOUS_KEYWORDS=['텔레그램','telegram','카카오채널','오픈채팅 홍보','무료나눔','수익','투자','코인','광고','홍보','http://','https://','www.'];
function normalizeCheckText(v){return String(v||'').toLowerCase().replace(/\\s+/g,'')}
function getPostCheckText(){return normalizeCheckText([postCategory.value,postTitle.value,postAddress.value,postSoilType.value,postQuantity.value,postContact.value,postMemo.value].join(' '))}
function getSpamState(){try{return JSON.parse(localStorage.getItem('tocyclePostState')||'{}')}catch(e){return {}}}
function setSpamState(contact){try{localStorage.setItem('tocyclePostState',JSON.stringify({lastAt:Date.now(),contact:String(contact||'').replace(/[^0-9]/g,'')}))}catch(e){}}
function checkPostSafety(){
 const text=getPostCheckText();
 const contact=String(postContact.value||'').replace(/[^0-9]/g,'');
 const title=postTitle.value.trim();
 const memo=postMemo.value.trim();
 const quantity=postQuantity.value.trim();
 const soil=postSoilType.value.trim();
 const state=getSpamState();
 const now=Date.now();
 const reasons=[];
 for(const word of BLOCK_KEYWORDS){if(text.includes(normalizeCheckText(word)))return {action:'block',reason:'금칙어 감지: '+word}}
 if(state.lastAt && now-Number(state.lastAt)<30000)return {action:'block',reason:'등록 간격이 너무 짧습니다. 30초 후 다시 등록하세요.'}
 if(state.lastAt && state.contact && contact && state.contact===contact && now-Number(state.lastAt)<60000)return {action:'block',reason:'같은 연락처로 너무 빠르게 연속 등록할 수 없습니다.'}
 for(const word of SUSPICIOUS_KEYWORDS){if(text.includes(normalizeCheckText(word)))reasons.push('의심 단어: '+word)}
 if(!contact || contact.length<10)reasons.push('연락처 부족');
 if(title.length<4)reasons.push('제목 너무 짧음');
 if(!quantity && (postCategory.value==='발생토'||postCategory.value==='성토재필요'))reasons.push('물량 미입력');
 if(!soil && postCategory.value==='발생토')reasons.push('토질 미입력');
 if(new RegExp('(.)\\\\1{5,}').test(text))reasons.push('반복 문자 과다');
 if(reasons.length>=2)return {action:'hide',reason:reasons.join(', ')};
 return {action:'allow',reason:''};
}
function rowActions(r,i){
 const lat=cleanNum(r.ypos),lng=cleanNum(r.xpos);
 const isApprox=r.source==='user'&&r.visibility!=='exact';
 let buttons=phoneButton(r.contact)+routeButton(lat,lng,r.name,isApprox)+'<button class="mini-btn detail" onclick="showDetail('+i+')">상세</button>';
 buttons+=completeButton(i,r);
 if(r.source==='user')buttons+='<button class="mini-btn edit" onclick="openEdit('+i+')">수정</button>';
 return buttons;
}

function renderTable(){
 visibleRows=getFilteredRows();visibleRows.forEach((r,i)=>r.__idx=i);
 rows.innerHTML=visibleRows.map((r,i)=>'<tr onclick="rowClick(event,'+i+')"><td>'+(i+1)+'</td><td>'+badge(r.type)+'</td><td>'+statusBadge(effectiveDealStatus(r))+'</td><td>'+sourceBadge(r.source)+'</td><td>'+thumb(r.imageData)+'</td><td><div class="title">'+escapeHtml(r.name||'')+'</div><div class="small">'+escapeHtml(r.memo||'')+'</div></td><td>'+escapeHtml(r.addr||'')+'</td><td>'+escapeHtml(r.ownerName||'')+'<br/><span class="small">'+escapeHtml(r.managerName||'')+'</span></td><td>'+soilBadge(r.soilType||'')+'</td><td>'+escapeHtml(r.quantity||'')+'</td><td>'+rowActions(r,i)+'</td><td>'+onlyDate(r.createdAt)+'</td></tr>').join('');
 status.innerText=currentMode+' · 검색결과 '+visibleRows.length+'개';
 if(mapBox.style.display==='block')drawMarkers(visibleRows);
}
function rowClick(e,i){if(e.target.closest('a')||e.target.closest('button'))return;showDetail(i)}


function isDispatchType(t){return t==='덤프 모집'||t==='굴삭기 모집'||t==='기사 구함'}
function setDispatchCategory(type){
 postCategory.value=type;
 applyCategoryTemplate();
 postTitle.focus();
}
function applyCategoryTemplate(){
 const t=postCategory.value;
 if(isDispatchType(t)){
  postPermitStatus.value='미확인';
  postDealStatus.value='모집중';
  if(t==='덤프 모집'){
   postTitle.placeholder='제목 예: 25톤 덤프 5대 모집';
   postSoilType.placeholder='장비 예: 25톤 덤프 / 15톤 덤프';
   postQuantity.placeholder='수량/기간 예: 5대 / 내일 하루';
   postMemo.placeholder='메모: 작업일, 상차지, 하차지, 단가, 결제조건, 현장조건';
  }else if(t==='굴삭기 모집'){
   postTitle.placeholder='제목 예: 06굴삭기 기사포함 모집';
   postSoilType.placeholder='장비 예: 03 / 06 / 10 굴삭기';
   postQuantity.placeholder='수량/기간 예: 1대 / 3일';
   postMemo.placeholder='메모: 작업일, 작업내용, 단가, 결제조건, 어태치 필요 여부';
  }else{
   postTitle.placeholder='제목 예: 덤프 기사 구함';
   postSoilType.placeholder='직무 예: 덤프기사 / 굴삭기기사';
   postQuantity.placeholder='조건 예: 일당 / 월급 / 숙식';
   postMemo.placeholder='메모: 근무지역, 기간, 급여, 결제일, 필요경력';
  }
 }else{
  postTitle.placeholder='제목 예: A급 토사 반출';
  postSoilType.placeholder='토질 예: 양질토 / 불량토 / 마사토';
  postQuantity.placeholder='물량 예: 500루베 / 25톤 20대';
  postMemo.placeholder='메모: 반입/반출 조건, 우천시 가능 여부, 사토비, 서류 필요 여부 등';
 }
}
async function loadDispatchPosts(){await loadSoilPosts('덤프 모집');filterType.value='덤프 모집';renderTable()}
async function loadSites(selectedType){currentMode='토석정보';status.innerText='토석정보 불러오는 중...';try{const res=await fetch('/tocycle/sites',{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);const sites=await res.json();allRows=Array.isArray(sites)?sites.map(s=>{const x=cleanNum(s.xpos),y=cleanNum(s.ypos);return{id:null,type:s.siteType||'미분류',name:s.orgName||'',addr:s.addr||'',soilType:s.siteType||'',quantity:(x&&y)?y+', '+x:'',xpos:x,ypos:y,createdAt:'',ownerName:s.ownerName||'',managerName:s.managerName||'',contact:s.phone||'',memo:s.phone?'연락처: '+s.phone:'',source:'public',visibility:'exact',permitStatus:'공공데이터',dealStatus:'모집중',imageData:''}}):[];updateStats();filterType.value=selectedType||'전체';renderTable();}catch(e){console.error(e);allRows=[];updateStats();rows.innerHTML='<tr><td colspan="12">토석정보를 불러오지 못했습니다. /tocycle/sites 확인 또는 서버 재시작이 필요합니다.</td></tr>';status.innerText='토석정보 로딩 실패';}}
async function syncSites(){status.innerText='토석정보 수집 중...';await fetch('/tocycle/sync');await loadSites()}
async function loadSoilPosts(selectedType){currentMode='거래글';status.innerText='거래글 불러오는 중...';const res=await fetch('/soil-posts',{cache:'no-store'});const posts=await res.json();allRows=posts.map(p=>({id:p.id,type:p.category||'발생토',name:p.title||'',addr:p.visibility==='exact'?(p.address||p.region||''):(p.displayRegion||p.region||''),address:p.address||'',region:p.region||'',displayRegion:p.displayRegion||'',soilType:p.soilType||'',quantity:p.quantity||'',xpos:p.longitude||null,ypos:p.latitude||null,createdAt:p.createdAt||'',ownerName:'',managerName:p.contact||'',contact:p.contact||'',memo:(p.permitStatus?'['+p.permitStatus+'] ':'')+(p.memo||''),rawMemo:p.memo||'',source:'user',visibility:p.visibility||'region',permitStatus:p.permitStatus||'미확인',dealStatus:p.dealStatus||'모집중',imageData:p.imageData||''}));updateStats();filterType.value=selectedType||'전체';renderTable();moveToLastSaved()}
async function loadHiddenPosts(){
 currentMode='숨김목록';
 status.innerText='숨김 목록 불러오는 중...';
 const res=await fetch('/soil-posts/hidden',{cache:'no-store'});
 const posts=await res.json();

 allRows=posts.map(p=>({
  id:p.id,
  type:p.category||'발생토',
  name:p.title||'',
  addr:p.visibility==='exact'?(p.address||p.region||''):(p.displayRegion||p.region||''),
  address:p.address||'',
  region:p.region||'',
  displayRegion:p.displayRegion||'',
  soilType:p.soilType||'',
  quantity:p.quantity||'',
  xpos:p.longitude||null,
  ypos:p.latitude||null,
  createdAt:p.createdAt||'',
  ownerName:'',
  managerName:p.contact||'',
  contact:p.contact||'',
  memo:(p.permitStatus?'['+p.permitStatus+'] ':'')+(p.memo||''),
  rawMemo:p.memo||'',
  source:'user',
  visibility:p.visibility||'region',
  permitStatus:p.permitStatus||'미확인',
  dealStatus:p.dealStatus||'모집중',
  imageData:p.imageData||'',
  isHidden:true
 }));

 updateStats();
 filterType.value='전체';
 renderTable();
}
function ensureMapReady(callback){if(typeof kakao==='undefined'){alert('카카오 지도 스크립트 로딩 실패');return}kakao.maps.load(function(){kakaoReady=true;if(!geocoder)geocoder=new kakao.maps.services.Geocoder();if(callback)callback()})}
function makeDisplayRegion(address){const parts=String(address||'').trim().split(/\\s+/);if(parts.length>=3)return parts.slice(0,3).join(' ');if(parts.length>=2)return parts.slice(0,2).join(' ');return address}
function searchAddress(){const address=postAddress.value.trim();if(!address){alert('주소를 입력하세요.');return}status.innerText='주소 검색 중...';ensureMapReady(function(){geocoder.addressSearch(address,function(result,statusCode){if(statusCode===kakao.maps.services.Status.OK&&result.length>0){const item=result[0];const display=makeDisplayRegion(item.address_name||address);postDisplayRegion.value=display;const targetAddress=postVisibility.value==='region'?display:(item.address_name||address);geocoder.addressSearch(targetAddress,function(r2,s2){const finalItem=(s2===kakao.maps.services.Status.OK&&r2.length>0)?r2[0]:item;postLat.value=finalItem.y;postLng.value=finalItem.x;postCoordText.value=Number(finalItem.y).toFixed(6)+', '+Number(finalItem.x).toFixed(6);status.innerText='주소검색 완료: '+display;if(mapBox.style.display!=='block')toggleMap();setTimeout(function(){const pos=new kakao.maps.LatLng(Number(finalItem.y),Number(finalItem.x));map.setCenter(pos);map.setLevel(5)},600)})}else{alert('주소를 찾지 못했습니다. 예: 화성시 우정읍 처럼 입력해보세요.');status.innerText='주소검색 실패'}})})}
function previewImage(event){const file=event.target.files&&event.target.files[0];if(!file)return;if(file.size>700000)alert('사진 용량이 큽니다. 가능하면 캡처/압축된 사진을 사용하세요.');const reader=new FileReader();reader.onload=function(e){postImageData.value=e.target.result;imagePreview.src=e.target.result;imagePreview.style.display='block'};reader.readAsDataURL(file)}
async function createSoilPost(){
 const title=postTitle.value.trim();
 const address=postAddress.value.trim();
 const region=postDisplayRegion.value.trim()||makeDisplayRegion(address);
 if(!title||!address||!region){alert('제목과 주소검색은 필수입니다.');return}
 const safety=checkPostSafety();
 if(safety.action==='block'){
  alert('등록이 차단되었습니다.\\n사유: '+safety.reason);
  status.innerText='등록 차단: '+safety.reason;
  return;
 }
 status.innerText=safety.action==='hide'?'의심글 자동 분류 중...':'거래글 등록 중...';
 lastSavedPosition={lat:cleanNum(postLat.value),lng:cleanNum(postLng.value)};
 const payload={category:postCategory.value,title,region,address,displayRegion:region,visibility:postVisibility.value,latitude:postLat.value,longitude:postLng.value,soilType:postSoilType.value.trim(),quantity:postQuantity.value.trim(),contact:postContact.value.trim(),permitStatus:postPermitStatus.value,dealStatus:postDealStatus.value,memo:postMemo.value.trim(),imageData:postImageData.value};
 const res=await fetch('/soil-posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 if(!res.ok){alert('거래글 등록 실패. 사진 용량 또는 API 연결을 확인하세요.');status.innerText='거래글 등록 실패';return}
 const saved=await res.json();
 setSpamState(postContact.value);
 const savedCategory=postCategory.value;
 if(safety.action==='hide'&&saved&&saved.id){
  await fetch('/soil-posts/'+saved.id+'/hide',{method:'PATCH'});
  alert('등록은 접수됐지만 의심 요소가 있어 일반 목록에는 바로 노출하지 않았습니다.\\n관리자 숨김 목록에서 확인할 수 있습니다.\\n사유: '+safety.reason);
 }else{
  alert('거래글 등록 완료');
 }
 postTitle.value='';postAddress.value='';postDisplayRegion.value='';postCoordText.value='';postLat.value='';postLng.value='';postSoilType.value='';postQuantity.value='';postContact.value='';postMemo.value='';postImage.value='';postImageData.value='';imagePreview.src='';imagePreview.style.display='none';postVisibility.value='region';postPermitStatus.value='미확인';postDealStatus.value='모집중';
 await loadSoilPosts(savedCategory);
}

function toggleMap(){const box=mapBox;const btn=mapToggleBtn;if(box.style.display==='block'){box.style.display='none';btn.innerText='지도보기';btn.className='gray';return}box.style.display='block';btn.innerText='지도끄기';btn.className='red';status.innerText='지도 불러오는 중...';initKakaoMap()}
function initKakaoMap(){ensureMapReady(function(){if(!map){map=new kakao.maps.Map(document.getElementById('map'),{center:new kakao.maps.LatLng(36.5,127.8),level:13});map.addControl(new kakao.maps.MapTypeControl(),kakao.maps.ControlPosition.TOPRIGHT);map.addControl(new kakao.maps.ZoomControl(),kakao.maps.ControlPosition.RIGHT)}setTimeout(function(){map.relayout();drawMarkers(visibleRows.length?visibleRows:getFilteredRows())},500)})}
function moveToLastSaved(){if(!lastSavedPosition||!map||!lastSavedPosition.lat||!lastSavedPosition.lng)return;const pos=new kakao.maps.LatLng(lastSavedPosition.lat,lastSavedPosition.lng);map.setCenter(pos);map.setLevel(5);lastSavedPosition=null}
function markerImage(type,source,count){let color='2563eb';if(source==='public')color='16a34a';if(type==='발생토')color='2563eb';if(type==='사토장')color='dc2626';if(type==='토취장')color='d97706';if(type==='골재업체')color='16a34a';if(type==='성토재필요')color='7c3aed';const text=count>1?String(count):'';const svg='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="46" viewBox="0 0 40 46"><path fill="%23'+color+'" d="M20 0C9 0 0 9 0 20c0 15 20 26 20 26s20-11 20-26C40 9 31 0 20 0z"/><circle cx="20" cy="20" r="10" fill="white"/><text x="20" y="24" font-size="11" font-weight="800" text-anchor="middle" fill="%23'+color+'">'+text+'</text></svg>';return new kakao.maps.MarkerImage('data:image/svg+xml;charset=UTF-8,'+svg,new kakao.maps.Size(40,46),{offset:new kakao.maps.Point(20,46)})}
function drawMarkers(rowsData){if(!map||!kakaoReady)return;markers.forEach(m=>m.setMap(null));markers=[];if(openedInfo){openedInfo.close();openedInfo=null}const groups={};rowsData.forEach(r=>{let lat=cleanNum(r.ypos),lng=cleanNum(r.xpos);if(lat===null||lng===null)return;if(lat>100&&lng<50){const temp=lat;lat=lng;lng=temp}if(lat<32||lat>39||lng<124||lng>132)return;const key=Math.round(lat*1000)+'_'+Math.round(lng*1000);if(!groups[key])groups[key]={lat,lng,items:[]};groups[key].items.push(r)});const bounds=new kakao.maps.LatLngBounds();let count=0;Object.keys(groups).forEach(key=>{const g=groups[key];const pos=new kakao.maps.LatLng(g.lat,g.lng);const first=g.items[0];const marker=new kakao.maps.Marker({position:pos,image:markerImage(first.type,first.source,g.items.length)});marker.setMap(map);const list=g.items.map(item=>{const idx=item.__idx||0;const isApprox=item.source==='user'&&item.visibility!=='exact';return '<div style="border-top:1px solid #e5e7eb;padding:9px 0;"><b>'+escapeHtml(item.name||'')+'</b> '+statusBadge(item.dealStatus)+'<br/><span>'+escapeHtml(item.type||'')+' · '+escapeHtml(item.quantity||'')+'</span><br/>'+phoneButton(item.contact)+routeButton(cleanNum(item.ypos),cleanNum(item.xpos),item.name,isApprox)+'<button class="mini-btn detail" onclick="showDetail('+idx+')">📋 상세</button></div>'}).join('');const info=new kakao.maps.InfoWindow({removable:true,content:'<div style="padding:14px;width:330px;font-size:13px;line-height:1.55;"><b style="font-size:16px;color:#0f172a;">이 위치 등록글 '+g.items.length+'건</b><br/><span>'+escapeHtml(first.addr||'')+'</span>'+list+'</div>'});kakao.maps.event.addListener(marker,'click',function(){if(openedInfo)openedInfo.close();info.open(map,marker);openedInfo=info});markers.push(marker);bounds.extend(pos);count++});if(count>1)map.setBounds(bounds);else if(count===1){map.setCenter(markers[0].getPosition());map.setLevel(5)}status.innerText=currentMode+' · 지도표시 '+count+'개'}
function showDetail(i){const r=visibleRows[i];if(!r)return;const lat=cleanNum(r.ypos),lng=cleanNum(r.xpos);const isApprox=r.source==='user'&&r.visibility!=='exact';const deal=effectiveDealStatus(r);const expiredMsg=expireText(r);detailTitle.innerText=r.name||'';detailSub.innerText=(r.type||'')+' · '+(r.source==='public'?'공공데이터':'사용자등록')+' · '+deal;detailImage.innerHTML=r.imageData?'<img class="detail-img" src="'+r.imageData+'" />':'<div class="small" style="margin:14px 0">등록된 사진 없음</div>';detailBody.innerHTML='<b>지역/주소</b><div>'+escapeHtml(r.addr||'')+(isApprox?' <span class="private-note">상세위치 비공개</span>':'')+'</div><b>연락처</b><div>'+escapeHtml(r.contact||'')+'</div><b>토질</b><div>'+escapeHtml(r.soilType||'')+'</div><b>물량</b><div>'+escapeHtml(r.quantity||'')+'</div><b>서류/허가</b><div>'+escapeHtml(r.permitStatus||'')+'</div><b>거래상태</b><div>'+escapeHtml(deal)+(expiredMsg?' <span class="private-note">'+escapeHtml(expiredMsg)+'</span>':'')+'</div><b>메모</b><div>'+escapeHtml(r.memo||'')+'</div>';detailActions.innerHTML=phoneButton(r.contact)+routeButton(lat,lng,r.name,isApprox)+openKakaoButton()+completeButton(i,r)+(r.source==='user'?'<button class="mini-btn edit" onclick="closeDetail();openEdit('+i+')">수정</button>':'');detailModal.style.display='block'}
function closeDetail(){detailModal.style.display='none'}
function openEdit(i){
 const r=visibleRows[i];
 if(!r||!r.id){
  alert('사용자 등록글만 수정할 수 있습니다.');
  return;
 }

 editId.value=r.id;
 editCategory.value=r.type||'발생토';
 editVisibility.value=r.visibility||'region';
 editPermitStatus.value=r.permitStatus||'미확인';
 editDealStatus.value=effectiveDealStatus(r);
 editTitle.value=r.name||'';
 editSoilType.value=r.soilType||'';
 editQuantity.value=r.quantity||'';
 editContact.value=r.contact||'';
 editRegion.value=r.displayRegion||r.region||r.addr||'';
 editAddress.value=r.address||r.addr||'';
 editMemo.value=r.rawMemo||'';

 editModal.dataset.hidden = r.isHidden ? 'true' : 'false';

const hideBtn=document.getElementById('hideBtn');
const restoreBtn=document.getElementById('restoreBtn');
const deleteBtn=document.getElementById('deleteBtn');

hideBtn.style.display='none';
restoreBtn.style.display='none';
deleteBtn.style.display='none';

if(isAdminPage){
 const editHelpText=document.getElementById('editHelpText');
 if(editHelpText) editHelpText.innerText='관리자 모드: 수정, 숨김, 삭제 가능';

 if(currentMode==='숨김목록'){
  restoreBtn.style.display='inline-flex';
 }else{
  hideBtn.style.display='inline-flex';
 }

 deleteBtn.style.display='inline-flex';
}else{
 const editHelpText=document.getElementById('editHelpText');
 if(editHelpText) editHelpText.innerText='본인이 올린 글은 내용 수정만 가능합니다.';
}

 editModal.style.display='block';
}
function closeEdit(){editModal.style.display='none'}
async function saveEdit(){const id=editId.value;if(!id)return;const res=await fetch('/soil-posts/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({category:editCategory.value,title:editTitle.value,visibility:editVisibility.value,permitStatus:editPermitStatus.value,dealStatus:editDealStatus.value,soilType:editSoilType.value,quantity:editQuantity.value,contact:editContact.value,region:editRegion.value,displayRegion:editRegion.value,address:editAddress.value,memo:editMemo.value})});if(!res.ok){alert('수정 실패');return}alert('수정 완료');closeEdit();await loadSoilPosts(filterType.value==='전체'?undefined:filterType.value)}

async function completePost(i){
 const r=visibleRows[i];
 if(!r||!r.id)return;
 if(isAdminPage)return;
 const ok=confirm('완료 처리하면 이 글이 목록에서 삭제됩니다.\\n\\n정말 완료 처리할까요?');
 if(!ok)return;
 const res=await fetch('/soil-posts/'+r.id,{method:'DELETE'});
 if(!res.ok){alert('완료 처리 실패');return}
 alert('완료 처리되어 글이 삭제되었습니다.');
 closeDetail();
 closeEdit();
 await loadSoilPosts(filterType.value==='전체'?undefined:filterType.value);
}
async function hidePost(){
 const id=editId.value;
 if(!id)return;

 if(!confirm('이 글을 숨김 처리할까요?')){
  return;
 }

 const res=await fetch('/soil-posts/'+id+'/hide',{
  method:'PATCH'
 });

 if(!res.ok){
  alert('숨김 실패');
  return;
 }

 alert('숨김 처리 완료');
 closeEdit();

 if(currentMode==='숨김목록'){
  await loadHiddenPosts();
 }else{
  await loadSoilPosts();
 }
}
async function restorePost(){
 const id=editId.value;
 if(!id)return;

 if(!confirm('숨김 해제하고 일반 목록으로 복구할까요?')){
  return;
 }

 const res=await fetch('/soil-posts/'+id+'/restore',{
  method:'PATCH'
 });

 if(!res.ok){
  alert('복구 실패');
  return;
 }

 alert('복구 완료');
 closeEdit();

 await loadHiddenPosts();
}
async function deletePost(){
 const id=editId.value;
 if(!id)return;

 if(!confirm('완전히 삭제할까요? 되돌릴 수 없습니다.')){
  return;
 }

 const res=await fetch('/soil-posts/'+id,{
  method:'DELETE'
 });

 if(!res.ok){
  alert('삭제 실패');
  return;
 }

 alert('삭제 완료');
 closeEdit();

 if(currentMode==='숨김목록'){
  await loadHiddenPosts();
 }else{
  await loadSoilPosts();
 }
}
function activateUserMode(){
 document.title='중기넷 토사거래';
 const pageTitle=document.getElementById('pageTitle');
 const adminSyncBtn=document.getElementById('adminSyncBtn');
 const adminHiddenBtn=document.getElementById('adminHiddenBtn');
 if(pageTitle) pageTitle.innerText='중기넷 토사거래';
 if(adminSyncBtn) adminSyncBtn.style.display='none';
 if(adminHiddenBtn) adminHiddenBtn.style.display='none';
}

function activateAdminMode(){
 document.title='중기넷 토사거래 관리자';
 const pageTitle=document.getElementById('pageTitle');
 const adminSyncBtn=document.getElementById('adminSyncBtn');
 const adminHiddenBtn=document.getElementById('adminHiddenBtn');
 if(pageTitle) pageTitle.innerText='중기넷 토사거래 관리자';
 if(adminSyncBtn) adminSyncBtn.style.display='inline-flex';
 if(adminHiddenBtn) adminHiddenBtn.style.display='inline-flex';
}

function showAdminLogin(){
 activateUserMode();
 document.title='관리자 로그인';
 const gate=document.getElementById('adminLoginGate');
 const input=document.getElementById('adminPassword');
 const error=document.getElementById('adminLoginError');
 if(error) error.style.display='none';
 if(gate) gate.style.display='flex';
 setTimeout(function(){if(input) input.focus()},100);
}

function adminLogin(){
 const input=document.getElementById('adminPassword');
 const error=document.getElementById('adminLoginError');
 const gate=document.getElementById('adminLoginGate');
 if(!input) return;
 if(input.value===ADMIN_PASSWORD){
  adminUnlocked=true;
  if(error) error.style.display='none';
  if(gate) gate.style.display='none';
  input.value='';
  activateAdminMode();
  loadSites();
 }else{
  adminUnlocked=false;
  if(error) error.style.display='block';
  input.value='';
  input.focus();
 }
}

if(isAdminPage){
 activateAdminMode();
 loadSites();
}else{
 activateUserMode();
 loadSites();
}
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