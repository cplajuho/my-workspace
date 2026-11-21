// 블로그 원고(posts/*.json) → 워드파일(.docx)  — naver-labor-blog 스킬 5단계 서식
// 사용: node make_docx.js posts/주제.json  →  output/<주제>/<file>.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, BorderStyle, LineRuleType,
} = require('docx');

const FONT = '맑은 고딕';
const NAVY = '1F497D';
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: 24, ...o });
const spacing = { line: 360, lineRule: LineRuleType.AUTO, after: 200 };

const para = (text) => new Paragraph({ spacing, children: [run(text)] });
const check = (text) => new Paragraph({ spacing, indent: { left: 300 }, children: [run('✅ '), run(text)] });
const quote = (text) => new Paragraph({
  spacing, indent: { left: 500 },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: 'C00000', space: 10 } },
  children: [run(text, { color: '444444' })],
});
const heading = (text) => new Paragraph({
  spacing: { before: 400, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 4 } },
  children: [run(text, { size: 26, bold: true, color: NAVY })],
});

function build(post) {
  const kids = [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 6 } },
      children: [run(post.title, { size: 36, bold: true, color: NAVY })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [run(post.subtitle, { size: 26, color: '555555' })] }),
    ...post.intro.map(para),
  ];
  for (const sec of post.sections) {
    kids.push(heading(sec.h));
    for (const b of sec.blocks) {
      if (typeof b === 'string') kids.push(para(b));
      else if (b.check) kids.push(check(b.check));
      else if (b.quote) kids.push(quote(b.quote));
    }
  }
  if (post.faq && post.faq.length) {
    kids.push(heading('자주 묻는 질문'));
    for (const f of post.faq) {
      kids.push(new Paragraph({ spacing, children: [run('❓ ' + f.q, { bold: true })] }));
      kids.push(para(f.a));
    }
  }
  kids.push(new Paragraph({ spacing: { before: 400, after: 120 }, children: [run('💬 마무리', { bold: true, color: NAVY })] }));
  const box = { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 8 };
  post.closing.forEach((t, i) => kids.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { line: 360, lineRule: LineRuleType.AUTO, after: 80 },
    border: { ...(i === 0 ? { top: box } : {}), ...(i === post.closing.length - 1 ? { bottom: box } : {}) },
    children: [run(t, { size: 22 })],
  })));

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1728, right: 1728 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('공인노무사 김주호 | 노동법 블로그', { size: 18, color: '888888' })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run('📞 010-6856-6623 | 공인노무사 김주호', { size: 18, color: '555555' })] })] }) },
      children: kids,
    }],
  });
}

(async () => {
  const src = process.argv[2];
  const post = JSON.parse(fs.readFileSync(src, 'utf8'));
  const outDir = path.join(__dirname, 'output', path.basename(src, '.json'));
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, post.file);
  fs.writeFileSync(out, await Packer.toBuffer(build(post)));
  console.log(out);
})();
