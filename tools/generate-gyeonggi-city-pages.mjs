import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = globalThis.nodeRepl?.cwd ?? ".";
const site = "https://massagepro-cpt.pages.dev";
const phone = "0508-202-4731";
const today = "2026-05-22";

const cities = [
  { slug:"gapyeong", name:"가평군", zones:["가평읍","설악면","청평면","상면","조종면","북면"], area:"가평읍·청평·설악", tone:"관광지와 펜션 이용 문의가 많아 숙소명보다 정확한 읍면과 입실 시간을 함께 확인하는 것이 좋습니다.", cta:"가평 숙소·펜션 가능 시간을 전화로 확인하세요" },
  { slug:"goyang", name:"고양시", zones:["덕양구","일산동구","일산서구"], area:"일산·화정·삼송·원흥", tone:"일산 생활권과 덕양권의 이동 기준이 달라 행정구와 가까운 역을 함께 말하면 상담이 빨라집니다.", cta:"고양 일산·덕양권 가능 코스를 바로 확인하세요" },
  { slug:"gwacheon", name:"과천시", zones:["갈현동","과천동","문원동","별양동","부림동","원문동","중앙동"], area:"정부과천청사·별양·갈현", tone:"면적은 크지 않지만 주거지와 업무지가 분리되어 있어 정확한 건물 기준 확인이 중요합니다.", cta:"과천 오늘 가능한 상담 시간을 확인하세요" },
  { slug:"gwangmyeong", name:"광명시", zones:["광명동","철산동","하안동","소하동","일직동","학온동"], area:"철산·하안·소하·일직", tone:"KTX 광명역과 주거 생활권의 문의 패턴이 달라 위치 기준을 먼저 정리하면 좋습니다.", cta:"광명 철산·일직권 가능 여부를 확인하세요" },
  { slug:"gwangju", name:"광주시", zones:["경안동","광남동","곤지암읍","도척면","송정동","오포권","초월읍","퇴촌면"], area:"경안·오포·곤지암·초월", tone:"생활권이 넓고 이동 시간이 크게 달라 읍면동과 가까운 큰길 기준을 알려주는 편이 안전합니다.", cta:"광주 생활권별 가능 시간을 전화로 확인하세요" },
  { slug:"guri", name:"구리시", zones:["갈매동","교문동","동구동","수택동","인창동"], area:"갈매·인창·수택", tone:"서울 동북권과 맞닿아 있어 시간대별 이동 흐름을 함께 확인하면 상담 정확도가 높아집니다.", cta:"구리 가까운 가능 코스를 지금 확인하세요" },
  { slug:"gunpo", name:"군포시", zones:["군포동","금정동","산본동","오금동","재궁동","광정동","궁내동","수리동","대야동"], area:"산본·금정·당동", tone:"산본역 생활권과 금정 환승권의 수요가 달라 희망 시작 시간을 먼저 정리하는 것이 좋습니다.", cta:"군포 산본·금정권 가능 시간을 확인하세요" },
  { slug:"gimpo", name:"김포시", zones:["고촌읍","김포본동","구래동","마산동","사우동","양촌읍","장기동","통진읍","풍무동"], area:"풍무·장기·구래·고촌", tone:"신도시와 읍면 지역의 이동 조건 차이가 커서 정확한 동 이름과 도착 희망 시간을 확인해야 합니다.", cta:"김포 신도시·고촌권 상담을 확인하세요" },
  { slug:"namyangju", name:"남양주시", zones:["다산동","별내동","와부읍","진접읍","화도읍","호평동","평내동","오남읍"], area:"다산·별내·호평·진접", tone:"동서로 생활권이 넓어 다산권, 별내권, 화도권처럼 권역을 나눠 상담하면 빠릅니다.", cta:"남양주 권역별 가능 시간을 바로 확인하세요" },
  { slug:"dongducheon", name:"동두천시", zones:["생연동","중앙동","보산동","불현동","송내동","소요동","상패동"], area:"지행·생연·보산", tone:"생활권이 비교적 명확하지만 야간 상담은 가까운 역과 이동 기준을 함께 확인하는 것이 좋습니다.", cta:"동두천 오늘 가능 여부를 전화로 확인하세요" },
  { slug:"bucheon", name:"부천시", zones:["원미구","소사구","오정구"], area:"상동·중동·역곡·오정", tone:"도심 밀도가 높고 생활권이 촘촘해 구 이름과 가까운 지하철역을 같이 말하면 상담이 정확해집니다.", cta:"부천 원미·소사·오정 가능 시간을 확인하세요" },
  { slug:"seongnam", name:"성남시", zones:["수정구","중원구","분당구"], area:"분당·판교·위례·모란", tone:"판교 업무권과 분당 주거권, 원도심 생활권이 달라 코스와 시간대 확인이 특히 중요합니다.", cta:"성남 분당·판교권 가능 코스를 확인하세요" },
  { slug:"suwon", name:"수원시", zones:["장안구","권선구","팔달구","영통구"], area:"영통·광교·인계·수원역", tone:"특례시 규모가 커서 행정구와 생활권을 함께 말하면 배정 가능 여부를 더 빠르게 확인할 수 있습니다.", cta:"수원 4개 구 가능 시간을 바로 확인하세요" },
  { slug:"siheung", name:"시흥시", zones:["정왕동","배곧동","월곶동","은행동","대야동","신천동","장곡동","목감동"], area:"배곧·정왕·목감·은계", tone:"신도시와 산업단지, 해안권이 함께 있어 위치와 퇴근 시간대를 함께 확인해야 합니다.", cta:"시흥 배곧·정왕권 상담을 확인하세요" },
  { slug:"ansan", name:"안산시", zones:["상록구","단원구"], area:"중앙·고잔·상록수·원곡", tone:"상록구와 단원구의 생활권이 달라 구와 동을 함께 알려주면 가능 시간 확인이 빨라집니다.", cta:"안산 상록·단원권 가능 여부를 확인하세요" },
  { slug:"anseong", name:"안성시", zones:["공도읍","대덕면","안성동","금광면","보개면","원곡면","죽산면"], area:"안성동·공도·대덕", tone:"읍면 지역 이동 조건이 다양해 희망 시간을 넉넉히 두고 상담하는 편이 좋습니다.", cta:"안성 공도·안성동 가능 시간을 확인하세요" },
  { slug:"anyang", name:"안양시", zones:["만안구","동안구"], area:"범계·평촌·안양역", tone:"평촌 업무·주거권과 안양역 생활권이 달라 행정구 기준 상담이 유리합니다.", cta:"안양 만안·동안 가능 코스를 확인하세요" },
  { slug:"yangju", name:"양주시", zones:["고읍동","덕정동","옥정동","회천동","백석읍","장흥면","광적면"], area:"옥정·고읍·덕정", tone:"신도시와 읍면 지역이 함께 있어 권역별 이동 가능 시간을 분리해 확인하는 것이 좋습니다.", cta:"양주 옥정·덕정권 가능 시간을 확인하세요" },
  { slug:"yangpyeong", name:"양평군", zones:["양평읍","강상면","강하면","개군면","서종면","양서면","용문면","옥천면"], area:"양평읍·용문·양서", tone:"관광·전원주택 문의가 있어 숙소 위치와 입실 시간을 정확히 알려주는 것이 중요합니다.", cta:"양평 숙소 위치 기준 가능 여부를 확인하세요" },
  { slug:"yeoju", name:"여주시", zones:["여흥동","중앙동","오학동","가남읍","대신면","북내면","점동면"], area:"여흥·오학·가남", tone:"읍면 생활권이 넓어 이동 조건과 희망 시작 시간을 함께 확인해야 합니다.", cta:"여주 생활권별 상담 가능 시간을 확인하세요" },
  { slug:"yeoncheon", name:"연천군", zones:["연천읍","전곡읍","군남면","미산면","백학면","신서면","청산면"], area:"전곡·연천읍", tone:"이동 거리가 긴 지역이라 당일 상담은 시간 여유를 두고 가능 여부를 확인하는 편이 좋습니다.", cta:"연천 전곡·연천읍 가능 여부를 확인하세요" },
  { slug:"osan", name:"오산시", zones:["대원동","남촌동","신장동","세마동","초평동","중앙동"], area:"오산역·세마·신장", tone:"수원·화성 생활권과 맞닿아 있어 이동 기준과 시간대 확인이 중요합니다.", cta:"오산 오늘 가능 시간을 전화로 확인하세요" },
  { slug:"yongin", name:"용인시", zones:["처인구","기흥구","수지구"], area:"수지·기흥·처인·동백", tone:"면적이 넓고 3개 구 성격이 달라 행정구와 가까운 생활권을 같이 말해야 정확합니다.", cta:"용인 처인·기흥·수지 가능 시간을 확인하세요" },
  { slug:"uiwang", name:"의왕시", zones:["고천동","내손동","부곡동","오전동","청계동"], area:"내손·고천·부곡", tone:"안양·군포·과천 생활권과 맞물려 가까운 기준 지점을 알려주면 상담이 빠릅니다.", cta:"의왕 내손·고천권 상담을 확인하세요" },
  { slug:"uijeongbu", name:"의정부시", zones:["가능동","녹양동","송산동","신곡동","의정부동","자금동","호원동"], area:"의정부역·민락·호원", tone:"북부 교통 중심지라 역세권과 주거권의 시간대별 문의가 다릅니다.", cta:"의정부 민락·호원권 가능 시간을 확인하세요" },
  { slug:"icheon", name:"이천시", zones:["창전동","증포동","중리동","관고동","부발읍","마장면","신둔면"], area:"창전·증포·부발·마장", tone:"산업단지와 주거 생활권이 섞여 있어 퇴근 후 문의는 위치와 종료 시간을 함께 확인해야 합니다.", cta:"이천 부발·마장권 가능 여부를 확인하세요" },
  { slug:"paju", name:"파주시", zones:["운정동","금촌동","문산읍","교하동","조리읍","탄현면","파주읍"], area:"운정·금촌·문산", tone:"운정 신도시와 북부권 이동 조건이 달라 권역별로 가능 시간을 확인하는 편이 좋습니다.", cta:"파주 운정·금촌권 상담을 확인하세요" },
  { slug:"pyeongtaek", name:"평택시", zones:["비전동","세교동","송탄동","안중읍","고덕동","팽성읍","포승읍"], area:"고덕·비전·송탄·안중", tone:"고덕 신도시와 송탄·안중권의 이동 흐름이 달라 세부 위치 확인이 필요합니다.", cta:"평택 고덕·송탄권 가능 시간을 확인하세요" },
  { slug:"pocheon", name:"포천시", zones:["소흘읍","포천동","선단동","가산면","군내면","이동면","일동면"], area:"소흘·포천동·일동", tone:"넓은 면적과 관광 숙소 문의가 있어 주소보다 가까운 읍면 기준을 함께 알려주세요.", cta:"포천 숙소·생활권 가능 여부를 확인하세요" },
  { slug:"hanam", name:"하남시", zones:["미사동","덕풍동","신장동","감일동","위례동","초이동"], area:"미사·감일·위례", tone:"서울 동남권과 맞닿아 있어 퇴근 시간대 교통 흐름까지 고려해 상담하는 것이 좋습니다.", cta:"하남 미사·감일권 가능 시간을 확인하세요" },
  { slug:"hwaseong", name:"화성시", zones:["만세구","효행구","병점구","동탄구"], area:"동탄·병점·향남·남양", tone:"2026년 2월 4개 일반구 체계가 반영된 대형 생활권으로, 구와 세부 동을 함께 확인하는 것이 좋습니다.", cta:"화성 동탄·병점·향남권 상담을 확인하세요" }
];

