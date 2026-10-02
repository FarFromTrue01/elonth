// ---------- Diyalog portreleri (konuşan karakterin canlı büstü) ----------
// Ana tuvalin bir köşesine ayrı bir sahneyle çizilir, 2D tuvale kopyalanır; ardından ana kare her şeyin üstüne çizilir.
const Portrait = {
  PW: 150, PH: 150, actor: null, color: '#ccc', on: false, every: 2, n: 0, jobs: [],
  init() {
    const s = this.scene = new T.Scene();
    this.hemi = new T.HemisphereLight('#fff6ea', '#6a5a52', 1.5); s.add(this.hemi);
    const key = this.key = new T.DirectionalLight('#fff0dc', 2.4); key.position.set(-1.4, 1.8, 2.2); s.add(key); s.add(key.target);
    const rim = this.rim = new T.DirectionalLight('#cfe0ff', 1.6); rim.position.set(1.8, 1.2, -2.2); s.add(rim); s.add(rim.target);
    this.cam = new T.PerspectiveCamera(30, 1, 0.05, 12);
    this.wrap = document.getElementById('dport'); this.cv = this.wrap.querySelector('canvas'); this.ctx = this.cv.getContext('2d');
    this.bgs = {};
  },
  bg(color) {
    if (this.bgs[color]) return this.bgs[color];
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 46, 4, 64, 64, 96); g.addColorStop(0, mixHex(color, '#ffffff', 0.15)); g.addColorStop(0.45, mixHex(color, '#2a2018', 0.45)); g.addColorStop(1, '#120e0b');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`; const r = 2 + Math.random() * 7; x.beginPath(); x.arc(Math.random() * 128, Math.random() * 128, r, 0, TAU); x.fill(); }
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return this.bgs[color] = t;
  },
  // c: CAST girdisi; a: aktör (yoksa gizle)
  show(a, c, dim) {
    if (!a || !a.model || !a.model.head || a.removed || !c) { this.hide(); return; }
    this.actor = a; this.color = c.color || '#ccc'; this.on = true; this.n = 0; this.fresh = true;
    this.wrap.hidden = false; this.wrap.classList.toggle('dim', !!dim); this.wrap.style.setProperty('--pc', this.color);
    document.getElementById('dialog').classList.add('hasport');
  },
  hide() { this.on = false; this.actor = null; if (this.wrap) this.wrap.hidden = true; const d = document.getElementById('dialog'); if (d) d.classList.remove('hasport'); },
  // tek seferlik çekim (ör. su yansıması): bir sonraki karede çizilir
  snap(a, o = {}) { return new Promise(res => this.jobs.push({ a, o, res })); },
  // ana döngüde, ana render'dan hemen önce
  process() {
    if (this.jobs.length) for (const j of this.jobs.splice(0)) { const cv = document.createElement('canvas'); try { this.draw(j.a, j.o, cv); } catch (e) { console.error(e); } j.res(cv); }
    if (!this.on) return;
    const a = this.actor; if (!a || a.removed || $('#dialog').hidden) { this.hide(); return; }
    if (!this.fresh && (this.n++ % this.every)) return; this.fresh = false;
    this.draw(a, { color: this.color }, this.cv);
  },
  draw(a, o, cv) {
    const r = G.renderer, m = a.model, root = m.root, par = root.parent; if (!par || !m.head) return;
    const pr = r.getPixelRatio(), W = o.w || this.PW, H = o.h || this.PH;
    if (cv.width !== Math.round(W * pr)) { cv.width = Math.round(W * pr); cv.height = Math.round(H * pr); }
    // ışık rengi sahneye hafifçe uyar
    const env = G.env; if (env) { this.key.color.set('#fff0dc').lerp(env.sun.color, 0.3); this.hemi.groundColor.set('#6a5a52').lerp(env.hemi.groundColor, 0.3); }
    this.scene.background = o.bgColor ? new T.Color(o.bgColor) : this.bg(o.color || '#888');
    // modeli geçici olarak portre sahnesine al
    const olv = m.outlines.map(q => q.visible); for (const q of m.outlines) q.visible = true;
    const fs = m.faceState.split('|'), fm = m.faceMat ? m.faceMat.map : null;
    if (m.faceMat) m.faceMat.map = m.faceTexFor(m.expr, m.closedEyes ? 'closed' : (fs[1] || 'open'), o.mouth || fs[2] || 'closed');
    this.scene.add(root); root.updateMatrixWorld(true);
    const hd = m.head, Hh = m.D.headH;
    const top = Hh + 0.07, bot = o.bot !== undefined ? o.bot * Hh : -0.29, cy = (top + bot) / 2, half = (top - bot) / 2 * 1.04;
    const dist = half / Math.tan(this.cam.fov * Math.PI / 360), ang = o.ang !== undefined ? o.ang : 0.32;
    const cp = hd.localToWorld(V3(Math.sin(ang) * dist, cy + 0.04, Math.cos(ang) * dist)), tg = hd.localToWorld(V3(0, cy, 0));
    const up = V3(0, 1, 0).applyQuaternion(hd.getWorldQuaternion(new T.Quaternion()));
    this.cam.position.copy(cp); this.cam.up.copy(up); this.cam.lookAt(tg); this.cam.aspect = W / H; this.cam.updateProjectionMatrix();
    // ışıklar kameraya göre: önden-yukarıdan yumuşak ana ışık, arkadan kenar ışığı
    const fw = tg.clone().sub(cp).normalize(), rt = new T.Vector3().crossVectors(fw, up).normalize();
    this.key.target.position.copy(tg); this.key.position.copy(tg).addScaledVector(fw, -3).addScaledVector(rt, -1.1).addScaledVector(up, 1.6);
    this.rim.target.position.copy(tg); this.rim.position.copy(tg).addScaledVector(fw, 3).addScaledVector(rt, 1.6).addScaledVector(up, 1.0);
    this.key.target.updateMatrixWorld(); this.rim.target.updateMatrixWorld();
    const size = r.getSize(new T.Vector2());
    r.setViewport(0, 0, W, H); r.setScissor(0, 0, W, H); r.setScissorTest(true);
    try { r.render(this.scene, this.cam); }
    finally {
      r.setScissorTest(false); r.setViewport(0, 0, size.x, size.y);
      par.add(root); root.updateMatrixWorld(true);
      if (m.faceMat) m.faceMat.map = fm; m.outlines.forEach((q, i) => q.visible = olv[i]);
    }
    const cw = cv.width, ch = cv.height;
    cv.getContext('2d').drawImage(r.domElement, 0, r.domElement.height - ch, cw, ch, 0, 0, cw, ch);
  },
};
