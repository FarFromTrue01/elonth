// ---------- Karakterler ----------
const CAST = {
  joseph: { name: 'Joseph', color: '#ead6a8' },
  thought: { name: 'Joseph', color: '#9fb2c8' },
  lawyer: { name: 'Avukat', color: '#c8ccd4' },
  marcus: { name: 'Marcus · telefon', color: '#8fa0b8' },
  lily: { name: 'Lily', color: '#f4a9bb' },
  marta: { name: 'Marta', color: '#eab48e' },
  daniel: { name: 'Daniel', color: '#cfae7a' },
  nora: { name: 'Nora', color: '#ff9a68' },
  leo: { name: 'Leo', color: '#a6dc7e' },
  clara: { name: 'Clara', color: '#9cd2f2' },
  selen: { name: 'Selen', color: '#8ed48a', rank: 'E' },
  victor: { name: 'Victor', color: '#e2bc58' },
  bram: { name: 'Bram', color: '#b8a690' },
  osric: { name: 'Osric', color: '#a8a0b0' },
  elder: { name: 'Tobias Dede', color: '#d4cbb2' },
  kid: { name: 'Küçük Tom', color: '#c8d8a0' },
  isolde: { name: 'Isolde', color: '#e6ecf8', rank: 'D' },
  seraphine: { name: 'Seraphine', color: '#bda8f2', rank: 'D' },
  rowena: { name: 'Rowena', color: '#f2c072', rank: 'E' },
  guard: { name: 'Muhafız', color: '#a8b4c0' },
  priest: { name: 'Başrahip', color: '#f2e2b0' },
  crowd: { name: 'Kalabalık', color: '#a89c88' },
  noble: { name: 'Soylu bir kadın', color: '#d8b0c0' },
  villager: { name: 'Köylü kadın', color: '#c8b498' },
  sys: { name: 'SİSTEM', color: '#74d8ff' },
};
const AGE = { 10: { scale: 0.72, child: 1 }, 12: { scale: 0.79, child: 0.82 }, 15: { scale: 0.91, child: 0.42 }, 17: { scale: 0.98, child: 0.12 }, 18: { scale: 1.0, child: 0 } };
const LOOK = {
  joseph(age = 10, o = {}) {
    const a = AGE[age]; return Object.assign({ scale: a.scale, child: a.child, skin: '#8e5c3a', hair: '#141010', hairStyle: 'messy', eyes: '#0c0a08', shirt: age >= 17 ? '#6f6250' : '#7a6a52', pants: '#463c30', shoes: '#33271c', wide: age >= 17 ? 1.07 : 1, sleeves: age >= 15 ? 'short' : 'short', extras: [{ t: 'belt', c: '#2e2218', buckle: '#5a4a3a' }].concat(age >= 15 ? [{ t: 'vest', c: '#4e4234' }] : []) }, o);
  },
  lily(jAge = 10) { const s = { 10: 0.55, 12: 0.62, 15: 0.74, 17: 0.82, 18: 0.85 }[jAge] || 0.55; const ch = { 10: 1, 12: 1, 15: 0.8, 17: 0.6, 18: 0.55 }[jAge] || 1; return { female: true, scale: s, child: ch, skin: '#94603c', hair: '#1a1210', hairStyle: 'braid', shirt: '#b8848a', pants: '#5a4038', shoes: '#3a2b20', extras: [{ t: 'dress', c: '#a87478' }] }; },
  marta() { return { female: true, scale: 0.95, skin: '#8a583a', hair: '#1c1412', hairStyle: 'bun', shirt: '#6e5c4a', pants: '#4a3c30', sleeves: 'long', extras: [{ t: 'dress', c: '#665444', len: 0.9 }, { t: 'apron', c: '#cfc2a8' }, { t: 'scarf', c: '#8a4a3a' }] }; },
  daniel() { return { scale: 1.02, skin: '#80522f', hair: '#1a1410', hairStyle: 'short', shirt: '#6f6450', pants: '#4b4033', wide: 1.08, extras: [{ t: 'beard', c: '#1a1410' }, { t: 'vest', c: '#54463a' }, { t: 'belt', c: '#2e2218' }] }; },
  nora(age = 10) { const a = AGE[age]; return { female: true, scale: a.scale * 0.97, child: a.child, skin: '#c08a60', hair: '#8a361c', hairStyle: 'ponytail', shirt: '#8a5a44', pants: '#4a3e34', shoes: '#33271c', browTilt: -0.12, extras: [{ t: 'belt', c: '#2a1e16' }].concat(age >= 15 ? [{ t: 'vest', c: '#5a3a2a' }] : []) }; },
  leo(age = 10) { const a = AGE[age]; return { scale: a.scale * 0.98, child: a.child, skin: SKIN.light, hair: '#a27c42', hairStyle: 'curly', shirt: '#5c7a4a', pants: '#4a4234', extras: [{ t: 'belt', c: '#2e2218' }].concat(age >= 15 ? [{ t: 'satchel', c: '#6a5038' }] : []) }; },
  clara(age = 10) { const a = AGE[age]; return { female: true, scale: a.scale * 0.95, child: a.child, skin: SKIN.pale, hair: '#dcb86c', hairStyle: 'long', shirt: '#4c6c9c', pants: '#3a3a4a', sleeves: 'long', shoes: '#2a2a32', extras: [{ t: 'dress', c: '#4a6a9a', len: a.child > 0.5 ? undefined : 0.85 }, { t: 'trim', c: '#e8dcc0' }, { t: 'necklace', c: '#c9a85a' }] }; },
  selen() { return { female: true, scale: 0.97, skin: SKIN.light, hair: '#a27c42', hairStyle: 'tied', shirt: '#6a4a32', pants: '#3e3428', boots: true, shoes: '#2e2218', sleeves: 'long', extras: [{ t: 'vest', c: '#5a3a24' }, { t: 'belt', c: '#2a1e16' }, { t: 'sheath' }, { t: 'cape', c: '#3e5a3a', len: 1.0 }] }; },
  victor(age = 10) { const a = AGE[age]; return { scale: a.scale * 1.02, child: a.child, skin: SKIN.pale, hair: '#dcc48c', hairStyle: 'slick', shirt: '#7a1e2a', pants: '#2a2024', shoes: '#140f0c', sleeves: 'long', boots: true, browTilt: 0.2, extras: [{ t: 'trim', c: '#d8b060' }, { t: 'coat', c: '#6a1a24' }, { t: 'belt', c: '#140f0c', buckle: '#e8c860' }] }; },
  bram(age = 10) { const a = AGE[age]; return { scale: a.scale * 1.06, child: a.child, skin: SKIN.light, hair: '#4a3020', hairStyle: 'short', shirt: '#4a5a6a', pants: '#2e2a26', wide: 1.2, extras: [{ t: 'belt', c: '#1e1812' }] }; },
  osric(age = 10) { const a = AGE[age]; return { scale: a.scale * 0.98, child: a.child, skin: SKIN.light, hair: '#2a1d14', hairStyle: 'spiky', shirt: '#5a4a6a', pants: '#2e2a26', wide: 0.9, extras: [{ t: 'cap', c: '#3a3040' }] }; },
  elder() { return { scale: 0.9, skin: '#a87a58', hair: '#d8d4cc', hairStyle: 'bald', shirt: '#6a5e4c', pants: '#4a4034', sleeves: 'long', extras: [{ t: 'beard', c: '#e0dcd4' }, { t: 'hoodDown', c: '#5a4e3e' }] }; },
  isolde() { return { female: true, scale: 1.0, skin: SKIN.pale, hair: '#e6dcc4', hairStyle: 'braid', shirt: '#2a4a7a', pants: '#2a2e3a', boots: true, shoes: '#9aa0aa', sleeves: 'long', browTilt: 0.15, extras: [{ t: 'armor', c: '#c4cad4', trim: '#d8b060' }, { t: 'cape', c: '#24406e', collar: '#e8e0d0' }, { t: 'sheath' }] }; },
  seraphine() { return { female: true, scale: 0.96, skin: '#e8d0be', hair: '#141016', hairStyle: 'long', shirt: '#3a2a5a', pants: '#2a2038', sleeves: 'long', shoes: '#1e1828', extras: [{ t: 'robe', c: '#32244e' }, { t: 'cape', c: '#241a3a', len: 1.5 }, { t: 'sash', c: '#9a86d8' }, { t: 'circlet', c: '#c8c0e0' }] }; },
  rowena() { return { female: true, scale: 0.97, skin: '#e6c2a2', hair: '#b4461e', hairStyle: 'braid', shirt: '#4a5a32', pants: '#3a3426', boots: true, shoes: '#3a2a1a', extras: [{ t: 'vest', c: '#6a4a2a' }, { t: 'belt', c: '#2a1e16' }, { t: 'quiver', c: '#5a3a22' }, { t: 'bowBack', c: '#6a4426' }] }; },
  guard() { return { scale: 1.02, skin: SKIN.light, hair: '#2a1d14', hairStyle: 'short', shirt: '#5a6a7a', pants: '#3a3a40', boots: true, shoes: '#2a2a2a', extras: [{ t: 'armor', c: '#9aa2ac', trim: '#6a7480' }, { t: 'cape', c: '#2f5a3a', len: 1.1 }] }; },
  knight() { return { scale: 1.02, skin: SKIN.light, hair: '#3a2a1c', hairStyle: 'short', shirt: '#2f5a3a', pants: '#2a2e2a', boots: true, shoes: '#8a9098', gloves: '#8a9098', sleeves: 'long', extras: [{ t: 'armor', c: '#b8bec8', trim: '#d8b060' }, { t: 'cape', c: '#2f5a3a', collar: '#d8b060' }, { t: 'sheath' }] }; },
  priest() { return { scale: 0.98, skin: SKIN.light, hair: '#e8e4dc', hairStyle: 'bald', shirt: '#ece4d0', pants: '#d8d0bc', sleeves: 'long', extras: [{ t: 'robe', c: '#e8e0cc' }, { t: 'sash', c: '#c9a85a' }, { t: 'beard', c: '#f0ece4' }, { t: 'cape', c: '#c9a85a', len: 1.6 }] }; },
  kid(f) { const o = randomVillager(f); o.scale = rnd(0.55, 0.68); o.child = 1; o.extras = o.extras.filter(e => e.t !== 'beard' && e.t !== 'hat'); return o; },
};

