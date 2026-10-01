// ---------- Low-poly insan modeli ve prosedürel animasyon ----------
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
  cry: { full: false, p: { shLx: -1.9, shRx: -1.9, shLz: -0.45, shRz: 0.45, elL: -2.4, elR: -2.4, hdX: 0.45, spX: 0.25 } },
  think: { full: false, p: { shRx: -1.1, shRz: 0.3, elR: -2.3, shLx: -0.5, shLz: -0.3, elL: -1.6, hdX: 0.1, hdZ: 0.12 } },
  sit: { full: true, p: { lift: -0.48, lgLx: -1.55, knL: 1.55, lgRx: -1.5, knR: 1.6, lgLz: 0.06, lgRz: -0.06, shLx: -0.45, shRx: -0.45, elL: -0.6, elR: -0.6 } },
  sitGround: { full: true, p: { lift: -0.86, lgLx: -1.45, knL: 0.3, lgRx: -1.45, knR: 0.35, shLx: 0.4, shRx: 0.4, elL: -0.2, elR: -0.2, spX: -0.1 } },
  hugKnees: { full: true, p: { lift: -0.82, lgLx: -2.4, knL: 2.5, lgRx: -2.4, knR: 2.5, spX: 0.55, hdX: 0.5, shLx: -1.2, shRx: -1.2, shLz: -0.2, shRz: 0.2, elL: -0.4, elR: -0.4 } },
  kneel: { full: true, p: { lift: -0.45, lgLx: -1.45, knL: 1.5, lgRx: 0.15, knR: 1.75, spX: 0.1 } },
  kneel2: { full: true, p: { lift: -0.5, lgLx: 0.05, knL: 1.65, lgRx: 0.05, knR: 1.65, spX: 0.45, hdX: 0.4, shLx: -0.5, shRx: -0.5, elL: -0.2, elR: -0.2 } },
  allfours: { full: true, p: { lift: -0.52, lgLx: -0.3, knL: 1.8, lgRx: -0.2, knR: 1.75, spX: 1.25, hdX: -0.6, shLx: -1.2, shRx: -1.2, elL: -0.1, elR: -0.1 } },
  crouch: { full: true, p: { lift: -0.38, lgLx: -1.2, knL: 2.1, lgRx: -0.9, knR: 1.9, spX: 0.45, shLx: -0.6, shRx: -0.6, elL: -0.8, elR: -0.8 } },
  lie: { full: true, p: { roll: -1.5708, lift: -0.42, shLz: 0.15, shRz: -0.15, hdX: 0 } },
  lieSide: { full: true, p: { rollZ: 1.5708, lift: -0.4, lgLx: -0.5, knL: 0.8, lgRx: -0.3, knR: 0.5, shLx: -0.6, shRx: -0.9, elL: -0.8, elR: -0.6, spX: 0.2, hdX: 0.2 } },
  lieFace: { full: true, p: { roll: 1.5708, lift: -0.42, shLz: 0.4, shRz: -0.4, hdY: 0.6 } },
};

