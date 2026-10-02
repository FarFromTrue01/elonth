// ---------- Kamera ----------
const Cam = {
  mode: 'follow', yaw: 0, pitch: 0.32, dist: 5.2, distBase: 5.2, height: 1.45, target: null, shotT: 0,
  pos: new T.Vector3(), look: new T.Vector3(), fromPos: new T.Vector3(), fromLook: new T.Vector3(), toPos: new T.Vector3(), toLook: new T.Vector3(),
  orbit: null, ease: easeInOut, shotDur: 0, fov: 55, fovT: 55, recenter: true, idle: 0, lockTarget: null,
  init(cam) { this.cam = cam; },
  follow(target, snap) {
    this.mode = 'follow'; this.target = target || this.target;
    if (snap && this.target) { this.yaw = this.target.facing + Math.PI; this.updateFollow(1, true); }
  },
  snapBehind() { if (this.target) this.yaw = this.target.facing + Math.PI; },
  // sinematik çekim: pos ve look Vector3 veya fonksiyon
  shot(pos, look, dur = 0, ease = easeInOut) {
    this.mode = 'shot'; this.fromPos.copy(this.pos); this.fromLook.copy(this.look);
    this.toPosF = typeof pos === 'function' ? pos : null; this.toLookF = typeof look === 'function' ? look : null;
    if (!this.toPosF) this.toPos.copy(pos); if (!this.toLookF) this.toLook.copy(look);
    this.shotT = 0; this.shotDur = dur; this.ease = ease;
    if (dur <= 0) { this.pos.copy(this.toPosF ? this.toPosF() : this.toPos); this.look.copy(this.toLookF ? this.toLookF() : this.toLook); }
    return new Promise(r => { this.shotDone = r; if (dur <= 0) { r(); this.shotDone = null; } });
  },
  orbitAround(center, r, h, speed, a0 = 0) { this.mode = 'orbit'; this.orbit = { center: center.clone(), r, h, speed, a: a0 }; },
  updateFollow(dt, snap) {
    const p = this.target; if (!p) return;
    const sc = p.scale || 1;
    const tgt = V3(p.pos.x, p.pos.y + this.height * Math.max(0.75, sc), p.pos.z);
    const SL = G.settings.shiftLock && !G.inCine;
    if (!SL && this.lockTarget && this.lockTarget.alive) {
      const lt = this.lockTarget.pos; const want = Math.atan2(p.pos.x - lt.x, p.pos.z - lt.z);
      this.yaw = dampAngle(this.yaw, want, 2.2, dt);
    }
    const sens = G.settings.sens;
    this.yaw -= Input.look.x * 0.0055 * sens;
    this.pitch += Input.look.y * 0.004 * sens * (G.settings.invertY ? -1 : 1);
    this.pitch = clamp(this.pitch, -0.15, 1.1);
    if (Math.abs(Input.look.x) + Math.abs(Input.look.y) > 0) this.idle = 0; else this.idle += dt;
    // hareket ederken hafifçe arkaya yerleş
    if (!SL && !G.combat && this.recenter && p.moving && this.idle > 1.5 && !this.lockTarget) this.yaw = dampAngle(this.yaw, p.facing + Math.PI, 0.5, dt);
    // shift lock: omuz ofseti
    this.sl = damp(this.sl || 0, SL ? 1 : 0, 6, dt || 0.016);
    if (this.sl > 0.01) { const off = 0.55 * this.sl * Math.max(0.75, sc); tgt.x += Math.cos(this.yaw) * off; tgt.z -= Math.sin(this.yaw) * off; tgt.y += 0.1 * this.sl; }
    const d = this.dist * Math.max(0.8, sc);
    const want = V3(tgt.x + Math.sin(this.yaw) * Math.cos(this.pitch) * d, tgt.y + Math.sin(this.pitch) * d, tgt.z + Math.cos(this.yaw) * Math.cos(this.pitch) * d);
    const L = G.level;
    if (L && !L.interior) {
      // binalara girmesin: hedeften kameraya doğru tara
      const steps = 14; let ok = 1;
      for (let i = 2; i <= steps; i++) { const u = i / steps; const x = lerp(tgt.x, want.x, u), z = lerp(tgt.z, want.z, u), y = lerp(tgt.y, want.y, u); if (y < L.h(x, z) + 5.2 && L.blocked(x, z)) { ok = (i - 1) / steps; break; } }
      this.camK = damp(this.camK === undefined ? 1 : this.camK, ok, ok < (this.camK || 1) ? 25 : 3, dt || 0.016);
      if (this.camK < 0.999) { want.x = lerp(tgt.x, want.x, this.camK); want.z = lerp(tgt.z, want.z, this.camK); want.y = lerp(tgt.y, want.y, this.camK) + (1 - this.camK) * 0.6; }
    }
    if (L) { const gh = L.h(want.x, want.z) + 0.4; if (want.y < gh) want.y = gh; if (L.camBox) { const B = L.camBox; want.x = clamp(want.x, B.x0, B.x1); want.y = clamp(want.y, B.y0, B.y1); want.z = clamp(want.z, B.z0, B.z1); } }
    if (snap) { this.pos.copy(want); this.look.copy(tgt); }
    else { this.pos.lerp(want, 1 - Math.exp(-14 * dt)); this.look.lerp(tgt, 1 - Math.exp(-18 * dt)); }
  },
  update(dt) {
    if (this.mode === 'follow') this.updateFollow(dt);
    else if (this.mode === 'shot') {
      this.shotT += dt; const u = this.shotDur > 0 ? clamp(this.shotT / this.shotDur, 0, 1) : 1, e = this.ease(u);
      const tp = this.toPosF ? this.toPosF() : this.toPos, tl = this.toLookF ? this.toLookF() : this.toLook;
      this.pos.lerpVectors(this.fromPos, tp, e); this.look.lerpVectors(this.fromLook, tl, e);
      if (u >= 1 && this.shotDone) { const r = this.shotDone; this.shotDone = null; r(); }
    } else if (this.mode === 'orbit') {
      const o = this.orbit; o.a += o.speed * dt;
      this.pos.set(o.center.x + Math.sin(o.a) * o.r, o.center.y + o.h, o.center.z + Math.cos(o.a) * o.r); this.look.copy(o.center);
    }
    if (this.mode !== 'follow' && G.level && !G.level.interior) { const gh = G.level.h(this.pos.x, this.pos.z) + 0.35; if (this.pos.y < gh) this.pos.y = gh; }
    this.fov = damp(this.fov, this.fovT, 4, dt);
    const c = this.cam; c.position.copy(this.pos);
    if (Screen.shake > 0) { const s = Screen.shake * Screen.shake * 0.18; c.position.x += (Math.random() - 0.5) * s; c.position.y += (Math.random() - 0.5) * s; c.position.z += (Math.random() - 0.5) * s; }
    if (Screen.fx.wobble > 0.01) { const w = Screen.fx.wobble; c.position.x += Math.sin(G.t * 1.3) * 0.12 * w; c.position.y += Math.sin(G.t * 2.1) * 0.06 * w; }
    c.lookAt(this.look);
    if (Screen.fx.wobble > 0.01) c.rotation.z += Math.sin(G.t * 0.9) * 0.05 * Screen.fx.wobble;
    if (Math.abs(c.fov - this.fov) > 0.01) { c.fov = this.fov; c.updateProjectionMatrix(); }
  },
};