// At + süvari
class HorseModel {
  constructor(color = '#5a3a26') {
    const root = this.root = new T.Group(); this.o = { scale: 1 }; this.allMats = []; this.outlines = [];
    const mats = {}; const parts = new Map();
    const mat = c => { const k = c; if (mats[k]) return mats[k]; const dbl = c.endsWith('|2'); const m = TOON.mat(c.replace('|2', ''), dbl ? { side: T.DoubleSide } : {}); this.allMats.push(m); return mats[k] = m; };
    const add = (grp, geo, col, m) => { let g = parts.get(grp); if (!g) parts.set(grp, g = {}); (g[col] = g[col] || []).push({ geo, m }); };
    const coat = color, dark = '#1e1612', hoofC = '#2a2420', cloth = '#2f5a3a|2', gold = '#c9a85a', leather = '#3a2418', nose = shade(color, 0.72);
    const S = sphGeo(18, 12), S2 = sphGeo(10, 8);
    const body = this.body = new T.Group(); body.position.y = 1.3; root.add(body);
    add(body, S, coat, mtx(0, 0, 0, 0.68, 0.84, 1.55)); add(body, S, coat, mtx(0, 0.04, 0.6, 0.64, 0.82, 0.68)); add(body, S, coat, mtx(0, 0.08, -0.6, 0.72, 0.82, 0.76)); add(body, S, coat, mtx(0, 0.34, 0.42, 0.4, 0.34, 0.52));
    // eyer örtüsü, eyer, üzengiler
    const cg = new T.CylinderGeometry(0.4, 0.4, 0.74, 18, 1, true, -Math.PI / 2, Math.PI); cg.computeVertexNormals();
    add(body, cg, cloth, mtx(0, 0.02, -0.05, 1, 1, 1, Math.PI / 2, 0, 0));
    for (const sx of [-1, 1]) add(body, S2, gold, mtx(sx * 0.395, 0.02, -0.05, 0.035, 0.06, 0.74));
    add(body, S, leather, mtx(0, 0.41, -0.05, 0.48, 0.16, 0.6)); add(body, S2, leather, mtx(0, 0.5, 0.2, 0.14, 0.14, 0.1)); add(body, S2, leather, mtx(0, 0.49, -0.3, 0.32, 0.14, 0.08));
    for (const sx of [-1, 1]) { add(body, S2, leather, mtx(sx * 0.37, 0.12, 0.0, 0.025, 0.5, 0.04)); add(body, S2, '#8a8d90', mtx(sx * 0.38, -0.15, 0.0, 0.09, 0.04, 0.09)); }
    // boyun, yele
    const neck = this.neck = new T.Group(); neck.position.set(0, 0.28, 0.8); neck.rotation.x = 0.55; body.add(neck);
    add(neck, capsGeo(0.17, 0.3, 0.78, 14), coat, mtx(0, 0.78, 0, 0.74, 1, 1));
    for (let i = 0; i < 7; i++) add(neck, S2, dark, mtx(0, 0.12 + i * 0.11, -0.17 + i * 0.025 - (i > 4 ? (i - 4) * 0.02 : 0), 0.07, 0.18, 0.14, -0.2));
    // baş
    const head = this.head = new T.Group(); head.position.set(0, 0.8, 0.02); head.rotation.x = 0.15; neck.add(head);
    add(head, S, coat, mtx(0, 0.04, 0, 0.28, 0.32, 0.38)); add(head, capsGeo(0.135, 0.115, 0.44, 12), coat, mtx(0, -0.02, 0.06, 0.88, 1, 1, -Math.PI / 2, 0, 0));
    add(head, S, nose, mtx(0, -0.035, 0.5, 0.23, 0.19, 0.16));
    for (const sx of [-1, 1]) {
      add(head, S2, '#120c0a', mtx(sx * 0.06, -0.02, 0.575, 0.035, 0.045, 0.02));
      add(head, S2, '#0a0806', mtx(sx * 0.13, 0.085, 0.1, 0.05, 0.065, 0.06)); add(head, S2, '#ffffff', mtx(sx * 0.152, 0.1, 0.115, 0.012, 0.016, 0.012));
      add(head, new T.ConeGeometry(0.5, 1, 8), coat, mtx(sx * 0.085, 0.24, -0.07, 0.07, 0.17, 0.05, -0.15, 0, -sx * 0.25));
      add(head, S2, leather, mtx(sx * 0.14, 0.0, 0.14, 0.02, 0.24, 0.03));
    }
    add(head, S2, dark, mtx(0, 0.2, 0.04, 0.12, 0.07, 0.16, 0.4)); add(head, S2, gold, mtx(0, 0.15, 0.13, 0.3, 0.025, 0.03));
    add(head, S2, leather, mtx(0, -0.02, 0.36, 0.25, 0.03, 0.03, 0, 0, 0)); add(head, new T.TorusGeometry(0.13, 0.014, 6, 14), leather, mtx(0, -0.03, 0.36, 1, 0.85, 1, Math.PI / 2 - 0.1, 0, 0));
    // bacaklar (diz ekleminde iki parça)
    this.legs = []; this.knees = [];
    for (const [x, z, back] of [[0.19, 0.62, 0], [-0.19, 0.62, 0], [0.2, -0.64, 1], [-0.2, -0.64, 1]]) {
      const g = new T.Group(); g.position.set(x, -0.14, z); body.add(g);
      add(g, capsGeo(back ? 0.17 : 0.13, 0.085, 0.58, 12), coat, mtx(0, 0.02, back ? -0.03 : 0));
      const k = new T.Group(); k.position.y = -0.56; g.add(k);
      add(k, capsGeo(0.08, 0.065, 0.48, 10), coat, mtx(0, 0, 0)); add(k, S2, coat, mtx(0, -0.46, 0.01, 0.13, 0.12, 0.14));
      add(k, new T.CylinderGeometry(0.078, 0.098, 0.11, 12), hoofC, mtx(0, -0.555, 0.015)); add(k, S2, '#e8e0d0', mtx(0, -0.49, 0.01, 0.15, 0.06, 0.16));
      this.legs.push(g); this.knees.push({ k, back });
    }
    // kuyruk
    const tail = this.tail = new T.Group(); tail.position.set(0, 0.28, -0.98); tail.rotation.x = 0.35; body.add(tail);
    add(tail, capsGeo(0.06, 0.1, 0.62, 10), dark, mtx(0, 0, 0)); add(tail, S2, dark, mtx(0, -0.66, -0.02, 0.17, 0.3, 0.15));
    // birleştir + kontur
    for (const [grp, cols] of parts) for (const col in cols) {
      const geo = mergeParts(cols[col]); const mesh = new T.Mesh(geo, mat(col)); mesh.castShadow = true; mesh.receiveShadow = true; grp.add(mesh);
      if (!col.endsWith('|2')) { const ol = new T.Mesh(geo, TOON.outline); ol.userData.outline = true; grp.add(ol); this.outlines.push(ol); }
    }
    this.phase = 0; this.talking = false; this.t = Math.random() * 10;
  }
  play() { return 0; } setStance() { } setWeapon() { } setExpression() { }
  flash(color = '#ffffff', t = 0.12) { }
  update(dt, speed) {
    this.t += dt; this.phase += dt * (3 + speed * 1.1); const a = Math.min(1, speed / 3) * 0.55, ph = this.phase;
    const off = [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5];
    this.legs.forEach((l, i) => { l.rotation.x = Math.sin(ph + off[i]) * a; const kb = this.knees[i]; const bend = Math.max(0, Math.sin(ph + off[i] + 1.3)) * a * 1.4; kb.k.rotation.x = kb.back ? -bend * 0.8 : bend; });
    this.body.position.y = 1.3 + Math.abs(Math.sin(ph)) * 0.07 * a;
    this.neck.rotation.x = 0.55 + Math.sin(ph * 2) * 0.05 * a + Math.sin(this.t * 0.5) * 0.03;
    this.head.rotation.x = 0.15 + Math.sin(this.t * 0.8) * 0.04 * (1 - a);
    this.tail.rotation.z = Math.sin(this.t * 1.4) * 0.12; this.tail.rotation.x = 0.35 + a * 0.4 + Math.sin(this.t * 0.9) * 0.05;
    if (G.camera && (this._olT = (this._olT || 0) + dt) > 0.4) { this._olT = 0; const far = G.camera.position.distanceTo(this.root.position) > 34; for (const ol of this.outlines) ol.visible = !far; }
  }
  dispose() { for (const m of this.allMats) m.dispose(); }
}
function spawnRider(look) {
  const horse = new Actor({ model: new HorseModel(), radius: 0.8, name: 'At', solid: false });
  const rider = new Humanoid(look); rider.setStance('sit', true);
  rider.root.position.set(0, 0.11, -0.1); horse.model.body.add(rider.root);
  rider.pose.lgLz = 0.5; horse.rider = rider;
  const upd = horse.model.update.bind(horse.model);
  horse.model.update = (dt, sp) => { upd(dt, sp); rider.update(dt, 0); rider.lgL.rotation.z = 0.45; rider.lgR.rotation.z = -0.45; rider.knL.rotation.x = 0.9; rider.knR.rotation.x = 0.9; rider.lgL.rotation.x = -0.5; rider.lgR.rotation.x = -0.5; };
  horse.collides = false;
  return horse;
}
function npc(look, x, z, f, o = {}) { const n = new NPC(Object.assign({ look }, o)); n.place(x, z, f); return n; }
