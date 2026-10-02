// ---------- Temel yardımcılar ----------
const T = THREE;
const V3 = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, l, dt) => lerp(a, b, 1 - Math.exp(-l * dt));
const smooth = t => t * t * (3 - 2 * t);
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
function dampAngle(a, b, l, dt) { return a + angDiff(a, b) * (1 - Math.exp(-l * dt)); }
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let rng = mulberry32(7);
function seed(s) { rng = mulberry32(s); }
const rnd = (a = 0, b = 1) => a + (b - a) * rng();
const rndi = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(rng() * arr.length)];
const frand = (a = 0, b = 1) => a + (b - a) * Math.random();
function hash2(x, z) { const h = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return h - Math.floor(h); }
function noise2(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  const u = smooth(xf), v = smooth(zf);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
function fbm(x, z) { return noise2(x, z) * 0.5 + noise2(x * 2.1 + 3.1, z * 2.1 - 1.7) * 0.25 + noise2(x * 4.3 - 5, z * 4.3 + 2) * 0.125; }
function distXZ(a, b) { const dx = a.x - b.x, dz = a.z - b.z; return Math.sqrt(dx * dx + dz * dz); }
function distToSeg(px, pz, ax, az, bx, bz) {
  const vx = bx - ax, vz = bz - az, wx = px - ax, wz = pz - az;
  const l2 = vx * vx + vz * vz; let t = l2 ? (wx * vx + wz * vz) / l2 : 0; t = clamp(t, 0, 1);
  const dx = ax + vx * t - px, dz = az + vz * t - pz; return Math.sqrt(dx * dx + dz * dz);
}
function distToPath(px, pz, pts) { if (Array.isArray(pts[0][0])) { let m = 1e9; for (const q of pts) m = Math.min(m, distToPath(px, pz, q)); return m; } let d = 1e9; for (let i = 0; i < pts.length - 1; i++) d = Math.min(d, distToSeg(px, pz, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])); return d; }
function hexRGB(hex) { const c = new T.Color(hex); const o = { r: 0, g: 0, b: 0 }; c.getRGB(o, T.SRGBColorSpace); return o; }
function shade(hex, f) { const c = new T.Color(hex); c.multiplyScalar(f); return '#' + c.getHexString(); }
function mixHex(a, b, t) { const c = new T.Color(a); c.lerp(new T.Color(b), t); return '#' + c.getHexString(); }
const yaw = (dx, dz) => Math.atan2(dx, dz);

// Küresel oyun durumu
const G = {
  t: 0, dt: 0, rawDt: 0, timeScale: 1, slowmo: 0, hitstop: 0, paused: false,
  renderer: null, scene: null, camera: null, level: null, player: null,
  actors: [], allies: [], enemies: [], npcs: [],
  settings: { sens: 1, music: 0.7, sfx: 0.9, quality: 'high', invertY: false, textSpeed: 1, shiftLock: true, uiScale: 1.25 },
  inScript: false, controlEnabled: true, combat: false,
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
