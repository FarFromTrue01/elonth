// ---------- Düşman ve müttefik yapay zekâsı ----------
const AI_ATK = {
  jab: { anim: 'jab', windup: 0.5, dur: 0.38, hit: 0.13, range: 1.2, arc: 1.5, dmg: 7, knock: 2 },
  cross: { anim: 'cross', windup: 0.45, dur: 0.38, hit: 0.13, range: 1.2, arc: 1.5, dmg: 7, knock: 2 },
  hook: { anim: 'hook', windup: 0.8, dur: 0.5, hit: 0.2, range: 1.3, arc: 1.8, dmg: 13, knock: 5, heavy: true },
  kick: { anim: 'kick', windup: 0.7, dur: 0.6, hit: 0.26, range: 1.45, arc: 1.3, dmg: 11, knock: 6, heavy: true },
  push: { anim: 'push', windup: 0.55, dur: 0.6, hit: 0.22, range: 1.3, arc: 1.5, dmg: 5, knock: 6 },
  swingW: { anim: 'swing', windup: 0.5, dur: 0.48, hit: 0.18, range: 1.7, arc: 1.4, dmg: 9, knock: 2.5 },
};
G.attackers = new Set();
class Fighter extends Actor {
  constructor(o) {
    super(Object.assign({ team: 'enemy' }, o));
    this.ai = Object.assign({ moves: ['jab', 'cross'], heavyMove: null, heavyChance: 0.2, aggr: 1, speed: 2.6, circleR: 2.8, maxTokens: 1, cooldown: [1.2, 2.4], nonLethal: false, poise: 0 }, o.ai || {});
    this.poise = this.poiseMax = this.ai.poise;
    G.enemies.push(this); this.state = 'idle'; this.cd = frand(0.6, 1.4); this.circleDir = Math.random() < 0.5 ? 1 : -1; this.target = null; this.hpBar = true; this.active = false;
    if (o.weapon) this.model.setWeapon(o.weapon);
  }
  activate() { this.active = true; this.state = 'approach'; this.model.setStance('fight'); }
  takeHit(dmg, from, o = {}) {
    if (!this.alive || this.state === 'down' || this.state === 'yield') return;
    dmg = Math.round(dmg * frand(0.9, 1.1));
    this.hp -= dmg; this.lastHitT = G.t;
    const dir = o.dir || V3(this.pos.x - from.pos.x, 0, this.pos.z - from.pos.z).normalize();
    this.model.flash('#ffffff', 0.08); this.model.emote('pain', 0.7);
    FX.impact(V3(this.pos.x - dir.x * 0.2, this.pos.y + 1.15 * this.scale, this.pos.z - dir.z * 0.2), dir, o.heavy);
    FX.text(V3(this.pos.x, this.pos.y + 1.9 * this.scale, this.pos.z), String(dmg), o.heavy ? 'big' : '');
    Audio.sfx(o.heavy ? 'hitHeavy' : 'hit');
    this.kv.addScaledVector(dir, (o.knock || 2) * (this.state === 'windup' && this.ai.armor ? 0.3 : 1));
    if (this.state === 'windup' || this.state === 'attack') { G.attackers.delete(this); this.removeRing(); }
    if (this.onHit) this.onHit(dmg, from);
    if (this.hp <= 0) { this.hp = 0; this.defeat(dir); return; }
    this.poise -= o.heavy ? 40 : 12;
    if (o.heavy || (this.poiseMax > 0 && this.poise <= 0)) { this.poise = this.poiseMax; this.state = 'down'; this.stateT = 0; this.model.play('knock'); this.kv.addScaledVector(dir, 3); }
    else if (!(this.ai.armor && this.state === 'windup')) { this.state = 'hitstun'; this.stateT = 0; this.model.play('hit'); }
    this.faceTo(from);
  }
  defeat(dir) {
    G.attackers.delete(this); this.removeRing();
    if (this.ai.nonLethal) { this.state = 'yield'; this.stateT = 0; this.model.setStance('kneel2'); this.model.stop(); this.model.emote('pain', 2.5); }
    else { this.state = 'out'; this.stateT = 0; this.model.play('knock'); this.kv.addScaledVector(dir, 4); setTimeout(() => { if (!this.removed) { this.model.setStance('lie'); this.model.closedEyes = true; } }, 450); }
    this.alive = false; this.corpse = true; this.untargetable = true;
    if (this.onDefeat) this.onDefeat(this);
  }
  removeRing() { if (this.ring) { this.ring.dead = true; this.ring = null; } }
  pickTarget() { return G.player; }
  update(dt) {
    if (this.removed) return;
    this.stateT += dt; if (this.hitstun > 0) this.hitstun -= dt;
    if (!this.alive) { this.vel.x = damp(this.vel.x, 0, 6, dt); this.vel.z = damp(this.vel.z, 0, 6, dt); if (this.fleeTo) { const s = this.steer(dt); this.vel.x = s.dx * s.want; this.vel.z = s.dz * s.want; if (s.want > 0.05) this.wantFacing = Math.atan2(s.dx, s.dz); } this.integrate(dt); return; }
    if (!this.active) { super.update(dt); return; }
    const tg = this.target = this.pickTarget(); const A = this.ai;
    let mx = 0, mz = 0, sp = 0;
    const dx = tg.pos.x - this.pos.x, dz = tg.pos.z - this.pos.z, d = Math.hypot(dx, dz) || 0.01, nx = dx / d, nz = dz / d;
    switch (this.state) {
      case 'approach': case 'circle': {
        this.wantFacing = Math.atan2(dx, dz);
        this.cd -= dt * A.aggr;
        const canAtk = this.cd <= 0 && (G.attackers.size < A.maxTokens || G.attackers.has(this)) && tg.alive !== false && tg.state !== 'knock';
        if (canAtk) { G.attackers.add(this); if (d > 1.05) { mx = nx; mz = nz; sp = A.speed * 1.15; } else this.startWindup(); }
        else {
          const want = A.circleR; const radial = d > want + 0.4 ? 1 : d < want - 0.6 ? -0.8 : 0;
          if (rng() < dt * 0.3) this.circleDir *= -1;
          mx = nx * radial - nz * this.circleDir * 0.55; mz = nz * radial + nx * this.circleDir * 0.55; sp = A.speed * 0.55;
        }
        break;
      }
      case 'windup': {
        this.wantFacing = Math.atan2(dx, dz);
        const u = this.stateT / this.atk.windup; const pulse = 0.4 + 0.6 * Math.abs(Math.sin(this.stateT * 18));
        for (const m of this.model.allMats) m.emissive && m.emissive.setRGB(0.6 * u * pulse, 0.25 * u * pulse, 0);
        if (this.stateT >= this.atk.windup) { for (const m of this.model.allMats) m.emissive && m.emissive.set('#000'); this.removeRing(); this.state = 'attack'; this.stateT = 0; this.hitDone = false; this.model.play(this.atk.anim, ACTIONS[this.atk.anim].dur / this.atk.dur); Audio.sfx('whoosh', 0.9); }
        break;
      }
      case 'attack': {
        const a = this.atk; if (this.stateT < a.hit) { mx = Math.sin(this.facing); mz = Math.cos(this.facing); sp = d > 0.9 ? 3.2 : 0; }
        if (!this.hitDone && this.stateT >= a.hit) { this.hitDone = true; const ang = Math.abs(angDiff(this.facing, Math.atan2(dx, dz))); if (d < a.range + tg.radius && ang < a.arc / 2 + 0.2) { const r = tg.receive ? tg.receive(this, a) : 'none'; if (r === 'perfect') { this.state = 'hitstun'; this.stateT = -0.5; this.model.play('hit'); } } }
        if (this.stateT >= a.dur) { this.state = 'recover'; this.stateT = 0; G.attackers.delete(this); this.cd = frand(A.cooldown[0], A.cooldown[1]); if (this.combo && this.combo.length) { const n = this.combo.shift(); this.atk = AI_ATK[n]; G.attackers.add(this); this.startWindup(0.35, true); } }
        break;
      }
      case 'recover': if (this.stateT > 0.35) this.state = 'circle'; break;
      case 'hitstun': if (this.stateT > 0.42) { this.state = 'circle'; this.cd = Math.max(this.cd, 0.5); } break;
      case 'down': if (this.stateT > 1.5) { this.state = 'circle'; this.cd = 0.9; this.iframes = 0.3; } break;
    }
    this.vel.x = damp(this.vel.x, mx * sp, 8, dt); this.vel.z = damp(this.vel.z, mz * sp, 8, dt);
    this.integrate(dt);
  }
  startWindup(scale = 1, forced) {
    const A = this.ai;
    if (!forced) {
      const heavy = A.heavyMove && rng() < A.heavyChance; this.atk = AI_ATK[heavy ? A.heavyMove : pick(A.moves)];
      this.combo = A.combos && !heavy && rng() < 0.45 ? [pick(A.moves)] : [];
    }
    this.atk = Object.assign({}, this.atk, { windup: this.atk.windup * scale * (A.windMul || 1) });
    this.state = 'windup'; this.stateT = 0; this.model.emote('angry', this.atk.windup + this.atk.dur);
    this.ring = FX.ring(this.pos, this.atk.range + 0.2, this.atk.heavy ? '#ff3a20' : '#ffaa30', this.atk.windup + 0.05, { grow: true, follow: this.pos });
  }
}

