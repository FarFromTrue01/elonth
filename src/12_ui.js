// ---------- Arayüz ----------
const $ = s => document.querySelector(s);
const UI = {
  init() {
    this.dlg = $('#dialog'); this.dname = $('#dialog .nm'); this.dbadge = $('#dialog .badge'); this.dtext = $('#dialog .dtext');
    this.catch = $('#dlgcatch');
    this.catch.addEventListener('pointerdown', e => { e.preventDefault(); this.advance(); });
    addEventListener('keydown', e => { if ((e.code === 'Space' || e.code === 'Enter') && !this.dlg.hidden) { e.preventDefault(); this.advance(); } if ((e.code === 'Space' || e.code === 'Enter') && !$('#system').hidden) this.sysAdvance && this.sysAdvance(); });
    $('#system').addEventListener('pointerdown', e => { e.preventDefault(); this.sysAdvance && this.sysAdvance(); });
    $('#skip').addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); const b = $('#skip');
      if (b.classList.contains('arm')) { b.classList.remove('arm'); b.textContent = 'Atla ››'; clearTimeout(this.skT); Story.skip(); return; }
      b.classList.add('arm'); b.textContent = 'Atlamak için tekrar dokun'; Audio.sfx('ui', 0.4);
      clearTimeout(this.skT); this.skT = setTimeout(() => { b.classList.remove('arm'); b.textContent = 'Atla ››'; }, 2600);
    });
    $('#pausebtn').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); Game.pause(true); });
    $('#lockbtn').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); G.settings.shiftLock = !G.settings.shiftLock; this.syncLock(); Save.store(); Audio.sfx('ui'); UI.toast(G.settings.shiftLock ? 'Shift lock açık: karakter kameranın baktığı yöne döner' : 'Shift lock kapalı', 1800); });
    this.syncLock(); this.applyScale();
    this.hpbars = $('#hpbars'); this.ebars = new Map();
  },
  syncLock() { $('#lockbtn').classList.toggle('on', !!G.settings.shiftLock); },
  applyScale() { document.documentElement.style.setProperty('--ui', String(G.settings.uiScale || 1.25)); },
  show(sel, on) { const e = typeof sel === 'string' ? $(sel) : sel; e.hidden = !on; },
  hud(on) { this.show('#hud', on); },
  combat(on, opts = {}) { this.show('#bars', on); this.show('#actions', on); $('#heavylbl').textContent = opts.heavy || 'Tekme'; },
  cine(on) { $('#app').classList.toggle('cine', on); this.show('#skip', on && Story.canSkip); },
  // --- diyalog ---
  say(spk, text, o = {}) {
    return new Promise(res => {
      const d = this.dlg; d.hidden = false; this.catch.hidden = false;
      d.className = (o.thought ? 'thought' : o.narr ? 'narr' : '') + (Portrait.on ? ' hasport' : '');
      this.dname.textContent = spk ? spk.name : ''; this.dname.style.color = spk ? spk.color : '';
      if (spk && spk.rank) { this.dbadge.hidden = false; this.dbadge.textContent = spk.rank; this.dbadge.style.color = RANK_COLORS[spk.rank] || '#ccc'; } else this.dbadge.hidden = true;
      this.full = text; this.shown = 0; this.typing = true; this.res = res; this.dtext.textContent = '';
      const cps = 42 * G.settings.textSpeed;
      clearInterval(this.ti);
      if (Story.skipping) { this.finish(); return; }
      this.ti = setInterval(() => {
        this.shown += Math.max(1, Math.round(cps / 30)); this.dtext.textContent = text.slice(0, this.shown);
        if (this.shown >= text.length) this.finish();
      }, 1000 / 30);
    });
  },
  finish() { clearInterval(this.ti); this.typing = false; this.dtext.textContent = this.full; this.dlg.classList.add('done'); if (this.onTyped) this.onTyped(); if (Story.skipping) this.advance(); else if (G.auto) setTimeout(() => this.advance(), 700); },
  advance() {
    if (this.dlg.hidden) return;
    if (this.typing) { this.finish(); return; }
    this.dlg.classList.remove('done');
    const r = this.res; this.res = null; this.hideDialog(); Audio.sfx('ui', 0.5); if (r) r();
  },
  bark(spk, text, dur = 3600) {
    if (!this.catch.hidden || (this.res && !this.dlg.hidden)) return;
    const d = this.dlg; d.hidden = false; Portrait.hide(); d.className = spk === CAST.thought ? 'thought done' : 'done';
    this.dname.textContent = spk ? spk.name : ''; this.dname.style.color = spk ? spk.color : ''; this.dbadge.hidden = true; this.dtext.textContent = text;
    const a = spk && spk.actor; if (a) a.say(true);
    clearTimeout(this.bt); this.bt = setTimeout(() => { if (!this.res) d.hidden = true; if (a) a.say(false); }, dur);
  },
  hideDialog() { this.dlg.hidden = true; this.catch.hidden = true; clearInterval(this.ti); Portrait.hide(); },
  choice(opts) {
    return new Promise(res => {
      const box = $('#choices'); box.innerHTML = ''; box.hidden = false; this.catch.hidden = false; this.dlg.hidden = false; this.dlg.classList.add('done');
      if (Story.skipping || G.auto) { box.hidden = true; this.hideDialog(); res(G.auto ? (G.autoN = (G.autoN || 0) + 1) % opts.length : 0); return; }
      opts.forEach((t, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); box.hidden = true; this.hideDialog(); Audio.sfx('confirm'); res(i); }); box.appendChild(b); });
      this.catch.hidden = true;
    });
  },
  title(kicker, h, sub) {
    const t = $('#titlecard'); t.hidden = false;
    t.innerHTML = `<div class="kicker"></div><h1></h1><div class="rule"></div><div class="sub"></div>`;
    t.querySelector('.kicker').textContent = kicker; t.querySelector('h1').textContent = h; t.querySelector('.sub').textContent = sub || '';
    clearTimeout(this.tt); this.tt = setTimeout(() => t.hidden = true, 5200);
  },
  toast(text, dur = 2600) { const t = $('#toast'); t.textContent = text; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(this.tot); this.tot = setTimeout(() => t.hidden = true, dur); },
  objective(text) {
    const o = $('#objective'); if (!text) { o.hidden = true; return; }
    const changed = $('#obj-text').textContent !== text; $('#obj-text').textContent = text; o.hidden = false;
    if (changed) { o.classList.remove('pulse'); void o.offsetWidth; o.classList.add('pulse'); Audio.sfx('objective', 0.7); }
  },
  streak(n, broken) {
    const el = $('#streak'); if (!el) return;
    if (!n) { if (!el.hidden) { el.classList.add(broken ? 'broke' : 'out'); clearTimeout(this.skt); this.skt = setTimeout(() => { el.hidden = true; el.classList.remove('out', 'broke'); }, 380); } return; }
    clearTimeout(this.skt); el.hidden = false; el.classList.remove('out', 'broke');
    el.querySelector('b').textContent = n; el.querySelector('small').textContent = n >= 8 ? 'Durdurulamaz' : n >= 5 ? 'Harika' : 'Vuruş';
    el.classList.toggle('hot', n >= 5); const b = el.querySelector('b'); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
  },
  counter(text) { const c = $('#counter'); if (text === null || text === undefined) c.hidden = true; else { c.hidden = false; c.textContent = text; } },
  interact(label, solo) { const b = $('#interact'); if (!label) { b.hidden = true; return; } $('#interact-l').textContent = label; b.hidden = false; b.classList.toggle('solo', !!solo); },
  boss(name, ratio) { const b = $('#bossbar'); if (name === null) { b.hidden = true; return; } b.hidden = false; if (name) b.querySelector('.bname').textContent = name; b.querySelector('i').style.transform = `scaleX(${clamp(ratio, 0, 1)})`; b.querySelector('em').style.transform = `scaleX(${clamp(ratio, 0, 1)})`; },
  flashEdge(color) { const e = $('#edgeflash'); e.style.boxShadow = `inset 0 0 140px 40px ${color}`; e.style.transition = 'none'; e.style.opacity = 1; requestAnimationFrame(() => { e.style.transition = 'opacity .7s'; e.style.opacity = 0; }); },
  fade(to, dur = 0.8) {
    const f = $('#fade');
    if (Story.skipping) dur = Math.min(dur, 0.05);
    f.style.transition = `opacity ${dur}s ease`; f.style.opacity = to;
    return new Promise(r => setTimeout(r, dur * 1000 + 30));
  },
  // SİSTEM paneli: satırlar (html dizeleri) sırayla belirir
  system(lines, o = {}) {
    return new Promise(res => {
      const s = $('#system'), body = s.querySelector('.sys-body'); s.hidden = false; body.innerHTML = '';
      const fr = s.querySelector('.sys-frame'); fr.style.animation = 'none'; void fr.offsetWidth; fr.style.animation = '';
      if (o.glitch) fr.classList.add('glitch'); else fr.classList.remove('glitch');
      Audio.sfx(o.glitch ? 'glitch' : 'system');
      let i = 0, done = false;
      const addLine = () => { if (i >= lines.length) { done = true; return; } const d = document.createElement('div'); d.className = 'l'; d.innerHTML = lines[i++]; body.appendChild(d); if (lines[i - 1].includes('warn')) Audio.sfx('glitch', 0.5); };
      const iv = setInterval(() => { addLine(); if (done) clearInterval(iv); }, Story.skipping ? 1 : (o.speed || 260));
      this.sysAdvance = () => {
        if (!done) { clearInterval(iv); while (i < lines.length) addLine(); done = true; return; }
        this.sysAdvance = null; s.hidden = true; res();
      };
      if (Story.skipping) { setTimeout(() => { if (this.sysAdvance) { this.sysAdvance(); this.sysAdvance && this.sysAdvance(); } }, 20); }
      else if (o.auto || G.auto) setTimeout(() => { if (this.sysAdvance) { if (!done) this.sysAdvance(); this.sysAdvance && this.sysAdvance(); } }, (o.auto || 2.5) * 1000);
    });
  },
  // --- her kare güncelleme ---
  frame(dt) {
    const P = G.player;
    if (P && !$('#bars').hidden) {
      $('#bars .hp i').style.width = (P.hp / P.maxHp * 100) + '%'; $('#bars .hp em').style.width = (P.hp / P.maxHp * 100) + '%';
      $('#bars .st i').style.width = (P.stamina / P.staminaMax * 100) + '%';
    }
    // işaretçi
    const m = $('#marker');
    const tgt = Story.markerTarget;
    if (tgt && P && !G.inCine && !$('#hud').hidden) {
      const tp = tgt.isVector3 ? tgt : tgt.pos; const v = V3(tp.x, (tp.y || 0) + 2.2, tp.z);
      const d = distXZ(P.pos, tp);
      if (d < 3) m.hidden = true; else {
        m.hidden = false; v.project(G.camera);
        let x = v.x, y = v.y; const behind = v.z > 1; if (behind) { x = -x; y = -y; }
        const off = Math.abs(x) > 0.88 || Math.abs(y) > 0.82 || behind;
        if (off) { const k = Math.max(Math.abs(x) / 0.88, Math.abs(y) / 0.82); x /= k; y /= k; if (behind && Math.abs(y) < 0.82) y = -0.82; }
        const sx = (x * 0.5 + 0.5) * innerWidth, sy = (-y * 0.5 + 0.5) * innerHeight;
        const ang = off ? Math.atan2(x, y) : Math.PI;
        m.style.transform = `translate(${sx}px, ${sy}px)`; m.querySelector('.arrow').style.transform = `rotate(${off ? ang : Math.PI}rad)`;
        $('#marker-d').textContent = Math.round(d) + ' m';
      }
    } else m.hidden = true;
    // düşman can çubukları
    const seen = new Set();
    for (const e of G.enemies) {
      if (!e.hpBar || !e.active || e.removed || (!e.alive && !e.corpse)) continue; if (!e.alive) continue;
      seen.add(e);
      let el = this.ebars.get(e); if (!el) { el = document.createElement('div'); el.className = 'ebar'; el.innerHTML = '<i></i>'; this.hpbars.appendChild(el); this.ebars.set(e, el); }
      const v = V3(e.pos.x, e.pos.y + 2.05 * e.scale, e.pos.z).project(G.camera);
      if (v.z > 1) { el.style.display = 'none'; continue; } el.style.display = '';
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * innerWidth - 32}px, ${(-v.y * 0.5 + 0.5) * innerHeight}px)`;
      el.firstChild.style.transform = `scaleX(${e.hp / e.maxHp})`;
    }
    for (const [e, el] of this.ebars) if (!seen.has(e)) { el.remove(); this.ebars.delete(e); }
  },
  clearBars() { for (const [, el] of this.ebars) el.remove(); this.ebars.clear(); },
};
const RANK_COLORS = { G: '#9a9a9a', F: '#a8b0a0', E: '#7ec87a', D: '#6ab0e8', C: '#c88ae8', B: '#e8b04a', A: '#ff7a5a', S: '#ffd84a', SS: '#ff4ad8' };
