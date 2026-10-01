// ---------- Oyun döngüsü, menüler ----------
const SCENE_META = [];
const Game = {
  init() {
    window.addEventListener('error', e => this.showError(e.error || e.message));
    Save.load();
    initMaterials();
    const r = G.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.NoToneMapping;
    r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    $('#view').appendChild(r.domElement);
    G.scene = new T.Scene();
    G.camera = new T.PerspectiveCamera(55, 1, 0.1, 900);
    G.env = new Env(G.scene);
    Cam.init(G.camera); FX.init(G.scene); Input.init(); UI.init();
    this.applyQuality(); this.resize(); addEventListener('resize', () => this.resize());
    this.bindMenus();
    G.env.set('dusk'); this.last = performance.now();
    requestAnimationFrame(t => this.loop(t));
    document.addEventListener('visibilitychange', () => { if (document.hidden && G.player && !$('#menu').hidden === false && !G.paused && Story.current) this.pause(true); });
    this.showMenu();
    $('#fade').style.opacity = 0;
    const hp = location.hash.replace('#', '').split('&'); const qs = hp[0]; G.auto = hp.includes('auto');
    if (qs && Story.scenes[qs]) { this.startAudio(); this.start(qs); }
  },
  applyQuality() {
    const hi = G.settings.quality === 'high';
    G.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, hi ? 1.6 : 1.0));
    G.renderer.shadowMap.enabled = true;
    G.env.sun.shadow.mapSize.set(hi ? 2048 : 1024, hi ? 2048 : 1024); if (G.env.sun.shadow.map) { G.env.sun.shadow.map.dispose(); G.env.sun.shadow.map = null; }
  },
  resize() {
    const w = innerWidth, h = innerHeight; G.renderer.setSize(w, h); G.camera.aspect = w / h; G.camera.updateProjectionMatrix();
    const portrait = h > w * 1.05 && w < 900; if (!this.rotOk) $('#rotate').hidden = !portrait;
  },
  clearWorld() {
    for (const a of [...G.actors]) a.remove();
    G.actors = []; G.enemies = []; G.allies = []; G.attackers.clear(); G.player = null; UI.clearBars();
    if (G.level) { G.scene.remove(G.level.group); G.level.dispose(); G.level = null; }
    FX.clear(); G.combat = false; Audio.stopAmbience();
  },
  loop(now) {
    requestAnimationFrame(t => this.loop(t));
    let raw = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    G.rawDt = raw;
    if (G.paused) { G.renderer.render(G.scene, G.camera); return; }
    let ts = G.timeScale;
    if (G.slowmo > 0) { G.slowmo -= raw; ts *= 0.28; }
    if (G.hitstop > 0) { G.hitstop -= raw; ts *= 0.04; }
    const dt = raw * ts; G.dt = dt; G.t += dt;
    Input.update();
    for (const a of G.actors) a.update(dt);
    separateActors();
    if (G.level) G.level.update(dt);
    Story.frame(dt);
    Cam.update(raw * (G.hitstop > 0 ? 0.3 : 1) * (G.slowmo > 0 ? 0.5 : 1));
    if (G.player) G.env.focus.copy(G.player.pos); else G.env.focus.copy(Cam.look);
    G.env.update(dt, G.camera);
    FX.update(dt, G.camera); Screen.update(raw); UI.frame(raw);
    if (G.onFrame) G.onFrame(dt);
    Input.endFrame();
    G.renderer.render(G.scene, G.camera);
  },
  startAudio() { Audio.init(); Audio.resume(); },
  bindMenus() {
    $('#menu').addEventListener('click', e => {
      const b = e.target.closest('[data-m]'); if (!b) return; this.startAudio(); Audio.sfx('confirm');
      const m = b.dataset.m;
      if (m === 'new') this.newGame();
      if (m === 'continue') { const id = Save.data.last; if (id) this.start(id); }
      if (m === 'chapters') this.openChapters();
      if (m === 'settings') this.openSettings();
      if (m === 'fullscreen') { const d = document.documentElement; try { if (!document.fullscreenElement) (d.requestFullscreen || d.webkitRequestFullscreen).call(d).catch(() => { }); else document.exitFullscreen(); } catch (_) { } }
    });
    $('#pause').addEventListener('click', e => {
      const b = e.target.closest('[data-p]'); if (!b) return; Audio.sfx('ui'); const p = b.dataset.p;
      if (p === 'resume') this.pause(false);
      if (p === 'restart') { this.pause(false); this.start(Story.current); }
      if (p === 'chapters') this.openChapters();
      if (p === 'settings') this.openSettings();
      if (p === 'menu') { this.pause(false); this.toMenu(); }
    });
    $('#p-close').addEventListener('click', () => { $('#panel').hidden = true; Save.store(); });
    $('#rotate-ok').addEventListener('click', () => { this.rotOk = true; $('#rotate').hidden = true; });
    addEventListener('keydown', e => { if (e.code === 'Escape' && Story.current && $('#menu').hidden) this.pause(!G.paused); });
  },
  showMenu() {
    $('#menu').hidden = false; $('#m-ver').textContent = 'Sürüm ' + BUILD;
    const last = Save.data.last; const c = $('#m-continue'); c.disabled = !last; $('#m-cont-sub').textContent = last && Story.scenes[last] ? Story.scenes[last].title : '';
    this.menuScene();
  },
  menuScene() {
    Story.abort(); Story.current = null; this.clearWorld(); UI.hud(false); UI.cine(false); G.inCine = false;
    const L = buildVillage({ night: false }); G.level = L; G.scene.add(L.group); G.env.set('dusk');
    const n = new NPC({ look: LOOK.joseph(18), watch: false }); n.place(-31, -35, 2.9); n.model.setStance('sitGround', true);
    const l = new NPC({ look: LOOK.lily(15), watch: false }); l.place(-30.1, -34.8, 2.8); l.model.setStance('hugKnees', true);
    const hy = L.h(-31, -35);
    Cam.shot(V3(-33.2, hy + 2.0, -29.0), V3(-24, hy + 3.2, -72), 0);
    G.onFrame = dt => { Cam.toPos.x = -33.2 + Math.sin(G.t * 0.06) * 1.0; Cam.toPos.y = hy + 2.0 + Math.sin(G.t * 0.09) * 0.2; };
    Audio.play('title'); Audio.ambience('wind');
  },
  newGame() { Save.data.last = null; this.start(Story.order[0]); },
  start(id) {
    G.onFrame = null; $('#menu').hidden = true; $('#panel').hidden = true; $('#pause').hidden = true; G.paused = false;
    $('#fade').style.transition = 'none'; $('#fade').style.opacity = 1;
    Story.run(id);
  },
  toMenu() { G.onFrame = null; Story.abort(); this.showMenu(); $('#fade').style.transition = 'opacity .6s'; $('#fade').style.opacity = 0; },
  pause(on) {
    if (!Story.current || !$('#menu').hidden) return;
    G.paused = on; $('#pause').hidden = !on; Input.reset();
    if (on) { const s = Story.scenes[Story.current]; $('#pz-where').textContent = s ? s.chapter + ' · ' + s.title : ''; if (Audio.ctx) Audio.ctx.suspend(); }
    else { if (Audio.ctx) Audio.ctx.resume(); }
  },
  openChapters() {
    $('#panel').hidden = false; $('#p-title').textContent = 'Bölümler';
    const body = $('#p-body'); body.innerHTML = '';
    const groups = {};
    Story.order.forEach(id => { const s = Story.scenes[id]; (groups[s.chapter] = groups[s.chapter] || []).push(s); });
    for (const ch in groups) {
      const g = document.createElement('div'); g.className = 'ch-group'; g.innerHTML = `<h3>${ch}</h3>`;
      groups[ch].forEach((s, i) => {
        const un = Save.data.unlocked.includes(s.id) || i === 0 && ch === 'Prolog';
        const b = document.createElement('button'); b.type = 'button'; b.className = 'ch-item'; b.disabled = !un;
        b.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${s.title}<small>${s.sub || ''}</small></span><span class="s">${un ? (s.kind || '') : 'Kilitli'}</span>`;
        b.addEventListener('click', () => { this.startAudio(); Audio.sfx('confirm'); this.start(s.id); });
        g.appendChild(b);
      });
      body.appendChild(g);
    }
  },
  openSettings() {
    $('#panel').hidden = false; $('#p-title').textContent = 'Ayarlar';
    const S = G.settings, body = $('#p-body');
    const range = (id, label, key, min, max, step) => `<div class="set-row"><label for="${id}">${label}</label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${S[key]}" data-k="${key}"></div>`;
    body.innerHTML = range('s-sens', 'Kamera hassasiyeti', 'sens', 0.3, 2.5, 0.1) + range('s-mus', 'Müzik', 'music', 0, 1, 0.05) + range('s-sfx', 'Efektler', 'sfx', 0, 1, 0.05) + range('s-txt', 'Metin hızı', 'textSpeed', 0.5, 3, 0.1)
      + `<div class="set-row"><label>Grafik</label><div class="seg" id="s-q"><button type="button" data-v="low">Akıcı</button><button type="button" data-v="high">Kaliteli</button></div></div>`
      + `<div class="set-row"><label>Dikey kamera</label><div class="seg" id="s-inv"><button type="button" data-v="0">Normal</button><button type="button" data-v="1">Ters</button></div></div>`;
    body.querySelectorAll('input[type=range]').forEach(i => i.addEventListener('input', () => { S[i.dataset.k] = parseFloat(i.value); Audio.applyVolumes(); Save.store(); }));
    const seg = (id, get, set) => { const el = $(id); const upd = () => el.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === get())); el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; set(b.dataset.v); upd(); Save.store(); }); upd(); };
    seg('#s-q', () => S.quality, v => { S.quality = v; this.applyQuality(); });
    seg('#s-inv', () => S.invertY ? '1' : '0', v => { S.invertY = v === '1'; });
  },
  async finale() {
    UI.hud(false); await UI.fade(1, 1.5);
    UI.title('Arc 1 · Bölüm 1 sonu', 'Devam edecek', 'Sıradaki: Bölüm 2 · Ceza');
    await sleep(5600);
    this.toMenu(); UI.toast('Bölüm 2 yakında. Tüm sahneler Bölümler menüsünde açık.', 5000);
  },
  showError(e) { const el = $('#err'); el.hidden = false; el.textContent = 'Hata: ' + (e && e.stack ? e.stack : e); setTimeout(() => el.hidden = true, 12000); },
};
window.addEventListener('load', () => { try { Game.init(); } catch (e) { Game.showError(e); } });
window.__G = G; window.__Story = Story; window.__Game = Game; window.__Cam = Cam; window.__Input = () => Input;
