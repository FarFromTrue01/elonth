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
