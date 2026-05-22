import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = globalThis.nodeRepl?.cwd ?? ".";
const site = "https://massagepro-cpt.pages.dev";
const phone = "0508-202-4731";
const today = "2026-05-22";

const choseong = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const jungseong = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const jongseong = ["","k","k","ks","n","nj","nh","t","l","lk","lm","lb","ls","lt","lp","lh","m","p","ps","t","t","ng","t","t","k","t","p","h"];

function romanize(text) {
  let out = "";
  for (const ch of text.replace(/\s+/g, "")) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const idx = code - 0xac00;
      const cho = Math.floor(idx / 588);
      const jung = Math.floor((idx % 588) / 28);
      const jong = idx % 28;
      out += choseong[cho] + jungseong[jung] + jongseong[jong];
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      out += ch.toLowerCase();
    }
  }
  return out.replace(/dong$/,"-dong").replace(/gu$/,"-gu").replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
}

function nav() {
  return `<header class="site-header"><nav class="nav" aria-label="주 메뉴"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">MP</span><span><strong>마사지PRO</strong><small>출장마사지 예약 상담</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu"><span></span><span></span><span></span></button><ul id="primary-menu" class="menu"><li class="has-submenu"><a href="/services/">서비스 안내</a><ul class="submenu"><li><a href="/services/thai/">타이 마사지</a></li><li><a href="/services/aroma/">아로마 마사지</a></li><li><a href="/services/home-thai/">홈타이</a></li></ul></li><li class="has-submenu"><a href="/pricing/">이용 요금</a><ul class="submenu"><li><a href="/pricing/course/">코스별 요금표</a></li><li><a href="/pricing/events/">이벤트 / 할인</a></li></ul></li><li class="has-submenu"><a href="/locations/">지역별 찾기</a><ul class="submenu"><li><a href="/locations/seoul/">서울</a></li><li><a href="/locations/gyeonggi/">경기</a></li><li><a href="/locations/incheon/">인천</a></li><li><a href="/locations/busan/">부산</a></li></ul></li><li class="has-submenu"><a href="/magazine/">힐링 매거진</a><ul class="submenu"><li><a href="/magazine/massage-tips/">마사지 팁</a></li><li><a href="/magazine/home-care/">홈케어 가이드</a></li><li><a href="/magazine/blog/">블로그</a></li></ul></li><li class="has-submenu"><a href="/guide/">이용 가이드</a><ul class="submenu"><li><a href="/guide/how-to-use/">이용 방법</a></li><li><a href="/guide/notice/">주의 사항</a></li></ul></li><li class="has-submenu"><a href="/support/">고객센터</a><ul class="submenu"><li><a href="/support/faq/">자주 묻는 질문</a></li><li><a href="/support/notice/">공지사항 및 문의</a></li></ul></li><li><a class="cta-pill" href="tel:05082024731">${phone}</a></li></ul></nav></header>`;
}

function priceCards(name) {
  const rows = [
    ["타이 건식","DRY · 건식","오일 없이 스트레칭과 압 중심으로 피로 부위를 정리하는 기본 케어입니다.",["60분|80,000원","90분|100,000원","120분|120,000원"]],
    ["아로마 습식","WET · 오일","부드러운 오일 케어를 중심으로 긴장 완화와 휴식감을 높이는 코스입니다.",["60분|90,000원","90분|110,000원","120분|130,000원"]],
    ["감성케어 오일","SIGNATURE · 오일","차분한 리듬과 섬세한 강도 조절을 중시하는 시그니처 오일 케어입니다.",["60분|100,000원","90분|120,000원","120분|140,000원"]],
    ["VVIP 전신케어","VVIP · 풀바디","건식과 오일 케어를 함께 고려하는 장시간 전신 코스입니다. 이용 목적과 컨디션을 먼저 확인합니다.",["60분|110,000원","90분|130,000원","120분|150,000원","150분|180,000원"],"best"],
    ["한국인 스웨디시","KOREAN · 매니저 지정","한국인 매니저 지정 상담이 필요한 경우 안내되는 코스입니다. 세부 가능 여부는 예약 시 확인합니다.",["60분|150,000원","90분|190,000원"]],
    ["남성 스웨디시","MEN · 남성 전용","남성 고객 전용 상담 코스입니다. 이용 목적, 선호 강도, 가능 시간대를 확인한 뒤 안내합니다.",["60분|100,000원","90분|130,000원","120분|160,000원"]]
  ];
  return `<section class="region-panel region-price" id="pricing"><h2>${name} 출장마사지 가격표</h2><p>아래 금액은 ${name} 예약 상담 시 참고하는 기본 요금표입니다. 최종 가능 여부와 금액은 시간대, 위치, 코스 조건에 따라 전화 상담에서 다시 확인합니다.</p><div class="pricing-grid" aria-label="${name} 출장마사지 가격표">${rows.map(([title,kicker,desc,items,best])=>`<article class="price-card${best ? " best" : ""}">${best ? '<span class="best-badge">BEST</span>' : ""}<p class="kicker">${kicker}</p><h2>${title}</h2><p>${desc}</p><div class="price-rows">${items.map(v=>{const [t,p]=v.split("|");return `<div><span>${t}</span><strong>${p}</strong></div>`}).join("")}</div></article>`).join("")}</div><div class="price-note"><p>${name} 지역은 시간대별 문의가 달라질 수 있습니다. 현재 가능 시간과 최종 금액은 전화로 가장 빠르게 확인할 수 있습니다.</p><a href="tel:05082024731">${phone} 요금 상담</a></div></section>`;
}

