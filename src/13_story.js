// ---------- Hikâye motoru ----------
const ABORT = { abort: true };
const Story = {
  scenes: {}, order: [], runId: 0, current: null, skipping: false, canSkip: true, markerTarget: null, waiters: [], inter: [],
  def(id, meta, fn) { this.scenes[id] = Object.assign({ id, fn }, meta); this.order.push(id); },
  skip() { if (!G.inCine) return; this.skipping = true; UI.advance(); if (UI.sysAdvance) { UI.sysAdvance(); UI.sysAdvance && UI.sysAdvance(); } for (const w of this.waiters) if (w.skippable) w.t = 1e9; },
  abort() { this.runId++; this.waiters = []; this.inter = []; this.skipping = false; UI.hideDialog(); $('#choices').hidden = true; $('#system').hidden = true; UI.interact(null); UI.objective(null); UI.counter(null); UI.boss(null); this.markerTarget = null; },
  async run(id) {
    const sc = this.scenes[id]; if (!sc) { Game.toMenu(); return; }
    this.abort(); const my = this.runId; this.current = id; Save.reach(id);
    const S = makeS(my);
    try {
      await sc.fn(S);
      if (my !== this.runId) return;
      const i = this.order.indexOf(id); const nx = sc.next || this.order[i + 1];
      if (nx) { Save.reach(nx); this.run(nx); } else Game.finale();
    } catch (e) {
      if (e === ABORT) return;
      console.error(e); Game.showError(e);
    }
  },
  frame(dt) {
    for (let i = this.waiters.length - 1; i >= 0; i--) {
      const w = this.waiters[i]; let done = false;
      if (w.time !== undefined) { w.t += dt; done = w.t >= w.time; } else { try { done = w.fn(dt); } catch (e) { console.error(e); done = true; } }
      if (done) { this.waiters.splice(i, 1); w.res(); }
    }
    // etkileşim
    const P = G.player; let best = null, bd = 1e9;
    if (P && G.controlEnabled && !G.inCine) for (const it of this.inter) { const p = it.pos.isVector3 ? it.pos : it.pos.pos; const d = distXZ(P.pos, p); if (d < it.r && d < bd) { bd = d; best = it; } }
    UI.interact(best ? best.label : null, best && !G.combat);
    if (best && Input.take('interact')) { this.inter.splice(this.inter.indexOf(best), 1); UI.interact(null); best.res(); }
    else if (!best) Input.take('interact');
  },
};

