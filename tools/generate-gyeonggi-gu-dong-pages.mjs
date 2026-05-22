import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = globalThis.nodeRepl?.cwd ?? ".";
const site = "https://massagepro-cpt.pages.dev";
const phone = "0508-202-4731";
const today = "2026-05-22";

const areas = [
  { citySlug:"suwon", city:"수원시", guSlug:"jangan-gu", gu:"장안구", dongs:["파장동","율천동","정자동","영화동","송죽동","조원동","연무동"] },
  { citySlug:"suwon", city:"수원시", guSlug:"gwonseon-gu", gu:"권선구", dongs:["세류동","평동","서둔동","구운동","금곡동","호매실동","권선동","곡선동","입북동"] },
  { citySlug:"suwon", city:"수원시", guSlug:"paldal-gu", gu:"팔달구", dongs:["행궁동","매교동","매산동","고등동","화서동","지동","우만동","인계동"] },
  { citySlug:"suwon", city:"수원시", guSlug:"yeongtong-gu", gu:"영통구", dongs:["매탄동","원천동","광교동","영통동","망포동"] },
  { citySlug:"seongnam", city:"성남시", guSlug:"sujeong-gu", gu:"수정구", dongs:["신흥동","태평동","수진동","단대동","산성동","양지동","복정동","위례동","신촌동","고등동","시흥동"] },
  { citySlug:"seongnam", city:"성남시", guSlug:"jungwon-gu", gu:"중원구", dongs:["성남동","중앙동","금광동","은행동","상대원동","하대원동","도촌동"] },
  { citySlug:"seongnam", city:"성남시", guSlug:"bundang-gu", gu:"분당구", dongs:["분당동","수내동","정자동","서현동","이매동","야탑동","금곡동","구미동","판교동","삼평동","백현동","운중동"] },
  { citySlug:"goyang", city:"고양시", guSlug:"deokyang-gu", gu:"덕양구", dongs:["주교동","원신동","흥도동","성사동","효자동","신도동","창릉동","고양동","관산동","능곡동","화정동","행주동","행신동","화전동","대덕동","삼송동"] },
  { citySlug:"goyang", city:"고양시", guSlug:"ilsandong-gu", gu:"일산동구", dongs:["식사동","중산동","정발산동","풍산동","백석동","마두동","장항동","고봉동"] },
  { citySlug:"goyang", city:"고양시", guSlug:"ilsanseo-gu", gu:"일산서구", dongs:["일산동","탄현동","주엽동","대화동","송포동","덕이동","가좌동"] },
  { citySlug:"yongin", city:"용인시", guSlug:"cheoin-gu", gu:"처인구", dongs:["포곡읍","모현읍","이동읍","남사읍","원삼면","백암면","양지면","중앙동","역북동","유림동","동부동"] },
  { citySlug:"yongin", city:"용인시", guSlug:"giheung-gu", gu:"기흥구", dongs:["신갈동","영덕동","구갈동","상갈동","보라동","기흥동","서농동","구성동","마북동","동백동","상하동","보정동"] },
  { citySlug:"yongin", city:"용인시", guSlug:"suji-gu", gu:"수지구", dongs:["풍덕천동","신봉동","죽전동","동천동","상현동","성복동"] },
  { citySlug:"ansan", city:"안산시", guSlug:"sangrok-gu", gu:"상록구", dongs:["일동","이동","사동","사이동","해양동","본오동","부곡동","월피동","성포동","반월동","안산동"] },
  { citySlug:"ansan", city:"안산시", guSlug:"danwon-gu", gu:"단원구", dongs:["와동","고잔동","중앙동","호수동","원곡동","백운동","신길동","초지동","선부동","대부동"] },
  { citySlug:"anyang", city:"안양시", guSlug:"manan-gu", gu:"만안구", dongs:["안양동","석수동","박달동"] },
  { citySlug:"anyang", city:"안양시", guSlug:"dongan-gu", gu:"동안구", dongs:["비산동","부흥동","달안동","관양동","부림동","평촌동","평안동","귀인동","호계동","범계동","신촌동","갈산동"] },
  { citySlug:"bucheon", city:"부천시", guSlug:"wonmi-gu", gu:"원미구", dongs:["심곡동","원미동","소사동","역곡동","춘의동","도당동","약대동","중동","상동"] },
  { citySlug:"bucheon", city:"부천시", guSlug:"sosa-gu", gu:"소사구", dongs:["심곡본동","소사본동","범박동","괴안동","역곡동","송내동"] },
  { citySlug:"bucheon", city:"부천시", guSlug:"ojeong-gu", gu:"오정구", dongs:["성곡동","원종동","고강동","오정동","신흥동"] },
  { citySlug:"hwaseong", city:"화성시", guSlug:"manse-gu", gu:"만세구", dongs:["우정읍","향남읍","남양읍","마도면","송산면","서신면","팔탄면","장안면","양감면","새솔동"] },
  { citySlug:"hwaseong", city:"화성시", guSlug:"hyohaeng-gu", gu:"효행구", dongs:["봉담읍","매송면","비봉면","정남면","기배동"] },
  { citySlug:"hwaseong", city:"화성시", guSlug:"byeongjeom-gu", gu:"병점구", dongs:["진안동","병점동","반월동","화산동"] },
  { citySlug:"hwaseong", city:"화성시", guSlug:"dongtan-gu", gu:"동탄구", dongs:["동탄동"] }
];