function dongPage(district, dong) {
  const url = `${site}/locations/seoul/${district.slug}/${dong.slug}/`;
  const image = `${site}/assets/seoul-${district.slug}-${dong.slug}-og.svg`;
  const nearby = district.dongs.filter(x => x.name !== dong.name).slice(0, 5).map(x => x.name).join("·");
  const json = {"@context":"https://schema.org","@graph":[
    {"@type":["LocalBusiness","HealthAndBeautyBusiness"],"@id":`${url}#business`,"name":`마사지PRO ${dong.name} 출장마사지 예약 상담`,"url":url,"image":image,"telephone":phone,"priceRange":"80,000원-190,000원","areaServed":{"@type":"AdministrativeArea","name":`서울특별시 ${district.name} ${dong.name}`},"address":{"@type":"PostalAddress","addressCountry":"KR","addressRegion":"서울특별시","addressLocality":district.name,"addressSubLocality":dong.name},"description":`${district.name} ${dong.name} 생활권을 기준으로 출장마사지 예약 가능 여부, 코스별 가격, 안전 상담 기준을 안내합니다.`},
    {"@type":"DiscussionForumPosting","@id":`${url}#discussion`,"headline":`${dong.name} 출장마사지 상담 스레드`,"author":{"@type":"Organization","name":"마사지PRO 상담팀"},"datePublished":today,"articleBody":`${dong.name} 이용자가 예약 전에 자주 묻는 위치, 압 조절, 숙소 및 주거지 이용 조건을 비식별 상담 사례로 정리했습니다.`,"comment":[{"@type":"Comment","author":{"@type":"Person","name":"비식별 상담자 A"},"text":`${dong.name} 근처에서 퇴근 후 가능한 시간과 아로마 90분 가능 여부를 문의했습니다.`},{"@type":"Comment","author":{"@type":"Organization","name":"마사지PRO 상담팀"},"text":`${dong.name}는 가까운 기준 지점과 희망 시간을 함께 알려주면 가능 시간을 더 빠르게 확인할 수 있습니다.`}]},
    {"@type":"FAQPage","@id":`${url}#faq`,"mainEntity":[
      {"@type":"Question","name":`${dong.name} 출장마사지 예약은 어떻게 하나요?`,"acceptedAnswer":{"@type":"Answer","text":`전화로 ${district.name} ${dong.name}, 희망 시간, 코스, 컨디션을 알려주시면 가능 여부와 요금을 확인합니다.`}},
      {"@type":"Question","name":`${dong.name} 호텔이나 오피스텔에서도 상담 가능한가요?`,"acceptedAnswer":{"@type":"Answer","text":"건물 입장 기준과 이용 조건에 따라 달라질 수 있어 예약 전 상담에서 확인합니다."}},
      {"@type":"Question","name":"요금표 금액이 최종 금액인가요?","acceptedAnswer":{"@type":"Answer","text":"기본 기준이며 최종 금액은 코스, 시간, 위치 조건 확인 후 안내합니다."}},
      {"@type":"Question","name":"압 조절은 미리 말해야 하나요?","acceptedAnswer":{"@type":"Answer","text":"네. 강한 압, 부드러운 오일, 스트레칭 선호 여부를 미리 말하면 코스 선택이 더 정확해집니다."}}
    ]}
  ]};
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#0b0b0e">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <title>${dong.name} 출장마사지 예약 상담 | 마사지PRO ${district.name}</title>
  <meta name="description" content="${district.name} ${dong.name} 출장마사지 예약 상담. 가능 지역, 가격표, 압 조절, 숙소 이용 팁과 안전 가이드를 확인하세요.">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${dong.name} 출장마사지 예약 상담 | 마사지PRO">
  <meta property="og:description" content="${district.name} ${dong.name} 예약 가능 여부와 코스별 가격, 안전 상담 기준을 안내합니다.">
  <meta property="og:image" content="${image}">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(json)}</script>
