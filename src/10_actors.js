// ---------- Aktörler: temel, oyuncu, NPC ----------
class Actor {
  constructor(o = {}) {
    this.o = o; this.name = o.name || ''; this.id = o.id || this.name;
    this.model = o.model || makeHumanoid(o.look || {});
    this.root = this.model.root; G.scene.add(this.root);
    this.pos = V3(); this.vel = V3(); this.kv = V3(); this.facing = 0; this.wantFacing = null;
    this.scale = this.model.o ? this.model.o.scale : 1; this.radius = o.radius || 0.32 * Math.max(0.7, this.scale);
    this.hp = this.maxHp = o.hp || 100; this.team = o.team || 'neutral'; this.alive = true; this.solid = o.solid !== false;
    this.walkSpeed = o.walkSpeed || 1.5; this.speed = 0; this.moving = false; this.path = null; this.pathResolve = null;
    this.follow = null; this.followDist = 1.6; this.hitstun = 0; this.iframes = 0; this.state = 'idle'; this.stateT = 0;
    this.poise = o.poise || 0; this.poiseMax = this.poise; this.lockY = null; this.visible = true;
    G.actors.push(this);
  }
  place(x, z, facing = 0, y) { this.pos.set(x, y !== undefined ? y : (G.level ? G.level.h(x, z) : 0), z); this.facing = facing; this.wantFacing = facing; this.root.position.copy(this.pos); this.root.rotation.y = facing; this.path = null; this.vel.set(0, 0, 0); this.kv.set(0, 0, 0); return this; }
  placeAt(v, facing) { return this.place(v.x, v.z, facing === undefined ? this.facing : facing); }
  get position() { return this.pos; }
  faceTo(t) { const p = t.isVector3 ? t : t.pos; this.wantFacing = Math.atan2(p.x - this.pos.x, p.z - this.pos.z); }
  faceNow(t) { this.faceTo(t); this.facing = this.wantFacing; }
  lookAt(t) { this.model.lookTarget = t ? (t.isVector3 ? t : t.root) : null; }
  say(on) { this.model.talking = on; }
  walkTo(pts, speed) {
    if (!Array.isArray(pts)) pts = [pts];
    this.path = pts.map(p => p.isVector3 ? p.clone() : V3(p[0], 0, p[1])); this.pathSpeed = speed || this.walkSpeed; this.follow = null; this._pd = undefined; this._side = 0; this._pt = 0;
    if (this.pathResolve) this.pathResolve();
    return new Promise(r => { this.pathResolve = r; });
  }
  stopWalk() { this.path = null; if (this.pathResolve) { const r = this.pathResolve; this.pathResolve = null; r(); } }
  dist(o) { return distXZ(this.pos, o.isVector3 ? o : o.pos); }
  setVisible(v) { this.visible = v; this.root.visible = v; }
  remove() { G.scene.remove(this.root); this.model.dispose && this.model.dispose(); const i = G.actors.indexOf(this); if (i >= 0) G.actors.splice(i, 1); this.alive = false; this.removed = true; }
  // hedefe doğru hareket hızı (alt sınıflar değiştirir)
  steer(dt) {
    let want = 0, dx = 0, dz = 0;
    if (this.path && this.path.length) {
      const t = this.path[0]; dx = t.x - this.pos.x; dz = t.z - this.pos.z; const d = Math.hypot(dx, dz);
      if (d < 0.25 + (this.path.length > 1 ? 0.4 : 0)) { this.path.shift(); if (!this.path.length) { this.path = null; if (this.pathResolve) { const r = this.pathResolve; this.pathResolve = null; r(); } } }
      else {
        want = this.pathSpeed; if (this.path.length === 1 && d < 0.8) want *= Math.max(0.35, d / 0.8); dx /= d; dz /= d;
        // takılma: ilerleme yoksa duvar boyunca kay
        this._pd = this._pd === undefined ? d : this._pd; this._pt = (this._pt || 0) + dt;
        if (this._pt > 0.6) { if (this._pd - d < 0.15 * want * 0.6) this._side = 0.9 * (this._sideSign || (this._sideSign = Math.random() < 0.5 ? 1 : -1)); else this._side = 0; this._pd = d; this._pt = 0; }
        if (this._side) { const a = Math.atan2(dx, dz) + this._side * 1.1; dx = Math.sin(a); dz = Math.cos(a); }
      }
    } else if (this.follow) {
      const f = this.follow, fp = f.pos || f; dx = fp.x - this.pos.x; dz = fp.z - this.pos.z; const d = Math.hypot(dx, dz);
      if (d > this.followDist) { want = clamp((d - this.followDist) * 2, 0, (f.speed || 2) + 0.6); dx /= d; dz /= d; }
    }
    return { want, dx, dz };
  }
  update(dt) {
    if (!this.alive && !this.corpse) return;
    this.stateT += dt; if (this.hitstun > 0) this.hitstun -= dt; if (this.iframes > 0) this.iframes -= dt;
    const s = this.steer(dt);
    const tv = V3(s.dx * s.want, 0, s.dz * s.want);
    this.vel.x = damp(this.vel.x, tv.x, 10, dt); this.vel.z = damp(this.vel.z, tv.z, 10, dt);
    if (s.want > 0.05) this.wantFacing = Math.atan2(s.dx, s.dz);
    this.integrate(dt);
  }
  integrate(dt) {
    this.kv.multiplyScalar(Math.exp(-6 * dt));
    this.pos.x += (this.vel.x + this.kv.x) * dt; this.pos.z += (this.vel.z + this.kv.z) * dt;
    const L = G.level;
    if (L && this.collides !== false) L.resolve(this.pos, this.radius);
    if (L) { const gy = L.h(this.pos.x, this.pos.z); this.pos.y = this.lockY !== null ? this.lockY : damp(this.pos.y, gy, 18, dt); }
    this.speed = Math.hypot(this.vel.x, this.vel.z); this.moving = this.speed > 0.2;
    if (this.wantFacing !== null) this.facing = dampAngle(this.facing, this.wantFacing, this.turnRate || 10, dt);
    this.root.position.copy(this.pos); this.root.rotation.y = this.facing;
    this.model.update(dt, this.speed);
    if (this.moving && this.model.stepPhase !== undefined && this.isPlayer) { const st = Math.floor(this.model.stepPhase / Math.PI); if (st !== this._st) { this._st = st; Audio.sfx('step', 0.6); } }
  }
  takeHit(dmg, from, o = {}) { return false; }
}

