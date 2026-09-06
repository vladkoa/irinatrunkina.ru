import { readFile, writeFile } from 'node:fs/promises';

const path = 'dist/index.html';
let html = await readFile(path, 'utf8');

// Keep the role visible and semantically close to the doctor's name,
// but remove the detached pill above the name.
html = html.replace(
  '<p class="eyebrow">Врач-кардиолог · терапевт</p><h1>Ирина Трунькина</h1>',
  '<h1>Ирина Трунькина</h1><p class="hero-role">Врач-кардиолог · терапевт</p>'
);

// The final CTA should not sit immediately after the clinic booking CTA.
// Move it earlier, after the patient-situations block.
const finalMatch = html.match(/<section class="final"[\s\S]*?<\/section>/);
if (finalMatch) {
  html = html.replace(finalMatch[0], '');
  html = html.replace(
    /(<section class="section" aria-labelledby="situations-title">[\s\S]*?<\/section>)/,
    `$1${finalMatch[0]}`
  );
}

const responsiveCss = `
<style id="responsive-v3">
  /* Shared layout rhythm */
  .wrap{width:min(1120px,100%)!important;margin-inline:auto!important}
  .section-head{max-width:720px!important}
  .section h2,.final h2{max-width:720px!important;line-height:1.16!important;text-wrap:balance!important}
  .intro{max-width:700px!important}
  .grid2,.facts{align-items:stretch!important}
  .box{height:100%!important}
  .actions{justify-content:flex-start!important}
  .hero-role{margin:10px 0 0;color:var(--muted);font-size:16px;font-weight:600;line-height:1.4}
  .final{margin-top:46px!important}

  /* Desktop */
  @media (min-width:981px){
    main{padding:28px 24px 72px!important}
    .hero{grid-template-columns:minmax(0,1.25fr) minmax(300px,.75fr)!important;gap:72px!important;padding:54px 58px!important;align-items:center!important}
    .hero-copy{min-width:0!important;max-width:650px!important}
    .hero-photo{width:100%!important;max-width:340px!important;justify-self:end!important;margin:0!important}
    .hero-photo img{display:block!important;width:100%!important;height:auto!important;object-fit:contain!important}
    h1{font-size:clamp(40px,4.2vw,50px)!important;white-space:nowrap!important;line-height:1.02!important}
    .tagline{font-size:clamp(30px,3vw,36px)!important;margin-top:18px!important}
    .clinic{grid-template-columns:minmax(0,1fr) auto!important;gap:36px!important}
    .clinic-action{justify-content:flex-end!important;align-items:center!important}
  }

  /* Tablet */
  @media (max-width:980px) and (min-width:761px){
    main{padding:20px 16px 60px!important}
    .hero{grid-template-columns:minmax(0,1.05fr) minmax(250px,.95fr)!important;gap:34px!important;padding:38px!important}
    .hero-copy{min-width:0!important}
    .hero-photo{max-width:310px!important;order:initial!important;justify-self:end!important;margin:0!important}
    .hero-photo img{width:100%!important;height:auto!important}
    h1{font-size:clamp(34px,4.6vw,42px)!important;white-space:nowrap!important}
    .tagline{font-size:clamp(27px,3.5vw,32px)!important;margin-top:17px!important}
    .subhead{font-size:18px!important}
    .section{padding-top:56px!important}
    .section-head{max-width:680px!important}
    .section h2,.final h2{max-width:680px!important}
  }

  /* Mobile */
  @media (max-width:760px){
    main{padding:10px 10px 44px!important}
    .hero{grid-template-columns:1fr!important;gap:22px!important;padding:20px!important}
    .hero-photo{order:-1!important;width:min(100%,340px)!important;max-width:340px!important;justify-self:center!important;margin:0 auto!important}
    .hero-photo img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;border-radius:14px!important}
    .hero-copy{width:100%!important;max-width:none!important}
    .hero-role{margin-top:8px!important;font-size:14px!important}
    h1{font-size:clamp(29px,8vw,34px)!important;line-height:1.04!important;white-space:nowrap!important;letter-spacing:-.025em!important}
    .tagline{font-size:clamp(27px,7vw,31px)!important;line-height:1.12!important;margin-top:17px!important}
    .subhead{font-size:17px!important;line-height:1.42!important}
    .lead{font-size:15px!important;line-height:1.62!important}
    .detail{font-size:13.5px!important}
    .actions{width:100%!important}
    .hero .button,.final .button,.clinic .button{width:100%!important;text-align:center!important}
    .section{padding-top:46px!important}
    .section-head{max-width:none!important}
    .section h2,.final h2{max-width:none!important;font-size:clamp(24px,6.5vw,27px)!important;line-height:1.18!important;text-wrap:balance!important}
    .intro{max-width:none!important;font-size:14.5px!important}
    .grid2,.facts,.approach-grid,.clinic{grid-template-columns:1fr!important}
    .grid2,.facts{gap:10px!important}
    .clinic-action{justify-content:stretch!important}
    .final{margin-top:38px!important}
  }

  @media (max-width:390px){
    h1{font-size:28px!important;white-space:normal!important}
    .hero{padding:18px!important}
  }
</style>`;

if (html.includes('id="responsive-v3"')) {
  html = html.replace(/<style id="responsive-v3">[\s\S]*?<\/style>/, responsiveCss);
} else if (html.includes('id="responsive-v2"')) {
  html = html.replace(/<style id="responsive-v2">[\s\S]*?<\/style>/, responsiveCss);
} else if (html.includes('id="responsive-v1"')) {
  html = html.replace(/<style id="responsive-v1">[\s\S]*?<\/style>/, responsiveCss);
} else {
  html = html.replace('</head>', `${responsiveCss}\n</head>`);
}

await writeFile(path, html);
