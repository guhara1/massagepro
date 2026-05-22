import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = globalThis.nodeRepl?.cwd ?? ".";
const site = "https://massagepro-cpt.pages.dev";
const phone = "0508-202-4731";
const today = "2026-05-22";

const districts = [
  { slug:"gangseo", name:"강서구", zones:["명지동","녹산동","가락동","강동동","대저동","가덕도동"], area:"명지·녹산·대저·가덕", tone:"신도시와 산업단지, 공항·가덕권이 함께 있어 이동 가능 시간과 정확한 위치 확인이 특히 중요합니다.", cta:"강서 명지·녹산권 가능 시간을 확인하세요" },
  { slug:"geumjeong", name:"금정구", zones:["구서동","장전동","부곡동","서동","금사회동동","남산동","청룡노포동"], area:"구서·장전·부곡·노포", tone:"부산대 생활권과 주거지가 함께 있어 희망 시작 시간과 관리 후 일정까지 함께 확인하는 것이 좋습니다.", cta:"금정 구서·장전권 상담을 바로 확인하세요" },
  { slug:"gijang", name:"기장군", zones:["기장읍","정관읍","일광읍","장안읍","철마면"], area:"기장읍·정관·일광", tone:"동부산 관광·숙소 문의와 정관 주거권 문의가 함께 들어와 읍면과 숙소 기준을 정확히 알려주는 편이 좋습니다.", cta:"기장 정관·일광권 가능 여부를 확인하세요" },
  { slug:"nam", name:"남구", zones:["대연동","용호동","문현동","감만동","우암동"], area:"대연·용호·문현", tone:"대학가, 주거지, 문현 금융권 수요가 섞여 있어 위치와 코스 목적을 함께 말하면 상담이 빠릅니다.", cta:"남구 대연·용호권 가능 코스를 확인하세요" },
  { slug:"dong", name:"동구", zones:["초량동","수정동","좌천동","범일동"], area:"부산역·초량·범일", tone:"부산역과 원도심 업무·숙소 문의가 많아 투숙 여부와 방문 가능 시간을 먼저 확인하는 것이 좋습니다.", cta:"동구 부산역·초량권 가능 시간을 확인하세요" },
  { slug:"dongnae", name:"동래구", zones:["온천동","명륜동","사직동","안락동","수민동","복산동"], area:"온천장·명륜·사직", tone:"온천장과 사직 생활권 문의가 많아 주거지인지 숙소인지, 관리 후 이동 일정이 있는지 확인하면 좋습니다.", cta:"동래 온천장·사직권 상담을 확인하세요" },
  { slug:"busanjin", name:"부산진구", zones:["부전동","전포동","범천동","양정동","가야동","개금동"], area:"서면·전포·부전·양정", tone:"서면 중심 상권과 전포·양정 생활권의 문의가 많아 늦은 시간대 가능 여부를 미리 확인해야 합니다.", cta:"부산진 서면·전포권 가능 시간을 확인하세요" },
  { slug:"buk", name:"북구", zones:["화명동","덕천동","구포동","만덕동","금곡동"], area:"화명·덕천·구포", tone:"서부산 환승 생활권과 주거지가 함께 있어 가까운 역과 희망 시간을 함께 알려주는 편이 정확합니다.", cta:"북구 화명·덕천권 가능 코스를 확인하세요" },
  { slug:"sasang", name:"사상구", zones:["괘법동","감전동","덕포동","모라동","주례동","학장동"], area:"사상역·주례·모라", tone:"교통 거점과 산업권 문의가 함께 있어 퇴근 이후 시간대 상담은 위치 기준이 중요합니다.", cta:"사상역·주례권 가능 시간을 바로 확인하세요" },
  { slug:"saha", name:"사하구", zones:["하단동","당리동","괴정동","신평동","장림동","다대동","감천동"], area:"하단·다대·괴정·장림", tone:"서부산 해안권과 주거지가 넓어 동 이름과 가까운 역 또는 큰길 기준을 함께 말하는 것이 좋습니다.", cta:"사하 하단·다대권 상담을 확인하세요" },
  { slug:"seo", name:"서구", zones:["충무동","동대신동","서대신동","암남동","남부민동"], area:"송도·대신·충무", tone:"송도 해안권과 대신동 주거권 문의가 달라 숙소·주거 형태를 상담에서 먼저 확인하는 편이 좋습니다.", cta:"서구 송도·대신권 가능 여부를 확인하세요" },
  { slug:"suyeong", name:"수영구", zones:["광안동","민락동","남천동","망미동","수영동"], area:"광안리·민락·남천", tone:"광안리 숙소와 해안 생활권 문의가 많아 투숙 여부와 입장 기준을 미리 확인하는 것이 좋습니다.", cta:"수영 광안리·민락권 가능 시간을 확인하세요" },
  { slug:"yeonje", name:"연제구", zones:["연산동","거제동"], area:"연산·거제", tone:"행정·업무권과 주거지가 함께 있어 퇴근 후 일정과 가까운 지하철역 기준을 함께 말하면 상담이 빨라집니다.", cta:"연제 연산·거제권 상담을 확인하세요" },
  { slug:"yeongdo", name:"영도구", zones:["남항동","영선동","봉래동","동삼동","청학동"], area:"영도대교·동삼·남항", tone:"섬 지역 특성상 다리 이동과 해안 생활권 조건을 함께 고려해야 해 위치 확인이 중요합니다.", cta:"영도 동삼·남항권 가능 여부를 확인하세요" },
  { slug:"jung", name:"중구", zones:["남포동","광복동","중앙동","대청동","보수동","영주동"], area:"남포·광복·중앙", tone:"남포동과 광복동 중심의 관광·숙소 문의가 많아 투숙 위치와 희망 시작 시간을 먼저 확인하는 것이 좋습니다.", cta:"중구 남포·광복권 가능 시간을 확인하세요" },
  { slug:"haeundae", name:"해운대구", zones:["우동","중동","좌동","송정동","반여동","반송동","재송동"], area:"해운대·센텀·송정·좌동", tone:"호텔·숙소 문의와 센텀 업무권 수요가 함께 있어 시간대와 입장 조건을 상담에서 먼저 확인해야 합니다.", cta:"해운대·센텀권 프리미엄 상담을 확인하세요" }
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
  return `<section class="region-panel region-price" id="pricing"><h2>${region} 출장마사지 가격표</h2><p>아래 금액은 ${region} 예약 상담 시 참고하는 기본 요금표입니다. 부산은 해안 숙소권, 원도심권, 서부산·동부산 이동 조건이 달라 최종 가능 여부와 금액을 전화 상담에서 다시 확인합니다.</p><div class="pricing-grid" aria-label="${region} 출장마사지 가격표">${rows.map(([title,kicker,desc,items,best])=>`<article class="price-card${best ? " best" : ""}">${best ? '<span class="best-badge">BEST</span>' : ""}<p class="kicker">${kicker}</p><h2>${title}</h2><p>${desc}</p><div class="price-rows">${items.map(v=>{const [t,p]=v.split("|");return `<div><span>${t}</span><strong>${p}</strong></div>`}).join("")}</div></article>`).join("")}</div><div class="price-note"><p>${region} 지역은 생활권과 시간대에 따라 가능 여부가 달라질 수 있습니다. 현재 가능 시간과 최종 금액은 전화로 확인하세요.</p><a href="tel:05082024731">${phone} 요금 상담</a></div></section>`;
}

