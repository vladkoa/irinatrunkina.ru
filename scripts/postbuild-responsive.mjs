import { readFile, writeFile } from 'node:fs/promises';

const path = 'dist/index.html';
let html = await readFile(path, 'utf8');

const responsiveCss = `
<style id="responsive-v1">
  /* Desktop composition */
  .wrap{width:min(1120px,100%)!important}
  .hero{grid-template-columns:minmax(0,1.18fr) minmax(300px,.82fr)!important;gap:64px!important;padding:52px!important;align-items:center!important}
  .hero-copy{min-width:0}
  .hero-photo{width:100%;max-width:360px!important;justify-self:end!important}
  .hero-photo img{width:100%!important;height:auto!important;aspect-ratio:auto!important;object-fit:contain!important}
  .section-head{max-width:740px!important}
  .section h2,.final h2{max-width:740px!important;text-wrap:pretty!important;line-height:1.16!important}
  .intro{max-width:720px!important}
  .actions{justify-content:flex-start!important}
  .clinic-action{display:flex!important;justify-content:flex-end!important;align-items:center!important}

  /* Tablet: keep a real two-column hero instead of a stretched mobile layout */
  @media (max-width:980px) and (min-width:761px){
    main{padding-left:16px!important;padding-right:16px!important}
    .hero{grid-template-columns:minmax(0,1.08fr) minmax(260px,.92fr)!important;gap:32px!important;padding:36px!important}
    .hero-photo{max-width:320px!important;order:initial!important;justify-self:end!important}
    h1{font-size:clamp(34px,4.6vw,43px)!important}
    .tagline{font-size:clamp(27px,3.6vw,33px)!important}
    .subhead{font-size:18px!important}
    .section{padding-top:56px!important}
  }

  /* Mobile: one deliberate column */
  @media (max-width:760px){
    main{padding:10px 10px 44px!important}
    .hero{grid-template-columns:1fr!important;gap:24px!important;padding:20px!important}
    .hero-photo{order:-1!important;width:min(100%,360px)!important;max-width:360px!important;justify-self:center!important;margin:0 auto!important}
    .hero-photo img{display:block!important;width:100%!important;height:auto!important;max-height:none!important}
    .hero-copy{width:100%!important}
    .eyebrow{margin-bottom:16px!important}
    h1{font-size:clamp(29px,8vw,34px)!important;line-height:1.05!important;white-space:nowrap!important;letter-spacing:-.025em!important}
    .tagline{font-size:clamp(27px,7.2vw,31px)!important;line-height:1.12!important;margin-top:18px!important}
    .subhead{font-size:17px!important;line-height:1.45!important}
    .lead{font-size:15px!important;line-height:1.65!important}
    .detail{font-size:13.5px!important}
    .actions{width:100%!important}
    .hero .button,.final .button,.clinic .button{width:100%!important;text-align:center!important}
    .section{padding-top:46px!important}
    .section-head{max-width:none!important}
    .section h2,.final h2{max-width:none!important;font-size:clamp(24px,6.7vw,28px)!important;line-height:1.18!important;text-wrap:pretty!important}
    .intro{max-width:none!important;font-size:14.5px!important}
    .grid2,.facts,.approach-grid,.clinic{grid-template-columns:1fr!important}
    .clinic-action{justify-content:stretch!important}
  }

  /* Small phones: allow the name to wrap only when it truly cannot fit */
  @media (max-width:390px){
    h1{font-size:28px!important;white-space:normal!important}
    .hero{padding:18px!important}
  }
</style>`;

if (html.includes('id="responsive-v1"')) {
  html = html.replace(/<style id="responsive-v1">[\s\S]*?<\/style>/, responsiveCss);
} else {
  html = html.replace('</head>', `${responsiveCss}\n</head>`);
}

await writeFile(path, html);
