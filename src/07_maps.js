// ---------- Haritalar ----------
const hillF = (x, z, cx, cz, r, h) => { const d = Math.hypot(x - cx, z - cz) / r; return d < 1 ? h * smooth(1 - d) : 0; };

// ===== Gece yolu (kaza) =====
function buildRoad() {
  const L = new Level('road');
  L.hf = (x, z) => { const ax = Math.abs(x); return ax < 7 ? 0 : (ax - 7) * 0.15 + fbm(x * 0.05, z * 0.05) * 3 * smooth(clamp((ax - 7) / 20, 0, 1)); };
  terrain(L, -60, -620, 60, 160, 6, (x, z, y) => Math.abs(x) < 4.3 ? '#26282c' : Math.abs(x) < 5.2 ? '#3a3a38' : (hash2(x, z) > 0.5 ? '#1f2a1c' : '#243020'));
  const b = L.b;
  for (let z = 150; z > -620; z -= 9) { b.add('box', '#c8c8b8', 0, 0.02, z, 0.15, 0.02, 4, 0, 0, 0, 0); }
  for (const sx of [-1, 1]) { b.add('box', '#b8b8a8', sx * 4.0, 0.02, -235, 0.12, 0.02, 770, 0, 0, 0, 0); }
  for (let z = 150; z > -620; z -= 4) for (const sx of [-1, 1]) b.add('box', '#8a8d92', sx * 5.4, 0.35, z, 0.1, 0.7, 0.1, 0, 0, 0, 0.02);
  for (const sx of [-1, 1]) b.add('box', '#a4a8ae', sx * 5.4, 0.6, -235, 0.06, 0.25, 770, 0, 0, 0, 0);
  for (let z = 140; z > -620; z -= 42) { const sx = (Math.round(z / 42) % 2) ? 1 : -1; b.add('box', '#55585e', sx * 6, 3.5, z, 0.15, 7, 0.15); b.add('box', '#55585e', sx * 5.2, 7, z, 1.8, 0.1, 0.12); L.gb.add('box', '#ffe2a8', sx * 4.4, 6.9, z, 0.6, 0.1, 0.3); }
  seed(3);
  for (let i = 0; i < 260; i++) { const sx = rng() < 0.5 ? -1 : 1, x = sx * rnd(9, 55), z = rnd(-610, 150); tree(L, x, z, 'pine', rnd(1.2, 2.2)); }
  // uzak şehir ışıkları
  for (let i = 0; i < 40; i++) { const x = rnd(-180, 180), z = rnd(-700, -560), h = rnd(10, 60); b.add('boxb', '#0e1118', x, 0, z, rnd(6, 14), h, rnd(6, 14)); for (let k = 0; k < 6; k++) L.gb.add('box', pick(['#ffd890', '#ffeec8', '#a8c8ff']), x + rnd(-3, 3), rnd(2, h), z + 7.2, 0.6, 0.6, 0.1); }
  L.finalize();
  L.camBox = null;
  return L;
}
function makeCar() {
  const g = new T.Group(); const m = (t, c, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0, basic) => { const k = new T.Mesh(prim(t), basic ? new T.MeshBasicMaterial({ color: c }) : lam(c)); k.position.set(x, y, z); k.scale.set(sx, sy, sz); k.rotation.set(rx, ry, rz); k.castShadow = true; g.add(k); return k; };
  m('box', '#8e1418', 0, 0.55, 0, 1.9, 0.5, 4.4); m('box', '#7a1014', 0, 0.42, 2.0, 1.85, 0.32, 0.6, 0.25); m('wedge', '#101418', 0, 0.8, -0.2, 1.6, 0.45, 2.0, 0, Math.PI, 0); m('box', '#101418', 0, 1.02, -0.5, 1.55, 0.06, 1.2);
  m('box', '#6a0c10', 0, 0.84, -1.9, 1.8, 0.08, 0.5); // spoiler
  for (const sx of [-1, 1]) for (const sz of [-1.35, 1.35]) { m('cyl12', '#111', sx * 0.92, 0.36, sz, 0.72, 0.28, 0.72, 0, 0, Math.PI / 2); m('cyl8', '#9a9ca0', sx * 1.06, 0.36, sz, 0.4, 0.02, 0.4, 0, 0, Math.PI / 2); }
  for (const sx of [-1, 1]) { m('box', '#f4f6ff', sx * 0.65, 0.62, 2.21, 0.42, 0.1, 0.04, 0, 0, 0, true); m('box', '#ff2020', sx * 0.7, 0.66, -2.21, 0.42, 0.08, 0.04, 0, 0, 0, true); }
  const sl = new T.SpotLight('#f2f4ff', 60, 70, 0.5, 0.5, 1.2); sl.position.set(0, 0.7, 2.2); sl.target.position.set(0, 0, 22); g.add(sl); g.add(sl.target);
  return g;
}
function makeTruck() {
  const g = new T.Group(); const m = (t, c, x, y, z, sx, sy, sz, basic) => { const k = new T.Mesh(prim(t), basic ? new T.MeshBasicMaterial({ color: c }) : lam(c)); k.position.set(x, y, z); k.scale.set(sx, sy, sz); k.castShadow = true; g.add(k); return k; };
  m('box', '#c8ccd2', 0, 2.2, -4, 2.5, 3.2, 9); m('box', '#2a4a7a', 0, 1.8, 2.2, 2.4, 2.4, 2.2); m('box', '#0f141a', 0, 2.4, 3.32, 2.2, 0.9, 0.05);
  for (const sx of [-1, 1]) { m('box', '#ffffff', sx * 0.9, 1.0, 3.33, 0.4, 0.25, 0.05, true); for (const z of [2.2, -2, -6]) m('cyl12', '#111', sx * 1.15, 0.55, z, 1.1, 0.4, 1.1).rotation.z = Math.PI / 2; }
  const pl = new T.PointLight('#ffffff', 40, 40, 1.5); pl.position.set(0, 1.2, 5); g.add(pl);
  return g;
}