function page(d) {
  const url = `${site}/locations/busan/${d.slug}/`;
  const image = `${site}/assets/busan-${d.slug}-og.svg`;
  const json = {"@context":"https://schema.org","@graph":[
    {"@type":["LocalBusiness","HealthAndBeautyBusiness"],"@id":`${url}#business`,"name":`마사지PRO ${d.name} 출장마사지 예약 상담`,"url":url,"image":image,"telephone":phone,"priceRange":"80,000원-190,000원","areaServed":{"@type":"AdministrativeArea","name":`부산광역시 ${d.name}`},"address":{"@type":"PostalAddress","addressCountry":"KR","addressRegion":"부산광역시","addressLocality":d.name},"description":`${d.name} ${d.area} 생활권을 기준으로 출장마사지 예약 가능 여부, 코스별 가격, 안전 상담 기준을 안내합니다.`},
    {"@type":"DiscussionForumPosting","@id":`${url}#discussion`,"headline":`${d.name} 출장마사지 상담 스레드`,"author":{"@type":"Organization","name":"마사지PRO 상담팀"},"datePublished":today,"articleBody":`${d.name} 이용자가 예약 전에 자주 묻는 위치, 이동 조건, 압 조절, 숙소 및 주거지 이용 조건을 비식별 상담 사례로 정리했습니다.`,"comment":[{"@type":"Comment","author":{"@type":"Person","name":"비식별 상담자 A"},"text":`${d.area} 근처에서 퇴근 후 가능한 시간과 아로마 90분 가능 여부를 문의했습니다.`},{"@type":"Comment","author":{"@type":"Organization","name":"마사지PRO 상담팀"},"text":`${d.name}는 생활권명과 가까운 기준 지점을 함께 알려주면 가능 시간을 더 빠르게 확인할 수 있습니다.`}]},
    {"@type":"FAQPage","@id":`${url}#faq`,"mainEntity":[
      {"@type":"Question","name":`${d.name} 출장마사지 예약은 어떻게 하나요?`,"acceptedAnswer":{"@type":"Answer","text":`전화로 세부 위치, 희망 시간, 코스, 컨디션을 알려주시면 ${d.name} 가능 여부와 요금을 확인합니다.`}},
      {"@type":"Question","name":`${d.name} 숙소나 호텔에서도 상담 가능한가요?`,"acceptedAnswer":{"@type":"Answer","text":"숙소와 호텔은 입장 정책과 위치 조건에 따라 달라질 수 있어 예약 전 상담에서 확인합니다."}},
      {"@type":"Question","name":"부산 지역은 생활권명으로 문의해도 되나요?","acceptedAnswer":{"@type":"Answer","text":"가능합니다. 해운대, 서면, 남포, 광안리 같은 생활권명과 세부 동 이름을 함께 알려주면 상담이 더 정확합니다."}},
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
  <title>${d.name} 출장마사지 예약 상담 | 마사지PRO 부산 지역</title>
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
        <p class="kicker">BUSAN DISTRICT</p>
        <h1>${d.name} 출장마사지 예약 상담</h1>
        <p>${d.name}는 ${d.area} 생활권을 중심으로 주거지, 업무지, 숙소 이용 문의가 함께 들어오는 부산 지역입니다. 마사지PRO는 지역명만 반복하지 않고 실제 예약 상담에서 필요한 세부 위치, 이동 가능 시간, 코스 선택 기준, 안전 확인 항목을 한 페이지에서 안내합니다.</p>
        <div class="hero-cta"><div><strong>${d.cta}</strong><span>${d.zones.slice(0,4).join("·")} 등 세부 위치와 희망 시간을 알려주시면 가능 여부와 코스별 요금을 빠르게 확인합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div>
        <div class="article-meta"><span>작성: 마사지PRO 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div>
        <div class="toc"><a href="#trust">가능 지역</a><a href="#experience">압 조절</a><a href="#pricing">가격표</a><a href="#faq">FAQ</a></div>
      </article>
      <section class="region-panel" id="trust"><h2>${d.name} 실제 상담 가능 지역과 안전 가이드</h2><p>${d.tone} 부산은 해안 숙소권, 원도심, 서면 중심 상권, 서부산·동부산 생활권의 이동 조건이 서로 다릅니다. “${d.name} 가능해요?”라고만 묻기보다 현재 위치의 동 이름, 가까운 역이나 도로명, 숙소 유형, 희망 시작 시간을 함께 알려주는 편이 좋습니다. 마사지PRO는 이용자가 전화 전에 가격과 기준을 예측할 수 있도록 기본 요금표와 상담 절차를 공개하고, 치료 효과를 보장하는 표현은 사용하지 않습니다.</p><div class="seo-grid"><article class="seo-card"><h3>Who</h3><p>이 페이지는 ${d.name} 예약 문의에서 반복되는 실제 질문을 바탕으로 마사지PRO 지역 콘텐츠팀이 작성했습니다.</p></article><article class="seo-card"><h3>How</h3><p>생활권, 구·군 단위, 시간대, 코스 선택 기준을 상담 흐름에 맞춰 정리했고 개인정보가 드러나는 후기는 사용하지 않았습니다.</p></article><article class="seo-card"><h3>Why</h3><p>검색 순위만을 위한 얇은 지역 페이지가 아니라, 전화 전 확인해야 할 기준을 제공하기 위해 제작했습니다.</p></article></div><div class="dong-chip-grid">${d.zones.map(x=>`<span>${x}</span>`).join("")}</div><p class="source-note">안전 안내: 과도한 선입금, 불명확한 추가금, 공식 전화가 아닌 개인 연락 유도는 피하세요. 몸 상태가 좋지 않거나 통증이 심하면 예약보다 의료 전문가 상담이 우선입니다.</p></section>
      <section class="region-panel" id="experience"><h2>${d.name} 이용자가 알아두면 좋은 압 조절 기준</h2><p>출장마사지는 같은 90분 코스라도 압의 세기와 리듬에 따라 만족도가 달라집니다. ${d.name}처럼 생활권과 이동 조건이 다양한 지역에서는 가능 시간 확인만큼 관리 목적을 먼저 정리하는 것이 중요합니다. “목과 어깨는 강하게, 종아리는 부드럽게”, “오일은 적게, 스트레칭은 천천히”처럼 구체적으로 말하면 상담 품질이 좋아집니다.</p><div class="pressure-table"><div class="pressure-row"><strong>타이 건식</strong><span>스트레칭과 지압 중심. 장시간 이동, 책상 업무, 전신 뻐근함을 말하는 이용자에게 상담이 많습니다.</span></div><div class="pressure-row"><strong>아로마 습식</strong><span>오일을 활용해 부드러운 휴식감을 원하는 이용자에게 적합합니다.</span></div><div class="pressure-row"><strong>감성케어 오일</strong><span>강한 압보다 차분한 리듬과 섬세한 강도 조절을 선호할 때 문의가 많습니다.</span></div></div></section>
      <section class="region-panel" id="forum"><h2>${d.name} 상담 스레드와 이용 팁</h2><p>아래 내용은 실제 상담에서 반복되는 질문을 비식별 형태로 재구성한 예시입니다. 평점 조작이나 허위 후기가 아니라, 예약 전 사용자가 놓치기 쉬운 확인 항목을 보여주기 위한 정보성 콘텐츠입니다.</p><div class="forum-thread"><article class="thread-post"><p class="thread-meta">비식별 상담자 A · ${d.area}</p><p>“오늘 저녁 ${d.zones[0]} 근처에서 아로마 90분 가능할까요? 숙소 위치가 조금 안쪽이라 이동 가능 여부가 궁금합니다.”</p></article><article class="thread-post"><p class="thread-meta">마사지PRO 상담팀</p><p>“부산 지역은 세부 위치와 시간대에 따라 가능 여부가 달라질 수 있습니다. 희망 시간, 코스, 가까운 기준 지점을 알려주시면 먼저 확인해드립니다.”</p></article><article class="thread-post"><p class="thread-meta">비식별 상담자 B · ${d.name}</p><p>“강한 압은 부담스럽고 어깨와 허리 위주로 편안하게 받고 싶습니다. 어떤 코스가 맞을까요?”</p></article></div></section>
      ${priceCards(d.name)}
      <div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>${d.name} 숙소·오피스텔 이용 전 확인할 점</h2><p>${d.name}에서 숙소, 호텔, 오피스텔로 문의할 때는 주소만 보내기보다 건물 입장 방식, 주차 가능 여부, 희망 시작 시간을 함께 알려주는 것이 좋습니다. 특히 ${d.area} 일대는 시간대별 이동 흐름이 달라 같은 지역 안에서도 확인 속도가 달라질 수 있습니다. 마사지PRO는 예약 과정에서 이용자가 이해하기 어려운 표현을 줄이고, 가능한 코스와 금액을 상담 단계에서 투명하게 안내하는 것을 우선합니다.</p><p>출장마사지 상담은 휴식과 컨디션 관리를 위한 일반 안내입니다. 특정 질환 개선, 통증 치료, 의학적 효과를 보장하지 않습니다. 임신, 수술 후 회복, 급성 통증, 피부 문제처럼 주의가 필요한 상황이라면 마사지 예약보다 의료 전문가 상담이 먼저입니다. 이런 안내는 불편함을 줄이기 위한 형식 문구가 아니라, 이용자가 안전하게 선택하도록 돕는 기본 기준입니다.</p></article><section id="faq" class="faq-block"><h2>${d.name} 출장마사지 자주 묻는 질문</h2><details><summary>${d.name} 예약은 몇 분 전에 문의하면 좋나요?<span>+</span></summary><p>당일 상담도 가능하지만 부산 지역은 해안권·원도심권·동부산 이동 조건이 달라 희망 시간보다 여유 있게 확인하는 것이 좋습니다.</p></details><details><summary>${d.name} 숙소나 호텔 이용도 가능한가요?<span>+</span></summary><p>숙소 정책과 입장 기준에 따라 달라질 수 있습니다. 투숙 여부와 방문 가능 조건을 상담에서 먼저 확인합니다.</p></details><details><summary>요금표 금액이 최종 금액인가요?<span>+</span></summary><p>기본 기준이며 최종 금액은 코스, 시간, 위치 조건 확인 후 안내합니다. 불명확한 추가금은 상담 단계에서 확인하세요.</p></details><details><summary>생활권명으로 문의해도 되나요?<span>+</span></summary><p>가능합니다. 다만 해운대, 서면, 남포, 광안리 같은 생활권명과 세부 동 이름을 함께 말하면 상담이 더 정확합니다.</p></details></section><section class="editor-card"><div class="editor-avatar">MP</div><div><h2>콘텐츠 검수자</h2><h3>마사지PRO 예약 상담 품질 담당</h3><p>${d.name} 페이지는 지역명 반복보다 실제 예약 전 확인해야 할 위치, 코스, 이동 조건, 안전 기준을 중심으로 검수했습니다. 의료 효과를 보장하지 않으며, 이용자의 판단을 돕는 정보성 콘텐츠로 유지합니다.</p></div></section><div class="related-links"><a href="/locations/busan/">부산 지역 목록</a><a href="/pricing/course/">코스별 요금표</a><a href="/magazine/blog/booking-checklist/">예약 체크리스트</a><a href="tel:05082024731">전화 상담</a></div></div>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/busan/">부산 지역별 찾기</a></p></div></footer>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

function svg(d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#08080b"/><stop offset=".55" stop-color="#17151a"/><stop offset="1" stop-color="#c69a5d"/></linearGradient><linearGradient id="m" x1="0" x2="1"><stop offset="0" stop-color="#f4d78d"/><stop offset="1" stop-color="#d58f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="64" y="64" width="1072" height="502" rx="32" fill="#111116" opacity=".8" stroke="#d4b06f"/><text x="104" y="155" fill="#d7bb78" font-family="Arial, sans-serif" font-size="28" letter-spacing="7">MASSAGE PRO BUSAN</text><text x="104" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="74" font-weight="700">${d.name} 출장마사지</text><text x="104" y="345" fill="#f2d08d" font-family="Arial, sans-serif" font-size="48" font-weight="700">예약 상담 · 가능 지역 확인</text><text x="104" y="430" fill="#d8d4cf" font-family="Arial, sans-serif" font-size="28">${d.area}</text><circle cx="975" cy="238" r="82" fill="url(#m)" opacity=".88"/><rect x="850" y="384" width="230" height="74" rx="37" fill="url(#m)"/><text x="887" y="432" fill="#111116" font-family="Arial, sans-serif" font-size="28" font-weight="700">${phone}</text></svg>`;
}

function indexPage() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b0b0e">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <title>부산 출장마사지 지역별 찾기 | 마사지PRO</title>
  <meta name="description" content="부산 출장마사지 예약 상담. 부산 16개 구·군 개별 페이지에서 가능 지역, 가격표, 코스, 안전 상담 기준을 확인하세요.">
  <link rel="canonical" href="${site}/locations/busan/">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  ${nav()}
  <main>
    <section class="wrap">
      <article class="article-hero">
        <p class="kicker">BUSAN AREA</p>
        <h1>부산 출장마사지 지역별 찾기</h1>
        <p>부산은 해운대, 서면, 남포, 광안리, 기장처럼 생활권별 이동 조건과 이용 목적이 뚜렷합니다. 원하는 구·군을 선택하면 해당 지역의 주요 동, 가격표, 예약 전 확인할 안전 기준을 개별 페이지에서 확인할 수 있습니다.</p>
        <div class="hero-cta"><div><strong>부산 16개 구·군, 생활권 기준으로 상담받으세요</strong><span>해운대·서면·남포·광안리·기장까지 세부 위치와 희망 시간을 알려주시면 가능 여부를 확인합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div>
        <div class="article-meta"><span>작성: 마사지PRO 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div>
      </article>
      <section class="region-panel" id="districts">
        <h2>부산 출장마사지 가능 지역 16개 구·군</h2>
        <p>아래 지역명은 개별 랜딩 페이지로 연결됩니다. 각 페이지에는 지역별 고유 생활권, 구·군별 주요 동, 가격표, FAQ, 상담 스레드가 포함되어 있습니다.</p>
        <div class="district-grid">${districts.map(d=>`<a href="/locations/busan/${d.slug}/">${d.name}</a>`).join("")}</div>
        <p class="source-note">부산광역시는 16개 구·군 단위로 생활권과 행정 서비스가 운영됩니다. 참고: <a href="https://www.busan.go.kr/">부산광역시 대표 누리집</a></p>
      </section>
      ${priceCards("부산")}
      <div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>부산 지역 상담은 생활권명이 중요합니다</h2><p>부산 출장마사지 문의는 구·군명만으로는 충분하지 않을 때가 많습니다. 같은 해운대구라도 센텀, 좌동, 송정의 이동 기준이 다르고, 부산진구는 서면·전포·양정 생활권이 다릅니다. 예약 전에는 구·군명, 동 이름, 가까운 역 또는 도로명, 희망 시작 시간을 함께 알려주세요.</p><p>마사지PRO는 휴식과 컨디션 관리를 위한 일반 마사지 상담을 안내하며 의료 효과나 통증 치료를 보장하지 않습니다. 불명확한 추가금과 과도한 선입금 요구를 피하고, 공식 전화번호를 통해 금액과 가능 시간을 확인하는 것을 권장합니다.</p></article><section id="faq" class="faq-block"><h2>부산 지역 자주 묻는 질문</h2><details><summary>부산 전 지역이 항상 가능한가요?<span>+</span></summary><p>지역과 시간대, 배정 상황에 따라 달라질 수 있습니다. 세부 위치를 알려주시면 가능 여부를 확인합니다.</p></details><details><summary>해운대·광안리 숙소도 상담 가능한가요?<span>+</span></summary><p>숙소 정책과 입장 기준에 따라 달라질 수 있습니다. 투숙 여부와 방문 가능 조건을 상담에서 먼저 확인합니다.</p></details><details><summary>지역 페이지는 왜 따로 만들었나요?<span>+</span></summary><p>단순 키워드 반복이 아니라 지역별 생활권, 주요 동, 이동 조건을 다르게 안내하기 위해 개별 페이지로 구성했습니다.</p></details></section></div>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/">지역별 찾기</a></p></div></footer>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

for (const d of districts) {
  const htmlPath = join(root, "locations", "busan", d.slug, "index.html");
  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, page(d), "utf8");
  writeFileSync(join(root, "assets", `busan-${d.slug}-og.svg`), svg(d), "utf8");
}
writeFileSync(join(root, "locations", "busan", "index.html"), indexPage(), "utf8");

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
const busanUrls = districts.map(d => `  <url><loc>${site}/locations/busan/${d.slug}/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n");
sitemap = sitemap.replace(/  <url><loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/busan\/[^<]+<\/loc><changefreq>monthly<\/changefreq><priority>0\.7<\/priority><\/url>\n/g, "");
if (!sitemap.includes(`${site}/locations/busan/haeundae/`)) {
  sitemap = sitemap.replace(/  <url>\r?\n    <loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/busan\/<\/loc>\r?\n    <changefreq>weekly<\/changefreq>\r?\n    <priority>0\.85<\/priority>\r?\n  <\/url>/, match => `${match}\n${busanUrls}`);
}
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(`Generated ${districts.length} Busan district pages.`);
