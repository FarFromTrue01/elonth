// ---------- Dokunmatik + klavye girişi ----------
const Input = {
  move: { x: 0, y: 0 }, look: { x: 0, y: 0 }, down: {}, edge: {},
  stickId: null, lookId: null, stickO: { x: 0, y: 0 }, lookLast: { x: 0, y: 0 }, keys: {},
  init() {
    const layer = document.getElementById('touch');
    const stick = document.getElementById('stick'), knob = document.getElementById('knob');
    this.stickEl = stick; this.knobEl = knob;
    const R = () => Math.min(70, innerWidth * 0.08 + 20);
    layer.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (e.clientX < innerWidth * 0.45 && this.stickId === null) {
        this.stickId = e.pointerId; this.stickO = { x: e.clientX, y: e.clientY };
        stick.style.left = e.clientX + 'px'; stick.style.top = e.clientY + 'px'; stick.classList.add('on');
        knob.style.transform = 'translate(-50%,-50%)';
      } else if (this.lookId === null) {
        this.lookId = e.pointerId; this.lookLast = { x: e.clientX, y: e.clientY };
      }
      try { layer.setPointerCapture(e.pointerId); } catch (_) { }
    });
    layer.addEventListener('pointermove', e => {
      if (e.pointerId === this.stickId) {
        let dx = e.clientX - this.stickO.x, dy = e.clientY - this.stickO.y; const r = R();
        const l = Math.hypot(dx, dy); if (l > r) { dx *= r / l; dy *= r / l; }
        this.tmove = { x: dx / r, y: -dy / r };
        knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      } else if (e.pointerId === this.lookId) {
        this.look.x += e.clientX - this.lookLast.x; this.look.y += e.clientY - this.lookLast.y;
        this.lookLast = { x: e.clientX, y: e.clientY };
      }
    });
    const up = e => {
      if (e.pointerId === this.stickId) { this.stickId = null; this.tmove = null; stick.classList.remove('on'); }
      if (e.pointerId === this.lookId) this.lookId = null;
    };
    layer.addEventListener('pointerup', up); layer.addEventListener('pointercancel', up); layer.addEventListener('lostpointercapture', up);
    document.querySelectorAll('[data-btn]').forEach(b => {
      const n = b.dataset.btn;
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.press(n); b.classList.add('pr'); });
      const rel = e => { this.down[n] = false; b.classList.remove('pr'); };
      b.addEventListener('pointerup', rel); b.addEventListener('pointercancel', rel); b.addEventListener('pointerleave', rel);
    });
    const km = { KeyJ: 'attack', KeyK: 'dodge', ShiftLeft: 'dodge', KeyL: 'heavy', KeyE: 'interact', KeyF: 'interact' };
    addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (km[e.code] && !e.repeat) this.press(km[e.code]);
      if (e.code === 'Space' && !e.repeat) { this.press('advance'); }
      if (e.code === 'Escape' && !e.repeat) this.press('pause');
    });
    addEventListener('keyup', e => { this.keys[e.code] = false; if (km[e.code]) this.down[km[e.code]] = false; });
    addEventListener('blur', () => { this.keys = {}; this.down = {}; this.stickId = null; this.lookId = null; this.tmove = null; stick.classList.remove('on'); });
  },
  press(n) { this.down[n] = true; this.edge[n] = true; },
  take(n) { if (this.edge[n]) { this.edge[n] = false; return true; } return false; },
  clearEdges() { this.edge = {}; },
  update() {
    let x = 0, y = 0; const k = this.keys;
    if (k.KeyW || k.ArrowUp) y += 1; if (k.KeyS || k.ArrowDown) y -= 1;
    if (k.KeyA || k.ArrowLeft) x -= 1; if (k.KeyD || k.ArrowRight) x += 1;
    if (x || y) { const l = Math.hypot(x, y); x /= l; y /= l; if (!(k.ShiftRight)) { } }
    if (this.tmove) { x = this.tmove.x; y = this.tmove.y; }
    this.move.x = x; this.move.y = y;
  },
  endFrame() { this.look.x = 0; this.look.y = 0; },
  reset() { this.edge = {}; this.down = {}; this.look.x = 0; this.look.y = 0; },
};