// ===== Kulübe içi =====
function buildHut(variant = 'day') {
  const L = new Level('hut'); const b = L.b; seed(11);
  const W = 7, D = 6, H = 2.7;
  L.bounds = { x0: -W / 2 + 0.2, x1: W / 2 - 0.2, z0: -D / 2 + 0.2, z1: D / 2 - 0.2 };
  L.camBox = { x0: -W / 2 + 0.25, x1: W / 2 - 0.25, y0: 0.3, y1: H - 0.15, z0: -D / 2 + 0.25, z1: D / 2 - 0.25 };
  L.interior = true;
  // zemin
  for (let i = 0; i < 14; i++) b.box(i % 2 ? '#7a5a3c' : '#6e5034', -W / 2 + 0.25 + i * 0.5, -0.1, 0, 0.5, 0.1, D, 0, 0, 0);
  // duvarlar (pencere boşluğu arka duvarda: x -0.6..0.6, y 1..1.9)
  const wc = '#cdb894', wd = '#bfa984';
  b.box(wc, 0, 0, -D / 2 - 0.1, W, 1.0, 0.2); b.box(wc, 0, 1.9, -D / 2 - 0.1, W, H - 1.9, 0.2);
  b.box(wc, -(W / 4 + 0.3), 1.0, -D / 2 - 0.1, W / 2 - 0.6, 0.9, 0.2); b.box(wc, (W / 4 + 0.3), 1.0, -D / 2 - 0.1, W / 2 - 0.6, 0.9, 0.2);
  b.box(wd, 0, 0, D / 2 + 0.1, W, H, 0.2);
  b.box(wd, -W / 2 - 0.1, 0, 0, 0.2, H, D); b.box(wd, W / 2 + 0.1, 0, 0, 0.2, H, D);
  // kapı (ön duvar içi)
  b.box('#4e3624', -1.6, 0, D / 2 - 0.02, 1.0, 1.95, 0.08); b.box(COL.beam, -1.6, 1.95, D / 2 - 0.04, 1.2, 0.12, 0.1);
  // kirişler, tavan
  b.box('#5a4030', 0, H, 0, W + 0.4, 0.12, D + 0.4);
  for (let i = -3; i <= 3; i++) b.box(COL.beam, i * 1.1, H - 0.22, 0, 0.18, 0.22, D);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.beam, sx * (W / 2 - 0.1), 0, sz * (D / 2 - 0.1), 0.2, H, 0.2);
  // pencere çerçevesi ve kanatlar
  b.box(COL.beam, 0, 0.95, -D / 2 - 0.02, 1.4, 0.1, 0.3); b.box(COL.beam, 0, 1.9, -D / 2 - 0.02, 1.4, 0.1, 0.3);
  b.box(COL.beamL, -0.95, 1.0, -D / 2 + 0.12, 0.45, 0.9, 0.04, 0.6); b.box(COL.beamL, 0.95, 1.0, -D / 2 + 0.12, 0.45, 0.9, 0.04, -0.6);
  // manzara
  const view = new T.Mesh(new T.PlaneGeometry(9, 6), new T.MeshBasicMaterial({ map: windowView(variant !== 'day'), fog: false }));
  view.position.set(0, 1.4, -D / 2 - 3); L.add(view);
  // Joseph'in yatağı (sol arka)
  b.box(COL.woodD, -2.5, 0, -1.4, 1.0, 0.4, 2.1); b.box('#d8c89a', -2.5, 0.4, -1.4, 0.92, 0.14, 2.0); b.box('#8a5a4a', -2.5, 0.52, -1.0, 0.95, 0.08, 1.3); b.box('#e8dcc0', -2.5, 0.54, -2.15, 0.6, 0.12, 0.35);
  L.addBox(-2.5, -1.4, 0.5, 1.05);
  // Lily'nin yatağı
  b.box(COL.woodD, 2.6, 0, -2.1, 0.8, 0.32, 1.5); b.box('#e0d0a8', 2.6, 0.32, -2.1, 0.74, 0.12, 1.45); b.box('#6a7a9a', 2.6, 0.42, -1.85, 0.76, 0.06, 0.95);
  L.addBox(2.6, -2.1, 0.4, 0.75);
  // ocak
  b.box(COL.stone, 3.15, 0, 0.9, 0.7, 1.1, 1.6); b.box(COL.stoneD, 3.2, 1.1, 0.9, 0.6, 1.6, 1.0); b.box('#1a1410', 2.82, 0.15, 0.9, 0.05, 0.6, 0.8);
  L.gb.add('ico0', '#ff9a3a', 2.95, 0.3, 0.9, 0.5, 0.35, 0.5); L.gb.add('ico0', '#ffd27a', 2.95, 0.35, 0.95, 0.25, 0.25, 0.25);
  b.box('#2a2420', 2.9, 0.55, 0.9, 0.3, 0.3, 0.3); // kazan
  L.addBox(3.15, 0.9, 0.4, 0.85);
  const fire = new T.PointLight('#ff9a48', variant === 'dark' ? 0.8 : 5, 9, 1.4); fire.position.set(2.6, 0.7, 0.9); L.light(fire);
  L.anims.push(() => { fire.intensity = (variant === 'dark' ? 0.7 : 4.5) + Math.sin(G.t * 11) * 0.5 + Math.sin(G.t * 23.7) * 0.3; });
  // masa ve tabureler
  b.box(COL.wood, 0.3, 0.72, 0.9, 1.5, 0.08, 0.9); for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.woodD, 0.3 + sx * 0.65, 0, 0.9 + sz * 0.35, 0.08, 0.72, 0.08);
  for (const [x, z] of [[-0.75, 0.9], [1.35, 0.9], [0.3, 1.75]]) { b.box(COL.woodD, x, 0.42, z, 0.4, 0.06, 0.4); b.box(COL.woodD, x, 0, z, 0.06, 0.42, 0.06); }
  b.add('cyl8', '#9a8a70', 0.1, 0.82, 0.8, 0.14, 0.12, 0.14); b.add('cyl8', '#8a6a48', 0.55, 0.79, 1.0, 0.22, 0.06, 0.22); b.add('box', '#c8a868', 0.6, 0.8, 0.7, 0.25, 0.08, 0.15);
  L.addBox(0.3, 0.9, 0.8, 0.5);
  // raflar, çömlekler, otlar
  b.box(COL.wood, -3.3, 1.4, 1.2, 0.3, 0.05, 1.6); b.box(COL.wood, -3.3, 1.8, 1.2, 0.3, 0.05, 1.6);
  for (let i = 0; i < 5; i++) b.add(pick(['cyl8', 'sph8']), pick(['#9a6a48', '#7a5a40', '#a88a5a', '#6a7a6a']), -3.3, 1.55, 0.6 + i * 0.28, 0.2, 0.25, 0.2);
  for (let i = 0; i < 4; i++) b.add('box', pick(['#7a8a4a', '#8a7a3a', '#5a6a3a']), -1 + i * 0.6, H - 0.55, -0.6, 0.12, 0.4, 0.12);
  // ebeveyn köşesi: perde
  b.box('#8a7a5a', 2.0, 0, 2.0, 0.05, 2.1, 1.8); b.box(COL.woodD, 2.9, 0, 2.2, 1.0, 0.4, 1.4); b.box('#c8b88a', 2.9, 0.4, 2.2, 0.95, 0.15, 1.35);
  L.addBox(2.9, 2.2, 0.55, 0.8); L.addBox(2.0, 2.0, 0.05, 0.9);
  // sandık, süpürge, kova
  b.box(COL.woodD, -1.4, 0, -2.6, 0.9, 0.5, 0.5); b.box(COL.iron, -1.4, 0.48, -2.6, 0.92, 0.04, 0.52); L.addBox(-1.4, -2.6, 0.45, 0.25);
  b.add('box', '#8a6a40', -3.2, 0.7, -0.4, 0.05, 1.4, 0.05, 0, 0, 0.12); b.add('cone4', '#b8984a', -3.13, 0.15, -0.4, 0.25, 0.35, 0.2);
  b.add('cyl8', '#6a5038', 2.6, 0.2, 2.9 - 0.4, 0.35, 0.4, 0.35);
  // leğen (tabure üstünde)
  b.box(COL.woodD, 1.25, 0, -2.55, 0.5, 0.5, 0.5); b.add('cyl8', '#8a6a48', 1.25, 0.6, -2.55, 0.6, 0.2, 0.6); b.add('cyl8', '#5a7a88', 1.25, 0.69, -2.55, 0.5, 0.02, 0.5, 0, 0, 0, 0);
  L.addBox(1.25, -2.55, 0.3, 0.3); L.pts.basin = V3(1.25, 0, -2.0);
  // halı
  b.box('#8a4a3a', -0.4, -0.04, 0.2, 2.2, 0.02, 1.6, 0, 0, 0); b.box('#a86a4a', -0.4, -0.03, 0.2, 1.8, 0.02, 1.2, 0, 0, 0);
  L.pts = Object.assign(L.pts, { bedJoseph: V3(-2.5, 0, -1.4), bedLily: V3(2.6, 0, -2.1), door: V3(-1.6, 0, 2.4), window: V3(0, 0, -2.4), table: V3(0.3, 0, 0.9), hearth: V3(2.4, 0, 0.9) });
  L.finalize();
  return L;
}

