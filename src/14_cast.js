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
  isolde: { name: 'Isolde', color: '#e6ecf8', rank: 'B' },
  seraphine: { name: 'Seraphine', color: '#bda8f2', rank: 'C' },
  rowena: { name: 'Rowena', color: '#f2c072', rank: 'C' },
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
    const root = this.root = new T.Group(); this.o = { scale: 1 }; this.allMats = [];
    const M = c => { const m = new T.MeshLambertMaterial({ color: c }); this.allMats.push(m); return m; };
    const coat = M(color), dark = M('#1e1612'), saddle = M('#3a2418'), cloth = M('#2f5a3a'), gold = M('#c9a85a');
    const P = (par, t, m, x, y, z, sx, sy, sz, rx = 0) => { const k = new T.Mesh(prim(t), m); k.position.set(x, y, z); k.scale.set(sx, sy, sz); k.rotation.x = rx; k.castShadow = true; par.add(k); return k; };
    const body = this.body = new T.Group(); body.position.y = 1.35; root.add(body);
    P(body, 'box', coat, 0, 0, 0, 0.75, 0.75, 1.9); P(body, 'box', cloth, 0, 0.05, -0.1, 0.8, 0.6, 1.1); P(body, 'box', saddle, 0, 0.42, -0.1, 0.55, 0.12, 0.7);
    const neck = new T.Group(); neck.position.set(0, 0.25, 0.85); body.add(neck); P(neck, 'box', coat, 0, 0.4, 0.15, 0.35, 0.9, 0.45, -0.55); P(neck, 'box', dark, 0, 0.5, -0.02, 0.1, 0.9, 0.2, -0.55);
    const head = this.head = new T.Group(); head.position.set(0, 0.85, 0.45); neck.add(head); P(head, 'box', coat, 0, 0, 0.25, 0.3, 0.32, 0.65, 0.35); P(head, 'box', gold, 0, 0.05, 0.25, 0.32, 0.05, 0.4, 0.35);
    P(body, 'box', dark, 0, 0.1, -1.05, 0.14, 0.7, 0.14, 0.45);
    this.legs = []; for (const [x, z] of [[0.24, 0.75], [-0.24, 0.75], [0.24, -0.75], [-0.24, -0.75]]) { const g = new T.Group(); g.position.set(x, -0.3, z); body.add(g); P(g, 'box', coat, 0, -0.45, 0, 0.17, 0.9, 0.2); P(g, 'box', dark, 0, -0.95, 0.02, 0.18, 0.12, 0.22); this.legs.push(g); }
    this.phase = 0; this.talking = false;
  }
  play() { return 0; } setStance() { } setWeapon() { } flash() { }
  update(dt, speed) { this.phase += dt * (3 + speed * 1.1); const a = Math.min(1, speed / 3) * 0.6; this.legs.forEach((l, i) => l.rotation.x = Math.sin(this.phase + [0, 1.2, 2.6, 3.8][i]) * a); this.body.position.y = 1.35 + Math.abs(Math.sin(this.phase)) * 0.1 * a; this.head.rotation.x = Math.sin(this.phase) * 0.1 * a; }
  dispose() { for (const m of this.allMats) m.dispose(); }
}
function spawnRider(look) {
  const horse = new Actor({ model: new HorseModel(), radius: 0.8, name: 'At', solid: false });
  const rider = new Humanoid(look); rider.setStance('sit', true);
  rider.root.position.set(0, 0.06, -0.1); horse.model.body.add(rider.root);
  rider.pose.lgLz = 0.5; horse.rider = rider;
  const upd = horse.model.update.bind(horse.model);
  horse.model.update = (dt, sp) => { upd(dt, sp); rider.update(dt, 0); rider.lgL.rotation.z = 0.45; rider.lgR.rotation.z = -0.45; rider.knL.rotation.x = 0.9; rider.knR.rotation.x = 0.9; rider.lgL.rotation.x = -0.5; rider.lgR.rotation.x = -0.5; };
  horse.collides = false;
  return horse;
}
function npc(look, x, z, f, o = {}) { const n = new NPC(Object.assign({ look }, o)); n.place(x, z, f); return n; }
