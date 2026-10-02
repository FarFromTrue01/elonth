// ---------- Low-poly primitifler ve statik birleştirici ----------
const PRIM = {};
function roofGeo() {
  // Beşik çatı: genişlik x (1), derinlik z (1), yükseklik y (1); mahya z boyunca
  const g = new T.BufferGeometry();
  const A = [-0.5, 0, -0.5], B = [0.5, 0, -0.5], C = [0, 1, -0.5], D = [-0.5, 0, 0.5], E = [0.5, 0, 0.5], F = [0, 1, 0.5];
  const tri = [A, C, B, D, E, F, A, D, F, A, F, C, B, C, F, B, F, E, A, B, E, A, E, D];
  g.setAttribute('position', new T.Float32BufferAttribute(tri.flat(), 3));
  g.computeVertexNormals();
  return g;
}
function wedgeGeo() {
  // Rampa/kama: taban 1x1, arka yüz yüksek
  const g = new T.BufferGeometry();
  const a = [-0.5, 0, -0.5], b = [0.5, 0, -0.5], c = [0.5, 0, 0.5], d = [-0.5, 0, 0.5], e = [-0.5, 1, -0.5], f = [0.5, 1, -0.5];
  const tri = [a, b, c, a, c, d, a, e, f, a, f, b, d, c, f, d, f, e, a, d, e, b, f, c];
  g.setAttribute('position', new T.Float32BufferAttribute(tri.flat(), 3));
  g.computeVertexNormals();
  return g;
}
// Aynı konumdaki köşeleri birleştir (yumuşak normal için)
function mergeVertsSimple(g) {
  if (g.index) return g;
  const p = g.attributes.position, map = new Map(), idx = [], pos = [];
  for (let i = 0; i < p.count; i++) { const k = p.getX(i).toFixed(4) + ',' + p.getY(i).toFixed(4) + ',' + p.getZ(i).toFixed(4); let j = map.get(k); if (j === undefined) { j = pos.length / 3; map.set(k, j); pos.push(p.getX(i), p.getY(i), p.getZ(i)); } idx.push(j); }
  const ng = new T.BufferGeometry(); ng.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); ng.setIndex(idx); return ng;
}
function prim(type) {
  if (PRIM[type]) return PRIM[type];
  let g, smoothN = false;
  switch (type) {
    case 'box': g = new T.BoxGeometry(1, 1, 1); break;
    case 'boxb': g = new T.BoxGeometry(1, 1, 1); g.translate(0, 0.5, 0); break; // taban sıfırda
    case 'cyl5': g = new T.CylinderGeometry(0.5, 0.5, 1, 5); break;
    case 'cyl6': g = new T.CylinderGeometry(0.5, 0.5, 1, 6); break;
    case 'cyl8': g = new T.CylinderGeometry(0.5, 0.5, 1, 8); break;
    case 'cyl12': g = new T.CylinderGeometry(0.5, 0.5, 1, 12); break;
    case 'cyl16': g = new T.CylinderGeometry(0.5, 0.5, 1, 16); break;
    case 'tcyl6': g = new T.CylinderGeometry(0.38, 0.5, 1, 6); break;
    case 'tcyl8': g = new T.CylinderGeometry(0.3, 0.5, 1, 8); break;
    case 'cone4': g = new T.ConeGeometry(0.5, 1, 4); g.rotateY(Math.PI / 4); break;
    case 'cone5': g = new T.ConeGeometry(0.5, 1, 5); break;
    case 'cone6': g = new T.ConeGeometry(0.5, 1, 6); break;
    case 'cone8': g = new T.ConeGeometry(0.5, 1, 8); break;
    case 'cone12': g = new T.ConeGeometry(0.5, 1, 12); break;
    case 'ico0': g = new T.IcosahedronGeometry(0.5, 0); break;
    case 'ico1': g = new T.IcosahedronGeometry(0.5, 1); break;
    case 'dode': g = new T.DodecahedronGeometry(0.5, 0); break;
    case 'octa': g = new T.OctahedronGeometry(0.5, 0); break;
    case 'tetra': g = new T.TetrahedronGeometry(0.5, 0); break;
    case 'sph8': g = new T.SphereGeometry(0.5, 8, 6); break;
    case 'sph12': g = new T.SphereGeometry(0.5, 12, 8); break;
    case 'roof': g = roofGeo(); break;
    case 'wedge': g = wedgeGeo(); break;
    case 'plane': g = new T.PlaneGeometry(1, 1); break;
    case 'torus': g = new T.TorusGeometry(0.5, 0.06, 4, 16); break;
    // yumuşak gölgeli (smooth) türler
    case 'sphS': g = new T.SphereGeometry(0.5, 14, 10); smoothN = true; break;
    case 'cylS': g = new T.CylinderGeometry(0.5, 0.5, 1, 14); smoothN = true; break;
    case 'cylS8': g = new T.CylinderGeometry(0.5, 0.5, 1, 8); smoothN = true; break;
    case 'trunk': g = new T.CylinderGeometry(0.32, 0.5, 1, 8, 3); { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), a = Math.atan2(p.getX(i), p.getZ(i)); const k = 1 + 0.08 * Math.sin(a * 3 + y * 4); p.setX(i, p.getX(i) * k + Math.sin(y * 2.5) * 0.05); p.setZ(i, p.getZ(i) * k); } } smoothN = true; break;
    case 'coneS': g = new T.ConeGeometry(0.5, 1, 12, 2); smoothN = true; break;
    case 'pineL': g = new T.ConeGeometry(0.5, 1, 10, 2); { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < -0.45) { const a = Math.atan2(p.getX(i), p.getZ(i)); const k = 1 + 0.12 * Math.sin(a * 5); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); p.setY(i, y - 0.08 * (1 + Math.sin(a * 5))); } } } smoothN = true; break;
    case 'blob1': case 'blob2': case 'blob3': case 'blob4': {
      g = new T.IcosahedronGeometry(0.5, 2); const sd = { blob1: 1.3, blob2: 4.7, blob3: 9.1, blob4: 13.3 }[type];
      const p = g.attributes.position, v = new T.Vector3(); const map = new Map();
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = v.x.toFixed(3) + v.y.toFixed(3) + v.z.toFixed(3); let f = map.get(k); if (f === undefined) { f = 1 + 0.16 * Math.sin(v.x * 9 + sd) * Math.cos(v.z * 8 - sd) + 0.08 * Math.sin(v.y * 13 + sd * 2); map.set(k, f); } v.multiplyScalar(f); if (v.y < -0.2) v.y = -0.2 + (v.y + 0.2) * 0.6; p.setXYZ(i, v.x, v.y, v.z); }
      g = T.BufferGeometryUtils ? g : g; g = mergeVertsSimple(g); smoothN = true; break;
    }
    default: throw new Error('prim ' + type);
  }
  if (smoothN) { g.computeVertexNormals(); if (g.index) g = g.toNonIndexed(); }
  else { if (g.index) g = g.toNonIndexed(); g.computeVertexNormals(); }
  g.deleteAttribute('uv');
  g.computeBoundingSphere();
  PRIM[type] = g;
  return g;
}

