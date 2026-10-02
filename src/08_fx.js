// ---------- Efektler: parçacıklar, uyarı halkaları, ekran efektleri ----------
const FX = {
  parts: [], pool: [], rings: [], texts: [],
  init(scene) {
    this.scene = scene;
    this.flashMat = new T.MeshBasicMaterial({ color: '#fff6d8', transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false });
    this.ringGeo = new T.RingGeometry(0.85, 1, 32); this.ringGeo.rotateX(-Math.PI / 2);
    this.discGeo = new T.CircleGeometry(1, 32); this.discGeo.rotateX(-Math.PI / 2);
    this.layer = document.getElementById('fxlayer');
  },
  clear() { for (const p of this.parts) this.scene.remove(p.m); this.parts = []; for (const r of this.rings) this.scene.remove(r.m); this.rings = []; for (const t of this.texts) t.el.remove(); this.texts = []; },
  burst(pos, o = {}) {
    const n = o.n || 8;
    for (let i = 0; i < n; i++) {
      const m = new T.Mesh(prim(o.shape || 'tetra'), o.mat || lam(o.color || '#d8c8a8'));
      const s = (o.size || 0.08) * frand(0.6, 1.3); m.scale.setScalar(s); m.position.copy(pos);
      const a = frand(0, TAU), sp = frand(o.spd0 || 1.5, o.spd || 4);
      const v = V3(Math.cos(a) * sp, frand(o.up0 || 1, o.up || 4), Math.sin(a) * sp);
      if (o.dir) v.addScaledVector(o.dir, o.dirK || 3);
      this.scene.add(m); this.parts.push({ m, v, life: frand(0.4, 0.8) * (o.life || 1), t: 0, g: o.g === undefined ? 12 : o.g, spin: frand(-10, 10), s });
    }
  },
  dust(pos, n = 6, color = '#b8a07a') { this.burst(pos, { n, color, size: 0.14, spd: 2, up: 1.5, g: 2, life: 0.9, shape: 'ico0' }); },
  impact(pos, dir, heavy) {
    const f = new T.Mesh(prim('octa'), this.flashMat); f.position.copy(pos); f.scale.setScalar(heavy ? 0.9 : 0.55); this.scene.add(f);
    this.parts.push({ m: f, v: V3(), life: 0.12, t: 0, g: 0, spin: 20, s: heavy ? 0.9 : 0.55, flash: 1 });
    this.burst(pos, { n: heavy ? 10 : 6, color: '#fff2c8', mat: this.flashMat, size: 0.07, spd: heavy ? 6 : 4, up: 3, dir, dirK: 2, g: 6, life: 0.5 });
  },
  ring(pos, r, color = '#ff4a3a', dur = 0.6, o = {}) {
    const mat = new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, depthWrite: false, fog: false });
    const m = new T.Mesh(o.disc ? this.discGeo : this.ringGeo, mat); m.position.copy(pos); m.position.y += 0.06; m.scale.setScalar(o.grow ? 0.1 : r); this.scene.add(m);
    const R = { m, r, t: 0, dur, grow: o.grow, follow: o.follow, fade: o.fade !== false }; this.rings.push(R); return R;
  },
  line(from, ry, len, width, color = '#ff3a2a', dur = 1) {
    const mat = new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, depthWrite: false, fog: false });
    const g = new T.PlaneGeometry(width, len); g.rotateX(-Math.PI / 2); g.translate(0, 0, len / 2);
    const m = new T.Mesh(g, mat); m.position.copy(from); m.position.y += 0.07; m.rotation.y = ry; this.scene.add(m);
    const R = { m, r: 1, t: 0, dur, line: true }; this.rings.push(R); return R;
  },
  text(pos, str, cls = '') {
    const el = document.createElement('div'); el.className = 'ftext ' + cls; el.textContent = str; this.layer.appendChild(el);
    this.texts.push({ el, pos: pos.clone(), t: 0, dur: 0.9 });
  },
  update(dt, cam) {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]; p.t += dt;
      if (p.flash) { p.m.scale.setScalar(p.s * (1 + p.t * 8)); p.m.material.opacity = 1 - p.t / p.life; p.m.rotation.y += dt * p.spin; }
      else { p.v.y -= p.g * dt; p.m.position.addScaledVector(p.v, dt); if (G.level && p.m.position.y < G.level.h(p.m.position.x, p.m.position.z)) { p.m.position.y = G.level.h(p.m.position.x, p.m.position.z); p.v.multiplyScalar(0.4); } p.m.rotation.x += p.spin * dt; p.m.rotation.y += p.spin * dt; p.m.scale.setScalar(p.s * (1 - Math.pow(p.t / p.life, 2))); }
      if (p.t >= p.life) { this.scene.remove(p.m); this.parts.splice(i, 1); }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]; r.t += dt; const u = r.t / r.dur;
      if (r.follow) r.m.position.set(r.follow.x, r.follow.y + 0.06, r.follow.z);
      if (r.grow) r.m.scale.setScalar(Math.max(0.05, r.r * Math.min(1, u)));
      r.m.material.opacity = r.line ? 0.25 + 0.35 * Math.abs(Math.sin(r.t * 12)) : (r.fade ? 0.65 * (1 - u * 0.6) : 0.6);
      if (u >= 1 || r.dead) { this.scene.remove(r.m); r.m.material.dispose(); if (r.line) r.m.geometry.dispose(); this.rings.splice(i, 1); }
    }
    const v = new T.Vector3();
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i]; t.t += dt; v.copy(t.pos); v.y += t.t * 1.2; v.project(cam);
      if (v.z > 1) t.el.style.opacity = 0; else { t.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * innerWidth}px, ${(-v.y * 0.5 + 0.5) * innerHeight}px) translate(-50%,-50%)`; t.el.style.opacity = 1 - Math.max(0, t.t / t.dur - 0.6) / 0.4; }
      if (t.t > t.dur) { t.el.remove(); this.texts.splice(i, 1); }
    }
  },
};

// Ekran efektleri
const Screen = {
  fx: { blur: 0, gray: 0, sat: 1, bright: 1, vig: 0, red: 0, wobble: 0 },
  target: { blur: 0, gray: 0, sat: 1, bright: 1, vig: 0, red: 0, wobble: 0 },
  shake: 0,
  set(o, instant) { Object.assign(this.target, o); if (instant) Object.assign(this.fx, o); },
  reset() { this.set({ blur: 0, gray: 0, sat: 1, bright: 1, vig: 0, red: 0, wobble: 0 }, true); this.shake = 0; },
  addShake(v) { this.shake = Math.min(1.2, this.shake + v); },
  update(dt) {
    const f = this.fx, t = this.target;
    for (const k in f) f[k] = damp(f[k], t[k], 3.5, dt);
    const c = G.renderer.domElement;
    const filt = [];
    if (f.blur > 0.05) filt.push(`blur(${f.blur.toFixed(2)}px)`);
    if (f.gray > 0.01) filt.push(`grayscale(${f.gray.toFixed(2)})`);
    if (Math.abs(f.sat - 1) > 0.01) filt.push(`saturate(${f.sat.toFixed(2)})`);
    if (Math.abs(f.bright - 1) > 0.01) filt.push(`brightness(${f.bright.toFixed(2)})`);
    c.style.filter = filt.join(' ');
    const vg = document.getElementById('vignette'); vg.style.opacity = f.vig.toFixed(3);
    const rd = document.getElementById('redflash'); rd.style.opacity = f.red.toFixed(3);
    this.target.red = Math.max(0, this.target.red - dt * 2);
    this.shake = Math.max(0, this.shake - dt * 2.2);
  },
  redFlash(v = 0.5) { this.fx.red = v; this.target.red = 0; },
};

// ---------- Ortam canlılığı: duman, kuşlar, kelebekler, ateşböcekleri, toz ----------
const Ambient = {
  init(scene) {
    this.scene = scene; this.group = new T.Group(); scene.add(this.group);
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); this.soft = new T.CanvasTexture(c);
    this.items = [];
  },
  clear() { for (const o of [...this.group.children]) { this.group.remove(o); o.traverse(k => { if (k.material && k.material.dispose && !k.material.userData.keep) k.material.dispose(); if (k.geometry && !k.geometry.userData.keep) k.geometry.dispose(); }); } this.items = []; },
  setup(L, tod) {
    this.clear();
    const night = tod === 'night' || tod === 'interiorNight' || tod === 'storm';
    const dusk = tod === 'dusk' || tod === 'winterdusk';
    const outdoor = !L.interior;
    // baca dumanı
    if (outdoor && tod !== 'storm') for (const p of L.smoke.slice(0, 16)) {
      for (let i = 0; i < 6; i++) {
        const m = new T.SpriteMaterial({ map: this.soft, color: night ? '#5a6070' : '#d8d4cc', transparent: true, opacity: 0, depthWrite: false });
        const s = new T.Sprite(m); this.group.add(s);
        this.items.push({ k: 'smoke', s, p, t: i / 6 * 4.2, life: 4.2 });
      }
    }
    // çeşme sıçraması
    if (outdoor && L.fountains) for (const p of L.fountains) for (let i = 0; i < 10; i++) { const m = new T.SpriteMaterial({ map: this.soft, color: '#e8f8ff', transparent: true, opacity: 0, depthWrite: false }); const s = new T.Sprite(m); this.group.add(s); this.items.push({ k: 'spray', s, p, t: i / 10 * 1.1, life: 1.1, a: rnd(0, TAU) }); }
    // kuşlar
    if (outdoor && !night && tod !== 'storm') {
      const wingG = new T.BufferGeometry(); wingG.setAttribute('position', new T.Float32BufferAttribute([0, 0, -0.12, 0, 0, 0.12, 0.7, 0.05, 0], 3)); wingG.computeVertexNormals(); wingG.userData.keep = true;
      const bm = new T.MeshBasicMaterial({ color: '#2a2a30', side: T.DoubleSide });
      for (let i = 0; i < 7; i++) {
        const b = new T.Group(); const w1 = new T.Mesh(wingG, bm), w2 = new T.Mesh(wingG, bm); w2.scale.x = -1; b.add(w1, w2); b.scale.setScalar(rnd(0.9, 1.3)); this.group.add(b);
        this.items.push({ k: 'bird', b, w1, w2, c: V3(rnd(-40, 40), rnd(22, 38), rnd(-50, 40)), r: rnd(18, 40), sp: rnd(0.15, 0.3) * (rng() < 0.5 ? 1 : -1), a: rnd(0, TAU), f: rnd(0, 6) });
      }
    }
    // kelebekler
    if (outdoor && !night && !dusk && !L.winter && L.flowerSpots && L.flowerSpots.length) {
      const wg = new T.PlaneGeometry(0.12, 0.1); wg.translate(0.06, 0, 0); wg.userData.keep = true;
      for (let i = 0; i < 16; i++) {
        const sp = pick(L.flowerSpots); const col = pick(['#ffffff', '#ffe060', '#ff9ac0', '#90c8ff', '#ffb050']);
        const m = new T.MeshBasicMaterial({ color: col, side: T.DoubleSide });
        const b = new T.Group(); const w1 = new T.Mesh(wg, m), w2 = new T.Mesh(wg, m); w2.scale.x = -1; b.add(w1, w2); this.group.add(b);
        this.items.push({ k: 'fly', b, w1, w2, home: V3(sp[0], L.h(sp[0], sp[1]) + 0.6, sp[1]), ph: rnd(0, 10) });
      }
    }
    // ateşböcekleri / toz
    const pts = (n, color, size, area, k) => {
      const pos = new Float32Array(n * 3), seedA = new Float32Array(n);
      for (let i = 0; i < n; i++) { pos[i * 3] = rnd(area.x0, area.x1); pos[i * 3 + 1] = rnd(area.y0, area.y1); pos[i * 3 + 2] = rnd(area.z0, area.z1); seedA[i] = rnd(0, 100); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
      const m = new T.PointsMaterial({ map: this.soft, color, size, transparent: true, opacity: 0.9, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true });
      const p = new T.Points(g, m); p.frustumCulled = false; this.group.add(p);
      this.items.push({ k, p, seedA, base: pos.slice(), area });
    };
    if (outdoor && night && !L.winter) pts(70, '#d8ff7a', 0.22, { x0: -30, x1: 30, y0: 0.3, y1: 2.2, z0: -25, z1: 30 }, 'firefly');
    if (L.interior && L.camBox) { const B = L.camBox; pts(90, night ? '#8090c0' : '#ffe8c0', 0.05, { x0: B.x0, x1: B.x1, y0: B.y0, y1: B.y1, z0: B.z0, z1: B.z1 }, 'dust'); }
  },
  update(dt) {
    const t = G.t;
    for (const it of this.items) {
      if (it.k === 'smoke') {
        it.t += dt; if (it.t > it.life) it.t -= it.life; const u = it.t / it.life;
        it.s.position.set(it.p.x + Math.sin(t * 0.4 + u * 3) * 0.3 + u * 1.2, it.p.y + u * 3.2, it.p.z + u * 0.6);
        const sc = 0.6 + u * 2.4; it.s.scale.set(sc, sc, sc); it.s.material.opacity = Math.sin(u * Math.PI) * 0.4;
      } else if (it.k === 'spray') {
        it.t += dt; if (it.t > it.life) { it.t -= it.life; it.a = rnd(0, TAU); } const u = it.t / it.life;
        it.s.position.set(it.p.x + Math.cos(it.a) * u * 0.9, it.p.y + u * 0.9 - u * u * 1.6, it.p.z + Math.sin(it.a) * u * 0.9);
        it.s.scale.setScalar(0.25 + u * 0.2); it.s.material.opacity = 0.55 * (1 - u);
      } else if (it.k === 'bird') {
        it.a += it.sp * dt; it.f += dt * 9;
        it.b.position.set(it.c.x + Math.cos(it.a) * it.r, it.c.y + Math.sin(it.a * 2) * 2, it.c.z + Math.sin(it.a) * it.r);
        it.b.rotation.y = -it.a + (it.sp > 0 ? 0 : Math.PI); const fl = Math.sin(it.f) * 0.7; it.w1.rotation.z = fl; it.w2.rotation.z = -fl;
      } else if (it.k === 'fly') {
        it.ph += dt; const p = it.ph;
        it.b.position.set(it.home.x + Math.sin(p * 0.7) * 1.2 + Math.sin(p * 1.9) * 0.3, it.home.y + Math.sin(p * 1.3) * 0.35, it.home.z + Math.cos(p * 0.6) * 1.1);
        it.b.rotation.y = p * 0.8; const fl = Math.sin(p * 22) * 1.1; it.w1.rotation.z = fl; it.w2.rotation.z = -fl;
      } else if (it.k === 'firefly' || it.k === 'dust') {
        const a = it.p.geometry.attributes.position.array, n = it.seedA.length, sp = it.k === 'dust' ? 0.06 : 0.5;
        for (let i = 0; i < n; i++) { const s = it.seedA[i]; a[i * 3] = it.base[i * 3] + Math.sin(t * sp + s) * (it.k === 'dust' ? 0.3 : 1.2); a[i * 3 + 1] = it.base[i * 3 + 1] + Math.sin(t * sp * 1.3 + s * 2) * (it.k === 'dust' ? 0.2 : 0.5); a[i * 3 + 2] = it.base[i * 3 + 2] + Math.cos(t * sp * 0.8 + s) * (it.k === 'dust' ? 0.3 : 1.2); }
        it.p.geometry.attributes.position.needsUpdate = true;
        if (it.k === 'firefly') it.p.material.opacity = 0.6 + Math.sin(t * 3) * 0.3;
      }
    }
  },
};
