// Elonth build: three.module.min.js -> global THREE, src/*.js -> one IIFE, inlined into HTML.
import fs from 'fs';
import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = p => fs.readFileSync(path.join(root, p), 'utf8');

// 1) three -> classic script
const three = rd('vendor/three.module.min.js');
const m = three.match(/export\{([^}]*)\};?\s*$/);
if (!m) throw new Error('three export not found');
const pairs = m[1].split(',').map(s => s.trim().split(/\s+as\s+/));
const threeJs = '(function(){"use strict";' + three.slice(0, m.index) + '\nwindow.THREE={' + pairs.map(([a, b]) => `${b}:${a}`).join(',') + '};})();';
fs.writeFileSync(path.join(root, 'vendor/three.r160.js'), threeJs);

// 2) game
const files = fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.js')).sort();
const version = JSON.parse(rd('version.json')).v;
let game = `(function(){'use strict';\nconst BUILD=${JSON.stringify(version)};\n`;
for (const f of files) game += `\n// ==== ${f} ====\n` + rd('src/' + f) + '\n';
game += '\n})();';
// syntax check
new Function(game);

const css = rd('src/style.css');
const body = rd('src/body.html');
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@500;600;700&family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Chakra+Petch:wght@400;600&display=swap">';

// GitHub Pages / PWA build
const pwa = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Elonth</title>
<meta name="theme-color" content="#0f0d0a">
<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon-192.png">
${fonts}
<style>${css}</style></head><body>
${body}
<script src="vendor/three.r160.js"></script>
<script>window.ELONTH_PWA=true;</script>
<script>${game}</script>
<script>if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}</script>
</body></html>`;
fs.writeFileSync(path.join(root, 'index.html'), pwa);

// Artifact build (skeleton is added by host)
const art = `<meta charset="utf-8">
<title>Elonth</title>
${fonts}
<style>${css}</style>
${body}
<script>${threeJs}</script>
<script>${game}</script>`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/elonth.html'), art);

// SW cache version
let sw = rd('tools/sw.template.js').replace('__VER__', version);
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log('built', version, (pwa.length / 1024).toFixed(0) + 'KB pwa,', (art.length / 1024).toFixed(0) + 'KB artifact,', files.length, 'files');
