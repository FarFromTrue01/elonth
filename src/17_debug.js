// ---------- Test sahneleri (menüde görünmez) ----------
Story.def('lineup', { chapter: 'Debug', title: 'Lineup', debug: true }, async S => {
  const L = await S.level(() => buildVillage({}), 'day');
  const looks = [LOOK.joseph(18), LOOK.nora(18), LOOK.leo(18), LOOK.clara(18), LOOK.lily(12), LOOK.marta(), LOOK.daniel(), LOOK.selen(), LOOK.victor(18), LOOK.isolde(), LOOK.seraphine(), LOOK.rowena()];
  const acts = looks.map((lk, i) => { const a = npc(lk, -5.5 + i * 1.0, 3, 0, { watch: false }); return a; });
  window.__acts = acts;
  S.cine(true);
  await S.shot(V3(0.0, 1.5, 7.2), V3(0, 1.1, 3), 0);
  await S.fadeIn(0.2);
  await S.wait(9999);
});
Story.def('closeup', { chapter: 'Debug', title: 'Closeup', debug: true }, async S => {
  const L = await S.level(() => buildVillage({}), 'day');
  const looks = (location.hash.includes('b') ? [LOOK.clara(18), LOOK.lily(12), LOOK.isolde(), LOOK.seraphine(), LOOK.marta(), LOOK.daniel()] : [LOOK.joseph(18), LOOK.nora(18), LOOK.clara(18), LOOK.leo(18)]);
  const acts = looks.map((lk, i) => npc(lk, -0.5 * (looks.length - 1) * 0.8 + i * 0.8, 3, i % 2 ? 0.4 : -0.4, { watch: false }));
  window.__acts = acts;
  S.cine(true);
  await S.shot(V3(0, 1.62, 5.0), V3(0, 1.5, 3), 0);
  await S.fadeIn(0.2);
  await S.wait(9999);
});
