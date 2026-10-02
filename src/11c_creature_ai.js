// ---------- Yaratık saldırıları ve üretici ----------
Object.assign(AI_ATK, {
  bite: { anim: 'bite', windup: 0.42, dur: 0.36, hit: 0.12, range: 0.95, arc: 1.7, dmg: 4, knock: 1.4 },
  leap: { anim: 'leap', windup: 0.7, dur: 0.5, hit: 0.2, range: 1.7, arc: 1.2, dmg: 7, knock: 3.5, heavy: false },
  swipe: { anim: 'swipe', windup: 0.85, dur: 0.5, hit: 0.2, range: 2.6, arc: 2.0, dmg: 14, knock: 6, heavy: true },
  slam: { anim: 'leap', windup: 1.1, dur: 0.6, hit: 0.28, range: 2.9, arc: 6.2, dmg: 18, knock: 8, heavy: true },
});
function creature(kind, x, z, f, o = {}) {
  const model = new CreatureModel(kind, o.model || {});
  const e = new Fighter(Object.assign({ model, radius: kind === 'king' ? 1.0 : kind === 'spider' ? 0.4 : 0.32, walkSpeed: 2 }, o));
  e.place(x, z, f); e.creature = kind; return e;
}