const _m4 = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _sv = new T.Vector3(), _pv = new T.Vector3(), _n3 = new T.Matrix3();
function mkMatrix(px, py, pz, rx, ry, rz, sx, sy, sz) {
  _e.set(rx, ry, rz, 'YXZ'); _q.setFromEuler(_e); _pv.set(px, py, pz); _sv.set(sx, sy, sz);
  return new T.Matrix4().compose(_pv, _q, _sv);
}

class Builder {
  constructor(chunk = 40) { this.parts = []; this.chunk = chunk; this.stack = [new T.Matrix4()]; this.jit = 0.07; }
  get top() { return this.stack[this.stack.length - 1]; }
  begin(x = 0, y = 0, z = 0, ry = 0, s = 1) { const m = mkMatrix(x, y, z, 0, ry, 0, s, s, s); this.stack.push(this.top.clone().multiply(m)); return this; }
  beginM(m) { this.stack.push(this.top.clone().multiply(m)); return this; }
  end() { if (this.stack.length > 1) this.stack.pop(); return this; }
  // tip, renk, konum, döndürme, ölçek
  add(type, color, px, py, pz, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0, jit) {
    const m = this.top.clone().multiply(mkMatrix(px, py, pz, rx, ry, rz, sx, sy, sz));
    this.parts.push({ geo: prim(type), m, color, jit: jit === undefined ? this.jit : jit });
    return this;
  }
  addGeo(geo, color, matrixWorld, jit = 0) { this.parts.push({ geo, m: this.top.clone().multiply(matrixWorld), color, jit }); }
  // ölçeği taban tabanlı kutu (y=0 tabanda)
  box(color, x, y, z, w, h, d, ry = 0, rx = 0, rz = 0) { return this.add('boxb', color, x, y, z, w, h, d, rx, ry, rz); }
  build(material, opts = {}) {
    const groups = new Map();
    for (const p of this.parts) {
      const key = this.chunk ? Math.floor(p.m.elements[12] / this.chunk) + ',' + Math.floor(p.m.elements[14] / this.chunk) : '0';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    const root = new T.Group();
    const c = new T.Color(), v = new T.Vector3(), n = new T.Vector3();
    for (const [, parts] of groups) {
      let count = 0; for (const p of parts) count += p.geo.attributes.position.count;
      const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3), colr = new Float32Array(count * 3);
      let o = 0;
      for (const p of parts) {
        const P = p.geo.attributes.position, N = p.geo.attributes.normal;
        _n3.getNormalMatrix(p.m);
        c.set(p.color);
        if (p.jit) { const f = 1 + (rng() - 0.5) * 2 * p.jit; c.multiplyScalar(f); }
        for (let i = 0; i < P.count; i++) {
          v.fromBufferAttribute(P, i).applyMatrix4(p.m);
          n.fromBufferAttribute(N, i).applyMatrix3(_n3).normalize();
          pos[o * 3] = v.x; pos[o * 3 + 1] = v.y; pos[o * 3 + 2] = v.z;
          nor[o * 3] = n.x; nor[o * 3 + 1] = n.y; nor[o * 3 + 2] = n.z;
          colr[o * 3] = c.r; colr[o * 3 + 1] = c.g; colr[o * 3 + 2] = c.b;
          o++;
        }
      }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(pos, 3));
      g.setAttribute('normal', new T.BufferAttribute(nor, 3));
      g.setAttribute('color', new T.BufferAttribute(colr, 3));
      g.computeBoundingSphere();
      const mesh = new T.Mesh(g, material);
      mesh.castShadow = opts.cast !== false; mesh.receiveShadow = opts.receive !== false;
      mesh.matrixAutoUpdate = false;
      root.add(mesh);
    }
    this.parts = [];
    return root;
  }
}

const MAT = {};
function initMaterials() {
  MAT.static = new T.MeshToonMaterial({ vertexColors: true, gradientMap: TOON.gradSoft });
  MAT.glow = new T.MeshBasicMaterial({ vertexColors: true, fog: true });
  MAT.water = new T.MeshLambertMaterial({ color: '#3d7a8c', transparent: true, opacity: 0.82, emissive: '#0d2a33' });
}
const matCache = {};
function lam(hex) { return matCache[hex] || (matCache[hex] = new T.MeshLambertMaterial({ color: hex })); }