const choseong = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const jungseong = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const jongseong = ["","k","k","ks","n","nj","nh","t","l","lk","lm","lb","ls","lt","lp","lh","m","p","ps","t","t","ng","t","t","k","t","p","h"];

function romanize(text) {
  let out = "";
  for (const ch of text.replace(/\s+/g, "")) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const idx = code - 0xac00;
      out += choseong[Math.floor(idx / 588)] + jungseong[Math.floor((idx % 588) / 28)] + jongseong[idx % 28];
    } else if (/[a-zA-Z0-9]/.test(ch)) out += ch.toLowerCase();
  }
  return out.replace(/eup$/,"-eup").replace(/myeon$/,"-myeon").replace(/dong$/,"-dong").replace(/[^a-z0-9-]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
}

const nav = () => `<header class="site-header"><nav class="nav" aria-label="주 메뉴"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">MP</span><span><strong>마사지PRO</strong><small>출장마사지 예약 상담</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu"><span></span><span></span><span></span></button><ul id="primary-menu" class="menu"><li class="has-submenu"><a href="/services/">서비스 안내</a><ul class="submenu"><li><a href="/services/thai/">타이 마사지</a></li><li><a href="/services/aroma/">아로마 마사지</a></li><li><a href="/services/home-thai/">홈타이</a></li></ul></li><li class="has-submenu"><a href="/pricing/">이용 요금</a><ul class="submenu"><li><a href="/pricing/course/">코스별 요금표</a></li><li><a href="/pricing/events/">이벤트 / 할인</a></li></ul></li><li class="has-submenu"><a href="/locations/">지역별 찾기</a><ul class="submenu"><li><a href="/locations/seoul/">서울</a></li><li><a href="/locations/gyeonggi/">경기</a></li><li><a href="/locations/incheon/">인천</a></li><li><a href="/locations/busan/">부산</a></li></ul></li><li class="has-submenu"><a href="/magazine/">힐링 매거진</a><ul class="submenu"><li><a href="/magazine/massage-tips/">마사지 팁</a></li><li><a href="/magazine/home-care/">홈케어 가이드</a></li><li><a href="/magazine/blog/">블로그</a></li></ul></li><li class="has-submenu"><a href="/guide/">이용 가이드</a><ul class="submenu"><li><a href="/guide/how-to-use/">이용 방법</a></li><li><a href="/guide/notice/">주의 사항</a></li></ul></li><li class="has-submenu"><a href="/support/">고객센터</a><ul class="submenu"><li><a href="/support/faq/">자주 묻는 질문</a></li><li><a href="/support/notice/">공지사항 및 문의</a></li></ul></li><li><a class="cta-pill" href="tel:05082024731">${phone}</a></li></ul></nav></header>`;

