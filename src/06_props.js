// ---------- Seviye sınıfı, çarpışma ve dekor parçaları ----------
const COL = {
  stone: '#9a9284', stoneD: '#77705f', stoneL: '#b8b1a0', wall: '#e8dcbf', wall2: '#e0cfa8', wall3: '#d9c69c', beam: '#5a3b26', beamL: '#7a5232',
  thatch: '#c4964e', thatch2: '#b08440', thatchD: '#8a6430', tile: '#b0543c', tile2: '#8e4434', slate: '#56627a', wood: '#8a6240', woodD: '#5e4028', woodL: '#a87e52',
  grass: '#7aa646', grass2: '#6a9a3c', grassD: '#5a8a34', grassL: '#94b858', dirt: '#b08a5e', dirtD: '#94744c', leaf: '#5f9a3a', leaf2: '#74ae44', leaf3: '#4c8432', leafL: '#9cc65a', pine: '#2f6a46', pine2: '#3c7c52',
  trunk: '#6a4a32', wheat: '#e0b85a', wheat2: '#d0a446', hay: '#d8b462', rock: '#9d998e', rock2: '#86827a', snow: '#f4f7fb', snow2: '#e4eaf2', iron: '#4a4c52', gold: '#d4b062', elonth: '#2f6a42', elonth2: '#1f4a2c', cloth: '#b84a32',
};
class Level {
  constructor(id) {
    this.id = id; this.group = new T.Group(); this.b = new Builder(40); this.gb = new Builder(0); this.gb.jit = 0;
    this.gb.stack = this.b.stack; // aynı dönüşüm yığını
    this.boxes = []; this.circles = []; this.anims = []; this.pts = {}; this.hf = null; this.bounds = null; this.camBox = null;
    this.lights = []; this.winter = false; this.dyn = []; this.interact = []; this.smoke = []; this.flowerSpots = [];
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
      if (d2 === 0) { const px = b.hw - Math.abs(lx), pz = b.hd - Math.abs(lz); if (px < pz) lx = Math.sign(lx || 1) * (b.hw + r); else lz = Math.sign(lz || 1) * (b.hd + r); }
      else if (d2 < r * r) { const d = Math.sqrt(d2); lx = qx + ex / d * r; lz = qz + ez / d * r; } else continue;
      p.x = b.x + lx * b.c + lz * b.s; p.z = b.z - lx * b.s + lz * b.c;
    }
    if (this.bounds) { const B = this.bounds; p.x = clamp(p.x, B.x0 + r, B.x1 - r); p.z = clamp(p.z, B.z0 + r, B.z1 - r); }
    if (this.arena) { const A = this.arena, dx = p.x - A.x, dz = p.z - A.z, d = Math.hypot(dx, dz); if (d > A.r - r) { p.x = A.x + dx / d * (A.r - r); p.z = A.z + dz / d * (A.r - r); } }
    if (this.extraResolve) this.extraResolve(p, r);
  }
  blocked(x, z, pad = 0.25) {
    for (const b of this.boxes) { const dx = x - b.x, dz = z - b.z; if (Math.abs(dx) > b.hw + b.hd + 1 && Math.abs(dz) > b.hw + b.hd + 1) continue; const lx = dx * b.c - dz * b.s, lz = dx * b.s + dz * b.c; if (Math.abs(lx) < b.hw + pad && Math.abs(lz) < b.hd + pad && b.hw > 0.6 && b.hd > 0.6) return true; }
    return false;
  }
  occupied(x, z, pad = 0.4) { if (this.blocked(x, z, pad)) return true; for (const c of this.circles) if (Math.hypot(x - c.x, z - c.z) < c.r + pad) return true; return false; }
  update(dt) { for (const a of this.anims) a(dt); }
  dispose() { this.group.traverse(o => { if (o.isMesh || o.isPoints || o.isLine) { if (!Object.values(PRIM).includes(o.geometry) && !o.userData.shared) o.geometry.dispose(); } }); }
}

// ---- Arazi: yumuşak gölgeli, köşe renkli ızgara ----
function terrain(L, x0, z0, x1, z1, step, colorFn) {
  const nx = Math.ceil((x1 - x0) / step) + 1, nz = Math.ceil((z1 - z0) / step) + 1;
  const pos = new Float32Array(nx * nz * 3), col = new Float32Array(nx * nz * 3); const c = new T.Color();
  const H = (x, z) => (L.th ? L.th(x, z) : L.h(x, z));
  for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) {
    const x = x0 + i * step + (hash2(i * 0.7, k * 0.3) - 0.5) * step * 0.25, z = z0 + k * step + (hash2(i * 0.2, k * 0.9) - 0.5) * step * 0.25, y = H(x, z), o = (k * nx + i) * 3;
    pos[o] = x; pos[o + 1] = y; pos[o + 2] = z;
    const ny = 1 - Math.min(1, Math.abs(H(x + 0.6, z) - y) + Math.abs(H(x, z + 0.6) - y)) * 0.6;
    c.set(colorFn(x, z, y, ny)); const j = 1 + (fbm(x * 0.15, z * 0.15) - 0.45) * 0.16; c.multiplyScalar(j);
    col[o] = c.r; col[o + 1] = c.g; col[o + 2] = c.b;
  }
  const idx = [];
  for (let k = 0; k < nz - 1; k++) for (let i = 0; i < nx - 1; i++) { const a = k * nx + i, b = a + 1, cc = a + nx, d = cc + 1; if ((i + k) % 2) idx.push(a, cc, b, b, cc, d); else idx.push(a, cc, d, a, d, b); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere();
  const m = new T.Mesh(g, MAT.static); m.receiveShadow = true; m.matrixAutoUpdate = false; L.group.add(m); return m;
}

