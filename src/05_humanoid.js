// ---------- Low-poly insan modeli ve prosedürel animasyon ----------
const _v3a = new T.Vector3();
const SKIN = { pale: '#efd2b5', light: '#e2bb94', tan: '#c8946a', brown: '#9a6642', dark: '#6e4529' };
const POSE_KEYS = ['lift', 'roll', 'rollZ', 'bob', 'hipY', 'spX', 'spY', 'spZ', 'hdX', 'hdY', 'hdZ', 'shLx', 'shLy', 'shLz', 'elL', 'shRx', 'shRy', 'shRz', 'elR', 'lgLx', 'lgLz', 'knL', 'lgRx', 'lgRz', 'knR'];
function blankPose() { const p = {}; for (const k of POSE_KEYS) p[k] = 0; return p; }

// Aksiyon anahtar kareleri: t (0-1) ve alanlar
const ACTIONS = {
  jab: { dur: 0.34, keys: [{ t: 0, shRx: -0.6, elR: -1.6, spY: 0.2 }, { t: 0.3, shRx: -1.55, elR: -0.05, shRz: 0.05, spY: -0.45, spX: 0.1 }, { t: 0.55, shRx: -1.5, elR: -0.1, spY: -0.4 }, { t: 1, shRx: -0.7, elR: -1.6, spY: 0 }] },
  cross: { dur: 0.36, keys: [{ t: 0, shLx: -0.6, elL: -1.6, spY: -0.2 }, { t: 0.3, shLx: -1.55, elL: -0.05, spY: 0.5, spX: 0.12 }, { t: 0.55, shLx: -1.5, elL: -0.1, spY: 0.45 }, { t: 1, shLx: -0.7, elL: -1.6, spY: 0 }] },
  hook: { dur: 0.5, keys: [{ t: 0, shRx: -0.5, shRz: -0.9, elR: -1.7, spY: 0.6, lift: -0.05 }, { t: 0.3, shRx: -1.4, shRz: -1.3, elR: -1.1, spY: -0.8, spX: 0.15, lgLx: -0.4, knL: 0.4 }, { t: 0.55, shRx: -1.3, shRz: -0.9, elR: -1.2, spY: -0.9 }, { t: 1, shRx: -0.6, shRz: 0, elR: -1.5, spY: 0 }] },
  kick: { dur: 0.62, keys: [{ t: 0, lgRx: 0.3, knR: 0.8, spX: 0 }, { t: 0.25, lgRx: -0.6, knR: 1.6, spX: -0.15, shLx: -0.8, shRx: 0.4 }, { t: 0.42, lgRx: -1.45, knR: 0.1, spX: -0.3, shLx: -0.9, shRx: 0.5, shLz: 0.5, shRz: -0.5 }, { t: 0.62, lgRx: -1.3, knR: 0.25, spX: -0.25 }, { t: 1, lgRx: 0, knR: 0, spX: 0, shLx: 0, shRx: 0, shLz: 0.1, shRz: -0.1 }] },
  swing: { dur: 0.52, keys: [{ t: 0, shRx: -2.7, shRz: -0.2, elR: -0.5, spY: 0.5, spX: -0.1 }, { t: 0.32, shRx: -0.5, shRz: 0, elR: -0.1, spY: -0.5, spX: 0.3 }, { t: 0.5, shRx: -0.2, elR: -0.1, spY: -0.6, spX: 0.3 }, { t: 1, shRx: -0.8, elR: -0.9, spY: 0, spX: 0 }] },
  sweep: { dur: 0.5, keys: [{ t: 0, shRx: -1.3, shRz: 0.6, elR: -0.3, spY: 0.9 }, { t: 0.35, shRx: -1.4, shRz: -1.1, elR: -0.1, spY: -0.9, spX: 0.15 }, { t: 0.55, shRx: -1.2, shRz: -1.3, spY: -1.0 }, { t: 1, shRx: -0.8, shRz: 0, elR: -0.9, spY: 0 }] },
  overhead: { dur: 0.7, keys: [{ t: 0, shRx: -2.9, shLx: -2.9, elR: -0.6, elL: -0.6, spX: -0.25, lift: 0.02 }, { t: 0.4, shRx: -3.0, shLx: -3.0, elR: -0.3, elL: -0.3, spX: -0.3 }, { t: 0.58, shRx: -0.4, shLx: -0.4, elR: 0, elL: 0, spX: 0.5, lift: -0.1, lgLx: -0.5, knL: 0.6, knR: 0.3 }, { t: 1, shRx: -0.6, shLx: -0.6, elR: -0.6, elL: -0.6, spX: 0, lift: 0 }] },
  roll: { dur: 0.46, keys: [{ t: 0, roll: 0, lift: 0, lgLx: -0.5, knL: 1, lgRx: -0.5, knR: 1, spX: 0.4, shLx: -0.8, shRx: -0.8, elL: -1.4, elR: -1.4 }, { t: 0.15, roll: 0.6, lift: -0.15, lgLx: -1.6, knL: 2.2, lgRx: -1.6, knR: 2.2, spX: 0.8 }, { t: 0.75, roll: TAU - 0.4, lift: -0.15, lgLx: -1.6, knL: 2.2, lgRx: -1.6, knR: 2.2, spX: 0.8 }, { t: 1, roll: TAU, lift: 0, lgLx: 0, knL: 0.2, lgRx: 0, knR: 0.2, spX: 0.1, shLx: -0.4, shRx: -0.4 }] },
  hop: { dur: 0.42, keys: [{ t: 0, spX: 0.1, lift: -0.08, knL: 0.5, knR: 0.5, lgLx: -0.3, lgRx: -0.3 }, { t: 0.4, spX: -0.15, lift: 0.08, lgLx: 0.3, lgRx: 0.3, shLz: 0.7, shRz: -0.7 }, { t: 1, spX: 0, lift: 0 }] },
  hit: { dur: 0.36, keys: [{ t: 0, spX: 0 }, { t: 0.2, spX: -0.45, hdX: -0.4, shLz: 0.7, shRz: -0.7, shLx: -0.4, shRx: -0.4, elL: -0.8, elR: -0.8, lift: -0.04 }, { t: 1, spX: 0, hdX: 0, shLz: 0.1, shRz: -0.1, shLx: 0, shRx: 0 }] },
  knock: { dur: 1.5, keys: [{ t: 0, roll: 0, lift: 0 }, { t: 0.18, roll: -1.2, lift: -0.15, shLz: 1.2, shRz: -1.2, lgLx: -0.6, lgRx: -0.3 }, { t: 0.28, roll: -1.57, lift: -0.43, shLz: 1.4, shRz: -1.4, lgLx: -0.2, lgRx: -0.4, knR: 0.6 }, { t: 0.62, roll: -1.57, lift: -0.43, hdX: -0.3 }, { t: 0.82, roll: -0.6, lift: -0.4, spX: 0.6, lgLx: -1.4, knL: 2.2, lgRx: -1.4, knR: 2.2, shLx: 0.5, shRx: 0.5 }, { t: 1, roll: 0, lift: 0, spX: 0, lgLx: 0, knL: 0, lgRx: 0, knR: 0, shLx: 0, shRx: 0, shLz: 0.1, shRz: -0.1 }] },
  wave: { dur: 1.6, keys: [{ t: 0, shRz: -0.1 }, { t: 0.15, shRz: -2.5, elR: -0.5 }, { t: 0.3, shRz: -2.6, elR: -0.9 }, { t: 0.45, shRz: -2.5, elR: -0.3 }, { t: 0.6, shRz: -2.6, elR: -0.9 }, { t: 0.75, shRz: -2.5, elR: -0.4 }, { t: 1, shRz: -0.1, elR: 0 }] },
  point: { dur: 1.6, keys: [{ t: 0, shRx: 0 }, { t: 0.2, shRx: -1.5, shRz: -0.2, elR: 0, spY: -0.15 }, { t: 0.8, shRx: -1.5, shRz: -0.2, elR: 0, spY: -0.15 }, { t: 1, shRx: 0, shRz: -0.1, elR: -0.1, spY: 0 }] },
  bow: { dur: 1.6, keys: [{ t: 0, spX: 0 }, { t: 0.3, spX: 0.9, hdX: 0.3, shLx: 0.2, shRx: 0.2 }, { t: 0.7, spX: 0.9, hdX: 0.3 }, { t: 1, spX: 0, hdX: 0 }] },
  nod: { dur: 0.8, keys: [{ t: 0, hdX: 0 }, { t: 0.25, hdX: 0.35 }, { t: 0.5, hdX: -0.05 }, { t: 0.75, hdX: 0.3 }, { t: 1, hdX: 0 }] },
  shake: { dur: 0.9, keys: [{ t: 0, hdY: 0 }, { t: 0.2, hdY: 0.4 }, { t: 0.45, hdY: -0.4 }, { t: 0.7, hdY: 0.35 }, { t: 1, hdY: 0 }] },
  laugh: { dur: 1.6, keys: [{ t: 0, spX: 0, hdX: 0 }, { t: 0.15, spX: -0.25, hdX: -0.4, shLx: -0.3, shRx: -0.3, elL: -1.4, elR: -1.4 }, { t: 0.3, spX: 0.2, hdX: 0.1 }, { t: 0.45, spX: -0.2, hdX: -0.35 }, { t: 0.6, spX: 0.25, hdX: 0.15 }, { t: 0.75, spX: -0.15, hdX: -0.3 }, { t: 1, spX: 0, hdX: 0, shLx: 0, shRx: 0, elL: 0, elR: 0 }] },
  shrug: { dur: 1, keys: [{ t: 0, shLz: 0.1 }, { t: 0.3, shLz: 0.5, shRz: -0.5, elL: -1.5, elR: -1.5, shLy: 0.5, shRy: -0.5, hdZ: 0.2 }, { t: 0.7, shLz: 0.5, shRz: -0.5, elL: -1.5, elR: -1.5 }, { t: 1, shLz: 0.1, shRz: -0.1, elL: 0, elR: 0, shLy: 0, shRy: 0, hdZ: 0 }] },
  reach: { dur: 1.4, keys: [{ t: 0, shRx: 0 }, { t: 0.4, shRx: -1.3, elR: -0.1, spX: 0.15 }, { t: 1, shRx: -1.3, elR: -0.1, spX: 0.15 }] },
  push: { dur: 0.6, keys: [{ t: 0, shRx: -0.6, shLx: -0.6, elR: -1.4, elL: -1.4 }, { t: 0.35, shRx: -1.5, shLx: -1.5, elR: 0, elL: 0, spX: 0.25 }, { t: 1, shRx: 0, shLx: 0, elR: 0, elL: 0, spX: 0 }] },
  flinch: { dur: 0.7, keys: [{ t: 0, spX: 0 }, { t: 0.2, spX: 0.4, hdX: 0.4, shLx: -1.8, shRx: -1.8, elL: -2, elR: -2, lift: -0.08, knL: 0.3, knR: 0.3 }, { t: 0.7, spX: 0.4, hdX: 0.4, shLx: -1.8, shRx: -1.8, elL: -2, elR: -2 }, { t: 1, spX: 0, hdX: 0, shLx: 0, shRx: 0, elL: 0, elR: 0, lift: 0, knL: 0, knR: 0 }] },
  stomp: { dur: 0.6, keys: [{ t: 0, lgRx: 0 }, { t: 0.3, lgRx: -0.9, knR: 1.2 }, { t: 0.5, lgRx: -0.1, knR: 0.1, spX: 0.2 }, { t: 1, lgRx: 0, knR: 0, spX: 0 }] },
  hug: { dur: 2.0, keys: [{ t: 0, shLx: 0 }, { t: 0.25, shLx: -1.3, shRx: -1.3, shLz: -0.3, shRz: 0.3, elL: -1.2, elR: -1.2, spX: 0.15 }, { t: 0.85, shLx: -1.3, shRx: -1.3, shLz: -0.3, shRz: 0.3, elL: -1.2, elR: -1.2, spX: 0.15 }, { t: 1, shLx: 0, shRx: 0, shLz: 0.1, shRz: -0.1, elL: 0, elR: 0, spX: 0 }] },
  facepalm: { dur: 1.5, keys: [{ t: 0, shRx: 0 }, { t: 0.3, shRx: -2.3, shRz: 0.45, elR: -2.2, hdX: 0.3 }, { t: 0.8, shRx: -2.3, shRz: 0.45, elR: -2.2, hdX: 0.3 }, { t: 1, shRx: 0, shRz: -0.1, elR: 0, hdX: 0 }] },
  jump: { dur: 0.5, keys: [{ t: 0, lift: 0 }, { t: 0.2, lift: -0.1, knL: 0.6, knR: 0.6, lgLx: -0.4, lgRx: -0.4 }, { t: 0.5, lift: 0.25, shLz: 2.4, shRz: -2.4, knL: 0.1, knR: 0.1, lgLx: 0, lgRx: 0 }, { t: 0.8, lift: 0.1, shLz: 2.2, shRz: -2.2 }, { t: 1, lift: 0, shLz: 0.1, shRz: -0.1 }] },
  pickup: { dur: 1.2, keys: [{ t: 0, spX: 0 }, { t: 0.4, spX: 1.0, lift: -0.25, knL: 0.8, knR: 0.8, lgLx: -0.6, lgRx: -0.6, shRx: -1.2, elR: -0.2, hdX: 0.2 }, { t: 0.6, spX: 1.0, lift: -0.25, knL: 0.8, knR: 0.8, lgLx: -0.6, lgRx: -0.6, shRx: -1.2 }, { t: 1, spX: 0, lift: 0, knL: 0, knR: 0, lgLx: 0, lgRx: 0, shRx: 0, hdX: 0 }] },
};