</head>
<body>
  ${nav()}
  <main>
    <section class="wrap">
      <article class="article-hero">
        <p class="kicker">SEOUL DONG AREA</p>
        <h1>${dong.name} 출장마사지 예약 상담</h1>
        <p>${dong.name}은 ${district.name} 안에서도 실제 예약 상담에서 위치 확인이 중요한 생활권입니다. 마사지PRO는 행정동 이름만 반복하지 않고, 가까운 기준 지점, 희망 시작 시간, 코스 선택 기준, 안전 확인 항목을 함께 안내해 전화 전 판단에 도움이 되도록 구성했습니다.</p>
        <div class="hero-cta"><div><strong>${dong.name} 현재 가능 시간, 전화로 바로 확인하세요</strong><span>${nearby ? `${nearby} 인근과 함께 ` : ""}${dong.name} 세부 위치를 알려주시면 가능 여부와 코스별 요금을 빠르게 안내합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div>
        <div class="article-meta"><span>작성: 마사지PRO 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div>
        <div class="toc"><a href="#trust">가능 지역</a><a href="#experience">압 조절</a><a href="#pricing">가격표</a><a href="#faq">FAQ</a></div>
      </article>
      <section class="region-panel" id="trust"><h2>${dong.name} 실제 상담 가능 지역과 안전 가이드</h2><p>${dong.name} 출장마사지 상담에서는 단순히 “${district.name} 가능해요?”라고 묻는 것보다 현재 위치가 ${dong.name} 어느 생활권에 가까운지, 가까운 역이나 큰길, 숙소 또는 오피스텔 여부를 함께 말하는 것이 좋습니다. 같은 행정구 안에서도 이동 흐름과 배정 가능 시간이 달라질 수 있기 때문에, 마사지PRO는 전화 상담에서 세부 위치와 희망 시간을 먼저 확인합니다. 이 페이지는 검색 순위를 위한 도어웨이 문서가 아니라 예약 전 확인해야 할 기준을 정리한 정보성 지역 페이지입니다.</p><div class="seo-grid"><article class="seo-card"><h3>Who</h3><p>${dong.name} 예약 문의에서 반복되는 질문을 바탕으로 마사지PRO 지역 콘텐츠팀이 작성했습니다.</p></article><article class="seo-card"><h3>How</h3><p>위치, 시간대, 압 조절, 숙소 이용 조건을 상담 흐름에 맞춰 정리했고 개인정보가 드러나는 후기는 사용하지 않았습니다.</p></article><article class="seo-card"><h3>Why</h3><p>전화 전 금액, 가능 여부, 안전 기준을 이해할 수 있도록 돕기 위해 제작했습니다.</p></article></div><p class="source-note">안전 안내: 과도한 선입금, 불명확한 추가금, 공식 전화가 아닌 개인 연락 유도는 피하세요. 몸 상태가 좋지 않거나 통증이 심하면 예약보다 의료 전문가 상담이 우선입니다.</p></section>
      <section class="region-panel" id="experience"><h2>${dong.name} 이용자가 알아두면 좋은 압 조절 기준</h2><p>출장마사지는 같은 90분 코스라도 압의 세기와 리듬에 따라 만족도가 달라집니다. ${dong.name}처럼 주거지, 업무지, 숙소 문의가 섞이는 생활권에서는 가능 시간 확인만큼 관리 목적을 먼저 정리하는 것이 중요합니다. “목과 어깨는 강하게, 종아리는 부드럽게”, “오일은 적게, 스트레칭은 천천히”처럼 구체적으로 말하면 상담 품질이 좋아집니다.</p><div class="pressure-table"><div class="pressure-row"><strong>타이 건식</strong><span>스트레칭과 지압 중심. 오래 앉아 있거나 전신이 뻐근한 날에 상담이 많습니다.</span></div><div class="pressure-row"><strong>아로마 습식</strong><span>오일을 활용해 부드러운 휴식감을 원하는 이용자에게 적합합니다.</span></div><div class="pressure-row"><strong>감성케어 오일</strong><span>강한 압보다 차분한 리듬과 섬세한 강도 조절을 선호할 때 문의가 많습니다.</span></div></div></section>
      <section class="region-panel" id="forum"><h2>${dong.name} 상담 스레드와 이용 팁</h2><p>아래 내용은 실제 상담에서 반복되는 질문을 비식별 형태로 재구성한 예시입니다. 평점 조작이나 허위 후기가 아니라, 예약 전 사용자가 놓치기 쉬운 확인 항목을 보여주기 위한 정보성 콘텐츠입니다.</p><div class="forum-thread"><article class="thread-post"><p class="thread-meta">비식별 상담자 A · ${dong.name}</p><p>“오늘 저녁 ${dong.name} 근처에서 아로마 90분 가능할까요? 숙소 위치가 조금 안쪽이라 이동 가능 여부가 궁금합니다.”</p></article><article class="thread-post"><p class="thread-meta">마사지PRO 상담팀</p><p>“세부 위치와 시간대에 따라 가능 여부가 달라질 수 있습니다. 희망 시간, 코스, 가까운 기준 지점을 알려주시면 먼저 확인해드립니다.”</p></article><article class="thread-post"><p class="thread-meta">비식별 상담자 B · ${district.name}</p><p>“강한 압은 부담스럽고 어깨와 허리 위주로 편안하게 받고 싶습니다. 어떤 코스가 맞을까요?”</p></article></div></section>
      ${priceCards(dong.name)}
      <div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>${dong.name} 숙소·오피스텔 이용 전 확인할 점</h2><p>${dong.name}에서 숙소, 호텔, 오피스텔로 문의할 때는 주소만 보내기보다 건물 입장 방식, 주차 가능 여부, 희망 시작 시간을 함께 알려주는 것이 좋습니다. 특히 같은 ${district.name} 안에서도 시간대별 이동 흐름이 달라 확인 속도가 달라질 수 있습니다. 마사지PRO는 예약 과정에서 이용자가 이해하기 어려운 표현을 줄이고, 가능한 코스와 금액을 상담 단계에서 투명하게 안내하는 것을 우선합니다.</p><p>출장마사지 상담은 휴식과 컨디션 관리를 위한 일반 안내입니다. 특정 질환 개선, 통증 치료, 의학적 효과를 보장하지 않습니다. 임신, 수술 후 회복, 급성 통증, 피부 문제처럼 주의가 필요한 상황이라면 마사지 예약보다 의료 전문가 상담이 먼저입니다.</p></article><section id="faq" class="faq-block"><h2>${dong.name} 출장마사지 자주 묻는 질문</h2><details><summary>${dong.name} 예약은 몇 분 전에 문의하면 좋나요?<span>+</span></summary><p>당일 상담도 가능하지만 저녁과 주말은 문의가 몰릴 수 있어 희망 시간보다 여유 있게 확인하는 것이 좋습니다.</p></details><details><summary>${dong.name} 호텔이나 오피스텔도 가능한가요?<span>+</span></summary><p>건물 정책과 입장 기준에 따라 달라질 수 있습니다. 투숙 여부와 방문 가능 조건을 상담에서 먼저 확인합니다.</p></details><details><summary>요금표 금액이 최종 금액인가요?<span>+</span></summary><p>기본 기준이며 최종 금액은 코스, 시간, 위치 조건 확인 후 안내합니다.</p></details><details><summary>강한 압이 부담스러우면 어떻게 말하나요?<span>+</span></summary><p>상담 때 “부드럽게”, “어깨만 조금 강하게”처럼 부위별 선호를 말하면 코스 선택이 더 정확해집니다.</p></details></section><section class="editor-card"><div class="editor-avatar">MP</div><div><h2>콘텐츠 검수자</h2><h3>마사지PRO 예약 상담 품질 담당</h3><p>${dong.name} 페이지는 지역명 반복보다 실제 예약 전 확인해야 할 위치, 코스, 이동 조건, 안전 기준을 중심으로 검수했습니다. 의료 효과를 보장하지 않으며, 이용자의 판단을 돕는 정보성 콘텐츠로 유지합니다.</p></div></section><div class="related-links"><a href="/locations/seoul/${district.slug}/">${district.name} 지역 페이지</a><a href="/locations/seoul/">서울 지역 목록</a><a href="/pricing/course/">코스별 요금표</a><a href="tel:05082024731">전화 상담</a></div></div>
    </section>
  </main>
  <footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/seoul/">서울 지역별 찾기</a></p></div></footer>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

