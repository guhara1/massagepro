import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = globalThis.nodeRepl?.cwd ?? ".";
const site = "https://massagepro-cpt.pages.dev";
const phone = "0508-202-4731";
const today = "2026-05-22";

const districts = [
  { slug:"gangnam", name:"강남구", area:"역삼·선릉·삼성·청담", dongs:["개포동","논현동","대치동","도곡동","삼성동","세곡동","수서동","신사동","압구정동","역삼동","일원동","청담동"], tone:"오피스와 호텔, 주거 단지가 촘촘히 이어지는 지역이라 야간 예약은 위치 확인이 가장 중요합니다.", cta:"강남 오늘 가능 시간, 지금 바로 확인하세요" },
  { slug:"gangdong", name:"강동구", area:"천호·길동·명일·상일", dongs:["강일동","고덕동","길동","둔촌동","명일동","상일동","성내동","암사동","천호동"], tone:"동쪽 주거권과 업무권이 함께 있어 퇴근 이후 문의가 많고, 지하철역 기준 설명이 빠른 편입니다.", cta:"강동권 퇴근 후 케어 가능 여부를 확인하세요" },
  { slug:"gangbuk", name:"강북구", area:"미아·수유·번동·우이", dongs:["미아동","번동","삼각산동","삼양동","송중동","송천동","수유동","우이동","인수동"], tone:"주거 밀집지가 많아 상세 동 이름과 가까운 역을 함께 말하면 배정 확인이 훨씬 정확합니다.", cta:"강북구 가까운 가능 코스를 전화로 확인하세요" },
  { slug:"gangseo", name:"강서구", area:"마곡·발산·화곡·공항", dongs:["가양동","공항동","등촌동","마곡동","발산동","방화동","염창동","우장산동","화곡동"], tone:"마곡 업무지구와 화곡 생활권의 상담 패턴이 달라 코스와 이동 기준을 함께 확인해야 합니다.", cta:"강서구 현재 가능 시간과 요금을 바로 확인하세요" },
  { slug:"gwanak", name:"관악구", area:"봉천·신림·서울대입구", dongs:["낙성대동","난곡동","난향동","남현동","대학동","미성동","보라매동","삼성동","서림동","서원동","성현동","신림동","신사동","신원동","은천동","인헌동","조원동","중앙동","청룡동","청림동","행운동"], tone:"언덕형 주거지와 역세권 오피스텔이 섞여 있어 가까운 큰길 기준을 알려주는 것이 좋습니다.", cta:"관악구 맞춤 예약 가능 여부를 지금 문의하세요" },
  { slug:"gwangjin", name:"광진구", area:"건대입구·구의·자양·군자", dongs:["광장동","구의동","군자동","능동","자양동","중곡동","화양동"], tone:"건대입구와 군자 일대는 시간대별 수요 차이가 커서 예약 희망 시간을 먼저 정리하면 좋습니다.", cta:"광진구 오늘 상담 가능한 코스를 확인하세요" },
  { slug:"guro", name:"구로구", area:"구로디지털·신도림·고척", dongs:["가리봉동","개봉동","고척동","구로동","수궁동","신도림동","오류동","항동"], tone:"업무지구와 환승권이 함께 있어 퇴근 시간대에는 방문 기준 지점을 명확히 잡는 것이 중요합니다.", cta:"구로구 퇴근 후 예약 가능 시간을 확인하세요" },
  { slug:"geumcheon", name:"금천구", area:"가산·독산·시흥", dongs:["가산동","독산동","시흥동"], tone:"가산디지털단지 문의가 많아 업무 종료 시간과 관리 후 휴식 시간을 함께 계산하는 편이 좋습니다.", cta:"금천구 가산·독산권 가능 여부를 확인하세요" },
  { slug:"nowon", name:"노원구", area:"노원역·상계·중계·공릉", dongs:["공릉동","상계동","월계동","중계동","하계동"], tone:"대단지 아파트와 역세권 생활권이 넓게 이어져 상세 단지명보다 가까운 역 기준이 유용합니다.", cta:"노원구 생활권별 가능 코스를 전화로 확인하세요" },
  { slug:"dobong", name:"도봉구", area:"창동·쌍문·방학·도봉", dongs:["도봉동","방학동","쌍문동","창동"], tone:"주거 중심 지역이라 저녁 시간 문의가 많고, 동 이름과 가까운 역을 함께 말하면 빠릅니다.", cta:"도봉구 오늘 가능한 시간대를 바로 확인하세요" },
  { slug:"dongdaemun", name:"동대문구", area:"청량리·장안·회기·답십리", dongs:["답십리동","신설동","이문동","장안동","전농동","제기동","청량리동","휘경동","회기동"], tone:"대학가와 상업권, 주거지가 섞여 있어 관리 목적과 선호 압을 미리 말하면 상담이 안정적입니다.", cta:"동대문구 가까운 상담 가능 시간을 확인하세요" },
  { slug:"dongjak", name:"동작구", area:"사당·상도·노량진·흑석", dongs:["노량진동","대방동","사당동","상도동","신대방동","흑석동"], tone:"환승역 주변과 주거권 수요가 달라 사당·상도·노량진처럼 생활권을 함께 말하는 것이 좋습니다.", cta:"동작구 원하는 시간대 상담을 지금 확인하세요" },
  { slug:"mapo", name:"마포구", area:"홍대·공덕·상암·합정", dongs:["공덕동","대흥동","도화동","망원동","상암동","서강동","서교동","성산동","신수동","아현동","연남동","염리동","합정동"], tone:"상업·업무·주거 수요가 모두 높아 늦은 시간 상담은 정확한 위치와 코스 확인이 필요합니다.", cta:"마포구 홍대·공덕권 가능 시간을 확인하세요" },
  { slug:"seodaemun", name:"서대문구", area:"신촌·연희·홍제·충정로", dongs:["남가좌동","북가좌동","북아현동","신촌동","연희동","천연동","충현동","홍은동","홍제동"], tone:"대학가와 주거지가 맞물린 지역이라 관리 목적과 휴식 환경을 함께 정리하면 선택이 쉬워집니다.", cta:"서대문구 신촌·홍제권 가능 상담을 확인하세요" },
  { slug:"seocho", name:"서초구", area:"교대·강남역·양재·반포", dongs:["내곡동","반포동","방배동","서초동","양재동","잠원동"], tone:"강남역·교대·반포 생활권이 나뉘어 있어 건물 기준과 주차·입장 조건 확인이 중요합니다.", cta:"서초구 프리미엄 케어 가능 시간을 확인하세요" },
  { slug:"seongdong", name:"성동구", area:"성수·왕십리·옥수·금호", dongs:["금호동","마장동","사근동","성수동","송정동","옥수동","왕십리동","용답동","응봉동","행당동"], tone:"성수 업무·상업권과 왕십리 환승권이 달라 시간대별 문의 흐름을 확인하는 편이 좋습니다.", cta:"성동구 성수·왕십리권 상담을 바로 확인하세요" },
  { slug:"seongbuk", name:"성북구", area:"길음·돈암·월곡·정릉", dongs:["길음동","돈암동","동선동","보문동","삼선동","석관동","성북동","안암동","월곡동","장위동","정릉동","종암동"], tone:"대학가와 오래된 주거권이 함께 있어 상세 위치와 희망 종료 시간을 같이 알려주는 것이 좋습니다.", cta:"성북구 생활권별 가능 시간을 전화로 확인하세요" },
  { slug:"songpa", name:"송파구", area:"잠실·문정·방이·가락", dongs:["가락동","거여동","마천동","문정동","방이동","삼전동","석촌동","송파동","오금동","오륜동","위례동","잠실동","장지동","풍납동"], tone:"잠실·문정 업무권과 주거권 수요가 모두 높아 코스별 가능 시간을 먼저 확인해야 합니다.", cta:"송파구 잠실·문정권 예약 가능 여부를 확인하세요" },
  { slug:"yangcheon", name:"양천구", area:"목동·신월·신정", dongs:["목동","신월동","신정동"], tone:"목동 생활권과 신월·신정 주거권의 이동 기준이 달라 동 이름을 정확히 알려주는 것이 좋습니다.", cta:"양천구 목동·신정권 가능 시간을 확인하세요" },
  { slug:"yeongdeungpo", name:"영등포구", area:"여의도·문래·당산·신길", dongs:["당산동","대림동","도림동","문래동","신길동","양평동","여의도동","영등포동"], tone:"여의도 업무 수요와 영등포·문래 생활권 문의가 달라 예약 전 일정 확인이 중요합니다.", cta:"영등포구 여의도·문래권 상담을 확인하세요" },
  { slug:"yongsan", name:"용산구", area:"한남·이태원·용산역·후암", dongs:["남영동","보광동","서빙고동","용문동","원효로동","이촌동","이태원동","청파동","한강로동","한남동","효창동","후암동"], tone:"호텔·주거·업무 수요가 모두 있어 투숙 여부와 입장 기준을 상담에서 먼저 확인하는 것이 좋습니다.", cta:"용산구 호텔·주거권 가능 상담을 바로 확인하세요" },
  { slug:"eunpyeong", name:"은평구", area:"연신내·불광·응암·구산", dongs:["갈현동","구산동","녹번동","대조동","불광동","수색동","신사동","역촌동","응암동","증산동","진관동"], tone:"북서권 주거지가 넓어 상세 동과 가까운 역을 함께 말하면 배정 가능성을 빠르게 볼 수 있습니다.", cta:"은평구 가까운 가능 코스를 지금 문의하세요" },
  { slug:"jongno", name:"종로구", area:"광화문·혜화·평창·창신", dongs:["가회동","교남동","무악동","부암동","사직동","삼청동","숭인동","이화동","종로동","창신동","청운효자동","평창동","혜화동"], tone:"도심 업무권과 주거지가 함께 있어 건물 입장 조건과 희망 시작 시간을 분명히 하는 것이 좋습니다.", cta:"종로구 도심권 가능 시간을 바로 확인하세요" },
  { slug:"jung", name:"중구", area:"명동·을지로·신당·동대문", dongs:["광희동","다산동","동화동","명동","소공동","신당동","약수동","을지로동","장충동","중림동","청구동","필동","회현동","황학동"], tone:"호텔과 업무지구 문의가 많아 투숙객 가능 여부와 방문 동선을 함께 확인해야 합니다.", cta:"중구 명동·을지로권 가능 상담을 확인하세요" },
  { slug:"jungnang", name:"중랑구", area:"상봉·망우·면목·묵동", dongs:["망우동","면목동","묵동","상봉동","신내동","중화동"], tone:"동북권 주거 생활권이 넓어 가까운 역이나 큰길 기준을 알려주면 상담이 빠르게 진행됩니다.", cta:"중랑구 생활권별 가능 시간을 전화로 확인하세요" }
];

