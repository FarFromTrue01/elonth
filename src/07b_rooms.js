// ---------- Bölüm 2 mekânları: lonca salonu, değirmen, mahzen, kanal ----------
function roomShell(L, W, D, H, o = {}) {
  const b = L.b, wc = o.wall || '#a89a84', wd = o.wall2 || '#968872', fc = o.floor || '#6a5a48';
  L.interior = true;
  L.bounds = { x0: -W / 2 + 0.3, x1: W / 2 - 0.3, z0: -D / 2 + 0.3, z1: D / 2 - 0.3 };
  L.camBox = { x0: -W / 2 + 0.4, x1: W / 2 - 0.4, y0: 0.3, y1: H - 0.2, z0: -D / 2 + 0.4, z1: D / 2 - 0.4 };
  // zemin: karo / tahta
  const n = Math.ceil(W / 1.0);
  for (let i = 0; i < n; i++) for (let j = 0; j < Math.ceil(D / 1.0); j++) b.box(((i + j) & 1) ? fc : shade(fc, 0.93), -W / 2 + 0.5 + i, -0.1, -D / 2 + 0.5 + j, 1.0, 0.1, 1.0);
  b.box(wc, 0, 0, -D / 2 - 0.1, W, H, 0.2); b.box(wd, 0, 0, D / 2 + 0.1, W, H, 0.2); b.box(wd, -W / 2 - 0.1, 0, 0, 0.2, H, D); b.box(wd, W / 2 + 0.1, 0, 0, 0.2, H, D);
  b.box(o.ceil || '#4a3a2c', 0, H, 0, W + 0.4, 0.14, D + 0.4);
  for (let i = -Math.floor(W / 3); i <= Math.floor(W / 3); i++) b.box(COL.beam, i * 2.2, H - 0.3, 0, 0.22, 0.3, D);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.beam, sx * (W / 2 - 0.12), 0, sz * (D / 2 - 0.12), 0.24, H, 0.24);
  // alt lambri
  if (!o.stone) { b.box('#6e5238', 0, 0, -D / 2 + 0.02, W, 0.9, 0.05); b.box('#6e5238', -W / 2 + 0.02, 0, 0, 0.05, 0.9, D); b.box('#6e5238', W / 2 - 0.02, 0, 0, 0.05, 0.9, D); b.box('#4e3622', 0, 0.9, -D / 2 + 0.03, W, 0.07, 0.07); }
}
function wallTorch(L, x, y, z, ry = 0, power = 3.4) {
  const b = L.b; b.add('box', COL.iron, x, y - 0.18, z, 0.05, 0.36, 0.05, 0, ry, 0); b.add('cyl6', '#5a4a3a', x, y, z, 0.12, 0.12, 0.12, 0, ry, 0);
  L.gb.add('cone6', '#ff9a3a', x, y + 0.16, z, 0.14, 0.26, 0.14); L.gb.add('ico0', '#ffd27a', x, y + 0.13, z, 0.08, 0.14, 0.08);
  const l = new T.PointLight('#ff9448', power, 11, 1.5); l.position.set(x, y + 0.4, z + (Math.abs(z) > 4 ? (z > 0 ? -0.5 : 0.5) : 0)); L.light(l);
  const ph = Math.random() * 9; L.anims.push(() => { l.intensity = power + Math.sin(G.t * 11 + ph) * 0.45 + Math.sin(G.t * 23.7 + ph) * 0.3; });
  return l;
}
function sackPile(L, x, z, n = 4, c = '#c8b890') {
  const b = L.b; for (let i = 0; i < n; i++) { const a = rnd(0, TAU), r = rnd(0, 0.35); b.add('sphS', pick([c, shade(c, 0.9), shade(c, 1.06)]), x + Math.cos(a) * r, 0.2 + (i > 2 ? 0.3 : 0), z + Math.sin(a) * r, 0.55, 0.42, 0.42, 0, rnd(0, 3), rnd(-0.2, 0.2)); b.add('sphS', '#a89868', x + Math.cos(a) * r, 0.42 + (i > 2 ? 0.3 : 0), z + Math.sin(a) * r, 0.12, 0.1, 0.12); }
  L.addCircle(x, z, 0.55);
}
function barrelStack(L, x, z, n = 3) {
  const b = L.b; for (let i = 0; i < n; i++) { const bx = x + (i % 2) * 0.62 - (n > 2 ? 0.3 : 0), bz = z + (i > 1 ? 0.5 : 0); b.add('cylS8', '#7a5434', bx, 0.4, bz, 0.62, 0.8, 0.62); b.add('torus', COL.iron, bx, 0.22, bz, 0.62, 0.62, 0.08, Math.PI / 2, 0, 0); b.add('torus', COL.iron, bx, 0.6, bz, 0.62, 0.62, 0.08, Math.PI / 2, 0, 0); }
  L.addBox(x, z + 0.1, 0.65, 0.55 + (n > 1 ? 0.3 : 0));
}
function webCorner(L, x, y, z, ry) {
  const g = new T.Mesh(new T.PlaneGeometry(1.3, 1.3), new T.MeshBasicMaterial({ map: webTex(), transparent: true, depthWrite: false, side: T.DoubleSide, opacity: 0.5, fog: true }));
  g.position.set(x, y, z); g.rotation.set(0, ry, 0); L.add(g);
}
let _webTex = null;
function webTex() {
  if (_webTex) return _webTex;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.strokeStyle = 'rgba(235,235,240,0.9)'; x.lineWidth = 1;
  for (let i = 0; i < 7; i++) { const a = i / 6 * Math.PI / 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * 160, Math.sin(a) * 160); x.stroke(); }
  for (let r = 18; r < 150; r += 20) { x.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI / 2, rr = r * (0.88 + 0.12 * Math.sin(i * 2.3 + r)); const px = Math.cos(a) * rr, py = Math.sin(a) * rr; i ? x.quadraticCurveTo(px * 0.95, py * 0.9, px, py) : x.moveTo(px, py); } x.stroke(); }
  _webTex = new T.CanvasTexture(c); _webTex.colorSpace = T.SRGBColorSpace; return _webTex;
}

