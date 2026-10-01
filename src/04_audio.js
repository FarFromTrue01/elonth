// ---------- Ses: sentezlenmiş efektler, ortam ve müzik ----------
const Audio = {
  ctx: null, on: false, track: 'none', amb: {},
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
    this.master.connect(comp); comp.connect(c.destination);
    this.sfxG = c.createGain(); this.musG = c.createGain(); this.ambG = c.createGain();
    this.sfxG.connect(this.master); this.musG.connect(this.master); this.ambG.connect(this.master);
    this.rev = c.createConvolver(); this.rev.buffer = this.impulse(2.8, 2.2);
    this.revG = c.createGain(); this.revG.gain.value = 0.35; this.rev.connect(this.revG); this.revG.connect(this.master);
    this.noise = this.noiseBuf(2);
    this.applyVolumes();
    this.on = true;
    this.sched = setInterval(() => this.tick(), 90);
  },
  resume() { if (this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => { }); },
  applyVolumes() { if (!this.ctx) return; this.sfxG.gain.value = G.settings.sfx; this.musG.gain.value = G.settings.music * 0.55; this.ambG.gain.value = G.settings.sfx * 0.6; },
  impulse(sec, decay) { const c = this.ctx, n = c.sampleRate * sec, b = c.createBuffer(2, n, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); } return b; },
  noiseBuf(sec) { const c = this.ctx, n = c.sampleRate * sec, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; },
  env(g, t, a, peak, d, sus = 0.0001) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a); g.gain.exponentialRampToValueAtTime(sus, t + a + d); },
  osc(type, f, t, dur, vol, dest, opts = {}) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
    if (opts.detune) o.detune.value = opts.detune;
    this.env(g, t, opts.a || 0.005, vol, dur);
    let node = o; if (opts.lp) { const f2 = c.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = opts.lp; o.connect(f2); node = f2; }
    node.connect(g); g.connect(dest || this.sfxG); if (opts.rev) g.connect(this.rev);
    o.start(t); o.stop(t + (opts.a || 0.005) + dur + 0.05);
    return o;
  },
  nz(t, dur, vol, type, freq, q = 1, dest, opts = {}) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (opts.to) f.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
    const g = c.createGain(); this.env(g, t, opts.a || 0.003, vol, dur);
    s.connect(f); f.connect(g); g.connect(dest || this.sfxG); if (opts.rev) g.connect(this.rev);
    s.start(t, Math.random()); s.stop(t + dur + 0.1);
  },
  sfx(name, v = 1) {
    if (!this.on) return; const t = this.ctx.currentTime;
    switch (name) {
      case 'whoosh': this.nz(t, 0.16, 0.25 * v, 'bandpass', 900, 1.2, null, { to: 2600 }); break;
      case 'dodge': this.nz(t, 0.25, 0.3 * v, 'bandpass', 500, 0.9, null, { to: 1400 }); break;
      case 'hit': this.osc('sine', 150, t, 0.12, 0.7 * v, null, { to: 55 }); this.nz(t, 0.08, 0.5 * v, 'lowpass', 2200); break;
      case 'hitHeavy': this.osc('sine', 120, t, 0.22, 0.9 * v, null, { to: 40 }); this.nz(t, 0.14, 0.6 * v, 'lowpass', 1600); this.nz(t, 0.05, 0.3 * v, 'highpass', 3000); break;
      case 'wood': this.osc('triangle', 520, t, 0.07, 0.4 * v, null, { to: 300 }); this.nz(t, 0.05, 0.35 * v, 'bandpass', 1800, 3); break;
      case 'hurt': this.osc('sine', 90, t, 0.25, 0.8 * v, null, { to: 40 }); this.nz(t, 0.2, 0.35 * v, 'lowpass', 700); break;
      case 'boar': this.osc('sawtooth', 110, t, 0.5, 0.25 * v, null, { to: 70, lp: 500, a: 0.05 }); this.nz(t, 0.45, 0.2 * v, 'bandpass', 350, 2); break;
      case 'charge': this.nz(t, 1.2, 0.35 * v, 'lowpass', 200, 1, null, { to: 500, a: 0.3 }); break;
      case 'ui': this.osc('triangle', 880, t, 0.06, 0.15 * v); break;
      case 'confirm': this.osc('triangle', 660, t, 0.1, 0.18 * v); this.osc('triangle', 990, t + 0.07, 0.15, 0.15 * v); break;
      case 'objective': [523, 659, 784].forEach((f, i) => this.osc('sine', f, t + i * 0.09, 0.6, 0.12 * v, null, { rev: 1 })); break;
      case 'coin': this.osc('sine', 1568, t, 0.25, 0.12 * v, null, { rev: 1 }); this.osc('sine', 2093, t + 0.08, 0.35, 0.1 * v, null, { rev: 1 }); break;
      case 'system': [1318, 1760, 2637].forEach((f, i) => { this.osc('sine', f, t + i * 0.06, 1.2, 0.09 * v, null, { rev: 1 }); this.osc('sine', f * 2.01, t + i * 0.06, 0.5, 0.03 * v, null, { rev: 1 }); }); this.osc('sine', 55, t, 1.5, 0.3 * v, null, { a: 0.1 }); break;
      case 'glitch': for (let i = 0; i < 6; i++) this.osc('square', 200 + Math.random() * 1800, t + i * 0.03, 0.03, 0.06 * v); break;
      case 'heart': this.osc('sine', 60, t, 0.14, 0.9 * v, null, { to: 38 }); this.osc('sine', 55, t + 0.2, 0.18, 0.7 * v, null, { to: 35 }); break;
      case 'crash': this.nz(t, 1.6, 1.0 * v, 'lowpass', 3000, 0.7, null, { to: 300 }); this.osc('sine', 80, t, 1.2, 1 * v, null, { to: 25 }); this.nz(t + 0.05, 0.6, 0.6 * v, 'highpass', 4000, 1, null, { rev: 1 }); break;
      case 'thunder': this.nz(t, 3.2, 0.7 * v, 'lowpass', 400, 0.6, null, { to: 80, a: 0.05, rev: 1 }); break;
      case 'skid': this.nz(t, 1.0, 0.4 * v, 'bandpass', 2500, 6, null, { to: 1700 }); break;
      case 'horn': this.osc('sawtooth', 220, t, 1.0, 0.25 * v, null, { lp: 1200, a: 0.02 }); this.osc('sawtooth', 277, t, 1.0, 0.2 * v, null, { lp: 1200, a: 0.02 }); break;
      case 'stone': [392, 587, 784, 1175].forEach((f, i) => this.osc('sine', f, t + i * 0.25, 2.5, 0.1 * v, null, { a: 0.4, rev: 1 })); break;
      case 'collapse': this.osc('sine', 70, t, 2.2, 0.9 * v, null, { to: 20, a: 0.02 }); this.nz(t, 1.2, 0.3 * v, 'lowpass', 300, 1, null, { rev: 1 }); break;
      case 'laugh': for (let i = 0; i < 5; i++) this.osc('sawtooth', 210 - i * 6, t + i * 0.13, 0.09, 0.08 * v, null, { lp: 1400 }); break;
      case 'gasp': this.nz(t, 0.5, 0.2 * v, 'bandpass', 1200, 1, null, { a: 0.1 }); break;
      case 'crowd': this.nz(t, 1.6, 0.3 * v, 'bandpass', 600, 0.8, null, { a: 0.3 }); break;
      case 'perfect': [880, 1320, 1760].forEach((f, i) => this.osc('sine', f, t + i * 0.04, 0.6, 0.12 * v, null, { rev: 1 })); this.nz(t, 0.4, 0.2 * v, 'highpass', 5000, 1, null, { to: 9000 }); break;
      case 'step': this.nz(t, 0.05, 0.06 * v, 'lowpass', 600); break;
      case 'door': this.osc('sawtooth', 90, t, 0.4, 0.1 * v, null, { to: 70, lp: 400 }); this.nz(t, 0.3, 0.12 * v, 'bandpass', 400, 3); break;
      case 'splash': this.nz(t, 0.4, 0.3 * v, 'bandpass', 1200, 1, null, { to: 400 }); break;
      case 'checkpoint': this.osc('triangle', 784, t, 0.15, 0.15 * v); this.osc('triangle', 1175, t + 0.08, 0.3, 0.15 * v, null, { rev: 1 }); break;
      case 'fail': this.osc('triangle', 330, t, 0.3, 0.15 * v); this.osc('triangle', 247, t + 0.15, 0.5, 0.15 * v); break;
      case 'horse': for (let i = 0; i < 4; i++) this.nz(t + i * 0.12, 0.05, 0.12 * v, 'bandpass', 500, 2); break;
    }
  },
  // --- ortam sesleri ---
  ambience(name, on = true) {
    if (!this.on) return;
    if (!on) { const a = this.amb[name]; if (a) { a.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5); setTimeout(() => { try { a.s.stop(); } catch (_) { } }, 2500); delete this.amb[name]; } return; }
    if (this.amb[name]) return;
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = c.createBiquadFilter(), g = c.createGain(); g.gain.value = 0;
    const cfg = { rain: ['lowpass', 2400, 0.4, 0.5], wind: ['lowpass', 380, 0.8, 0.35], crowd: ['bandpass', 520, 0.9, 0.22], fire: ['bandpass', 2600, 0.5, 0.05], interior: ['lowpass', 180, 0.5, 0.12] }[name];
    if (!cfg) return;
    f.type = cfg[0]; f.frequency.value = cfg[1]; f.Q.value = cfg[2];
    s.connect(f); f.connect(g); g.connect(this.ambG); s.start();
    if (name === 'wind' || name === 'crowd') { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = name === 'wind' ? 0.13 : 1.7; lg.gain.value = cfg[3] * 0.5; l.connect(lg); lg.connect(g.gain); l.start(); }
    g.gain.setTargetAtTime(cfg[3], c.currentTime, 0.8);
    this.amb[name] = { s, g };
  },
  stopAmbience() { Object.keys(this.amb).forEach(k => this.ambience(k, false)); },
  // --- müzik ---
  play(track) { if (this.track === track) return; this.track = track; this.step = 0; this.nextT = this.ctx ? this.ctx.currentTime + 0.3 : 0; },
  tick() {
    if (!this.on || this.ctx.state !== 'running') return;
    const tr = TRACKS[this.track]; if (!tr) return;
    const c = this.ctx; const spb = 60 / tr.bpm / 2; // sekizlik
    while (this.nextT < c.currentTime + 0.25) { tr.play(this, this.step, this.nextT, spb); this.step++; this.nextT += spb; }
  },
  pluck(m, t, vol = 0.12, dur = 0.9) { const f = 440 * Math.pow(2, (m - 69) / 12); this.osc('triangle', f, t, dur, vol, this.musG, { lp: 2400, rev: 1 }); this.osc('sine', f * 2, t, dur * 0.4, vol * 0.25, this.musG); },
  pad(ms, t, dur, vol = 0.05, lp = 900) { ms.forEach(m => { const f = 440 * Math.pow(2, (m - 69) / 12); [-7, 7].forEach(d => this.osc('sawtooth', f, t, dur, vol, this.musG, { a: dur * 0.35, lp, detune: d, rev: 1 })); }); },
  bass(m, t, dur, vol = 0.18) { const f = 440 * Math.pow(2, (m - 69) / 12); this.osc('triangle', f, t, dur, vol, this.musG, { lp: 600 }); },
  bell(m, t, vol = 0.06) { const f = 440 * Math.pow(2, (m - 69) / 12); this.osc('sine', f, t, 1.8, vol, this.musG, { rev: 1 }); this.osc('sine', f * 2.76, t, 0.6, vol * 0.3, this.musG, { rev: 1 }); },
  kick(t, v = 0.5) { this.osc('sine', 130, t, 0.18, v, this.musG, { to: 40 }); },
  snare(t, v = 0.22) { const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1500; const g = c.createGain(); this.env(g, t, 0.002, v, 0.12); s.connect(f); f.connect(g); g.connect(this.musG); s.start(t, Math.random()); s.stop(t + 0.2); },
  hat(t, v = 0.05) { const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = c.createGain(); this.env(g, t, 0.001, v, 0.04); s.connect(f); f.connect(g); g.connect(this.musG); s.start(t, Math.random()); s.stop(t + 0.08); },
};
// Akorlar MIDI olarak (D minör / dorian dünyası)
const CH = { Dm: [50, 57, 62, 65], Bb: [46, 53, 58, 62], F: [41, 53, 57, 60], C: [48, 55, 60, 64], G: [43, 55, 59, 62], Am: [45, 57, 60, 64], A: [45, 57, 61, 64], D: [50, 57, 62, 66], Gm: [43, 55, 58, 62], Em: [40, 55, 59, 64], Eb: [39, 51, 55, 58] };
const TRACKS = {
  title: { bpm: 66, prog: ['Dm', 'Bb', 'F', 'C'], play(a, s, t, spb) { const bar = Math.floor(s / 8), ch = CH[this.prog[bar % 4]], i = s % 8; if (i === 0) a.pad(ch.slice(1), t, spb * 8.5, 0.035); const arp = [0, 1, 2, 3, 2, 1, 2, 3]; if (i % 1 === 0) a.pluck(ch[arp[i]] + 12, t, 0.07, 1.4); if (i === 0) a.bass(ch[0] - 12, t, spb * 7); } },
  village: { bpm: 96, prog: ['Dm', 'C', 'G', 'Dm', 'Dm', 'C', 'Bb', 'C'], mel: [74, 0, 72, 74, 76, 0, 74, 72, 69, 0, 0, 72, 74, 0, 0, 0], play(a, s, t, spb) { const bar = Math.floor(s / 8), ch = CH[this.prog[bar % 8]], i = s % 8; if (i === 0) { a.pad(ch.slice(1), t, spb * 8, 0.022, 700); a.bass(ch[0] - 12, t, spb * 3); } if (i === 4) a.bass(ch[0] - 5, t, spb * 3); if (i % 2 === 1) a.pluck(ch[1 + (i >> 1) % 3] + 12, t, 0.05, 0.5); if (bar % 4 >= 2) { const m = this.mel[(s % 16)]; if (m) a.pluck(m, t, 0.07, 0.8); } } },
  sad: { bpm: 58, prog: ['Am', 'F', 'C', 'G'], play(a, s, t, spb) { const bar = Math.floor(s / 8), ch = CH[this.prog[bar % 4]], i = s % 8; if (i === 0) { a.pad(ch.slice(1), t, spb * 8, 0.025, 600); a.bass(ch[0] - 12, t, spb * 8, 0.12); } if (i === 0 || i === 3 || i === 6) a.pluck(ch[(i / 3 | 0) + 1] + 12, t, 0.07, 1.8); } },
  tension: { bpm: 70, play(a, s, t, spb) { const i = s % 16; if (i === 0) { a.pad([38, 45, 51], t, spb * 16, 0.03, 500); } if (i % 4 === 0) a.bass(26, t, spb * 1.5, 0.22); if (i === 10) a.bell(75, t, 0.025); } },
  battle: { bpm: 136, prog: ['Dm', 'Dm', 'Bb', 'C'], riff: [62, 62, 65, 62, 67, 62, 65, 64], play(a, s, t, spb) { const bar = Math.floor(s / 8), ch = CH[this.prog[bar % 4]], i = s % 8; if (i === 0 || i === 3 || i === 4) a.kick(t); if (i === 2 || i === 6) a.snare(t); a.hat(t, i % 2 ? 0.03 : 0.05); a.bass(ch[0] - 12, t, spb * 0.9, 0.2); if (i === 0) a.pad(ch.slice(1), t, spb * 8, 0.02, 1400); if (bar % 2 === 1) a.pluck(this.riff[i] + (ch === CH.Bb ? -1 : 0), t, 0.06, 0.25); } },
  hall: { bpm: 54, prog: ['D', 'G', 'Bb', 'A'], play(a, s, t, spb) { const bar = Math.floor(s / 8), ch = CH[this.prog[bar % 4]], i = s % 8; if (i === 0) { a.pad(ch, t, spb * 8.4, 0.03, 1100); a.bass(ch[0] - 12, t, spb * 8, 0.14); } if (i === 4 && bar % 2) a.bell(ch[2] + 12, t, 0.03); } },
  system: { bpm: 60, play(a, s, t, spb) { const i = s % 16; if (i === 0) { a.pad([38, 50, 57], t, spb * 16, 0.025, 400); } if (i % 4 === 2) a.bell([86, 81, 88, 84][(s >> 2) % 4], t, 0.025); } },
  joy: { bpm: 104, prog: ['D', 'G', 'D', 'A'], play(a, s, t, spb) { const bar = Math.floor(s / 8), ch = CH[this.prog[bar % 4]], i = s % 8; if (i === 0) { a.bass(ch[0] - 12, t, spb * 4); a.pad(ch.slice(1), t, spb * 8, 0.02); } a.pluck(ch[[1, 2, 3, 2][i % 4]] + 12, t, 0.05, 0.4); } },
  none: { bpm: 60, play() { } },
};