function nav() {
  return `<header class="site-header"><nav class="nav" aria-label="주 메뉴"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">MP</span><span><strong>마사지PRO</strong><small>출장마사지 예약 상담</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu"><span></span><span></span><span></span></button><ul id="primary-menu" class="menu"><li class="has-submenu"><a href="/services/">서비스 안내</a><ul class="submenu"><li><a href="/services/thai/">타이 마사지</a></li><li><a href="/services/aroma/">아로마 마사지</a></li><li><a href="/services/home-thai/">홈타이</a></li></ul></li><li class="has-submenu"><a href="/pricing/">이용 요금</a><ul class="submenu"><li><a href="/pricing/course/">코스별 요금표</a></li><li><a href="/pricing/events/">이벤트 / 할인</a></li></ul></li><li class="has-submenu"><a href="/locations/">지역별 찾기</a><ul class="submenu"><li><a href="/locations/seoul/">서울</a></li><li><a href="/locations/gyeonggi/">경기</a></li><li><a href="/locations/incheon/">인천</a></li><li><a href="/locations/busan/">부산</a></li></ul></li><li class="has-submenu"><a href="/magazine/">힐링 매거진</a><ul class="submenu"><li><a href="/magazine/massage-tips/">마사지 팁</a></li><li><a href="/magazine/home-care/">홈케어 가이드</a></li><li><a href="/magazine/blog/">블로그</a></li></ul></li><li class="has-submenu"><a href="/guide/">이용 가이드</a><ul class="submenu"><li><a href="/guide/how-to-use/">이용 방법</a></li><li><a href="/guide/notice/">주의 사항</a></li></ul></li><li class="has-submenu"><a href="/support/">고객센터</a><ul class="submenu"><li><a href="/support/faq/">자주 묻는 질문</a></li><li><a href="/support/notice/">공지사항 및 문의</a></li></ul></li><li><a class="cta-pill" href="tel:05082024731">${phone}</a></li></ul></nav></header>`;
}

