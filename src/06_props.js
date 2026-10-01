// ---------- Seviye sınıfı, çarpışma ve dekor parçaları ----------
const COL = {
  stone: '#8a8478', stoneD: '#6e695f', stoneL: '#a8a294', wall: '#d6c6a2', wall2: '#cbb58c', wall3: '#c2ae8a', beam: '#4e3624', beamL: '#6a4a30',
  thatch: '#b08b4c', thatch2: '#9c7a40', tile: '#8a4636', tile2: '#6e3a30', slate: '#4b5262', wood: '#7a5638', woodD: '#5a3e28', woodL: '#9a7450',
  grass: '#6b8c40', grass2: '#5c7d36', grassD: '#4d6a2e', dirt: '#9a7c56', dirtD: '#7e6446', leaf: '#4f7a34', leaf2: '#5e8a3a', leaf3: '#3f6a2c', pine: '#2f5a36', pine2: '#3a6a40',
  trunk: '#5e4430', wheat: '#c9a650', wheat2: '#b8933e', hay: '#c8a85a', rock: '#8c877c', rock2: '#77736a', snow: '#eef2f6', snow2: '#dfe5ec', iron: '#4a4c50', gold: '#c9a85a', elonth: '#2f5a3a', elonth2: '#1f4a2c', cloth: '#a33a2a',
};
class Level {
  constructor(id) {
    this.id = id; this.group = new T.Group(); this.b = new Builder(40); this.gb = new Builder(0); this.gb.jit = 0;
    this.boxes = []; this.circles = []; this.anims = []; this.pts = {}; this.hf = null; this.bounds = null; this.camBox = null;
    this.lights = []; this.winter = false; this.dyn = []; this.interact = [];
  }
  h(x, z) { return this.hf ? this.hf(x, z) : 0; }
  addBox(x, z, hw, hd, ry = 0) { this.boxes.push({ x, z, hw, hd, c: Math.cos(ry), s: Math.sin(ry) }); }
  addCircle(x, z, r) { this.circles.push({ x, z, r }); }
  add(obj) { this.group.add(obj); return obj; }
  light(l) { this.group.add(l); this.lights.push(l); return l; }
  finalize() {
    if (this.b.parts.length) this.group.add(this.b.build(MAT.static));
    if (this.gb.parts.length) this.group.add(this.gb.build(MAT.glow, { cast: false, receive: false }));
  }
  resolve(p, r) {
    for (const c of this.circles) {
      const dx = p.x - c.x, dz = p.z - c.z, m = c.r + r; if (Math.abs(dx) > m || Math.abs(dz) > m) continue;
      const d = Math.hypot(dx, dz); if (d < m && d > 1e-5) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; }
    }
    for (const b of this.boxes) {
      const dx = p.x - b.x, dz = p.z - b.z;
      if (Math.abs(dx) > b.hw + b.hd + r + 0.5 && Math.abs(dz) > b.hw + b.hd + r + 0.5) continue;
      let lx = dx * b.c - dz * b.s, lz = dx * b.s + dz * b.c;
      const qx = clamp(lx, -b.hw, b.hw), qz = clamp(lz, -b.hd, b.hd);
      const ex = lx - qx, ez = lz - qz, d2 = ex * ex + ez * ez;
      if (d2 === 0) { // içeride
        const px = b.hw - Math.abs(lx), pz = b.hd - Math.abs(lz);
        if (px < pz) lx = Math.sign(lx || 1) * (b.hw + r); else lz = Math.sign(lz || 1) * (b.hd + r);
      } else if (d2 < r * r) { const d = Math.sqrt(d2); lx = qx + ex / d * r; lz = qz + ez / d * r; } else continue;
      p.x = b.x + lx * b.c + lz * b.s; p.z = b.z - lx * b.s + lz * b.c;
    }
    if (this.bounds) { const B = this.bounds; p.x = clamp(p.x, B.x0 + r, B.x1 - r); p.z = clamp(p.z, B.z0 + r, B.z1 - r); }
    if (this.arena) { const A = this.arena, dx = p.x - A.x, dz = p.z - A.z, d = Math.hypot(dx, dz); if (d > A.r - r) { p.x = A.x + dx / d * (A.r - r); p.z = A.z + dz / d * (A.r - r); } }
    if (this.extraResolve) this.extraResolve(p, r);
  }
  update(dt) { for (const a of this.anims) a(dt); }
  dispose() {
    this.group.traverse(o => { if (o.isMesh || o.isPoints || o.isLine) { if (!Object.values(PRIM).includes(o.geometry)) o.geometry.dispose(); } });
  }
}