function priceCards(region) {
  const rows = [
    ["타이 건식","DRY · 건식","오일 없이 스트레칭과 압 중심으로 구성되는 기본 건식 케어입니다.",["60분|80,000원","90분|100,000원","120분|120,000원"]],
    ["아로마 습식","WET · 오일","부드러운 오일 케어를 중심으로 휴식감을 높이는 코스입니다.",["60분|90,000원","90분|110,000원","120분|130,000원"]],
    ["감성케어 오일","SIGNATURE · 오일","차분한 리듬과 섬세한 압 조절을 중시하는 시그니처 오일 케어입니다.",["60분|100,000원","90분|120,000원","120분|140,000원"]],
    ["VVIP 전신케어","VVIP · 풀바디","건식과 오일 케어를 함께 고려하는 장시간 전신 코스입니다.",["60분|110,000원","90분|130,000원","120분|150,000원","150분|180,000원"],"best"],
    ["한국인 스웨디시","KOREAN · 매니저 지정","한국인 매니저 지정 상담이 필요한 경우 안내되는 코스입니다.",["60분|150,000원","90분|190,000원"]],
    ["남성 스웨디시","MEN · 남성 전용","남성 고객 전용 상담 코스입니다.",["60분|100,000원","90분|130,000원","120분|160,000원"]]
  ];
  return `<section class="region-panel region-price" id="pricing"><h2>${region} 출장마사지 가격표</h2><p>아래 금액은 예약 상담 시 참고하는 기본 요금표입니다. 최종 가능 여부와 금액은 세부 위치, 시간대, 코스 조건을 확인한 뒤 전화 상담에서 안내합니다.</p><div class="pricing-grid">${rows.map(([title,kicker,desc,items,best])=>`<article class="price-card${best ? " best" : ""}">${best ? '<span class="best-badge">BEST</span>' : ""}<p class="kicker">${kicker}</p><h2>${title}</h2><p>${desc}</p><div class="price-rows">${items.map(v=>{const [t,p]=v.split("|");return `<div><span>${t}</span><strong>${p}</strong></div>`}).join("")}</div></article>`).join("")}</div><div class="price-note"><p>${region} 지역은 세부 위치와 시간대에 따라 가능 여부가 달라질 수 있습니다. 현재 가능한 시간과 최종 금액은 전화로 확인하세요.</p><a href="tel:05082024731">${phone} 요금 상담</a></div></section>`;
}

function jsonLd(area, dong, url, image) {
  const region = dong ? `${area.city} ${area.gu} ${dong.name}` : `${area.city} ${area.gu}`;
  return {"@context":"https://schema.org","@graph":[
    {"@type":["LocalBusiness","HealthAndBeautyBusiness"],"@id":`${url}#business`,"name":`마사지PRO ${region} 출장마사지 예약 상담`,"url":url,"image":image,"telephone":phone,"priceRange":"80,000원-190,000원","areaServed":{"@type":"AdministrativeArea","name":`경기도 ${region}`},"address":{"@type":"PostalAddress","addressCountry":"KR","addressRegion":"경기도","addressLocality":area.city,"addressSubLocality":dong ? `${area.gu} ${dong.name}` : area.gu},"description":`${region} 기준으로 출장마사지 가능 여부, 가격표, 예약 안전 기준을 안내합니다.`},
    {"@type":"DiscussionForumPosting","@id":`${url}#discussion`,"headline":`${region} 출장마사지 상담 질문`,"author":{"@type":"Organization","name":"마사지PRO 상담팀"},"datePublished":today,"articleBody":`${region} 이용자가 예약 전에 자주 확인하는 세부 위치, 시간대, 코스 선택, 안전 결제 기준을 상담형 콘텐츠로 정리했습니다.`,"comment":[{"@type":"Comment","author":{"@type":"Person","name":"비식별 상담자 A"},"text":`${region} 근처에서 오늘 저녁 아로마 90분 가능 여부와 기본 금액을 확인하고 싶습니다.`},{"@type":"Comment","author":{"@type":"Organization","name":"마사지PRO 상담팀"},"text":`${region} 내 가까운 기준 지점, 희망 시작 시간, 코스를 알려주시면 가능 여부와 상담 기준을 먼저 확인해드립니다.`}]},
    {"@type":"FAQPage","@id":`${url}#faq`,"mainEntity":[{"@type":"Question","name":`${region} 출장마사지 예약은 어떻게 하나요?`,"acceptedAnswer":{"@type":"Answer","text":`${region}, 희망 시간, 코스, 이용 장소 조건을 전화로 알려주시면 가능 여부와 요금 기준을 확인합니다.`}},{"@type":"Question","name":"호텔이나 숙소에서도 상담 가능한가요?","acceptedAnswer":{"@type":"Answer","text":"건물 입장 기준과 숙소 이용 규정에 따라 달라질 수 있어 예약 전 상담에서 먼저 확인합니다."}},{"@type":"Question","name":"가격표 금액이 최종 금액인가요?","acceptedAnswer":{"@type":"Answer","text":"기본 참고 금액이며, 최종 금액은 위치, 시간대, 코스 조건을 확인한 뒤 안내합니다."}}]}
  ]};
}