// ===== Köy =====
function riverX(z) { return 31 + Math.sin(z * 0.045) * 4 + Math.sin(z * 0.11) * 1.2; }
const VILLAGE_PATHS = [
  [[0, 0], [1, -14], [-1, -30], [-2, -48], [-2, -70]],
  [[0, 0], [12, 1], [24, 0.5], [riverX(0) + 5, 0], [40, -4], [45, -10]],
  [[0, 0], [-3, 12], [-6, 26], [-9, 38], [-12, 48]],
  [[0, 0], [-8, 4], [-14, 7.5]],
  [[-8, 4], [-17, -8], [-25, -24], [-31, -34]],
  [[0, 0], [6, 9], [10, 18], [14, 27]],
];
function buildVillage(o = {}) {
  const L = new Level('village'); L.winter = !!o.winter; seed(42);
  const lit = !!o.night;
  L.th = (x, z) => {
    let y = (fbm(x * 0.035, z * 0.035) - 0.45) * 1.4;
    const dc = Math.hypot(x * 0.9, z + 4);
    y += smooth(clamp((dc - 62) / 50, 0, 1)) * fbm(x * 0.02 + 5, z * 0.02) * 16;
    y += hillF(x, z, -33, -38, 17, 4.8);
    y += hillF(x, z, 0, -160, 90, 26);
    const pd = distToPath(x, z, VILLAGE_PATHS); y = lerp(y, y * 0.4, 1 - smooth(clamp(pd / 4, 0, 1)));
    const rd = Math.abs(x - riverX(z)); if (rd < 6.5) y -= Math.pow(1 - rd / 6.5, 1.3) * 2.0;
    return y;
  };
  const bridge = { z: 0, hw: 1.7 };
  L.hf = (x, z) => { const t = L.th(x, z); if (Math.abs(z - bridge.z) < bridge.hw && Math.abs(x - riverX(z)) < 6) { const u = (x - riverX(0)) / 6; return Math.max(t, 0.35 + (1 - u * u) * 0.45); } return t; };
  L.bounds = { x0: -60, x1: 64, z0: -70, z1: 66 };
  L.extraResolve = (p, r) => { const rx = riverX(p.z), d = p.x - rx; if (Math.abs(d) < 3.3 + r && Math.abs(p.z - bridge.z) > bridge.hw - 0.2) p.x = rx + Math.sign(d || 1) * (3.3 + r); };
  const W = L.winter;
  const fieldIn = (x, z) => x > -32 && x < 6 && z > 40 && z < 58;
  terrain(L, -110, -200, 120, 120, 1.8, (x, z, y, ny) => {
    const pd = distToPath(x, z, VILLAGE_PATHS);
    const rd = Math.abs(x - riverX(z));
    if (rd < 4.2) return W ? '#9aa4ae' : '#6a6a52';
    if (W) { if (pd < 1.8) return '#b9b2a6'; return hash2(x * 0.5, z * 0.5) > 0.5 ? COL.snow : COL.snow2; }
    if (pd < 1.6 || Math.hypot(x, z) < 7) { const h = hash2(x * 0.7, z * 0.7); return h > 0.66 ? COL.dirt : h > 0.33 ? COL.dirtD : '#8c7050'; }
    if (pd < 2.4) return '#8a8048';
    if (fieldIn(x, z)) return '#7a6038';
    if (ny < 0.85) return '#6a7a44';
    const n = fbm(x * 0.08, z * 0.08); return n > 0.55 ? COL.grass2 : n > 0.38 ? COL.grass : '#7a9448';
  });
  // nehir suyu
  { const pts = []; for (let z = -200; z <= 120; z += 4) pts.push(z); const N = pts.length; const pos = []; for (let i = 0; i < N - 1; i++) { const z1 = pts[i], z2 = pts[i + 1], a1 = riverX(z1), a2 = riverX(z2), w = 3.6; pos.push(a1 - w, 0, z1, a1 + w, 0, z1, a2 - w, 0, z2, a1 + w, 0, z1, a2 + w, 0, z2, a2 - w, 0, z2); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    const wm = W ? new T.MeshLambertMaterial({ color: '#b8c8d4', transparent: true, opacity: 0.9 }) : MAT.water;
    const water = new T.Mesh(g, wm); water.position.y = -1.0; water.receiveShadow = true; L.add(water);
    if (!W) L.anims.push(() => { MAT.water.emissive.setRGB(0.04 + Math.sin(G.t * 1.3) * 0.01, 0.13 + Math.sin(G.t * 1.7) * 0.015, 0.17); }); }
  const b = L.b;
  // köprü
  { const x0 = riverX(0); b.begin(x0, 0, 0, 0);
    for (let i = -11; i <= 11; i++) { const u = i / 11, y = 0.3 + (1 - u * u) * 0.45; b.add('box', i % 2 ? COL.wood : COL.woodL, u * 6, y, 0, 0.55, 0.12, 3.4); }
    for (const sz of [-1.6, 1.6]) { for (let i = -5; i <= 5; i++) { const u = i / 5, y = 0.3 + (1 - u * u) * 0.45; b.add('boxb', COL.woodD, u * 6, y, sz, 0.14, 0.9, 0.14); } b.add('box', COL.wood, -3, 1.15, sz, 6.2, 0.1, 0.1, 0, 0, -0.08); b.add('box', COL.wood, 3, 1.15, sz, 6.2, 0.1, 0.1, 0, 0, 0.08); }
    for (const sx of [-1, 1]) b.add('box', COL.stone, sx * 5.8, -0.6, 0, 1.2, 1.6, 3.8);
    b.end(); }
  // evler
  const houses = [
    [-19, 8, Math.PI / 2, { w: 5.2, d: 4.2, home: true }], [-13, -7, 0.25], [-24, -3, 0.9], [9, -9, -0.15], [17, -15, 0.35], [-6, -17, 0.1],
    [10, 11, Math.PI + 0.1, { leo: true }], [19, 5, -1.35], [-13, 19, 2.5], [-25, 17, 1.75], [3, 25, -2.9], [19, 22, -2.3], [-31, 4, 1.55], [21, -5, -1.6],
    [-3, 34, 2.95], [10, 32, -2.7], [-20, 30, 2.2], [-34, -14, 1.2], [7, -24, 0.1], [-11, -29, 0.4], [14, -32, -0.3], [23, 14, -1.9],
  ];
  L.houses = [];
  // evleri yollardan uzaklaştır
  const nearestOnPaths = (x, z) => { let best = null, bd = 1e9; for (const P of VILLAGE_PATHS) for (let i = 0; i < P.length - 1; i++) { const [ax, az] = P[i], [bx, bz] = P[i + 1]; const vx = bx - ax, vz = bz - az, l2 = vx * vx + vz * vz; const t = clamp(((x - ax) * vx + (z - az) * vz) / l2, 0, 1); const qx = ax + vx * t, qz = az + vz * t, d = Math.hypot(x - qx, z - qz); if (d < bd) { bd = d; best = [qx, qz, d]; } } return best; };
  for (const h of houses) { if (h[3] && h[3].home) continue; for (let k = 0; k < 8; k++) { const [qx, qz, d] = nearestOnPaths(h[0], h[1]); if (d >= 5.6) break; const dx = h[0] - qx, dz = h[1] - qz, l = Math.hypot(dx, dz) || 1; h[0] = qx + dx / l * 5.7; h[1] = qz + dz / l * 5.7; } }
  for (const [x, z, ry, ho] of houses) {
    const opt = Object.assign({ lit: lit && rng() < 0.85 }, ho || {});
    if (opt.home) Object.assign(opt, { lit, windows: [1.3], doorX: -1.0, wall: '#d2c09a', roof: COL.thatch2 });
    const h = peasantHouse(L, x, z, ry, opt); L.houses.push(h);
    if (opt.home) L.pts.homeDoor = h.door; if (opt.leo) { L.pts.leoDoor = h.door; L.pts.leoHouse = V3(x, 0, z); }
    // bahçe çiti bazı evlere
    if (!opt.home && rng() < 0.35 && Math.hypot(x - 16.5, z - 15.5) > 13) { const c = Math.cos(ry), s = Math.sin(ry); const fx = x - s * 4.2, fz = z - c * 4.2; fence(L, fx - c * 3, fz + s * 3, fx + c * 3, fz - s * 3); }
  }
  // ev bahçesi (Joseph)
  fence(L, -23, 3, -23, 13); fence(L, -23, 13, -16, 13.5); fence(L, -23, 3, -16, 3.2);
  b.add('box', '#7a6a50', -21.8, 0.9, 11.8, 0.03, 0.03, 4.5, 0, 0, 0); for (let i = 0; i < 4; i++) b.add('box', pick(['#e8e0c8', '#a8b0c0', '#c8a888']), -21.8, 0.6, 10 + i, 0.02, 0.5, 0.6, 0, 0, 0, 0);
  barrel(L, -16.2, 11.6); crate(L, -16.4, 4.6, 0.8, 0.3); bench(L, -17, 12, 0);
  // meydan
  well(L, 0, 0); bench(L, 5.4, -3.2, -0.9); bench(L, -4.6, -3.6, 0.8);
  L.pts.elder = V3(5.4, 0, -3.2);
  cart(L, -6, 6.5, 1.1); barrel(L, 4, 5); barrel(L, 4.8, 5.6, 0.9); crate(L, -4.8, -5.8, 1, 0.4); haystack(L, 7.5, 4.5, 0.8);
  // ara sokak (dövüş alanı) — Leo'nun evi ile 19,22 arası
  L.pts.alley = V3(16.5, 0, 15.5);
  crate(L, 13.0, 19.8, 0.9, 0.2); crate(L, 13.0, 19.8, 0.7, 0.5, L.h(13, 19.8) + 0.72); barrel(L, 21.4, 11.6); crate(L, 21.0, 18.9, 0.8, 0.9); barrel(L, 14.6, 11.8, 0.85); haystack(L, 20.2, 20.0, 0.7);
  // tarlalar
  for (let z = 41.5; z < 57.5; z += 1.4) { if (W) break; b.add('box', z % 2.8 < 1.4 ? COL.wheat : COL.wheat2, -13, L.h(-13, z) + 0.35, z, 36, 0.7, 0.55, 0, 0, 0, 0.05); for (let x = -30; x < 4; x += 1.1) b.add('cone4', COL.wheat, x + rnd(-0.3, 0.3), L.h(x, z) + 0.82, z + rnd(-0.1, 0.1), 0.22, 0.35, 0.22, 0, rnd(0, 1), 0, 0.12); }
  fence(L, -33, 39.5, -33, 59, { collide: false }); fence(L, -33, 59, 7, 59, { collide: false }); fence(L, 7, 39.5, 7, 59, { collide: false });
  // korkuluk
  { const x = -14, z = 49, y = L.h(x, z); b.add('box', COL.woodD, x, y + 1.2, z, 0.1, 2.4, 0.1); b.add('box', COL.woodD, x, y + 1.8, z, 1.4, 0.1, 0.1); b.add('box', '#7a5a3a', x, y + 1.6, z, 0.45, 0.6, 0.3); b.add('box', '#c8a868', x, y + 2.15, z, 0.35, 0.35, 0.3); b.add('cone8', '#b8984a', x, y + 2.42, z, 0.7, 0.3, 0.7); }
  haystack(L, 10, 45, 1); haystack(L, 11, 49, 0.9); cart(L, 10.5, 53, 0.2);
  L.pts.field = V3(-13, 0, 50); L.pts.fieldEdge = V3(-13, 0, 38);
  // eğitim açıklığı
  L.pts.clearing = V3(46, 0, -12);
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4; b.add('cyl6', COL.trunk, 46 + Math.cos(a) * 6.5, L.h(46, -12) + 0.25, -12 + Math.sin(a) * 6.5, 0.5, 2.2, 0.5, Math.PI / 2, a, 0); }
  rock(L, 52, -7, 1.3); rock(L, 41, -18, 1.1);
  // tepe ve büyük ağaç
  tree(L, -33, -39, 'oak', 1.6); L.pts.hillTop = V3(-31, 0, -35); rock(L, -36, -34, 0.9); flowers(L, -29, -37, 10);
  // kuzey: şehir duvarı ve kapı
  const gz = -74;
  wallSeg(L, -70, gz, -7, gz, 7); wallSeg(L, 3, gz, 75, gz, 7);
  tower(L, -7, gz, 2.6, 11); tower(L, 3, gz, 2.6, 11); tower(L, -40, gz, 2.4, 10); tower(L, 36, gz, 2.4, 10);
  b.add('boxb', COL.stoneD, -2, L.h(-2, gz) + 4.4, gz, 7.5, 3.5, 2.0); b.add('box', '#1a1612', -2, L.h(-2, gz) + 2.0, gz, 4.6, 4.2, 1.8);
  L.addBox(-36, gz, 34, 1.2); L.addBox(39, gz, 36, 1.2);
  banner(L, -5, gz + 1.5, 0, COL.elonth, 5); banner(L, 1, gz + 1.5, 0, COL.elonth, 5);
  L.pts.cityGate = V3(-2, 0, gz + 4);
  // şehir siluetleri
  for (let i = 0; i < 70; i++) { const x = rnd(-80, 80), z = rnd(-95, -125); const y = L.h(x, z); b.add('boxb', pick(['#cfc2a6', '#bcae92', '#d8ccb2']), x, y - 1, z, rnd(5, 8), rnd(5, 10), rnd(5, 7), 0, rnd(-0.2, 0.2), 0); b.add('roof', pick([COL.tile, COL.tile2, COL.slate]), x, y + 6 + rnd(0, 3), z, 7, 3, 8, 0, rnd(-0.2, 0.2) + Math.PI / 2, 0); }
  palace(L, 0, -165, L.h(0, -165) - 1, 1.15);
  // ağaçlar
  const occ = (x, z) => { if (distToPath(x, z, VILLAGE_PATHS) < 3.2) return true; for (const h of houses) if (Math.hypot(x - h[0], z - h[1]) < 5.5) return true; if (Math.abs(x - riverX(z)) < 5) return true; if (fieldIn(x, z) || (x > -36 && x < 12 && z > 37 && z < 62)) return true; if (Math.hypot(x, z) < 9 || Math.hypot(x - 46, z + 12) < 9 || Math.hypot(x + 31, z + 35) < 6) return true; if (z < -66 && z > -82) return true; return false; };
  // orman kenarı (güney)
  for (let i = 0; i < 160; i++) { const x = rnd(-70, 70), z = rnd(62, 110); if (!occ(x, z)) tree(L, x, z, rng() < 0.6 ? 'pine' : 'oak', rnd(1.0, 1.7)); }
  for (let i = 0; i < 220; i++) { const x = rnd(-105, 115), z = rnd(-150, 110); const dc = Math.hypot(x, z); if (dc < 28 || occ(x, z)) continue; if (dc < 55 && rng() < 0.55) continue; tree(L, x, z, W ? pick(['pine', 'pine', 'oak', 'dead']) : pick(['oak', 'oak', 'pine', 'birch']), rnd(0.9, 1.5)); }
  for (let i = 0; i < 60; i++) { const z = rnd(-60, 60), x = riverX(z) + (rng() < 0.5 ? -1 : 1) * rnd(5.5, 9); if (Math.abs(z) < 4 || occ(x + 50, z + 200)) continue; if (rng() < 0.5) bush(L, x, z, rnd(0.7, 1.2)); else rock(L, x, z, rnd(0.4, 0.9)); }
  for (let i = 0; i < 90; i++) { const x = rnd(-55, 60), z = rnd(-62, 60); if (occ(x, z) && distToPath(x, z, VILLAGE_PATHS) < 2.6) continue; if (rng() < 0.4) bush(L, x, z, rnd(0.5, 1)); else if (rng() < 0.5) flowers(L, x, z, 5); else grassTufts(L, x, z, 6); }
  // meşaleler
  if (lit) { torch(L, 3.2, 2.5, true); torch(L, -12.5, 6, true); torch(L, 8.5, 14.5, true); torch(L, -2.5, -12, false); torch(L, riverX(0) - 6.2, 2.3, false); }
  L.pts.square = V3(0, 0, 4); L.pts.bridge = V3(riverX(0), 0, 0);
  L.finalize();
  return L;
}

