import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const METRIKA_ID = 112286258;

const metrikaScript = `<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}","ym");

ym(${METRIKA_ID},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});

document.addEventListener("click",function(event){
  var target=event.target;
  var link=target && target.closest ? target.closest('a[href*="lk.medgarant.info/reservation"]') : null;
  if(link){ym(${METRIKA_ID},"reachGoal","appointment_click");}
});
</script>
<!-- /Yandex.Metrika counter -->`;

const metrikaNoScript = `<!-- Yandex.Metrika counter -->
<noscript><div><img src="https://mc.yandex.ru/watch/${METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->`;

const yandexMetrika = {
  name: 'yandex-metrika',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);

      async function injectIntoHtml(folder) {
        const entries = await readdir(folder, { withFileTypes: true });
        for (const entry of entries) {
          const path = join(folder, entry.name);
          if (entry.isDirectory()) {
            await injectIntoHtml(path);
            continue;
          }
          if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

          let html = await readFile(path, 'utf8');
          if (html.includes(`mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`)) continue;

          html = html.replace('</head>', `${metrikaScript}\n</head>`);
          html = html.replace(/<body([^>]*)>/, `<body$1>\n${metrikaNoScript}`);
          await writeFile(path, html, 'utf8');
        }
      }

      await injectIntoHtml(root);
    },
  },
};

export default defineConfig({
  site: 'https://irinatrunkina.ru',
  integrations: [yandexMetrika],
});