function guPage(area) {
  const url = `${site}/locations/gyeonggi/${area.citySlug}/${area.guSlug}/`;
  const image = `${site}/assets/gyeonggi-${area.citySlug}-${area.guSlug}-og.svg`;
  const dongs = area.dongs.map(name => ({ name, slug: romanize(name) }));
  const data = { [area.gu]: { slug:"", dongs } };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0b0b0e"><meta name="robots" content="index,follow,max-snippet:-1"><title>${area.city} ${area.gu} 출장마사지 예약 상담 | 마사지PRO 경기</title><meta name="description" content="${area.city} ${area.gu} 출장마사지 예약 상담. 행정동별 가능 지역, 가격표, 안전 가이드, FAQ와 상담 기준을 확인하세요."><link rel="canonical" href="${url}"><meta property="og:title" content="${area.city} ${area.gu} 출장마사지 예약 상담 | 마사지PRO"><meta property="og:description" content="${area.city} ${area.gu} 행정동별 가능 여부, 가격표, 예약 안전 기준을 안내합니다."><meta property="og:image" content="${image}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd(area,null,url,image))}</script></head><body>${nav()}<main><section class="wrap"><article class="article-hero"><p class="kicker">GYEONGGI DISTRICT AREA</p><h1>${area.city} ${area.gu} 출장마사지 예약 상담</h1><p>${area.gu}는 ${area.city} 안에서도 생활권과 이동 기준이 나뉘는 지역입니다. 예약 상담 전에는 구 이름만 말하기보다 가까운 행정동, 주요 역이나 도로명, 희망 시작 시간을 함께 알려주는 것이 좋습니다. 마사지PRO는 검색용 반복 문구보다 실제 상담에 필요한 위치 기준, 가격표, 안전 확인 사항을 먼저 안내합니다.</p><div class="hero-cta"><div><strong>${area.gu} 세부 행정동별 가능 시간을 확인하세요</strong><span>아래 행정동을 선택하면 해당 지역 기준의 상담 안내와 요금표를 자세히 볼 수 있습니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div><div class="article-meta"><span>작성: 마사지PRO 경기 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div></article><section class="region-panel" data-dong-explorer data-source="gyeonggi-gu-dong-data-${area.citySlug}-${area.guSlug}" data-link-prefix="/locations/gyeonggi/${area.citySlug}/${area.guSlug}/" data-item-label="행정동" data-title-template="{name} 출장마사지 행정동 바로 확인" data-desc-template="숫자로 나뉜 1동, 2동, 3동은 사용자가 찾기 쉽도록 하나의 동 이름으로 통합했습니다. 원하는 행정동을 눌러 가능 시간과 상담 기준을 확인하세요." data-page-link-label="${area.gu} 전체 지역 페이지 바로가기"><h2>${area.city} ${area.gu} 출장마사지 행정동</h2><p>아래 행정동은 예약 상담에서 위치를 확인할 때 자주 쓰는 기준입니다. 같은 구 안에서도 이동 시간과 장소 조건이 다르므로 세부 행정동을 기준으로 확인하면 상담이 더 정확해집니다.</p><div class="district-grid" data-dong-actions><a href="${url}">${area.gu}</a></div><div class="dong-result" hidden><h3 data-dong-title></h3><p data-dong-desc></p><div class="dong-chip-grid" data-dong-list></div></div></section><script type="application/json" id="gyeonggi-gu-dong-data-${area.citySlug}-${area.guSlug}">${JSON.stringify(data)}</script><section class="region-panel" id="trust"><h2>${area.gu} 출장마사지 상담 기준</h2><p>${area.city} ${area.gu} 상담에서는 행정동, 가까운 기준 지점, 이용 장소의 출입 조건, 희망 시작 시간을 함께 확인합니다. 이는 이용자가 실제로 예약 가능 여부를 판단하기 위한 정보이며, 단순 지역명 반복이나 과장된 효과 표현을 피하기 위한 기준입니다. 불명확한 추가금이나 공식 번호가 아닌 연락처 유도는 피하고, 모든 상담은 ${phone} 번호를 기준으로 확인하는 것이 안전합니다.</p><p>${area.gu} 안에서도 행정동에 따라 주거 밀집지, 역세권, 업무지, 숙소 이용 조건이 다릅니다. 예를 들어 같은 구 안의 인접 동이라도 퇴근 시간대 이동 경로가 달라질 수 있고, 숙소나 오피스텔은 건물 출입 규정에 따라 상담 확인 순서가 달라질 수 있습니다. 그래서 마사지PRO는 구 단위 안내에서 한 번 더 행정동 단위로 나누어 사용자가 실제 위치에 가까운 정보를 볼 수 있도록 구성했습니다.</p><p>이 페이지의 목적은 검색 순위를 위한 지역명 나열이 아니라, 예약 전 필요한 정보를 빠르게 확인하도록 돕는 것입니다. 이용자는 가격표, 코스, 가능 시간, 장소 조건을 미리 비교할 수 있고, 상담자는 불필요한 재확인을 줄일 수 있습니다. 건강 상태에 대한 판단이 필요한 경우에는 마사지 예약보다 의료 전문가 상담이 우선이며, 이 안내는 휴식과 컨디션 관리를 위한 일반 정보입니다.</p></section>${priceCards(`${area.city} ${area.gu}`)}<div class="content-stack" style="margin-top:26px"><section id="faq" class="faq-block"><h2>${area.gu} 자주 묻는 질문</h2><details><summary>${area.gu} 안에서 행정동별로 가능 시간이 다른가요?<span>+</span></summary><p>네. 같은 구 안에서도 이동 기준과 시간대가 달라질 수 있어 세부 행정동 확인이 필요합니다.</p></details><details><summary>1동, 2동처럼 나뉜 곳은 어떻게 표시되나요?<span>+</span></summary><p>사용자가 찾기 쉽도록 대표 동 이름으로 묶어 표시했습니다. 예약 상담 시에는 정확한 주소 또는 가까운 기준 지점을 함께 알려주세요.</p></details><details><summary>상담 전에 무엇을 준비하면 좋나요?<span>+</span></summary><p>행정동, 희망 시간, 코스, 장소 조건을 알려주시면 가능 여부와 기본 금액 확인이 빨라집니다.</p></details></section><section class="editor-card"><div class="editor-avatar">MP</div><div><h2>콘텐츠 검수자</h2><h3>마사지PRO 예약 상담 품질 담당</h3><p>${area.gu} 페이지는 행정동별 위치 확인, 가격표, 안전 기준을 중심으로 검수했습니다. 의료 효과를 보장하지 않으며, 이용자가 스스로 판단할 수 있는 정보성 안내를 우선합니다.</p></div></section></div></section></main><footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/gyeonggi/">경기 지역별 찾기</a></p></div></footer><script src="/script.js" defer></script></body></html>`;
}