// ===== Eros çarşısı (şehir meydanı) =====
function buildEros(o = {}) {
  const L = new Level('eros'); seed(77);
  L.hf = (x, z) => 0; L.th = (x, z) => { const d = Math.max(Math.abs(x) - 26, Math.abs(z) - 30); return d > 0 ? d * 0.12 + fbm(x * 0.05, z * 0.05) * 2 : 0; };
  L.bounds = { x0: -24, x1: 24, z0: -24, z1: 34 };
  terrain(L, -80, -90, 80, 70, 2, (x, z) => { if (Math.abs(x) < 26 && z > -28 && z < 36) { const t = Math.floor(x * 1.2) + Math.floor(z * 1.6); return t % 3 === 0 ? '#9a9286' : t % 3 === 1 ? '#8a8276' : '#a29a8c'; } return '#6a7a48'; });
  const b = L.b;
  // lonca binası (kuzey)
  { const x = 0, z = -21; b.begin(x, 0, z, 0);
    b.box(COL.stoneL, 0, 0, 0, 16, 7, 9); b.box('#d8ccae', 0, 7, 0, 16.6, 4, 9.6);
    for (let i = -4; i <= 4; i++) b.box(COL.beam, i * 2, 7, 4.85, 0.18, 4, 0.08);
    b.add('roof', COL.slate, 0, 11, 0, 11.4, 4.5, 18, 0, Math.PI / 2, 0);
    b.add('roof', '#d8ccae', 0, 10.9, 4.8, 3.5, 2.6, 0.2, 0, 0, 0); b.add('roof', COL.slate, 0, 11, 3.6, 4.2, 3, 3, 0, 0, 0);
    b.box('#3a2618', 0, 0, 4.55, 2.6, 3.6, 0.1); b.add('cyl12', '#3a2618', 0, 3.55, 4.55, 2.6, 0.1, 2.6, Math.PI / 2, 0, 0);
    b.box(COL.stoneD, 0, -0.1, 5.5, 5, 0.25, 2.2); b.box(COL.stoneD, 0, -0.25, 6.6, 6, 0.25, 1.4);
    for (const sx of [-1, 1]) { for (let i = 1; i <= 3; i++) L.gb.box('#ffd890', sx * (1.6 + i * 1.6), 1.6, 4.56, 0.8, 1.6, 0.04); for (let i = 0; i < 4; i++) L.gb.box('#ffd890', sx * (1 + i * 2), 8.1, 4.86, 0.7, 1.2, 0.04); }
    // tabela
    b.box(COL.woodD, 0, 4.2, 4.9, 4.4, 1.0, 0.15); b.box(COL.gold, 0, 4.35, 5.0, 0.7, 0.7, 0.05); b.add('box', '#d8dde3', 0, 4.65, 5.05, 0.08, 0.9, 0.04, 0, 0, 0.7); b.add('box', '#d8dde3', 0, 4.65, 5.05, 0.08, 0.9, 0.04, 0, 0, -0.7);
    b.end(); L.addBox(x, z, 8.3, 4.8);
    banner(L, -4.2, z + 5.3, 0, '#1f3a6a', 6, COL.gold); banner(L, 4.2, z + 5.3, 0, '#1f3a6a', 6, COL.gold);
    noticeBoard(L, 6.5, z + 8, -0.3); L.pts.board = V3(6.0, 0, z + 9.2); L.pts.guildDoor = V3(0, 0, z + 6.5);
  }
  // çevre evler
  const ring = [[-18, -18, 0.4], [-20, -6, Math.PI / 2], [-20, 6, Math.PI / 2], [-20, 18, Math.PI / 2], [18, -18, -0.4], [20, -6, -Math.PI / 2], [20, 6, -Math.PI / 2], [20, 18, -Math.PI / 2], [-12, 31, Math.PI], [12, 31, Math.PI]];
  for (const [x, z, ry] of ring) townHouse(L, x, z, ry, { lit: o.night, awning: rng() < 0.5 ? pick(['#a33a2a', '#2a5a8a', '#3a7a3a']) : null, floors: rng() < 0.3 ? 3 : 2 });
  for (let i = 0; i < 26; i++) { const a = rnd(0, TAU), r = rnd(34, 55); townHouse(L, Math.cos(a) * r, Math.sin(a) * r - 5, -a + Math.PI / 2, { floors: rng() < 0.4 ? 3 : 2 }); }
  fountain(L, 0, 3);
  stall(L, -11, 10, 0.4, '#a33a2a'); stall(L, 11, 12, -0.5, '#2a5a8a'); stall(L, -12, -5, 1.2, '#7a5a2a'); stall(L, 12, -3, -1.3, '#3a6a3a');
  for (const [x, z] of [[-6, 20], [6, 22], [-15, 24], [15, 26]]) { barrel(L, x, z); crate(L, x + 1.2, z + 0.4, 0.8, 0.4); }
  lampPost(L, -7, -8, !!o.night); lampPost(L, 7, -8, !!o.night); lampPost(L, -8, 16, false); lampPost(L, 8, 16, false);
  // kuzeyde saray kuleleri
  palace(L, 0, -95, 6, 1.1);
  // statik kalabalık
  seed(5);
  for (let i = 0; i < 26; i++) { const x = rnd(-17, 17), z = rnd(-10, 28); if (Math.hypot(x, z - 3) < 5 || (Math.abs(x) < 3 && z < 30)) continue; const noble = rng() < 0.25; bakeHumanoid(b, noble ? randomNoble(rng() < 0.5) : randomVillager(rng() < 0.5), pick([null, null, 'crossArms', 'hips', 'behind']), x, 0, z, rnd(0, TAU)); }
  L.pts.south = V3(0, 0, 30); L.pts.fountain = V3(0, 0, 3);
  L.finalize();
  return L;
}

