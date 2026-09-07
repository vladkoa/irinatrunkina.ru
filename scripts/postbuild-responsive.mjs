import { readFile, writeFile } from 'node:fs/promises';

const path = 'dist/index.html';
let html = await readFile(path, 'utf8');

if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
  html = html.replace(
    '</head>',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />\n</head>'
  );
}

html = html.replace(
  '<p class="eyebrow">Врач-кардиолог · терапевт</p><h1>Ирина Трунькина</h1>',
  '<h1>Ирина Трунькина</h1><p class="hero-role">Врач-кардиолог · терапевт</p>'
);

html = html.replace(/\s*<section class="mid-cta"[\s\S]*?<\/section>/g, '');

const finalMatch = html.match(/<section class="final"[\s\S]*?<\/section>/);
if (finalMatch) {
  const finalBlock = finalMatch[0];
  html = html.replace(finalBlock, '');
  const dataMarker = html.search(/id=["']data-title["']/i);
  if (dataMarker !== -1) {
    const dataSectionStart = html.lastIndexOf('<section', dataMarker);
    if (dataSectionStart !== -1) {
      html = `${html.slice(0, dataSectionStart)}${finalBlock}\n${html.slice(dataSectionStart)}`;
    }
  }
}

const responsiveCss = `
<style id="stable-responsive">
  .wrap{width:min(1160px,100%)!important;margin-inline:auto!important}
  .hero-role{margin:8px 0 0;color:var(--muted);font-size:16px;font-weight:600;line-height:1.4}
  .grid2,.facts{align-items:stretch!important}
  .box{height:100%!important}

  /* Desktop */
  @media (min-width:981px){
    main{padding:28px 22px 72px!important}
    .hero{grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr)!important;gap:64px!important;padding:52px 56px!important;align-items:center!important}
    .hero-copy{min-width:0!important;max-width:690px!important}
    .hero-photo{order:initial!important;max-width:340px!important;justify-self:end!important;margin:0!important}
    .hero-photo img{display:block!important;width:100%!important;height:auto!important}
    h1{font-size:clamp(40px,4vw,50px)!important;white-space:nowrap!important;line-height:1.02!important}
    .section-head{max-width:none!important}
    .section h2,.final h2{max-width:none!important;font-size:clamp(27px,2.55vw,34px)!important;line-height:1.12!important;letter-spacing:-.018em!important}
    .intro{max-width:820px!important}
    .clinic{grid-template-columns:minmax(0,1fr) auto!important;gap:32px!important}
    .clinic-action{justify-content:flex-end!important}
    .final{margin-top:42px!important;padding:30px 32px!important}
  }

  /* Tablet / browser desktop-view: keep hero side-by-side */
  @media (max-width:980px) and (min-width:761px){
    main{padding:18px 14px 60px!important}
    .hero{grid-template-columns:minmax(0,1.2fr) minmax(240px,.8fr)!important;gap:32px!important;padding:34px!important;align-items:center!important}
    .hero-copy{min-width:0!important}
    .hero-photo{order:initial!important;width:100%!important;max-width:300px!important;justify-self:end!important;margin:0!important}
    .hero-photo img{display:block!important;width:100%!important;height:auto!important}
    h1{font-size:clamp(34px,4.4vw,42px)!important;white-space:nowrap!important}
    .tagline{font-size:clamp(28px,3.6vw,32px)!important}
    .facts{grid-template-columns:1fr 1fr!important}
    .section-head{max-width:none!important}
  }

  /* Narrow tablet */
  @media (max-width:760px) and (min-width:641px){
    main{padding:18px 14px 60px!important}
    .hero{grid-template-columns:1fr!important;gap:24px!important;padding:30px!important}
    .hero-photo{order:-1!important;max-width:360px!important;justify-self:center!important;margin:0 auto!important}
    .facts{grid-template-columns:1fr 1fr!important}
    .section-head{max-width:none!important}
  }

  /* Mobile */
  @media (max-width:640px){
    main{padding:10px 10px 44px!important}
    .hero{grid-template-columns:1fr!important;gap:20px!important;padding:20px!important;border-radius:18px!important}
    .hero-photo{order:-1!important;width:min(100%,340px)!important;max-width:340px!important;justify-self:center!important;margin:0 auto!important}
    .hero-photo img{display:block!important;width:100%!important;height:auto!important;border-radius:14px!important}
    .hero-copy{width:100%!important;max-width:none!important}
    .hero-role{font-size:14px!important}
    h1{font-size:clamp(29px,8vw,34px)!important;white-space:nowrap!important;line-height:1.04!important}
    .tagline{font-size:clamp(27px,7vw,31px)!important;margin-top:16px!important}
    .subhead{font-size:17px!important}
    .lead{font-size:15px!important}
    .detail{font-size:13.5px!important}
    .section{padding-top:44px!important}
    .section h2,.final h2{max-width:none!important;font-size:clamp(23px,6.2vw,26px)!important;line-height:1.16!important;white-space:normal!important}
    .intro{max-width:none!important;font-size:14.5px!important}
    .grid2,.facts,.approach-grid,.clinic{grid-template-columns:1fr!important}
    .grid2,.facts{gap:10px!important;margin-top:18px!important}
    .clinic-action{justify-content:stretch!important}
    .hero .button,.final .button,.clinic .button{width:100%!important;text-align:center!important}
    .final{margin-top:34px!important;padding:22px 18px!important}
  }

  @media (max-width:390px){
    h1{font-size:28px!important;white-space:normal!important}
  }
</style>`;

if (html.includes('id="stable-responsive"')) {
  html = html.replace(/<style id="stable-responsive">[\s\S]*?<\/style>/, responsiveCss);
} else {
  html = html.replace('</head>', `${responsiveCss}\n</head>`);
}

await writeFile(path, html);
