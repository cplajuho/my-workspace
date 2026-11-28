// 고급형 중간 슬라이드 (표지와 같은 다크·골드 톤, 골드 라인 아이콘, 도식 중심)
// 타입: p-hero · p-route · p-scope · p-cards · p-detour · p-grid · p-timeline
module.exports = ({ esc, rich, PROFILE, url }) => {
  // ---------- 골드 라인 아이콘 (24 그리드, stroke=currentColor) ----------
  const P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>',
    office: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 10.5h1M14 10.5h1M9 14h1M14 14h1"/><path d="M10.5 21v-3.5h3V21"/>',
    walk: '<circle cx="13.5" cy="4.2" r="1.9"/><path d="M13 7.6 11.3 13.2"/><path d="M11.3 13.2l2.6 3.4-.6 4.4"/><path d="M11.3 13.2 8.8 16.6 6 18"/><path d="M12.8 8.6l2.6 3 2.8.8"/><path d="M12.8 8.6 9.9 10.6 8.6 13.4"/>',
    bus: '<rect x="5" y="3" width="14" height="15" rx="2.5"/><path d="M5 10.5h14"/><path d="M8 14.5h.5M15.5 14.5h.5"/><path d="M8 18v2.5M16 18v2.5"/>',
    train: '<rect x="6" y="3" width="12" height="14" rx="3"/><rect x="8.2" y="5.6" width="7.6" height="4.4" rx="1"/><path d="M9 13.3h.5M14.5 13.3h.5"/><path d="M8.5 17 6.5 21M15.5 17l2 4"/>',
    bike: '<circle cx="6" cy="16" r="3.6"/><circle cx="18" cy="16" r="3.6"/><path d="M6 16 9.8 9h5.4L18 16"/><path d="M9.8 9l3.3 7 2.1-7"/><path d="M8.6 7.6h2.6M15.2 9l-.9-3h2"/>',
    car: '<path d="M3.5 15.5v-3.4L6 7h12l2.5 5.1v3.4z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/><path d="M6 11.5h12"/>',
    ice: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.6 4.6 12 6.6l2.4-2M9.6 19.4l2.4-2 2.4 2M4.6 10.4l3 .9-.8 3M19.4 10.4l-3 .9.8 3"/>',
    beer: '<path d="M6 8h9v11.5a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 6 19.5z"/><path d="M15 10.5h1.8a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2H15"/><path d="M6 8c.3-2.2 2.6-3 4-1.8 1.2-1.4 3.8-1.2 5 1.8"/><path d="M9 11.5v6M12 11.5v6"/>',
    door: '<path d="M6 21V3.5h12V21"/><circle cx="15" cy="12.5" r=".9"/><path d="M3.5 21h17"/>',
    stairs: '<path d="M3 20.5h4.5V16H12v-4.5h4.5V7H21"/><path d="M3 20.5h18"/>',
    elevator: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M12 7v14"/><path d="M8 6l1.2-1.4L10.4 6M13.6 4.8 14.8 6.2 16 4.8"/>',
    scooter: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8.2 18h7.6l1.5-13"/><path d="M15.2 5h4"/>',
    calendar: '<rect x="4" y="5" width="16" height="15.5" rx="2"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4"/><path d="M9 14.5l2 2 4-4"/>',
    cart: '<path d="M2.5 4h3l2.2 11h10.6l2-8H6.6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    hospital: '<rect x="4" y="4" width="16" height="16.5" rx="2"/><path d="M12 8.2v8.3M7.9 12.4h8.2"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.6-2.6h4.8L16 7"/><circle cx="12" cy="13.5" r="3.6"/>',
    eye: '<path d="M2.5 12C5 6.8 19 6.8 21.5 12 19 17.2 5 17.2 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.2" rx="1"/><path d="M12 9.5v6.2M8.9 12.6h6.2"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.8h18M6.5 14.8h4"/>',
    pin: '<path d="M12 21c-4.6-5.4-7-8.9-7-12a7 7 0 0 1 14 0c0 3.1-2.4 6.6-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    form: '<path d="M6 3h8.5L18 6.5V21H6z"/><path d="M14.5 3v3.5H18"/><path d="M9 11.5h6M9 14.5h6M9 17.5h3.5"/>',
    gov: '<path d="M3 9 12 4l9 5z"/><path d="M6 10.5v7M10 10.5v7M14 10.5v7M18 10.5v7"/><path d="M4 18.5h16M3 21h18"/>',
    shield: '<path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    warn: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 9.5v5M12 17.2v.3"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M7.6 9l1.6 6.2L12 10l2.8 5.2L16.4 9"/><path d="M7 12h10"/>',
    gift: '<rect x="4" y="10" width="16" height="10.5" rx="1"/><rect x="3" y="7" width="18" height="3.2" rx="1"/><path d="M12 7v13.5"/><path d="M12 7C10.6 4 7 3.8 7.4 6.2 7.6 7 9 7 12 7zM12 7c1.4-3 5-3.2 4.6-.8C16.4 7 15 7 12 7z"/>',
    meal: '<path d="M7 3v5.5M5 3v4a2 2 0 0 0 4 0V3M7 9.5V21"/><path d="M16.5 21V3c2 1.4 3 4 3 7.5h-3"/>',
    idcard: '<rect x="4" y="4" width="16" height="16.5" rx="2"/><circle cx="12" cy="10" r="2.6"/><path d="M7.6 17.4c.8-2 2.4-3 4.4-3s3.6 1 4.4 3"/>',
    chart: '<path d="M3.5 20.5h17"/><rect x="5.5" y="13" width="3" height="7.5"/><rect x="10.5" y="9" width="3" height="11.5"/><rect x="15.5" y="5" width="3" height="15.5"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19.5c.6-3.2 2.8-5.2 5.5-5.2s4.9 2 5.5 5.2"/><circle cx="16.6" cy="9" r="2.4"/><path d="M15.4 14.2c2.6-.3 4.6 1.4 5.2 4.3"/>',
    scale: '<path d="M12 4v16M8 20.5h8M5 7.5h14"/><path d="M5 7.5 2.6 13a2.6 2.6 0 0 0 4.8 0zM19 7.5 16.6 13a2.6 2.6 0 0 0 4.8 0z"/><circle cx="12" cy="4" r="1"/>',
    moon: '<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/>',
    heart: '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12.5h18"/>',
    family: '<circle cx="7" cy="7" r="2.3"/><circle cx="17" cy="7" r="2.3"/><circle cx="12" cy="11.5" r="1.8"/><path d="M3.5 17c.4-3 1.8-5 3.5-5s3 1.2 3.4 2.6M20.5 17c-.4-3-1.8-5-3.5-5s-3 1.2-3.4 2.6M9 20c.4-2.2 1.5-3.5 3-3.5s2.6 1.3 3 3.5"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="3.6" rx=".6"/><path d="M8.5 13h.5M12 13h.5M15.5 13h.5M8.5 16.5h.5M12 16.5h.5M15.5 16.5h.5"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M9 13.6 7.5 21l4.5-2.5 4.5 2.5-1.5-7.4"/><path d="M10 9l1.4 1.4L14.2 7.6"/>',
    fall: '<circle cx="16.5" cy="5" r="1.9"/><path d="M15.5 8.2 10.5 11l-3.8-1.4"/><path d="M10.5 11l1.6 4-4.6 2.6"/><path d="M12.1 15l4.4 1.2 1.2 3.6"/><path d="M2.5 21h19"/>',
  };
  const icon = (n, size = 64) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${P[n] || P.warn}</svg>`;
  const OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.5l4 4 9-9.5"/></svg>';
  const NO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></svg>';
  const badge = (ok, cls = '') => `<span class="bdg ${ok ? 'ok' : 'no'} ${cls}">${ok ? OK : NO}</span>`;

  const css = `
  .pm{background:radial-gradient(ellipse 90% 60% at 50% 0%,#2b2119 0%,#17110d 55%,#0d0a08 100%);color:#f4ead6;font-family:Pretendard}
  .pm .noise{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
  .pm .frame{position:absolute;inset:34px;border:1px solid rgba(217,183,122,.22);pointer-events:none}
  .pm .hdr{position:absolute;left:72px;right:72px;top:66px;display:flex;align-items:center;gap:18px}
  .pm .hdr .no{font-family:'Gowun Batang';font-weight:700;font-size:40px;color:#d9b77a;line-height:1}
  .pm .hdr .bar{width:1px;height:26px;background:rgba(217,183,122,.5)}
  .pm .hdr .tp{font-size:23px;font-weight:600;letter-spacing:3px;color:#cdb88f}
  .pm .hdr .sr{margin-left:auto;font-size:19px;letter-spacing:4px;color:rgba(205,184,143,.6);font-weight:500}
  .pm .ftr{position:absolute;left:72px;right:72px;bottom:58px;display:flex;justify-content:space-between;font-size:19px;color:rgba(205,184,143,.6);letter-spacing:1px}
  .pm h2{position:absolute;left:60px;right:60px;top:150px;text-align:center;font-family:'Gowun Batang';font-weight:700;font-size:64px;line-height:1.3;letter-spacing:-1.5px;color:#f6eddb}
  .pm h2 em,.pm .gold{font-style:normal;background:linear-gradient(180deg,#fff1cf,#e2c182 55%,#b98d4f);-webkit-background-clip:text;background-clip:text;color:transparent}
  .pm .cap{position:absolute;left:60px;right:60px;margin:0;text-align:center;font-size:27px;color:#b4a68f;line-height:1.5}
  .pm .ic{color:#e2c182}
  .pm .node{position:absolute;display:flex;flex-direction:column;align-items:center;transform:translateX(-50%)}
  .pm .ring{border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 50% 35%,#2e241b,#16110d);border:1.5px solid rgba(226,193,130,.75);box-shadow:0 0 0 7px rgba(226,193,130,.07),0 18px 40px rgba(0,0,0,.45)}
  .pm .ring.dim{border-color:rgba(190,110,90,.7);box-shadow:0 0 0 7px rgba(190,110,90,.08),0 18px 40px rgba(0,0,0,.45)}
  .pm .ring.dim .ic{color:#d79a86}
  .pm .lb{margin-top:16px;font-size:27px;font-weight:700;color:#f4ead6;white-space:nowrap;text-align:center;line-height:1.3}
  .pm .sb{margin-top:4px;font-size:21px;color:#a89a85;white-space:nowrap;text-align:center}
  .pm .bdg{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%}
  .pm .bdg svg{width:26px;height:26px}
  .pm .bdg.ok{background:linear-gradient(180deg,#f3dba3,#c99a55);color:#1b140e;box-shadow:0 0 0 5px rgba(226,193,130,.15)}
  .pm .bdg.no{background:#a8493a;color:#fbe9e4;box-shadow:0 0 0 5px rgba(168,73,58,.18)}
  .pm .bdg.big{width:64px;height:64px}.pm .bdg.big svg{width:34px;height:34px}
  .pm svg.lines{position:absolute;inset:0;overflow:visible}
  .pm .tag{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:12px;padding:10px 22px 10px 10px;border-radius:40px;
    background:rgba(20,15,11,.92);border:1px solid rgba(226,193,130,.45);font-size:24px;font-weight:700;white-space:nowrap}
  .pm .tag.no{border-color:rgba(190,110,90,.6)}
  .pm .tag small{font-weight:500;color:#a89a85;font-size:20px;margin-left:2px}

  /* hero: 아이콘 행 */
  .pm .row{position:absolute;left:72px;right:72px;display:flex;justify-content:space-between;align-items:flex-start}
  .pm .row .it{display:flex;flex-direction:column;align-items:center;width:160px}
  .pm .row .ring{width:136px;height:136px}

  /* cards */
  .pm .cards{position:absolute;left:72px;right:72px;top:400px;display:flex;gap:28px}
  .pm .cd{flex:1;position:relative;padding:62px 24px 40px;border-radius:26px;text-align:center;
    background:linear-gradient(180deg,rgba(255,240,210,.06),rgba(255,240,210,.015));border:1px solid rgba(226,193,130,.3)}
  .pm .cd.no{border-color:rgba(190,110,90,.45)}
  .pm .cd .bdg{position:absolute;top:-23px;left:50%;transform:translateX(-50%)}
  .pm .cd .ring{width:128px;height:128px;margin:0 auto 26px}
  .pm .cd .t{font-size:30px;font-weight:800;line-height:1.35}
  .pm .cd .s{margin-top:12px;font-size:22px;color:#a89a85;line-height:1.45}

  /* grid 2x2 */
  .pm .grid{position:absolute;left:72px;right:72px;top:330px;display:grid;grid-template-columns:1fr 1fr;gap:24px}
  .pm .gc{position:relative;height:270px;border-radius:24px;padding:34px 34px;
    background:linear-gradient(160deg,rgba(255,240,210,.07),rgba(255,240,210,.015));border:1px solid rgba(226,193,130,.28)}
  .pm .gc .n{font-family:'Gowun Batang';font-weight:700;font-size:44px;line-height:1}
  .pm .gc .ic{position:absolute;right:30px;top:28px}
  .pm .gc .t{position:absolute;left:34px;right:30px;bottom:72px;font-size:31px;font-weight:800;line-height:1.3}
  .pm .gc .s{position:absolute;left:34px;right:30px;bottom:34px;font-size:22px;color:#a89a85}

  /* scope */
  .pm .band{position:absolute;left:72px;right:72px;top:560px;height:150px;display:flex;border-radius:22px;overflow:hidden;border:1px solid rgba(226,193,130,.3)}
  .pm .zn{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-size:24px;font-weight:700;text-align:center;line-height:1.25}
  .pm .zn.no{background:repeating-linear-gradient(135deg,rgba(168,73,58,.13) 0 12px,rgba(168,73,58,.05) 12px 24px);color:#d9a596}
  .pm .zn.ok{background:linear-gradient(180deg,rgba(226,193,130,.16),rgba(226,193,130,.06));border-left:1px dashed rgba(226,193,130,.35)}
  .pm .zn.end{background:rgba(226,193,130,.24)}
  .pm .zn .ic{color:#e2c182}.pm .zn.no .ic{color:#d79a86}
  .pm .brk{position:absolute;top:480px;height:40px;border:2px solid #d9b77a;border-bottom:0;border-radius:10px 10px 0 0}
  .pm .brk span{position:absolute;left:50%;top:-24px;transform:translate(-50%,-50%);white-space:nowrap;padding:8px 22px;border-radius:30px;
    background:linear-gradient(180deg,#f3dba3,#c99a55);color:#1b140e;font-size:24px;font-weight:800}
  .pm .doorpin{position:absolute;top:530px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}
  .pm .doorpin .ring{width:110px;height:110px}

  /* timeline */
  .pm .tline{position:absolute;left:72px;right:72px;top:420px;display:flex;justify-content:space-between}
  .pm .tline .st{width:280px;display:flex;flex-direction:column;align-items:center;position:relative}
  .pm .tline .ring{width:170px;height:170px}
  .pm .tline .num{position:absolute;top:-8px;left:52px;width:52px;height:52px;border-radius:50%;background:linear-gradient(180deg,#f3dba3,#c99a55);color:#1b140e;
    font-family:'Gowun Batang';font-weight:700;font-size:28px;display:flex;align-items:center;justify-content:center}
  .pm .chips{position:absolute;left:0;right:0;top:860px;display:flex;justify-content:center;gap:18px}
  .pm .chip{padding:12px 26px;border-radius:40px;border:1px solid rgba(226,193,130,.5);font-size:23px;font-weight:700;color:#ead7ad;background:rgba(226,193,130,.07)}

  /* criteria: 기준 기둥 */
  .pm .crit{position:absolute;left:72px;right:72px;top:360px;display:flex;gap:20px}
  .pm .pl{flex:1;position:relative;height:420px;border-radius:24px;padding:46px 14px 30px;text-align:center;
    background:linear-gradient(180deg,rgba(255,240,210,.08),rgba(255,240,210,.015));border:1px solid rgba(226,193,130,.4)}
  .pm .pl .ring{width:120px;height:120px;margin:0 auto 28px}
  .pm .pl .t{font-family:'Gowun Batang';font-weight:700;font-size:36px;line-height:1.25}
  .pm .pl .s{margin-top:14px;font-size:22px;color:#a89a85;line-height:1.4}
  .pm .pl .bdg{position:absolute;top:-23px;left:50%;transform:translateX(-50%)}
  .pm .pl.off{opacity:.62;border-style:dashed;border-color:rgba(190,110,90,.6);background:rgba(120,50,40,.08)}
  .pm .pl.off .t{text-decoration:line-through;text-decoration-color:#c0644f;text-decoration-thickness:3px}
  .pm .stamp{position:absolute;left:50%;bottom:30px;transform:translateX(-50%) rotate(-12deg);padding:8px 20px;border:3px solid #c0644f;border-radius:10px;
    color:#e08a75;font-family:'Gowun Batang';font-weight:700;font-size:30px;letter-spacing:4px;background:rgba(20,15,11,.6)}

  /* split: 포함 / 제외 두 칸 */
  .pm .split{position:absolute;left:72px;right:72px;top:300px;display:flex;gap:28px}
  .pm .col{flex:1;border-radius:24px;padding:26px 24px 18px;border:1px solid rgba(226,193,130,.35);background:linear-gradient(180deg,rgba(255,240,210,.07),rgba(255,240,210,.01))}
  .pm .col.no{border-color:rgba(190,110,90,.45);background:linear-gradient(180deg,rgba(150,60,45,.10),rgba(150,60,45,.02))}
  .pm .col .ch{display:flex;align-items:center;gap:14px;font-family:'Gowun Batang';font-weight:700;font-size:36px;padding-bottom:18px;border-bottom:1px solid rgba(226,193,130,.25);margin-bottom:6px}
  .pm .col.no .ch{border-color:rgba(190,110,90,.3)}
  .pm .li{display:flex;align-items:center;gap:16px;padding:15px 2px;border-bottom:1px dashed rgba(226,193,130,.14)}
  .pm .li:last-child{border-bottom:0}
  .pm .li .ic{flex:none}.pm .col.no .li .ic{color:#d79a86}
  .pm .li b{display:block;font-size:25px;line-height:1.25}
  .pm .li small{display:block;font-size:19px;color:#a89a85;margin-top:3px}

  /* flow: 판단 순서도 */
  .pm .q{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:16px;padding:22px 30px;border-radius:20px;
    background:linear-gradient(180deg,#2e241b,#1a140f);border:1.5px solid rgba(226,193,130,.7);font-size:27px;font-weight:800;white-space:nowrap;box-shadow:0 16px 36px rgba(0,0,0,.4)}
  .pm .q .qn{font-family:'Gowun Batang';font-weight:700;font-size:30px;color:#e2c182}
  .pm .rs{position:absolute;transform:translate(-50%,-50%);width:360px;text-align:center;padding:20px 16px 18px;border-radius:20px;border:1px solid rgba(226,193,130,.45);background:rgba(226,193,130,.08)}
  .pm .rs.no{border-color:rgba(190,110,90,.55);background:rgba(150,60,45,.12)}
  .pm .rs .rt{display:flex;align-items:center;justify-content:center;gap:12px;font-size:28px;font-weight:800}
  .pm .rs .rn{margin-top:8px;font-size:19px;color:#a89a85;line-height:1.4}
  .pm .yn{position:absolute;transform:translate(-50%,-50%);font-size:21px;font-weight:700;padding:4px 14px;border-radius:20px;background:#17110d;border:1px solid rgba(226,193,130,.45);color:#e2c182}
  .pm .yn.n{border-color:rgba(190,110,90,.6);color:#e08a75}

  /* hub: 통상임금 중심 */
  .pm .core{position:absolute;transform:translate(-50%,-50%);width:220px;height:220px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(circle at 50% 35%,#f6e2b0,#c99a55 70%,#9c733c);color:#1b140e;font-family:'Gowun Batang';font-weight:700;font-size:38px;line-height:1.15;
    box-shadow:0 0 0 12px rgba(226,193,130,.12),0 0 0 26px rgba(226,193,130,.05),0 24px 60px rgba(0,0,0,.5)}
  .pm .core small{font-family:Pretendard;font-size:19px;font-weight:700;margin-top:6px;letter-spacing:1px}
  .pm .sp{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center}
  .pm .sp .lb{font-size:24px;margin-top:10px}.pm .sp .sb{font-size:18px}

  /* bars: 금액 비교 */
  .pm .bars{position:absolute;left:72px;right:72px;top:330px}
  .pm .br{display:flex;align-items:center;gap:22px;margin-bottom:30px}
  .pm .br .bl{width:190px;flex:none;font-size:25px;font-weight:700;color:#cdb88f;text-align:right;line-height:1.3}
  .pm .br .bt{position:relative;height:86px;border-radius:14px;display:flex;align-items:center;justify-content:flex-end;padding-right:26px;font-size:40px;font-weight:800;letter-spacing:-.5px}
  .pm .br .bt.lo{background:linear-gradient(90deg,rgba(226,193,130,.10),rgba(226,193,130,.22));border:1px solid rgba(226,193,130,.35);color:#e9dcc2}
  .pm .br .bt.hi{background:linear-gradient(90deg,#8d6a37,#e9c98c);color:#1b140e;box-shadow:0 14px 34px rgba(0,0,0,.4)}
  .pm .br .bt small{font-size:24px;font-weight:700;margin-left:4px}
  .pm .stats{position:absolute;left:72px;right:72px;top:640px;display:flex;gap:20px}
  .pm .stt{flex:1;border-radius:22px;padding:26px 18px;text-align:center;border:1px solid rgba(226,193,130,.35);background:linear-gradient(180deg,rgba(255,240,210,.07),rgba(255,240,210,.015))}
  .pm .stt .v{font-family:'Gowun Batang';font-weight:700;font-size:50px;line-height:1.1}
  .pm .stt .k{margin-top:12px;font-size:22px;color:#b4a68f;line-height:1.35}
  `;

  const frame = (d, i, total, inner) => `<div class="slide pm"><div class="noise"></div><div class="frame"></div>
    <div class="hdr"><span class="no">${String(i).padStart(2, '0')}</span><span class="bar"></span><span class="tp">${esc(d.topic || '')}</span><span class="sr">${esc(d.series || 'LABOR LAW NOTE')}</span></div>
    ${d.head ? `<h2${d.headTop ? ` style="top:${d.headTop}px"` : ''}>${rich(d.head)}</h2>` : ''}
    ${inner}
    <div class="ftr"><span>${esc(PROFILE.name)}</span><span>${String(i).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div></div>`;

  const ring = (ic, size, dim) => `<div class="ring${dim ? ' dim' : ''}" style="width:${size}px;height:${size}px">${icon(ic, Math.round(size * 0.48))}</div>`;

  const T = {
    'p-hero': (d) => `
      <div class="row" style="top:${d.rowTop || 470}px">${d.items.map((it) => `<div class="it">${ring(it.icon, 136)}<div class="lb">${rich(it.label)}</div></div>`).join('')}</div>
      <svg class="lines"><path d="M150 ${(d.rowTop || 470) + 68}H930" stroke="rgba(226,193,130,.35)" stroke-width="1.5" stroke-dasharray="4 8"/></svg>
      ${d.caption ? `<div class="cap" style="top:${(d.rowTop || 470) + 260}px">${rich(d.caption)}</div>` : ''}`,

    // 집 → 회사 경로 + 경로 위 표시(ok) + 경로 이탈 분기(no)
    'p-route': (d) => {
      const y = d.y || 620, x0 = 170, x1 = 910, X = (f) => x0 + f * (x1 - x0);
      const b = d.branch, bx = b ? X(b.at) : 0, ex = bx + 150, ey = y + 200;
      return `<svg class="lines">
          <path d="M${x0} ${y}H${x1}" stroke="url(#gl)" stroke-width="5" stroke-linecap="round"/>
          ${b ? `<path d="M${bx} ${y}Q${bx + 20} ${ey - 10} ${ex - 62} ${ey}" stroke="#b9604c" stroke-width="3" fill="none" stroke-dasharray="9 9"/>` : ''}
          <defs><linearGradient id="gl" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${x1}" y2="0"><stop offset="0" stop-color="#b98d4f"/><stop offset=".5" stop-color="#f3dba3"/><stop offset="1" stop-color="#b98d4f"/></linearGradient></defs></svg>
        <div class="node" style="left:${x0}px;top:${y - 66}px">${ring(d.start.icon, 132)}<div class="lb">${rich(d.start.label)}</div></div>
        <div class="node" style="left:${x1}px;top:${y - 66}px">${ring(d.end.icon, 132)}<div class="lb">${rich(d.end.label)}</div></div>
        ${(d.marks || []).map((m) => `<div style="position:absolute;left:${X(m.at) - 1}px;top:${y - 106}px;width:2px;height:80px;background:linear-gradient(180deg,#d9b77a,rgba(217,183,122,.2))"></div><div class="node" style="left:${X(m.at)}px;top:${y - 210}px">${ring(m.icon, 104)}</div>
          <div class="tag" style="left:${X(m.at)}px;top:${y}px">${badge(true)}${rich(m.label)}${m.sub ? `<small>${rich(m.sub)}</small>` : ''}</div>`).join('')}
        ${b ? `<div class="node" style="left:${ex}px;top:${ey - 52}px">${ring(b.icon, 104, true)}<div class="lb">${badge(false)} ${rich(b.label)}</div>${b.sub ? `<div class="sb">${rich(b.sub)}</div>` : ''}</div>` : ''}
        ${d.caption ? `<div class="cap" style="top:${d.capTop || 290}px">${rich(d.caption)}</div>` : ''}`;
    },

    // 집 안(X) | 현관문 | 공용부분·도로(O) → 회사
    'p-scope': (d) => {
      const W = 936, total = d.zones.reduce((a, z) => a + (z.w || 1), 0);
      let acc = 0; const pos = d.zones.map((z) => { const s = acc; acc += (z.w || 1); return [s / total * W, acc / total * W]; });
      const okIdx = d.zones.map((z, i) => (z.state !== 'no' ? i : -1)).filter((i) => i >= 0);
      const bl = 72 + pos[okIdx[0]][0] + 14, br = 72 + pos[okIdx[okIdx.length - 1]][1] - 14;
      const doorX = 72 + pos[okIdx[0]][0];
      return `<div class="band">${d.zones.map((z, i) => `<div class="zn ${z.state || 'ok'}${i === d.zones.length - 1 ? ' end' : ''}" style="flex:${z.w || 1}">${icon(z.icon, 50)}<span>${rich(z.label)}</span></div>`).join('')}</div>
        <div class="brk" style="left:${bl}px;width:${br - bl}px"><span>${rich(d.bracket)}</span></div>
        <div class="doorpin" style="left:${doorX}px;top:760px">${ring(d.door.icon, 112)}<div class="lb">${rich(d.door.label)}</div></div>
        <div style="position:absolute;left:${doorX}px;top:712px;width:2px;height:48px;background:#d9b77a;transform:translateX(-1px)"></div>
        ${d.noteNo ? `<div class="tag no" style="left:${72 + pos[0][1] / 2}px;top:810px">${badge(false)}${rich(d.noteNo)}</div>` : ''}
        ${d.caption ? `<div class="cap" style="top:${d.capTop || 330}px">${rich(d.caption)}</div>` : ''}`;
    },

    'p-cards': (d) => `<div class="cards" style="top:${d.top || 400}px">${d.items.map((it) => `<div class="cd ${it.ok === false ? 'no' : ''}">${it.ok === undefined ? '' : badge(it.ok !== false, 'big')}
      ${ring(it.icon, 128, it.ok === false)}<div class="t">${rich(it.label)}</div>${it.text ? `<div class="s">${rich(it.text)}</div>` : ''}</div>`).join('')}</div>
      ${d.caption ? `<div class="cap" style="top:${d.capTop || 900}px">${rich(d.caption)}</div>` : ''}`,

    // 경로 → (볼일 보러 이탈: X) → 복귀 후 다시 인정(O)
    'p-detour': (d) => {
      const y = 720, x0 = 150, x1 = 930, a = 330, b = 640, top = 470, mx = (a + b) / 2;
      return `<svg class="lines"><defs><linearGradient id="gl2" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${x1}" y2="0"><stop offset="0" stop-color="#b98d4f"/><stop offset=".5" stop-color="#f3dba3"/><stop offset="1" stop-color="#b98d4f"/></linearGradient></defs>
          <path d="M${x0} ${y}H${a}" stroke="url(#gl2)" stroke-width="5" stroke-linecap="round"/>
          <path d="M${b} ${y}H${x1}" stroke="url(#gl2)" stroke-width="5" stroke-linecap="round"/>
          <path d="M${a} ${y}H${b}" stroke="rgba(226,193,130,.25)" stroke-width="3" stroke-dasharray="3 10"/>
          <path d="M${a} ${y}C${a} ${top + 40} ${mx - 120} ${top} ${mx - 70} ${top}M${mx + 70} ${top}C${mx + 120} ${top} ${b} ${top + 40} ${b} ${y}" stroke="#b9604c" stroke-width="3" fill="none" stroke-dasharray="9 9"/></svg>
        <div class="node" style="left:${x0}px;top:${y - 52}px">${ring(d.start.icon, 104)}<div class="lb">${rich(d.start.label)}</div></div>
        <div class="node" style="left:${x1}px;top:${y - 52}px">${ring(d.end.icon, 104)}<div class="lb">${rich(d.end.label)}</div></div>
        <div class="node" style="left:${mx}px;top:${top - 66}px">${ring(d.stop.icon, 132, true)}</div>
        <div class="tag no" style="left:${mx}px;top:${top + 108}px">${badge(false)}${rich(d.stop.label)}</div>
        <div class="tag" style="left:${(x0 + a) / 2 + 20}px;top:${y + 120}px">${badge(true)}${rich(d.before)}</div>
        <div class="tag" style="left:${(b + x1) / 2 - 10}px;top:${y + 120}px">${badge(true)}${rich(d.after)}</div>
        ${d.caption ? `<div class="cap" style="top:${d.capTop || 300}px">${rich(d.caption)}</div>` : ''}`;
    },

    'p-grid': (d) => `<div class="grid">${d.items.map((it, i) => `<div class="gc"><div class="n gold">${String(i + 1).padStart(2, '0')}</div>${icon(it.icon, 70)}
      <div class="t">${rich(it.label)}</div>${it.text ? `<div class="s">${rich(it.text)}</div>` : ''}</div>`).join('')}</div>`,

    'p-timeline': (d) => {
      const n = d.items.length, xs = d.items.map((_, i) => 72 + 140 + i * ((936 - 280) / (n - 1)));
      return `<svg class="lines">${xs.slice(1).map((x, i) => `<path d="M${xs[i] + 100} 505H${x - 100}" stroke="#d9b77a" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/><path d="M${x - 112} 497l10 8-10 8" stroke="#d9b77a" stroke-width="2" fill="none"/>`).join('')}</svg>
        <div class="tline">${d.items.map((it, i) => `<div class="st"><div class="num">${i + 1}</div>${ring(it.icon, 170)}<div class="lb" style="font-size:30px">${rich(it.label)}</div>${it.text ? `<div class="sb" style="font-size:22px">${rich(it.text)}</div>` : ''}</div>`).join('')}</div>
        ${d.chips ? `<div class="chips">${d.chips.map((c) => `<span class="chip">${rich(c)}</span>`).join('')}</div>` : ''}`;
    },

    'p-criteria': (d) => `<div class="crit">${d.items.map((it) => `<div class="pl ${it.off ? 'off' : ''}">${it.off ? '' : badge(true)}
      ${ring(it.icon, 120, it.off)}<div class="t">${rich(it.label)}</div>${it.text ? `<div class="s">${rich(it.text)}</div>` : ''}${it.off ? `<div class="stamp">${esc(it.stamp || '폐기')}</div>` : ''}</div>`).join('')}</div>
      ${d.caption ? `<div class="cap" style="top:${d.capTop || 830}px">${rich(d.caption)}</div>` : ''}`,

    'p-split': (d) => `<div class="split">${[d.left, d.right].map((c, k) => `<div class="col ${k ? 'no' : ''}"><div class="ch">${badge(!k)}${rich(c.title)}</div>
      ${c.items.map((it) => `<div class="li">${icon(it.icon, 44)}<div><b>${rich(it.label)}</b>${it.text ? `<small>${rich(it.text)}</small>` : ''}</div></div>`).join('')}</div>`).join('')}</div>`,

    'p-flow': (d) => {
      const q1 = [330, 335], q2 = [330, 560], rNo = [810, 335], rL = [230, 810], rR = [700, 810];
      return `<svg class="lines"><defs><marker id="ah" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto"><path d="M1 1l7 4-7 4" fill="none" stroke="#d9b77a" stroke-width="1.6"/></marker>
          <marker id="ahr" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto"><path d="M1 1l7 4-7 4" fill="none" stroke="#c0644f" stroke-width="1.6"/></marker></defs>
        <path d="M${q1[0]} ${q1[1] + 48}V${q2[1] - 56}" stroke="#d9b77a" stroke-width="2.5" marker-end="url(#ah)"/>
        <path d="M${q1[0] + 205} ${q1[1]}H${rNo[0] - 158}" stroke="#c0644f" stroke-width="2.5" stroke-dasharray="7 7" marker-end="url(#ahr)"/>
        <path d="M${q2[0] - 90} ${q2[1] + 48}L${rL[0] + 20} ${rL[1] - 72}" stroke="#d9b77a" stroke-width="2.5" marker-end="url(#ah)"/>
        <path d="M${q2[0] + 90} ${q2[1] + 48}L${rR[0] - 30} ${rR[1] - 72}" stroke="#c0644f" stroke-width="2.5" stroke-dasharray="7 7" marker-end="url(#ahr)"/></svg>
        <div class="q" style="left:${q1[0]}px;top:${q1[1]}px"><span class="qn">Q1</span>${rich(d.q1)}</div>
        <div class="q" style="left:${q2[0]}px;top:${q2[1]}px"><span class="qn">Q2</span>${rich(d.q2)}</div>
        <div class="yn" style="left:${q1[0] + 40}px;top:${(q1[1] + q2[1]) / 2}px">예</div>
        <div class="yn n" style="left:${(q1[0] + 205 + rNo[0] - 158) / 2}px;top:${q1[1] - 30}px">아니오</div>
        <div class="yn" style="left:${(q2[0] - 90 + rL[0] + 20) / 2 - 34}px;top:${(q2[1] + 48 + rL[1] - 72) / 2}px">예</div>
        <div class="yn n" style="left:${(q2[0] + 90 + rR[0] - 30) / 2 + 44}px;top:${(q2[1] + 48 + rR[1] - 72) / 2}px">아니오</div>
        ${[[rNo, d.r1, false], [rL, d.r2, true], [rR, d.r3, false]].map(([p, r, ok]) => `<div class="rs ${ok ? '' : 'no'}" style="left:${p[0]}px;top:${p[1]}px${p === rNo ? ';width:300px' : ''}"><div class="rt">${badge(ok)}${rich(r.label)}</div>${r.note ? `<div class="rn">${rich(r.note)}</div>` : ''}</div>`).join('')}`;
    },

    'p-hub': (d) => {
      const cx = 540, cy = d.cy || 615, R = d.r || 285, n = d.items.length;
      const pts = d.items.map((_, i) => { const a = (-90 + i * 360 / n) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
      return `<svg class="lines">${pts.map(([x, y]) => `<path d="M${cx} ${cy}L${x} ${y}" stroke="rgba(226,193,130,.4)" stroke-width="1.5" stroke-dasharray="3 7"/>`).join('')}
          <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(226,193,130,.12)" stroke-width="1"/></svg>
        <div class="core" style="left:${cx}px;top:${cy}px">${rich(d.center)}${d.centerSub ? `<small>${rich(d.centerSub)}</small>` : ''}</div>
        ${d.items.map((it, i) => `<div class="sp" style="left:${pts[i][0]}px;top:${pts[i][1] + 26}px">${ring(it.icon, 96)}<div class="lb">${rich(it.label)}</div>${it.text ? `<div class="sb">${rich(it.text)}</div>` : ''}</div>`).join('')}`;
    },

    'p-bars': (d) => {
      const max = Math.max(...d.bars.map((b) => b.value));
      return `<div class="bars">${d.bars.map((b) => `<div class="br"><div class="bl">${rich(b.label)}</div>
          <div class="bt ${b.hi ? 'hi' : 'lo'}" style="width:${Math.round(b.value / max * 680)}px">${Number(b.value).toLocaleString('ko-KR')}<small>${esc(b.unit || '원')}</small></div></div>`).join('')}</div>
        <div class="stats">${d.stats.map((st) => `<div class="stt"><div class="v gold">${rich(st.value)}</div><div class="k">${rich(st.label)}</div></div>`).join('')}</div>
        ${d.caption ? `<div class="cap" style="top:${d.capTop || 905}px;font-size:22px">${rich(d.caption)}</div>` : ''}`;
    },
  };

  return { css, T, frame };
};