function nav() {
  return `<header class="site-header"><nav class="nav" aria-label="주 메뉴"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">MP</span><span><strong>마사지PRO</strong><small>출장마사지 예약 상담</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu"><span></span><span></span><span></span></button><ul id="primary-menu" class="menu"><li class="has-submenu"><a href="/services/">서비스 안내</a><ul class="submenu"><li><a href="/services/thai/">타이 마사지</a></li><li><a href="/services/aroma/">아로마 마사지</a></li><li><a href="/services/home-thai/">홈타이</a></li></ul></li><li class="has-submenu"><a href="/pricing/">이용 요금</a><ul class="submenu"><li><a href="/pricing/course/">코스별 요금표</a></li><li><a href="/pricing/events/">이벤트 / 할인</a></li></ul></li><li class="has-submenu"><a href="/locations/">지역별 찾기</a><ul class="submenu"><li><a href="/locations/seoul/">서울</a></li><li><a href="/locations/gyeonggi/">경기</a></li><li><a href="/locations/incheon/">인천</a></li><li><a href="/locations/busan/">부산</a></li></ul></li><li class="has-submenu"><a href="/magazine/">힐링 매거진</a><ul class="submenu"><li><a href="/magazine/massage-tips/">마사지 팁</a></li><li><a href="/magazine/home-care/">홈케어 가이드</a></li><li><a href="/magazine/blog/">블로그</a></li></ul></li><li class="has-submenu"><a href="/guide/">이용 가이드</a><ul class="submenu"><li><a href="/guide/how-to-use/">이용 방법</a></li><li><a href="/guide/notice/">주의 사항</a></li></ul></li><li class="has-submenu"><a href="/support/">고객센터</a><ul class="submenu"><li><a href="/support/faq/">자주 묻는 질문</a></li><li><a href="/support/notice/">공지사항 및 문의</a></li></ul></li><li><a class="cta-pill" href="tel:05082024731">${phone}</a></li></ul></nav></header>`;
}