// Duruşlar: dinlenme pozunun yerini alır
const STANCES = {
  fight: { full: false, p: { shLx: -0.9, shLz: 0.25, elL: -1.9, shRx: -0.75, shRz: -0.25, elR: -2.0, spX: 0.08, hdX: 0.08, knL: 0.15, knR: 0.15, lift: -0.02 } },
  armed: { full: false, p: { shLx: -0.3, shLz: 0.2, elL: -0.6, shRx: -0.8, shRz: -0.2, elR: -0.9, spX: 0.06, knL: 0.15, knR: 0.15, lift: -0.02 } },
  crossArms: { full: false, p: { shLx: -0.55, shLz: -0.25, elL: -1.9, shLy: 0.5, shRx: -0.5, shRz: 0.25, elR: -1.9, shRy: -0.5 } },
  hips: { full: false, p: { shLz: 0.7, elL: -1.3, shLy: 0.6, shRz: -0.7, elR: -1.3, shRy: -0.6, shLx: 0.2, shRx: 0.2 } },
  behind: { full: false, p: { shLx: 0.35, shRx: 0.35, elL: -0.5, elR: -0.5, shLz: -0.1, shRz: 0.1 } },
  pray: { full: false, p: { shLx: -0.9, shRx: -0.9, shLz: -0.35, shRz: 0.35, elL: -1.4, elR: -1.4, hdX: 0.25 } },
  weak: { full: false, p: { spX: 0.35, hdX: 0.35, shLz: 0.05, shRz: -0.05, shLx: 0.1, shRx: 0.1, knL: 0.2, knR: 0.2, lift: -0.04 } },
  carried: { full: false, p: { spX: 0.25, hdX: 0.45, shLz: 1.3, shRz: -1.3, elL: -0.3, elR: -0.3, knL: 0.3, knR: 0.3, lift: -0.06 } },
  support: { full: false, p: { shRz: -1.1, elR: -1.4, shRx: -0.2 } },
  supportL: { full: false, p: { shLz: 1.1, elL: -1.4, shLx: -0.2 } },
  lantern: { full: false, p: { shRx: -0.9, elR: -0.6 } },
  carry: { full: false, p: { shLx: -0.85, shRx: -0.85, shLz: -0.15, shRz: 0.15, elL: -1.25, elR: -1.25 } },
  cry: { full: false, p: { shLx: -1.9, shRx: -1.9, shLz: -0.45, shRz: 0.45, elL: -2.4, elR: -2.4, hdX: 0.45, spX: 0.25 } },
  think: { full: false, p: { shRx: -1.1, shRz: 0.3, elR: -2.3, shLx: -0.5, shLz: -0.3, elL: -1.6, hdX: 0.1, hdZ: 0.12 } },
  ride: { full: true, p: { lift: -0.48, lgLx: -0.5, knL: 0.9, lgRx: -0.5, knR: 0.9, lgLz: 0.45, lgRz: -0.45, shLx: -0.45, shRx: -0.45, elL: -0.6, elR: -0.6 } },
  sit: { full: true, p: { lift: -0.48, lgLx: -1.55, knL: 1.55, lgRx: -1.5, knR: 1.6, lgLz: 0.06, lgRz: -0.06, shLx: -0.45, shRx: -0.45, elL: -0.6, elR: -0.6 } },
  sitGround: { full: true, p: { lift: -0.86, lgLx: -1.45, knL: 0.3, lgRx: -1.45, knR: 0.35, shLx: 0.4, shRx: 0.4, elL: -0.2, elR: -0.2, spX: -0.1 } },
  sitSlope: { full: true, p: { lift: -0.8, lgLx: -1.12, knL: 0.55, lgRx: -1.18, knR: 0.48, shLx: 0.45, shRx: 0.45, elL: -0.2, elR: -0.2, spX: -0.12 } },
  hugKnees: { full: true, p: { lift: -0.82, lgLx: -2.4, knL: 2.5, lgRx: -2.4, knR: 2.5, spX: 0.55, hdX: 0.5, shLx: -1.2, shRx: -1.2, shLz: -0.2, shRz: 0.2, elL: -0.4, elR: -0.4 } },
  kneel: { full: true, p: { lift: -0.45, lgLx: -1.45, knL: 1.5, lgRx: 0.15, knR: 1.75, spX: 0.1 } },
  kneel2: { full: true, p: { lift: -0.5, lgLx: 0.05, knL: 1.65, lgRx: 0.05, knR: 1.65, spX: 0.45, hdX: 0.4, shLx: -0.5, shRx: -0.5, elL: -0.2, elR: -0.2 } },
  allfours: { full: true, p: { lift: -0.52, lgLx: -0.3, knL: 1.8, lgRx: -0.2, knR: 1.75, spX: 1.25, hdX: -0.6, shLx: -1.2, shRx: -1.2, elL: -0.1, elR: -0.1 } },
  crouch: { full: true, p: { lift: -0.38, lgLx: -1.2, knL: 2.1, lgRx: -0.9, knR: 1.9, spX: 0.45, shLx: -0.6, shRx: -0.6, elL: -0.8, elR: -0.8 } },
  lie: { full: true, p: { roll: -1.5708, lift: -0.42, shLz: 0.15, shRz: -0.15, hdX: 0 } },
  lieSide: { full: true, p: { rollZ: 1.5708, lift: -0.4, lgLx: -0.5, knL: 0.8, lgRx: -0.3, knR: 0.5, shLx: -0.6, shRx: -0.9, elL: -0.8, elR: -0.6, spX: 0.2, hdX: 0.2 } },
  lieFace: { full: true, p: { roll: 1.5708, lift: -0.42, shLz: 0.4, shRz: -0.4, hdY: 0.6 } },
};


