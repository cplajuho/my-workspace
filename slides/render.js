// 블로그용 이미지 슬라이드 생성기 (공인노무사 김주호)
// 사용: node render.js decks/예시.json  →  output/<이름>/01.png ... 을 만든다.
// 첫 장(표지)과 마지막 장(상담 안내)은 모든 주제에서 같은 디자인을 쓴다.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = __dirname;
const SIZE = 1080;
const url = (p) => 'file://' + path.resolve(ROOT, p);

const PROFILE = {
  name: '공인노무사 김주호',
  phone: '010-6856-6623',
  photo: url('assets/profile_full.png'),
};

// [[강조]] → 골드(어두운 배경) / 포인트색(밝은 배경), 줄바꿈 \n → <br>
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = (s) => esc(s || '').replace(/\[\[(.+?)\]\]/g, '<em>$1</em>').replace(/\n/g, '<br>');

const css = `
@import url('${url('node_modules/@fontsource/noto-serif-kr/korean-900.css')}');
@import url('${url('node_modules/@fontsource/gowun-batang/700.css')}');
@import url('${url('node_modules/@fontsource/nanum-myeongjo/800.css')}');
@import url('${url('node_modules/@fontsource/noto-serif-kr/korean-700.css')}');
@font-face{font-family:Pretendard;font-weight:400;src:url('${url('node_modules/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2')}')}
@font-face{font-family:Pretendard;font-weight:500;src:url('${url('node_modules/pretendard/dist/web/static/woff2/Pretendard-Medium.woff2')}')}
@font-face{font-family:Pretendard;font-weight:700;src:url('${url('node_modules/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2')}')}
@font-face{font-family:Pretendard;font-weight:900;src:url('${url('node_modules/pretendard/dist/web/static/woff2/Pretendard-Black.woff2')}')}
@font-face{font-family:Pretendard;font-weight:800;src:url('${url('node_modules/pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2')}')}
:root{
  --ink:#1d1a16; --sub:#5b5248; --ivory:#f8f3ea; --card:#fffdf8; --line:#e6dccb;
  --gold:#b8925a; --gold-hi:#f3dfae; --navy:#1f2a44; --ok:#2e7d5b; --no:#c0392b;
  --goldgrad:linear-gradient(180deg,#fff4d6 0%,#f0d39a 50%,#cfa564 100%);
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${SIZE}px;height:${SIZE}px;overflow:hidden}
body{font-family:Pretendard,'Noto Color Emoji',sans-serif;color:var(--ink);word-break:keep-all}
.emo{font-family:'Noto Color Emoji';line-height:1}
.slide{position:relative;width:${SIZE}px;height:${SIZE}px;overflow:hidden}

/* ---------- 어두운 브랜드 배경 (표지/마무리) ---------- */
.dark{background:
  radial-gradient(ellipse 70% 60% at 78% 38%,rgba(150,110,60,.35),transparent 70%),
  radial-gradient(ellipse 60% 50% at 10% 100%,rgba(90,60,30,.35),transparent 70%),
  linear-gradient(160deg,#15110d 0%,#0b0907 55%,#17110b 100%);color:#fff}
.dark .panels{position:absolute;inset:0;opacity:.18;background:
  repeating-linear-gradient(90deg,transparent 0 118px,rgba(214,176,112,.35) 118px 120px)}
.dark .panels::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#0b0907 0%,transparent 30%,transparent 60%,#0b0907 100%)}
.dark svg.streak{position:absolute;inset:0}
.dark em{font-style:normal;text-shadow:none;filter:drop-shadow(0 4px 14px rgba(0,0,0,.5));background:var(--goldgrad);-webkit-background-clip:text;background-clip:text;color:transparent}
.badge{position:absolute;top:64px;left:72px;display:flex;align-items:center;gap:14px;font-size:26px;font-weight:500;color:#e8d3a6;letter-spacing:.5px}
.badge i{width:44px;height:2px;background:var(--goldgrad)}
.photo{position:absolute;right:-30px;bottom:-330px;height:1380px;filter:drop-shadow(-30px 10px 40px rgba(0,0,0,.65))}
.glow{position:absolute;right:40px;top:120px;width:620px;height:620px;border-radius:50%;
  background:radial-gradient(circle,rgba(232,196,128,.28),transparent 65%)}
.cover-title{position:absolute;left:72px;top:200px;width:560px;font-family:'Noto Serif KR',serif;font-weight:900;
  font-size:86px;line-height:1.24;letter-spacing:-2px;text-shadow:0 4px 18px rgba(0,0,0,.5)}
.f-sans .cover-title{font-family:Pretendard;font-weight:900;letter-spacing:-3px;line-height:1.2}
.f-gowun .cover-title{font-family:'Gowun Batang';font-weight:700;letter-spacing:-1.5px}
.f-nanum .cover-title{font-family:'Nanum Myeongjo';font-weight:800;letter-spacing:-1.5px}
.rule{width:300px;height:3px;margin:44px 0 34px;background:linear-gradient(90deg,#e3c48a,rgba(227,196,138,0))}

/* 노무사회 엠블럼 워터마크: 제목 뒤 왼쪽 배경에 크게·흐리게 */
.dark .wm{position:absolute;left:-40px;top:150px;width:600px;opacity:.07}
.cover-sub{font-size:34px;line-height:1.55;font-weight:500;color:#eadfcc;font-family:Pretendard}
.sig{position:absolute;left:72px;bottom:70px;font-size:28px;font-weight:700;color:#fff}
.sig small{display:block;font-size:22px;font-weight:500;color:#c9b48c;margin-bottom:6px;letter-spacing:1px}
.callbar{position:absolute;left:56px;right:56px;bottom:72px;height:132px;border-radius:66px;display:flex;align-items:center;
  padding:0 54px;gap:34px;background:linear-gradient(180deg,rgba(40,30,20,.92),rgba(14,10,7,.95));
  border:3px solid #d9b77a;box-shadow:0 0 0 1px rgba(0,0,0,.6),0 18px 40px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,240,200,.25)}
.callbar svg{width:64px;height:64px;flex:none}
.callbar .lbl{font-size:40px;font-weight:700;color:#e9cf98}
.callbar .num{font-size:66px;font-weight:800;letter-spacing:1px;background:var(--goldgrad);-webkit-background-clip:text;background-clip:text;color:transparent}

/* ---------- 밝은 본문 슬라이드 ---------- */
.light{background:radial-gradient(ellipse 80% 60% at 50% 0%,#fffaf0,transparent 70%),var(--ivory)}
.light em{font-style:normal;color:var(--gold);}
.light .hl em{color:#a5742e;background:linear-gradient(180deg,transparent 62%,rgba(227,196,138,.45) 62%)}
.top{position:absolute;top:64px;left:72px;right:72px;display:flex;align-items:center;gap:20px}
.top .no{font-family:'Noto Serif KR';font-weight:900;font-size:44px;background:var(--goldgrad);-webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-stroke:.5px #b8925a}
.top .tt{font-size:30px;font-weight:700;color:var(--navy)}
.top i{flex:1;height:2px;background:linear-gradient(90deg,var(--line),transparent)}
.foot{position:absolute;bottom:48px;left:72px;right:72px;display:flex;justify-content:space-between;font-size:22px;color:#9a8d7a;font-weight:500}
.body{position:absolute;top:150px;bottom:110px;left:72px;right:72px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.head{font-family:'Noto Serif KR';font-weight:900;font-size:66px;line-height:1.3;letter-spacing:-1.5px;color:var(--ink)}
.cap{margin-top:30px;font-size:34px;line-height:1.5;color:var(--sub);font-weight:500}
.hero{font-size:230px;margin-bottom:40px;filter:drop-shadow(0 18px 24px rgba(80,50,10,.18))}
.disc{width:340px;height:340px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:44px;
  background:radial-gradient(circle at 35% 30%,#fff,#f1e6d2);border:3px solid #e3c48a;box-shadow:0 24px 50px rgba(120,90,40,.18)}
.disc .emo{font-size:190px}

.big{font-family:'Noto Serif KR';font-weight:900;font-size:250px;line-height:1;letter-spacing:-6px;
  background:linear-gradient(180deg,#d7b275,#8a6a3a);-webkit-background-clip:text;background-clip:text;color:transparent}
.big small{font-size:110px;letter-spacing:-2px}
.pre{font-size:42px;font-weight:700;color:var(--navy);margin-bottom:18px}

.cmp{display:flex;gap:40px;width:100%}
.cmp .c{flex:1;background:var(--card);border-radius:36px;padding:54px 30px 46px;border:3px solid var(--line);position:relative;
  box-shadow:0 20px 40px rgba(90,60,20,.08)}
.cmp .c.ok{border-color:#9fcdb6}.cmp .c.no{border-color:#e8b0a8}
.cmp .mark{position:absolute;top:-38px;left:50%;transform:translateX(-50%);width:76px;height:76px;border-radius:50%;color:#fff;
  font-size:46px;font-weight:800;display:flex;align-items:center;justify-content:center}
.cmp .ok .mark{background:var(--ok)}.cmp .no .mark{background:var(--no)}
.cmp .emo{font-size:150px;margin:20px 0 26px}
.cmp .l{font-size:44px;font-weight:800;color:var(--ink)}
.cmp .t{margin-top:14px;font-size:32px;color:var(--sub);line-height:1.45;font-weight:500}
.mid-head{font-family:'Noto Serif KR';font-weight:900;font-size:56px;line-height:1.3;margin-bottom:70px;letter-spacing:-1px}

.steps{display:flex;align-items:flex-start;justify-content:center;width:100%}
.steps .s{flex:1;display:flex;flex-direction:column;align-items:center}
.steps .ic{width:200px;height:200px;border-radius:50%;background:var(--card);border:3px solid #e3c48a;display:flex;align-items:center;justify-content:center;
  box-shadow:0 18px 36px rgba(90,60,20,.10);position:relative}
.steps .ic .emo{font-size:112px}
.steps .n{position:absolute;top:-10px;left:-6px;width:58px;height:58px;border-radius:50%;background:var(--navy);color:#f3dfae;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center}
.steps .l{margin-top:28px;font-size:36px;font-weight:800;line-height:1.3}
.steps .t{margin-top:8px;font-size:27px;color:var(--sub);font-weight:500;line-height:1.35}
.steps .arr{flex:none;width:60px;margin-top:80px;color:#c9a063;font-size:52px;font-weight:800}

.chk{width:100%;display:flex;flex-direction:column;gap:24px;text-align:left}
.chk .r{display:flex;align-items:center;gap:30px;background:var(--card);border:2px solid var(--line);border-radius:28px;padding:26px 36px;
  box-shadow:0 12px 26px rgba(90,60,20,.06)}
.chk .emo{font-size:72px;flex:none;width:86px;text-align:center}
.chk .x{font-size:40px;font-weight:700;line-height:1.3;flex:1}
.chk .x small{display:block;font-size:28px;color:var(--sub);font-weight:500;margin-top:4px}
.chk .box{flex:none;width:60px;height:60px;border-radius:16px;background:var(--navy);display:flex;align-items:center;justify-content:center}
.chk .box.no{background:var(--no)}

.fx{display:flex;align-items:center;justify-content:center;gap:18px;width:100%}
.fx .p{display:flex;flex-direction:column;align-items:center;width:230px}
.fx .p .ic{width:190px;height:190px;border-radius:40px;background:var(--card);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(90,60,20,.08)}
.fx .p .emo{font-size:110px}
.fx .p .l{margin-top:22px;font-size:32px;font-weight:800;line-height:1.3}
.fx .op{font-size:76px;font-weight:800;color:#c9a063;margin-top:-70px}
.fx .res .ic{background:var(--navy);border-color:var(--navy)}

.ph{position:absolute;inset:0;background-size:cover;background-position:center}
.ph::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,8,6,.05) 30%,rgba(10,8,6,.85) 100%)}
.ph-text{position:absolute;left:72px;right:72px;bottom:120px;color:#fff}
.ph-text .head{color:#fff}
.ph-text em{font-style:normal;background:var(--goldgrad);-webkit-background-clip:text;background-clip:text;color:transparent}
`;