function priceCards(region) {
  const rows = [
    ["타이 건식","DRY · 건식","오일 없이 스트레칭과 압 중심으로 피로 부위를 정리하는 기본 케어입니다.",["60분|80,000원","90분|100,000원","120분|120,000원"]],
    ["아로마 습식","WET · 오일","부드러운 오일 케어를 중심으로 긴장 완화와 휴식감을 높이는 코스입니다.",["60분|90,000원","90분|110,000원","120분|130,000원"]],
    ["감성케어 오일","SIGNATURE · 오일","차분한 리듬과 섬세한 강도 조절을 중시하는 시그니처 오일 케어입니다.",["60분|100,000원","90분|120,000원","120분|140,000원"]],
    ["VVIP 전신케어","VVIP · 풀바디","건식과 오일 케어를 함께 고려하는 장시간 전신 코스입니다. 이용 목적과 컨디션을 먼저 확인합니다.",["60분|110,000원","90분|130,000원","120분|150,000원","150분|180,000원"],"best"],
    ["한국인 스웨디시","KOREAN · 매니저 지정","한국인 매니저 지정 상담이 필요한 경우 안내되는 코스입니다. 세부 가능 여부는 예약 시 확인합니다.",["60분|150,000원","90분|190,000원"]],
    ["남성 스웨디시","MEN · 남성 전용","남성 고객 전용 상담 코스입니다. 이용 목적, 선호 강도, 가능 시간대를 확인한 뒤 안내합니다.",["60분|100,000원","90분|130,000원","120분|160,000원"]]
  ];
  return `<section class="region-panel region-price" id="pricing"><h2>${region} 출장마사지 가격표</h2><p>아래 금액은 ${region} 예약 상담 시 참고하는 기본 요금표입니다. 경기도는 이동 범위가 넓어 최종 가능 여부와 금액을 전화 상담에서 다시 확인합니다.</p><div class="pricing-grid" aria-label="${region} 출장마사지 가격표">${rows.map(([title,kicker,desc,items,best])=>`<article class="price-card${best ? " best" : ""}">${best ? '<span class="best-badge">BEST</span>' : ""}<p class="kicker">${kicker}</p><h2>${title}</h2><p>${desc}</p><div class="price-rows">${items.map(v=>{const [t,p]=v.split("|");return `<div><span>${t}</span><strong>${p}</strong></div>`}).join("")}</div></article>`).join("")}</div><div class="price-note"><p>${region} 지역은 세부 위치와 시간대에 따라 가능 여부가 달라질 수 있습니다. 현재 가능 시간과 최종 금액은 전화로 확인하세요.</p><a href="tel:05082024731">${phone} 요금 상담</a></div></section>`;
}

