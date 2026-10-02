// ======================= BÖLÜM 1: TABAN =======================
function fighter(look, x, z, f, o = {}) { const e = new Fighter(Object.assign({ look }, o)); e.place(x, z, f); return e; }
function ally(look, x, z, f, o = {}) { const a = new Ally(Object.assign({ look }, o)); a.place(x, z, f); return a; }
function combatOn(S, p, o = {}) { G.combat = true; p.canFight = true; UI.combat(true, o); p.model.setStance(o.stance || 'fight'); Cam.dist = 6.0; }
function combatOff(p) { G.combat = false; if (p) { p.canFight = false; p.model.setStance(null); } UI.combat(false); UI.boss(null); Cam.dist = Cam.distBase; G.attackers.clear(); if (G.level) G.level.arena = null; }
async function retryPrompt(S, text) {
  S.cine(true); Screen.set({ gray: 0.8, blur: 2 });
  await S.narr(text);
  const c = await S.choice(['Tekrar dene', 'Ana menü']);
  Screen.reset();
  if (c === 1) { Game.toMenu(); throw ABORT; }
}
function checkpointMesh(L, v) {
  const g = new T.Group(); const y = L.h(v.x, v.z);
  const ring = new T.Mesh(new T.TorusGeometry(1.1, 0.07, 6, 24), new T.MeshBasicMaterial({ color: '#ffd27a', fog: false }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.08; g.add(ring);
  const col = new T.Mesh(new T.CylinderGeometry(0.9, 1.1, 6, 16, 1, true), new T.MeshBasicMaterial({ color: '#ffcf70', transparent: true, opacity: 0.18, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, fog: false }));
  col.position.y = 3; g.add(col);
  g.position.set(v.x, y, v.z); L.add(g); L.anims.push(dt => { ring.rotation.z += dt; col.material.opacity = 0.14 + Math.sin(G.t * 4) * 0.05; });
  return g;
}

Story.def('c1_alley', { chapter: 'Bölüm 1 · Taban', title: 'Arka Sokak', sub: '10 yaş · İlk kavga', kind: 'Savaş' }, async S => {
  const L = await S.level(() => buildVillage({}), 'day');
  S.amb('wind'); S.music('village');
  const p = spawnJoseph(10, 7.0, 12.5, 0.9); p.model.setWeapon('bread');
  const victor = S.cast('victor', fighter(LOOK.victor(10), 19.6, 16.6, -1.6, { hp: 70, name: 'Victor', ai: { moves: ['jab', 'push'], heavyMove: 'hook', heavyChance: 0.3, aggr: 0.8, speed: 2.4, windMul: 1.05, cooldown: [1.6, 2.6] } }));
  const bram = S.cast('bram', fighter(LOOK.bram(10), 18.5, 15.4, -1.5, { hp: 42, name: 'Bram', ai: { moves: ['jab', 'push'], heavyMove: 'hook', heavyChance: 0.15, aggr: 0.9, speed: 2.3, windMul: 1.15, cooldown: [1.5, 2.6] } }));
  const osric = S.cast('osric', fighter(LOOK.osric(10), 19.0, 14.2, -1.7, { hp: 36, name: 'Osric', ai: { moves: ['jab', 'cross'], heavyMove: 'kick', heavyChance: 0.15, aggr: 1.0, speed: 2.7, windMul: 1.1, cooldown: [1.3, 2.4] } }));
  victor.model.setStance('crossArms');
  for (let i = 0; i < 3; i++) { const w = new Wanderer({ look: randomVillager(i === 1) }); w.place(-4 + i * 3, -2 + i, 0); w.home = V3(-2 + i * 2, 0, -2); w.homeR = 4; }
  S.cine(true);
  await S.shot(V3(10.6, 1.9, 12.6), V3(12.4, 1.0, 15.2), 0);
  await S.fadeIn(1);
  UI.title('Birkaç hafta sonra', 'Arka Sokak', '');
  S.walk(p, [V3(10.4, 0, 15.6), V3(14.6, 0, 15.6)], 1.6);
  await S.shot(V3(10.5, 1.8, 13.2), V3(14.6, 0.9, 15.6), 3.5);
  await S.think('Annemin ekmeği. Fırındaki kadın bana iki gün önce bakmazdı bile. Bugün "komadan dönen çocuk" diye fazladan bir dilim verdi.');
  await S.until(() => !p.path);
  victor.lookAt(p.root); bram.lookAt(p.root); osric.lookAt(p.root); p.faceTo(victor);
  await S.shot(V3(13.4, 1.2, 14.0), V3(19.2, 1.0, 16.0), 0.8);
  await S.say('victor', 'Bakın kim gelmiş. Mezardan dönen köylü.');
  await S.say('bram', 'Duydun mu Victor? Diyorlar ki içine iblis girmiş. Artık başka türlü konuşuyormuş.');
  await S.say('victor', 'İblis mi? Bu sefil sokakta iblis bile yaşamaz.');
  await S.walk(victor, [V3(15.45, 0, 15.75)], 2.2); victor.faceTo(p);
  victor.model.play('push'); await S.wait(0.28); p.model.setWeapon(null); p.model.play('hit'); S.sfx('hit', 0.6);
  const bread = new T.Group(); bread.castShadow = false;
  const bm = (c, sx, sy, sz, x, y, z) => { const m = new T.Mesh(prim('sphS'), TOON.mat(c, { gradientMap: TOON.gradSoft })); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = true; bread.add(m); };
  bm('#d6c9a6', 0.3, 0.2, 0.34, 0, 0.09, 0); bm('#c8955a', 0.16, 0.12, 0.36, 0.02, 0.14, 0.08); bm('#b4a47a', 0.08, 0.08, 0.08, 0, 0.2, -0.08);
  bread.position.set(14.95, L.h(15, 15.4) + 0.02, 15.4); bread.rotation.y = 0.7; L.add(bread);
  const bd = (bread.userData = {}); bread.scale.setScalar(1.25);
  await S.say('victor', 'Torbada ne var? Ekmek mi? Benim köpeklerim bile bunu yemez.');
  await S.shot(V3(13.9, 1.2, 14.3), V3(15.0, 0.25, 15.4), 0.7);
  await S.wait(0.6);
  await S.say('joseph', 'O ekmek annemin üç günlük emeği. Yerden kaldır.');
  victor.model.play('laugh'); S.sfx('laugh');
  await S.say('victor', 'Kaldır mı? Sen bana emir mi veriyorsun, köylü?');
  await S.think('On yaşında bir çocuğun bedenindeyim. Kas yok, nefes yok. Ama kavgayı bilen bir aklım var.');
  await S.think('Önce kaçın. Sonra vur. Asla üçüyle birden dövüşme.');
  await S.say('victor', 'Bram. Osric. Şu köylüye haddini bildirin.');
  victor.walkTo([V3(20.4, 0, 17.4)], 1.4);
  // ---- dövüş 1
  L.arena = { x: 16.6, z: 15.4, r: 5.2 };
  S.cine(false); S.music('battle'); combatOn(S, p); p.noDeath = true; Cam.yaw = p.facing + Math.PI;
  bram.activate(); osric.activate();
  S.objective('Kendini savun');
  S.tip('SALDIR: art arda üç kez dokun, kombo yap', 5000);
  const t0 = G.t; let tipped = false;
  await S.until(() => { if (!tipped && G.t - t0 > 6) { tipped = true; S.tip('KAÇ: yerde turuncu halka belirince yuvarlan. Tam zamanında kaçarsan zaman yavaşlar.', 6500); } return !bram.alive || !osric.alive || p.hp < 45 || G.t - t0 > 28 || p.downs > 0; });
  // ---- Nora
  for (const e of [bram, osric, victor]) { e.active = false; e.vel.set(0, 0, 0); e.removeRing && e.removeRing(); }
  S.cine(true); G.combat = false; p.model.setStance(null);
  const nora = S.cast('nora', ally(LOOK.nora(10), 10.2, 17.6, 1.6, { name: 'Nora', dmg: 8 }));
  await S.shot(V3(p.pos.x + 2.5, 1.4, p.pos.z - 1.0), V3(10.2, 1.0, 17.6), 0);
  await S.say('nora', 'Hey! Üçe bir mi? Ne kadar da cesursunuz!');
  S.walk(nora, [V3(p.pos.x - 0.8, 0, p.pos.z - 0.6)], 4.5);
  await S.shot(V3(p.pos.x - 3, 1.6, p.pos.z - 3), V3(p.pos.x, 0.8, p.pos.z), 1.2);
  await S.until(() => !nora.path);
  nora.model.play('kick'); S.sfx('whoosh'); await S.wait(0.3);
  const near = [bram, osric].filter(e => e.alive).sort((a, b) => a.dist(nora) - b.dist(nora))[0];
  if (near) { near.takeHit(6, nora, { knock: 5, heavy: true }); }
  nora.faceTo(victor);
  await S.say('nora', 'Adım Nora. Ve senin babanın parası bu sokakta geçmez, Victor.');
  await S.say('victor', 'Bir köylü kız mı? Hah! İkinizi de çamura gömeceğim.');
  victor.model.setStance('fight');
  // ---- dövüş 2
  S.cine(false); combatOn(S, p); nora.activate(); victor.activate(); for (const e of [bram, osric]) if (e.alive) e.activate();
  for (const e of [bram, osric, victor]) if (e.alive) e.ai.maxTokens = 2;
  S.objective('Nora ile birlikte dövüş');
  const t1 = G.t; let leo = null;
  await S.until(() => {
    if (!leo && (G.t - t1 > 10 || [bram, osric].filter(e => !e.alive).length >= 1 && G.t - t1 > 5)) {
      leo = S.cast('leo', ally(LOOK.leo(10), 9.6, 16.4, 1.4, { name: 'Leo', dmg: 5, atkAnim: ['jab', 'cross'] }));
      leo.activate(); UI.bark(CAST.leo, 'Nora! Bekle beni! Ben de geliyorum!'); setTimeout(() => { if (leo && !leo.removed) { leo.model.play('knock'); } }, 1600);
    }
    const out = [bram, osric].filter(e => !e.alive).length;
    return victor.hp < victor.maxHp * 0.45 || (out >= 2 && victor.hp < victor.maxHp * 0.8) || G.t - t1 > 45 || !victor.alive;
  });
  UI.hideDialog();
  // ---- kaçış
  for (const e of [bram, osric, victor]) { e.active = false; e.removeRing && e.removeRing(); e.vel.set(0, 0, 0); }
  combatOff(p); if (nora) { nora.active = false; nora.vel.set(0, 0, 0); } if (leo) { leo.active = false; leo.vel.set(0, 0, 0); }
  S.cine(true); S.music('village');
  victor.alive = true; victor.untargetable = true; victor.model.setStance(null);
  // sahneyi sabit, açık bir düzene yeniden diz
  await S.fadeOut(0.35);
  p.place(14.6, 15.0, Math.PI / 2); p.model.setStance(null);
  nora.place(15.5, 14.2, -0.6); victor.place(19.0, 16.4, -1.6); bram.place(19.6, 15.2, -1.7); osric.place(18.8, 17.6, -1.5);
  for (const e of [bram, osric]) { e.alive = true; e.untargetable = true; e.model.setStance(null); e.model.act = null; }
  if (leo) { leo.place(13.4, 16.6, 2.0); leo.model.setStance(null); leo.model.act = null; }
  victor.faceTo(p); bram.faceTo(p); osric.faceTo(p); nora.faceTo(victor); p.faceTo(victor);
  await S.shot(V3(12.4, 1.55, 13.4), V3(18.6, 1.1, 16.2), 0);
  await S.fadeIn(0.35);
  await S.say('victor', 'Bu... bu daha bitmedi! Babam duyunca hepinizi köyden sürdürecek!');
  for (const e of [bram, osric, victor]) { e.alive = false; e.corpse = true; e.model.setStance(null); e.fleeTo = true; e.walkTo([V3(22.6, 0, 18.4), V3(27, 0, 21), V3(33, 0, 30)], 4.5); }
  nora.model.play('laugh');
  await S.wait(1.5);
  for (const e of [bram, osric, victor]) { e.stopWalk && e.stopWalk(); e.setVisible(false); }
  L.arena = null;
  // ---- sonrası: Joseph ekmeğin yanında oturuyor; herkes kendi yerinde
  await S.fadeOut(0.3);
  p.place(14.7, 15.2, -Math.PI / 2); p.model.setStance('sitGround', true);
  nora.place(15.2, 14.1, -0.5); nora.model.setStance(null);
  if (!leo) leo = S.cast('leo', npc(LOOK.leo(10), 10.0, 16.5, 1.4));
  leo.place(15.3, 16.4, -2.6); leo.model.setStance('hips'); leo.model.act = null;
  for (const a2 of [nora, leo]) { a2.pinned = true; a2.solid = false; }
  bread.position.set(15.15, L.h(15.15, 15.55) + 0.06, 15.55);
  nora.faceTo(p); leo.faceTo(p);
  await S.shot(V3(12.3, 1.35, 15.0), V3(14.9, 0.75, 15.25), 0);
  await S.fadeIn(0.4);
  await S.shot(V3(12.9, 1.15, 15.4), V3(14.9, 0.7, 15.2), 2.0);
  nora.lookAt(p.root); nora.model.play('reach');
  await S.say('nora', 'Kalk bakalım. Sen Joseph\'sin, değil mi? Komadan dönen çocuk.');
  await S.say('joseph', 'Teşekkür ederim. Sen olmasan...');
  await S.say('nora', 'Sen olmasan da o ekmek yerde kalırdı. Ben Nora. Bu da Leo.');
  leo.lookAt(p.root); leo.model.setStance(null);
  await S.say('nora', 'Koşarken bile düşer ama kalbi temizdir.');
  leo.model.play('point');
  await S.say('leo', 'Düşmedim! Taktik yaptım! Düşmanın dikkatini dağıttım!');
  const clara = S.cast('clara', npc(LOOK.clara(10), 10.2, 16.6, 1.4, { watch: false }));
  await S.say('clara', 'Kanıyorsun! Dur, kıpırdama.');
  await S.shot(V3(12.2, 1.4, 14.2), V3(14.2, 0.8, 15.4), 0.8);
  await S.walk(clara, [V3(13.9, 0, 15.5)], 3.0);
  clara.pinned = true; clara.solid = false;
  clara.faceNow(p); clara.lookAt(p.root); clara.model.setStance('kneel'); await S.wait(0.4); clara.model.play('reach');
  await S.wait(0.6); p.model.addExtra({ t: 'bandage', c: '#e8dfcc' }); S.sfx('cloth', 0.5);
  await S.shot(V3(13.0, 1.05, 14.3), V3(14.4, 0.75, 15.35), 0.8);
  await S.say('nora', 'Clara? Senin burada ne işin var? Annen seni bizimle görse...');
  await S.say('clara', 'Annem görmüyor.');
  clara.model.play('nod');
  await S.say('clara', 'Ben Clara. Babam köprünün öbür tarafında kumaş satıyor. Ama ben bu tarafı daha çok seviyorum. Burada insanlar gülüyor.');
  clara.model.setStance(null); clara.pinned = false; clara.walkTo([V3(14.0, 0, 16.6)], 1.2);
  // ayağa kalk, ekmeği al
  p.model.setStance(null); p.faceNow(V3(15.15, 0, 15.55)); await S.wait(0.4); p.model.play('pickup'); await S.wait(0.6); bread.visible = false; p.model.setWeapon('bread');
  await S.shot(V3(12.4, 1.5, 15.6), V3(14.7, 1.0, 15.2), 1.0);
  p.faceTo(nora);
  await S.think('Önceki hayatımda bir sürü meslektaşım vardı. Hiç arkadaşım olmadı.');
  await S.say('joseph', 'Size bir borcum var.');
  nora.model.play('shrug');
  await S.say('nora', 'Arkadaşlar arasında borç olmaz.');
  leo.model.play('jump');
  await S.say('leo', 'Arkadaş mıyız şimdi? Yaşasın! Dört kişiyiz! Dörtlü çete!');
  await S.say('clara', 'Çete değil, Leo. Çeteler kötüdür.');
  await S.say('leo', 'O zaman... Dörtlü iyi çete!');
  await S.wait(0.5);
  await S.fadeOut(1.2);
});

Story.def('c1_selen', { chapter: 'Bölüm 1 · Taban', title: 'Merhem', sub: 'Leo\'nun ablası', kind: 'Hikâye' }, async S => {
  let L = await S.level(() => buildVillage({}), 'dusk');
  S.amb('wind'); S.music('sad');
  const ld = L.pts.leoDoor;
  const p = spawnJoseph(10, ld.x - 1.2, ld.z - 0.6, Math.PI * 0.2); p.model.setStance('sitGround', true); p.model.addExtra({ t: 'bandage', c: '#e8dfcc' });
  const leo = S.cast('leo', npc(LOOK.leo(10), ld.x + 0.1, ld.z - 0.9, -0.6, { stance: 'hugKnees' }));
  const selen = S.cast('selen', npc(LOOK.selen(), -2, -6, 0.8));
  S.cine(true);
  await S.shot(V3(ld.x - 3, 1.5, ld.z - 4), V3(ld.x - 0.5, 0.6, ld.z - 0.6), 0);
  await S.fadeIn(1.2);
  await S.say('leo', 'Ablam gelince yine dalga geçecek. Hep geçer.');
  await S.say('joseph', 'Ablan maceracı mı?');
  await S.say('leo', 'E rütbe. Köyde E rütbe olmak, kraliçe olmak gibi bir şey. Öyle sanıyor en azından.');
  await S.walk(selen, [V3(ld.x - 1, 0, ld.z - 4.5), V3(ld.x - 0.3, 0, ld.z - 2.2)], 1.5);
  selen.faceTo(leo); selen.model.setStance('hips');
  await S.shot(V3(ld.x - 2.2, 1.1, ld.z - 0.4), V3(ld.x - 0.3, 1.5, ld.z - 2.2), 0.8);
  await S.say('selen', 'Vay vay. Kardeşim yine dayak mı yemiş? Hem de bir kızın arkasına saklanarak?');
  await S.say('leo', 'Saklanmadım! Ben de vurdum! ...Bir kere.');
  selen.model.play('laugh');
  await S.say('selen', 'Bir kere. Harika. Lonca seni hemen A rütbesine yükseltsin.');
  S.walk(selen, [V3(ld.x - 0.1, 0, ld.z - 1.5)], 1.2); await S.wait(0.8); selen.model.play('reach'); leo.model.play('flinch');
  selen.faceTo(p); selen.lookAt(p.root);
  await S.say('selen', 'Sen de komadan çıkan çocuksun, değil mi? Kafanı kullan, Joseph. Yumrukla Victor\'un babasını yenemezsin.');
  const c = await S.choice(['"Lonca nasıl bir yer?"', '"Leo cesurdu bugün."']);
  if (c === 0) {
    await S.say('joseph', 'Lonca nasıl bir yer?');
    await S.say('selen', 'Pis, gürültülü, tehlikeli. Ve bu köyde ekmeğini hak ederek kazanabileceğin tek yer.');
  } else {
    await S.say('joseph', 'Leo bugün cesurdu.');
    selen.model.setStance(null); await S.wait(0.6);
    await S.say('selen', '...Cesur olmak yetmez. Cesur ölüleri de gömüyoruz.');
  }
  selen.model.setStance(null);
  await S.walk(selen, [V3(ld.x, 0, ld.z - 0.2)], 1.4);
  S.sfx('door'); selen.setVisible(false);
  await S.shot(V3(ld.x - 2.6, 1.0, ld.z - 2.2), V3(ld.x - 0.4, 0.5, ld.z - 0.7), 0.8);
  await S.say('leo', 'Görüyor musun? Hep böyle. E rütbe olunca kendini bir şey sanıyor.');
  await S.say('joseph', 'Seni korumaya çalışıyor.');
  await S.say('leo', 'Hah! Bu mu koruma?');
  await S.fadeOut(1.2);
  // ---- gece
  L = await S.level(() => buildVillage({ night: true }), 'night');
  S.amb('wind'); S.music('none');
  const p2 = spawnJoseph(10, ld.x - 2.2, ld.z - 2.4, -2.0); p2.model.addExtra({ t: 'bandage', c: '#e8dfcc' }); p2.speedMul = 0.9;
  S.cine(true);
  await S.shot(V3(ld.x - 6, 2.2, ld.z - 6), V3(ld.x - 2.2, 0.9, ld.z - 2.4), 0);
  await S.fadeIn(1.2);
  await S.think('Gece oldu. Annem merak eder.');
  S.cine(false); Cam.yaw = p2.facing + Math.PI;
  S.objective('Eve dön', L.pts.homeDoor);
  await S.until(() => p2.dist(V3(ld.x, 0, ld.z)) > 8);
  S.cine(true); S.clearObjective();
  { const dx = p2.pos.x - ld.x, dz = p2.pos.z - ld.z, d = Math.hypot(dx, dz) || 1; if (d > 9) p2.place(ld.x + dx / d * 8.5, ld.z + dz / d * 8.5, p2.facing); }
  const selen2 = S.cast('selen', npc(LOOK.selen(), ld.x - 2.5, ld.z + 0.1, 0, { watch: false, weapon: 'jar' }));
  await S.think('...?');
  p2.faceTo(selen2);
  await S.shot(V3(p2.pos.x + 1.2, 1.3, p2.pos.z + 1.0), V3(ld.x - 2.5, 1.0, ld.z + 0.4), 1.2);
  selen2.model.play('reach'); await S.wait(1.4); selen2.model.setWeapon(null);
  const jar = new T.Mesh(prim('cyl8'), lam('#b8c8a8')); jar.scale.set(0.09, 0.11, 0.09); jar.position.set(ld.x - 2.1, L.h(ld.x, ld.z) + 0.75, ld.z + 0.85); L.add(jar);
  await S.wait(0.6);
  selen2.faceTo(p2); selen2.lookAt(p2.root); await S.wait(0.6);
  await S.say('selen', '...');
  selen2.model.play('point');
  await S.say('selen', 'Şşt.');
  await S.walk(selen2, [V3(p2.pos.x + Math.sin(p2.facing) * 1.1, 0, p2.pos.z + Math.cos(p2.facing) * 1.1)], 1.4);
  selen2.faceNow(p2); selen2.model.setWeapon('jar'); selen2.model.play('reach');
  await S.shot(V3(p2.pos.x + 1.5, 1.2, p2.pos.z - 0.6), V3((p2.pos.x + selen2.pos.x) / 2, 1.0, (p2.pos.z + selen2.pos.z) / 2), 0.8);
  await S.say('selen', 'Bu da seninki. Kaşın açılmış. Sabah akşam sür.');
  selen2.model.setWeapon(null); p2.model.setWeapon('jar');
  await S.say('selen', 'Ve kimseye söylemeyeceksin. Özellikle Leo\'ya.');
  await S.say('joseph', 'Neden? Seni sevdiğini bilse...');
  await S.say('selen', 'Bilmesin. Kızgın bir kardeş daha çok çalışır. Ben onu korurken de, ben yokken de hayatta kalmayı öğrenmeli.');
  selen2.walkTo([V3(ld.x + 3, 0, ld.z - 6), V3(0, 0, -6)], 1.6);
  await S.wait(1.5);
  await S.shot(V3(p2.pos.x - 1.3, 1.25, p2.pos.z + 1.6), V3(p2.pos.x, 1.0, p2.pos.z), 1.5);
  await S.think('Bazı insanlar sevgisini alay ederek saklar. Bunu mahkeme koridorlarından bilirim.');
  p2.model.play('laugh');
  await S.think('...Ve ben, bu dünyada ilk kez güldüm.');
  await S.wait(0.8);
  await S.fadeOut(1.5);
});

Story.def('c1_run', { chapter: 'Bölüm 1 · Taban', title: 'Sabah Koşusu', sub: '12 yaş', kind: 'Parkur' }, async S => {
  const L = await S.level(() => buildVillage({}), 'morning');
  S.amb('wind');
  const hd = L.pts.homeDoor;
  const p = spawnJoseph(12, hd.x + 0.8, hd.z, Math.PI / 2);
  const lily = S.cast('lily', npc(LOOK.lily(12), hd.x + 0.5, hd.z + 1.6, Math.PI / 2, { stance: 'sitGround' }));
  S.cine(true);
  await S.fadeIn(0.1);
  UI.title('Sekiz yıl', '12 yaş', 'Sabah koşusu');
  await S.shot(V3(hd.x + 6, 2.6, hd.z - 3), V3(hd.x + 0.8, 1.0, hd.z), 0);
  await S.wait(3.2);
  await S.shot(V3(hd.x + 3.4, 1.4, hd.z + 1.2), V3(hd.x + 0.8, 1.0, hd.z), 1.5);
  await S.think('Bu beden zayıf. Ama bedenler çalıştıkça değişir. İlk hayatımda bunu hiç öğrenmedim.');
  await S.say('lily', 'Yine mi koşacaksın abi? Annem kahvaltı soğuyacak diyor!');
  await S.say('joseph', 'Kahvaltı hazır olana kadar dönerim.');
  await S.say('lily', 'Ben de sayacağım! Bir, iki, üç...');
  const route = [V3(-3, 0, 3.5), V3(17, 0, 1.2), V3(riverX(0) + 4.2, 0, 0), V3(44, 0, -8), V3(riverX(0) - 4.5, 0, 0.3), V3(-4, 0, 16), V3(-9, 0, 37), V3(-6, 0, 22), V3(hd.x + 1.2, 0, hd.z)];
  let attempt = 0;
  while (true) {
    attempt++;
    p.place(hd.x + 0.8, hd.z, Math.PI / 2); Cam.follow(p, true); Cam.yaw = -Math.PI / 2 + Math.PI;
    S.cine(false); S.music('joy');
    const limit = 75; let left = limit; let idx = 0; let cp = checkpointMesh(L, route[0]);
    S.objective('Işıklı halkalardan geç (' + 0 + '/' + route.length + ')', route[0]);
    S.tip('Joystick\'i sonuna kadar it: koş', 3500);
    let failed = false;
    await S.until(dt => {
      left -= dt; UI.counter(Math.max(0, left).toFixed(1));
      if (distXZ(p.pos, route[idx]) < 1.6) {
        S.sfx('checkpoint'); cp.parent.remove(cp); idx++; left += 2.5;
        if (idx >= route.length) return true;
        cp = checkpointMesh(L, route[idx]); S.objective('Işıklı halkalardan geç (' + idx + '/' + route.length + ')', route[idx]);
      }
      if (left <= 0) { failed = true; return true; }
      return false;
    });
    UI.counter(null); S.clearObjective();
    if (cp.parent) cp.parent.remove(cp);
    if (!failed) break;
    S.sfx('fail');
    await retryPrompt(S, 'Güneş yükseldi. Daha hızlı olmalıyım.');
  }
  S.cine(true); S.music('village');
  lily.model.setStance(null); lily.model.play('jump');
  await S.shot(V3(hd.x + 4, 1.4, hd.z + 2), V3(hd.x + 1, 0.9, hd.z), 0.8);
  p.model.setStance('weak');
  await S.say('lily', '...yüz kırk iki! Yüz kırk üç! Abi, dün yüz altmışa kadar saymıştım! Daha hızlısın!');
  await S.think('Her sabah. Yağmurda, çamurda, karda.');
  await S.think('Ben koştukça köyün yolları kısaldı.');
  await S.fadeOut(1.2);
});

Story.def('c1_spar', { chapter: 'Bölüm 1 · Taban', title: 'İdman', sub: '15 yaş · Nora\'ya karşı', kind: 'Savaş' }, async S => {
  const L = await S.level(() => buildVillage({}), 'day');
  S.amb('wind'); S.music('village');
  const cx = 46, cz = -12;
  const dummy = makeDummy(L, cx + 1.5, cz - 1.5);
  const p = spawnJoseph(15, cx - 1.5, cz + 1.8, 2.2); p.dummy = dummy;
  const nora = S.cast('nora', fighter(LOOK.nora(15), cx - 3.5, cz - 2.8, 1.0, { hp: 120, name: 'Nora', ai: { moves: ['jab', 'cross'], heavyMove: 'kick', heavyChance: 0.25, combos: true, aggr: 1.15, speed: 3.0, circleR: 2.4, windMul: 0.92, cooldown: [1.0, 2.0], nonLethal: true, poise: 30 } }));
  nora.model.setStance('crossArms'); nora.hpBar = false;
  const leo = S.cast('leo', npc(LOOK.leo(15), cx - 5.6, cz + 3.9, 2.5, { stance: 'sitGround', weapon: 'apple' }));
  const clara = S.cast('clara', npc(LOOK.clara(15), cx - 6.4, cz + 2.4, 2.2, { stance: 'sitGround', weapon: 'book' }));
  S.cine(true);
  await S.fadeIn(0.1);
  UI.title('Sekiz yıl', '15 yaş', 'Nehir kıyısı');
  await S.shot(V3(cx + 7, 3, cz + 6), V3(cx, 1, cz), 0);
  await S.wait(3.4);
  await S.shot(V3(cx - 0.5, 1.6, cz + 4.5), V3(cx - 2, 1.2, cz), 1.5);
  await S.say('nora', 'Kuklaya vurmak kolay, Joseph. Önce bir göster bakalım, sonra benimle dövüşürsün.');
  await S.say('leo', 'Ben de hazırım! ...Yani, elmamı bitirince.');
  S.cine(false); combatOn(S, p); Cam.yaw = 2.2 + Math.PI;
  S.objective('Kuklaya üçlü kombo yap', dummy.group.position);
  S.tip('SALDIR butonuna art arda üç kez dokun', 4500);
  await S.until(() => dummy.combos >= 1);
  S.sfx('checkpoint');
  S.objective('Ağır vuruşla (TEKME) kuklayı sars', dummy.group.position);
  S.tip('TEKME: güçlü ama nefes harcar. Sarı çubuk nefesindir.', 5000);
  await S.until(() => dummy.kicks >= 1);
  S.sfx('checkpoint'); S.clearObjective();
  // düello
  combatOff(p); S.cine(true); p.dummy = null;
  nora.model.setStance(null);
  await S.walk(nora, [V3(cx - 1.5, 0, cz - 1.0)], 1.8);
  nora.faceTo(p); p.faceTo(nora);
  await S.shot(V3(cx + 1.5, 1.4, cz + 2.6), V3(cx - 1.5, 1.1, cz), 1);
  await S.say('nora', 'Fena değil. Şimdi gerçek bir rakip.');
  await S.say('clara', 'Yüzüne vurmayın! Geçen sefer Leo bir hafta morluk taşıdı.');
  await S.say('leo', 'O morluk savaş yarasıydı!');
  let result = null;
  while (!result) {
    nora.hp = nora.maxHp; nora.alive = true; nora.corpse = false; nora.untargetable = false; nora.state = 'circle'; nora.model.setStance('fight');
    p.hp = p.maxHp; p.downs = 0; p.stamina = p.staminaMax; p.place(cx + 0.5, cz + 1.4, -2.4); nora.place(cx - 2, cz - 1.4, 1.0);
    L.arena = { x: cx - 0.5, z: cz, r: 6.5 };
    S.cine(false); S.music('battle'); combatOn(S, p); p.noDeath = true; nora.activate(); Cam.yaw = -2.4 + Math.PI;
    UI.boss('Nora', 1);
    S.objective('Nora\'yı yen');
    await S.until(() => { UI.boss('', nora.hp / nora.maxHp); if (nora.state === 'yield') { result = 'win'; return true; } if (p.downs > 0) { result = 'lose'; return true; } return false; });
    nora.active = false; combatOff(p); S.clearObjective();
  }
  S.cine(true); S.music('village');
  await S.shot(V3(p.pos.x + 2.5, 1.4, p.pos.z + 2), V3((p.pos.x + nora.pos.x) / 2, 1.0, (p.pos.z + nora.pos.z) / 2), 0.8);
  if (result === 'win') {
    await S.say('nora', 'Tamam, tamam! Pes ediyorum!');
    nora.model.setStance(null);
    await S.say('nora', 'Nereden öğreniyorsun bunları? Kimse sana dövüş öğretmedi.');
    await S.say('joseph', 'Kendimden.');
    leo.model.setStance(null); leo.model.play('jump');
    await S.say('leo', 'Nora\'yı yendi! Tarih yazıldı! Bunu bütün köye anlatacağım!');
    await S.say('clara', 'Leo, bağırma. Ama... evet. Etkileyiciydi.');
  } else {
    p.model.setStance('sitGround'); nora.model.setStance('hips');
    await S.say('nora', 'Yine kazandım! Ama bu sefer beni terlettin, itiraf ediyorum.');
    await S.say('joseph', 'Gelecek sefer.');
    await S.say('nora', 'Gelecek sefer de ben kazanacağım. Ama terleteceksin, söz mü?');
  }
  p.model.setStance(null); nora.model.setStance(null);
  await S.shot(V3(cx - 2, 1.5, cz + 7), V3(cx - 3.5, 0.9, cz + 2.5), 1.6);
  await S.say('clara', 'Üç yıl sonra tören var. Sizce hangimizin Enkron\'u olacak?');
  await S.say('leo', 'Benim! Ablamınki gibi değil, çok daha iyisi!');
  await S.say('nora', 'Olmasa da loncaya yazılırım. Kardeşlerim aç yatmasın diye.');
  await S.say('clara', 'Joseph? Sen?');
  await S.say('joseph', 'Olsun ya da olmasın, loncaya gireceğim. Ailemi o evden çıkaracağım.');
  await S.think('On gümüş. Şimdilik iki gümüşüm var.');
  await S.fadeOut(1.2);
});

Story.def('c1_harvest', { chapter: 'Bölüm 1 · Taban', title: 'Hasat', sub: '17 yaş · Babayla tarlada', kind: 'Hikâye' }, async S => {
  const L = await S.level(() => buildVillage({ harvested: (x, z) => x > -15 }), 'dusk', { sunDir: [0.45, 0.32, -0.85], hemi: 1.15, glow: 0.4 });
  S.amb('wind'); S.music('village');
  const cartP = V3(10.5, 0, 53);
  const p = spawnJoseph(17, -4, 46, Math.PI / 2);
  const daniel = S.cast('daniel', npc(LOOK.daniel(), -12.5, 49, Math.PI / 2, { weapon: 'pitchfork' }));
  let danielWork = true; let wt = 0; L.anims.push(dt => { if (!danielWork) return; wt += dt; if (wt > 2.4) { wt = 0; daniel.model.play('swing', 0.8); } });
  // demetler
  const sheaves = [V3(-6.5, 0, 47.5), V3(-1.5, 0, 51.5), V3(2.0, 0, 44.8)].map(v => {
    const g = new T.Group(); const m1 = new T.Mesh(new T.CylinderGeometry(0.2, 0.26, 0.9, 10), TOON.mat('#e0bc62')); m1.rotation.z = Math.PI / 2; m1.castShadow = true; g.add(m1);
    const m2 = new T.Mesh(new T.CylinderGeometry(0.27, 0.27, 0.08, 10), TOON.mat('#8a6a30')); m2.rotation.z = Math.PI / 2; g.add(m2);
    g.position.set(v.x, L.h(v.x, v.z) + 0.24, v.z); g.rotation.y = rnd(0, TAU); L.add(g); return { v, g };
  });
  const pile = new T.Group(); pile.position.set(cartP.x, L.h(cartP.x, cartP.z) + 0.95, cartP.z - 0.3); pile.rotation.y = 0.2; L.add(pile);
  S.cine(true);
  await S.fadeIn(0.1);
  UI.title('Sekiz yıl', '17 yaş', 'Hasat');
  await S.shot(V3(-2, 5, 34), V3(-6, 1, 50), 0);
  await S.wait(3.2);
  await S.shot(V3(-1.5, 1.7, 43.5), V3(-4, 1.3, 46.5), 1.6);
  await S.say('daniel', 'Biçtiklerimizi arabaya taşı, oğlum. Güneş batmadan bitirelim.');
  await S.say('joseph', 'Kaç demet kaldı?');
  await S.say('daniel', 'Üç. Ama sen geçen yıl "üç" deyip altı tane taşımıştın. Saymayı benden öğrenmedin herhalde.');
  S.cine(false); Cam.yaw = -Math.PI / 2 + Math.PI;
  for (let i = 0; i < 3; i++) {
    const sh = sheaves[i];
    S.objective(`Demetleri arabaya taşı (${i}/3)`, sh.v);
    await S.interact(sh.v, 'Demeti al', 1.6);
    p.model.play('pickup'); sh.g.visible = false; p.model.setWeapon('sheaf'); p.model.setUpper('carry'); S.sfx('wood', 0.5);
    S.objective(`Demetleri arabaya taşı (${i}/3)`, cartP);
    await S.interact(cartP, 'Arabaya koy', 2.4);
    p.model.setWeapon(null); p.model.setUpper(null); p.model.play('push');
    const m = sh.g; m.visible = true; m.position.set(0, i * 0.22, (i - 1) * 0.45); m.rotation.set(0, Math.PI / 2, 0); pile.add(m); S.sfx('checkpoint');
  }
  S.clearObjective();
  // akşam sohbeti
  S.cine(true); danielWork = false; S.music('sad');
  await S.fadeOut(0.6);
  daniel.model.setWeapon(null);
  p.place(cartP.x - 1.3, cartP.z + 1.7, -2.6); p.model.setStance('sitGround', true);
  daniel.place(cartP.x - 0.2, cartP.z + 1.9, -2.3); daniel.model.setStance('sitGround', true);
  p.lookAt(daniel.root); daniel.lookAt(p.root);
  await S.shot(V3(cartP.x - 3.2, 1.25, cartP.z - 1.2), V3(cartP.x - 0.8, 0.75, cartP.z + 1.8), 0);
  await S.fadeIn(0.8);
  await S.say('daniel', 'Annen tavşan yahnisi yapacakmış. Lily\'nin kurduğu tuzağa bir tavşan düşmüş. Bütün gün onu anlattı.');
  await S.say('joseph', 'Lily mi yakalamış? Tavşanı?');
  daniel.model.play('laugh');
  await S.say('daniel', 'Senin kardeşin o. İnatçı. Tıpkı sana benziyor.');
  await S.wait(0.6);
  await S.shot(V3(cartP.x - 1.7, 1.05, cartP.z - 0.2), V3(cartP.x - 0.2, 0.95, cartP.z + 1.9), 1.6);
  await S.say('daniel', 'Gelecek yıl tören var.');
  await S.say('joseph', 'Biliyorum.');
  await S.say('daniel', 'Ben de on sekizimde o taşa dokundum. Hiçbir şey olmadı. Taş bana bakmadı bile.');
  await S.say('daniel', 'Tarlaya döndüm. Bir yıl kızgın gezdim. Sonra annenle bu tarlada tanıştım. Yanlış sıraya ekiyordum, beni herkesin önünde azarladı.');
  p.model.play('laugh');
  await S.think('Avukatken kimse bana bir şey öğretmezdi. Herkes benden bir şey isterdi.');
  daniel.model.setExpression('smile');
  await S.say('daniel', 'Demek istediğim şu: o taş ne derse desin, sen benim oğlumsun. Enkron\'un olsa da olmasa da.');
  await S.say('daniel', 'Al. Kayın dalından oydum. Tören günü cebinde dursun.');
  daniel.model.play('reach'); await S.wait(0.8); p.model.setWeapon('charm'); S.sfx('coin', 0.6);
  await S.shot(V3(cartP.x - 1.0, 0.85, cartP.z + 0.9), V3(cartP.x - 1.15, 0.6, cartP.z + 1.6), 1.0);
  await S.say('joseph', 'Teşekkür ederim, baba.');
  p.model.setExpression('smile');
  await S.wait(0.5);
  const lily = S.cast('lily', npc(LOOK.lily(17), 13, 37, Math.PI));
  S.walk(lily, [V3(8.2, 0, 44), V3(8.5, 0, 52.4)], 3.4);
  await S.shot(V3(cartP.x - 1.0, 1.55, cartP.z + 4.6), V3(cartP.x - 2.0, 1.0, cartP.z - 3), 0);
  Cam.shot(V3(cartP.x - 1.1, 1.5, cartP.z + 4.0), V3(cartP.x - 2.0, 1.0, cartP.z - 3), 3.0);
  await S.say('lily', 'Abi! Baba! Annem "yahni soğudu" diyor! Üçüncü kez!');
  await S.until(() => !lily.path);
  lily.lookAt(p.root); lily.model.setStance('hips'); lily.model.setExpression('angry');
  await S.say('lily', 'Ve tavşanı ben yakaladım, bunu da bilin. Kimse bana teşekkür etmedi.');
  daniel.model.play('laugh'); p.model.setExpression('smile');
  await S.say('daniel', 'Teşekkürler, büyük avcı Lily.');
  lily.model.setExpression('smile');
  await S.shot(V3(cartP.x + 3.2, 2.3, cartP.z + 5.2), V3(cartP.x - 1.2, 0.8, cartP.z + 1.2), 3.5);
  await S.think('Bir yıl sonra her şey değişecek. Ama bu akşamı unutmayacağım.');
  await S.fadeOut(1.5);
});

// Pencerede duran kadın silüeti (tuvalden), aydınlık camın önünde koyu gölge
function ladySilhouette() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 192; const x = c.getContext('2d');
  x.fillStyle = '#1a1210'; x.filter = 'blur(2px)';
  x.beginPath(); x.ellipse(64, 58, 21, 26, 0, 0, TAU); x.fill();                  // baş
  x.beginPath(); x.moveTo(40, 52); x.quadraticCurveTo(30, 120, 34, 150); x.lineTo(94, 150); x.quadraticCurveTo(98, 120, 88, 52); x.closePath(); x.fill(); // uzun saç
  x.beginPath(); x.moveTo(56, 80); x.lineTo(72, 80); x.lineTo(76, 98); x.quadraticCurveTo(118, 106, 124, 192); x.lineTo(4, 192); x.quadraticCurveTo(10, 106, 52, 98); x.closePath(); x.fill(); // omuzlar
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace;
  const m = new T.Mesh(new T.PlaneGeometry(0.76, 1.14), new T.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  return m;
}
Story.def('c1_guild', { chapter: 'Bölüm 1 · Taban', title: 'Lonca Kapısı', sub: '17 yaş · Eros çarşısı', kind: 'Hikâye' }, async S => {
  let L = await S.level(() => buildEros({}), 'day');
  S.amb('crowd'); S.music('village');
  const p = spawnJoseph(17, 0, 29, Math.PI);
  seed(12);
  for (let i = 0; i < 9; i++) { const w = new Wanderer({ look: rng() < 0.3 ? randomNoble(rng() < 0.5) : randomVillager(rng() < 0.5) }); const x = rnd(-14, 14), z = rnd(-6, 22); w.place(x, z, rnd(0, TAU)); w.home = V3(x, 0, z); w.homeR = 5; }
  const g1 = npc(LOOK.guard(), -3.5, -14.2, 0, { stance: 'behind', watch: false }); const g2 = npc(LOOK.guard(), 3.5, -14.2, 0, { stance: 'behind', watch: false });
  S.cast('guard', g2);
  S.cine(true);
  await S.shot(V3(6, 4, 33), V3(0, 3, 0), 0);
  await S.fadeIn(1);
  await S.shot(V3(3, 2, 31), V3(0, 4, -15), 3);
  await S.think('Eros çarşısı. Köprünün bu tarafında insanlar ayakkabı giyer.');
  S.cine(false); Cam.yaw = 0;
  S.objective('Lonca panosuna bak', L.pts.board);
  await S.interact(L.pts.board, 'Panoyu oku', 1.8);
  S.clearObjective(); S.cine(true); p.faceNow(V3(6.5, 0, -13));
  await S.shot(V3(5.2, 1.9, -9.6), V3(6.5, 1.6, -13), 0.8);
  await S.think('G rütbe: Kanalları temizlemek. Otuz bronz.');
  await S.think('G rütbe: Kayıp kedi, Fırıncı Hilda\'nın. On beş bronz. "Tekir. Isırır."');
  await S.think('F rütbe: Batı ormanında kurt sürüsü. İki gümüş. Ölüm halinde ödeme ailene yapılır.');
  await S.think('Rütbe yükseldikçe para artıyor. Ölüm ihtimali de.');
  S.sfx('crowd', 1.2);
  await S.say('crowd', 'Isolde! Gümüş Kılıç Isolde! Döndüler!');
  const iso = S.cast('isolde', npc(LOOK.isolde(), 0, -15.8, 0, { watch: false }));
  const ser = S.cast('seraphine', npc(LOOK.seraphine(), -1.2, -16.6, 0, { watch: false, weapon: 'staff' }));
  const row = S.cast('rowena', npc(LOOK.rowena(), 1.3, -16.4, 0, { watch: false }));
  S.sfx('door');
  await S.shot(V3(1.5, 1.6, -8.5), V3(0, 1.8, -15), 1.0);
  p.place(5.3, -10.6, Math.atan2(6.5 - 5.3, -13 + 10.6));
  const isoWalk = S.walk(iso, [V3(1.3, 0, -12.6), V3(3.9, 0, -11.5)], 1.6);
  S.walk(ser, [V3(0.2, 0, -13.6), V3(2.5, 0, -12.9)], 1.5); S.walk(row, [V3(2.3, 0, -13.5), V3(4.5, 0, -12.9)], 1.5);
  await S.wait(1.0);
  await S.say('rowena', 'Üç gün bataklıkta, bir trol ve sıfır teşekkür. Ben bu işi neden yapıyorum, Isolde?');
  await S.say('isolde', 'Para için, Rowena. Herkes gibi.');
  await isoWalk;
  await S.shot(V3(6.4, 1.5, -8.6), V3(4.4, 1.3, -11.0), 0.6);
  await S.walk(p, [V3(4.55, 0, -11.0)], 1.1);
  S.sfx('hit', 0.5); p.model.play('hit'); iso.model.play('flinch', 1.5);
  iso.faceTo(p); p.faceTo(iso); iso.lookAt(p.root); iso.model.setStance('hips');
  await S.shot(V3(p.pos.x + 1.4, 1.6, p.pos.z + 1.5), V3((p.pos.x + iso.pos.x) / 2, 1.5, (p.pos.z + iso.pos.z) / 2), 0.5);
  await S.say('isolde', 'Gözlerin nerede, köylü?');
  await S.say('joseph', 'Özür dilerim, Leydim. Sizi görmedim.');
  await S.say('isolde', 'Görmedin. Elbette görmezsin. Toprağa bakmaktan başınızı kaldırmazsınız ki.');
  await S.say('isolde', 'Pelerinime çamur sürdün.');
  row.lookAt(p.root); row.model.play('laugh');
  await S.say('rowena', 'Bırak, Isolde. Çocuk korkudan titriyor. Kılıcını bir gösterirsen bayılır.');
  g2.model.setStance(null);
  await S.walk(g2, [V3(p.pos.x + 0.9, 0, p.pos.z - 0.7)], 3.2);
  g2.faceTo(p); g2.model.play('push'); await S.wait(0.3);
  p.model.play('knock'); S.sfx('hitHeavy', 0.6); Screen.addShake(0.4);
  setTimeout(() => { if (!p.removed) { p.model.stop(); p.model.setStance('sitGround'); } }, 700);
  await S.say('guard', 'Leydi Isolde\'den uzak dur, sefil!');
  S.sfx('laugh'); S.sfx('crowd');
  await S.shot(V3(p.pos.x - 1.5, 0.7, p.pos.z + 1.2), V3(p.pos.x, 0.5, p.pos.z), 0.6);
  await S.wait(0.6);
  iso.model.setStance(null); iso.walkTo([V3(7, 0, -7), V3(14, 0, 4)], 1.6); row.walkTo([V3(8, 0, -8), V3(15, 0, 3)], 1.6);
  ser.lookAt(p.root); ser.faceTo(p);
  await S.shot(V3(ser.pos.x + 1.3, 1.7, ser.pos.z + 1.2), V3(ser.pos.x, 1.6, ser.pos.z), 1.5);
  await S.wait(1.4);
  await S.say('seraphine', '...');
  await S.say('rowena', 'Seraphine? Gel hadi, hamamlar kapanacak.');
  ser.walkTo([V3(8, 0, -7), V3(14, 0, 3)], 1.5);
  await S.wait(1.2);
  // üst kat penceresinde bir gölge: Lonca Hanımı
  {
    const sil = ladySilhouette(); sil.position.set(3.05, 8.12, -15.98); L.add(sil);
    await S.shot(V3(p.pos.x - 0.6, 1.0, p.pos.z + 0.8), V3(3.05, 7.9, -16), 1.4);
    let a = 0; L.anims.push(dt => { a = Math.min(1, a + dt * 1.4); if (!sil.userData.out) sil.material.opacity = a * 0.92; else { sil.material.opacity = Math.max(0, sil.material.opacity - dt * 1.2); } });
    S.sfx('crowd', 0.5); UI.toast('— Bak... Lonca Hanımı yine pencerede.', 2600);
    await S.wait(2.2);
    sil.userData.out = true;
    await S.think('Üst kattaki pencerede biri vardı. Bir an. Sonra gitti.');
  }
  await S.shot(V3(p.pos.x + 0.8, 2.6, p.pos.z + 1.8), V3(p.pos.x, 0.3, p.pos.z), 2);
  await S.think('Yere düştüğümde kimse elini uzatmadı.');
  await S.think('Bunu da öğrendim.');
  p.model.setStance(null);
  await S.fadeOut(1.2);
  // ---- gece: birikim
  L = await S.level(() => buildHut('night'), 'interiorNight', { sunDir: [0.2, 0.5, -0.85], noSky: true });
  S.amb('interior'); S.music('sad');
  const p2 = spawnJoseph(17, -1.6, -0.5, Math.PI * 0.75); p2.speedMul = 0.7; p2.allowRun = false;
  const lily = S.cast('lily', npc(LOOK.lily(17), 2.6, -1.85, 0, { stance: 'lie', watch: false })); lily.lockY = 0.38; lily.solid = false; lily.collides = false;
  S.cine(true);
  await S.shot(V3(0.6, 2.1, 1.6), V3(-1.6, 0.7, -0.6), 0);
  await S.fadeIn(1);
  S.cine(false);
  S.objective('Sandığın altındaki gevşek tahtayı kaldır', V3(-1.4, 0, -2.0));
  await S.interact(V3(-1.4, 0, -2.0), 'Tahtayı kaldır', 1.3);
  S.clearObjective(); S.cine(true); p2.place(-1.4, -1.85, Math.PI); p2.faceNow(V3(-1.4, 0, -2.6));
  p2.model.setStance('kneel'); await S.wait(0.6); p2.model.setWeapon('pouch'); S.sfx('coin');
  await S.shot(V3(-0.45, 1.0, -2.5), V3(-1.4, 0.55, -2.15), 1);
  await S.say('sys', 'Kese · 5 gümüş, 12 bronz', { narr: true });
  await S.think('Beş yıl. Beş gümüş.');
  await S.think('Loncaya girmek on gümüş.');
  lily.model.closedEyes = false; lily.lookAt(p2.root);
  await S.say('lily', 'Abi? Uyumadın mı?');
  await S.say('joseph', 'Uyu, Lily.');
  await S.say('lily', 'Sen hep bir şey biriktiriyorsun. Ne için?');
  await S.say('joseph', 'Hepimiz için.');
  await S.wait(0.6);
  await S.say('lily', '...Benim de biraz param var. Okul için. İstersen...');
  await S.say('joseph', 'Uyu, Lily. O para senin.');
  lily.model.closedEyes = true;
  await S.think('Bir yıl sonra tören. Ondan sonra ne olacağını kimse bilmiyor.');
  await S.fadeOut(1.5);
});

Story.def('c1_ceremony', { chapter: 'Bölüm 1 · Taban', title: 'Tanrı\'nın İradesi', sub: '18 yaş · 1 Ocak', kind: 'Hikâye' }, async S => {
  const L = await S.level(buildHall, 'hall', { noSky: true, sunDir: [0.6, 0.7, 0.2] });
  S.amb('crowd'); S.music('hall');
  const st = L.stone, E = L.pts;
  const p = spawnJoseph(18, 0.6, 17.6, Math.PI); p.speedMul = 0.75; p.allowRun = false;
  const nora = S.cast('nora', npc(LOOK.nora(18), -0.8, 17.2, Math.PI, { watch: false }));
  const leo = S.cast('leo', npc(LOOK.leo(18), 1.8, 18.4, Math.PI, { watch: false }));
  const clara = S.cast('clara', npc(LOOK.clara(18), -1.9, 18.2, Math.PI, { watch: false }));
  const victor = S.cast('victor', npc(LOOK.victor(18), 2.4, -4.0, -Math.PI / 2, { stance: 'crossArms', watch: false }));
  const priest = S.cast('priest', npc(LOOK.priest(), E.priest.x, E.priest.z, 0, { watch: false, weapon: 'staff' }));
  const lady = npc(randomNoble(true, { hair: '#d8b870' }), -2.6, -4.2, Math.PI / 2, { watch: false });
  CAST.noble.actor = lady;
  S.cine(true);
  await S.shot(V3(0, 9, 22), V3(0, 3, -12), 0);
  await S.fadeIn(1.5);
  UI.title('1 Ocak', 'Tanrı\'nın İradesi', 'Eros Sarayı');
  await S.shot(V3(-5, 4, 4), V3(0, 3, -19), 5);
  await S.say('priest', 'Elonth\'un çocukları! On sekizinci kışınızı gördünüz. Bugün Tanrı size bakıyor.');
  await S.say('priest', 'Leydi Rosalind, Harrowmere Hanesi\'nden.');
  const stand = V3(0, 0, E.stone.z + 2.2);
  const step = async (a, wait = 0.6) => { a.stopWalk && a.stopWalk(); a.place(stand.x, stand.z, Math.PI); a.model.setStance(null); a.model.play('reach'); a.model.act.hold = true; };
  const mark = (a, color) => { const m = new T.Mesh(prim('sph8'), new T.MeshBasicMaterial({ color })); m.scale.setScalar(0.12); m.position.set(0, -0.05, 0.02); a.model.handR.add(m); const l = new T.PointLight(color, 2, 3, 1.5); a.model.handR.add(l); setTimeout(() => { a.model.handR.remove(m); a.model.handR.remove(l); l.dispose && l.dispose(); }, a === p ? 1e9 : 1700); return m; };
  await step(lady); lady.facing = Math.PI; lady.root.rotation.y = Math.PI;
  await S.shot(V3(3, 2.6, E.stone.z + 5), V3(0, 2.6, E.stone.z), 0.5);
  st.color.set('#ffd27a'); st.glow = 1; S.sfx('stone');
  await S.wait(1.0);
  await S.say('priest', 'Enkron! Tanrı, Harrowmere Hanesi\'ni bir kez daha kutsadı!');
  S.sfx('crowd', 1.4); st.glow = 0; st.color.set('#7aa8d8'); lady.model.act = null; lady.place(-3.4, E.stone.z + 4, Math.PI / 2);
  // Victor: Holloway Hanesi'nin oğlu
  await S.say('priest', 'Victor Holloway, Lord Holloway\'un oğlu.');
  await step(victor);
  await S.shot(V3(-2.4, 2.2, E.stone.z + 4.4), V3(0, 2.2, E.stone.z + 0.6), 0.4);
  await S.wait(0.3); st.color.set('#d8323e'); st.glow = 1.2; S.sfx('stone'); mark(victor, '#ff4050'); UI.flashEdge('#d8323e');
  await S.wait(1.0);
  await S.say('priest', 'Enkron! Holloway Hanesi bu yıl da eli boş dönmüyor.');
  S.sfx('crowd', 1.3); st.glow = 0; st.color.set('#7aa8d8'); victor.model.act = null; victor.model.setExpression('smile');
  await S.say('crowd', 'Holloway\'un oğlu da kutsandı... Tanrı korusun bizi.');
  victor.place(2.4, -4.0, -Math.PI / 2); victor.model.setStance('crossArms');
  // ---- hızlı seçme: on iki genç art arda taşa dokunur, kimine Enkron çıkar kimine çıkmaz
  const names = ['Aldric', 'Wilhelmina', 'Tomas', 'Berta', 'Cedric', 'Hanna', 'Osmund', 'Elsbeth', 'Rurik', 'Maren', 'Jorin', 'Ilse'];
  const picks = [['#7adc6a', 1], [null], [null], ['#ffb44a', 1], [null], ['#ff6a8a', 1], [null], [null], ['#b48aff', 1], [null], ['#7ad8ff', 1], [null]];
  const queue = [];
  for (let i = 0; i < 12; i++) { const fem = i % 3 === 1 || i === 5 || i === 7; const a = npc(rng() < 0.3 ? randomNoble(fem) : randomVillager(fem, { age: 0 }), 0, 0, Math.PI, { watch: false }); a.model.setStance(null); a.place(-9 + (i % 6) * 3.4, E.stone.z + 8 + Math.floor(i / 6) * 2.2, Math.PI); queue.push(a); }
  await S.shot(V3(2.6, 2.2, E.stone.z + 4.6), V3(0, 2.2, E.stone.z + 0.6), 0.6);
  S.music('hall');
  for (let i = 0; i < 12; i++) {
    const a = queue[i], pk = picks[i], home = V3(a.pos.x, 0, a.pos.z);
    UI.bark(CAST.priest, pk[0] ? `${names[i]} — Enkron!` : `${names[i]} — ...Enkron yok.`, 1700);
    await step(a); a.root.rotation.y = Math.PI;
    await S.wait(0.35);
    if (pk[0]) { st.color.set(pk[0]); st.glow = 1; S.sfx('stone'); mark(a, pk[0]); S.sfx('crowd', 1.1); } else { st.color.set('#5a6070'); st.glow = 0.35; S.sfx('crowd', 0.6); }
    await S.wait(i < 4 ? 1.1 : 0.8);
    st.glow = 0; st.color.set('#7aa8d8'); a.model.act = null; if (!pk[0]) a.model.setExpression('sad'); a.place(home.x, home.z, Math.PI);
  }
  UI.hideDialog();
  await S.shot(V3(1.5, 1.8, 15.5), V3(-0.4, 1.5, 17.6), 0.8);
  await S.say('leo', 'Elim terliyor. Elimin terlediğini Tanrı görür mü sizce?');
  await S.say('clara', 'Görse ne olur, Leo?');
  await S.say('leo', 'Bilmiyorum! Belki terli diye vermez!');
  await S.say('nora', 'Sessiz olun. Sıra bize geldi.');
  const touch = async (a, color, line, crowd) => {
    await step(a);
    await S.shot(V3(2.6, 2.2, E.stone.z + 4.6), V3(0, 2.2, E.stone.z + 0.6), 0.4);
    await S.wait(0.4); st.color.set(color); st.glow = 1; S.sfx('stone'); mark(a, color); UI.flashEdge(color);
    await S.wait(1.1);
    await S.say('priest', line);
    S.sfx('crowd', 1.2); if (crowd) await S.say('crowd', crowd);
    st.glow = 0; st.color.set('#7aa8d8'); a.model.act = null;
    a.place(a === nora ? -2.0 : a === leo ? 2.0 : -1.2, E.stone.z + 4.8, Math.PI);
  };
  await S.say('priest', 'Nora, Eros köyünden.');
  await touch(nora, '#ff7a3a', 'Enkron!', 'Köylü bir kız mı? Köylü bir kızın Enkron\'u mu var?');
  await S.say('priest', 'Leo, Eros köyünden.');
  await touch(leo, '#7adc6a', 'Enkron!', 'Bir tane daha! Aynı köyden!');
  await S.say('priest', 'Clara, Tüccar Aldous\'un kızı.');
  await touch(clara, '#7ad8ff', 'Enkron! Tanrı bu yıl cömert!', 'Aynı köyden üç Enkron! Böylesi görülmedi!');
  for (const a of queue) a.remove && a.remove();
  await S.shot(V3(1.4, 1.7, 15.0), V3(0.6, 1.5, 17.6), 0.8);
  await S.say('priest', 'Joseph, Eros köyünden.');
  await S.think('Bu an için sekiz yıl bekledim.');
  // oyuncu yürür
  S.cine(false); Cam.yaw = 0; Cam.pitch = 0.25;
  S.objective('Taşa yürü', V3(0, 0, E.stone.z + 2.2));
  const barks = [[12, '— Komadan dönen çocuk bu mu?'], [7, '— Şu kıyafetlere bak...'], [2, '— Esmer bir köylü. Taşı kirletmesin.'], [-3, '— Sessiz! Bakalım...']];
  let bi = 0;
  await S.until(() => { if (bi < barks.length && p.pos.z < barks[bi][0]) { UI.toast(barks[bi][1], 2400); bi++; } return p.pos.z < -2.5; });
  S.cine(true); victor.lookAt(p.root);
  await S.shot(V3(1.2, 1.7, -1.5), V3(2.4, 1.6, -4), 0.5);
  await S.say('victor', 'Hadi bakalım, köylü. Tanrılar seni de sevecek mi?');
  S.cine(false);
  await S.interact(V3(0, 0, E.stone.z + 2.2), 'Taşa dokun', 1.6);
  S.clearObjective();
  // ---- dokunuş
  S.cine(true); S.music('none');
  p.place(0, E.stone.z + 2.2, Math.PI); p.model.play('reach'); p.model.act.hold = true;
  await S.shot(V3(1.6, 1.8, E.stone.z + 3.6), V3(0, 2.4, E.stone.z), 0.8);
  await S.wait(0.7);
  st.color.set('#ffffff'); st.glow = 1.4; S.sfx('stone'); UI.flashEdge('#ffffff'); mark(p, '#9fe0ff');
  await S.wait(1.2);
  S.sfx('glitch'); st.color.set('#1a2aff'); st.glow = 2; Screen.set({ sat: 0.3 });
  await S.wait(0.25); st.color.set('#000000'); st.glow = 0; await S.wait(0.18); st.color.set('#2a3aff'); st.glow = 2.4; await S.wait(0.15); st.color.set('#000000');
  await UI.system(['<div class="warn">E̷N̴K̵R̷O̶N̴ ̵S̷E̶N̵K̷R̴O̶N̵İ̷Z̴A̵S̶Y̷O̵N̴U̶</div>', '<div class="warn">UYARI · Bedensel kapasite yetersiz</div>', '<div class="dim">…uyum sağlanıyor…</div>'], { glitch: true, auto: 1.8, speed: 160 });
  st.color.set('#7aa8d8'); st.glow = 0.3;
  p.model.act = null; p.model.setStance('kneel'); S.sfx('collapse'); Screen.set({ blur: 2.5, vig: 0.9, gray: 0.6, wobble: 0.6 });
  await S.shot(V3(1.3, 1.9, E.stone.z + 3.9), V3(0, 1.4, E.stone.z + 2.2), 0.8);
  await S.wait(0.8);
  p.model.setStance('lieSide'); S.sfx('heart');
  await S.wait(1.0);
  await S.shot(V3(0.9, 1.45, E.stone.z + 3.6), V3(0, 1.05, E.stone.z + 2.0), 1.2);
  S.sfx('heart');
  victor.model.setStance(null); victor.model.play('laugh'); S.sfx('laugh');
  await S.say('victor', 'Hahaha! Bakın! Tanrılar bile bu fakire acımadı!');
  S.sfx('crowd', 1.5);
  await S.say('crowd', 'Enkron\'u var ama ayakta duramıyor! Lanetli bu çocuk!');
  priest.lookAt(p.root);
  await S.say('priest', 'Enkron\'u var. Ama bedeni onu reddediyor.');
  S.walk(nora, [V3(0.8, 0, E.stone.z + 3.1)], 4); S.walk(clara, [V3(-0.8, 0, E.stone.z + 3.0)], 4);
  await S.say('nora', 'Joseph! Joseph, bana bak!');
  nora.model.setStance('kneel'); clara.model.setStance('kneel');
  await S.say('clara', 'Nefes almıyor... hayır, alıyor! Yavaş ama alıyor!');
  S.sfx('heart');
  await S.think('Ayağa kalkamıyorum. Parmaklarımı hissetmiyorum.');
  await S.think('Ama gözlerimin önünde... bir şey var.');
  Screen.set({ blur: 6, bright: 0.4 });
  await S.wait(1.2);
  await S.fadeOut(2.0);
});

Story.def('c1_walk', { chapter: 'Bölüm 1 · Taban', title: 'Eve Dönüş', sub: '18 yaş · Karlı akşam', kind: 'Hikâye' }, async S => {
  const L = await S.level(() => buildVillage({ winter: true, night: true }), 'winterdusk', { weather: 'snow' });
  S.amb('wind'); S.music('sad');
  const p = spawnJoseph(18, -1.2, -38, 0, { look: { extras: [{ t: 'belt', c: '#2e2218' }, { t: 'vest', c: '#4e4234' }, { t: 'scarf', c: '#6a4a3a' }] } });
  p.speedMul = 0.42; p.allowRun = false; p.weakWalk = true; p.model.setStance('carried'); p.model.breathe = 2.5;
  const nora = S.cast('nora', npc(LOOK.nora(18), -2, -38.4, 0, { stance: 'support', watch: false }));
  const leo = S.cast('leo', npc(LOOK.leo(18), -0.4, -38.4, 0, { stance: 'supportL', watch: false }));
  const clara = S.cast('clara', npc(LOOK.clara(18), -1, -35, 0, { stance: 'lantern', weapon: 'lantern', watch: false }));
  const lanternL = new T.PointLight('#ffb860', 4, 10, 1.6); lanternL.position.set(0, -0.1, 0.1); clara.model.handR.add(lanternL);
  for (const a of [nora, leo]) { a.solid = false; a.collides = false; }
  let hdg = p.facing;
  G.onFrame = dt => {
    hdg += angDiff(hdg, p.facing) * Math.min(1, dt * 4);
    const f = hdg, c = Math.cos(f), s = Math.sin(f);
    nora.pos.set(p.pos.x + c * 0.52, p.pos.y, p.pos.z - s * 0.52); leo.pos.set(p.pos.x - c * 0.52, p.pos.y, p.pos.z + s * 0.52);
    nora.facing = leo.facing = f; nora.vel.copy(p.vel); leo.vel.copy(p.vel);
    for (const a of [nora, leo]) { a.root.position.copy(a.pos); a.root.rotation.y = f; }
  };
  Screen.set({ blur: 1.2, vig: 0.7, sat: 0.5, wobble: 0.6 }, true);
  S.cine(true);
  await S.shot(V3(3, 2.4, -42), V3(-1, 1.2, -36), 0);
  await S.fadeIn(2);
  UI.title('Aynı akşam', 'Eve Dönüş', '');
  await S.wait(2.4);
  await S.say('leo', 'Rahip ne dedi? "Bedeni reddediyor" mu? Saçmalık. Yarın kalkar koşarsın, değil mi Joseph?');
  await S.say('joseph', '...Tabii.');
  await S.say('nora', 'Konuşma. Nefesini sakla.');
  S.cine(false); Cam.yaw = Math.PI; Cam.dist = 4.2;
  S.objective('Eve dön', L.pts.homeDoor);
  S.tip('Bedenin zar zor taşıyor. Yavaşça yürü.', 4000);
  const hb = setInterval(() => Audio.sfx('heart', 0.5), 2200);
  clara.walkTo([V3(-2, 0, -20), V3(-6, 0, -4), V3(-10, 0, 4), V3(L.pts.homeDoor.x + 2, 0, L.pts.homeDoor.z - 1)], 0.75);
  const hd = L.pts.homeDoor; const total = distXZ(p.pos, hd);
  const barks = [
    [0.15, 'clara', 'Babamın tanıdığı bir şifacı var. Belki o...'], [0.2, 'joseph', 'Clara. Gerek yok.'],
    [0.35, 'thought', 'Gözlerimi kapatınca bile orada. Mavi bir pencere. Yazılar.'],
    [0.5, 'leo', 'Victor\'un suratını gördünüz mü? Gülerken boğulacaktı. Bir gün o suratı...'], [0.55, 'nora', 'Leo.'], [0.58, 'leo', '...Tamam, sustum.'],
    [0.7, 'thought', 'Henüz kimse bilmemeli. Neyin ne olduğunu ben bile bilmiyorum.'],
    [0.85, 'nora', 'Joseph... ne olursa olsun, biz buradayız. Duydun mu?'],
  ];
  let bi = 0;
  await S.until(() => {
    const prog = 1 - distXZ(p.pos, hd) / total;
    if (bi < barks.length && prog > barks[bi][0] && UI.dlg.hidden) { const [, w, t] = barks[bi++]; UI.bark(w === 'thought' ? CAST.thought : CAST[w], t, 3800); }
    return distXZ(p.pos, hd) < 3.2;
  });
  clearInterval(hb); UI.hideDialog(); S.clearObjective();
  S.cine(true); await S.fadeOut(0.6);
  clara.stopWalk(); clara.place(hd.x + 3.2, hd.z + 1.6, -Math.PI / 2);
  p.place(hd.x + 3.4, hd.z - 0.1, -Math.PI / 2); G.onFrame(0);
  const marta = S.cast('marta', npc(LOOK.marta(), hd.x + 0.2, hd.z - 0.7, Math.PI / 2, { watch: false }));
  const daniel = S.cast('daniel', npc(LOOK.daniel(), hd.x + 0.2, hd.z + 0.8, Math.PI / 2, { watch: false, weapon: 'lantern' }));
  const lily = S.cast('lily', npc(LOOK.lily(18), hd.x + 0.9, hd.z, Math.PI / 2, { watch: false }));
  await S.shot(V3(hd.x + 1.8, 1.9, hd.z + 4.6), V3(hd.x + 1.8, 1.1, hd.z), 0); await S.fadeIn(0.8);
  lily.walkTo([V3(p.pos.x - 0.8, 0, p.pos.z + 0.2)], 3);
  await S.say('lily', 'Abi!');
  marta.model.setUpper('cry');
  await S.wait(0.6);
  daniel.walkTo([V3(p.pos.x - 1.0, 0, p.pos.z + 0.9)], 2);
  await S.say('daniel', 'Ben alırım. Ver onu bana.');
  await S.say('lily', 'Ne oldu? Enkron\'un var mı? Abi? Söylesene!');
  await S.shot(V3(p.pos.x - 1.6, 1.65, p.pos.z - 1.4), V3(p.pos.x, 1.45, p.pos.z), 1);
  await S.say('joseph', 'Var, Lily.');
  await S.say('joseph', 'Sadece... biraz ağır geldi.');
  await S.wait(0.8);
  G.onFrame = null;
  await S.fadeOut(2);
});

Story.def('c1_system', { chapter: 'Bölüm 1 · Taban', title: 'Sistem', sub: 'O gece', kind: 'Hikâye' }, async S => {
  const L = await S.level(() => buildHut('dark'), 'interiorNight', { sunDir: [0.2, 0.5, -0.85], noSky: true, hemi: 0.7, sun: 0.8 });
  S.amb('interior'); S.music('none');
  const p = spawnJoseph(18, -2.5, -1.15, 0); p.model.setStance('lie', true); p.lockY = 0.455; p.solid = false; p.collides = false;
  const lily = npc(LOOK.lily(18), 2.6, -1.85, 0, { stance: 'lie', watch: false }); lily.lockY = 0.38; lily.model.closedEyes = true; lily.solid = false; lily.collides = false; S.cast('lily', lily);
  S.cine(true);
  Screen.set({ vig: 0.7, sat: 0.7 }, true);
  await S.shot(V3(-1.6, 2.3, -0.1), V3(-2.5, 0.6, -1.6), 0);
  await S.fadeIn(2.5);
  await S.think('Herkes uyudu. Artık bakabilirim.');
  await S.shot(V3(-2.5, 1.05, -1.9), V3(-2.4, 2.6, -1.2), 1.5);
  S.music('system'); Screen.set({ vig: 0.9 });
  await UI.system([
    '<div class="h">ENKRON SAHİBİ TESPİT EDİLDİ</div>',
    '<div class="row"><span>Senkronizasyon</span><b>%100</b></div>',
    '<div class="row"><span>Kullanıcı</span><b>Joseph</b></div>',
    '<div class="row"><span>Seviye</span><b>1</b></div>',
    '<div class="row"><span>MP</span><b>3 / 3</b></div>',
    '<div class="stats"><div><small>STR</small><b>0</b></div><div><small>AGI</small><b>0</b></div><div><small>VIT</small><b>0</b></div><div><small>PER</small><b>0</b></div><div><small>INT</small><b>0</b></div></div>',
    '<div class="row warn"><span>Durum</span><b>ZAYIFLAMIŞ</b></div>',
    '<div class="dim">Bedensel kapasite: normal bir insanın %50\'si</div>',
    '<div class="row reveal"><span>Sınır</span><b>YOK</b></div>',
  ], { speed: 420 });
  await S.think('Seviye. Statlar. Durum. Bir oyunun ekranı gibi.');
  await S.think('Hayır. Bu bir sözleşme.');
  await S.think('Tobias Dede, Enkron\'un asla büyümediğini söylemişti. Ama bu ekran "sınır yok" diyor.');
  await S.wait(0.6);
  await UI.system([
    '<div class="h">GÜNLÜK GÖREV · Bedenin Uyanışı</div>',
    '<div class="row"><span>Koşu</span><b>0 / 10 km</b></div>',
    '<div class="row"><span>Şınav</span><b>0 / 100</b></div>',
    '<div class="row"><span>Mekik</span><b>0 / 100</b></div>',
    '<div class="row"><span>Squat</span><b>0 / 100</b></div>',
    '<div class="row"><span>Kalan süre</span><b>23:59:59</b></div>',
    '<div class="row warn"><span>Başarısızlık cezası</span><b>???</b></div>',
  ], { speed: 380 });
  p.model.play('reach', 0.4);
  await S.shot(V3(-1.9, 1.1, -1.0), V3(-2.4, 0.7, -1.4), 1.5);
  await S.think('Kolumu bile kaldıramıyorum. On kilometre mi?');
  await S.think('Her sözleşmenin bir ceza maddesi vardır. Soru işaretiyle yazılmış bir ceza maddesi ise her zaman en kötüsüdür.');
  await S.think('Bunu kimse bilmemeli. Ne annem, ne Lily... ne de Nora.');
  await S.say('lily', '...mm... abi...');
  await S.shot(V3(-1.2, 2.6, 0.8), V3(-2.5, 0.5, -1.5), 3);
  await S.think('Yarın. Yarın kalkacağım.');
  await S.wait(1);
  await S.fadeOut(2.5);
});