// Müttefik: düşmanlara saldırır, hasar almaz
class Ally extends Actor {
  constructor(o) { super(Object.assign({ team: 'player' }, o)); this.cd = frand(0.5, 1.5); this.active = false; this.dmg = o.dmg || 9; this.atkAnim = o.atkAnim || ['jab', 'cross', 'kick']; this.speedA = o.speed || 3.2; G.allies.push(this); }
  activate() { this.active = true; this.model.setStance('fight'); }
  receive() { return 'none'; }
  update(dt) {
    if (!this.active) { super.update(dt); return; }
    this.stateT += dt;
    let tgt = null, bd = 1e9; for (const e of G.enemies) if (e.alive && !e.untargetable) { const d = this.dist(e); if (d < bd) { bd = d; tgt = e; } }
    let mx = 0, mz = 0, sp = 0;
    if (tgt) {
      const dx = tgt.pos.x - this.pos.x, dz = tgt.pos.z - this.pos.z, d = Math.hypot(dx, dz);
      this.wantFacing = Math.atan2(dx, dz); this.cd -= dt;
      if (this.atkT !== undefined) { this.atkT += dt; if (this.atkT > 0.15 && !this.hitDone) { this.hitDone = true; if (d < 1.5) tgt.takeHit(this.dmg, this, { knock: 2.5 }); } if (this.atkT > 0.5) this.atkT = undefined; }
      else if (d > 1.1) { mx = dx / d; mz = dz / d; sp = this.speedA; }
      else if (this.cd <= 0) { this.cd = frand(1.0, 2.0); this.atkT = 0; this.hitDone = false; this.model.play(pick(this.atkAnim)); this.model.emote('fierce', 0.7); Audio.sfx('whoosh', 0.6); }
    } else if (G.player) { const d = this.dist(G.player); if (d > 2.2) { mx = (G.player.pos.x - this.pos.x) / d; mz = (G.player.pos.z - this.pos.z) / d; sp = 2.5; this.wantFacing = Math.atan2(mx, mz); } }
    this.vel.x = damp(this.vel.x, mx * sp, 8, dt); this.vel.z = damp(this.vel.z, mz * sp, 8, dt);
    this.integrate(dt);
  }
}