// Saldırı tanımları
const MOVES = {
  fist: [
    { anim: 'jab', dur: 0.34, hit: 0.12, range: 1.15, arc: 1.2, dmg: 8, knock: 1.5, lunge: 2.2, cancel: 0.2 },
    { anim: 'cross', dur: 0.36, hit: 0.13, range: 1.15, arc: 1.2, dmg: 9, knock: 1.8, lunge: 2.4, cancel: 0.22 },
    { anim: 'hook', dur: 0.52, hit: 0.2, range: 1.25, arc: 1.6, dmg: 14, knock: 5, lunge: 3.2, cancel: 0.36, heavy: true },
  ],
  stick: [
    { anim: 'swing', dur: 0.48, hit: 0.18, range: 1.75, arc: 1.4, dmg: 13, knock: 2, lunge: 2.4, cancel: 0.3 },
    { anim: 'sweep', dur: 0.46, hit: 0.17, range: 1.8, arc: 2.2, dmg: 13, knock: 2.5, lunge: 2.2, cancel: 0.3 },
    { anim: 'overhead', dur: 0.66, hit: 0.38, range: 1.9, arc: 1.2, dmg: 22, knock: 5.5, lunge: 3.4, cancel: 0.5, heavy: true },
  ],
  kick: { anim: 'kick', dur: 0.62, hit: 0.26, range: 1.4, arc: 1.3, dmg: 16, knock: 7, lunge: 3.5, heavy: true, stam: 28 },
};

