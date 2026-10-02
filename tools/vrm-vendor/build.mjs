// Kullanım: cd tools/vrm-vendor && npm i && npm run build  -> vendor/three-vrm.js
import * as esbuild from 'esbuild';
import path from 'path';
const here = path.dirname(new URL(import.meta.url).pathname);
await esbuild.build({
  entryPoints: [path.join(here, 'entry.js')], bundle: true, minify: true, format: 'iife', legalComments: 'inline',
  outfile: path.join(here, '../../vendor/three-vrm.js'),
  plugins: [{ name: 'global-three', setup(b) { b.onResolve({ filter: /^three$/ }, () => ({ path: path.join(here, 'shim.cjs') })); } }],
});
console.log('vendor/three-vrm.js yazıldı');