// ===== Yaban domuzu =====
class BoarModel {
  constructor(s = 1) {
    const root = this.root = new T.Group(); this.o = { scale: s }; this.allMats = [];
    const M = c => { const m = new T.MeshLambertMaterial({ color: c }); this.allMats.push(m); return m; };
    const body = this.body = new T.Group(); body.position.y = 0.75; root.add(body);
    const fur = M('#4a3626'), furD = M('#33251a'), snout = M('#8a6a5a'), tusk = M('#efe6d0'), eye = M('#120c08'); this.eyeM = eye;
    const P = (par, t, m, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) => { const k = new T.Mesh(prim(t), m); k.position.set(x, y, z); k.scale.set(sx, sy, sz); k.rotation.set(rx, ry, rz); k.castShadow = true; par.add(k); return k; };
    P(body, 'dode', fur, 0, 0.05, -0.1, 1.05, 0.95, 1.8); P(body, 'dode', furD, 0, 0.18, 0.45, 1.1, 1.05, 0.9);
    for (let i = 0; i < 7; i++) P(body, 'cone4', furD, 0, 0.6 - i * 0.04, 0.5 - i * 0.22, 0.14, 0.3, 0.14, -0.4);
    const head = this.head = new T.Group(); head.position.set(0, 0.1, 0.9); body.add(head);
    P(head, 'box', fur, 0, 0, 0.15, 0.62, 0.55, 0.6, 0.2); P(head, 'box', snout, 0, -0.08, 0.55, 0.36, 0.3, 0.32, 0.15); P(head, 'box', '#2a1a14' && M('#2a1a14'), 0, -0.06, 0.72, 0.28, 0.2, 0.02);
    for (const sx of [-1, 1]) { P(head, 'cone4', tusk, sx * 0.17, -0.12, 0.6, 0.07, 0.3, 0.07, -0.5, 0, sx * -0.4); P(head, 'box', eye, sx * 0.2, 0.1, 0.42, 0.06, 0.06, 0.04); P(head, 'cone4', furD, sx * 0.24, 0.32, 0.05, 0.14, 0.25, 0.08, -0.3, 0, sx * -0.3); }
    this.legs = [];
    for (const [x, z] of [[0.3, 0.55], [-0.3, 0.55], [0.3, -0.6], [-0.3, -0.6]]) { const g = new T.Group(); g.position.set(x, -0.25, z); body.add(g); P(g, 'box', furD, 0, -0.25, 0, 0.2, 0.55, 0.22); P(g, 'box', M('#1a120c'), 0, -0.52, 0.02, 0.18, 0.08, 0.2); this.legs.push(g); }
    P(body, 'box', furD, 0, 0.2, -1.0, 0.05, 0.05, 0.3, 0.6);
    root.scale.setScalar(s); this.phase = 0; this.flashT = 0; this.talking = false;
  }
  play() { return 0; } setStance() { } setWeapon() { }
  flash(c = '#fff', t = 0.1) { this.flashT = t; for (const m of this.allMats) m.emissive.set(c); }
  update(dt, speed) {
    this.phase += dt * (2 + speed * 2.4);
    const a = Math.min(1, speed / 2) * 0.7;
    this.legs.forEach((l, i) => { l.rotation.x = Math.sin(this.phase + (i === 0 || i === 3 ? 0 : Math.PI)) * a; });
    this.body.position.y = 0.75 + Math.abs(Math.sin(this.phase)) * 0.05 * a + (this.lowered ? -0.12 : 0);
    this.body.rotation.x = this.lowered ? 0.15 : 0;
    this.head.rotation.x = this.lowered ? 0.35 : Math.sin(G.t * 1.3) * 0.05;
    this.body.rotation.z = this.dizzy ? Math.sin(G.t * 6) * 0.15 : 0;
    if (this.flashT > 0) { this.flashT -= dt; if (this.flashT <= 0) for (const m of this.allMats) m.emissive.set('#000'); }
  }
  dispose() { for (const m of this.allMats) m.dispose(); }
}
class Boar extends Actor {
  constructor(o = {}) {
    super(Object.assign({ model: new BoarModel(o.size || 1.15), team: 'enemy', hp: o.hp || 340, radius: 0.85, name: 'Yaban Domuzu' }, o));
    this.heavyBody = true; G.enemies.push(this); this.state = 'idle'; this.active = false; this.cd = 1.5; this.enraged = false; this.turnRate = 5; this.charges = 0; this.hpBar = false;
  }
  activate() { this.active = true; this.state = 'stalk'; this.stateT = 0; }
  takeHit(dmg, from, o = {}) {
    if (!this.alive) return;
    const mult = this.state === 'dizzy' ? 1.6 : 1; dmg = Math.round(dmg * mult * frand(0.9, 1.1));
    this.hp -= dmg; this.model.flash('#ffffff', 0.08);
    const dir = o.dir || V3(this.pos.x - from.pos.x, 0, this.pos.z - from.pos.z).normalize();
    FX.impact(V3(this.pos.x - dir.x * 0.6, this.pos.y + 0.9, this.pos.z - dir.z * 0.6), dir, o.heavy);
    FX.text(V3(this.pos.x, this.pos.y + 1.9, this.pos.z), String(dmg), mult > 1 ? 'crit' : o.heavy ? 'big' : '');
    Audio.sfx(o.heavy ? 'hitHeavy' : 'hit'); this.kv.addScaledVector(dir, (o.knock || 2) * 0.3);
    if (!this.enraged && this.hp < this.maxHp * 0.5) { this.enraged = true; this.model.eyeM.color.set('#ff2a10'); this.model.eyeM.emissive && this.model.eyeM.emissive.set('#ff2a10'); this.state = 'roar'; this.stateT = 0; Audio.sfx('boar', 1.4); Screen.addShake(0.5); if (this.onEnrage) this.onEnrage(); }
    if (this.hp <= 0) { this.hp = 0; this.alive = false; this.untargetable = true; this.state = 'flee'; this.stateT = 0; if (this.line) { this.line.dead = true; this.line = null; } if (this.onDefeat) this.onDefeat(this); }
  }
  update(dt) {
    if (this.removed) return;
    this.stateT += dt; const tg = G.player, M = this.model;
    const dx = tg.pos.x - this.pos.x, dz = tg.pos.z - this.pos.z, d = Math.hypot(dx, dz) || 0.01;
    let mx = 0, mz = 0, sp = 0; M.lowered = false; M.dizzy = false;
    if (!this.active) { super.update(dt); return; }
    switch (this.state) {
      case 'stalk': {
        this.wantFacing = Math.atan2(dx, dz); this.cd -= dt;
        const want = 6.5; const radial = d > want + 1 ? 1 : d < want - 1.5 ? -0.6 : 0;
        mx = dx / d * radial + (-dz / d) * 0.6; mz = dz / d * radial + (dx / d) * 0.6; sp = 2.2;
        if (d < 2.4 && this.cd < 1.0) { this.state = 'swipeW'; this.stateT = 0; this.ring = FX.ring(this.pos, 2.4, '#ff6a20', 0.65, { grow: true, follow: this.pos }); Audio.sfx('boar', 0.6); }
        else if (this.cd <= 0 && d > 3) { this.state = 'paw'; this.stateT = 0; this.charges = this.enraged ? 2 : 1; Audio.sfx('boar'); }
        break;
      }
      case 'paw': {
        this.wantFacing = Math.atan2(dx, dz); M.lowered = true;
        const pawDur = this.enraged ? 0.8 : 1.1;
        if (Math.floor(this.stateT * 6) !== Math.floor((this.stateT - dt) * 6)) FX.dust(V3(this.pos.x + Math.sin(this.facing) * 0.8, this.pos.y, this.pos.z + Math.cos(this.facing) * 0.8), 3, '#8a7050');
        if (!this.line) this.line = FX.line(this.pos, this.facing, 16, 1.8, '#ff3020', pawDur + 0.2);
        else { this.line.m.position.set(this.pos.x, this.pos.y + 0.07, this.pos.z); this.line.m.rotation.y = this.facing; }
        if (this.stateT > pawDur) { this.state = 'charge'; this.stateT = 0; this.chargeDir = { x: Math.sin(this.facing), z: Math.cos(this.facing) }; this.hitDone = false; Audio.sfx('charge'); if (this.line) { this.line.dead = true; this.line = null; } }
        break;
      }
      case 'charge': {
        M.lowered = true; mx = this.chargeDir.x; mz = this.chargeDir.z; sp = this.enraged ? 13 : 11.5; this.wantFacing = Math.atan2(mx, mz);
        if (Math.random() < 0.5) FX.dust(V3(this.pos.x, this.pos.y + 0.1, this.pos.z), 1, '#9a8060');
        if (!this.hitDone && d < 1.5) { this.hitDone = true; const r = tg.receive(this, { dmg: 26, knock: 9, heavy: true }); if (r === 'perfect') this.perfectByPlayer = true; }
        const before = V3(this.pos.x + mx * sp * dt, 0, this.pos.z + mz * sp * dt), test = before.clone(); G.level.resolve(test, this.radius);
        const blocked = test.distanceTo(before) > 0.05;
        if (blocked || this.stateT > 1.6) {
          this.state = blocked ? 'dizzy' : 'skid'; this.stateT = 0; this.vel.multiplyScalar(0.3);
          if (blocked) { Screen.addShake(0.6); Audio.sfx('hitHeavy'); FX.dust(this.pos.clone(), 12, '#9a8060'); FX.text(V3(this.pos.x, this.pos.y + 2.2, this.pos.z), 'SERSEMLEDİ', 'crit'); } else Audio.sfx('skid', 0.6);
        }
        this.vel.x = mx * sp; this.vel.z = mz * sp; this.integrate(dt); return;
      }
      case 'skid': {
        if (this.stateT > (this.perfectByPlayer ? 1.6 : 0.9)) { this.perfectByPlayer = false; this.charges--; if (this.charges > 0) { this.state = 'paw'; this.stateT = 0.4; } else { this.state = 'stalk'; this.cd = frand(2.2, 3.4); } }
        break;
      }
      case 'dizzy': M.dizzy = true; if (this.stateT > 3.0) { this.state = 'stalk'; this.cd = frand(1.8, 2.8); } break;
      case 'swipeW': this.wantFacing = Math.atan2(dx, dz); M.lowered = true; if (this.stateT > 0.65) { this.state = 'swipe'; this.stateT = 0; this.hitDone = false; if (this.ring) this.ring.dead = true; } break;
      case 'swipe': {
        this.model.head.rotation.y = Math.sin(this.stateT * 14) * 0.6; mx = Math.sin(this.facing); mz = Math.cos(this.facing); sp = 4;
        if (!this.hitDone && this.stateT > 0.12) { this.hitDone = true; if (d < 2.6 && Math.abs(angDiff(this.facing, Math.atan2(dx, dz))) < 1.2) tg.receive(this, { dmg: 13, knock: 5 }); }
        if (this.stateT > 0.45) { this.model.head.rotation.y = 0; this.state = 'stalk'; this.cd = frand(1.5, 2.5); }
        break;
      }
      case 'roar': M.lowered = false; this.model.head.rotation.x = -0.4; if (this.stateT > 1.2) { this.state = 'stalk'; this.cd = 0.4; } break;
      case 'flee': {
        const away = V3(this.pos.x, 0, this.pos.z + 1); mx = 0; mz = 1; sp = this.stateT > 0.8 ? 7 : 0; this.wantFacing = 0;
        if (this.stateT < 0.8) M.dizzy = true;
        break;
      }
    }
    this.vel.x = damp(this.vel.x, mx * sp, 6, dt); this.vel.z = damp(this.vel.z, mz * sp, 6, dt);
    this.integrate(dt);
  }
}

// Antrenman kuklası
function makeDummy(L, x, z) {
  const d = dummyProp(L, x, z); d.hits = 0; d.kicks = 0; d.combos = 0; d.lastHit = 0; d.chain = 0;
  d.hit = def => {
    d.wobble = def.heavy ? 1 : 0.5; d.hits++; if (def.heavy) d.kicks++;
    if (G.t - d.lastHit < 0.9) d.chain++; else d.chain = 1; d.lastHit = G.t; if (d.chain >= 3) { d.combos++; d.chain = 0; }
    Audio.sfx('wood'); const p = d.group.position; FX.impact(V3(p.x, p.y + 1.4, p.z), V3(0, 0, 1), def.heavy); FX.burst(V3(p.x, p.y + 1.4, p.z), { n: 5, color: '#c8b080', size: 0.06, g: 8 });
    G.hitstop = 0.04; if (d.onHit) d.onHit(def);
  };
  L.anims.push(dt => { d.t += dt; d.wobble = Math.max(0, d.wobble - dt * 1.6); d.top.rotation.z = Math.sin(d.t * 18) * 0.25 * d.wobble; d.top.rotation.x = Math.cos(d.t * 13) * 0.15 * d.wobble; });
  return d;
}