const PHONE_SVG = `<svg viewBox="0 0 64 64" fill="none"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d6"/><stop offset=".55" stop-color="#e6c88f"/><stop offset="1" stop-color="#b8925a"/></linearGradient></defs>
<circle cx="32" cy="32" r="31" fill="url(#pg)"/><circle cx="32" cy="32" r="27.5" stroke="#1a130d" stroke-opacity=".25" stroke-width="1"/>
<rect x="22.5" y="13" width="19" height="38" rx="4.5" fill="#17110c"/><rect x="25.5" y="18" width="13" height="25" rx="1.5" fill="#e6c88f" opacity=".35"/>
<rect x="29" y="15.2" width="6" height="1.4" rx=".7" fill="#e6c88f" opacity=".6"/><circle cx="32" cy="46.8" r="1.9" fill="#e6c88f" opacity=".75"/></svg>`;

const STREAK = `<svg class="streak" viewBox="0 0 1080 1080"><defs>
<linearGradient id="st" x1="0" x2="1"><stop offset="0" stop-color="#e3c48a" stop-opacity="0"/><stop offset=".55" stop-color="#f6dfa8" stop-opacity=".9"/><stop offset="1" stop-color="#e3c48a" stop-opacity="0"/></linearGradient>
<filter id="bl"><feGaussianBlur stdDeviation="6"/></filter></defs>
<path d="M-40 900 C 300 760, 700 640, 1120 380" stroke="url(#st)" stroke-width="10" fill="none" filter="url(#bl)" opacity=".55"/>
<path d="M-40 900 C 300 760, 700 640, 1120 380" stroke="url(#st)" stroke-width="2.5" fill="none"/>
<path d="M-40 980 C 380 860, 760 760, 1120 560" stroke="url(#st)" stroke-width="1.5" fill="none" opacity=".5"/></svg>`;