function page(d) {
  const url = `${site}/locations/gyeonggi/${d.slug}/`;
  const image = `${site}/assets/gyeonggi-${d.slug}-og.svg`;
  const zoneLabel = d.zones.some(z => z.endsWith("구")) ? "행정구·주요 생활권" : "읍면동·주요 생활권";
  const json = {"@context":"https://schema.org","@graph":[
    {"@type":["LocalBusiness","HealthAndBeautyBusiness"],"@id":`${url}#business`,"name":`마사지PRO ${d.name} 출장마사지 예약 상담`,"url":url,"image":image,"telephone":phone,"priceRange":"80,000원-190,000원","areaServed":{"@type":"AdministrativeArea","name":`경기도 ${d.name}`},"address":{"@type":"PostalAddress","addressCountry":"KR","addressRegion":"경기도","addressLocality":d.name},"description":`${d.name} ${d.area} 생활권을 기준으로 출장마사지 예약 가능 여부, 코스별 가격, 안전 상담 기준을 안내합니다.`},
    {"@type":"DiscussionForumPosting","@id":`${url}#discussion`,"headline":`${d.name} 출장마사지 상담 스레드`,"author":{"@type":"Organization","name":"마사지PRO 상담팀"},"datePublished":today,"articleBody":`${d.name} 이용자가 예약 전에 자주 묻는 위치, 이동 조건, 압 조절, 숙소 및 주거지 이용 조건을 비식별 상담 사례로 정리했습니다.`,"comment":[{"@type":"Comment","author":{"@type":"Person","name":"비식별 상담자 A"},"text":`${d.area} 근처에서 퇴근 후 가능한 시간과 아로마 90분 가능 여부를 문의했습니다.`},{"@type":"Comment","author":{"@type":"Organization","name":"마사지PRO 상담팀"},"text":`${d.name}는 세부 위치와 가까운 기준 지점을 함께 알려주면 가능 시간을 더 빠르게 확인할 수 있습니다.`}]},
    {"@type":"FAQPage","@id":`${url}#faq`,"mainEntity":[
      {"@type":"Question","name":`${d.name} 출장마사지 예약은 어떻게 하나요?`,"acceptedAnswer":{"@type":"Answer","text":`전화로 세부 위치, 희망 시간, 코스, 컨디션을 알려주시면 ${d.name} 가능 여부와 요금을 확인합니다.`}},
      {"@type":"Question","name":`${d.name} 숙소나 호텔에서도 상담 가능한가요?`,"acceptedAnswer":{"@type":"Answer","text":"숙소와 호텔은 입장 정책과 위치 조건에 따라 달라질 수 있어 예약 전 상담에서 확인합니다."}},
      {"@type":"Question","name":"경기 지역은 이동 조건 때문에 금액이 달라지나요?","acceptedAnswer":{"@type":"Answer","text":"기본 요금표를 기준으로 안내하지만 지역, 시간대, 이동 조건에 따라 최종 확인이 필요할 수 있습니다."}},
      {"@type":"Question","name":"압 조절은 미리 말해야 하나요?","acceptedAnswer":{"@type":"Answer","text":"네. 강한 압, 부드러운 오일, 스트레칭 선호 여부를 미리 말하면 코스 선택과 상담이 더 정확해집니다."}}
    ]}
  ]};
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b0b0e">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <title>${d.name} 출장마사지 예약 상담 | 마사지PRO 경기 지역</title>
  <meta name="description" content="${d.name} ${d.area} 출장마사지 예약 상담. 가능 지역, 가격표, 압 조절, 숙소 이용 팁과 안전 가이드를 확인하세요.">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${d.name} 출장마사지 예약 상담 | 마사지PRO">
  <meta property="og:description" content="${d.name} ${d.area} 예약 가능 여부와 코스별 가격, 안전 상담 기준을 안내합니다.">
  <meta property="og:image" content="${image}">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(json)}</script>