class Player extends Actor {
  constructor(look, o = {}) {
    super(Object.assign({ look, team: 'player', hp: 100, name: 'Joseph' }, o));
    this.isPlayer = true; this.stamina = this.staminaMax = 100; this.stamDelay = 0;
    this.canFight = false; this.weapon = 'fist'; this.speedMul = 1; this.runSpeed = 5.0; this.walk = 2.0;
    this.combo = 0; this.queued = false; this.atk = null; this.dodgeT = 99; this.perfectBonus = 0; this.noDeath = false;
    this.turnRate = 14; this.weakWalk = false; this.allowRun = true;
  }
  setWeapon(w) { this.weapon = w; this.model.setWeapon(w === 'stick' ? 'stick' : null); }
  inputDir() {
    const m = Input.move, mag = Math.min(1, Math.hypot(m.x, m.y));
    if (mag < 0.08) return { mag: 0, x: 0, z: 0 };
    const fx = -Math.sin(Cam.yaw), fz = -Math.cos(Cam.yaw), rx = Math.cos(Cam.yaw), rz = -Math.sin(Cam.yaw);
    let x = fx * m.y + rx * m.x, z = fz * m.y + rz * m.x; const l = Math.hypot(x, z) || 1;
    return { mag, x: x / l, z: z / l };
  }
  findTarget(dirX, dirZ, maxD = 3.4) {
    // hedef yardımı: bakılan yöne 35° içindeki en yakın düşman; yoksa çok yakındaki (60°)
    let best = null, bs = 1e9; const ya = Math.atan2(dirX, dirZ);
    for (const e of G.enemies) {
      if (!e.alive || e.untargetable) continue;
      const dx = e.pos.x - this.pos.x, dz = e.pos.z - this.pos.z, d = Math.hypot(dx, dz), a = Math.abs(angDiff(ya, Math.atan2(dx, dz)));
      const ok = (a < 0.62 && d < maxD + e.radius) || (a < 1.05 && d < 1.9 + e.radius);
      if (!ok) continue; const sc = a * 2.2 + d * 0.45; if (sc < bs) { bs = sc; best = e; }
    }
    return best;
  }
  startAttack(def, kind) {
    const id = this.inputDir(); const SL = G.settings.shiftLock;
    let dx, dz;
    if (SL) { dx = -Math.sin(Cam.yaw); dz = -Math.cos(Cam.yaw); if (id.mag > 0.5) { dx = id.x; dz = id.z; } }
    else { dx = id.mag ? id.x : Math.sin(this.facing); dz = id.mag ? id.z : Math.cos(this.facing); }
    const t = this.findTarget(dx, dz);
    if (t) { this.faceNow(t); } else { this.facing = this.wantFacing = Math.atan2(dx, dz); }
    this.atk = { def, t: 0, hitDone: false, kind, target: t };
    this.model.play(def.anim, ACTIONS[def.anim].dur / def.dur);
    this.state = kind; this.stateT = 0; Audio.sfx('whoosh', def.heavy ? 1.2 : 0.8); this.model.emote('fierce', def.dur + 0.3);
  }
  update(dt) {
    if (!this.alive) return;
    this.stateT += dt; if (this.iframes > 0) this.iframes -= dt; this.dodgeT += dt;
    if (this.stamDelay > 0) this.stamDelay -= dt; else this.stamina = Math.min(this.staminaMax, this.stamina + 30 * dt);
    const ctl = G.controlEnabled && !this.path && !this.follow;
    let want = 0, dx = 0, dz = 0;
    if (this.path || this.follow) { const s = this.steer(dt); want = s.want; dx = s.dx; dz = s.dz; if (want > 0.05) this.wantFacing = Math.atan2(dx, dz); }
    if (this.state === 'hitstun') { if (this.stateT > 0.38) this.state = 'move'; }
    else if (this.state === 'knock') { if (this.stateT > 1.35) { this.state = 'move'; this.iframes = 0.4; } }
    else if (this.state === 'dodge') {
      const u = this.stateT / 0.46; const sp = 7.5 * (1 - u * 0.7);
      this.vel.x = this.dodgeDir.x * sp; this.vel.z = this.dodgeDir.z * sp;
      if (this.stateT > 0.46) this.state = 'move';
    } else if (this.state === 'attack' || this.state === 'heavy') {
      const A = this.atk, d = A.def; A.t += dt; const u = A.t / d.dur;
      const lungeK = A.t < d.hit ? d.lunge : 0;
      let lx = Math.sin(this.facing), lz = Math.cos(this.facing);
      if (A.target && A.target.alive && distXZ(this.pos, A.target.pos) < 0.95 + A.target.radius) lx = lz = 0;
      this.vel.x = lx * lungeK; this.vel.z = lz * lungeK;
      if (A.target && A.target.alive && !A.hitDone) this.wantFacing = Math.atan2(A.target.pos.x - this.pos.x, A.target.pos.z - this.pos.z);
      if (!A.hitDone && A.t >= d.hit) { A.hitDone = true; this.resolveHit(d); }
      if (ctl && Input.take('attack') && this.state === 'attack' && A.t > d.dur * 0.25) this.queued = true;
      if (ctl && Input.take('dodge') && A.t > d.hit + 0.02) { this.tryDodge(); }
      else if (A.t >= d.dur - (this.queued ? d.cancel * 0.6 : 0)) {
        if (this.queued && this.state === 'attack' && this.combo < 2) { this.queued = false; this.combo++; this.startAttack(MOVES[this.weapon][this.combo], 'attack'); }
        else { this.state = 'move'; this.queued = false; this.combo = 0; this.comboReset = 0; }
      }
    }
    if (this.state === 'move' || this.state === 'idle') {
      this.state = 'move';
      if (ctl) {
        const id = this.inputDir();
        if (id.mag > 0) {
          const run = this.allowRun ? (id.mag < 0.65 ? lerp(0.6, this.walk, id.mag / 0.65) : lerp(this.walk, this.runSpeed, (id.mag - 0.65) / 0.35)) : lerp(0.4, this.walk, id.mag);
          want = run * this.speedMul; dx = id.x; dz = id.z; this.wantFacing = Math.atan2(dx, dz);
        }
        if (this.canFight) {
          if (Input.take('attack')) { this.combo = 0; this.startAttack(MOVES[this.weapon][0], 'attack'); }
          else if (Input.take('heavy') && this.stamina >= 25) { this.stamina -= 25; this.stamDelay = 0.7; const def = this.weapon === 'stick' ? MOVES.stick[2] : MOVES.kick; this.startAttack(def, 'heavy'); }
          else if (Input.take('dodge')) this.tryDodge();
        } else { Input.take('attack'); Input.take('heavy'); Input.take('dodge'); }
      }
      if (this.state === 'move') {
        // zayıf yürüyüş: yana hafif salınım (hız hedefine eklenir, birikmez)
        let lx = 0, lz = 0; if (this.weakWalk && want > 0.01) { this.wobT = (this.wobT || 0) + dt; const w = Math.sin(this.wobT * 1.7) * 0.5 + Math.sin(this.wobT * 0.6) * 0.5; lx = Math.cos(this.facing) * w * 0.22; lz = -Math.sin(this.facing) * w * 0.22; }
        this.vel.x = damp(this.vel.x, dx * want + lx, 12, dt); this.vel.z = damp(this.vel.z, dz * want + lz, 12, dt);
      }
    }
    if (this.state === 'hitstun' || this.state === 'knock') { this.vel.x = damp(this.vel.x, 0, 8, dt); this.vel.z = damp(this.vel.z, 0, 8, dt); }
    if (G.settings.shiftLock && ctl && !G.inCine && (this.state === 'move' || this.state === 'hitstun') && !this.noShiftFace) { this.wantFacing = Cam.yaw + Math.PI; }
    if (this.streak) { this.streakT += dt; if (this.streakT > 2.6) { this.streak = 0; UI.streak(0); } }
    if (G.combat && this.canFight && !G.inCine) {
      let tdx, tdz; const id = this.inputDir();
      if (this.atk && this.atk.target && this.atk.target.alive) this._tg = this.atk.target;
      else { if (G.settings.shiftLock && id.mag <= 0.5) { tdx = -Math.sin(Cam.yaw); tdz = -Math.cos(Cam.yaw); } else if (id.mag) { tdx = id.x; tdz = id.z; } else { tdx = Math.sin(this.facing); tdz = Math.cos(this.facing); } this._tg = this.findTarget(tdx, tdz); }
      FX.target(this._tg && this._tg.alive ? this._tg : null);
    } else if (this._tg !== undefined) { this._tg = undefined; FX.target(null); }
    this.integrate(dt);
    if (this.model.stanceName === 'fight' && !G.combat) this.model.setStance(null);
  }
  tryDodge() {
    if (this.stamina < 18) { FX.text(V3(this.pos.x, this.pos.y + 2, this.pos.z), 'Nefes yok', 'warn'); return; }
    this.stamina -= 20; this.stamDelay = 0.6;
    const id = this.inputDir(); const dx = id.mag ? id.x : -Math.sin(this.facing), dz = id.mag ? id.z : -Math.cos(this.facing);
    this.dodgeDir = { x: dx, z: dz }; if (id.mag) this.facing = this.wantFacing = Math.atan2(dx, dz);
    this.state = 'dodge'; this.stateT = 0; this.iframes = 0.34; this.dodgeT = 0; this.atk = null; this.queued = false; this.combo = 0;
    this.model.play(id.mag ? 'roll' : 'hop'); Audio.sfx('dodge');
  }
  resolveHit(d) {
    let any = false;
    for (const e of G.enemies) {
      if (!e.alive || e.untargetable) continue;
      const dx = e.pos.x - this.pos.x, dz = e.pos.z - this.pos.z, dist = Math.hypot(dx, dz);
      if (dist > d.range + e.radius) continue;
      const a = Math.abs(angDiff(this.facing, Math.atan2(dx, dz))); if (a > d.arc / 2 + 0.38 && dist > 0.6) continue;
      let dmg = d.dmg * (this.dmgMul || 1); if (this.perfectBonus > 0) { dmg *= 1.6; this.perfectBonus = 0; }
      e.takeHit(dmg, this, { knock: d.knock, heavy: d.heavy, dir: V3(dx / (dist || 1), 0, dz / (dist || 1)) });
      any = true;
    }
    if (!any && this.dummy) { const dm = this.dummy; if (distXZ(this.pos, dm.group.position) < d.range + 0.4) { const a = Math.abs(angDiff(this.facing, Math.atan2(dm.group.position.x - this.pos.x, dm.group.position.z - this.pos.z))); if (a < d.arc / 2 + 0.4) { dm.hit(d); any = true; } } }
    if (any) { G.hitstop = d.heavy ? 0.09 : 0.05; Screen.addShake(d.heavy ? 0.35 : 0.15); this.streak = (this.streak || 0) + 1; this.streakT = 0; if (this.streak >= 2) UI.streak(this.streak); }
  }
  // düşman saldırısı oyuncuya
  receive(att, def) {
    if (!this.alive) return 'none';
    if (this.state === 'dodge' && this.iframes > 0) {
      if (this.dodgeT < 0.22 && !this.perfectCD) { this.perfectCD = true; setTimeout(() => this.perfectCD = false, 600); G.slowmo = 0.9; this.perfectBonus = 1; this.stamina = Math.min(this.staminaMax, this.stamina + 30); FX.text(V3(this.pos.x, this.pos.y + 2.1, this.pos.z), 'MÜKEMMEL KAÇIŞ', 'perfect'); Audio.sfx('perfect'); UI.flashEdge('#9fe0ff'); if (this.onPerfect) this.onPerfect(); return 'perfect'; }
      return 'dodged';
    }
    if (this.iframes > 0 || this.invuln) return 'none';
    let dmg = def.dmg * (this.dmgTaken || 1);
    this.hp -= dmg; this.stamDelay = 0.4;
    const dir = V3(this.pos.x - att.pos.x, 0, this.pos.z - att.pos.z).normalize();
    this.kv.addScaledVector(dir, def.knock || 3);
    this.model.flash('#ff3020', 0.12); Screen.redFlash(0.35 + (def.heavy ? 0.25 : 0)); Screen.addShake(def.heavy ? 0.6 : 0.3); Audio.sfx(def.heavy ? 'hitHeavy' : 'hurt');
    FX.impact(V3(this.pos.x, this.pos.y + 1.1 * this.scale, this.pos.z), dir.clone().negate(), def.heavy);
    G.hitstop = def.heavy ? 0.1 : 0.06;
    this.atk = null; this.queued = false; this.combo = 0; if (this.streak) { this.streak = 0; UI.streak(0, true); }
    if (this.hp <= 0) {
      if (this.noDeath) { this.hp = 1; this.downs = (this.downs || 0) + 1; }
      else { this.hp = 0; this.alive = false; this.state = 'dead'; this.model.setStance('lie'); this.vel.set(0, 0, 0); if (this.onDeath) this.onDeath(); return 'hit'; }
    }
    if (def.heavy || def.knockdown) { this.state = 'knock'; this.stateT = 0; this.model.play('knock'); this.iframes = 1.2; this.model.emote('pain', 1.5); }
    else { this.state = 'hitstun'; this.stateT = 0; this.model.play('hit'); this.iframes = 0.25; this.model.emote('pain', 0.6); }
    if (this.onHurt) this.onHurt(def);
    return 'hit';
  }
  revive() { this.alive = true; this.hp = this.maxHp; this.stamina = this.staminaMax; this.state = 'move'; this.model.setStance(null); this.iframes = 1; }
}

