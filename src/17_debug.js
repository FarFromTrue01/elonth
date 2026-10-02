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
  const cm = location.hash.match(/c=([\w,]+)/);
  const looks = cm ? cm[1].split(',').map(k => { const [n, ag] = k.split('_'); return ag ? LOOK[n](+ag) : LOOK[n](); }) : (location.hash.includes('b') ? [LOOK.clara(18), LOOK.lily(12), LOOK.isolde(), LOOK.seraphine(), LOOK.marta(), LOOK.daniel()] : [LOOK.joseph(18), LOOK.nora(18), LOOK.clara(18), LOOK.leo(18)]);
  const acts = looks.map((lk, i) => npc(lk, -0.5 * (looks.length - 1) * 0.8 + i * 0.8, 3, i % 2 ? 0.4 : -0.4, { watch: false }));
  window.__acts = acts;
  S.cine(true);
  await S.shot(V3(0, 1.62, 5.0), V3(0, 1.5, 3), 0);
  await S.fadeIn(0.2);
  await S.wait(9999);
});
Story.def('horsetest', { chapter: 'Debug', title: 'Horse', debug: true }, async S => {
  const L = await S.level(() => buildVillage({}), 'day');
  const h = spawnRider(LOOK.knight()); h.place(-3, 6, 0.9); window.__h = h;
  const h2 = new Actor({ model: new HorseModel('#8a5a3a'), radius: 0.8, solid: false }); h2.place(0.5, 4, -0.6); h2.collides = false;
  S.cine(true);
  await S.shot(V3(1.5, 2.0, 10.5), V3(-1.2, 1.2, 5), 0);
  await S.fadeIn(0.2);
  await S.wait(9999);
});
Story.def('hilltest', { chapter: 'Debug', title: 'Hill', debug: true }, async S => {
  const L = await S.level(() => buildVillage({}), 'morning');
  const J = V3(-32.0, 0, -41.0), LP = V3(-31.1, 0, -40.8);
  const p = spawnJoseph(10, J.x, J.z, 0);
  const lily = S.cast('lily', npc(LOOK.lily(10), LP.x, LP.z, Math.PI * 0.95, { watch: false }));
  lily.model.setStance('sitSlope'); p.model.setStance('sitSlope'); p.faceNow(V3(-25, 0, -90));
  window.__hy = L.h(J.x, J.z); window.__J = J;
  S.cine(true); await S.fadeIn(0.1);
  await S.wait(9999);
});
Story.def('porttest', { chapter: 'Debug', title: 'Portrait', debug: true }, async S => {
  const L = await S.level(() => buildVillage({}), 'day');
  const p = spawnJoseph(15, 0, 3, 0);
  const nora = S.cast('nora', npc(LOOK.nora(15), 1.2, 4.2, Math.PI, { watch: false }));
  const clara = S.cast('clara', npc(LOOK.clara(15), -1.2, 4.4, Math.PI, { watch: false }));
  S.cine(true);
  await S.shot(V3(0, 1.6, 8), V3(0, 1.1, 3.5), 0);
  await S.fadeIn(0.2);
  const who = (location.hash.match(/who=(\w+)/) || [])[1] || 'nora';
  if (who === 'think') await S.think('Bu bir düşünce satırıdır, portre soluk görünmeli.');
  else await S.say(who, 'Portre testi: bu satırı okurken solda konuşanın canlı büstü görünmeli.');
  await S.wait(9999);
});
Story.def('maptest', { chapter: 'Debug', title: 'Map', debug: true }, async S => {
  const m = location.hash.match(/map=(\w+)/); const which = m ? m[1] : 'village';
  const L = await S.level(() => which === 'eros' ? buildEros({}) : which === 'harvest' ? buildVillage({ harvested: (x, z) => x > -15 }) : which === 'hall' ? buildHall() : which === 'hut' ? buildHut('day') : buildVillage({}), which === 'hall' ? 'hall' : which === 'hut' ? 'interior' : 'day', which === 'hall' ? { noSky: true, sunDir: [0.6, 0.7, 0.2] } : which === 'hut' ? { noSky: true, sunDir: [0.25, 0.55, -0.8] } : {});
  window.__L = L;
  S.cine(true); await S.fadeIn(0.1);
  await S.wait(9999);
});