// Poz bileşimi (yürüme, duruş, aksiyon, bakış): Humanoid ve VRMHumanoid ortak kullanır
class PoseRig {
  setStance(name, instant) { if (name === this.stanceName) return; this.prevStance = this.stance; this.prevW = this.stanceW; this.stance = name ? STANCES[name] : null; this.stanceName = name; this.stanceW = instant ? 1 : 0; if (instant) this.prevW = 0; }
  setUpper(name) { this.upperSt = name; this.upperW = 0; }
  play(name, speedMul = 1) { const a = ACTIONS[name]; if (!a) return 0; this.act = { a, t: 0, dur: a.dur / speedMul, name }; return this.act.dur; }
  stop() { this.act = null; }
  flash(color = '#ffffff', t = 0.12) { this.flashT = t; for (const m of this.allMats) { m.emissive.set(color); } }
  // base: hareket + nefes; poz bileşimi
  update(dt, speed) {
    const p = this.base, o = this.o; for (const k of POSE_KEYS) p[k] = 0;
    const t = G.t + this.idleSeed;
    p.shLz = 0.09; p.shRz = -0.09; p.elL = -0.12; p.elR = -0.12;
    p.spX = 0.015 * Math.sin(t * 1.7) * this.breathe; p.shLz += 0.015 * Math.sin(t * 1.7); p.shRz -= 0.015 * Math.sin(t * 1.7);
    p.hdY = 0.08 * Math.sin(t * 0.37); p.hdX = 0.03 * Math.sin(t * 0.53);
    const st = this.stance;
    const full = st && st.full;
    if (speed > 0.05 && !full) {
      const walkS = 1.6, a = clamp(speed / walkS, 0, 1), r = clamp((speed - 2.2) / 2.3, 0, 1);
      this.phase += dt * (speed * (r > 0 ? 2.3 : 3.6) + 1.2 * a) / Math.max(0.7, o.scale);
      const ph = this.phase, s = Math.sin(ph), c = Math.cos(ph);
      const amp = (0.42 + 0.35 * r) * a;
      p.lgLx = -s * amp; p.lgRx = s * amp;
      p.knL = (0.12 + Math.max(0, c) * (0.55 + 0.7 * r)) * a; p.knR = (0.12 + Math.max(0, -c) * (0.55 + 0.7 * r)) * a;
      p.shLx = s * (0.4 + 0.45 * r) * a; p.shRx = -s * (0.4 + 0.45 * r) * a;
      p.elL = -0.2 - 1.0 * r; p.elR = -0.2 - 1.0 * r;
      p.bob = Math.abs(c) * (0.03 + 0.05 * r) * a - 0.02 * r;
      p.spX += 0.06 * a + 0.16 * r; p.spY = s * 0.1 * a; p.hdY = -s * 0.06 * a;
      this.stepPhase = ph;
    } else if (!full) { this.phase = 0; }
    // duruş
    if (st) { this.stanceW = Math.min(1, this.stanceW + dt * 5); }
    const P = this.pose;
    for (const k of POSE_KEYS) P[k] = p[k];
    const blendIn = (src, w, keepLegs) => { for (const k in src) { if (keepLegs && speed > 0.05 && (k[0] === 'l' || k[0] === 'k' || k === 'lift')) continue; P[k] = lerp(P[k], src[k] + (k === 'spX' || k === 'hdX' ? p[k] * 0.3 : 0), w); } };
    if (this.prevStance && this.prevW > 0) { this.prevW = Math.max(0, this.prevW - dt * 4); blendIn(this.prevStance.p, smooth(this.prevW) * (1 - smooth(this.stanceW)), !this.prevStance.full); }
    if (st) blendIn(st.p, smooth(this.stanceW), !st.full);
    if (this.upperSt) { this.upperW = Math.min(1, (this.upperW || 0) + dt * 4); const up = STANCES[this.upperSt].p, w = smooth(this.upperW); for (const k in up) { if (k[0] === 'l' || k[0] === 'k' || k === 'roll' || k === 'rollZ') continue; P[k] = lerp(P[k], up[k] + (k === 'lift' ? P.lift : 0), w); } }
    // aksiyon
    if (this.act) {
      const A = this.act; A.t += dt; const u = clamp(A.t / A.dur, 0, 1);
      const keys = A.a.keys; const vals = {};
      // anahtarlarda eksik alanları ileri taşı
      let i = 0; while (i < keys.length - 1 && keys[i + 1].t <= u) i++;
      const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
      const f = k1 === k0 ? 1 : smooth(clamp((u - k0.t) / (k1.t - k0.t), 0, 1));
      const val = (key, idx) => { for (let j = idx; j >= 0; j--) if (keys[j][key] !== undefined) return keys[j][key]; return P[key]; };
      const fields = A.fields || (A.fields = [...new Set(keys.flatMap(k => Object.keys(k)).filter(k => k !== 't'))]);
      const w = Math.min(1, u / 0.06, (1 - u) / 0.12 + 0.0001);
      for (const key of fields) { const v = lerp(val(key, i), val(key, Math.min(i + 1, keys.length - 1)), f); P[key] = lerp(P[key], v, clamp(w, 0, 1)); }
      if (A.t >= A.dur) this.act = A.hold ? A : null;
    }
    // bakış
    if (this.lookTarget) {
      const wp = this.root.position, lt = this.lookTarget.isVector3 ? this.lookTarget : this.lookTarget.position;
      const ya = Math.atan2(lt.x - wp.x, lt.z - wp.z) - this.root.rotation.y;
      const want = clamp(angDiff(0, ya), -1.1, 1.1);
      this.lookYaw = damp(this.lookYaw, Math.abs(angDiff(0, ya)) > 2.2 ? 0 : want, 6, dt);
      const dy = (lt.y + (this.lookTarget.isVector3 ? 0 : 1.4 * (this.lookTarget.scale ? this.lookTarget.scale.x : 1))) - (wp.y + this.D.height * this.o.scale * 0.92);
      const dist = Math.max(0.5, Math.hypot(lt.x - wp.x, lt.z - wp.z));
      this.lookPitch = damp(this.lookPitch, clamp(-Math.atan2(dy, dist), -0.5, 0.5), 6, dt);
    } else { this.lookYaw = damp(this.lookYaw, 0, 4, dt); this.lookPitch = damp(this.lookPitch, 0, 4, dt); }
    P.hdY += this.lookYaw * 0.75; P.spY += this.lookYaw * 0.25; P.hdX += this.lookPitch;
    this.apply(P, dt, speed);
    // göz kırpma, konuşma
    this.updateFace(dt);
    if (this.flashT > 0) { this.flashT -= dt; if (this.flashT <= 0) for (const m of this.allMats) m.emissive.set('#000000'); }
  }
  setWeapon(type) {
    if (this.weapon) { this.handR.remove(this.weapon); this.weapon = null; }
    if (!type) return;
    const g = new T.Group(); g.position.set(0, -0.06, 0.02);
    const add = (geo, c, m) => { const k = c; const mesh = new T.Mesh(geo, this.mat(k)); mesh.applyMatrix4(m); mesh.castShadow = true; g.add(mesh); const ol = new T.Mesh(geo, TOON.outline); ol.applyMatrix4(m); g.add(ol); return mesh; };
    const B = () => new T.BoxGeometry(1, 1, 1), C = (n = 8) => new T.CylinderGeometry(0.5, 0.5, 1, n), Sp = () => sphGeo(10, 8);
    if (type === 'stick') { add(C(6), '#7a5434', mtx(0, 0, 0.32, 0.05, 0.95, 0.05, Math.PI / 2)); }
    if (type === 'sword') { add(B(), '#d8dde3', mtx(0, 0, 0.52, 0.025, 0.06, 0.82)); add(B(), '#c9a85a', mtx(0, 0, 0.1, 0.2, 0.04, 0.04)); add(C(), '#4a3020', mtx(0, 0, 0, 0.035, 0.16, 0.035, Math.PI / 2)); }
    if (type === 'woodsword') { add(B(), '#a77b4e', mtx(0, 0, 0.42, 0.03, 0.06, 0.66)); add(B(), '#6a4a2e', mtx(0, 0, 0.08, 0.16, 0.04, 0.04)); }
    if (type === 'staff') { add(C(6), '#4a3424', mtx(0, 0.55, 0, 0.045, 1.7, 0.045)); const gm = new T.Mesh(new T.OctahedronGeometry(0.5), new T.MeshBasicMaterial({ color: '#bff0ff' })); gm.scale.set(0.12, 0.18, 0.12); gm.position.set(0, 1.45, 0); g.add(gm); }
    if (type === 'lantern') { add(B(), '#3a3026', mtx(0, -0.12, 0, 0.12, 0.16, 0.12)); const l = new T.Mesh(new T.BoxGeometry(0.09, 0.12, 0.09), new T.MeshBasicMaterial({ color: '#ffcf70' })); l.position.set(0, -0.12, 0); g.add(l); }
    if (type === 'bucket') { add(C(10), '#6a5038', mtx(0, -0.2, 0, 0.22, 0.24, 0.22)); }
    if (type === 'pitchfork') { add(C(5), '#7a5434', mtx(0, 0.3, 0, 0.04, 1.6, 0.04)); for (let i = -1; i <= 1; i++) add(C(4), '#8a8d90', mtx(i * 0.05, 1.15, 0, 0.015, 0.25, 0.015)); }
    if (type === 'bowl') { add(C(10), '#8a6a48', mtx(0, -0.06, 0.06, 0.18, 0.07, 0.18)); }
    if (type === 'book') { add(B(), '#6b2b2b', mtx(0, -0.05, 0.05, 0.16, 0.04, 0.22)); }
    if (type === 'cup') { add(C(10), '#9a8a70', mtx(0, -0.05, 0.03, 0.08, 0.1, 0.08)); }
    if (type === 'bread') { add(Sp(), '#c8955a', mtx(0, -0.05, 0.06, 0.14, 0.11, 0.3)); }
    if (type === 'jar') { add(C(10), '#b8c8a8', mtx(0, -0.06, 0.04, 0.09, 0.11, 0.09)); add(C(10), '#6a5038', mtx(0, 0.0, 0.04, 0.1, 0.03, 0.1)); }
    if (type === 'pouch') { add(Sp(), '#7a5a3a', mtx(0, -0.07, 0.05, 0.13, 0.12, 0.13)); }
    if (type === 'apple') { add(Sp(), '#c83a2a', mtx(0, -0.05, 0.05, 0.08, 0.08, 0.08)); }
    if (type === 'sheaf') { add(C(8), '#d8b45a', mtx(0, 0.0, 0.18, 0.22, 0.75, 0.22, 0.4)); add(C(8), '#8a6a30', mtx(0, 0.0, 0.18, 0.24, 0.06, 0.24, 0.4)); }
    if (type === 'charm') { add(new T.TorusGeometry(0.5, 0.15, 5, 12), '#a07848', mtx(0, -0.06, 0.05, 0.07, 0.07, 0.07)); }
    this.weapon = g; this.handR.add(g);
  }
  initRig() {
    this.pose = blankPose(); this.base = blankPose(); this.act = null; this.stance = null; this.stanceW = 0; this.stanceName = null;
    this.phase = 0; this.speed = 0; this.runSpeed = 4.5; this.blinkT = frand(1, 4); this.lookTarget = null; this.lookYaw = 0; this.lookPitch = 0;
    this.talking = false; this.flashT = 0; this.capeSwing = 0; this.weapon = null; this.idleSeed = Math.random() * 10; this.talkT = 0;
    this.breathe = 1;
  }
}

