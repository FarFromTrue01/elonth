// ---------- Yaratıklar: fare, örümcek, Fare Kralı (prosedürel, Humanoid ile aynı arayüz) ----------
ACTIONS.bite = { dur: 0.4, keys: [{ t: 0 }, { t: 1 }] };
ACTIONS.leap = { dur: 0.5, keys: [{ t: 0 }, { t: 1 }] };
ACTIONS.swipe = { dur: 0.5, keys: [{ t: 0 }, { t: 1 }] };
const CREATURE_KINDS = {
  rat: { fur: '#6b5c4e', belly: '#a89a88', skin: '#c89a96', eye: '#1a0c0c', scale: 0.55, legs: 4 },
  sewer: { fur: '#4a4038', belly: '#8a7e70', skin: '#b08682', eye: '#2a0808', scale: 0.62, legs: 4 },
  king: { fur: '#5a4a44', belly: '#8a7468', skin: '#b87a78', eye: '#ff3a2a', scale: 1.75, legs: 4, king: true },
  spider: { fur: '#2c2430', belly: '#4a3a48', skin: '#5a4a58', eye: '#ff4a4a', scale: 0.62, legs: 8 },
};
class CreatureModel {
  constructor(kind = 'rat', o = {}) {
    const K = this.K = Object.assign({}, CREATURE_KINDS[kind] || CREATURE_KINDS.rat, o);
    this.kind = kind; this.o = { scale: K.scale * (o.sizeMul || 1) }; this.D = { height: 0.45 * this.o.scale, headH: 0.2 * this.o.scale };
    this.allMats = []; this.outlines = []; this.talking = false; this.closedEyes = false; this.lookTarget = null; this.expr = 'neutral';
    const root = this.root = new T.Group(); const body = this.body = new T.Group(); root.add(body);
    const mats = {}; const parts = new Map();
    const mat = c => mats[c] || (mats[c] = (() => { const dbl = c.endsWith('|2'); const m = TOON.mat(c.replace('|2', ''), dbl ? { side: T.DoubleSide } : {}); this.allMats.push(m); return m; })());
    const add = (grp, geo, col, m) => { let g = parts.get(grp); if (!g) parts.set(grp, g = {}); (g[col] = g[col] || []).push({ geo, m }); };
    const S = sphGeo(14, 10), S2 = sphGeo(8, 6);
    this.legs = []; this.phase = Math.random() * 6; this.t = Math.random() * 10; this.act = null; this.lieW = 0; this.knockT = -1; this.hitT = 0;
    if (kind === 'spider') this.buildSpider(K, body, add, S, S2);
    else this.buildRat(K, body, add, S, S2);
    for (const [grp, cols] of parts) for (const col in cols) {
      const geo = mergeParts(cols[col]); const mesh = new T.Mesh(geo, mat(col)); mesh.castShadow = true; mesh.receiveShadow = true; grp.add(mesh);
      if (!col.endsWith('|2')) { const ol = new T.Mesh(geo, TOON.outline); ol.userData.outline = true; grp.add(ol); this.outlines.push(ol); }
    }
    root.scale.setScalar(1);
    body.position.y = this.baseY = kind === 'spider' ? 0.2 : 0.17;
    for (const m of this.allMats) { m.emissive = m.emissive || new T.Color(0, 0, 0); }
  }
  buildRat(K, body, add, S, S2) {
    const k = K.scale;
    // gövde + kalça
    add(body, S, K.fur, mtx(0, 0, 0, 0.32, 0.28, 0.62)); add(body, S, K.fur, mtx(0, 0.01, -0.22, 0.36, 0.32, 0.4)); add(body, S, K.belly, mtx(0, -0.07, 0.02, 0.24, 0.16, 0.5));
    // kafa
    const head = this.head = new T.Group(); head.position.set(0, 0.04, 0.34); body.add(head);
    add(head, S, K.fur, mtx(0, 0.0, 0.08, 0.22, 0.2, 0.3)); add(head, S, K.fur, mtx(0, -0.025, 0.24, 0.12, 0.11, 0.22));
    add(head, S2, K.skin, mtx(0, -0.01, 0.35, 0.05, 0.045, 0.045));
    for (const sx of [-1, 1]) {
      add(head, S2, K.eye, mtx(sx * 0.075, 0.06, 0.16, 0.04, 0.045, 0.04));
      add(head, S, K.skin, mtx(sx * 0.1, 0.12, 0.0, 0.1, 0.11, 0.025, 0, sx * 0.35, 0));
      add(head, S2, '#e8dcc8', mtx(sx * 0.014, -0.06, 0.3, 0.015, 0.045, 0.012));
      for (let i = 0; i < 3; i++) add(head, S2, '#d8d0c0', mtx(sx * 0.1, -0.02 + (i - 1) * 0.02, 0.3, 0.2, 0.004, 0.004, 0, 0, sx * (0.2 - i * 0.2)));
    }
    if (K.king) {
      // taç: altın halka ve sivri uçlar; yırtık kulak; çapraz yara
      add(head, new T.CylinderGeometry(0.5, 0.5, 0.18, 10, 1, true), '#d8b04a|2', mtx(0, 0.14, 0.05, 0.22, 1, 0.22));
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; add(head, new T.ConeGeometry(0.5, 1, 5), '#e8c45a', mtx(Math.sin(a) * 0.11, 0.25, 0.05 + Math.cos(a) * 0.11, 0.04, 0.12, 0.04)); }
      add(head, S2, '#8a2020', mtx(0.06, 0.07, 0.2, 0.012, 0.1, 0.012, 0, 0, 0.8));
      add(head, S2, '#ff6a40', mtx(-0.08, 0.06, 0.16, 0.055, 0.06, 0.05));
    }
    // bacaklar
    const legs = [[0.13, 0.22, 0], [-0.13, 0.22, 0], [0.15, -0.2, 1], [-0.15, -0.2, 1]];
    for (const [x, z, back] of legs) {
      const g = new T.Group(); g.position.set(x, -0.04, z); body.add(g);
      add(g, capsGeo(back ? 0.065 : 0.05, 0.04, 0.2, 8), K.fur, mtx(0, -0.08, back ? -0.02 : 0));
      add(g, S2, K.skin, mtx(0, -0.17, 0.04, 0.07, 0.03, 0.12));
      this.legs.push(g);
    }
    // kuyruk: üç eklem
    const tail = this.tail = new T.Group(); tail.position.set(0, 0.0, -0.42); body.add(tail);
    add(tail, capsGeo(0.022, 0.012, 0.3, 6), K.skin, mtx(0, 0, -0.13, 1, 1, 1, Math.PI / 2, 0, 0));
    const t2 = this.tail2 = new T.Group(); t2.position.set(0, 0, -0.28); tail.add(t2); add(t2, capsGeo(0.012, 0.006, 0.3, 6), K.skin, mtx(0, 0, -0.14, 1, 1, 1, Math.PI / 2, 0, 0));
  }
  buildSpider(K, body, add, S, S2) {
    add(body, S, K.fur, mtx(0, 0.06, -0.2, 0.46, 0.4, 0.55)); add(body, S, K.belly, mtx(0, 0.09, 0.09, 0.28, 0.2, 0.3));
    add(body, S2, '#b02a2a', mtx(0, 0.26, -0.22, 0.12, 0.012, 0.18));
    const head = this.head = new T.Group(); head.position.set(0, 0.07, 0.3); body.add(head);
    add(head, S, K.fur, mtx(0, 0, 0, 0.26, 0.2, 0.22));
    for (let i = 0; i < 6; i++) add(head, S2, K.eye, mtx((i % 3 - 1) * 0.05, 0.05 + Math.floor(i / 3) * 0.04, 0.1, 0.03, 0.03, 0.03));
    for (const sx of [-1, 1]) add(head, new T.ConeGeometry(0.5, 1, 6), '#e8e0d0', mtx(sx * 0.045, -0.07, 0.12, 0.03, 0.12, 0.03, 0.4, 0, 0));
    for (let i = 0; i < 8; i++) {
      const sx = i < 4 ? 1 : -1, j = i % 4, g = new T.Group(); g.position.set(sx * 0.12, 0.08, 0.16 - j * 0.13); body.add(g);
      const yaw = (j - 1.5) * 0.45; g.rotation.y = sx > 0 ? Math.PI / 2 - yaw : -Math.PI / 2 + yaw; g.rotation.y = (sx > 0 ? 1 : -1) * (Math.PI / 2 - (j - 1.5) * 0.4) * (sx > 0 ? 1 : 1);
      add(g, capsGeo(0.026, 0.02, 0.32, 6), K.fur, mtx(0, 0.0, 0.16, 1, 1, 1, Math.PI / 2 - 0.5, 0, 0));
      const k2 = new T.Group(); k2.position.set(0, 0.14, 0.3); g.add(k2);
      add(k2, capsGeo(0.02, 0.012, 0.34, 6), K.fur, mtx(0, -0.12, 0.05, 1, 1, 1, -0.4, 0, 0));
      this.legs.push(g);
    }
    this.tail = null;
  }
  setStance(n) { this.stance = n; this.lying = n === 'lie' || n === 'kneel2'; }
  setUpper() { } setExpression() { } emote(e) { this.emoteE = e; } curExpr() { return 'neutral'; } setWeapon() { } stop() { this.act = null; }
  play(name, mul = 1) {
    const a = ACTIONS[name]; const dur = a ? a.dur / mul : 0.4;
    if (name === 'knock') { this.knockT = 0; this.act = null; return 1.3; }
    if (name === 'hit' || name === 'flinch') { this.hitT = 0.28; return 0.3; }
    this.act = { name, t: 0, dur }; return dur;
  }
  flash(color = '#ffffff', t = 0.12) { this.flashT = t; for (const m of this.allMats) if (m.emissive) m.emissive.set(color).multiplyScalar(0.6); }
  update(dt, speed) {
    this.t += dt; const K = this.K, sp = Math.min(speed, 6);
    if (this.flashT > 0) { this.flashT -= dt; if (this.flashT <= 0) for (const m of this.allMats) if (m.emissive) m.emissive.set('#000'); }
    this.phase += dt * (4 + sp * 3.2); const ph = this.phase, a = Math.min(1, sp / 1.6);
    const spider = this.kind === 'spider', body = this.body;
    // yatma / yuvarlanma
    this.lieW += ((this.lying ? 1 : 0) - this.lieW) * Math.min(1, dt * 8);
    let roll = this.lieW * Math.PI;
    if (this.knockT >= 0) { this.knockT += dt; const u = Math.min(1, this.knockT / 0.5); roll = Math.sin(u * Math.PI) * 1.2 + this.lieW * Math.PI; if (this.knockT > 1.3) this.knockT = -1; }
    let lunge = 0, pitch = 0, headZ = 0;
    if (this.act) {
      const A = this.act; A.t += dt; const u = Math.min(1, A.t / A.dur);
      if (A.name === 'bite') { lunge = Math.sin(u * Math.PI) * 0.22 * this.o.scale; headZ = Math.sin(u * Math.PI) * 0.12; pitch = Math.sin(u * Math.PI) * 0.25; }
      else if (A.name === 'leap') { lunge = Math.sin(Math.min(1, u * 1.4) * Math.PI) * 0.5 * this.o.scale; body.position.y = this.baseY + Math.sin(u * Math.PI) * 0.35; pitch = -0.4 * Math.sin(u * Math.PI); }
      else if (A.name === 'swipe') { lunge = Math.sin(u * Math.PI) * 0.35 * this.o.scale; pitch = Math.sin(u * Math.PI) * 0.4; headZ = Math.sin(u * Math.PI) * 0.18; }
      if (A.t >= A.dur) this.act = null;
    }
    if (!this.act || this.act.name !== 'leap') body.position.y = this.baseY + Math.abs(Math.sin(ph)) * 0.025 * a * (spider ? 0.4 : 1) + Math.sin(this.t * 2.4) * 0.004 - this.lieW * 0.03;
    if (this.hitT > 0) { this.hitT -= dt; pitch -= 0.35 * (this.hitT / 0.28); lunge -= 0.12 * (this.hitT / 0.28); }
    body.rotation.z = roll; body.rotation.x = pitch * 0.6; body.position.z = lunge; if (this.head) this.head.position.z += (headZ + (spider ? 0.3 : 0.34) - this.head.position.z) * Math.min(1, dt * 20);
    // yürüyüş
    for (let i = 0; i < this.legs.length; i++) {
      const g = this.legs[i];
      if (spider) { const off = (i % 2 ? Math.PI : 0) + (i % 4) * 0.7; g.rotation.x = Math.sin(ph + off) * 0.28 * a; g.rotation.z = (i < 4 ? 1 : -1) * (this.lieW * -1.1 + Math.max(0, Math.sin(ph + off)) * 0.18 * a); }
      else { const off = [0, Math.PI, Math.PI, 0][i]; g.rotation.x = Math.sin(ph + off) * 0.7 * a + this.lieW * (i % 2 ? 0.6 : -0.6); }
    }
    if (this.tail) { this.tail.rotation.y = Math.sin(this.t * 2.2 + this.phase * 0.2) * 0.35 * (0.4 + a); this.tail.rotation.x = -0.2 + Math.sin(this.t * 1.7) * 0.1; if (this.tail2) this.tail2.rotation.y = Math.sin(this.t * 2.2 - 0.9) * 0.45; }
    if (this.head && !spider) this.head.rotation.x = Math.sin(this.t * 3.1) * 0.06 + Math.sin(ph * 2) * 0.03 * a - pitch * 0.5;
    if (G.camera && (this._olT = (this._olT || 0) + dt) > 0.4) { this._olT = 0; const far = G.camera.position.distanceTo(this.root.position) > 22; for (const ol of this.outlines) ol.visible = !far; }
  }
  dispose() { for (const m of this.allMats) m.dispose(); }
}