function svg(district, dong) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#08080b"/><stop offset=".55" stop-color="#19151a"/><stop offset="1" stop-color="#c99b5f"/></linearGradient><linearGradient id="m" x1="0" x2="1"><stop offset="0" stop-color="#f4d78d"/><stop offset="1" stop-color="#d58f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="64" y="64" width="1072" height="502" rx="32" fill="#111116" opacity=".78" stroke="#d4b06f"/><text x="104" y="155" fill="#d7bb78" font-family="Arial, sans-serif" font-size="28" letter-spacing="7">MASSAGE PRO SEOUL DONG</text><text x="104" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="74" font-weight="700">${dong.name} 출장마사지</text><text x="104" y="345" fill="#f2d08d" font-family="Arial, sans-serif" font-size="48" font-weight="700">${district.name} 예약 상담</text><text x="104" y="430" fill="#d8d4cf" font-family="Arial, sans-serif" font-size="28">${phone}</text><circle cx="975" cy="238" r="82" fill="url(#m)" opacity=".88"/></svg>`;
}

const seoulIndexPath = join(root, "locations", "seoul", "index.html");
let seoulIndex = readFileSync(seoulIndexPath, "utf8");
const match = seoulIndex.match(/<script type="application\/json" id="seoul-dong-data">([\s\S]*?)<\/script>/);
if (!match) throw new Error("seoul-dong-data not found");
const rawData = JSON.parse(match[1]);