function dongPage(area, dong) {
  const url = `${site}/locations/gyeonggi/${area.citySlug}/${area.guSlug}/${dong.slug}/`;
  const image = `${site}/assets/gyeonggi-${area.citySlug}-${area.guSlug}-${dong.slug}-og.svg`;
  const nearby = area.dongs.filter(name => name !== dong.name).slice(0, 5).join("·");
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0b0b0e"><meta name="robots" content="index,follow,max-snippet:-1"><title>${area.city} ${area.gu} ${dong.name} 출장마사지 예약 상담 | 마사지PRO</title><meta name="description" content="${area.city} ${area.gu} ${dong.name} 출장마사지 예약 상담. 가능 시간, 가격표, 안전 기준, FAQ를 확인하세요."><link rel="canonical" href="${url}"><meta property="og:title" content="${area.city} ${area.gu} ${dong.name} 출장마사지 예약 상담"><meta property="og:description" content="${dong.name} 기준 가능 여부, 가격표, 압 조절, 예약 안전 기준을 안내합니다."><meta property="og:image" content="${image}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd(area,dong,url,image))}</script></head><body>${nav()}<main><section class="wrap"><article class="article-hero"><p class="kicker">GYEONGGI DONG AREA</p><h1>${area.city} ${area.gu} ${dong.name} 출장마사지 예약 상담</h1><p>${dong.name}은 ${area.gu} 안에서도 예약 상담 시 세부 위치 확인이 필요한 생활권입니다. ${nearby ? `${nearby} 등 인접 행정동과 ` : ""}이동 흐름이 다를 수 있으므로, 전화 상담에서는 행정동 이름과 가까운 기준 지점, 희망 시작 시간을 함께 알려주는 것이 좋습니다. 마사지PRO는 검색 노출만을 위한 반복 문장이 아니라 이용자가 실제로 판단할 수 있는 가격표, 장소 확인, 안전 기준을 중심으로 안내합니다.</p><div class="hero-cta"><div><strong>${dong.name} 오늘 가능 시간, 전화로 바로 확인하세요</strong><span>세부 위치와 희망 코스를 알려주시면 가능 여부와 기본 요금 기준을 차분하게 안내합니다.</span></div><a class="hero-call" href="tel:05082024731">${phone} 전화 상담</a></div><div class="article-meta"><span>작성: 마사지PRO 경기 지역 콘텐츠팀</span><span>검수: 예약 상담 품질 담당</span><span>업데이트: ${today}</span></div><div class="toc"><a href="#trust">상담 기준</a><a href="#experience">이용 팁</a><a href="#pricing">가격표</a><a href="#faq">FAQ</a></div></article><section class="region-panel" id="trust"><h2>${dong.name} 출장마사지 가능 지역과 안전 상담 기준</h2><p>${area.city} ${area.gu} ${dong.name} 출장마사지 상담에서 가장 중요한 것은 세부 위치와 장소 조건입니다. 같은 행정동이라도 주거지, 업무지, 숙소, 역세권에 따라 이동 시간과 가능 여부가 달라질 수 있습니다. 예약 전에는 주소 전체를 공개하기보다 가까운 기준 지점, 희망 시작 시간, 이용 장소의 출입 기준을 먼저 알려주세요. 마사지PRO는 가능 여부, 기본 요금, 코스 시간을 전화 상담에서 투명하게 확인하고 불명확한 추가금이나 과도한 선입금 요구를 피하도록 안내합니다.</p><div class="seo-grid"><article class="seo-card"><h3>Who</h3><p>${dong.name} 문의에 필요한 위치 확인, 코스 선택, 안전 기준을 마사지PRO 지역 콘텐츠팀이 정리했습니다.</p></article><article class="seo-card"><h3>How</h3><p>행정동, 가까운 기준 지점, 시간대, 장소 조건을 나눠 실제 상담 흐름에 맞게 구성했습니다.</p></article><article class="seo-card"><h3>Why</h3><p>전화 전에 가능 기준과 가격표를 빠르게 파악하고 무리한 결제를 피하도록 돕기 위해 작성했습니다.</p></article></div><p class="source-note">안전 안내: 마사지PRO는 휴식과 컨디션 관리를 위한 일반 마사지 상담을 안내하며 의료 효과나 통증 치료를 보장하지 않습니다. 임신, 수술 후 회복, 급성 통증, 피부 질환처럼 주의가 필요한 경우에는 의료 전문가 상담이 우선입니다.</p></section><section class="region-panel" id="experience"><h2>${dong.name} 이용자가 알아두면 좋은 압 조절과 장소 팁</h2><p>${dong.name}에서 상담할 때는 "강하게" 또는 "약하게"보다 어깨와 목은 부드럽게, 하체는 스트레칭 위주로, 허리 주변은 피하고 싶다는 식으로 구체적으로 말하는 편이 좋습니다. 건식 코스는 압과 스트레칭 중심의 개운함을 원하는 분에게 맞고, 아로마 습식은 조용한 휴식과 긴장 완화를 원하는 분에게 적합합니다. 장소가 호텔이나 오피스텔이라면 출입 기준과 주차 조건을 미리 확인해 상담 지연을 줄일 수 있습니다.</p><div class="pressure-table"><div class="pressure-row"><strong>건식 관리</strong><span>오일 없이 압과 스트레칭 중심으로 진행합니다. 강한 압이 늘 좋은 결과를 뜻하지 않으므로 불편감은 바로 말해야 합니다.</span></div><div class="pressure-row"><strong>아로마 관리</strong><span>오일 민감도와 향 선호를 예약 전에 확인하면 장소 준비와 코스 선택이 더 부드럽습니다.</span></div><div class="pressure-row"><strong>장소 확인</strong><span>숙소와 업무 공간은 출입 기준이 다를 수 있으므로 예약 전 건물 규정과 방문 가능 조건을 먼저 확인합니다.</span></div></div></section><section class="region-panel" id="forum"><h2>${dong.name} 상담 스레드 예시</h2><p>아래 내용은 실제 상담에서 자주 나오는 질문 구조를 비식별 형태로 정리한 예시입니다. 후기 조작이 아니라 예약 전에 어떤 정보를 준비하면 좋은지 보여주는 정보형 콘텐츠입니다.</p><div class="forum-thread"><article class="thread-post"><p class="thread-meta">비식별 상담자 A · ${dong.name}</p><p>${dong.name} 근처에서 오늘 저녁 90분 코스가 가능한지, 숙소 방문 시 어떤 정보를 먼저 말해야 하는지 궁금합니다.</p></article><article class="thread-post"><p class="thread-meta">마사지PRO 상담팀</p><p>${dong.name} 내 가까운 기준 지점, 희망 시작 시간, 코스, 장소 출입 가능 여부를 알려주시면 가능 시간과 기본 금액을 확인해드립니다.</p></article></div></section>${priceCards(`${area.city} ${area.gu} ${dong.name}`)}<div class="content-stack" style="margin-top:26px"><article class="content-block"><h2>${dong.name} 예약 전에 확인해야 할 정보</h2><p>${dong.name}은 ${area.gu} 안에서도 이용 장소와 시간대에 따라 상담 결과가 달라질 수 있습니다. 예약 전에는 행정동명만 말하기보다 가까운 역, 도로명, 숙소 또는 건물 출입 기준, 원하는 시작 시간을 함께 알려주세요. 이 정보가 있어야 코스별 가능 여부와 가격표 기준을 더 정확하게 안내할 수 있습니다. 마사지PRO는 의미 없는 지역명 반복을 피하고, 예약 전에 실제로 필요한 정보를 중심으로 페이지를 구성합니다.</p><p>또한 예약 과정에서 불명확한 추가금, 공식 번호가 아닌 개인 연락처 유도, 설명 없는 선입금 요구가 있다면 바로 중단하는 것이 좋습니다. 전화 상담에서는 가능한 시간, 코스, 기본 금액, 장소 조건을 차례대로 확인하세요. 휴식 목적의 일반 마사지 상담이라는 점을 분명히 이해하고, 통증 치료나 의료적 효과를 기대하는 상황이라면 의료 전문가의 안내를 먼저 받는 것이 안전합니다.</p></article><section id="faq" class="faq-block"><h2>${dong.name} 자주 묻는 질문</h2><details><summary>${dong.name}은 당일 예약이 가능한가요?<span>+</span></summary><p>시간대와 세부 위치에 따라 달라집니다. 전화로 가까운 기준 지점과 희망 시간을 알려주시면 가능 여부를 확인합니다.</p></details><details><summary>호텔이나 오피스텔에서도 가능한가요?<span>+</span></summary><p>건물 출입 기준과 숙소 규정에 따라 달라질 수 있습니다. 예약 전 상담에서 장소 조건을 먼저 확인합니다.</p></details><details><summary>가격표와 실제 금액이 다른가요?<span>+</span></summary><p>가격표는 기본 참고 금액입니다. 최종 금액은 위치, 코스, 시간대 조건을 확인한 뒤 안내합니다.</p></details></section><section class="editor-card"><div class="editor-avatar">MP</div><div><h2>콘텐츠 검수자</h2><h3>마사지PRO 예약 상담 품질 담당</h3><p>${dong.name} 페이지는 지역명 반복보다 예약 전 실제 확인해야 할 위치, 시간, 코스, 안전 기준을 중심으로 검수했습니다.</p></div></section><div class="related-links"><a href="/locations/gyeonggi/${area.citySlug}/${area.guSlug}/">${area.gu} 지역 페이지</a><a href="/locations/gyeonggi/${area.citySlug}/">${area.city} 지역 페이지</a><a href="/pricing/course/">코스별 요금표</a><a href="tel:05082024731">전화 상담</a></div></div></section></main><footer class="site-footer"><div class="footer-bottom"><p>상호: 마사지PRO · 예약전화: ${phone}</p><p><a href="/locations/gyeonggi/">경기 지역별 찾기</a></p></div></footer><script src="/script.js" defer></script></body></html>`;
}

function svg(area, dong) {
  const title = dong ? `${area.gu} ${dong.name}` : `${area.city} ${area.gu}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#08080b"/><stop offset=".55" stop-color="#17151a"/><stop offset="1" stop-color="#c69a5d"/></linearGradient><linearGradient id="m" x1="0" x2="1"><stop offset="0" stop-color="#f4d78d"/><stop offset="1" stop-color="#d58f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="64" y="64" width="1072" height="502" rx="32" fill="#111116" opacity=".82" stroke="#d4b06f"/><text x="104" y="155" fill="#d7bb78" font-family="Arial, sans-serif" font-size="28" letter-spacing="7">MASSAGE PRO GYEONGGI DONG</text><text x="104" y="260" fill="#fff" font-family="Arial, sans-serif" font-size="70" font-weight="700">${title}</text><text x="104" y="345" fill="#f2d08d" font-family="Arial, sans-serif" font-size="48" font-weight="700">출장마사지 예약 상담</text><text x="104" y="430" fill="#d8d4cf" font-family="Arial, sans-serif" font-size="28">${phone}</text><circle cx="975" cy="238" r="82" fill="url(#m)" opacity=".88"/></svg>`;
}