class Humanoid {
  constructor(o) {
    this.o = o = Object.assign({ scale: 1, female: false, child: 0, skin: SKIN.light, hair: '#3a2a1c', hairStyle: 'short', eyes: '#1c1612', shirt: '#7a6a55', sleeves: 'short', pants: '#4b4033', shoes: '#3a2b20', extras: [] }, o);
    this.mats = {}; this.allMats = [];
    const root = this.root = new T.Group();
    const pivot = this.pivot = new T.Group(); pivot.position.y = 0.55; root.add(pivot);
    const body = this.body = new T.Group(); body.position.y = -0.55; pivot.add(body);
    const ch = o.child, hk = 1 + 0.3 * ch, lk = 1 - 0.07 * ch, fem = o.female;
    const wk = (fem ? 0.88 : 1) * (o.wide || 1);
    const D = this.D = {
      legU: 0.43 * lk, legL: 0.41 * lk, foot: 0.07, torso: 0.55 * (1 - 0.04 * ch),
      chestW: (fem ? 0.36 : 0.43) * wk, chestD: 0.23 * (o.wide || 1), waistW: (fem ? 0.29 : 0.34) * wk,
      headH: 0.25 * hk, headW: 0.205 * hk, headD: 0.225 * hk, armU: 0.29 * lk, armL: 0.26 * lk,
      armT: (fem ? 0.085 : 0.1) * (o.wide || 1), legT: (fem ? 0.125 : 0.14) * (o.wide || 1),
    };
    D.hipH = D.legU + D.legL + D.foot;
    D.height = D.hipH + 0.06 + D.torso + 0.06 + D.headH;
    const P = (parent, type, color, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) => {
      const m = new T.Mesh(prim(type), this.mat(color)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(rx, ry, rz);
      m.castShadow = true; m.receiveShadow = false; parent.add(m); return m;
    };
    this.P = P;
    const hips = this.hips = new T.Group(); hips.position.y = D.hipH; body.add(hips);
    const pantsTop = o.robe ? o.shirt : o.pants;
    P(hips, 'box', pantsTop, 0, 0.02, 0, D.waistW + 0.03, 0.17, D.chestD * 0.92);
    const spine = this.spine = new T.Group(); spine.position.y = 0.07; hips.add(spine);
    P(spine, 'box', o.shirt, 0, D.torso * 0.24, 0, D.waistW, D.torso * 0.5, D.chestD * 0.9);
    P(spine, 'box', o.shirt, 0, D.torso * 0.68, 0, D.chestW, D.torso * 0.58, D.chestD);
    if (fem && ch < 0.5) P(spine, 'box', o.shirt, 0, D.torso * 0.66, D.chestD * 0.42, D.chestW * 0.8, D.torso * 0.22, 0.08);
    const neck = this.neck = new T.Group(); neck.position.y = D.torso; spine.add(neck);
    P(neck, 'box', o.skin, 0, 0.04, 0, 0.09 + 0.02 * ch, 0.1, 0.09);
    const head = this.head = new T.Group(); head.position.y = 0.07; neck.add(head);
    P(head, 'box', o.skin, 0, D.headH / 2, 0, D.headW, D.headH, D.headD);
    // yüz
    const fz = D.headD / 2 + 0.004;
    this.eyes = [];
    for (const sx of [-1, 1]) {
      const e = P(head, 'box', '#f4efe6', sx * D.headW * 0.23, D.headH * 0.5, fz - 0.002, 0.05 * hk, 0.035 * hk, 0.01);
      const pu = P(head, 'box', o.eyes, sx * D.headW * 0.22, D.headH * 0.5, fz + 0.004, 0.026 * hk, 0.034 * hk, 0.01);
      this.eyes.push(e, pu);
      P(head, 'box', shade(o.hair, 0.9), sx * D.headW * 0.24, D.headH * 0.64, fz + 0.002, 0.06 * hk, 0.014, 0.012, 0, 0, sx * (o.browTilt || 0.08));
    }
    P(head, 'box', shade(o.skin, 0.88), 0, D.headH * 0.38, fz + 0.01, 0.03, 0.05, 0.03);
    this.mouth = P(head, 'box', '#7a3b33', 0, D.headH * 0.2, fz, 0.06, 0.012, 0.01);
    P(head, 'box', o.skin, D.headW / 2 + 0.01, D.headH * 0.48, 0, 0.025, 0.06, 0.05);
    P(head, 'box', o.skin, -D.headW / 2 - 0.01, D.headH * 0.48, 0, 0.025, 0.06, 0.05);
    this.addHair(o.hairStyle, o.hair);
    // kollar
    const sleeveC = o.sleeves === 'none' ? o.skin : o.shirt;
    const arm = (side) => {
      const sh = new T.Group(); sh.position.set(side * (D.chestW / 2 + D.armT * 0.45), D.torso * 0.92, 0); spine.add(sh);
      P(sh, 'box', sleeveC, 0, -D.armU / 2 + 0.02, 0, D.armT * 1.05, D.armU + 0.04, D.armT * 1.05);
      const el = new T.Group(); el.position.y = -D.armU; sh.add(el);
      P(el, 'box', o.sleeves === 'long' ? o.shirt : o.skin, 0, -D.armL / 2, 0, D.armT * 0.92, D.armL, D.armT * 0.92);
      const hand = new T.Group(); hand.position.y = -D.armL; el.add(hand);
      P(hand, 'box', o.gloves || o.skin, 0, -0.045, 0.005, D.armT * 0.9, 0.09, D.armT * 1.05);
      return [sh, el, hand];
    };
    [this.shL, this.elL, this.handL] = arm(1);
    [this.shR, this.elR, this.handR] = arm(-1);
    // bacaklar
    const leg = (side) => {
      const hp = new T.Group(); hp.position.set(side * D.waistW * 0.26, 0, 0); hips.add(hp);
      P(hp, 'box', o.pants, 0, -D.legU / 2, 0, D.legT, D.legU + 0.02, D.legT * 1.05);
      const kn = new T.Group(); kn.position.y = -D.legU; hp.add(kn);
      P(kn, 'box', o.boots ? o.shoes : o.pants, 0, -D.legL / 2, 0, D.legT * 0.88, D.legL, D.legT * 0.9);
      P(kn, 'box', o.shoes, 0, -D.legL - D.foot / 2 + 0.005, 0.035, D.legT * 0.95, D.foot, 0.22 * lk);
      return [hp, kn];
    };
    [this.lgL, this.knL] = leg(1);
    [this.lgR, this.knR] = leg(-1);
    for (const ex of o.extras) this.addExtra(ex);
    root.scale.setScalar(o.scale);
    this.pose = blankPose(); this.base = blankPose(); this.act = null; this.stance = null; this.stanceW = 0; this.stanceName = null;
    this.phase = 0; this.speed = 0; this.runSpeed = 4.5; this.blinkT = frand(1, 4); this.lookTarget = null; this.lookYaw = 0; this.lookPitch = 0;
    this.talking = false; this.flashT = 0; this.capeSwing = 0; this.weapon = null; this.idleSeed = Math.random() * 10;
    this.breathe = 1;
  }
  mat(hex) {
    if (!this.mats[hex]) { const m = new T.MeshLambertMaterial({ color: hex }); this.mats[hex] = m; this.allMats.push(m); }
    return this.mats[hex];
  }
  addHair(style, c) {
    const D = this.D, h = this.head, P = this.P, W = D.headW, H = D.headH, Dd = D.headD;
    if (style === 'bald') return;
    const cap = () => { P(h, 'box', c, 0, H * 0.9, -0.005, W * 1.08, H * 0.28, Dd * 1.08); P(h, 'box', c, 0, H * 0.6, -Dd * 0.47, W * 1.08, H * 0.62, Dd * 0.18); P(h, 'box', c, W * 0.5, H * 0.68, -Dd * 0.12, 0.03, H * 0.38, Dd * 0.75); P(h, 'box', c, -W * 0.5, H * 0.68, -Dd * 0.12, 0.03, H * 0.38, Dd * 0.75); };
    cap();
    switch (style) {
      case 'short': P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 1.0, H * 0.12, 0.05); break;
      case 'messy':
        P(h, 'box', c, -W * 0.18, H * 0.82, Dd * 0.46, W * 0.5, H * 0.18, 0.05, 0.2, 0, 0.15);
        P(h, 'box', c, W * 0.2, H * 0.8, Dd * 0.46, W * 0.45, H * 0.2, 0.05, 0.25, 0, -0.2);
        for (let i = 0; i < 5; i++) P(h, 'box', c, (i - 2) * W * 0.2, H * 1.04, (i % 2 - 0.4) * Dd * 0.3, W * 0.22, H * 0.16, Dd * 0.3, rnd(-0.4, 0.4), rnd(-0.5, 0.5), rnd(-0.4, 0.4));
        break;
      case 'long': P(h, 'box', c, 0, H * 0.22, -Dd * 0.42, W * 1.12, H * 1.1, Dd * 0.22); P(h, 'box', c, W * 0.5, H * 0.35, -Dd * 0.05, 0.05, H * 0.8, Dd * 0.6); P(h, 'box', c, -W * 0.5, H * 0.35, -Dd * 0.05, 0.05, H * 0.8, Dd * 0.6); P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 1.0, H * 0.14, 0.05); break;
      case 'ponytail': P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 1.0, H * 0.12, 0.05); P(h, 'box', c, 0, H * 0.75, -Dd * 0.6, 0.07, 0.07, 0.07); { const pt = new T.Group(); pt.position.set(0, H * 0.75, -Dd * 0.62); h.add(pt); P(pt, 'box', c, 0, -H * 0.5, -0.02, 0.08, H * 1.0, 0.07); this.tail = pt; } break;
      case 'bun': P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 1.0, H * 0.12, 0.05); P(h, 'ico0', c, 0, H * 1.0, -Dd * 0.45, 0.13, 0.12, 0.12); break;
      case 'bob': P(h, 'box', c, 0, H * 0.42, -Dd * 0.42, W * 1.12, H * 0.7, Dd * 0.22); P(h, 'box', c, W * 0.52, H * 0.45, -0.01, 0.05, H * 0.62, Dd * 0.8); P(h, 'box', c, -W * 0.52, H * 0.45, -0.01, 0.05, H * 0.62, Dd * 0.8); P(h, 'box', c, 0, H * 0.82, Dd * 0.46, W * 1.02, H * 0.18, 0.05); break;
      case 'braid': P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 1.0, H * 0.12, 0.05); { const pt = new T.Group(); pt.position.set(0, H * 0.4, -Dd * 0.55); h.add(pt); for (let i = 0; i < 5; i++) P(pt, 'box', c, 0, -i * 0.07, -0.01, 0.065 - i * 0.004, 0.075, 0.065, 0, i % 2 ? 0.4 : -0.4, 0); this.tail = pt; } break;
      case 'curly': for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; P(h, 'ico0', c, Math.cos(a) * W * 0.42, H * (0.95 + 0.05 * Math.sin(a * 3)), Math.sin(a) * Dd * 0.42 - 0.02, 0.12, 0.1, 0.12); } P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 0.9, H * 0.14, 0.06); break;
      case 'slick': P(h, 'box', c, 0, H * 0.98, 0, W * 1.1, H * 0.12, Dd * 1.1, 0, 0, 0.06); P(h, 'box', c, W * 0.15, H * 0.9, Dd * 0.47, W * 0.8, H * 0.1, 0.04, 0, 0, 0.15); break;
      case 'spiky': for (let i = 0; i < 7; i++) P(h, 'cone4', c, (i - 3) * W * 0.15, H * 1.05, rnd(-0.06, 0.04), 0.09, 0.14, 0.09, rnd(-0.6, 0.2), 0, (i - 3) * 0.15); break;
      case 'tied': P(h, 'box', c, 0, H * 0.84, Dd * 0.45, W * 1.0, H * 0.12, 0.05); P(h, 'box', c, 0, H * 0.55, -Dd * 0.62, 0.11, 0.11, 0.08); break;
    }
  }
  addExtra(ex) {
    const D = this.D, P = this.P, o = this.o;
    const type = typeof ex === 'string' ? ex : ex.t; const c = ex.c || '#555';
    switch (type) {
      case 'dress': { const L = ex.len || (D.legU + D.legL * 0.75); P(this.hips, 'tcyl8', c, 0, -L / 2 + 0.08, 0, D.waistW * 2.1, L, D.chestD * 2.1); break; }
      case 'robe': { const L = D.hipH; P(this.hips, 'tcyl8', c, 0, -L / 2 + 0.06, 0, D.waistW * 2.3, L, D.chestD * 2.3); break; }
      case 'skirtShort': { const L = D.legU * 0.7; P(this.hips, 'tcyl8', c, 0, -L / 2 + 0.06, 0, D.waistW * 1.9, L, D.chestD * 1.9); break; }
      case 'coat': { const L = D.legU * 0.85; P(this.hips, 'tcyl8', c, 0, -L / 2 + 0.05, -0.01, D.waistW * 1.9, L, D.chestD * 1.8); break; }
      case 'apron': P(this.hips, 'box', c, 0, -0.18, D.chestD * 0.5, D.waistW * 0.9, 0.42, 0.02); P(this.spine, 'box', c, 0, D.torso * 0.5, D.chestD * 0.52, D.waistW * 0.8, D.torso * 0.5, 0.02); break;
      case 'vest': P(this.spine, 'box', c, 0, D.torso * 0.62, 0, D.chestW + 0.025, D.torso * 0.72, D.chestD + 0.025); break;
      case 'belt': P(this.hips, 'box', c, 0, 0.1, 0, D.waistW + 0.05, 0.05, D.chestD * 0.98); P(this.hips, 'box', ex.buckle || '#c9a85a', 0, 0.1, D.chestD * 0.5, 0.05, 0.05, 0.02); break;
      case 'trim': P(this.spine, 'box', c, 0, D.torso * 0.68, D.chestD / 2 + 0.006, 0.03, D.torso * 0.58, 0.01); P(this.spine, 'box', c, 0, D.torso * 0.97, 0, D.chestW + 0.01, 0.03, D.chestD + 0.01); break;
      case 'armor': {
        const m = c, t = ex.trim || '#c9a85a';
        P(this.spine, 'box', m, 0, D.torso * 0.68, 0, D.chestW + 0.04, D.torso * 0.6, D.chestD + 0.05);
        P(this.spine, 'box', shade(m, 0.85), 0, D.torso * 0.3, 0, D.waistW + 0.04, D.torso * 0.3, D.chestD * 0.95);
        P(this.spine, 'box', t, 0, D.torso * 0.68, D.chestD / 2 + 0.03, 0.04, D.torso * 0.5, 0.01);
        for (const [sh, s] of [[this.shL, 1], [this.shR, -1]]) P(sh, 'box', m, s * 0.02, 0.0, 0, D.armT * 1.7, 0.1, D.armT * 1.8, 0, 0, s * 0.3);
        for (const kn of [this.knL, this.knR]) P(kn, 'box', m, 0, -D.legL * 0.45, 0.01, D.legT * 1.05, D.legL * 0.7, D.legT * 1.1);
        break;
      }
      case 'cape': {
        const cp = this.cape = new T.Group(); cp.position.set(0, D.torso * 0.95, -D.chestD / 2 - 0.02); this.spine.add(cp);
        const L = ex.len || (D.torso + D.hipH * 0.75);
        P(cp, 'box', c, 0, -L / 2, -0.01, D.chestW * 1.15, L, 0.025);
        if (ex.collar) P(this.spine, 'box', ex.collar, 0, D.torso * 0.96, 0, D.chestW + 0.05, 0.07, D.chestD + 0.06);
        break;
      }
      case 'hood': P(this.head, 'box', c, 0, D.headH * 0.6, -0.02, D.headW * 1.3, D.headH * 1.3, D.headD * 1.3); P(this.head, 'box', shade(c, 0.6), 0, D.headH * 0.55, D.headD * 0.62, D.headW * 1.05, D.headH * 0.95, 0.01); break;
      case 'hoodDown': P(this.spine, 'box', c, 0, D.torso * 0.98, -D.chestD * 0.5, D.chestW * 0.8, 0.12, 0.12); break;
      case 'hat': P(this.head, 'cyl12', c, 0, D.headH * 0.95, 0, D.headW * 2.2, 0.03, D.headD * 2.1); P(this.head, 'cone8', c, 0, D.headH * 1.12, 0, D.headW * 1.15, 0.22, D.headD * 1.15); break;
      case 'cap': P(this.head, 'box', c, 0, D.headH * 0.98, 0, D.headW * 1.12, 0.07, D.headD * 1.12); P(this.head, 'box', c, 0, D.headH * 0.94, D.headD * 0.62, D.headW * 0.8, 0.02, 0.1); break;
      case 'scarf': P(this.neck, 'box', c, 0, 0.03, 0, 0.18, 0.08, 0.17); P(this.spine, 'box', c, 0.06, D.torso * 0.75, D.chestD * 0.52, 0.06, D.torso * 0.35, 0.03); break;
      case 'beard': P(this.head, 'box', c, 0, D.headH * 0.13, D.headD * 0.42, D.headW * 0.85, D.headH * 0.32, 0.07); P(this.head, 'box', c, 0, D.headH * 0.27, D.headD * 0.5, D.headW * 0.5, 0.03, 0.03); break;
      case 'mustache': P(this.head, 'box', c, 0, D.headH * 0.27, D.headD * 0.51, D.headW * 0.5, 0.025, 0.03); break;
      case 'satchel': P(this.hips, 'box', c, -D.waistW * 0.6, -0.05, 0.02, 0.06, 0.18, 0.16); P(this.spine, 'box', shade(c, 0.8), 0, D.torso * 0.6, D.chestD * 0.52, 0.03, D.torso * 0.9, 0.01, 0, 0, 0.75); break;
      case 'sheath': P(this.hips, 'box', '#3b2a1e', D.waistW * 0.62, -0.25, -0.02, 0.05, 0.75, 0.08, 0.15, 0, 0.12); P(this.hips, 'box', '#c9a85a', D.waistW * 0.6, 0.12, 0.02, 0.06, 0.12, 0.06, 0.15, 0, 0.12); break;
      case 'quiver': P(this.spine, 'cyl8', c, -0.08, D.torso * 0.6, -D.chestD * 0.62, 0.1, 0.45, 0.1, 0, 0, 0.35); for (let i = 0; i < 3; i++) P(this.spine, 'box', '#e8e0cc', -0.15 + i * 0.03, D.torso * 0.6 + 0.3, -D.chestD * 0.62, 0.02, 0.12, 0.02, 0, 0, 0.35); break;
      case 'bowBack': { const g = new T.Group(); g.position.set(0.04, D.torso * 0.55, -D.chestD * 0.6); g.rotation.z = -0.4; this.spine.add(g); for (let i = -3; i <= 3; i++) P(g, 'box', c, Math.abs(i) * Math.abs(i) * 0.012, i * 0.11, 0, 0.03, 0.12, 0.03, 0, 0, -i * 0.12); P(g, 'box', '#ddd', 0.11, 0, 0, 0.005, 0.7, 0.005); break; }
      case 'circlet': P(this.head, 'box', c, 0, D.headH * 0.78, 0, D.headW * 1.12, 0.025, D.headD * 1.12); P(this.head, 'octa', '#7fd0ff', 0, D.headH * 0.8, D.headD * 0.57, 0.04, 0.05, 0.02); break;
      case 'necklace': P(this.spine, 'box', c, 0, D.torso * 0.86, D.chestD * 0.52, 0.04, 0.05, 0.02); break;
      case 'bandage': P(this.head, 'box', c, 0, D.headH * 0.72, 0, D.headW * 1.1, 0.04, D.headD * 1.1); break;
      case 'sash': P(this.spine, 'box', c, 0, D.torso * 0.55, 0, D.chestW + 0.02, 0.06, D.chestD + 0.02, 0, 0, 0.6); break;
    }
  }
  setWeapon(type) {
    if (this.weapon) { this.handR.remove(this.weapon); this.weapon = null; }
    if (!type) return;
    const g = new T.Group(); g.position.set(0, -0.06, 0.02);
    const add = (t, c, x, y, z, sx, sy, sz, rx = 0) => { const m = new T.Mesh(prim(t), this.mat(c)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.x = rx; m.castShadow = true; g.add(m); return m; };
    if (type === 'stick') { add('cyl5', '#7a5434', 0, 0, 0.32, 0.05, 0.95, 0.05, Math.PI / 2); add('box', '#6a4a2e', 0.02, 0, 0.62, 0.03, 0.05, 0.08); }
    if (type === 'sword') { add('box', '#d8dde3', 0, 0, 0.52, 0.025, 0.06, 0.82); add('box', '#c9a85a', 0, 0, 0.1, 0.2, 0.04, 0.04); add('box', '#4a3020', 0, 0, 0.0, 0.035, 0.035, 0.16); }
    if (type === 'woodsword') { add('box', '#a77b4e', 0, 0, 0.42, 0.03, 0.06, 0.66); add('box', '#6a4a2e', 0, 0, 0.08, 0.16, 0.04, 0.04); }
    if (type === 'staff') { add('cyl6', '#4a3424', 0, 0.55, 0, 0.05, 1.7, 0.05); const gm = add('octa', '#9fe0ff', 0, 1.45, 0, 0.12, 0.18, 0.12); gm.material = new T.MeshBasicMaterial({ color: '#bff0ff' }); }
    if (type === 'lantern') { add('box', '#3a3026', 0, -0.12, 0, 0.12, 0.16, 0.12); const l = add('box', '#ffd27a', 0, -0.12, 0, 0.09, 0.12, 0.09); l.material = new T.MeshBasicMaterial({ color: '#ffcf70' }); add('box', '#3a3026', 0, -0.02, 0, 0.02, 0.06, 0.02); }
    if (type === 'bucket') { add('cyl8', '#6a5038', 0, -0.2, 0, 0.22, 0.24, 0.22); }
    if (type === 'pitchfork') { add('cyl5', '#7a5434', 0, 0.3, 0, 0.045, 1.6, 0.045); for (let i = -1; i <= 1; i++) add('box', '#8a8d90', i * 0.05, 1.15, 0, 0.015, 0.25, 0.015); }
    if (type === 'bowl') { add('cyl8', '#8a6a48', 0, -0.06, 0.06, 0.18, 0.07, 0.18); }
    if (type === 'book') { add('box', '#6b2b2b', 0, -0.05, 0.05, 0.16, 0.04, 0.22); }
    if (type === 'bread') { add('box', '#c8955a', 0, -0.05, 0.06, 0.13, 0.11, 0.3); add('box', '#a8743e', 0, 0.0, 0.06, 0.1, 0.03, 0.26); }
    if (type === 'jar') { add('cyl8', '#b8c8a8', 0, -0.06, 0.04, 0.09, 0.11, 0.09); add('cyl8', '#6a5038', 0, 0.0, 0.04, 0.1, 0.03, 0.1); }
    if (type === 'pouch') { add('sph8', '#7a5a3a', 0, -0.07, 0.05, 0.13, 0.12, 0.13); }
    if (type === 'apple') { add('sph8', '#c83a2a', 0, -0.05, 0.05, 0.08, 0.08, 0.08); }
    if (type === 'cup') { add('cyl8', '#9a8a70', 0, -0.05, 0.03, 0.08, 0.1, 0.08); }
    this.weapon = g; this.handR.add(g);
  }
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
    this.blinkT -= dt;
    const blink = this.closedEyes || (this.blinkT < 0.12 && this.blinkT > 0);
    if (this.blinkT < 0) this.blinkT = frand(2, 5);
    for (const e of this.eyes) e.scale.y = blink ? 0.008 : (e === this.eyes[0] || e === this.eyes[2] ? 0.035 : 0.034) * (1 + 0.3 * this.o.child);
    this.mouth.scale.y = this.talking ? 0.012 + Math.abs(Math.sin(G.t * 16)) * 0.03 : 0.012;
    if (this.flashT > 0) { this.flashT -= dt; if (this.flashT <= 0) for (const m of this.allMats) m.emissive.set('#000000'); }
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
  dispose() { for (const m of this.allMats) m.dispose(); }
}

// Kalabalıklar için statik pişirme
function bakeHumanoid(b, opts, stance, x, y, z, ry, extraPose) {
  const h = new Humanoid(opts);
  if (stance) h.setStance(stance); h.stanceW = 1;
  h.update(0.016, 0);
  if (extraPose) { Object.assign(h.pose, extraPose); h.apply(h.pose, 0, 0); }
  h.root.position.set(x, y, z); h.root.rotation.y = ry;
  h.root.updateMatrixWorld(true);
  h.root.traverse(m => { if (m.isMesh) b.addGeo(m.geometry, '#' + m.material.color.getHexString(), m.matrixWorld, 0.03); });
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