function makeS(my) {
  const chk = () => { if (my !== Story.runId) throw ABORT; };
  const S = {
    my, chk,
    async wait(sec) { if (Story.skipping && G.inCine) { chk(); return; } await new Promise(res => Story.waiters.push({ time: sec, t: 0, res, skippable: true })); chk(); },
    async until(fn) { const t0 = G.t; await new Promise(res => Story.waiters.push({ fn: G.auto ? () => fn() || G.t - t0 > 14 : fn, res })); chk(); },
    async level(build, tod, envOpts = {}) {
      $('#loading').hidden = false; await sleep(30); chk();
      Game.clearWorld();
      const L = build(); G.level = L; G.scene.add(L.group);
      G.env.set(tod, envOpts); FX.clear(); Screen.reset(); Cam.lockTarget = null; Cam.dist = Cam.distBase = L.interior ? 3.2 : 5.2; Cam.height = 1.45; Cam.pitch = 0.3; Cam.fovT = 55;
      G.renderer.shadowMap.needsUpdate = true;
      await sleep(30); $('#loading').hidden = true; chk();
      return L;
    },
    async say(who, text, o = {}) {
      const c = typeof who === 'string' ? CAST[who] : who; const a = c && c.actor && !c.actor.removed ? c.actor : null;
      if (a) a.say(true);
      if (o.look && a) { a.faceTo(o.look); }
      await UI.say(c, text, Object.assign({ thought: c === CAST.thought }, o)); if (a) a.say(false); chk();
    },
    think(text) { return S.say('thought', text, { thought: true }); },
    narr(text) { return S.say(null, text, { narr: true }); },
    async choice(opts) { const r = await UI.choice(opts); chk(); return r; },
    cine(on) {
      G.inCine = on; G.controlEnabled = !on; UI.cine(on); UI.hud(!on); if (!on) { Story.skipping = false; Cam.follow(G.player); } Input.reset();
      if (on && G.player) { G.player.vel.set(0, 0, 0); if (G.player.state !== 'dead') G.player.state = 'move'; }
    },
    async shot(pos, look, dur = 0, ease) { const p = Cam.shot(pos, look, Story.skipping ? 0 : dur, ease); if (dur > 0 && !Story.skipping) { await new Promise(res => Story.waiters.push({ fn: () => Cam.shotT >= Cam.shotDur || Story.skipping, res })); } chk(); },
    follow(snap) { Cam.follow(G.player, snap); },
    async fadeOut(d = 0.8) { await UI.fade(1, d); chk(); },
    async fadeIn(d = 0.8) { await UI.fade(0, d); chk(); },
    async title(k, h, sub, hold = 4.6) { UI.title(k, h, sub); await S.wait(hold); },
    objective(text, target) { UI.objective(text); Story.markerTarget = target || null; },
    clearObjective() { UI.objective(null); Story.markerTarget = null; },
    async reach(target, r = 2) { if (G.auto) { const v = target.isVector3 ? target : target.pos; G.player.place(v.x, v.z + 0.5, G.player.facing); } await S.until(() => { const p = target.isVector3 ? target : target.pos; return G.player && distXZ(G.player.pos, p) < r; }); },
    async interact(pos, label, r = 2) { if (G.auto) { const v = pos.isVector3 ? pos : pos.pos; G.player.place(v.x + 0.6, v.z + 0.6, G.player.facing); await S.wait(0.6); return; } await new Promise(res => Story.inter.push({ pos, label, r, res })); chk(); },
    async talkTo(npc, label = 'Konuş', r = 2.3) { await S.interact(npc, label, r); },
    async walk(actor, pts, speed) {
      if (!Array.isArray(pts)) pts = [pts];
      if (Story.skipping && G.inCine) { const last = pts[pts.length - 1]; const v = last.isVector3 ? last : V3(last[0], 0, last[1]); actor.place(v.x, v.z, actor.facing); return; }
      const last = pts[pts.length - 1], lv = last.isVector3 ? last : V3(last[0], 0, last[1]);
      let len = 0, prev = actor.pos; for (const q of pts) { const v = q.isVector3 ? q : V3(q[0], 0, q[1]); len += distXZ(prev, v); prev = v; }
      const limit = len / (speed || actor.walkSpeed) * 1.8 + 2.5; const t0 = G.t;
      const pr = actor.walkTo(pts, speed);
      await S.until(() => !actor.path || G.t - t0 > limit);
      if (actor.path) { actor.stopWalk(); actor.place(lv.x, lv.z, actor.facing); }
      chk();
    },
    music(t) { Audio.play(t); }, amb(n, on = true) { Audio.ambience(n, on); },
    sfx(n, v) { Audio.sfx(n, v); },
    cast(key, actor) { CAST[key].actor = actor; return actor; },
    tip(text, dur = 4200) { UI.toast(text, dur); },
    checkpoint() { },
    par(...ps) { return Promise.all(ps); },
  };
  return S;
}

// ---- Kalıcı kayıt ----
const Save = {
  key: 'elonth.save.v1', data: { last: null, unlocked: [], settings: null },
  load() { try { const s = localStorage.getItem(this.key); if (s) this.data = Object.assign(this.data, JSON.parse(s)); } catch (_) { } if (this.data.settings) Object.assign(G.settings, this.data.settings); },
  store() { this.data.settings = G.settings; try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (_) { } },
  reach(id) { this.data.last = id; if (!this.data.unlocked.includes(id)) this.data.unlocked.push(id); this.store(); },
};