const allDongUrls = [];
for (const area of areas) {
  writeFileSync(join(root, "locations", "gyeonggi", area.citySlug, area.guSlug, "index.html"), guPage(area), "utf8");
  for (const name of area.dongs) {
    const dong = { name, slug: romanize(name) };
    const htmlPath = join(root, "locations", "gyeonggi", area.citySlug, area.guSlug, dong.slug, "index.html");
    mkdirSync(dirname(htmlPath), { recursive: true });
    writeFileSync(htmlPath, dongPage(area, dong), "utf8");
    writeFileSync(join(root, "assets", `gyeonggi-${area.citySlug}-${area.guSlug}-${dong.slug}-og.svg`), svg(area, dong), "utf8");
    allDongUrls.push(`  <url><loc>${site}/locations/gyeonggi/${area.citySlug}/${area.guSlug}/${dong.slug}/</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`);
  }
}

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(/  <url><loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/gyeonggi\/[^/]+\/[^/]+\/[^<]+<\/loc><changefreq>monthly<\/changefreq><priority>0\.5<\/priority><\/url>\n/g, "");
if (!sitemap.includes("/locations/gyeonggi/suwon/yeongtong-gu/maetan-dong/")) {
  sitemap = sitemap.replace(/  <url><loc>https:\/\/massagepro-cpt\.pages\.dev\/locations\/gyeonggi\/yongin\/suji-gu\/<\/loc><changefreq>monthly<\/changefreq><priority>0\.55<\/priority><\/url>/, match => `${match}\n${allDongUrls.join("\n")}`);
}
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(`Generated ${areas.length} Gyeonggi gu pages and ${allDongUrls.length} dong pages.`);