// Arazi: düz gölgeli üçgen ızgara, köşe renkleri fonksiyondan
function terrain(L, x0, z0, x1, z1, step, colorFn) {
  const nx = Math.ceil((x1 - x0) / step), nz = Math.ceil((z1 - z0) / step);
  const N = nx * nz * 6; const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), nor = new Float32Array(N * 3);
  let o = 0; const c = new T.Color(); const a = new T.Vector3(), b = new T.Vector3(), cc = new T.Vector3(), n = new T.Vector3(), e1 = new T.Vector3(), e2 = new T.Vector3();
  const H = (x, z) => (L.th ? L.th(x, z) : L.h(x, z));
  const tri = (p1, p2, p3) => {
    a.set(...p1); b.set(...p2); cc.set(...p3); e1.subVectors(b, a); e2.subVectors(cc, a); n.crossVectors(e1, e2).normalize();
    const mx = (p1[0] + p2[0] + p3[0]) / 3, mz = (p1[2] + p2[2] + p3[2]) / 3, my = (p1[1] + p2[1] + p3[1]) / 3;
    c.set(colorFn(mx, mz, my, n.y)); const j = 1 + (hash2(mx * 1.3, mz * 1.7) - 0.5) * 0.08; c.multiplyScalar(j);
    for (const p of [p1, p2, p3]) { pos[o * 3] = p[0]; pos[o * 3 + 1] = p[1]; pos[o * 3 + 2] = p[2]; nor[o * 3] = n.x; nor[o * 3 + 1] = n.y; nor[o * 3 + 2] = n.z; col[o * 3] = c.r; col[o * 3 + 1] = c.g; col[o * 3 + 2] = c.b; o++; }
  };
  for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) {
    const xa = x0 + i * step, xb = xa + step, za = z0 + k * step, zb = za + step;
    const jx = (x, z) => x + (hash2(x * 0.7, z * 0.3) - 0.5) * step * 0.3, jz = (x, z) => z + (hash2(x * 0.2, z * 0.9) - 0.5) * step * 0.3;
    const P = (x, z) => { const X = jx(x, z), Z = jz(x, z); return [X, H(X, Z), Z]; };
    const A = P(xa, za), B = P(xb, za), C = P(xa, zb), D = P(xb, zb);
    if ((i + k) % 2) { tri(A, C, B); tri(B, C, D); } else { tri(A, C, D); tri(A, D, B); }
  }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('normal', new T.BufferAttribute(nor, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
  g.computeBoundingSphere();
  const m = new T.Mesh(g, MAT.static); m.receiveShadow = true; m.matrixAutoUpdate = false; L.group.add(m); return m;
}

// --- Yapılar ---
function peasantHouse(L, x, z, ry, o = {}) {
  const b = L.b, w = o.w || rnd(4.2, 5.6), d = o.d || rnd(3.6, 4.4), h = o.h || rnd(2.3, 2.7), y = o.y !== undefined ? o.y : L.h(x, z) - 0.05;
  const wall = o.wall || pick([COL.wall, COL.wall2, COL.wall3]), roof = o.roof || pick([COL.thatch, COL.thatch2, '#a88a52']);
  b.begin(x, y, z, ry);
  b.box(COL.stone, 0, -0.4, 0, w + 0.25, 0.55, d + 0.25);
  b.box(wall, 0, 0.1, 0, w, h, d);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.beam, sx * w / 2, 0.1, sz * d / 2, 0.2, h, 0.2);
  b.box(COL.beam, 0, h * 0.55, d / 2 + 0.02, w, 0.12, 0.06); b.box(COL.beam, 0, h * 0.55, -d / 2 - 0.02, w, 0.12, 0.06);
  b.box(COL.beam, 0, h + 0.05, 0, w + 0.15, 0.16, d + 0.15);
  const rh = o.rh || 1.7, snowy = L.winter;
  b.add('roof', roof, 0, h + 0.15, 0, d + 1.1, rh, w + 0.9, 0, Math.PI / 2, 0);
  if (snowy) b.add('roof', COL.snow, 0, h + 0.36, 0, d + 0.9, rh * 0.9, w + 0.95, 0, Math.PI / 2, 0, 0.02);
  // gable uçları
  for (const sx of [-1, 1]) b.add('roof', wall, sx * (w / 2 - 0.02), h + 0.12, 0, d - 0.1, rh * 0.85, 0.06, 0, Math.PI / 2, 0);
  const doorX = o.doorX !== undefined ? o.doorX : -w * 0.2;
  b.box(COL.woodD, doorX, 0.1, d / 2 + 0.03, 0.95, 1.85, 0.08);
  b.box(COL.beam, doorX, 1.92, d / 2 + 0.05, 1.15, 0.14, 0.1);
  b.box(COL.stone, doorX, -0.15, d / 2 + 0.35, 1.1, 0.25, 0.6);
  const lit = o.lit;
  for (const wx of o.windows || [w * 0.25]) {
    if (lit) L.gb.box('#ffc46b', wx, 1.0, d / 2 + 0.03, 0.62, 0.6, 0.04); else b.box('#2a2420', wx, 1.0, d / 2 + 0.03, 0.62, 0.6, 0.04);
    b.box(COL.beamL, wx - 0.48, 0.95, d / 2 + 0.08, 0.32, 0.7, 0.05, 0, 0, 0); b.box(COL.beamL, wx + 0.48, 0.95, d / 2 + 0.08, 0.32, 0.7, 0.05);
    b.box(COL.beam, wx, 0.95, d / 2 + 0.06, 0.75, 0.06, 0.06);
  }
  if (lit) L.gb.box('#ffb860', -w * 0.25, 1.0, -d / 2 - 0.03, 0.55, 0.55, 0.04);
  if (o.chimney !== false) { b.box(COL.stone, w * 0.3, h * 0.6, -d * 0.18, 0.55, h * 0.4 + rh + 0.4, 0.55); if (snowy) b.box(COL.snow, w * 0.3, h + rh + 0.2, -d * 0.18, 0.6, 0.1, 0.6, 0, 0, 0); }
  // yan duvar dekoru
  if (rng() < 0.6) { b.box(COL.woodL, w / 2 + 0.25, -0.15, d * 0.2, 0.4, 0.8, 1.2); b.box(COL.woodD, w / 2 + 0.25, 0.65, d * 0.2, 0.42, 0.05, 1.22); }
  b.end();
  L.addBox(x, z, (w + 0.3) / 2, (d + 0.3) / 2, ry);
  const c = Math.cos(ry), s = Math.sin(ry);
  return { door: V3(x + doorX * c + (d / 2 + 0.9) * s, 0, z - doorX * s + (d / 2 + 0.9) * c), w, d, x, z, ry };
}
function townHouse(L, x, z, ry, o = {}) {
  const b = L.b, w = o.w || rnd(5, 7), d = o.d || rnd(5, 6), h1 = 3, h2 = o.floors === 3 ? 5.6 : 2.8, y = L.h(x, z) - 0.05;
  const plaster = o.wall || pick(['#e2d6bc', '#d8c8a6', '#e6dcc6', '#cfc0a0', '#d9cbb0']), roof = o.roof || pick([COL.tile, COL.tile2, COL.slate, '#7a4232']);
  b.begin(x, y, z, ry);
  b.box(pick([COL.stone, COL.stoneL, '#968f80']), 0, -0.3, 0, w, h1 + 0.3, d);
  b.box(plaster, 0, h1, 0, w + 0.4, h2, d + 0.4);
  // ahşap çatkı
  const fr = COL.beam;
  b.box(fr, 0, h1, d / 2 + 0.22, w + 0.45, 0.2, 0.08); b.box(fr, 0, h1 + h2 - 0.15, d / 2 + 0.22, w + 0.45, 0.18, 0.08);
  const n = Math.round(w / 1.4);
  for (let i = 0; i <= n; i++) { const px = -w / 2 - 0.2 + i * (w + 0.4) / n; b.box(fr, px, h1, d / 2 + 0.23, 0.14, h2, 0.07); }
  for (let i = 0; i < n; i++) { const px = -w / 2 - 0.2 + (i + 0.5) * (w + 0.4) / n; b.add('box', fr, px, h1 + h2 * 0.5, d / 2 + 0.24, 0.1, h2 * 0.75, 0.05, 0, 0, (i % 2 ? 1 : -1) * 0.55); }
  for (let i = 0; i < n; i++) { const px = -w / 2 - 0.2 + (i + 0.5) * (w + 0.4) / n; if (o.lit) L.gb.box('#ffc46b', px, h1 + h2 * 0.35, d / 2 + 0.26, 0.55, 0.7, 0.03); else b.box('#3a3a40', px, h1 + h2 * 0.35, d / 2 + 0.26, 0.55, 0.7, 0.03); }
  const rh = o.rh || 3;
  b.add('roof', roof, 0, h1 + h2, 0, d + 1.4, rh, w + 0.8, 0, Math.PI / 2, 0);
  for (const sx of [-1, 1]) b.add('roof', plaster, sx * (w / 2 + 0.15), h1 + h2 - 0.02, 0, d + 0.3, rh * 0.92, 0.1, 0, Math.PI / 2, 0);
  if (L.winter) b.add('roof', COL.snow, 0, h1 + h2 + 0.22, 0, d + 1.2, rh * 0.92, w + 0.85, 0, Math.PI / 2, 0, 0.02);
  // kapı ve vitrin
  b.box(COL.woodD, -w * 0.25, -0.05, d / 2 + 0.03, 1.1, 2.2, 0.1); b.add('cyl8', COL.stoneD, -w * 0.25, 2.15, d / 2 + 0.04, 1.1, 0.12, 0.1, Math.PI / 2, 0, 0);
  b.box('#3a3a40', w * 0.22, 0.8, d / 2 + 0.02, 1.4, 1.1, 0.05); b.box(COL.beam, w * 0.22, 0.75, d / 2 + 0.06, 1.6, 0.08, 0.2);
  if (o.awning) { for (let i = 0; i < 5; i++) b.add('box', i % 2 ? '#e8dcc0' : o.awning, w * 0.22 - 0.64 + i * 0.32, 2.2, d / 2 + 0.55, 0.32, 0.05, 1.1, -0.35, 0, 0); }
  if (o.chimney !== false) b.box(COL.stoneD, w * 0.3, h1 + h2, -d * 0.2, 0.6, rh + 0.6, 0.6);
  b.end();
  L.addBox(x, z, w / 2 + 0.25, d / 2 + 0.25, ry);
}
function tree(L, x, z, type = 'oak', s = 1) {
  const b = L.b, y = L.h(x, z) - 0.1;
  b.begin(x, y, z, rnd(0, TAU), s);
  if (type === 'oak') {
    b.add('cyl6', COL.trunk, 0, 1.2, 0, 0.45, 2.4, 0.45, 0, 0, 0.04);
    b.add('box', COL.trunk, 0.35, 2.0, 0, 0.18, 1.1, 0.18, 0, 0, -0.7);
    if (L.winter) { b.add('box', COL.trunk, -0.3, 2.4, 0.1, 0.14, 1.2, 0.14, 0.3, 0, 0.6); b.add('box', COL.trunk, 0.1, 2.7, -0.3, 0.12, 1.0, 0.12, -0.5, 0, 0); b.add('ico0', COL.snow2, 0, 3.0, 0, 1.4, 0.4, 1.4); }
    else {
      const cs = [COL.leaf, COL.leaf2, COL.leaf3];
      b.add('ico0', pick(cs), 0, 3.1, 0, 2.8, 2.3, 2.8, rnd(0, 1), rnd(0, 1), 0, 0.1);
      b.add('ico0', pick(cs), 0.9, 2.7, 0.4, 1.9, 1.6, 1.9, rnd(0, 1), 0, 0, 0.1);
      b.add('ico0', pick(cs), -0.8, 2.8, -0.5, 2.0, 1.7, 2.0, 0, rnd(0, 1), 0, 0.1);
      b.add('ico0', pick(cs), 0.1, 3.9, -0.2, 1.7, 1.4, 1.7, 0, 0, 0, 0.1);
    }
  } else if (type === 'pine') {
    b.add('cyl5', COL.trunk, 0, 0.8, 0, 0.35, 1.6, 0.35);
    const pc = [COL.pine, COL.pine2];
    for (let i = 0; i < 3; i++) { b.add('cone6', pick(pc), 0, 1.5 + i * 1.15, 0, 2.6 - i * 0.65, 2.0, 2.6 - i * 0.65, 0, rnd(0, 1), 0, 0.08); if (L.winter) b.add('cone6', COL.snow, 0, 1.75 + i * 1.15, 0, (2.6 - i * 0.65) * 0.75, 1.5, (2.6 - i * 0.65) * 0.75, 0, rnd(0, 1), 0, 0.02); }
  } else if (type === 'birch') {
    b.add('cyl5', '#d8d4c8', 0, 1.6, 0, 0.28, 3.2, 0.28);
    if (!L.winter) { b.add('ico0', '#7a9a44', 0, 3.4, 0, 1.6, 2.2, 1.6, 0, 0, 0, 0.1); b.add('ico0', '#8aa84c', 0.4, 2.8, 0.2, 1.1, 1.4, 1.1, 0, 0, 0, 0.1); }
  } else if (type === 'dead') {
    b.add('cyl5', '#4a3a2c', 0, 1.3, 0, 0.35, 2.6, 0.35); b.add('box', '#4a3a2c', 0.4, 2.2, 0, 0.12, 1.4, 0.12, 0, 0, -0.8); b.add('box', '#4a3a2c', -0.3, 2.5, 0.2, 0.1, 1.1, 0.1, 0.4, 0, 0.7);
  }
  b.end();
  L.addCircle(x, z, 0.38 * s);
}
function bush(L, x, z, s = 1) { const y = L.h(x, z); L.b.add('ico0', L.winter ? COL.snow2 : pick([COL.leaf, COL.leaf2, '#5a7a36']), x, y + 0.35 * s, z, 1.3 * s, 0.9 * s, 1.2 * s, rnd(0, 2), rnd(0, 2), 0, 0.1); }
function rock(L, x, z, s = 1, col) { const y = L.h(x, z); L.b.add('dode', col || pick([COL.rock, COL.rock2]), x, y + 0.2 * s, z, 1.2 * s, 0.75 * s, 1.0 * s, rnd(0, 3), rnd(0, 3), 0, 0.06); if (s > 0.7) L.addCircle(x, z, 0.55 * s); }
function flowers(L, x, z, n = 6) { if (L.winter) return; for (let i = 0; i < n; i++) { const fx = x + rnd(-0.8, 0.8), fz = z + rnd(-0.8, 0.8), y = L.h(fx, fz); L.b.add('box', '#4a7a30', fx, y + 0.12, fz, 0.03, 0.24, 0.03, 0, 0, 0, 0); L.b.add('box', pick(['#e8d34a', '#e86a5a', '#f0f0e8', '#b05ad0', '#e89a3a']), fx, y + 0.26, fz, 0.09, 0.07, 0.09, 0, rnd(0, 1), 0, 0); } }
function grassTufts(L, x, z, n = 5) { if (L.winter) return; for (let i = 0; i < n; i++) { const fx = x + rnd(-1, 1), fz = z + rnd(-1, 1), y = L.h(fx, fz); L.b.add('cone4', pick([COL.grass, COL.grass2, '#7a9a48']), fx, y + 0.15, fz, 0.2, 0.35, 0.2, rnd(-0.3, 0.3), rnd(0, 2), rnd(-0.3, 0.3), 0.1); } }
function fence(L, x1, z1, x2, z2, o = {}) {
  const b = L.b, dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz), ry = Math.atan2(dx, dz), n = Math.max(1, Math.round(len / 2));
  for (let i = 0; i <= n; i++) { const t = i / n, px = x1 + dx * t, pz = z1 + dz * t; b.add('boxb', COL.woodD, px, L.h(px, pz) - 0.1, pz, 0.14, 1.15, 0.14, 0, ry, 0); if (L.winter) b.add('box', COL.snow, px, L.h(px, pz) + 1.08, pz, 0.18, 0.06, 0.18, 0, ry, 0, 0); }
  const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, my = L.h(mx, mz);
  b.add('box', COL.wood, mx, my + 0.45, mz, 0.07, 0.1, len, 0, ry, 0); b.add('box', COL.wood, mx, my + 0.85, mz, 0.07, 0.1, len, 0, ry, 0);
  if (o.collide !== false) L.addBox(mx, mz, 0.12, len / 2, ry);
}
function well(L, x, z) {
  const b = L.b, y = L.h(x, z);
  b.add('cyl12', COL.stone, x, y + 0.4, z, 1.8, 0.8, 1.8); b.add('cyl12', '#1a2228', x, y + 0.81, z, 1.4, 0.02, 1.4, 0, 0, 0, 0);
  b.add('box', COL.woodD, x - 0.8, y + 1.3, z, 0.14, 1.8, 0.14); b.add('box', COL.woodD, x + 0.8, y + 1.3, z, 0.14, 1.8, 0.14);
  b.add('cyl6', COL.wood, x, y + 1.6, z, 0.16, 1.6, 0.16, 0, 0, Math.PI / 2);
  b.add('roof', COL.thatch2, x, y + 2.15, z, 2.2, 0.8, 1.4, 0, Math.PI / 2, 0); if (L.winter) b.add('roof', COL.snow, x, y + 2.25, z, 2.0, 0.75, 1.42, 0, Math.PI / 2, 0, 0);
  b.add('cyl8', COL.woodD, x + 0.3, y + 1.1, z, 0.3, 0.32, 0.3);
  L.addCircle(x, z, 1.0);
}
function barrel(L, x, z, s = 1) { const b = L.b, y = L.h(x, z); b.add('cyl8', COL.wood, x, y + 0.45 * s, z, 0.7 * s, 0.9 * s, 0.7 * s); b.add('cyl8', COL.iron, x, y + 0.2 * s, z, 0.72 * s, 0.06, 0.72 * s, 0, 0, 0, 0); b.add('cyl8', COL.iron, x, y + 0.72 * s, z, 0.72 * s, 0.06, 0.72 * s, 0, 0, 0, 0); if (L.winter) b.add('cyl8', COL.snow, x, y + 0.92 * s, z, 0.66 * s, 0.05, 0.66 * s, 0, 0, 0, 0); L.addCircle(x, z, 0.38 * s); }
function crate(L, x, z, s = 1, ry = 0, y0) { const b = L.b, y = y0 !== undefined ? y0 : L.h(x, z); b.add('boxb', COL.woodL, x, y, z, 0.8 * s, 0.8 * s, 0.8 * s, 0, ry, 0); b.add('boxb', COL.woodD, x, y + 0.35 * s, z, 0.82 * s, 0.1 * s, 0.82 * s, 0, ry, 0); if (y0 === undefined) L.addBox(x, z, 0.42 * s, 0.42 * s, ry); }
function haystack(L, x, z, s = 1) { const b = L.b, y = L.h(x, z); b.add('cyl8', COL.hay, x, y + 0.6 * s, z, 2.0 * s, 1.2 * s, 2.0 * s, 0, rnd(0, 1), 0); b.add('cone8', L.winter ? COL.snow : COL.hay, x, y + 1.6 * s, z, 2.0 * s, 0.9 * s, 2.0 * s, 0, rnd(0, 1), 0); L.addCircle(x, z, 0.95 * s); }
function cart(L, x, z, ry) {
  const b = L.b; b.begin(x, L.h(x, z), z, ry);
  b.box(COL.wood, 0, 0.55, 0, 1.4, 0.12, 2.4); b.box(COL.woodD, 0.68, 0.65, 0, 0.06, 0.35, 2.4); b.box(COL.woodD, -0.68, 0.65, 0, 0.06, 0.35, 2.4); b.box(COL.woodD, 0, 0.65, -1.18, 1.4, 0.35, 0.06);
  for (const sx of [-1, 1]) { b.add('cyl12', COL.woodD, sx * 0.8, 0.45, 0.3, 0.9, 0.08, 0.9, 0, 0, Math.PI / 2); b.add('cyl6', COL.iron, sx * 0.85, 0.45, 0.3, 0.15, 0.1, 0.15, 0, 0, Math.PI / 2); }
  b.add('box', COL.woodD, 0.25, 0.5, 1.9, 0.08, 0.08, 1.5); b.add('box', COL.woodD, -0.25, 0.5, 1.9, 0.08, 0.08, 1.5);
  b.add('box', COL.hay, 0, 0.8, -0.3, 1.2, 0.4, 1.6);
  b.end(); L.addBox(x, z, 0.8, 1.3, ry);
}
function bench(L, x, z, ry) { const b = L.b; b.begin(x, L.h(x, z), z, ry); b.box(COL.wood, 0, 0.42, 0, 1.8, 0.08, 0.45); b.box(COL.woodD, -0.7, 0, 0, 0.1, 0.42, 0.4); b.box(COL.woodD, 0.7, 0, 0, 0.1, 0.42, 0.4); b.end(); L.addBox(x, z, 0.9, 0.25, ry); }
function torch(L, x, z, light = false, h = 2.2) {
  const y = L.h(x, z); L.b.add('box', COL.woodD, x, y + h / 2, z, 0.12, h, 0.12); L.b.add('box', COL.iron, x, y + h, z, 0.25, 0.15, 0.25);
  L.gb.add('ico0', '#ffb347', x, y + h + 0.2, z, 0.28, 0.4, 0.28, 0, 0, 0, 0);
  if (light) { const l = new T.PointLight('#ffa040', 6, 9, 1.6); l.position.set(x, y + h + 0.5, z); L.light(l); L.anims.push(() => { l.intensity = 5 + Math.sin(G.t * 13 + x) * 0.8 + Math.sin(G.t * 7.3) * 0.6; }); }
}
function lampPost(L, x, z, light = false) {
  const y = L.h(x, z); L.b.add('box', COL.iron, x, y + 1.6, z, 0.12, 3.2, 0.12); L.b.add('box', COL.iron, x + 0.3, y + 3.1, z, 0.7, 0.08, 0.08);
  L.b.add('box', COL.iron, x + 0.6, y + 2.85, z, 0.3, 0.06, 0.3); L.gb.add('box', '#ffd080', x + 0.6, y + 2.65, z, 0.22, 0.35, 0.22);
  if (light) { const l = new T.PointLight('#ffc070', 5, 12, 1.5); l.position.set(x + 0.6, y + 2.4, z); L.light(l); }
  L.addCircle(x, z, 0.15);
}
function banner(L, x, z, ry, col, h = 4, emblem = COL.gold) {
  const b = L.b, y = L.h(x, z); b.begin(x, y, z, ry);
  b.box(COL.woodD, 0, 0, 0, 0.12, h, 0.12); b.box(COL.gold, 0, h, 0, 0.16, 0.16, 0.16);
  b.box(COL.woodD, 0, h - 0.25, 0.35, 0.06, 0.06, 0.8);
  b.add('box', col, 0, h - 1.2, 0.4, 0.04, 1.8, 0.7); b.add('box', emblem, 0, h - 1.0, 0.43, 0.045, 0.4, 0.3);
  b.add('wedge', col, 0, h - 2.6, 0.4, 0.04, 0.5, 0.7, Math.PI, 0, 0);
  b.end();
}
function stall(L, x, z, ry, cloth = '#a33a2a') {
  const b = L.b; b.begin(x, L.h(x, z), z, ry);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.woodD, sx * 1.2, 0, sz * 0.8, 0.12, 2.4, 0.12);
  b.box(COL.wood, 0, 0.85, 0.5, 2.5, 0.12, 0.8); b.box(COL.woodD, 0, 0, 0.85, 2.4, 0.85, 0.06);
  for (let i = 0; i < 6; i++) b.add('box', i % 2 ? '#efe6d0' : cloth, -1.25 + 0.21 + i * 0.42, 2.45, 0, 0.42, 0.06, 2.0, 0.18, 0, 0);
  const goods = ['#c84a3a', '#d8a83a', '#7aa83a', '#e8d8a8', '#a85a2a'];
  for (let i = 0; i < 8; i++) b.add(pick(['sph8', 'box', 'cyl8']), pick(goods), rnd(-1.0, 1.0), 1.02, rnd(0.25, 0.75), 0.22, 0.18, 0.22);
  b.end(); L.addBox(x, z, 1.35, 0.95, ry);
}
function wallSeg(L, x1, z1, x2, z2, h = 6, col = COL.stone, thick = 1.6) {
  const b = L.b, dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz), ry = Math.atan2(dx, dz), mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, y = Math.min(L.h(x1, z1), L.h(x2, z2), L.h(mx, mz)) - 0.5;
  b.add('boxb', col, mx, y, mz, thick, h + 0.5, len, 0, ry, 0);
  const n = Math.floor(len / 1.2);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; if (i % 2) continue; b.add('boxb', col, x1 + dx * t, y + h + 0.5, z1 + dz * t, thick + 0.1, 0.6, len / n * 0.9, 0, ry, 0); }
  if (L.winter) b.add('boxb', COL.snow, mx, y + h + 0.5, mz, thick + 0.05, 0.08, len, 0, ry, 0, 0);
}
function tower(L, x, z, r = 2.2, h = 10, roof = COL.slate, base) {
  const b = L.b, y = base !== undefined ? base : L.h(x, z) - 0.5;
  b.add('cyl8', COL.stone, x, y + h / 2, z, r * 2, h, r * 2); b.add('cyl8', COL.stoneD, x, y + h + 0.2, z, r * 2.25, 0.5, r * 2.25);
  b.add('cone8', roof, x, y + h + 0.45 + r * 1.3, z, r * 2.5, r * 2.6, r * 2.5); if (L.winter) b.add('cone8', COL.snow, x, y + h + 0.3 + r * 1.0, z, r * 2.35, r * 1.6, r * 2.35, 0, 0, 0, 0);
  for (let i = 0; i < 3; i++) { const a = i * 2.1; b.add('box', '#2a2a30', x + Math.sin(a) * r * 0.98, y + h * 0.6, z + Math.cos(a) * r * 0.98, 0.3, 0.7, 0.3, 0, a, 0); }
  b.add('box', COL.woodD, x, y + h + r * 2.7, z, 0.06, 1.2, 0.06); b.add('box', COL.elonth, x, y + h + r * 2.7 + 0.3, z + 0.35, 0.03, 0.45, 0.7);
}
function palace(L, x, z, y, s = 1) {
  const b = L.b; b.begin(x, y, z, 0, s);
  b.box(COL.stoneL, 0, 0, 0, 34, 12, 20); b.box(COL.stone, 0, 12, 0, 20, 8, 14);
  b.add('roof', COL.slate, 0, 12, 0, 22, 6, 36, 0, Math.PI / 2, 0); b.add('roof', COL.slate, 0, 20, 0, 16, 6, 22, 0, Math.PI / 2, 0);
  b.end();
  const tw = (dx, dz, r, h) => tower(L, x + dx * s, z + dz * s, r * s, h * s, COL.slate, y);
  tw(-17, -10, 3, 18); tw(17, -10, 3, 18); tw(-17, 10, 3, 18); tw(17, 10, 3, 18); tw(0, 0, 4, 34); tw(-8, 8, 2.2, 26); tw(9, 7, 2.2, 24);
  // pencereler ışıklı
  for (let i = -3; i <= 3; i++) L.gb.box('#ffd890', x + i * 4 * s, y + 6 * s, z + 10.1 * s, 0.9 * s, 2.2 * s, 0.1);
  for (let i = -2; i <= 2; i++) L.gb.box('#ffd890', x + i * 3.5 * s, y + 15 * s, z + 7.1 * s, 0.8 * s, 1.8 * s, 0.1);
}
function noticeBoard(L, x, z, ry) {
  const b = L.b; b.begin(x, L.h(x, z), z, ry);
  b.box(COL.woodD, -1.1, 0, 0, 0.15, 2.4, 0.15); b.box(COL.woodD, 1.1, 0, 0, 0.15, 2.4, 0.15);
  b.box(COL.wood, 0, 0.9, 0, 2.4, 1.3, 0.1); b.add('roof', COL.woodD, 0, 2.3, 0, 2.7, 0.45, 0.6, 0, 0, 0);
  const papers = ['#efe6cc', '#e8dcc0', '#f4ecd8', '#ddd0b0'];
  for (let i = 0; i < 9; i++) b.add('box', pick(papers), rnd(-0.9, 0.9), rnd(1.15, 2.0), 0.06, rnd(0.25, 0.4), rnd(0.3, 0.45), 0.01, 0, 0, rnd(-0.15, 0.15), 0);
  b.end(); L.addBox(x, z, 1.25, 0.2, ry);
}
function fountain(L, x, z) {
  const b = L.b, y = L.h(x, z);
  b.add('cyl8', COL.stoneL, x, y + 0.35, z, 6, 0.7, 6); b.add('cyl8', '#2d5a66', x, y + 0.66, z, 5.4, 0.05, 5.4, 0, 0, 0, 0);
  b.add('cyl8', COL.stone, x, y + 1.3, z, 0.8, 2.2, 0.8); b.add('cyl8', COL.stoneL, x, y + 2.4, z, 2.2, 0.25, 2.2); b.add('cyl8', COL.stone, x, y + 3.0, z, 0.4, 1.1, 0.4); b.add('octa', COL.gold, x, y + 3.7, z, 0.5, 0.7, 0.5);
  const w = new T.Mesh(new T.CylinderGeometry(2.6, 2.6, 0.05, 16), MAT.water); w.position.set(x, y + 0.68, z); L.add(w);
  L.addCircle(x, z, 3.1);
}
function dummyProp(L, x, z) {
  const g = new T.Group(); const y = L.h(x, z);
  const m = (t, c, px, py, pz, sx, sy, sz, rz = 0) => { const k = new T.Mesh(prim(t), lam(c)); k.position.set(px, py, pz); k.scale.set(sx, sy, sz); k.rotation.z = rz; k.castShadow = true; g.add(k); return k; };
  const top = new T.Group(); g.add(top);
  m('cyl6', COL.woodD, 0, 0.5, 0, 0.16, 1.0, 0.16);
  const tm = (t, c, px, py, pz, sx, sy, sz, rz = 0) => { const k = m(t, c, px, py, pz, sx, sy, sz, rz); g.remove(k); top.add(k); return k; };
  tm('cyl8', '#c8b080', 0, 1.35, 0, 0.55, 0.9, 0.5); tm('box', COL.woodD, 0, 1.55, 0, 1.3, 0.1, 0.1); tm('sph8', '#c8b080', 0, 2.0, 0, 0.42, 0.42, 0.42);
  tm('box', '#8a3a2a', 0, 1.25, 0.26, 0.3, 0.3, 0.02);
  g.position.set(x, y, z); L.add(g); L.addCircle(x, z, 0.35);
  return { group: g, top, wobble: 0, t: 0 };
}
// Pencere manzarası (CanvasTexture)
function windowView(night) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, 256);
  if (night) { sky.addColorStop(0, '#0a1024'); sky.addColorStop(1, '#25365a'); } else { sky.addColorStop(0, '#8fb8e8'); sky.addColorStop(1, '#f2dcb8'); }
  g.fillStyle = sky; g.fillRect(0, 0, 256, 256);
  if (night) { g.fillStyle = '#f2efe0'; g.beginPath(); g.arc(196, 52, 14, 0, TAU); g.fill(); g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * 256, Math.random() * 130, 1.2, 1.2); }
  // tepe ve saray silueti
  g.fillStyle = night ? '#121a2c' : '#7d8fa0';
  g.beginPath(); g.moveTo(0, 170); g.quadraticCurveTo(128, 110, 256, 165); g.lineTo(256, 256); g.lineTo(0, 256); g.fill();
  g.fillStyle = night ? '#0d1322' : '#6a7a8c';
  const tw = (x, w, h, roof) => { g.fillRect(x, 140 - h, w, h + 40); g.beginPath(); g.moveTo(x - 3, 140 - h); g.lineTo(x + w / 2, 140 - h - roof); g.lineTo(x + w + 3, 140 - h); g.fill(); };
  g.fillRect(90, 108, 80, 40); tw(84, 12, 50, 18); tw(164, 12, 48, 18); tw(122, 16, 72, 26); tw(104, 9, 36, 14); tw(147, 9, 40, 14);
  if (night) { g.fillStyle = '#ffd890'; for (let i = 0; i < 9; i++) g.fillRect(96 + i * 8, 118, 2, 4); g.fillRect(128, 92, 3, 5); }
  // önde çatılar
  g.fillStyle = night ? '#1a1610' : '#8a6a3a';
  for (let i = 0; i < 4; i++) { const x = i * 70 - 10; g.beginPath(); g.moveTo(x, 256); g.lineTo(x + 35, 200 + (i % 2) * 12); g.lineTo(x + 70, 256); g.fill(); }
  if (night) { g.fillStyle = '#ffb860'; g.fillRect(52, 236, 6, 6); g.fillRect(190, 240, 6, 6); }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}