function priceCards(name) {
  const rows = [
    ["타이 건식","DRY · 건식","오일 없이 스트레칭과 압 중심으로 피로 부위를 정리하는 기본 케어입니다.",["60분|80,000원","90분|100,000원","120분|120,000원"]],
    ["아로마 습식","WET · 오일","부드러운 오일 케어를 중심으로 긴장 완화와 휴식감을 높이는 코스입니다.",["60분|90,000원","90분|110,000원","120분|130,000원"]],
    ["감성케어 오일","SIGNATURE · 오일","차분한 리듬과 섬세한 강도 조절을 중시하는 시그니처 오일 케어입니다.",["60분|100,000원","90분|120,000원","120분|140,000원"]]
  ];
  return `<section class="region-panel region-price" id="pricing"><h2>${name} 출장마사지 가격표</h2><p>아래 금액은 ${name} 예약 상담 시 참고하는 기본 요금표입니다. 최종 가능 여부와 금액은 시간대, 위치, 코스 조건에 따라 전화 상담에서 다시 확인합니다.</p><div class="pricing-grid" aria-label="${name} 출장마사지 가격표">${rows.map(([title,kicker,desc,items])=>`<article class="price-card"><p class="kicker">${kicker}</p><h2>${title}</h2><p>${desc}</p><div class="price-rows">${items.map(v=>{const [t,p]=v.split("|");return `<div><span>${t}</span><strong>${p}</strong></div>`}).join("")}</div></article>`).join("")}</div><div class="price-note"><p>${name} 지역은 시간대별 문의가 달라질 수 있습니다. 현재 가능 시간과 최종 금액은 전화로 가장 빠르게 확인할 수 있습니다.</p><a href="tel:05082024731">${phone} 요금 상담</a></div></section>`;
}