// ===== Saray salonu (tören) =====
function buildHall() {
  const L = new Level('hall'); seed(99); const b = L.b;
  const W = 18, Ln = 48, H = 13;
  L.bounds = { x0: -W / 2 + 0.5, x1: W / 2 - 0.5, z0: -Ln / 2 + 0.5, z1: Ln / 2 - 0.5 };
  L.camBox = { x0: -W / 2 + 0.6, x1: W / 2 - 0.6, y0: 0.4, y1: H - 1, z0: -Ln / 2 + 0.6, z1: Ln / 2 - 0.6 };
  L.interior = true;
  // zemin karoları
  for (let i = 0; i < 9; i++) for (let k = 0; k < 24; k++) b.box((i + k) % 2 ? '#b8ae9c' : '#8a8274', -W / 2 + 1 + i * 2, -0.2, -Ln / 2 + 1 + k * 2, 2, 0.2, 2, 0, 0, 0);
  b.box('#7a1e22', 0, 0.0, 2, 3.2, 0.03, Ln - 8, 0, 0, 0); b.box(COL.gold, 1.65, 0.0, 2, 0.1, 0.035, Ln - 8, 0, 0, 0); b.box(COL.gold, -1.65, 0.0, 2, 0.1, 0.035, Ln - 8, 0, 0, 0);
  // duvarlar
  b.box('#a8a090', -W / 2 - 0.4, -0.2, 0, 0.8, H, Ln); b.box('#a8a090', W / 2 + 0.4, -0.2, 0, 0.8, H, Ln); b.box('#a09888', 0, -0.2, -Ln / 2 - 0.4, W, H, 0.8); b.box('#a09888', 0, -0.2, Ln / 2 + 0.4, W, H, 0.8);
  b.box('#4a3a2a', 0, H - 0.2, 0, W + 2, 0.6, Ln + 2);
  for (let k = -5; k <= 5; k++) b.box(COL.beam, 0, H - 0.9, k * 4.4, W, 0.6, 0.5);
  // kemerli yüksek pencereler (ışık süzmesi)
  for (let k = -4; k <= 4; k++) for (const sx of [-1, 1]) { L.gb.box('#fff0c8', sx * (W / 2 - 0.02), 6.5, k * 5, 0.06, 4.4, 1.6); L.gb.add('cyl12', '#fff0c8', sx * (W / 2 - 0.02), 10.9, k * 5, 1.6, 0.06, 1.6, 0, 0, Math.PI / 2); }
  // sütunlar
  for (let k = -3; k <= 3; k++) for (const sx of [-1, 1]) { const x = sx * 6, z = k * 6 + 2; b.add('cyl8', '#c8beac', x, H / 2, z, 1.1, H, 1.1); b.add('box', '#b0a694', x, 0.2, z, 1.5, 0.4, 1.5); b.add('box', '#b0a694', x, H - 1.3, z, 1.5, 0.5, 1.5); L.addCircle(x, z, 0.7);
    // sancak
    b.add('box', COL.elonth, x - sx * 0.6, 7, z, 0.04, 4.5, 1.2, 0, 0, 0); b.add('box', COL.gold, x - sx * 0.63, 8, z, 0.04, 0.6, 0.6, 0, 0, 0); b.add('wedge', COL.elonth, x - sx * 0.6, 4.75, z, 0.04, 0.6, 1.2, Math.PI, 0, 0); }
  // kürsü ve taş
  const dz = -Ln / 2 + 5;
  b.box('#8a8274', 0, 0, dz, 12, 0.5, 7); b.box('#9a9284', 0, 0.5, dz - 0.6, 9, 0.4, 5); b.box('#7a1e22', 0, 0.5, dz + 2.6, 3.2, 0.02, 1.2);
  for (let i = 0; i < 3; i++) b.box('#8a8274', 0, 0, dz + 3.5 + i * 0.45, 5 - i * 0.4, 0.5 - i * 0.16, 0.45);
  L.hf = (x, z) => { if (Math.abs(x) < 6 && z < dz + 3.5 && z > dz - 3.5) return Math.abs(x) < 4.5 && z < dz + 1.9 ? 0.9 : 0.5; if (Math.abs(x) < 2.5 && z >= dz + 3.5 && z < dz + 4.85) return 0.5 - (z - dz - 3.5) / 1.35 * 0.5; return 0; };
  b.add('cyl8', '#6a6458', 0, 1.3, dz - 0.6, 1.6, 0.9, 1.6); b.add('cyl8', '#7a7468', 0, 1.8, dz - 0.6, 1.2, 0.2, 1.2);
  L.addCircle(0, dz - 0.6, 0.9);
  // rün halkası
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; L.gb.add('box', '#9fd8ff', Math.cos(a) * 2.2, 0.92, dz - 0.6 + Math.sin(a) * 2.2, 0.3, 0.02, 0.1, 0, -a, 0); }
  const stone = new T.Group(); stone.position.set(0, 3.1, dz - 0.6); L.add(stone);
  const sm = new T.MeshLambertMaterial({ color: '#e8f0ff', emissive: '#7aa8d8', emissiveIntensity: 0.6, flatShading: true });
  const sMesh = new T.Mesh(prim('octa'), sm); sMesh.scale.set(1.3, 2.4, 1.3); stone.add(sMesh);
  const sIn = new T.Mesh(prim('octa'), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 })); sIn.scale.set(0.7, 1.4, 0.7); stone.add(sIn);
  const sl = new T.PointLight('#a8d8ff', 8, 16, 1.4); sl.position.copy(stone.position); L.light(sl);
  const halo = new T.Mesh(prim('sph12'), new T.MeshBasicMaterial({ color: '#a8d8ff', transparent: true, opacity: 0.12, depthWrite: false, blending: T.AdditiveBlending, fog: false })); halo.scale.set(3, 4.6, 3); stone.add(halo);
  const pillar = new T.Mesh(new T.CylinderGeometry(1.3, 1.6, 14, 16, 1, true), new T.MeshBasicMaterial({ color: '#a8d8ff', transparent: true, opacity: 0.0, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false })); pillar.position.set(0, 7, dz - 0.6); L.add(pillar);
  L.stone = { group: stone, mat: sm, light: sl, glow: 0, color: new T.Color('#7aa8d8') };
  L.anims.push(dt => { stone.rotation.y += dt * 0.25; stone.position.y = 3.1 + Math.sin(G.t * 1.2) * 0.12; const g = L.stone.glow; sm.emissive.copy(L.stone.color); sm.emissiveIntensity = 0.5 + g * 2.6 + Math.sin(G.t * 2) * 0.1; sl.color.copy(L.stone.color); sl.intensity = 7 + g * 30; halo.material.color.copy(L.stone.color); halo.material.opacity = 0.1 + g * 0.3 + Math.sin(G.t * 3) * 0.02; halo.scale.set(3 + g, 4.6 + g * 1.5, 3 + g); pillar.material.color.copy(L.stone.color); pillar.material.opacity = g * 0.16; });
  // tahtlar
  for (const sx of [-1, 1]) { b.box('#5a2a1e', sx * 4.6, 0.9, dz - 2.6, 1.2, 1.6, 1.0); b.box(COL.gold, sx * 4.6, 2.5, dz - 3.0, 1.2, 1.2, 0.2); }
  // şamdanlar
  for (const [x, z] of [[-4, dz + 1.5], [4, dz + 1.5], [-8, -6], [8, -6], [-8, 10], [8, 10]]) { const y = L.h(x, z); b.add('cyl6', COL.iron, x, y + 1.0, z, 0.15, 2.0, 0.15); b.add('cyl8', COL.iron, x, y + 2.0, z, 0.8, 0.08, 0.8); for (let i = 0; i < 3; i++) L.gb.add('box', '#ffd27a', x + (i - 1) * 0.25, y + 2.2, z, 0.06, 0.25, 0.06); }
  const tl1 = new T.PointLight('#ffc27a', 6, 18, 1.4); tl1.position.set(0, 4, 8); L.light(tl1);
  const tl2 = new T.PointLight('#ffc27a', 5, 18, 1.4); tl2.position.set(0, 4, -6); L.light(tl2);
  // ışık huzmeleri
  const shaftM = new T.MeshBasicMaterial({ color: '#fff2d0', transparent: true, opacity: 0.07, depthWrite: false, blending: T.AdditiveBlending, fog: false });
  for (let k = -4; k <= 4; k += 2) { const s = new T.Mesh(prim('box'), shaftM); s.scale.set(1.6, 14, 1.4); s.position.set(-3.5, 5.5, k * 5); s.rotation.z = -0.75; L.add(s); }
  // kalabalık (statik)
  seed(17);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { const x = sx * (2.6 + i * 0.95 + rnd(-0.1, 0.1)), z = -8 + row * 1.3; bakeHumanoid(b, randomNoble(rng() < 0.5), pick(['behind', null, 'crossArms']), x, 0, z, Math.PI + sx * 0.25); }
  for (let row = 0; row < 4; row++) for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { if (row === 0 && i < 2) continue; const x = sx * (2.6 + i * 0.95 + rnd(-0.15, 0.15)), z = 6 + row * 1.3 + rnd(-0.2, 0.2); bakeHumanoid(b, randomVillager(rng() < 0.5), pick([null, 'behind', 'pray']), x, 0, z, Math.PI + sx * 0.2); }
  // muhafızlar
  for (const [x, z] of [[-7.6, dz + 2], [7.6, dz + 2], [-7.6, 20], [7.6, 20]]) bakeHumanoid(b, { shirt: '#5a6a7a', pants: '#3a3a40', hair: '#2a1d14', extras: [{ t: 'armor', c: '#a8b0b8' }, { t: 'cape', c: COL.elonth }], boots: true, shoes: '#2a2a2a' }, 'behind', x, 0, z, x < 0 ? Math.PI / 2 : -Math.PI / 2);
  L.addBox(-5.5, -6.7, 3.5, 1.9); L.addBox(5.5, -6.7, 3.5, 1.9); L.addBox(-5.5, 8.0, 3.5, 2.6); L.addBox(5.5, 8.0, 3.5, 2.6);
  L.pts = Object.assign(L.pts, { dais: V3(0, 0.9, dz + 1.2), stone: V3(0, 0, dz - 0.6), front: V3(0, 0, dz + 6), entrance: V3(0, 0, Ln / 2 - 3), lineL: V3(-1.1, 0, -1), lineR: V3(1.1, 0, -1), priest: V3(-1.6, 0.9, dz - 0.4) });
  L.finalize();
  return L;
}