class Humanoid extends PoseRig {
  constructor(o) {
    super();
    this.o = o = Object.assign({ scale: 1, female: false, child: 0, skin: SKIN.light, hair: '#3a2a1c', hairStyle: 'short', eyes: '#4a3424', shirt: '#7a6a55', sleeves: 'short', pants: '#4b4033', shoes: '#3a2b20', extras: [] }, o);
    this.mats = {}; this.allMats = []; this.parts = []; this.meshes = []; this.outlines = [];
    const root = this.root = new T.Group();
    const pivot = this.pivot = new T.Group(); pivot.position.y = 0.55; root.add(pivot);
    const body = this.body = new T.Group(); body.position.y = -0.55; pivot.add(body);
    const ch = o.child, fem = o.female, wd = o.wide || 1;
    const hk = 1 + 0.3 * ch, lk = 1 - 0.07 * ch;
    const D = this.D = {
      legU: 0.44 * lk, legL: 0.43 * lk, foot: 0.06, torso: 0.53 * (1 - 0.05 * ch),
      chestHalf: (fem ? 0.158 : 0.2) * wd * (1 - 0.1 * ch), waistHalf: (fem ? 0.118 : 0.15) * wd * (1 - 0.06 * ch), hipHalf: (fem ? 0.172 : 0.158) * wd * (1 - 0.08 * ch), depth: 0.64,
      headH: 0.265 * hk, headW: 0.212 * hk, headD: 0.232 * hk,
      armU: 0.29 * lk, armL: 0.26 * lk, armT: (fem ? 0.074 : 0.092) * wd * (1 - 0.1 * ch), legT: (fem ? 0.128 : 0.138) * wd * (1 - 0.08 * ch),
    };
    D.hipH = D.legU + D.legL + D.foot; D.height = D.hipH + 0.06 + D.torso + 0.07 + D.headH;
    D.chestW = D.chestHalf * 2; D.waistW = D.waistHalf * 2; D.chestD = D.chestHalf * 2 * D.depth;
    const hips = this.hips = new T.Group(); hips.position.y = D.hipH; body.add(hips);
    const spine = this.spine = new T.Group(); spine.position.y = 0.06; hips.add(spine);
    const neck = this.neck = new T.Group(); neck.position.y = D.torso; spine.add(neck);
    const head = this.head = new T.Group(); head.position.y = 0.07; neck.add(head);
    // --- gövde
    const sx = (1 - 0.08 * ch) * wd, sy = D.torso / 0.53;
    const pelvisP = fem ? [[0.02, -0.15], [0.115, -0.13], [0.168, -0.07], [0.176, 0.0], [0.15, 0.06], [0.122, 0.11]] : [[0.02, -0.15], [0.105, -0.13], [0.152, -0.07], [0.16, 0.0], [0.155, 0.06], [0.15, 0.11]];
    this.add(hips, latheGeo(pelvisP, 16), o.robe ? o.shirt : o.pants, mtx(0, 0, 0, sx, 1, D.depth));
    const chestP = fem ? [[0.12, -0.04], [0.118, 0.06], [0.126, 0.17], [0.148, 0.29], [0.158, 0.38], [0.15, 0.45], [0.124, 0.505], [0.07, 0.545], [0.03, 0.56]]
      : [[0.15, -0.04], [0.152, 0.06], [0.166, 0.18], [0.19, 0.3], [0.204, 0.4], [0.2, 0.46], [0.172, 0.51], [0.1, 0.548], [0.04, 0.56]];
    this.add(spine, latheGeo(chestP, 16), o.shirt, mtx(0, 0, 0, sx, sy, D.depth));
    if (fem && ch < 0.5) for (const s of [-1, 1]) this.add(spine, sphGeo(10, 8), o.shirt, mtx(s * 0.052 * sx, D.torso * 0.67, D.chestHalf * D.depth * 0.6, 0.1 * sx, 0.085, 0.075, 0.25));
    // boyun ve kafa
    const nr = (fem ? 0.036 : 0.044) * (1 + 0.15 * ch);
    this.add(neck, capsGeo(nr, nr * 1.15, 0.11), o.skin, mtx(0, 0.09, -0.005));
    const W = D.headW, H = D.headH, Dd = D.headD; this.hc = V3(0, H * 0.5, 0.008);
    this.add(head, deformHead(sphGeo(24, 18), fem ? 0.4 : 0.34), o.skin, mtx(this.hc.x, this.hc.y, this.hc.z, W, H, Dd));
    for (const s of [-1, 1]) this.add(head, sphGeo(8, 6), o.skin, mtx(s * W * 0.49, H * 0.46, -0.004, 0.035, 0.065, 0.045, 0, s * 0.3));
    // yüz yaması (doku)
    const fg = new T.SphereGeometry(0.5 * 1.012, 20, 16, Math.PI / 2 - 0.873, 1.746, 0.96, 1.4); deformHead(fg, fem ? 0.4 : 0.34);
    this.faceF = { skin: o.skin, eyes: o.eyes, female: fem, child: ch, brow: shade(o.hair, 0.55), stern: o.stern, beard: o.faceBeard, mustache: o.faceMustache, blush: o.blush };
    this.faceTex = {}; this.expr = o.expr || 'neutral'; this.faceState = '';
    this.faceMat = TOON.mat('#ffffff', { map: this.faceTexFor('neutral', 'open', 'closed'), gradientMap: TOON.gradFace }); this.allMats.push(this.faceMat);
    const face = new T.Mesh(fg, this.faceMat); face.position.copy(this.hc); face.scale.set(W, H, Dd); face.castShadow = false; face.userData.noBake = true; head.add(face); this.face = face;
    this.buildHair(o.hairStyle, o.hair);
    // kollar
    const sleeveC = o.sleeves === 'none' ? o.skin : o.shirt;
    const arm = (side) => {
      const sh = new T.Group(); sh.position.set(side * (D.chestHalf * sx * 0.9 + D.armT * 0.2), D.torso * 0.9, 0); spine.add(sh);
      const t = D.armT;
      this.add(sh, sphGeo(10, 8), sleeveC, mtx(side * 0.004, -0.012, 0, t * 1.12, t * 1.05, t * 1.08));
      this.add(sh, capsGeo(t * 0.5, t * 0.43, D.armU), o.skin, mtx(0, 0, 0));
      if (o.sleeves !== 'none') this.add(sh, capsGeo(t * 0.58, t * 0.52, D.armU * (o.sleeves === 'long' ? 1.0 : 0.58)), o.shirt, mtx(0, 0, 0));
      const el = new T.Group(); el.position.y = -D.armU; sh.add(el);
      this.add(el, capsGeo(t * 0.44, t * 0.35, D.armL), o.sleeves === 'long' ? o.shirt : o.skin, mtx(0, 0, 0));
      if (o.sleeves === 'long') this.add(el, capsGeo(t * 0.47, t * 0.45, 0.03), shade(o.shirt, 0.8), mtx(0, -D.armL + 0.03, 0));
      const hand = new T.Group(); hand.position.y = -D.armL; el.add(hand);
      const hc = o.gloves || o.skin;
      this.add(hand, sphGeo(10, 8), hc, mtx(0, -0.045, 0.004, t * 0.82, 0.1, t * 0.52));
      this.add(hand, capsGeo(0.012, 0.01, 0.04), hc, mtx(-side * t * 0.38, -0.02, 0.018, 1, 1, 1, -0.3, 0, side * 0.5));
      return [sh, el, hand];
    };
    [this.shL, this.elL, this.handL] = arm(1);
    [this.shR, this.elR, this.handR] = arm(-1);
    // bacaklar
    const leg = (side) => {
      const t = D.legT;
      const hp = new T.Group(); hp.position.set(side * D.hipHalf * sx * 0.52, 0, 0); hips.add(hp);
      this.add(hp, capsGeo(t * 0.56, t * 0.42, D.legU), o.pants, mtx(0, 0, 0));
      const kn = new T.Group(); kn.position.y = -D.legU; hp.add(kn);
      this.add(kn, capsGeo(t * 0.43, t * 0.3, D.legL), o.bareLegs ? o.skin : o.pants, mtx(0, 0, 0));
      if (o.boots) this.add(kn, capsGeo(t * 0.47, t * 0.37, D.legL * 0.62), o.shoes, mtx(0, -D.legL * 0.36, 0));
      this.add(kn, sphGeo(10, 8), o.shoes, mtx(0, -D.legL - 0.022, 0.045, t * 0.72, 0.07, 0.21));
      return [hp, kn];
    };
    [this.lgL, this.knL] = leg(1);
    [this.lgR, this.knR] = leg(-1);
    this.building = true;
    for (const ex of o.extras) this.addExtra(ex);
    this.building = false;
    this.finalize();
    root.scale.setScalar(o.scale);
    this.initRig();
  }
  // malzeme anahtarı: renk, '|2' çift yüz (kontursuz)
  mat(key) {
    if (!this.mats[key]) {
      const [hex, flag] = key.split('|');
      const soft = hex === this.o.skin;
      const m = TOON.mat(hex, flag === '2' ? { side: T.DoubleSide } : soft ? { gradientMap: TOON.gradFace } : flag === 'm' ? { gradientMap: TOON.gradSoft } : {});
      this.mats[key] = m; this.allMats.push(m);
    }
    return this.mats[key];
  }
  add(group, geo, key, m) { this.parts.push({ group, geo, key, m }); }
  finalize() {
    const buckets = new Map();
    for (const p of this.parts) { const k = p.group.uuid + '#' + p.key; if (!buckets.has(k)) buckets.set(k, { group: p.group, key: p.key, list: [] }); buckets.get(k).list.push({ geo: p.geo, m: p.m }); }
    for (const [, b] of buckets) {
      const g = mergeParts(b.list);
      const mesh = new T.Mesh(g, this.mat(b.key)); mesh.castShadow = true; b.group.add(mesh); this.meshes.push(mesh);
      if (!b.key.endsWith('|2')) { const ol = new T.Mesh(g, TOON.outline); ol.userData.noBake = true; ol.userData.outline = true; b.group.add(ol); this.outlines.push(ol); }
    }
    for (const p of this.parts) p.geo.dispose();
    this.parts = [];
  }
  faceTexFor(expr, eyes, mouth) {
    const k = expr + '|' + eyes + '|' + mouth;
    if (!this.faceTex[k]) this.faceTex[k] = faceTexture(this.faceF, expr, eyes, mouth);
    return this.faceTex[k];
  }
  setExpression(e) { this.expr = e || 'neutral'; }
  // --- saç ---
  buildHair(style, color) {
    const D = this.D, h = this.head, W = D.headW, H = D.headH, Dd = D.headD, c = this.hc, o = this.o;
    const deg = Math.PI / 180;
    const S = (th, ph, k = 1.0) => V3(Math.sin(th * deg) * Math.sin(ph * deg) * W / 2 * k, c.y + Math.cos(th * deg) * H / 2 * k, c.z + Math.sin(th * deg) * Math.cos(ph * deg) * Dd / 2 * k);
    const N = (th, ph) => V3(Math.sin(th * deg) * Math.sin(ph * deg) / W, Math.cos(th * deg) / H, Math.sin(th * deg) * Math.cos(ph * deg) / Dd).normalize();
    const key = color, cone = () => new T.ConeGeometry(0.5, 1, 6), flat = () => new T.ConeGeometry(0.5, 1, 4), frus = (a) => new T.CylinderGeometry(0.5 * a, 0.5, 1, 7);
    const spike = (th, ph, dir, len, w, grp = h) => { this.add(grp, cone(), key, alongMatrix(S(th, ph, 0.96), dir, len, w, w * 0.72)); };
    const clump = (th, ph, dir, len, w) => { this.add(h, flat(), key, alongMatrix(S(th, ph, 1.0), dir, len, w, w * 0.32, Math.PI / 4)); };
    const lock = (from, dirs, lens, w, grp = h) => {
      let p = from.clone(), ww = w;
      dirs.forEach((d, i) => { const last = i === dirs.length - 1; const dn = d.clone().normalize(); this.add(grp, last ? cone() : frus(0.82), key, alongMatrix(p, dn, lens[i] * 1.06, ww, ww * 0.75)); p.addScaledVector(dn, lens[i]); ww *= 0.82; });
      return p;
    };
    const cap = (k0 = 1.075, thMax = 0.37) => { const k = k0 + 0.02;
      this.add(h, new T.SphereGeometry(0.5, 20, 12, 0, TAU, 0, Math.PI * thMax), key, mtx(c.x, c.y, c.z, W * k, H * k, Dd * k));
      this.add(h, new T.SphereGeometry(0.5, 16, 12, Math.PI * 1.5 - 1.35, 2.7, Math.PI * 0.25, Math.PI * 0.47), key, mtx(c.x, c.y, c.z - 0.004, W * k, H * k, Dd * k));
      for (const s of [-1, 1]) this.add(h, new T.SphereGeometry(0.5, 10, 10, s > 0 ? 0 : Math.PI, Math.PI, Math.PI * 0.25, Math.PI * 0.32), key, mtx(c.x, c.y, c.z - 0.01, W * k * 1.01, H * k, Dd * k * 0.9));
    };
    const down = V3(0, -1, 0);
    const bangs = (n, spread, th, len, w, fwd = 0.32, sweep = 0) => { n = Math.max(3, Math.round(n * 0.7)); for (let i = 0; i < n; i++) { const ph = -spread + (2 * spread) * (n === 1 ? 0.5 : i / (n - 1)); const L = len * rnd(0.9, 1.1); const dir = N(th, ph).multiplyScalar(0.3).add(V3(Math.sin(ph * deg) * 0.18 + sweep, -1, fwd)); clump(th - 4, ph, dir, L, w * 2.0 * rnd(0.9, 1.1)); } };
    const sideLocks = (len, w, th = 72, ph = 66, segs = 2) => { for (const s of [-1, 1]) { const from = S(th, s * ph, 0.98); const dirs = segs === 2 ? [V3(s * 0.12, -1, 0.12), V3(s * 0.05, -1, 0.06)] : [V3(s * 0.1, -1, 0.1)]; lock(from, dirs, segs === 2 ? [len * 0.45, len * 0.55] : [len], w); } };
    const backSpikes = (len, w, from = 80, to = 280, step = 25, th = 88) => { for (let ph = from; ph <= to; ph += step) { const dir = N(th, ph).multiplyScalar(0.55).add(V3(0, -0.75, 0)); spike(th + rnd(-6, 6), ph, dir, len * rnd(0.85, 1.15), w); } };
    switch (style) {
      case 'bald': return;
      case 'baldRing': for (let ph = 70; ph <= 290; ph += 22) this.add(h, sphGeo(8, 6), key, mtx(...S(92, ph, 1.0).toArray(), H * 0.22, H * 0.2, H * 0.18)); return;
      case 'messy': case 'spiky': {
        cap(1.07, 0.36);
        bangs(7, 46, 40, H * 0.4, H * 0.19, 0.34);
        for (let i = 0; i < 10; i++) { const ph = i * 36 + rnd(-10, 10), th = rnd(14, 34); const dir = N(th, ph).add(V3(0, style === 'spiky' ? 0.7 : 0.15, -0.45)); spike(th, ph, dir, H * rnd(0.26, 0.36), H * 0.24); }
        backSpikes(H * 0.42, H * 0.24, 75, 285, 21);
        for (const s of [-1, 1]) spike(78, s * 74, V3(s * 0.15, -1, 0.15), H * 0.42, H * 0.14);
        return;
      }
      case 'short': {
        cap(1.06, 0.38);
        bangs(5, 40, 38, H * 0.3, H * 0.2, 0.4, 0.35);
        backSpikes(H * 0.26, H * 0.22, 80, 280, 25, 86);
        for (const s of [-1, 1]) spike(76, s * 76, V3(0, -1, 0.1), H * 0.26, H * 0.14);
        return;
      }
      case 'curly': {
        cap(1.06, 0.4);
        for (let th = 8; th <= 92; th += 14) { const n = Math.max(1, Math.round(Math.sin(th * deg) * 13)); for (let i = 0; i < n; i++) { const ph = i / n * 360 + th * 3; const pw = ((ph % 360) + 360) % 360; if ((pw < 50 || pw > 310) && th > 46) continue; this.add(h, sphGeo(8, 6), key, mtx(...S(th, ph, 1.04).toArray(), H * 0.2, H * 0.18, H * 0.2, rnd(0, 3), rnd(0, 3))); } }
        for (let i = 0; i < 5; i++) { const ph = -40 + i * 20; this.add(h, sphGeo(8, 6), key, mtx(...S(50, ph, 1.05).toArray(), H * 0.19, H * 0.17, H * 0.15)); }
        return;
      }
      case 'slick': {
        cap(1.08, 0.4);
        for (let i = 0; i < 5; i++) { const ph = -34 + i * 17; spike(36, ph, V3(Math.sin(ph * deg) * 0.2, 0.55, -1), H * 0.55, H * 0.24); }
        spike(40, -38, V3(1, -0.25, 0.45), H * 0.5, H * 0.17);
        backSpikes(H * 0.22, H * 0.24, 110, 250, 28, 92);
        return;
      }
      case 'long': case 'bob': {
        cap(1.07, 0.38);
        bangs(9, 50, 40, H * (style === 'bob' ? 0.37 : 0.39), H * 0.15, 0.26);
        const L = style === 'bob' ? H * 0.9 : H * (o.hairLen || 2.3);
        const panel = new T.CylinderGeometry(W * 0.58, W * (style === 'bob' ? 0.62 : 0.74), L, 18, 1, true, Math.PI - 1.45, 2.9);
        this.add(h, panel, key + '|2', mtx(0, c.y - L / 2 + H * 0.05, c.z - 0.012, 1, 1, Dd / W * 0.98));
        for (let i = 0; i < 9; i++) { const a = Math.PI - 1.35 + i * 2.7 / 8; const from = V3(Math.sin(a) * W * 0.66, c.y - L + H * 0.12, c.z + Math.cos(a) * W * 0.66 * Dd / W); this.add(h, cone(), key, alongMatrix(from, V3(Math.sin(a) * 0.15, -1, Math.cos(a) * 0.1), H * 0.32, H * 0.2, H * 0.12)); }
        this.add(h, new T.CylinderGeometry(W * 0.57, W * 0.6, H * 0.5, 16, 1, true, Math.PI - 1.6, 3.2), key, mtx(0, c.y - H * 0.18, c.z - 0.008, 1, 1, Dd / W));
        sideLocks(style === 'bob' ? H * 0.75 : H * 1.35, H * 0.17, 70, 64);
        return;
      }
      case 'ponytail': case 'tied': {
        cap(1.07, 0.38);
        bangs(7, 44, 40, H * 0.38, H * 0.17, 0.3, style === 'ponytail' ? -0.25 : 0);
        sideLocks(H * 0.55, H * 0.13, 74, 68, 1);
        const tie = S(style === 'ponytail' ? 62 : 80, 180, 1.06);
        this.add(h, sphGeo(8, 6), shade(color, 0.6), mtx(...tie.toArray(), H * 0.16, H * 0.16, H * 0.16));
        const pt = new T.Group(); pt.position.copy(tie); h.add(pt); this.tail = pt;
        const z = V3(0, 0, 0);
        const lens = style === 'ponytail' ? [H * 0.35, H * 0.7, H * 0.6, H * 0.45] : [H * 0.3, H * 0.45, H * 0.35];
        const dirs = style === 'ponytail' ? [V3(0, 0.25, -1), V3(0, -1, -0.45), V3(0, -1, -0.1), V3(0, -1, 0.05)] : [V3(0, -0.3, -1), V3(0, -1, -0.4), V3(0, -1, -0.1)];
        for (const off of [-1, 0, 1]) lock(V3(off * H * 0.06, 0, 0), dirs.map(d => d.clone().add(V3(off * 0.08, 0, 0))), lens, H * (off ? 0.2 : 0.28), pt);
        return;
      }
      case 'braid': {
        cap(1.07, 0.38);
        bangs(7, 44, 40, H * 0.38, H * 0.16, 0.3);
        sideLocks(H * 0.5, H * 0.13, 74, 66, 1);
        const pt = new T.Group(); pt.position.copy(S(108, 180, 0.98)); h.add(pt); this.tail = pt;
        const n = o.braidLen || 8;
        for (let i = 0; i < n; i++) { const s = H * (0.26 - i * 0.012); this.add(pt, sphGeo(9, 7), key, mtx((i % 2 ? 1 : -1) * H * 0.03, -i * H * 0.17, -0.02 - i * 0.004, s, s * 1.2, s * 0.9)); }
        this.add(pt, sphGeo(8, 6), shade(color, 0.55), mtx(0, -n * H * 0.17 + H * 0.06, -0.05, H * 0.12, H * 0.08, H * 0.12));
        this.add(pt, cone(), key, alongMatrix(V3(0, -n * H * 0.17 + H * 0.04, -0.05), down, H * 0.28, H * 0.18, H * 0.14));
        return;
      }
      case 'bun': {
        cap(1.07, 0.4);
        bangs(5, 42, 40, H * 0.32, H * 0.16, 0.32, 0.3);
        for (const s of [-1, 1]) spike(76, s * 70, V3(s * 0.1, -1, 0.15), H * 0.55, H * 0.1);
        this.add(h, sphGeo(12, 10), key, mtx(...S(58, 180, 1.18).toArray(), H * 0.4, H * 0.36, H * 0.36));
        this.add(h, new T.TorusGeometry(0.5, 0.12, 6, 14), shade(color, 0.55), mtx(...S(64, 180, 1.06).toArray(), H * 0.34, H * 0.34, H * 0.34, 0.7));
        return;
      }
    }
  }
  // --- ekler ---
  addExtra(ex) {
    const D = this.D, o = this.o;
    const type = typeof ex === 'string' ? ex : ex.t; const c = ex.c || '#555';
    const sx = (1 - 0.08 * o.child) * (o.wide || 1), dep = D.depth;
    const skirt = (top, L, hem, phi0 = 0, phiL = TAU, ruff = 0.05) => {
      const g = latheGeo([[hem, -L], [hem * 0.96, -L * 0.7], [(top + hem) / 2 * 0.98, -L * 0.42], [top * 1.04, -0.02], [top * 0.98, 0.04]], 22, phi0, phiL);
      const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < -L * 0.5) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(x, z), k = 1 + ruff * Math.sin(a * 9) * ((-y - L * 0.5) / (L * 0.5)); p.setX(i, x * k); p.setZ(i, z * k); } }
      g.computeVertexNormals(); return g;
    };
    switch (type) {
      case 'dress': { const L = ex.len || (D.legU + D.legL * 0.78); this.add(this.hips, skirt(D.hipHalf * sx * 1.02, L, D.hipHalf * 1.75 + L * 0.12), c + '|2', mtx(0, 0.1, 0, 1, 1, 0.82)); break; }
      case 'robe': { const L = D.hipH + 0.05; this.add(this.hips, skirt(D.hipHalf * sx * 1.05, L, D.hipHalf * 1.9 + 0.08, 0, TAU, 0.03), c + '|2', mtx(0, 0.1, 0, 1, 1, 0.85)); break; }
      case 'skirtShort': { const L = D.legU * 0.62; this.add(this.hips, skirt(D.hipHalf * sx * 1.02, L, D.hipHalf * 1.6, 0, TAU, 0.07), c + '|2', mtx(0, 0.1, 0, 1, 1, 0.82)); break; }
      case 'coat': { const L = D.legU * 0.9; this.add(this.hips, skirt(D.hipHalf * sx * 1.05, L, D.hipHalf * 1.55, 0.32, TAU - 0.64, 0.02), c + '|2', mtx(0, 0.1, 0, 1, 1, 0.85)); break; }
      case 'apron': { const L = D.legU * 0.9; this.add(this.hips, skirt(D.hipHalf * sx * 1.12, L, D.hipHalf * 1.35, -0.75, 1.5, 0.02), c + '|2', mtx(0, 0.08, 0.01, 1, 1, 0.9)); this.add(this.spine, latheGeo([[0.16, 0.0], [0.17, 0.12], [0.15, 0.3]], 10, -0.5, 1.0), c + '|2', mtx(0, 0.02, 0.006, sx, D.torso / 0.53, dep * 1.18)); break; }
      case 'vest': { const P = (o.female ? [[0.125, -0.02], [0.13, 0.17], [0.152, 0.29], [0.162, 0.38], [0.155, 0.45], [0.128, 0.5]] : [[0.158, -0.02], [0.17, 0.18], [0.194, 0.3], [0.208, 0.4], [0.204, 0.46], [0.176, 0.51]]); this.add(this.spine, latheGeo(P, 16, 0.3, TAU - 0.6), c + '|2', mtx(0, 0, 0, sx * 1.04, D.torso / 0.53, dep * 1.06)); break; }
      case 'belt': { const r = D.waistHalf * sx * 1.12; this.add(this.hips, latheGeo([[r, 0.07], [r * 1.02, 0.1], [r, 0.13]], 16), c, mtx(0, 0, 0, 1, 1, dep * 1.03)); this.add(this.hips, sphGeo(6, 4), ex.buckle || '#c9a85a', mtx(0, 0.1, r * dep * 1.03, 0.045, 0.04, 0.02)); break; }
      case 'trim': { this.add(this.spine, capsGeo(0.012, 0.012, D.torso * 0.5), c, mtx(0, D.torso * 0.96, D.chestHalf * dep * 0.98 * sx)); this.add(this.spine, new T.TorusGeometry(0.5, 0.08, 6, 18), c, mtx(0, D.torso * 0.97, 0, D.chestHalf * 1.15 * sx, D.chestHalf * 1.15 * dep, 0.25, Math.PI / 2)); break; }
      case 'armor': {
        const m = c + '|m', t = ex.trim || '#c9a85a';
        const P = o.female ? [[0.128, 0.0], [0.135, 0.17], [0.158, 0.29], [0.17, 0.38], [0.162, 0.45], [0.134, 0.51], [0.08, 0.54]] : [[0.162, 0.0], [0.175, 0.18], [0.2, 0.3], [0.215, 0.4], [0.21, 0.46], [0.18, 0.51], [0.1, 0.545]];
        this.add(this.spine, latheGeo(P, 16), m, mtx(0, 0, 0, sx * 1.05, D.torso / 0.53, dep * 1.1));
        this.add(this.spine, capsGeo(0.016, 0.016, D.torso * 0.42), t, mtx(0, D.torso * 0.92, D.chestHalf * dep * 1.12 * sx));
        for (const [sh, s] of [[this.shL, 1], [this.shR, -1]]) { this.add(sh, new T.SphereGeometry(0.5, 12, 8, 0, TAU, 0, Math.PI * 0.55), m, mtx(s * 0.01, 0.0, 0, D.armT * 2.1, D.armT * 1.5, D.armT * 2.0, 0, 0, s * -0.35)); this.add(sh, new T.TorusGeometry(0.5, 0.06, 5, 14), t, mtx(s * 0.01, -0.035, 0, D.armT * 2.0, D.armT * 2.0, D.armT * 1.6, Math.PI / 2, 0, s * -0.35)); }
        for (const kn of [this.knL, this.knR]) this.add(kn, capsGeo(D.legT * 0.48, D.legT * 0.4, D.legL * 0.62), m, mtx(0, -D.legL * 0.08, 0.004));
        for (const el of [this.elL, this.elR]) this.add(el, capsGeo(D.armT * 0.5, D.armT * 0.46, D.armL * 0.6), m, mtx(0, -D.armL * 0.38, 0));
        break;
      }
      case 'cape': {
        const cp = this.cape = new T.Group(); cp.position.set(0, D.torso * 0.93, -D.chestHalf * dep * 0.55); this.spine.add(cp);
        const L = ex.len || (D.torso + D.hipH * 0.78); const rT = D.chestHalf * sx * 1.12, rB = rT * 1.65;
        const g = new T.CylinderGeometry(rT, rB, L, 12, 3, true, Math.PI - 1.25, 2.5); g.translate(0, -L / 2, 0);
        const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); const k = 1 + 0.04 * Math.sin(Math.atan2(p.getX(i), p.getZ(i)) * 7) * (-y / L); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k * 0.55 + 0.02); }
        g.computeVertexNormals(); this.add(cp, g, c + '|2', mtx(0, 0, 0));
        if (ex.collar) this.add(this.spine, new T.TorusGeometry(0.5, 0.16, 6, 16), ex.collar, mtx(0, D.torso * 0.97, 0, D.chestHalf * 1.25 * sx, D.chestHalf * 1.25 * dep, 0.3, Math.PI / 2));
        break;
      }
      case 'hood': { const H = D.headH, W = D.headW; this.add(this.head, new T.SphereGeometry(0.5, 16, 12, Math.PI * 1.5 - 1.9, 3.8, 0, Math.PI * 0.75), c + '|2', mtx(this.hc.x, this.hc.y + 0.01, this.hc.z - 0.01, W * 1.38, H * 1.32, D.headD * 1.35)); break; }
      case 'hoodDown': this.add(this.spine, new T.TorusGeometry(0.5, 0.22, 7, 16), c, mtx(0, D.torso * 0.98, -0.03, D.chestHalf * 1.4, D.chestHalf * 1.2 * dep * 1.3, 0.5, Math.PI / 2 + 0.25)); break;
      case 'hat': { const H = D.headH, W = D.headW; this.add(this.head, latheGeo([[0.02, 0.12], [0.3, 0.1], [0.36, 0.0], [0.62, -0.02], [0.66, -0.05], [0.6, -0.05], [0.3, -0.02], [0.02, -0.02]], 18), c, mtx(0, this.hc.y + H * 0.4, this.hc.z, W * 1.05, H * 1.1, D.headD * 1.05)); break; }
      case 'cap': { const H = D.headH, W = D.headW; this.add(this.head, new T.SphereGeometry(0.5, 14, 8, 0, TAU, 0, Math.PI * 0.42), c, mtx(this.hc.x, this.hc.y + 0.004, this.hc.z, W * 1.14, H * 1.12, D.headD * 1.14)); this.add(this.head, sphGeo(10, 4), c, mtx(0, this.hc.y + H * 0.3, this.hc.z + D.headD * 0.55, W * 0.8, 0.02, D.headD * 0.42)); break; }
      case 'scarf': this.add(this.neck, new T.TorusGeometry(0.5, 0.2, 7, 16), c, mtx(0, 0.03, 0, 0.13, 0.13, 0.32, Math.PI / 2)); this.add(this.spine, capsGeo(0.035, 0.03, D.torso * 0.35), c, mtx(0.05, D.torso * 0.94, D.chestHalf * dep * 0.95, 1, 1, 0.6)); break;
      case 'beard': { const H = D.headH, W = D.headW; this.add(this.head, sphGeo(14, 10), c, mtx(0, this.hc.y - H * 0.43, this.hc.z + D.headD * 0.1, W * 0.78, H * 0.32, D.headD * 0.8)); this.faceF.mustache = c; this.faceF.beard = c; this.faceTex = {}; this.faceMat.map = this.faceTexFor('neutral', 'open', 'closed'); break; }
      case 'mustache': this.faceF.mustache = c; this.faceTex = {}; this.faceMat.map = this.faceTexFor('neutral', 'open', 'closed'); break;
      case 'satchel': this.add(this.hips, sphGeo(8, 6), c, mtx(-D.hipHalf * 1.05, -0.06, 0.03, 0.07, 0.17, 0.16)); this.add(this.spine, capsGeo(0.014, 0.014, D.torso * 0.95), shade(c, 0.8), mtx(D.chestHalf * 0.75, D.torso * 0.95, D.chestHalf * dep * 1.05, 1, 1, 1, 0, 0, 0.62)); break;
      case 'sheath': this.add(this.hips, capsGeo(0.03, 0.022, 0.72), '#3b2a1e', mtx(D.hipHalf * 1.1, 0.12, -0.02, 1, 1, 1.4, 0.18, 0, 0.12)); this.add(this.hips, sphGeo(6, 4), '#c9a85a', mtx(D.hipHalf * 1.08, 0.15, -0.015, 0.09, 0.035, 0.04, 0.18, 0, 0.12)); break;
      case 'quiver': this.add(this.spine, capsGeo(0.055, 0.045, 0.42), c, mtx(-0.07, D.torso * 0.92, -D.chestHalf * dep * 1.1, 1, 1, 1, 0, 0, 0.35)); for (let i = 0; i < 3; i++) this.add(this.spine, capsGeo(0.01, 0.01, 0.1), '#e8e0cc', mtx(-0.1 + i * 0.03 + 0.03, D.torso * 0.92 + 0.12, -D.chestHalf * dep * 1.1, 1, 1, 1, 0, 0, 0.35)); break;
      case 'bowBack': { const g = new T.TorusGeometry(0.42, 0.018, 5, 20, Math.PI * 0.85); this.add(this.spine, g, c, mtx(0.04, D.torso * 0.55, -D.chestHalf * dep * 1.25, 1, 1, 1, 0, Math.PI / 2, Math.PI / 2 - 0.4)); break; }
      case 'circlet': this.add(this.head, new T.TorusGeometry(0.5, 0.05, 5, 22), c, mtx(0, this.hc.y + D.headH * 0.24, this.hc.z, D.headW * 1.12, D.headD * 1.14, 0.3, Math.PI / 2 - 0.12)); this.add(this.head, new T.OctahedronGeometry(0.5), '#7fd0ff', mtx(0, this.hc.y + D.headH * 0.26, this.hc.z + D.headD * 0.57, 0.035, 0.05, 0.02)); break;
      case 'necklace': this.add(this.spine, new T.TorusGeometry(0.5, 0.03, 4, 18), c, mtx(0, D.torso * 0.9, 0.02, D.chestHalf * 1.0, D.chestHalf * dep * 1.1, 0.5, Math.PI / 2 - 0.35)); this.add(this.spine, new T.OctahedronGeometry(0.5), '#7fd0ff', mtx(0, D.torso * 0.78, D.chestHalf * dep * 1.02, 0.03, 0.04, 0.02)); break;
      case 'bandage': this.add(this.head, new T.TorusGeometry(0.5, 0.07, 5, 22), c, mtx(0, this.hc.y + D.headH * 0.18, this.hc.z, D.headW * 1.12, D.headD * 1.14, 0.35, Math.PI / 2 - 0.1)); break;
      case 'sash': this.add(this.spine, new T.TorusGeometry(0.5, 0.05, 5, 20), c, mtx(0, D.torso * 0.55, 0, D.chestHalf * 2.15 * sx, D.chestHalf * 2.05 * dep, 0.6, Math.PI / 2, 0, 0.6)); break;
    }
    if (!this.building && this.parts.length) this.finalize();
  }
  updateFace(dt) {
    this.blinkT -= dt;
    const blink = this.closedEyes || (this.blinkT < 0.12 && this.blinkT > 0);
    if (this.blinkT < 0) this.blinkT = frand(2, 5);
    let mouth = 'closed';
    if (this.talking) { this.talkT += dt; mouth = Math.floor(this.talkT * 9) % 2 ? 'open' : 'closed'; }
    const eyes = blink ? 'closed' : 'open';
    const k = this.expr + '|' + eyes + '|' + mouth;
    if (k !== this.faceState) { this.faceState = k; this.faceMat.map = this.faceTexFor(this.expr, eyes, mouth); }
    // uzakta kontur kapalı
    if (G.camera && (this._olT = (this._olT || 0) + dt) > 0.4) { this._olT = 0; const far = G.camera.position.distanceTo(this.root.getWorldPosition(_v3a)) > 34; for (const ol of this.outlines) ol.visible = !far; }
  }
  apply(P, dt, speed) {
    this.pivot.rotation.set(P.roll, 0, P.rollZ);
    this.pivot.position.y = 0.55 + P.lift;
    this.body.position.y = -0.55 + P.bob;
    this.hips.rotation.y = P.hipY;
    this.spine.rotation.set(P.spX, P.spY, P.spZ);
    this.head.rotation.set(P.hdX, P.hdY, P.hdZ);
    this.shL.rotation.set(P.shLx, P.shLy, P.shLz); this.elL.rotation.x = P.elL;
    this.shR.rotation.set(P.shRx, P.shRy, P.shRz); this.elR.rotation.x = P.elR;
    this.lgL.rotation.set(P.lgLx, 0, P.lgLz); this.knL.rotation.x = P.knL;
    this.lgR.rotation.set(P.lgRx, 0, P.lgRz); this.knR.rotation.x = P.knR;
    if (this.cape) { this.capeSwing = damp(this.capeSwing, -Math.min(speed, 5) * 0.12 - 0.04, 4, dt); this.cape.rotation.x = this.capeSwing + Math.sin(G.t * 2.3) * 0.03 - P.spX * 0.8; }
    if (this.tail) this.tail.rotation.x = -Math.min(speed, 5) * 0.08 + Math.sin(G.t * 3) * 0.05 - P.hdX;
  }
  dispose() { for (const m of this.allMats) m.dispose(); for (const k in this.faceTex) this.faceTex[k].dispose(); for (const m of this.meshes) m.geometry.dispose(); }
}