// ===== Eros loncası: iç mekân =====
function buildGuildInterior() {
  const L = new Level('guild'); const b = L.b; seed(41);
  const W = 18, D = 13, H = 4.6; roomShell(L, W, D, H, { wall: '#b4a58c', wall2: '#a29480', floor: '#7a6850' });
  // kayıt tezgâhı (kuzey) ve Greta'nın arkası
  b.box('#5a3e28', 0, 0, -D / 2 + 3.0, 7.4, 1.05, 0.9); b.box('#7a5a3a', 0, 1.05, -D / 2 + 3.0, 7.7, 0.1, 1.05); L.addBox(0, -D / 2 + 3.0, 3.85, 0.55);
  b.box('#4a3422', 0, 0, -D / 2 + 1.1, 7.4, 0.9, 0.9); b.box('#3a2a1c', -2.6, 0.9, -D / 2 + 0.5, 1.8, 2.6, 0.3); b.box('#3a2a1c', 2.6, 0.9, -D / 2 + 0.5, 1.8, 2.6, 0.3); // arka dolaplar
  for (let i = 0; i < 4; i++) for (const sx of [-2.6, 2.6]) { b.add('boxb', i % 2 ? '#8a6a48' : '#6a4a34', sx + (i - 1.5) * 0.4, 1.0 + (i % 2) * 0.55, -D / 2 + 0.68, 0.34, 0.3, 0.1); }
  b.box('#c8b88a', -2.4, 1.15, -D / 2 + 3.1, 0.6, 0.02, 0.4); b.add('cyl8', '#efe6d0', 1.4, 1.2, -D / 2 + 3.0, 0.06, 0.2, 0.06); L.gb.add('cone6', '#ffd27a', 1.4, 1.34, -D / 2 + 3.0, 0.04, 0.08, 0.04);
  b.box('#e8e0c8', 0.5, 1.15, -D / 2 + 3.1, 0.7, 0.02, 0.5); b.add('box', '#3a2a1c', 0.8, 1.17, -D / 2 + 3.1, 0.05, 0.3, 0.02, 0, 0, 0.9);
  // pano (sol duvar), afişler
  b.box('#5a4028', -W / 2 + 0.2, 1.0, -1.0, 0.12, 2.0, 4.4);
  for (let i = 0; i < 7; i++) b.add('box', pick(['#e8dcc0', '#d8c8a0', '#efe6d0']), -W / 2 + 0.3, 1.5 + (i % 2) * 0.5 - (i > 3 ? 0.9 : 0), -2.4 + (i % 4) * 1.0 + rnd(-0.1, 0.1), 0.02, 0.42, 0.32, 0, 0, rnd(-0.1, 0.1));
  L.pts.board = V3(-W / 2 + 1.6, 0, -1.0);
  // uzun masalar ve banklar
  for (const [x, z] of [[-4.2, 2.2], [4.2, 2.6]]) { b.box('#7a5a3a', x, 0.72, z, 3.4, 0.09, 1.1); for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box('#4a3422', x + sx * 1.5, 0, z + sz * 0.4, 0.1, 0.72, 0.1); b.box('#5a4028', x, 0, z - 0.95, 3.2, 0.42, 0.3); b.box('#5a4028', x, 0, z + 0.95, 3.2, 0.42, 0.3); b.add('cyl8', '#9a8a70', x - 0.6, 0.82, z, 0.14, 0.12, 0.14); b.add('cyl8', '#9a8a70', x + 0.7, 0.82, z + 0.2, 0.14, 0.12, 0.14); L.addBox(x, z, 1.8, 0.8); }
  // ocak (sağ duvar)
  b.box(COL.stone, W / 2 - 0.6, 0, 1.0, 1.0, 1.4, 2.2); b.box(COL.stoneD, W / 2 - 0.7, 1.4, 1.0, 0.8, 2.6, 1.6); b.box('#1a1410', W / 2 - 1.12, 0.1, 1.0, 0.06, 0.8, 1.2); L.addBox(W / 2 - 0.7, 1.0, 0.6, 1.2);
  L.gb.add('ico0', '#ff9a3a', W / 2 - 1.2, 0.3, 1.0, 0.6, 0.4, 0.6); L.gb.add('ico0', '#ffd27a', W / 2 - 1.2, 0.36, 1.05, 0.3, 0.3, 0.3);
  const fire = new T.PointLight('#ff9a48', 4.5, 12, 1.4); fire.position.set(W / 2 - 1.8, 0.9, 1.0); L.light(fire); L.anims.push(() => { fire.intensity = 4.2 + Math.sin(G.t * 11) * 0.5 + Math.sin(G.t * 23.7) * 0.3; });
  // merdiven (üst kat), pencere, bayraklar
  banner(L, -5.5, -D / 2 + 0.3, 0, '#1f3a6a', 3.6, COL.gold); banner(L, 5.5, -D / 2 + 0.3, 0, '#1f3a6a', 3.6, COL.gold);
  // pencereler: ışık huzmesi
  for (const x of [-6, 6]) { b.box('#e6d8b0', x, 1.4, D / 2 - 0.02, 1.2, 1.8, 0.04); b.box(COL.beam, x, 1.4, D / 2 - 0.05, 0.08, 1.8, 0.06); b.box(COL.beam, x, 2.2, D / 2 - 0.05, 1.2, 0.08, 0.06); }
  lightShaft(L, [[-6.6, 3.2, D / 2], [-5.4, 3.2, D / 2], [-5.4, 1.4, D / 2], [-6.6, 1.4, D / 2]], [0.25, -0.8, -1], '#ffeecc', 0.08);
  wallTorch(L, -W / 2 + 0.3, 2.6, 4.5, 0, 2.0); wallTorch(L, W / 2 - 0.3, 2.6, -4.5, 0, 2.0);
  L.pts = Object.assign(L.pts, { door: V3(0, 0, D / 2 - 1.2), desk: V3(0, 0, -D / 2 + 4.3), greta: V3(0, 0, -D / 2 + 1.9), table1: V3(-4.2, 0, 2.2), table2: V3(4.2, 0, 2.6), hearth: V3(W / 2 - 2.2, 0, 1.0) });
  L.finalize(); return L;
}