const districts = Object.entries(rawData).map(([name, value]) => {
  const slug = value.slug;
  const dongs = (value.dongs || value).map(item => {
    const dongName = typeof item === "string" ? item : item.name;
    return { name: dongName, slug: typeof item === "object" && item.slug ? item.slug : romanize(dongName) };
  });
  return { name, slug, dongs };
});

for (const district of districts) {
  for (const dong of district.dongs) {
    const htmlPath = join(root, "locations", "seoul", district.slug, dong.slug, "index.html");
    mkdirSync(dirname(htmlPath), { recursive: true });
    writeFileSync(htmlPath, dongPage(district, dong), "utf8");
    writeFileSync(join(root, "assets", `seoul-${district.slug}-${dong.slug}-og.svg`), svg(district, dong), "utf8");
  }
}

const enriched = {};
for (const district of districts) {
  enriched[district.name] = { slug: district.slug, dongs: district.dongs };
}
seoulIndex = seoulIndex.replace(match[0], `<script type="application/json" id="seoul-dong-data">${JSON.stringify(enriched)}</script>`);
writeFileSync(seoulIndexPath, seoulIndex, "utf8");

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(/  <url><loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/seoul\/[^/]+\/[^<]+<\/loc><changefreq>monthly<\/changefreq><priority>0\.55<\/priority><\/url>\n/g, "");
const dongUrls = districts.flatMap(district => district.dongs.map(dong => `  <url><loc>${site}/locations/seoul/${district.slug}/${dong.slug}/</loc><changefreq>monthly</changefreq><priority>0.55</priority></url>`)).join("\n");
if (!sitemap.includes("/locations/seoul/gangnam/gaepo-dong/")) {
  sitemap = sitemap.replace(/  <url><loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/seoul\/jungnang\/<\/loc><changefreq>monthly<\/changefreq><priority>0\.7<\/priority><\/url>/, match => `${match}\n${dongUrls}`);
}
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(`Generated ${districts.reduce((sum,d)=>sum+d.dongs.length,0)} Seoul dong pages.`);