const darkBase = (inner, font = 'gowun', closing = false) => `<div class="slide dark ${font === 'noto' ? '' : 'f-' + font}"><div class="panels"></div>${STREAK}<div class="glow"></div>
<img class="wm" src="${url('assets/kcplaa_emblem_gold.png')}"><img class="photo" src="${PROFILE.photo}">${inner}</div>`;

const tpl = {
  cover: (d) => darkBase(`
    <div class="badge"><i></i>${esc(PROFILE.name)} · 노동법 블로그</div>
    <div class="cover-title"${d.size ? ` style="font-size:${d.size}px"` : ''}>${rich(d.title)}
      <div class="rule"></div><div class="cover-sub">${rich(d.subtitle)}</div></div>
    <div class="sig"><small>LABOR LAW CONSULTING</small>${esc(PROFILE.name)}</div>`, d.font),

  closing: (d) => darkBase(`
    <div class="badge"><i></i>${esc(PROFILE.name)} · 노동법 블로그</div>
    <div class="cover-title" style="top:170px">${rich(d.message || '노동문제,\n[[함께]] 풀면\n길이 보입니다.')}
      <div class="rule"></div><div class="cover-sub">${rich(d.sub || '어려운 법 조항 대신\n내 상황에 맞는 해법으로\n쉽게 안내해 드립니다.')}</div></div>
    <div class="callbar">${PHONE_SVG}<span class="lbl">상담문의</span><span class="num">${esc(PROFILE.phone)}</span></div>`, d.font, true),

  statement: (d) => `<div class="disc"><span class="emo">${esc(d.emoji)}</span></div>
    <div class="head hl">${rich(d.head)}</div>${d.caption ? `<div class="cap">${rich(d.caption)}</div>` : ''}`,

  number: (d) => `${d.emoji ? `<div class="emo" style="font-size:120px;margin-bottom:20px">${esc(d.emoji)}</div>` : ''}
    ${d.pre ? `<div class="pre">${rich(d.pre)}</div>` : ''}
    <div class="big">${esc(d.value)}${d.unit ? `<small>${esc(d.unit)}</small>` : ''}</div>
    ${d.caption ? `<div class="cap" style="margin-top:40px">${rich(d.caption)}</div>` : ''}`,

  compare: (d) => `${d.head ? `<div class="mid-head hl">${rich(d.head)}</div>` : ''}<div class="cmp">${d.items.map((it) => `
    <div class="c ${it.ok === false ? 'no' : it.ok === true ? 'ok' : ''}">${it.ok === undefined ? '' : `<div class="mark">${it.ok ? 'O' : 'X'}</div>`}
    <div class="emo">${esc(it.emoji)}</div><div class="l">${rich(it.label)}</div>${it.text ? `<div class="t">${rich(it.text)}</div>` : ''}</div>`).join('')}</div>`,

  steps: (d) => `${d.head ? `<div class="mid-head hl">${rich(d.head)}</div>` : ''}<div class="steps">${d.items.map((it, i) => `
    ${i ? '<div class="arr">›</div>' : ''}<div class="s"><div class="ic"><span class="n">${i + 1}</span><span class="emo">${esc(it.emoji)}</span></div>
    <div class="l">${rich(it.label)}</div>${it.text ? `<div class="t">${rich(it.text)}</div>` : ''}</div>`).join('')}</div>`,

  checklist: (d) => `${d.head ? `<div class="mid-head hl" style="margin-bottom:50px">${rich(d.head)}</div>` : ''}<div class="chk">${d.items.map((it) => `
    <div class="r"><span class="emo">${esc(it.emoji || '✔️')}</span><div class="x">${rich(it.label)}${it.text ? `<small>${rich(it.text)}</small>` : ''}</div>
    ${d.mark === 'x'
      ? '<span class="box no"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/></svg></span>'
      : '<span class="box"><svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#f3dfae" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'}</div>`).join('')}</div>`,

  formula: (d) => `${d.head ? `<div class="mid-head hl">${rich(d.head)}</div>` : ''}<div class="fx">${d.items.map((it, i) => `
    ${i ? `<div class="op">${esc(d.ops ? d.ops[i - 1] : '×')}</div>` : ''}<div class="p ${i === d.items.length - 1 && d.resultLast ? 'res' : ''}"><div class="ic"><span class="emo">${esc(it.emoji)}</span></div><div class="l">${rich(it.label)}</div></div>`).join('')}</div>
    ${d.caption ? `<div class="cap" style="margin-top:56px">${rich(d.caption)}</div>` : ''}`,
};