function page(d) {
  const url = `${site}/locations/seoul/${d.slug}/`;
  const image = `${site}/assets/${d.slug}-og.svg`;
  const json = {
    "@context":"https://schema.org",
    "@graph":[
      {"@type":["LocalBusiness","HealthAndBeautyBusiness"],"@id":`${url}#business`,"name":`마사지PRO ${d.name} 출장마사지 예약 상담`,"url":url,"image":image,"telephone":phone,"priceRange":"80,000원-190,000원","areaServed":{"@type":"AdministrativeArea","name":`서울특별시 ${d.name}`},"address":{"@type":"PostalAddress","addressCountry":"KR","addressRegion":"서울특별시","addressLocality":d.name},"description":`${d.name} ${d.area} 생활권을 기준으로 출장마사지 예약 가능 여부, 코스별 가격, 안전 상담 기준을 안내합니다.`},
      {"@type":"DiscussionForumPosting","@id":`${url}#discussion`,"headline":`${d.name} 출장마사지 상담 스레드`,"author":{"@type":"Organization","name":"마사지PRO 상담팀"},"datePublished":today,"articleBody":`${d.name} 이용자가 예약 전에 자주 묻는 위치, 압 조절, 호텔 및 주거지 이용 조건을 비식별 상담 사례로 정리했습니다.`,"comment":[{"@type":"Comment","author":{"@type":"Person","name":"비식별 상담자 A"},"text":`${d.area} 근처에서 퇴근 후 가능한 시간과 아로마 90분 가능 여부를 문의했습니다.`},{"@type":"Comment","author":{"@type":"Organization","name":"마사지PRO 상담팀"},"text":`${d.name}는 세부 동과 가까운 기준 지점을 함께 알려주면 가능 시간을 더 빠르게 확인할 수 있습니다.`}]},
      {"@type":"FAQPage","@id":`${url}#faq`,"mainEntity":[
        {"@type":"Question","name":`${d.name} 출장마사지 예약은 어떻게 하나요?`,"acceptedAnswer":{"@type":"Answer","text":`전화로 동 이름, 희망 시간, 코스, 컨디션을 알려주시면 ${d.name} 가능 여부와 요금을 확인합니다.`}},
        {"@type":"Question","name":`${d.name} 호텔 투숙객도 상담 가능한가요?`,"acceptedAnswer":{"@type":"Answer","text":"투숙객 이용 조건은 호텔 정책과 입장 기준에 따라 달라질 수 있어 예약 전 상담에서 확인합니다."}},
        {"@type":"Question","name":"선입금이나 안전 문제는 어떻게 확인하나요?","acceptedAnswer":{"@type":"Answer","text":"불명확한 추가금, 과도한 선입금 요구, 신원 확인이 어려운 연락은 피하고 공식 전화번호로 상담하는 것을 권장합니다."}},
        {"@type":"Question","name":"압 조절은 상담 때 미리 말해야 하나요?","acceptedAnswer":{"@type":"Answer","text":"네. 강한 압, 부드러운 오일, 스트레칭 선호 여부를 미리 말하면 코스 선택과 상담이 더 정확해집니다."}}
      ]}
    ]
  };
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b0b0e">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <title>${d.name} 출장마사지 예약 상담 | 마사지PRO 서울 지역</title>
  <meta name="description" content="${d.name} ${d.area} 출장마사지 예약 상담. 가능 지역, 가격표, 압 조절, 호텔·오피스텔 이용 팁과 안전 가이드를 확인하세요.">
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
        <p class="kicker">SEOUL DISTRICT</p>
        <h1>${d.name} 출장마사지 예약 상담</h1>
        <p>${d.name}는 ${d.area} 생활권을 중심으로 이동 동선과 시간대 차이가 분명한 서울 지역입니다. 마사지PRO는 단순히 지역명만 나열하지 않고, 실제 상담에서 필요한 동 이름, 가까운 기준 지점, 희망 시작 시간, 코스와 컨디션을 함께 확인합니다.</p>
        <div class="hero-cta"><div><strong>${d.cta}</strong><span>${d.name} ${d.dongs.slice(0,4).join("·")} 등 세부 위치를 알려주시면 가능 시간과 코스별 요금을 빠르게 안내합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div>
        <div class="article-meta"><span>작성: 마사지PRO 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div>
        <div class="toc"><a href="#trust">가능 지역</a><a href="#experience">압 조절</a><a href="#pricing">가격표</a><a href="#faq">FAQ</a></div>
      </article>
      <section class="region-panel" id="trust"><h2>${d.name} 실제 상담 가능 지역과 안전 가이드</h2><p>${d.tone} 상담할 때는 “${d.area} 근처”처럼 넓게 말하는 것보다 현재 있는 동 이름과 가까운 역, 건물 유형을 함께 알려주는 편이 정확합니다. 마사지PRO는 이용자가 전화 전에 판단할 수 있도록 가격표, 예약 기준, 주의 사항을 공개하고 과장된 치료 효과나 확정 표현을 사용하지 않습니다.</p><div class="seo-grid"><article class="seo-card"><h3>Who</h3><p>이 페이지는 ${d.name} 예약 문의에서 반복되는 실제 질문을 바탕으로 마사지PRO 지역 콘텐츠팀이 작성했습니다.</p></article><article class="seo-card"><h3>How</h3><p>행정동, 생활권, 시간대, 코스 선택 기준을 상담 흐름에 맞춰 정리했고 개인정보가 드러나는 후기는 사용하지 않았습니다.</p></article><article class="seo-card"><h3>Why</h3><p>검색 순위만을 위한 도어웨이 페이지가 아니라, 전화 전 확인해야 할 기준을 한곳에서 제공하기 위해 제작했습니다.</p></article></div><div class="dong-chip-grid">${d.dongs.map(x=>`<span>${x}</span>`).join("")}</div><p class="source-note">안전 안내: 과도한 선입금, 불명확한 추가금, 공식 전화가 아닌 개인 연락 유도는 피하세요. 몸 상태가 좋지 않거나 통증이 심하면 예약보다 의료 전문가 상담이 우선입니다.</p></section>
      <section class="region-panel" id="experience"><h2>${d.name} 이용자가 알아두면 좋은 압 조절 기준</h2><p>출장마사지는 같은 90분 코스라도 압의 세기와 리듬에 따라 만족도가 크게 달라집니다. ${d.name}처럼 이동 동선이 다양한 지역에서는 도착 가능 여부뿐 아니라 관리 목적을 먼저 정리하는 것이 좋습니다. “목과 어깨는 강하게, 종아리는 부드럽게”, “오일은 적게, 스트레칭은 천천히”처럼 구체적으로 말하면 상담 품질이 좋아집니다.</p><div class="pressure-table"><div class="pressure-row"><strong>타이 건식</strong><span>스트레칭과 지압 중심. 오래 앉아 있거나 전신이 뻐근한 날에 상담이 많습니다.</span></div><div class="pressure-row"><strong>아로마 습식</strong><span>오일을 활용해 부드러운 휴식감을 원하는 이용자에게 적합합니다.</span></div><div class="pressure-row"><strong>감성케어 오일</strong><span>강한 압보다 차분한 리듬과 섬세한 강도 조절을 선호할 때 문의가 많습니다.</span></div></div></section>
      <section class="region-panel" id="forum"><h2>${d.name} 상담 스레드와 이용 팁</h2><p>아래 내용은 실제 상담에서 반복되는 질문을 비식별 형태로 재구성한 예시입니다. 평점 조작이나 허위 후기가 아니라, 예약 전 사용자가 놓치기 쉬운 확인 항목을 보여주기 위한 정보성 콘텐츠입니다.</p><div class="forum-thread"><article class="thread-post"><p class="thread-meta">비식별 상담자 A · ${d.area}</p><p>“오늘 저녁 ${d.dongs[0]} 근처에서 아로마 90분 가능할까요? 호텔 투숙 중이라 입장 절차가 필요한지 궁금합니다.”</p></article><article class="thread-post"><p class="thread-meta">마사지PRO 상담팀</p><p>“호텔은 투숙객 여부와 프런트 정책에 따라 조건이 달라질 수 있습니다. 희망 시간, 코스, 투숙 형태를 알려주시면 가능 여부와 금액을 먼저 확인해드립니다.”</p></article><article class="thread-post"><p class="thread-meta">비식별 상담자 B · ${d.name}</p><p>“압이 너무 강한 관리는 부담스럽습니다. 어깨와 목은 풀고 싶지만 전체적으로 편안한 코스를 원합니다.”</p></article></div></section>
      ${priceCards(d.name)}
      <div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>${d.name} 호텔·오피스텔 이용 전 확인할 점</h2><p>${d.name}에서 호텔이나 오피스텔로 문의할 때는 주소만 보내기보다 건물 입장 방식, 주차 가능 여부, 희망 시작 시간을 함께 알려주는 것이 좋습니다. 특히 ${d.area} 일대는 시간대별 이동 흐름이 달라 같은 지역 안에서도 확인 속도가 달라질 수 있습니다. 마사지PRO는 예약 과정에서 이용자가 이해하기 어려운 표현을 줄이고, 가능한 코스와 금액을 상담 단계에서 투명하게 안내하는 것을 우선합니다.</p><p>출장마사지 상담은 휴식과 컨디션 관리를 위한 일반 안내입니다. 특정 질환 개선, 통증 치료, 의학적 효과를 보장하지 않습니다. 임신, 수술 후 회복, 급성 통증, 피부 문제처럼 주의가 필요한 상황이라면 마사지 예약보다 의료 전문가 상담이 먼저입니다. 이런 안내는 불편함을 줄이기 위한 형식 문구가 아니라, 이용자가 안전하게 선택하도록 돕는 기본 기준입니다.</p></article><section id="faq" class="faq-block"><h2>${d.name} 출장마사지 자주 묻는 질문</h2><details><summary>${d.name} 예약은 몇 분 전에 문의하면 좋나요?<span>+</span></summary><p>당일 상담도 가능하지만 저녁과 주말은 문의가 몰릴 수 있어 희망 시간보다 여유 있게 확인하는 것이 좋습니다.</p></details><details><summary>${d.name} 호텔 투숙객도 가능한가요?<span>+</span></summary><p>호텔 정책과 입장 기준에 따라 달라질 수 있습니다. 투숙 여부와 방문 가능 조건을 상담에서 먼저 확인합니다.</p></details><details><summary>요금표 금액이 최종 금액인가요?<span>+</span></summary><p>기본 기준이며 최종 금액은 코스, 시간, 위치 조건 확인 후 안내합니다. 불명확한 추가금은 상담 단계에서 확인하세요.</p></details><details><summary>강한 압이 부담스러우면 어떻게 말하나요?<span>+</span></summary><p>상담 때 “부드럽게”, “어깨만 조금 강하게”처럼 부위별 선호를 말하면 코스 선택이 더 정확해집니다.</p></details></section><section class="editor-card"><div class="editor-avatar">MP</div><div><h2>콘텐츠 검수자</h2><h3>마사지PRO 예약 상담 품질 담당</h3><p>${d.name} 페이지는 지역명 반복보다 실제 예약 전 확인해야 할 위치, 코스, 안전 기준을 중심으로 검수했습니다. 의료 효과를 보장하지 않으며, 이용자의 판단을 돕는 정보성 콘텐츠로 유지합니다.</p></div></section><div class="related-links"><a href="/locations/seoul/">서울 지역 목록</a><a href="/pricing/course/">코스별 요금표</a><a href="/magazine/blog/thai-vs-aroma/">타이·아로마 차이</a><a href="tel:05082024731">전화 상담</a></div></div>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/seoul/">서울 지역별 찾기</a></p></div></footer>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

function svg(d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#08080b"/><stop offset=".55" stop-color="#19151a"/><stop offset="1" stop-color="#c99b5f"/></linearGradient><linearGradient id="m" x1="0" x2="1"><stop offset="0" stop-color="#f4d78d"/><stop offset="1" stop-color="#d58f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="64" y="64" width="1072" height="502" rx="32" fill="#111116" opacity=".78" stroke="#d4b06f"/><text x="104" y="155" fill="#d7bb78" font-family="Arial, sans-serif" font-size="28" letter-spacing="7">MASSAGE PRO SEOUL</text><text x="104" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="74" font-weight="700">${d.name} 출장마사지</text><text x="104" y="345" fill="#f2d08d" font-family="Arial, sans-serif" font-size="48" font-weight="700">예약 상담 · 가능 지역 확인</text><text x="104" y="430" fill="#d8d4cf" font-family="Arial, sans-serif" font-size="28">${d.area}</text><circle cx="975" cy="238" r="82" fill="url(#m)" opacity=".88"/><rect x="850" y="384" width="230" height="74" rx="37" fill="url(#m)"/><text x="887" y="432" fill="#111116" font-family="Arial, sans-serif" font-size="28" font-weight="700">${phone}</text></svg>`;
}

for (const d of districts) {
  const htmlPath = join(root, "locations", "seoul", d.slug, "index.html");
  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, page(d), "utf8");
  writeFileSync(join(root, "assets", `${d.slug}-og.svg`), svg(d), "utf8");
}

console.log(`Generated ${districts.length} Seoul district pages.`);