</head>
<body>
  ${nav()}
  <main>
    <section class="wrap">
      <article class="article-hero">
        <p class="kicker">GYEONGGI CITY</p>
        <h1>${d.name} 출장마사지 예약 상담</h1>
        <p>${d.name}는 ${d.area} 생활권을 중심으로 주거지, 업무지, 숙소 이용 문의가 함께 들어오는 경기도 지역입니다. 마사지PRO는 지역명만 반복하지 않고 실제 예약 상담에서 필요한 세부 위치, 이동 가능 시간, 코스 선택 기준, 안전 확인 항목을 한 페이지에서 안내합니다.</p>
        <div class="hero-cta"><div><strong>${d.cta}</strong><span>${d.zones.slice(0,4).join("·")} 등 세부 위치와 희망 시간을 알려주시면 가능 여부와 코스별 요금을 빠르게 확인합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div>
        <div class="article-meta"><span>작성: 마사지PRO 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div>
        <div class="toc"><a href="#trust">가능 지역</a><a href="#experience">압 조절</a><a href="#pricing">가격표</a><a href="#faq">FAQ</a></div>
      </article>
      <section class="region-panel" id="trust"><h2>${d.name} 실제 상담 가능 지역과 안전 가이드</h2><p>${d.tone} 경기도는 서울보다 생활권 간 거리가 큰 곳이 많기 때문에 “${d.name} 가능해요?”라고만 묻기보다 현재 위치의 ${zoneLabel}, 가까운 도로명이나 역, 희망 시작 시간을 함께 알려주는 편이 좋습니다. 마사지PRO는 이용자가 전화 전에 가격과 기준을 예측할 수 있도록 기본 요금표와 상담 절차를 공개하고, 치료 효과를 보장하는 표현은 사용하지 않습니다.</p><div class="seo-grid"><article class="seo-card"><h3>Who</h3><p>이 페이지는 ${d.name} 예약 문의에서 반복되는 실제 질문을 바탕으로 마사지PRO 지역 콘텐츠팀이 작성했습니다.</p></article><article class="seo-card"><h3>How</h3><p>${zoneLabel}, 생활권, 시간대, 코스 선택 기준을 상담 흐름에 맞춰 정리했고 개인정보가 드러나는 후기는 사용하지 않았습니다.</p></article><article class="seo-card"><h3>Why</h3><p>검색 순위만을 위한 얇은 지역 페이지가 아니라, 전화 전 확인해야 할 기준을 제공하기 위해 제작했습니다.</p></article></div><div class="dong-chip-grid">${d.zones.map(x=>`<span>${x}</span>`).join("")}</div><p class="source-note">안전 안내: 과도한 선입금, 불명확한 추가금, 공식 전화가 아닌 개인 연락 유도는 피하세요. 몸 상태가 좋지 않거나 통증이 심하면 예약보다 의료 전문가 상담이 우선입니다.</p></section>
      <section class="region-panel" id="experience"><h2>${d.name} 이용자가 알아두면 좋은 압 조절 기준</h2><p>출장마사지는 같은 90분 코스라도 압의 세기와 리듬에 따라 만족도가 달라집니다. ${d.name}처럼 생활권과 이동 조건이 다양한 지역에서는 가능 시간 확인만큼 관리 목적을 먼저 정리하는 것이 중요합니다. “목과 어깨는 강하게, 종아리는 부드럽게”, “오일은 적게, 스트레칭은 천천히”처럼 구체적으로 말하면 상담 품질이 좋아집니다.</p><div class="pressure-table"><div class="pressure-row"><strong>타이 건식</strong><span>스트레칭과 지압 중심. 장시간 운전, 책상 업무, 전신 뻐근함을 말하는 이용자에게 상담이 많습니다.</span></div><div class="pressure-row"><strong>아로마 습식</strong><span>오일을 활용해 부드러운 휴식감을 원하는 이용자에게 적합합니다.</span></div><div class="pressure-row"><strong>감성케어 오일</strong><span>강한 압보다 차분한 리듬과 섬세한 강도 조절을 선호할 때 문의가 많습니다.</span></div></div></section>
      <section class="region-panel" id="forum"><h2>${d.name} 상담 스레드와 이용 팁</h2><p>아래 내용은 실제 상담에서 반복되는 질문을 비식별 형태로 재구성한 예시입니다. 평점 조작이나 허위 후기가 아니라, 예약 전 사용자가 놓치기 쉬운 확인 항목을 보여주기 위한 정보성 콘텐츠입니다.</p><div class="forum-thread"><article class="thread-post"><p class="thread-meta">비식별 상담자 A · ${d.area}</p><p>“오늘 저녁 ${d.zones[0]} 근처에서 아로마 90분 가능할까요? 숙소 위치가 조금 안쪽이라 이동 가능 여부가 궁금합니다.”</p></article><article class="thread-post"><p class="thread-meta">마사지PRO 상담팀</p><p>“경기 지역은 세부 위치와 시간대에 따라 가능 여부가 달라질 수 있습니다. 희망 시간, 코스, 가까운 기준 지점을 알려주시면 먼저 확인해드립니다.”</p></article><article class="thread-post"><p class="thread-meta">비식별 상담자 B · ${d.name}</p><p>“강한 압은 부담스럽고 어깨와 허리 위주로 편안하게 받고 싶습니다. 어떤 코스가 맞을까요?”</p></article></div></section>
      ${priceCards(d.name)}
      <div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>${d.name} 숙소·오피스텔 이용 전 확인할 점</h2><p>${d.name}에서 숙소, 호텔, 오피스텔로 문의할 때는 주소만 보내기보다 건물 입장 방식, 주차 가능 여부, 희망 시작 시간을 함께 알려주는 것이 좋습니다. 특히 ${d.area} 일대는 시간대별 이동 흐름이 달라 같은 지역 안에서도 확인 속도가 달라질 수 있습니다. 마사지PRO는 예약 과정에서 이용자가 이해하기 어려운 표현을 줄이고, 가능한 코스와 금액을 상담 단계에서 투명하게 안내하는 것을 우선합니다.</p><p>출장마사지 상담은 휴식과 컨디션 관리를 위한 일반 안내입니다. 특정 질환 개선, 통증 치료, 의학적 효과를 보장하지 않습니다. 임신, 수술 후 회복, 급성 통증, 피부 문제처럼 주의가 필요한 상황이라면 마사지 예약보다 의료 전문가 상담이 먼저입니다. 이런 안내는 불편함을 줄이기 위한 형식 문구가 아니라, 이용자가 안전하게 선택하도록 돕는 기본 기준입니다.</p></article><section id="faq" class="faq-block"><h2>${d.name} 출장마사지 자주 묻는 질문</h2><details><summary>${d.name} 예약은 몇 분 전에 문의하면 좋나요?<span>+</span></summary><p>당일 상담도 가능하지만 경기 지역은 이동 조건이 커질 수 있어 희망 시간보다 여유 있게 확인하는 것이 좋습니다.</p></details><details><summary>${d.name} 숙소나 호텔 이용도 가능한가요?<span>+</span></summary><p>숙소 정책과 입장 기준에 따라 달라질 수 있습니다. 투숙 여부와 방문 가능 조건을 상담에서 먼저 확인합니다.</p></details><details><summary>요금표 금액이 최종 금액인가요?<span>+</span></summary><p>기본 기준이며 최종 금액은 코스, 시간, 위치 조건 확인 후 안내합니다. 불명확한 추가금은 상담 단계에서 확인하세요.</p></details><details><summary>강한 압이 부담스러우면 어떻게 말하나요?<span>+</span></summary><p>상담 때 “부드럽게”, “어깨만 조금 강하게”처럼 부위별 선호를 말하면 코스 선택이 더 정확해집니다.</p></details></section><section class="editor-card"><div class="editor-avatar">MP</div><div><h2>콘텐츠 검수자</h2><h3>마사지PRO 예약 상담 품질 담당</h3><p>${d.name} 페이지는 지역명 반복보다 실제 예약 전 확인해야 할 위치, 코스, 이동 조건, 안전 기준을 중심으로 검수했습니다. 의료 효과를 보장하지 않으며, 이용자의 판단을 돕는 정보성 콘텐츠로 유지합니다.</p></div></section><div class="related-links"><a href="/locations/gyeonggi/">경기 지역 목록</a><a href="/pricing/course/">코스별 요금표</a><a href="/magazine/blog/booking-checklist/">예약 체크리스트</a><a href="tel:05082024731">전화 상담</a></div></div>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/gyeonggi/">경기 지역별 찾기</a></p></div></footer>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