function contentSlide(d, idx) {
  if (d.type === 'photo') {
    return `<div class="slide"><div class="ph" style="background-image:url('${url(d.image)}')"></div>
      <div class="ph-text"><div class="head">${rich(d.head)}</div>${d.caption ? `<div class="cap" style="color:#eadfcc">${rich(d.caption)}</div>` : ''}</div></div>`;
  }
  const no = String(idx).padStart(2, '0');
  return `<div class="slide light"><div class="top"><span class="no">${no}</span><span class="tt">${esc(d.topic || '')}</span><i></i></div>
    <div class="body">${tpl[d.type](d)}</div>
    <div class="foot"><span>${esc(PROFILE.name)}</span><span>노동법 블로그</span></div></div>`;
}

const THEMES = require('./themes.js')({ esc, rich, PROFILE });
const coverOf = (theme) => (!theme || theme === 'gold' ? tpl : THEMES[theme] || tpl);

async function main() {
  const specPath = process.argv[2];
  if (!specPath) { console.error('사용법: node render.js decks/파일.json'); process.exit(1); }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const name = spec.name || path.basename(specPath, '.json');
  const outDir = path.join(ROOT, 'output', name);
  fs.mkdirSync(outDir, { recursive: true });

  const th = coverOf(spec.theme);
  const pages = [th.cover(spec.cover), ...spec.slides.map((s, i) => contentSlide(s, i + 1)), th.closing({ font: spec.cover.font, ...(spec.closing || {}) })];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: spec.scale || 1 });
  for (let i = 0; i < pages.length; i++) {
    const file = path.join(outDir, `_tmp.html`);
    fs.writeFileSync(file, `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${css}${THEMES.css}</style></head><body>${pages[i]}</body></html>`);
    await page.goto('file://' + file);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(outDir, `${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: out });
    console.log(out);
  }
  fs.unlinkSync(path.join(outDir, '_tmp.html'));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
