// 표지·마무리 슬라이드 테마. spec.theme 로 고른다: 'navy'(기본) | 'light' | 'gold'(초기 시안)
// 참고 이미지(검정·금색·명조체)와 겹치지 않도록 navy/light 는 색·배치·서체를 모두 다르게 했다.
module.exports = ({ esc, rich, PROFILE }) => {
  const DEF_MSG = '노동문제,\n[[함께]] 풀면\n길이 보입니다.';
  const DEF_SUB = '어려운 법 조항 대신\n내 상황에 맞는 해법으로\n쉽게 안내해 드립니다.';
  const fs = (d) => (d.size ? ` style="font-size:${d.size}px"` : '');

  const css = `
  /* ===== NAVY: 인물 왼쪽 · 제목 오른쪽 · 고딕 · 하늘색 포인트 ===== */
  .tn{background:#0d1a30;color:#fff}
  .tn .grid{position:absolute;inset:0;opacity:.5;background:
    linear-gradient(rgba(124,196,255,.07) 1px,transparent 1px) 0 0/54px 54px,
    linear-gradient(90deg,rgba(124,196,255,.07) 1px,transparent 1px) 0 0/54px 54px}
  .tn .orb{position:absolute;left:-120px;top:150px;width:760px;height:760px;border-radius:50%;
    background:radial-gradient(circle at 50% 45%,#27467a 0%,#173059 45%,rgba(13,26,48,0) 72%)}
  .tn .ring{position:absolute;left:-40px;top:230px;width:600px;height:600px;border-radius:50%;border:2px solid rgba(124,196,255,.35)}
  .tn .photo{position:absolute;left:-60px;bottom:-330px;height:1360px;filter:drop-shadow(20px 10px 40px rgba(0,0,0,.55))}
  .tn .txt{position:absolute;left:520px;right:60px;top:170px}
  .tn .chip{display:inline-block;padding:10px 24px;border:2px solid #7cc4ff;border-radius:40px;color:#9fd3ff;font-size:26px;font-weight:700;margin-bottom:34px}
  .tn h1{font-family:Pretendard;font-weight:800;font-size:72px;line-height:1.22;letter-spacing:-2.5px}
  .tn h1 em{font-style:normal;color:#0d1a30;background:#7cc4ff;padding:0 10px;border-radius:8px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
  .tn .sub{margin-top:36px;font-size:31px;line-height:1.55;color:#b9c8df;font-weight:500;border-left:5px solid #7cc4ff;padding-left:22px}
  .tn .who{position:absolute;right:60px;bottom:62px;text-align:right;font-size:30px;font-weight:800}
  .tn .who small{display:block;font-size:21px;font-weight:600;color:#7cc4ff;letter-spacing:3px;margin-bottom:6px}
  .tn .call{position:absolute;left:520px;right:60px;bottom:70px;background:#fff;border-radius:28px;padding:30px 36px;color:#0d1a30;
    box-shadow:0 20px 40px rgba(0,0,0,.35)}
  .tn .call small{display:flex;align-items:center;gap:10px;font-size:25px;font-weight:700;color:#3b6fb6}
  .tn .call small i{width:12px;height:12px;border-radius:50%;background:#2ecc71;box-shadow:0 0 0 5px rgba(46,204,113,.2)}
  .tn .call b{display:block;margin-top:6px;font-size:50px;font-weight:800;white-space:nowrap}

  /* ===== LIGHT: 밝은 아이보리 · 네이비 아치 · 형광펜 강조 ===== */
  .tl{background:#f5f2ec;color:#14233f}
  .tl .arch{position:absolute;right:-20px;bottom:0;width:560px;height:860px;border-radius:280px 280px 0 0;
    background:linear-gradient(170deg,#1d3461,#0f1f3d)}
  .tl .arch2{position:absolute;right:20px;bottom:0;width:480px;height:790px;border-radius:240px 240px 0 0;border:2px solid rgba(255,255,255,.18)}
  .tl .dots{position:absolute;left:470px;top:60px;width:190px;height:120px;opacity:.35;
    background:radial-gradient(#14233f 2.5px,transparent 3px) 0 0/24px 24px}
  .tl .photo{position:absolute;right:-30px;bottom:-330px;height:1340px;filter:drop-shadow(-14px 8px 26px rgba(15,31,61,.35))}
  .tl .top{position:absolute;left:64px;top:62px;display:flex;align-items:center;gap:14px;font-size:25px;font-weight:700}
  .tl .top b{background:#14233f;color:#fff;padding:8px 18px;border-radius:8px}
  .tl .txt{position:absolute;left:64px;top:190px;width:560px}
  .tl h1{font-family:Pretendard;font-weight:800;font-size:76px;line-height:1.24;letter-spacing:-2.5px}
  .tl h1 em{font-style:normal;background:linear-gradient(180deg,transparent 58%,#ffd84d 58%,#ffd84d 92%,transparent 92%)}
  .tl .sub{margin-top:34px;font-size:31px;line-height:1.55;color:#4a5872;font-weight:500}
  .tl .who{position:absolute;left:64px;bottom:200px;font-size:30px;font-weight:800}
  .tl .who small{display:block;font-size:21px;color:#8a7a52;letter-spacing:3px;font-weight:700;margin-bottom:6px}
  .tl .band{position:absolute;left:0;right:0;bottom:0;height:150px;background:#14233f;display:flex;align-items:center;padding:0 64px;gap:28px;color:#fff;z-index:2}
  .tl .band small{font-size:28px;font-weight:700;color:#ffd84d}
  .tl .band b{font-size:62px;font-weight:800;letter-spacing:1px}
  `;

  const navy = {
    cover: (d) => `<div class="slide tn"><div class="grid"></div><div class="orb"></div><div class="ring"></div>
      <img class="photo" src="${PROFILE.photo}">
      <div class="txt"><span class="chip">${esc(d.chip || '노동법 블로그')}</span><h1${fs(d)}>${rich(d.title)}</h1><div class="sub">${rich(d.subtitle)}</div></div>
      <div class="who"><small>LABOR ATTORNEY</small>${esc(PROFILE.name)}</div></div>`,
    closing: (d) => `<div class="slide tn"><div class="grid"></div><div class="orb"></div><div class="ring"></div>
      <img class="photo" src="${PROFILE.photo}">
      <div class="txt" style="top:120px"><span class="chip">${esc(PROFILE.name)}</span><h1>${rich(d.message || DEF_MSG)}</h1><div class="sub">${rich(d.sub || DEF_SUB)}</div></div>
      <div class="call"><small><i></i>상담 문의</small><b>${esc(PROFILE.phone)}</b></div></div>`,
  };

  const light = {
    cover: (d) => `<div class="slide tl"><div class="arch"></div><div class="arch2"></div><div class="dots"></div>
      <img class="photo" src="${PROFILE.photo}">
      <div class="top"><b>${esc(d.chip || '노동법 블로그')}</b>${esc(PROFILE.name)}</div>
      <div class="txt"><h1${fs(d)}>${rich(d.title)}</h1><div class="sub">${rich(d.subtitle)}</div></div>
      <div class="who" style="bottom:70px"><small>LABOR ATTORNEY</small>${esc(PROFILE.name)}</div></div>`,
    closing: (d) => `<div class="slide tl"><div class="arch"></div><div class="arch2"></div>
      <img class="photo" src="${PROFILE.photo}">
      <div class="top"><b>상담 안내</b>${esc(PROFILE.name)}</div>
      <div class="txt"><h1>${rich(d.message || DEF_MSG)}</h1><div class="sub">${rich(d.sub || DEF_SUB)}</div></div>
      <div class="band"><small>상담 문의</small><b>${esc(PROFILE.phone)}</b></div></div>`,
  };

  return { css, navy, light };
};