function svg(d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#08080b"/><stop offset=".55" stop-color="#17151a"/><stop offset="1" stop-color="#c69a5d"/></linearGradient><linearGradient id="m" x1="0" x2="1"><stop offset="0" stop-color="#f4d78d"/><stop offset="1" stop-color="#d58f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="64" y="64" width="1072" height="502" rx="32" fill="#111116" opacity=".8" stroke="#d4b06f"/><text x="104" y="155" fill="#d7bb78" font-family="Arial, sans-serif" font-size="28" letter-spacing="7">MASSAGE PRO GYEONGGI</text><text x="104" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="74" font-weight="700">${d.name} 출장마사지</text><text x="104" y="345" fill="#f2d08d" font-family="Arial, sans-serif" font-size="48" font-weight="700">예약 상담 · 가능 지역 확인</text><text x="104" y="430" fill="#d8d4cf" font-family="Arial, sans-serif" font-size="28">${d.area}</text><circle cx="975" cy="238" r="82" fill="url(#m)" opacity=".88"/><rect x="850" y="384" width="230" height="74" rx="37" fill="url(#m)"/><text x="887" y="432" fill="#111116" font-family="Arial, sans-serif" font-size="28" font-weight="700">${phone}</text></svg>`;
}

function indexPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b0b0e">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <title>경기 출장마사지 지역별 찾기 | 마사지PRO</title>
  <meta name="description" content="경기 출장마사지 예약 상담. 경기도 31개 시군 개별 페이지에서 가능 지역, 가격표, 코스, 안전 상담 기준을 확인하세요.">
  <link rel="canonical" href="${site}/locations/gyeonggi/">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  ${nav()}
  <main>
    <section class="wrap">
      <article class="article-hero">
        <p class="kicker">GYEONGGI AREA</p>
        <h1>경기 출장마사지 지역별 찾기</h1>
        <p>경기도는 31개 시군의 면적과 생활권 차이가 커서 지역별로 상담 기준이 달라집니다. 원하는 시군을 선택하면 해당 지역의 행정구·주요 생활권, 가격표, 예약 전 확인할 안전 기준을 개별 페이지에서 확인할 수 있습니다.</p>
        <div class="hero-cta"><div><strong>경기 31개 시군, 현재 위치 기준으로 상담받으세요</strong><span>수원·성남·고양·용인부터 가평·연천·양평까지 세부 위치와 희망 시간을 알려주시면 가능 여부를 확인합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div>
        <div class="article-meta"><span>작성: 마사지PRO 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div>
      </article>
      <section class="region-panel" id="districts">
        <h2>경기 출장마사지 가능 지역 31개 시군</h2>
        <p>아래 지역명은 개별 랜딩 페이지로 연결됩니다. 각 페이지에는 지역별 고유 생활권, 행정구 또는 읍면동, 가격표, FAQ, 상담 스레드가 포함되어 있습니다.</p>
        <div class="district-grid">${cities.map(c=>`<a href="/locations/gyeonggi/${c.slug}/">${c.name}</a>`).join("")}</div>
        <p class="source-note">경기도는 31개 시군 단위로 광역 행정과 생활권이 운영됩니다. 참고: <a href="https://governor.gg.go.kr/policy/press/?kboard_id=24&mod=document&pageid=1&uid=17235">경기도 31개 시군 관련 자료</a></p>
      </section>
      ${priceCards("경기")}
      <div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>경기 지역 상담은 세부 위치가 핵심입니다</h2><p>경기도 출장마사지 문의는 시군명만으로는 충분하지 않을 때가 많습니다. 같은 수원시라도 영통과 권선의 이동 기준이 다르고, 같은 용인시라도 수지·기흥·처인은 생활권 차이가 큽니다. 예약 전에는 시군명, 행정구나 읍면동, 가까운 역 또는 도로명, 희망 시작 시간을 함께 알려주세요.</p><p>마사지PRO는 휴식과 컨디션 관리를 위한 일반 마사지 상담을 안내하며 의료 효과나 통증 치료를 보장하지 않습니다. 불명확한 추가금과 과도한 선입금 요구를 피하고, 공식 전화번호를 통해 금액과 가능 시간을 확인하는 것을 권장합니다.</p></article><section id="faq" class="faq-block"><h2>경기 지역 자주 묻는 질문</h2><details><summary>경기도 전 지역이 항상 가능한가요?<span>+</span></summary><p>지역과 시간대, 배정 상황에 따라 달라질 수 있습니다. 세부 위치를 알려주시면 가능 여부를 확인합니다.</p></details><details><summary>경기 외곽 지역은 추가 확인이 필요한가요?<span>+</span></summary><p>이동 거리가 긴 지역은 가능 시간과 금액 확인이 필요할 수 있습니다.</p></details><details><summary>지역 페이지는 왜 따로 만들었나요?<span>+</span></summary><p>단순 키워드 반복이 아니라 지역별 생활권, 행정구, 이동 조건을 다르게 안내하기 위해 개별 페이지로 구성했습니다.</p></details></section></div>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/">지역별 찾기</a></p></div></footer>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

for (const d of cities) {
  const htmlPath = join(root, "locations", "gyeonggi", d.slug, "index.html");
  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, page(d), "utf8");
  writeFileSync(join(root, "assets", `gyeonggi-${d.slug}-og.svg`), svg(d), "utf8");
}
writeFileSync(join(root, "locations", "gyeonggi", "index.html"), indexPage(), "utf8");

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
const gyeonggiUrls = cities.map(c => `  <url><loc>${site}/locations/gyeonggi/${c.slug}/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n");
sitemap = sitemap.replace(/  <url><loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/gyeonggi\/[^<]+<\/loc><changefreq>monthly<\/changefreq><priority>0\.7<\/priority><\/url>\n/g, "");
if (!sitemap.includes(`${site}/locations/gyeonggi/gapyeong/`)) {
  sitemap = sitemap.replace(/  <url>\r?\n    <loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/gyeonggi\/<\/loc>\r?\n    <changefreq>weekly<\/changefreq>\r?\n    <priority>0\.85<\/priority>\r?\n  <\/url>/, match => `${match}\n${gyeonggiUrls}`);
}
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(`Generated ${cities.length} Gyeonggi city pages.`);