// ---- Rüzgârla sallanan instanced bitki örtüsü ----
const WIND = { time: { value: 0 } };
function windMaterial(opts = {}) {
  const m = new T.MeshToonMaterial(Object.assign({ gradientMap: TOON.gradSoft, vertexColors: true, side: T.DoubleSide }, opts));
  m.onBeforeCompile = sh => {
    sh.uniforms.time = WIND.time;
    sh.vertexShader = 'uniform float time;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
      vec4 iw = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
      #else
      vec4 iw = vec4(0.0);
      #endif
      float hh = max(transformed.y, 0.0);
      float sw = sin(time * 1.7 + iw.x * 0.45 + iw.z * 0.38) * 0.10 + sin(time * 3.3 + iw.x * 1.3 - iw.z) * 0.035;
      transformed.x += sw * hh * hh * 2.4; transformed.z += sw * hh * hh * 1.3;`);
  };
  return m;
}
const VEG = {};
function vegGeo(type) {
  if (VEG[type]) return VEG[type];
  const pos = [], col = [], nor = []; const C = new T.Color();
  const tri = (a, b, c, ca, cb, cc) => { pos.push(...a, ...b, ...c); for (const cx of [ca, cb, cc]) { C.set(cx); col.push(C.r, C.g, C.b); } nor.push(0, 1, 0, 0, 1, 0, 0, 1, 0); };
  if (type === 'grass') {
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + i * 0.7, r = 0.05 + (i % 3) * 0.04, h = 0.32 + (i % 3) * 0.1, w = 0.035; const bx = Math.cos(a) * r, bz = Math.sin(a) * r, lx = Math.cos(a + 1.57) * w, lz = Math.sin(a + 1.57) * w, tx = bx * 1.8, tz = bz * 1.8;
      tri([bx - lx, 0, bz - lz], [bx + lx, 0, bz + lz], [tx, h, tz], '#4f7f2c', '#4f7f2c', '#b8d870'); }
  } else if (type === 'wheat') {
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4, r = 0.06, bx = Math.cos(a) * r, bz = Math.sin(a) * r, lx = Math.cos(a + 1.57) * 0.02, lz = Math.sin(a + 1.57) * 0.02, h = 0.85 + i * 0.07;
      tri([bx - lx, 0, bz - lz], [bx + lx, 0, bz + lz], [bx * 1.4, h, bz * 1.4], '#9a8a3a', '#9a8a3a', '#d8b858');
      const hx = bx * 1.4, hz = bz * 1.4; tri([hx - 0.035, h - 0.05, hz], [hx + 0.035, h - 0.05, hz], [hx, h + 0.16, hz], '#e8c468', '#e8c468', '#f4dc8a'); tri([hx, h - 0.05, hz - 0.035], [hx, h - 0.05, hz + 0.035], [hx, h + 0.16, hz], '#d8b058', '#d8b058', '#f0d27a'); }
  } else if (type === 'flower') {
    tri([-0.012, 0, 0], [0.012, 0, 0], [0, 0.22, 0], '#4a7a2a', '#4a7a2a', '#6a9a3a');
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; tri([0, 0.22, 0], [Math.cos(a) * 0.06, 0.24, Math.sin(a) * 0.06], [Math.cos(a + 0.9) * 0.06, 0.24, Math.sin(a + 0.9) * 0.06], '#ffe070', '#ffffff', '#ffffff'); }
  } else if (type === 'reed') {
    for (let i = 0; i < 4; i++) { const a = i * 1.7, bx = Math.cos(a) * 0.08, bz = Math.sin(a) * 0.08, h = 0.9 + i * 0.15; tri([bx - 0.02, 0, bz], [bx + 0.02, 0, bz], [bx * 1.5, h, bz * 1.5], '#4a6a2a', '#4a6a2a', '#8aa04a'); tri([bx * 1.45 - 0.025, h - 0.25, bz * 1.45], [bx * 1.45 + 0.025, h - 0.25, bz * 1.45], [bx * 1.5, h + 0.02, bz * 1.5], '#6a4a2a', '#6a4a2a', '#8a6a3a'); }
  }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.computeBoundingSphere();
  VEG[type] = g; return g;
}
// pts: [[x, z, tintHex?, scale?], ...]
function vegetation(L, type, pts, o = {}) {
  if (!pts.length) return null;
  const mesh = new T.InstancedMesh(vegGeo(type), windMaterial(), pts.length); mesh.userData.shared = true;
  const m = new T.Matrix4(), q = new T.Quaternion(), s = new T.Vector3(), p = new T.Vector3(), e = new T.Euler(), c = new T.Color();
  pts.forEach((pt, i) => { const sc = (pt[3] || 1) * frand(0.75, 1.25); p.set(pt[0], L.h(pt[0], pt[1]) - 0.02, pt[1]); e.set(0, frand(0, TAU), 0); q.setFromEuler(e); s.set(sc, sc * frand(0.85, 1.2), sc); m.compose(p, q, s); mesh.setMatrixAt(i, m); c.set(pt[2] || '#ffffff'); mesh.setColorAt(i, c); });
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.receiveShadow = true; mesh.castShadow = false; mesh.frustumCulled = false; L.add(mesh); return mesh;
}

// ---- Su ----
function waterMaterial(o = {}) {
  const v3 = h => { const c = hexRGB(h); return new T.Vector3(c.r, c.g, c.b); };
  const m = new T.ShaderMaterial({
    uniforms: { time: WIND.time, deep: { value: v3(o.deep || '#2f6f86') }, shallow: { value: v3(o.shallow || '#57a7b4') }, foam: { value: v3('#e8f6f8') }, fogC: { value: new T.Vector3(1, 1, 1) }, fogN: { value: 50 }, fogF: { value: 200 }, opacity: { value: o.opacity || 0.9 }, ice: { value: o.ice ? 1 : 0 } },
    vertexShader: `uniform float time; varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); w.y += (sin(w.x*0.7+time*1.3)*0.025 + cos(w.z*0.9+time*1.1)*0.025); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform float time; uniform vec3 deep; uniform vec3 shallow; uniform vec3 foam; uniform vec3 fogC; uniform float fogN; uniform float fogF; uniform float opacity; uniform float ice; varying vec3 vW;
      void main(){ float s = sin(vW.x*1.6 + time*1.5*(1.0-ice) + sin(vW.z*0.7+time*(1.0-ice))*1.6)*sin(vW.z*2.0 - time*1.1*(1.0-ice));
        float band = smoothstep(0.78, 0.96, s); vec3 c = mix(deep, shallow, 0.5 + 0.5*sin(vW.x*0.21 + vW.z*0.17)); c = mix(c, foam, band*0.55);
        vec3 v = normalize(cameraPosition - vW); float fr = pow(1.0 - clamp(v.y, 0.0, 1.0), 3.0); c = mix(c, vec3(0.86,0.94,1.0), fr*0.4);
        float d = length(cameraPosition - vW); c = mix(c, fogC, smoothstep(fogN, fogF, d)); gl_FragColor = vec4(c, opacity); }`,
    transparent: true, depthWrite: false,
  });
  WATER.push(m); return m;
}
const WATER = [];
function syncWaterFog(fog) { const c = new T.Color(fog.color); const o = { r: 0, g: 0, b: 0 }; c.getRGB(o, T.SRGBColorSpace); for (const m of WATER) { m.uniforms.fogC.value.set(o.r, o.g, o.b); m.uniforms.fogN.value = fog.near; m.uniforms.fogF.value = fog.far; } }

// ---- Yapılar ----
function peasantHouse(L, x, z, ry, o = {}) {
  const b = L.b, w = o.w || rnd(4.4, 5.6), d = o.d || rnd(3.7, 4.4), h = o.h || rnd(2.4, 2.75), y = o.y !== undefined ? o.y : L.h(x, z) - 0.05;
  const wall = o.wall || pick([COL.wall, COL.wall2, COL.wall3, '#eadfc8']), roof = o.roof || pick([COL.thatch, COL.thatch2, '#c9a05a']);
  const W = L.winter;
  b.begin(x, y, z, ry);
  // taş temel (taş sırası)
  for (let i = -2; i <= 2; i++) for (const [fx, fz, len, rot] of [[0, d / 2 + 0.06, w + 0.3, 0], [0, -d / 2 - 0.06, w + 0.3, 0]]) b.box(pick([COL.stone, COL.stoneD, COL.stoneL]), i * (w + 0.3) / 5, -0.45, fz, (w + 0.3) / 5 - 0.03, 0.62, 0.22);
  for (let i = -1; i <= 1; i++) for (const fx of [-w / 2 - 0.06, w / 2 + 0.06]) b.box(pick([COL.stone, COL.stoneD, COL.stoneL]), fx, -0.45, i * (d + 0.3) / 3, 0.22, 0.62, (d + 0.3) / 3 - 0.03);
  b.box(wall, 0, 0.12, 0, w, h, d);
  b.box(shade(wall, 0.82), 0, 0.12, 0, w + 0.02, 0.22, d + 0.02);
  // ahşap iskelet
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.beam, sx * w / 2, 0.1, sz * d / 2, 0.22, h + 0.05, 0.22);
  for (const sz of [-1, 1]) { b.box(COL.beam, 0, h * 0.52, sz * (d / 2 + 0.03), w, 0.13, 0.07); b.box(COL.beam, 0, h + 0.04, sz * (d / 2 + 0.02), w + 0.2, 0.17, 0.1); }
  for (const sx of [-1, 1]) { b.box(COL.beam, sx * (w / 2 + 0.03), h * 0.52, 0, 0.07, 0.13, d); b.add('box', COL.beam, sx * (w / 2 + 0.035), h * 0.75, -d * 0.22, 0.06, h * 0.55, 0.11, 0.85 * sx, 0, 0); b.add('box', COL.beam, sx * (w / 2 + 0.035), h * 0.75, d * 0.22, 0.06, h * 0.55, 0.11, -0.85 * sx, 0, 0); }
  for (const sx of [-1, 1]) b.add('box', COL.beam, sx * w * 0.36, h * 0.27, -(d / 2 + 0.035), 0.1, h * 0.5, 0.06, 0, 0, sx * 0.6);
  // çatı: kalın saz, saçak, mahya
  const rh = o.rh || 1.8;
  b.add('roof', shade(roof, 0.72), 0, h + 0.08, 0, d + 1.25, rh * 1.02, w + 1.0, 0, Math.PI / 2, 0, 0.03);
  b.add('roof', roof, 0, h + 0.2, 0, d + 1.1, rh, w + 0.92, 0, Math.PI / 2, 0, 0.04);
  for (const sz of [-1, 1]) for (let i = 0; i < 9; i++) b.add('box', shade(roof, rnd(0.8, 1.05)), -w / 2 - 0.4 + i * (w + 0.8) / 8, h + 0.12, sz * (d / 2 + 0.58), (w + 0.9) / 8, 0.12, 0.2, 0.15 * sz, 0, 0, 0.05);
  b.add('cylS8', shade(roof, 0.65), 0, h + 0.2 + rh, 0, 0.28, w + 1.0, 0.28, 0, 0, Math.PI / 2);
  if (W) { b.add('roof', COL.snow, 0, h + 0.42, 0, d + 0.95, rh * 0.9, w + 0.98, 0, Math.PI / 2, 0, 0.02); b.add('cylS8', COL.snow, 0, h + 0.33 + rh, 0, 0.3, w + 1.02, 0.3, 0, 0, Math.PI / 2, 0); }
  for (const sx of [-1, 1]) { b.add('roof', wall, sx * (w / 2 - 0.02), h + 0.14, 0, d - 0.1, rh * 0.86, 0.06, 0, Math.PI / 2, 0); b.add('box', COL.beam, sx * (w / 2 + 0.02), h + rh * 0.4, 0, 0.06, rh * 0.8, 0.12); }
  // kapı
  const doorX = o.doorX !== undefined ? o.doorX : -w * 0.2, df = d / 2 + 0.03;
  b.box(COL.woodD, doorX, 0.12, df, 0.98, 1.88, 0.08);
  for (let i = -1; i <= 1; i++) b.box(shade(COL.woodD, 0.85), doorX + i * 0.3, 0.14, df + 0.02, 0.03, 1.82, 0.04);
  for (const hy of [0.5, 1.5]) b.box(COL.iron, doorX - 0.18, hy, df + 0.05, 0.5, 0.06, 0.02);
  b.box(COL.beam, doorX, 2.0, df + 0.02, 1.2, 0.15, 0.12); b.box(COL.beam, doorX - 0.56, 0.1, df + 0.02, 0.12, 1.95, 0.12); b.box(COL.beam, doorX + 0.56, 0.1, df + 0.02, 0.12, 1.95, 0.12);
  b.box(COL.stone, doorX, -0.2, df + 0.38, 1.2, 0.3, 0.62); b.box(COL.stoneL, doorX, -0.1, df + 0.75, 1.0, 0.18, 0.4);
  // pencereler
  const lit = o.lit;
  for (const wx of o.windows || [w * 0.24]) {
    if (lit) L.gb.box('#ffcf7a', wx, 0.98, df, 0.66, 0.62, 0.04); else b.box('#2c2a30', wx, 0.98, df, 0.66, 0.62, 0.04);
    b.box(COL.beamL, wx, 1.27, df + 0.03, 0.08, 0.06, 0.06); b.box(COL.beamL, wx, 0.98, df + 0.03, 0.05, 0.62, 0.05); b.box(COL.beamL, wx, 1.27, df + 0.03, 0.66, 0.05, 0.05);
    b.box(COL.beam, wx, 0.9, df + 0.06, 0.82, 0.08, 0.16); b.box(COL.beam, wx, 1.6, df + 0.04, 0.82, 0.08, 0.1);
    b.box(COL.beamL, wx - 0.52, 0.96, df + 0.08, 0.34, 0.68, 0.05, 0.25); b.box(COL.beamL, wx + 0.52, 0.96, df + 0.08, 0.34, 0.68, 0.05, -0.25);
    if (!W && rng() < 0.7) { b.box(COL.woodD, wx, 0.72, df + 0.18, 0.78, 0.18, 0.2); for (let i = 0; i < 6; i++) b.add('sphS', pick(['#e85a5a', '#f0d040', '#f4f0e8', '#d070d0', '#ff9a40']), wx - 0.3 + i * 0.12, 0.96, df + 0.2 + rnd(-0.04, 0.04), 0.1, 0.09, 0.1, 0, 0, 0, 0.05); for (let i = 0; i < 4; i++) b.add('sphS', '#5a9a3a', wx - 0.27 + i * 0.18, 0.92, df + 0.2, 0.14, 0.1, 0.12); }
  }
  if (lit) L.gb.box('#ffc06a', -w * 0.25, 0.98, -df, 0.6, 0.6, 0.04);
  // baca + duman
  if (o.chimney !== false) {
    const cx = w * 0.3, cz = -d * 0.18, ch = h * 0.55 + rh + 0.55;
    for (let i = 0; i < 5; i++) b.box(pick([COL.stone, COL.stoneD, COL.stoneL]), cx, h * 0.55 + i * (ch - h * 0.55) / 5, cz, 0.62, (ch - h * 0.55) / 5 + 0.01, 0.62);
    b.box(COL.stoneD, cx, h * 0.55 + (ch - h * 0.55), cz, 0.74, 0.12, 0.74);
    if (W) b.box(COL.snow, cx, ch + 0.12, cz, 0.76, 0.08, 0.76, 0, 0, 0);
    const wp = V3(cx, ch + 0.25, cz).applyMatrix4(b.top); if (o.smoke !== false && rng() < 0.7) L.smoke.push(wp);
  }
  // yan süsler: odun yığını / fıçı / alet
  if (rng() < 0.6) { const sx = rng() < 0.5 ? 1 : -1; for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) b.add('cylS8', pick(['#8a6a48', '#9a7a52', '#7a5a3a']), sx * (w / 2 + 0.3), -0.15 + r * 0.2 + 0.1, -d * 0.1 + (i - (3 - r) / 2) * 0.22, 0.2, 0.9, 0.2, Math.PI / 2, 0, 0); b.box(COL.woodD, sx * (w / 2 + 0.3), 0.52, -d * 0.1, 0.5, 0.06, 1.2); }
  if (rng() < 0.4) { b.add('cylS', COL.wood, -w / 2 + 0.1, 0.3, df + 0.5, 0.55, 0.72, 0.55); b.add('cylS', COL.iron, -w / 2 + 0.1, 0.12, df + 0.5, 0.57, 0.05, 0.57); b.add('cylS', COL.iron, -w / 2 + 0.1, 0.52, df + 0.5, 0.57, 0.05, 0.57); }
  if (lit) { L.gb.add('box', '#ffcf70', doorX + 0.75, 1.75, df + 0.15, 0.14, 0.2, 0.14); b.box(COL.iron, doorX + 0.75, 1.62, df + 0.15, 0.18, 0.05, 0.18); }
  b.end();
  L.addBox(x, z, (w + 0.35) / 2, (d + 0.35) / 2, ry);
  const c = Math.cos(ry), s = Math.sin(ry);
  return { door: V3(x + doorX * c + (d / 2 + 0.9) * s, 0, z - doorX * s + (d / 2 + 0.9) * c), w, d, x, z, ry };
}
function townHouse(L, x, z, ry, o = {}) {
  const b = L.b, w = o.w || rnd(5, 7), d = o.d || rnd(5, 6), h1 = 3, h2 = o.floors === 3 ? 5.6 : 2.8, y = L.h(x, z) - 0.05;
  const plaster = o.wall || pick(['#f0e6d0', '#e8dcc0', '#f2ead8', '#e4d4b4', '#f0e2c8', '#e8d8d0']), roof = o.roof || pick([COL.tile, COL.tile2, COL.slate, '#a85a40']);
  b.begin(x, y, z, ry);
  for (let i = 0; i < 4; i++) b.box(pick([COL.stone, COL.stoneL, '#a8a090']), 0, -0.3 + i * (h1 + 0.3) / 4, 0, w, (h1 + 0.3) / 4 + 0.01, d);
  b.box(plaster, 0, h1, 0, w + 0.4, h2, d + 0.4); b.box(shade(plaster, 0.85), 0, h1, 0, w + 0.42, 0.2, d + 0.42);
  const fr = COL.beam;
  b.box(fr, 0, h1, d / 2 + 0.22, w + 0.45, 0.2, 0.08); b.box(fr, 0, h1 + h2 - 0.15, d / 2 + 0.22, w + 0.45, 0.18, 0.08);
  const n = Math.round(w / 1.4);
  for (let i = 0; i <= n; i++) { const px = -w / 2 - 0.2 + i * (w + 0.4) / n; b.box(fr, px, h1, d / 2 + 0.23, 0.14, h2, 0.07); }
  for (let i = 0; i < n; i++) { const px = -w / 2 - 0.2 + (i + 0.5) * (w + 0.4) / n; b.add('box', fr, px, h1 + h2 * 0.5, d / 2 + 0.24, 0.1, h2 * 0.75, 0.05, 0, 0, (i % 2 ? 1 : -1) * 0.55); }
  for (let i = 0; i < n; i++) { const px = -w / 2 - 0.2 + (i + 0.5) * (w + 0.4) / n; if (o.lit) L.gb.box('#ffcf7a', px, h1 + h2 * 0.32, d / 2 + 0.26, 0.55, 0.72, 0.03); else b.box('#33343c', px, h1 + h2 * 0.32, d / 2 + 0.26, 0.55, 0.72, 0.03); b.box(COL.beamL, px, h1 + h2 * 0.32 - 0.05, d / 2 + 0.32, 0.7, 0.07, 0.14); if (rng() < 0.4 && !L.winter) for (let k = 0; k < 4; k++) b.add('sphS', pick(['#e85a5a', '#f0d040', '#ffffff', '#d070d0']), px - 0.22 + k * 0.15, h1 + h2 * 0.32 + 0.06, d / 2 + 0.36, 0.11, 0.1, 0.1); }
  const rh = o.rh || 3;
  b.add('roof', shade(roof, 0.75), 0, h1 + h2 - 0.08, 0, d + 1.55, rh * 1.02, w + 0.95, 0, Math.PI / 2, 0);
  b.add('roof', roof, 0, h1 + h2, 0, d + 1.4, rh, w + 0.8, 0, Math.PI / 2, 0);
  for (const sx of [-1, 1]) b.add('roof', plaster, sx * (w / 2 + 0.15), h1 + h2 - 0.02, 0, d + 0.3, rh * 0.92, 0.1, 0, Math.PI / 2, 0);
  if (L.winter) b.add('roof', COL.snow, 0, h1 + h2 + 0.22, 0, d + 1.2, rh * 0.92, w + 0.85, 0, Math.PI / 2, 0, 0.02);
  b.add('box', roof, 0, h1 + h2 + rh * 0.55, d * 0.25, 1.1, 1.0, 0.9); b.add('roof', roof, 0, h1 + h2 + rh * 0.55 + 0.5, d * 0.25, 1.4, 0.6, 1.0, 0, 0, 0); if (o.lit) L.gb.box('#ffcf7a', 0, h1 + h2 + rh * 0.55 - 0.25, d * 0.25 + 0.46, 0.5, 0.55, 0.03); else b.box('#33343c', 0, h1 + h2 + rh * 0.55 - 0.25, d * 0.25 + 0.46, 0.5, 0.55, 0.03);
  b.box(COL.woodD, -w * 0.25, -0.05, d / 2 + 0.03, 1.1, 2.2, 0.1); b.add('cyl8', COL.stoneD, -w * 0.25, 2.15, d / 2 + 0.04, 1.1, 0.12, 0.1, Math.PI / 2, 0, 0);
  b.box('#33343c', w * 0.22, 0.8, d / 2 + 0.02, 1.4, 1.1, 0.05); b.box(COL.beam, w * 0.22, 0.75, d / 2 + 0.06, 1.6, 0.08, 0.2);
  if (o.awning) { for (let i = 0; i < 6; i++) b.add('box', i % 2 ? '#f0e6d0' : o.awning, w * 0.22 - 0.75 + i * 0.3, 2.2, d / 2 + 0.55, 0.3, 0.05, 1.1, -0.35, 0, 0); }
  if (o.sign) { b.box(COL.iron, -w * 0.25 + 1.0, 2.6, d / 2 + 0.5, 0.05, 0.05, 0.9); b.box(o.sign, -w * 0.25 + 1.0, 2.15, d / 2 + 0.85, 0.06, 0.5, 0.7); }
  if (o.chimney !== false) { b.box(COL.stoneD, w * 0.3, h1 + h2, -d * 0.2, 0.6, rh + 0.6, 0.6); if (rng() < 0.5) L.smoke.push(V3(w * 0.3, h1 + h2 + rh + 0.8, -d * 0.2).applyMatrix4(b.top)); }
  b.end();
  L.addBox(x, z, w / 2 + 0.25, d / 2 + 0.25, ry);
}
function tree(L, x, z, type = 'oak', s = 1) {
  const b = L.b, y = L.h(x, z) - 0.1, W = L.winter;
  b.begin(x, y, z, rnd(0, TAU), s);
  if (type === 'oak') {
    b.add('trunk', COL.trunk, 0, 1.3, 0, 0.62, 2.6, 0.62, 0, 0, 0, 0.06);
    b.add('trunk', COL.trunk, 0.45, 2.3, 0.1, 0.24, 1.3, 0.24, 0, 0, -0.8); b.add('trunk', COL.trunk, -0.4, 2.5, -0.2, 0.2, 1.2, 0.2, 0.3, 0, 0.7);
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.3; b.add('trunk', shade(COL.trunk, 0.9), Math.cos(a) * 0.32, 0.08, Math.sin(a) * 0.32, 0.22, 0.5, 0.22, Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9); }
    if (W) { b.add('blob2', COL.snow2, 0, 3.4, 0, 2.2, 0.8, 2.2, 0, 0, 0, 0.03); b.add('trunk', COL.trunk, 0.1, 3.0, -0.4, 0.14, 1.2, 0.14, -0.6, 0, 0.2); }
    else {
      const base = pick([COL.leaf, COL.leaf2, COL.leaf3]);
      const blobs = [[0, 3.5, 0, 3.4, 2.7], [1.15, 3.05, 0.35, 2.2, 1.9], [-1.05, 3.15, -0.45, 2.3, 2.0], [0.2, 4.35, -0.25, 2.2, 1.8], [-0.3, 2.85, 1.0, 1.9, 1.6], [0.5, 2.9, -1.0, 1.9, 1.6]];
      for (const [bx, by, bz, bs, bh] of blobs) b.add(pick(['blob1', 'blob2', 'blob3', 'blob4']), shade(base, by > 4 ? 1.12 : by < 3 ? 0.86 : 1), bx, by, bz, bs, bh, bs, 0, rnd(0, TAU), 0, 0.05);
    }
  } else if (type === 'pine') {
    b.add('trunk', COL.trunk, 0, 1.0, 0, 0.42, 2.0, 0.42);
    const pc = pick([COL.pine, COL.pine2, '#2a5e40']);
    for (let i = 0; i < 4; i++) { const sz = 2.9 - i * 0.62; b.add('pineL', shade(pc, 0.85 + i * 0.08), 0, 1.6 + i * 1.05, 0, sz, 1.9, sz, 0, rnd(0, 1), 0, 0.04); if (W) b.add('pineL', COL.snow, 0, 1.85 + i * 1.05, 0, sz * 0.78, 1.45, sz * 0.78, 0, rnd(0, 1), 0, 0.02); }
  } else if (type === 'birch') {
    b.add('trunk', '#e8e4d8', 0, 1.7, 0, 0.32, 3.4, 0.32);
    for (let i = 0; i < 6; i++) b.add('box', '#3a3430', rnd(-0.05, 0.05), rnd(0.5, 3), 0.15, 0.12, 0.04, 0.06, 0, rnd(0, TAU), 0);
    if (!W) { b.add('blob1', '#8cba4c', 0, 3.6, 0, 1.8, 2.4, 1.8, 0, 0, 0, 0.06); b.add('blob3', '#9cc858', 0.5, 3.0, 0.3, 1.3, 1.6, 1.3, 0, 0, 0, 0.06); b.add('blob2', '#7aaa44', -0.4, 3.1, -0.3, 1.2, 1.4, 1.2, 0, 0, 0, 0.06); }
  } else if (type === 'dead') {
    b.add('trunk', '#5a4636', 0, 1.3, 0, 0.42, 2.6, 0.42); b.add('trunk', '#5a4636', 0.45, 2.2, 0, 0.16, 1.4, 0.16, 0, 0, -0.8); b.add('trunk', '#5a4636', -0.35, 2.5, 0.2, 0.13, 1.1, 0.13, 0.4, 0, 0.7);
    if (W) b.add('blob1', COL.snow, 0, 2.6, 0, 0.6, 0.15, 0.6);
  }
  b.end();
  L.addCircle(x, z, 0.38 * s);
}
function bush(L, x, z, s = 1) {
  const y = L.h(x, z), c = L.winter ? COL.snow2 : pick([COL.leaf, COL.leaf2, '#6aa040', '#5a9038']);
  L.b.add(pick(['blob1', 'blob2', 'blob3', 'blob4']), c, x, y + 0.35 * s, z, 1.4 * s, 1.0 * s, 1.3 * s, 0, rnd(0, 3), 0, 0.08);
  L.b.add(pick(['blob1', 'blob2']), shade(c, 1.1), x + 0.4 * s, y + 0.3 * s, z + 0.2 * s, 0.9 * s, 0.7 * s, 0.8 * s, 0, rnd(0, 3), 0, 0.08);
  if (!L.winter && rng() < 0.35) for (let i = 0; i < 5; i++) L.b.add('sphS', pick(['#f0f0f0', '#ff8aa0', '#ffd860']), x + rnd(-0.5, 0.5) * s, y + rnd(0.4, 0.75) * s, z + rnd(-0.5, 0.5) * s, 0.09, 0.09, 0.09, 0, 0, 0, 0);
}
function rock(L, x, z, s = 1, col) { const y = L.h(x, z); L.b.add(pick(['blob3', 'blob4', 'blob1']), col || pick([COL.rock, COL.rock2, '#a8a498']), x, y + 0.12 * s, z, 1.3 * s, 0.75 * s, 1.0 * s, 0, rnd(0, 3), 0, 0.06); if (L.winter) L.b.add('blob2', COL.snow, x, y + 0.42 * s, z, 1.0 * s, 0.25 * s, 0.8 * s); if (s > 0.7) L.addCircle(x, z, 0.55 * s); }
function flowers(L, x, z, n = 6) { if (L.winter) return; for (let i = 0; i < n; i++) L.flowerSpots.push([x + rnd(-1, 1), z + rnd(-1, 1), pick(['#ffe060', '#ff7a7a', '#ffffff', '#c890ff', '#ffa040', '#80b0ff'])]); }
function grassTufts(L, x, z, n = 5) { }
function fence(L, x1, z1, x2, z2, o = {}) {
  const b = L.b, dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz), ry = Math.atan2(dx, dz), n = Math.max(1, Math.round(len / 1.9));
  for (let i = 0; i <= n; i++) { const t = i / n, px = x1 + dx * t, pz = z1 + dz * t, py = L.h(px, pz); b.add('cylS8', COL.woodD, px, py + 0.5, pz, 0.13, 1.2, 0.13, rnd(-0.04, 0.04), ry, rnd(-0.04, 0.04)); b.add('coneS', COL.woodD, px, py + 1.16, pz, 0.13, 0.14, 0.13); if (L.winter) b.add('sphS', COL.snow, px, py + 1.18, pz, 0.18, 0.08, 0.18, 0, 0, 0, 0); }
  for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, mx = x1 + dx * (t0 + t1) / 2, mz = z1 + dz * (t0 + t1) / 2, my = L.h(mx, mz), sl = len / n; for (const hy of [0.42, 0.82]) b.add('box', pick([COL.wood, COL.woodL]), mx, my + hy, mz, 0.06, 0.09, sl + 0.1, rnd(-0.03, 0.03), ry, 0); if (L.winter) b.add('box', COL.snow, mx, my + 0.88, mz, 0.08, 0.04, sl, 0, ry, 0, 0); }
  if (o.collide !== false) L.addBox((x1 + x2) / 2, (z1 + z2) / 2, 0.12, len / 2, ry);
}
function well(L, x, z) {
  const b = L.b, y = L.h(x, z);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; b.add('box', pick([COL.stone, COL.stoneD, COL.stoneL]), x + Math.cos(a) * 0.82, y + 0.42, z + Math.sin(a) * 0.82, 0.42, 0.85, 0.28, 0, -a + Math.PI / 2, 0, 0.06); }
  b.add('cylS', '#1a3a44', x, y + 0.7, z, 1.45, 0.02, 1.45, 0, 0, 0, 0);
  b.add('cylS8', COL.woodD, x - 0.85, y + 1.3, z, 0.14, 1.8, 0.14); b.add('cylS8', COL.woodD, x + 0.85, y + 1.3, z, 0.14, 1.8, 0.14);
  b.add('cylS8', COL.wood, x, y + 1.6, z, 0.16, 1.7, 0.16, 0, 0, Math.PI / 2); b.add('cylS', '#c8b48a', x, y + 1.6, z, 0.22, 0.4, 0.22, 0, 0, Math.PI / 2);
  b.add('roof', shade(COL.thatch2, 0.8), x, y + 2.12, z, 2.35, 0.82, 1.5, 0, Math.PI / 2, 0); b.add('roof', COL.thatch2, x, y + 2.18, z, 2.2, 0.8, 1.42, 0, Math.PI / 2, 0); if (L.winter) b.add('roof', COL.snow, x, y + 2.28, z, 2.0, 0.75, 1.44, 0, Math.PI / 2, 0, 0);
  b.add('cylS', COL.woodD, x + 0.3, y + 1.1, z, 0.28, 0.3, 0.28); b.add('box', COL.iron, x + 0.3, y + 1.4, z, 0.01, 0.3, 0.01);
  L.addCircle(x, z, 1.05);
}
function barrel(L, x, z, s = 1) { const b = L.b, y = L.h(x, z); b.add('cylS', COL.wood, x, y + 0.45 * s, z, 0.7 * s, 0.9 * s, 0.7 * s); b.add('cylS', '#a07a50', x, y + 0.45 * s, z, 0.76 * s, 0.4 * s, 0.76 * s); for (const hy of [0.15, 0.75]) b.add('cylS', COL.iron, x, y + hy * s, z, 0.73 * s, 0.06, 0.73 * s, 0, 0, 0, 0); if (L.winter) b.add('cylS', COL.snow, x, y + 0.92 * s, z, 0.66 * s, 0.05, 0.66 * s, 0, 0, 0, 0); L.addCircle(x, z, 0.38 * s); }
function crate(L, x, z, s = 1, ry = 0, y0) {
  const b = L.b, y = y0 !== undefined ? y0 : L.h(x, z); b.begin(x, y, z, ry, s);
  b.box(COL.woodL, 0, 0, 0, 0.78, 0.78, 0.78);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(COL.woodD, sx * 0.38, 0, sz * 0.38, 0.08, 0.8, 0.08);
  for (const hy of [0, 0.72]) { b.box(COL.woodD, 0, hy, 0.39, 0.8, 0.08, 0.04); b.box(COL.woodD, 0, hy, -0.39, 0.8, 0.08, 0.04); }
  b.add('box', COL.woodD, 0, 0.4, 0.4, 0.07, 0.95, 0.03, 0, 0, 0.78);
  b.end(); if (y0 === undefined) L.addBox(x, z, 0.42 * s, 0.42 * s, ry);
}
function haystack(L, x, z, s = 1) { const b = L.b, y = L.h(x, z); b.add('cylS', COL.hay, x, y + 0.6 * s, z, 2.0 * s, 1.2 * s, 2.0 * s, 0, rnd(0, 1), 0); b.add('blob2', L.winter ? COL.snow : shade(COL.hay, 1.08), x, y + 1.25 * s, z, 2.1 * s, 1.3 * s, 2.1 * s); b.add('cylS', shade(COL.hay, 0.8), x, y + 0.6 * s, z, 2.05 * s, 0.12, 2.05 * s); L.addCircle(x, z, 0.95 * s); }
function cart(L, x, z, ry) {
  const b = L.b; b.begin(x, L.h(x, z), z, ry);
  b.box(COL.wood, 0, 0.55, 0, 1.4, 0.12, 2.4); for (let i = -2; i <= 2; i++) b.box(shade(COL.wood, 0.9), i * 0.28, 0.6, 0, 0.02, 0.12, 2.4);
  b.box(COL.woodD, 0.68, 0.65, 0, 0.06, 0.38, 2.4); b.box(COL.woodD, -0.68, 0.65, 0, 0.06, 0.38, 2.4); b.box(COL.woodD, 0, 0.65, -1.18, 1.4, 0.38, 0.06);
  for (const sx of [-1, 1]) { b.add('torus', COL.woodD, sx * 0.82, 0.45, 0.3, 0.92, 0.92, 1.6, 0, Math.PI / 2, 0); for (let k = 0; k < 4; k++) b.add('box', COL.woodD, sx * 0.82, 0.45, 0.3, 0.05, 0.85, 0.05, k * Math.PI / 4, 0, 0); b.add('cylS8', COL.iron, sx * 0.85, 0.45, 0.3, 0.15, 0.12, 0.15, 0, 0, Math.PI / 2); }
  b.add('box', COL.woodD, 0.25, 0.5, 1.9, 0.08, 0.08, 1.5); b.add('box', COL.woodD, -0.25, 0.5, 1.9, 0.08, 0.08, 1.5);
  b.add('blob1', L.winter ? COL.snow : COL.hay, 0, 0.9, -0.3, 1.25, 0.55, 1.7);
  for (let i = 0; i < 2; i++) b.add('sphS', '#c8b48a', -0.3 + i * 0.6, 0.9, 0.7, 0.45, 0.4, 0.5);
  b.end(); L.addBox(x, z, 0.8, 1.3, ry);
}
function bench(L, x, z, ry) { const b = L.b; b.begin(x, L.h(x, z), z, ry); b.box(COL.wood, 0, 0.42, 0, 1.8, 0.08, 0.45); b.box(COL.woodL, 0, 0.42, 0.12, 1.8, 0.085, 0.12); for (const sx of [-0.7, 0.7]) { b.box(COL.woodD, sx, 0, 0.12, 0.1, 0.42, 0.1); b.box(COL.woodD, sx, 0, -0.12, 0.1, 0.42, 0.1); } b.end(); L.addBox(x, z, 0.9, 0.25, ry); }
function torch(L, x, z, light = false, h = 2.2) {
  const y = L.h(x, z); L.b.add('cylS8', COL.woodD, x, y + h / 2, z, 0.12, h, 0.12); L.b.add('cylS8', COL.iron, x, y + h, z, 0.25, 0.15, 0.25);
  L.gb.add('ico0', '#ffb347', x, y + h + 0.2, z, 0.28, 0.4, 0.28, 0, 0, 0, 0); L.gb.add('ico0', '#ffe9a0', x, y + h + 0.18, z, 0.15, 0.22, 0.15, 0, 0, 0, 0);
  if (light) { const l = new T.PointLight('#ffa040', 6, 9, 1.6); l.position.set(x, y + h + 0.5, z); L.light(l); L.anims.push(() => { l.intensity = 5 + Math.sin(G.t * 13 + x) * 0.8 + Math.sin(G.t * 7.3) * 0.6; }); }
}
function lampPost(L, x, z, light = false) {
  const y = L.h(x, z); L.b.add('cylS8', COL.iron, x, y + 1.6, z, 0.12, 3.2, 0.12); L.b.add('box', COL.iron, x + 0.3, y + 3.1, z, 0.7, 0.08, 0.08);
  L.b.add('coneS', COL.iron, x + 0.6, y + 2.92, z, 0.36, 0.2, 0.36); L.gb.add('box', '#ffd080', x + 0.6, y + 2.65, z, 0.22, 0.35, 0.22);
  if (light) { const l = new T.PointLight('#ffc070', 5, 12, 1.5); l.position.set(x + 0.6, y + 2.4, z); L.light(l); }
  L.addCircle(x, z, 0.15);
}
function banner(L, x, z, ry, col, h = 4, emblem = COL.gold) {
  const b = L.b, y = L.h(x, z); b.begin(x, y, z, ry);
  b.add('cylS8', COL.woodD, 0, h / 2, 0, 0.12, h, 0.12); b.add('sphS', COL.gold, 0, h + 0.05, 0, 0.18, 0.18, 0.18);
  b.box(COL.woodD, 0, h - 0.25, 0.35, 0.06, 0.06, 0.8);
  b.add('box', col, 0, h - 1.2, 0.4, 0.04, 1.8, 0.7); b.add('box', shade(col, 0.7), 0, h - 0.33, 0.4, 0.05, 0.08, 0.72); b.add('sphS', emblem, 0, h - 1.0, 0.43, 0.04, 0.38, 0.3);
  b.add('wedge', col, 0, h - 2.6, 0.4, 0.04, 0.5, 0.7, Math.PI, 0, 0);
  b.end();
}
function stall(L, x, z, ry, cloth = '#b84a32') {
  const b = L.b; b.begin(x, L.h(x, z), z, ry);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.add('cylS8', COL.woodD, sx * 1.2, 1.2, sz * 0.8, 0.12, 2.4, 0.12);
  b.box(COL.wood, 0, 0.85, 0.5, 2.5, 0.12, 0.8); b.box(COL.woodD, 0, 0, 0.85, 2.4, 0.85, 0.06);
  for (let i = 0; i < 6; i++) b.add('box', i % 2 ? '#f4ecd8' : cloth, -1.25 + 0.21 + i * 0.42, 2.45, 0, 0.42, 0.06, 2.0, 0.18, 0, 0);
  for (let i = 0; i < 6; i++) b.add('wedge', i % 2 ? '#f4ecd8' : cloth, -1.25 + 0.21 + i * 0.42, 2.12, 1.02, 0.42, 0.2, 0.04, Math.PI, 0, 0);
  const goods = ['#d85a3a', '#e8b83a', '#8ab83a', '#f0e0a8', '#b86a2a', '#c83a5a'];
  for (let i = 0; i < 12; i++) b.add(pick(['sphS', 'sphS', 'cylS8']), pick(goods), rnd(-1.0, 1.0), 1.0, rnd(0.25, 0.75), 0.2, 0.17, 0.2);
  b.add('cylS', COL.wood, -0.9, 0.3, 1.3, 0.5, 0.6, 0.5); b.add('blob2', pick(goods), -0.9, 0.62, 1.3, 0.45, 0.2, 0.45);
  b.end(); L.addBox(x, z, 1.35, 0.95, ry);
}
function wallSeg(L, x1, z1, x2, z2, h = 6, col = COL.stone, thick = 1.6) {
  const b = L.b, dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz), ry = Math.atan2(dx, dz), mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, y = Math.min(L.h(x1, z1), L.h(x2, z2), L.h(mx, mz)) - 0.5;
  const rows = 5; for (let r = 0; r < rows; r++) { const n = Math.ceil(len / 3); for (let i = 0; i < n; i++) { const t = (i + 0.5 + (r % 2) * 0.5) / n; if (t > 1) continue; b.add('boxb', pick([col, shade(col, 0.9), shade(col, 1.08)]), x1 + dx * t, y + r * (h + 0.5) / rows, z1 + dz * t, thick, (h + 0.5) / rows + 0.02, len / n + 0.02, 0, ry, 0, 0.02); } }
  const n = Math.floor(len / 1.2);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; if (i % 2) continue; b.add('boxb', col, x1 + dx * t, y + h + 0.5, z1 + dz * t, thick + 0.1, 0.6, len / n * 0.9, 0, ry, 0); }
  b.add('boxb', shade(col, 0.85), mx, y + h + 0.4, mz, thick + 0.2, 0.12, len, 0, ry, 0);
  if (L.winter) b.add('boxb', COL.snow, mx, y + h + 0.5, mz, thick + 0.05, 0.08, len, 0, ry, 0, 0);
}
function tower(L, x, z, r = 2.2, h = 10, roof = COL.slate, base) {
  const b = L.b, y = base !== undefined ? base : L.h(x, z) - 0.5;
  b.add('cylS', COL.stone, x, y + h / 2, z, r * 2, h, r * 2); for (let k = 1; k < 4; k++) b.add('cylS', shade(COL.stone, 0.9), x, y + h * k / 4, z, r * 2.04, 0.15, r * 2.04);
  b.add('cylS', COL.stoneD, x, y + h + 0.2, z, r * 2.3, 0.5, r * 2.3);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; b.add('box', COL.stone, x + Math.cos(a) * r * 1.08, y + h + 0.6, z + Math.sin(a) * r * 1.08, 0.5, 0.5, 0.4, 0, -a, 0); }
  b.add('coneS', roof, x, y + h + 0.6 + r * 1.35, z, r * 2.5, r * 2.7, r * 2.5); if (L.winter) b.add('coneS', COL.snow, x, y + h + 0.4 + r * 1.05, z, r * 2.35, r * 1.6, r * 2.35, 0, 0, 0, 0);
  for (let i = 0; i < 3; i++) { const a = i * 2.1; b.add('box', '#2a2a30', x + Math.sin(a) * r * 0.98, y + h * 0.6, z + Math.cos(a) * r * 0.98, 0.3, 0.8, 0.3, 0, a, 0); }
  b.add('cylS8', COL.woodD, x, y + h + r * 2.85, z, 0.06, 1.2, 0.06); b.add('box', COL.elonth, x, y + h + r * 2.85 + 0.3, z + 0.35, 0.03, 0.45, 0.7);
}
function palace(L, x, z, y, s = 1) {
  const b = L.b; b.begin(x, y, z, 0, s);
  b.box(COL.stoneL, 0, 0, 0, 34, 12, 20); b.box(COL.stone, 0, 12, 0, 20, 8, 14);
  for (let i = -3; i <= 3; i++) b.box(shade(COL.stoneL, 0.9), i * 5, 0, 10.05, 0.8, 12, 0.3);
  b.add('roof', COL.slate, 0, 12, 0, 22, 6, 36, 0, Math.PI / 2, 0); b.add('roof', COL.slate, 0, 20, 0, 16, 6, 22, 0, Math.PI / 2, 0);
  b.end();
  const tw = (dx, dz, r, h) => tower(L, x + dx * s, z + dz * s, r * s, h * s, COL.slate, y);
  tw(-17, -10, 3, 18); tw(17, -10, 3, 18); tw(-17, 10, 3, 18); tw(17, 10, 3, 18); tw(0, 0, 4, 34); tw(-8, 8, 2.2, 26); tw(9, 7, 2.2, 24);
  for (let i = -3; i <= 3; i++) L.gb.box('#ffd890', x + i * 4 * s, y + 6 * s, z + 10.1 * s, 0.9 * s, 2.2 * s, 0.1);
  for (let i = -2; i <= 2; i++) L.gb.box('#ffd890', x + i * 3.5 * s, y + 15 * s, z + 7.1 * s, 0.8 * s, 1.8 * s, 0.1);
}
function noticeBoard(L, x, z, ry) {
  const b = L.b; b.begin(x, L.h(x, z), z, ry);
  b.add('cylS8', COL.woodD, -1.1, 1.2, 0, 0.15, 2.4, 0.15); b.add('cylS8', COL.woodD, 1.1, 1.2, 0, 0.15, 2.4, 0.15);
  b.box(COL.wood, 0, 0.9, 0, 2.4, 1.3, 0.1); b.add('roof', COL.woodD, 0, 2.3, 0, 2.7, 0.45, 0.6, 0, 0, 0);
  const papers = ['#f4ecd2', '#ece0c4', '#f8f0dc', '#e4d6b4'];
  for (let i = 0; i < 9; i++) { const px = rnd(-0.9, 0.9), py = rnd(1.15, 2.0); b.add('box', pick(papers), px, py, 0.06, rnd(0.25, 0.4), rnd(0.3, 0.45), 0.01, 0, 0, rnd(-0.15, 0.15), 0); b.add('sphS', '#b83a2a', px, py + 0.17, 0.07, 0.03, 0.03, 0.02); }
  b.end(); L.addBox(x, z, 1.25, 0.2, ry);
}
function fountain(L, x, z) {
  const b = L.b, y = L.h(x, z);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; b.add('box', pick([COL.stoneL, COL.stone]), x + Math.cos(a) * 2.9, y + 0.35, z + Math.sin(a) * 2.9, 0.5, 0.7, 1.2, 0, -a, 0, 0.04); }
  b.add('cylS', COL.stoneL, x, y + 1.3, z, 0.8, 2.2, 0.8); b.add('cylS', COL.stoneL, x, y + 2.4, z, 2.2, 0.25, 2.2); b.add('cylS', COL.stone, x, y + 3.0, z, 0.4, 1.1, 0.4); b.add('octa', COL.gold, x, y + 3.7, z, 0.5, 0.7, 0.5);
  const w = new T.Mesh(new T.CircleGeometry(2.75, 24), waterMaterial({ opacity: 0.92 })); w.rotation.x = -Math.PI / 2; w.position.set(x, y + 0.62, z); L.add(w);
  const w2 = new T.Mesh(new T.CircleGeometry(1.0, 16), waterMaterial({ opacity: 0.92 })); w2.rotation.x = -Math.PI / 2; w2.position.set(x, y + 2.55, z); L.add(w2);
  L.fountains = (L.fountains || []).concat([V3(x, y + 2.6, z)]);
  L.addCircle(x, z, 3.1);
}
function dummyProp(L, x, z) {
  const g = new T.Group(); const y = L.h(x, z);
  const top = new T.Group(); g.add(top);
  const m = (par, geo, c, px, py, pz, sx, sy, sz, rz = 0) => { const k = new T.Mesh(geo, TOON.mat(c)); k.position.set(px, py, pz); k.scale.set(sx, sy, sz); k.rotation.z = rz; k.castShadow = true; par.add(k); const ol = new T.Mesh(geo, TOON.outline); ol.position.copy(k.position); ol.scale.copy(k.scale); ol.rotation.copy(k.rotation); par.add(ol); return k; };
  m(g, prim('cylS8'), COL.woodD, 0, 0.5, 0, 0.16, 1.0, 0.16);
  m(top, prim('cylS'), '#d8c090', 0, 1.35, 0, 0.55, 0.9, 0.5); m(top, prim('cylS8'), COL.woodD, 0, 1.55, 0, 0.1, 1.3, 0.1, Math.PI / 2); m(top, prim('sphS'), '#d8c090', 0, 2.0, 0, 0.42, 0.42, 0.42);
  m(top, prim('box'), '#a83a2a', 0, 1.25, 0.26, 0.3, 0.3, 0.02);
  g.position.set(x, y, z); L.add(g); L.addCircle(x, z, 0.35);
  return { group: g, top, wobble: 0, t: 0 };
}
function windowView(night) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, 256);
  if (night) { sky.addColorStop(0, '#0a1024'); sky.addColorStop(1, '#25365a'); } else { sky.addColorStop(0, '#8fbcef'); sky.addColorStop(1, '#f6e0bc'); }
  g.fillStyle = sky; g.fillRect(0, 0, 256, 256);
  if (night) { g.fillStyle = '#f2efe0'; g.beginPath(); g.arc(196, 52, 14, 0, TAU); g.fill(); g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * 256, Math.random() * 130, 1.2, 1.2); }
  else { g.fillStyle = 'rgba(255,255,255,0.85)'; for (const [cx, cy, r] of [[50, 50, 18], [70, 44, 22], [92, 52, 16], [190, 70, 14], [208, 64, 18]]) { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); } }
  g.fillStyle = night ? '#121a2c' : '#8aa0b4';
  g.beginPath(); g.moveTo(0, 170); g.quadraticCurveTo(128, 110, 256, 165); g.lineTo(256, 256); g.lineTo(0, 256); g.fill();
  g.fillStyle = night ? '#0d1322' : '#7a8ca0';
  const tw = (x, w, h, roof) => { g.fillRect(x, 140 - h, w, h + 40); g.beginPath(); g.moveTo(x - 3, 140 - h); g.lineTo(x + w / 2, 140 - h - roof); g.lineTo(x + w + 3, 140 - h); g.fill(); };
  g.fillRect(90, 108, 80, 40); tw(84, 12, 50, 18); tw(164, 12, 48, 18); tw(122, 16, 72, 26); tw(104, 9, 36, 14); tw(147, 9, 40, 14);
  if (night) { g.fillStyle = '#ffd890'; for (let i = 0; i < 9; i++) g.fillRect(96 + i * 8, 118, 2, 4); g.fillRect(128, 92, 3, 5); }
  g.fillStyle = night ? '#1a1610' : '#a8803e';
  for (let i = 0; i < 4; i++) { const x = i * 70 - 10; g.beginPath(); g.moveTo(x, 256); g.lineTo(x + 35, 200 + (i % 2) * 12); g.lineTo(x + 70, 256); g.fill(); }
  if (night) { g.fillStyle = '#ffb860'; g.fillRect(52, 236, 6, 6); g.fillRect(190, 240, 6, 6); }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}