// ===== Dipte: değirmen, mahzen, kanal =====
function buildDungeon(kind = 'mill') {
  const L = new Level('dungeon_' + kind); const b = L.b; seed(kind.length * 31 + 5);
  if (kind === 'mill') {
    const W = 18, D = 16, H = 5.2; roomShell(L, W, D, H, { wall: '#b0a088', wall2: '#a09078', floor: '#7a6a56' });
    // değirmen taşı + mil
    b.add('cyl8', '#9a948a', 0, 0.35, -2.5, 3.2, 0.5, 3.2); b.add('cyl8', '#8a847a', 0, 0.85, -2.5, 3.0, 0.4, 3.0); b.add('cyl8', COL.woodD, 0, 2.6, -2.5, 0.4, 3.6, 0.4); L.addCircle(0, -2.5, 1.75);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; b.add('box', '#7a5a3a', Math.cos(a) * 1.2, 1.15, -2.5 + Math.sin(a) * 1.2, 0.1, 0.1, 0.5, 0, -a, 0); }
    b.box(COL.woodD, 0, 4.0, -2.5, 8, 0.4, 0.4); b.box(COL.woodD, 0, 4.0, -2.5, 0.4, 0.4, 8);
    // çuvallar, un tozu, merdiven, kepçe
    sackPile(L, -6.8, -5.5, 6); sackPile(L, -7.2, 4.8, 5); sackPile(L, 6.9, -6.0, 6); sackPile(L, 7.0, 5.5, 4, '#d4c8a0'); sackPile(L, 2.4, 6.5, 3);
    b.box(COL.woodD, 6.6, 0, 0, 1.4, 1.2, 2.4); b.box('#c8b88a', 6.6, 1.2, 0, 1.5, 0.1, 2.5); L.addBox(6.6, 0, 0.8, 1.3);
    for (let i = 0; i < 6; i++) b.box('#6a4a32', -W / 2 + 0.5 + i * 0.01, i * 0.45, 7.0 - i * 0.55, 1.0, 0.45, 0.55);
    barrelStack(L, 3.6, -6.8, 3); barrelStack(L, -3.5, 6.6, 2);
    for (const x of [-5, 5]) { b.box('#e6d8b0', x, 2.0, -D / 2 + 0.02, 1.2, 1.6, 0.04); }
    lightShaft(L, [[-5.6, 3.6, -D / 2], [-4.4, 3.6, -D / 2], [-4.4, 2.0, -D / 2], [-5.6, 2.0, -D / 2]], [0.35, -0.85, 1], '#fff0d0', 0.12);
    lightShaft(L, [[4.4, 3.6, -D / 2], [5.6, 3.6, -D / 2], [5.6, 2.0, -D / 2], [4.4, 2.0, -D / 2]], [-0.3, -0.85, 1], '#fff0d0', 0.12);
    wallTorch(L, -W / 2 + 0.3, 2.8, 0, 0, 2.2); wallTorch(L, W / 2 - 0.3, 2.8, 0, 0, 2.2);
    L.pts = { door: V3(0, 0, D / 2 - 1.2), arena: V3(0, 0, 1.5) }; L.arenaR = 6.4;
  } else if (kind === 'cellar') {
    const W = 20, D = 16, H = 3.6; roomShell(L, W, D, H, { wall: '#7e766a', wall2: '#6e665a', floor: '#58504a', stone: true, ceil: '#3a342e' });
    for (let i = -3; i <= 3; i++) { b.box('#6a6258', i * 2.8, 0, -D / 2 + 0.2, 0.5, H, 0.5); }
    for (const x of [-6, 0, 6]) { for (const z of [-3.5, 3.5]) { b.box('#847c70', x, 0, z, 0.8, H, 0.8); L.addCircle(x, z, 0.6); } }
    barrelStack(L, -8.5, -5, 3); barrelStack(L, -8.5, 1.5, 3); barrelStack(L, 8.5, -4.5, 3); barrelStack(L, 8.4, 2.5, 3); barrelStack(L, 2.5, -6.6, 2);
    for (const sx of [-1, 1]) { b.box('#5a4028', sx * 9.3, 0.0, 6.2, 0.5, 2.3, 3.2); for (let i = 0; i < 4; i++) b.add('cyl8', pick(['#7a5a40', '#6a7a6a', '#8a6a48']), sx * 9.25, 0.6 + i * 0.5, 5.4 + (i % 3) * 0.7, 0.2, 0.3, 0.2); L.addBox(sx * 9.3, 6.2, 0.35, 1.6); }
    b.box('#6a5a48', 0, 0, 7.0, 3.2, 0.9, 1.2); L.addBox(0, 7.0, 1.6, 0.6);
    for (const [x, y, z, ry] of [[-9.6, 3.3, -7.6, 0], [9.6, 3.3, -7.6, 1.6], [-9.6, 3.3, 7.6, 1.6], [9.6, 3.3, 7.6, 0], [0, 3.4, -7.7, 0]]) webCorner(L, x, y, z, ry);
    wallTorch(L, -W / 2 + 0.3, 2.3, -1.5, 0, 3.0); wallTorch(L, W / 2 - 0.3, 2.3, -1.5, 0, 3.0); wallTorch(L, 0, 2.3, -D / 2 + 0.3, 0, 2.6);
    L.pts = { door: V3(0, 0, D / 2 - 1.2), arena: V3(0, 0, 0.5) }; L.arenaR = 6.8;
  } else { // canal
    const W = 18, D = 40, H = 5.0; roomShell(L, W, D, H, { wall: '#625c56', wall2: '#585250', floor: '#4a4540', stone: true, ceil: '#2a2622' });
    // orta su kanalı (x -3..3), iki yanda yürüme yolu
    const water = new T.Mesh(new T.PlaneGeometry(6, D - 1), MAT.water); water.rotation.x = -Math.PI / 2; water.position.set(0, -0.28, 0); L.add(water);
    b.box('#38332e', -3.3, -0.4, 0, 0.5, 0.4, D); b.box('#38332e', 3.3, -0.4, 0, 0.5, 0.4, D); b.box('#2a2622', 0, -0.9, 0, 6.2, 0.6, D);
    for (let i = 0; i < 7; i++) { const z = -D / 2 + 3 + i * 5.6; b.box('#6a645c', -3.7, 0, z, 0.5, 4.4, 0.7); b.box('#6a645c', 3.7, 0, z, 0.5, 4.4, 0.7); b.add('cylS8', '#6a645c', 0, 4.4, z, 7.4, 0.9, 0.9, 0, 0, Math.PI / 2); }
    for (const [x, z] of [[-6.5, -8], [6.5, 4], [-6.5, 12], [6.8, -14], [-7, 0]]) { barrelStack(L, x, z, 2); }
    for (let i = 0; i < 6; i++) b.add('sphS', '#8a8278', rnd(-8, 8), 0.1, rnd(-18, 18), rnd(0.2, 0.5), 0.15, rnd(0.2, 0.5));
    // kuzey ucunda savak: kapak, çark, kol
    b.box('#4a3a2c', 0, 0.0, -D / 2 + 1.3, 7.2, 3.4, 0.6); b.box('#2a2622', 0, 0.2, -D / 2 + 1.55, 5.6, 2.6, 0.12);
    for (let i = 0; i < 6; i++) b.box('#3a2e24', -2.5 + i, 0.2, -D / 2 + 1.62, 0.08, 2.6, 0.06);
    b.add('torus', COL.iron, 0, 3.0, -D / 2 + 1.7, 1.2, 1.2, 0.16, 0, 0, 0); for (let i = 0; i < 4; i++) b.add('box', COL.iron, 0, 3.0, -D / 2 + 1.7, 0.1, 1.2, 0.1, 0, 0, i * Math.PI / 4);
    // kol: sağ yürüme yolu
    b.box('#6a5a48', 5.6, 0, -D / 2 + 3.2, 0.8, 0.5, 0.8); b.add('box', COL.iron, 5.6, 0.95, -D / 2 + 3.2, 0.1, 1.0, 0.1, 0, 0, 0.5); b.add('sph8', '#c84a3a', 5.9, 1.4, -D / 2 + 3.2, 0.2, 0.2, 0.2); L.addCircle(5.6, -D / 2 + 3.2, 0.5);
    // tuzak levhası: paslı çivili tahta (kanalın solunda)
    L.pts.lever = V3(5.6, 0, -D / 2 + 4.3);
    for (const [x, z] of [[-6, -6], [6, 9], [-6, 16]]) wallTorch(L, x > 0 ? 8.7 : -8.7, 2.4, z, 0, 2.6);
    wallTorch(L, -8.7, 2.4, -D / 2 + 3, 0, 3.0);
    for (const [x, y, z, ry] of [[-8.6, 4.0, -18, 1.57], [8.6, 4.0, 18, -1.57], [-8.6, 4.0, 6, 1.57]]) webCorner(L, x, y, z, ry);
    L.waterZ = { x0: -3, x1: 3 };
    L.pts = Object.assign(L.pts, { door: V3(-6.5, 0, D / 2 - 1.5), arena: V3(0, 0, 2), nest: V3(5.8, 0, 6), trap: V3(0, 0, -6) }); L.arenaR = 8;
  }
  L.finalize(); return L;
}