class NPC extends Actor {
  constructor(o) { super(o); this.talkable = !!o.talk; this.talkFn = o.talk; this.talkLabel = o.talkLabel || 'Konuş'; this.watch = o.watch !== false; this.idleStance = o.stance || null; if (o.stance) this.model.setStance(o.stance, true); if (o.weapon) this.model.setWeapon(o.weapon); }
  update(dt) {
    super.update(dt);
    if (this.watch && G.player && !this.model.lookTargetLocked && !G.inCine) { const d = this.dist(G.player); this.model.lookTarget = d < 5 ? G.player.root : null; }
  }
}

// Köpek/insan yapay zekâsı olmayan çevresel kalabalık NPC: rastgele dolaşır
class Wanderer extends NPC {
  constructor(o) { super(o); this.home = null; this.wt = frand(1, 5); }
  update(dt) {
    if (this.home && !this.path) { this.wt -= dt; if (this.wt < 0) { this.wt = frand(3, 9); const a = frand(0, TAU), r = frand(0, this.homeR || 4); this.walkTo([V3(this.home.x + Math.cos(a) * r, 0, this.home.z + Math.sin(a) * r)], frand(0.9, 1.4)); } }
    super.update(dt);
  }
}

function separateActors() {
  if (G.inCine) return;
  const A = G.actors;
  const idle = a => !a.isPlayer && !a.path && !a.follow && !a.active && a.speed < 0.15;
  for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) {
    const a = A[i], b = A[j]; if (!a.solid || !b.solid || !a.alive || !b.alive || !a.visible || !b.visible) continue;
    const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z, m = a.radius + b.radius; if (Math.abs(dx) > m || Math.abs(dz) > m) continue;
    const d = Math.hypot(dx, dz); if (d >= m || d < 1e-4) continue;
    const push = (m - d) / d; const wa = a.isPlayer && a.state !== 'move' ? 0.2 : a.heavyBody ? 0.1 : 0.5, wb = b.heavyBody ? 0.1 : 1 - wa;
    const ap = a.pinned || idle(a), bp = b.pinned || idle(b); if (ap && bp) continue;
    if (ap) { b.pos.x += dx * push; b.pos.z += dz * push; continue; } if (bp) { a.pos.x -= dx * push; a.pos.z -= dz * push; continue; }
    a.pos.x -= dx * push * wa; a.pos.z -= dz * push * wa; b.pos.x += dx * push * wb; b.pos.z += dz * push * wb;
  }
}