// Kalabalıklar için statik pişirme
function bakeHumanoid(b, opts, stance, x, y, z, ry, extraPose) {
  const h = new Humanoid(opts);
  if (stance) h.setStance(stance); h.stanceW = 1;
  h.update(0.016, 0);
  if (extraPose) { Object.assign(h.pose, extraPose); h.apply(h.pose, 0, 0); }
  h.root.position.set(x, y, z); h.root.rotation.y = ry;
  h.root.updateMatrixWorld(true);
  h.root.traverse(m => { if (m.isMesh && !m.userData.noBake && m.material.color) b.addGeo(m.geometry, '#' + m.material.color.getHexString(), m.matrixWorld, 0.03); });
  h.dispose();
}

// Rastgele köylü
const PEASANT_SHIRTS = ['#8a7656', '#6f6450', '#7d5d45', '#5d6a55', '#86735e', '#6b5847', '#9a8a6a', '#5a5e6a', '#7a5a4a'];
const PEASANT_PANTS = ['#4b4033', '#3f392f', '#544636', '#3d3a36', '#5a4a3a'];
const HAIRS = ['#2a1d14', '#3a2a1c', '#5a3a22', '#7a5230', '#1a1410', '#8a6a40', '#4a3020', '#a08060'];
function randomVillager(female, opts = {}) {
  const skin = pick([SKIN.light, SKIN.tan, SKIN.tan, SKIN.brown, SKIN.pale]);
  const o = { female, skin, hair: pick(HAIRS), shirt: pick(PEASANT_SHIRTS), pants: pick(PEASANT_PANTS), shoes: '#3a2b20', scale: rnd(0.93, 1.03) * (female ? 0.94 : 1), extras: [] };
  o.hairStyle = female ? pick(['bun', 'braid', 'long', 'tied', 'bob']) : pick(['short', 'messy', 'short', 'bald', 'curly']);
  if (female) o.extras.push({ t: 'dress', c: pick(['#7a6a55', '#6a5a70', '#7a5040', '#5a6a5a', '#8a7a60']) }), rng() < 0.5 && o.extras.push({ t: 'apron', c: '#cfc4ad' });
  else { if (rng() < 0.35) o.extras.push({ t: 'beard', c: o.hair }); if (rng() < 0.3) o.extras.push({ t: 'hat', c: '#c9a86a' }); if (rng() < 0.4) o.extras.push({ t: 'vest', c: pick(['#5a4a3a', '#4a4030']) }); }
  o.extras.push({ t: 'belt', c: '#3a2a1e', buckle: '#6a5a40' });
  return Object.assign(o, opts);
}
function randomNoble(female, opts = {}) {
  const o = { female, skin: pick([SKIN.pale, SKIN.light, SKIN.light]), hair: pick(['#2a1d14', '#c9a86a', '#8a6a40', '#1a1410', '#d8c08a']), shirt: pick(['#6a2a3a', '#2a3a6a', '#3a5a3a', '#5a2a5a', '#8a6a2a', '#2a5a5a']), pants: '#2a2420', shoes: '#1a1410', scale: rnd(0.95, 1.03) * (female ? 0.94 : 1), sleeves: 'long', extras: [] };
  o.hairStyle = female ? pick(['bun', 'long', 'braid']) : pick(['slick', 'short']);
  o.extras.push({ t: 'trim', c: '#d4b060' });
  if (female) o.extras.push({ t: 'dress', c: shade(o.shirt, 1.1), len: 0.9 }); else o.extras.push({ t: 'coat', c: shade(o.shirt, 0.85) }, { t: 'belt', c: '#1a1410' });
  if (rng() < 0.4) o.extras.push({ t: 'cape', c: shade(o.shirt, 0.7), collar: '#e8e0d0' });
  return Object.assign(o, opts);
}
