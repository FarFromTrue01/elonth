// ---------- Ortak sahne yardımcıları ----------
function spawnJoseph(age, x, z, f = 0, o = {}) {
  const p = new Player(LOOK.joseph(age, o.look || {}));
  p.place(x, z, f); G.player = p; CAST.joseph.actor = p; CAST.thought.actor = null; p.age = age;
  $('#agebadge').textContent = age + ' yaş';
  Cam.follow(p, true); return p;
}
function onGround(a) { a.lockY = null; }
async function lilyLead(S, lily, pts, near = 6.5, speed = 2.6) {
  for (const p of pts) {
    await S.until(() => distXZ(G.player.pos, lily.pos) < near);
    lily.lookAt(null);
    await S.walk(lily, [p], speed);
    lily.lookAt(G.player);
  }
}

// ======================= PROLOG =======================
Story.def('p_crash', { chapter: 'Prolog', title: 'Yağmur', sub: 'Son gece', kind: 'Sinematik', noSkip: true }, async S => {
  const L = await S.level(buildRoad, 'storm', { weather: 'storm' });
  const car = makeCar(); L.add(car); car.rotation.y = Math.PI;
  const truck = makeTruck(); L.add(truck); truck.rotation.y = 0; truck.visible = false;
  const st = { z: 40, v: 31, sw: 0, roll: 0, tz: -300, tv: 0, tx: -1.9, spin: 0 };
  L.anims.push(dt => {
    st.z -= st.v * dt;
    if (st.z < -300) { st.z += L.period; st.tz += L.period; Cam.pos.z += L.period; Cam.look.z += L.period; Cam.fromPos.z += L.period; Cam.fromLook.z += L.period; }
    car.position.set(1.9 + st.sw, 0, st.z); car.rotation.set(0, Math.PI + st.spin, st.roll);
    if (truck.visible) { st.tz += st.tv * dt; truck.position.set(st.tx, 0, st.tz); }
  });
  G.env.flashFn = () => setTimeout(() => Audio.sfx('thunder', 0.8), 300 + Math.random() * 500);
  S.cine(true); S.amb('rain'); S.amb('wind'); S.music('none');
  const front = () => V3(car.position.x + 2.6, 0.75, car.position.z - 7.5), carC = () => V3(car.position.x, 0.75, car.position.z);
  await S.shot(front, carC, 0);
  await S.wait(0.6);
  await S.fadeIn(2.5);
  await S.wait(1.5);
  await S.say('marcus', 'Kazandın! Jüri neredeyse ayağa kalkıp seni alkışlayacaktı, farkında mısın?');
  await S.say('lawyer', 'Farkındayım, Marcus. On iki yıldır aynı alkışı duyuyorum.');
  await S.shot(() => V3(car.position.x - 1.2, 2.6, car.position.z + 9), () => V3(car.position.x, 0.6, car.position.z - 12), 0);
  await S.say('marcus', 'Kutlamaya gel. Herkes seni bekliyor.');
  await S.say('lawyer', 'Yorgunum. Eve gidiyorum.');
  await S.say('marcus', 'Eve mi? Evde seni bekleyen kim var ki?');
  S.sfx('ui', 0.4);
  await S.wait(1.2);
  await S.shot(() => V3(car.position.x + 6, 4, car.position.z + 2), carC, 0);
  await S.say('lawyer', 'Haklıydı. Otuz altı yaşındaydım. Kaybettiğim tek bir dava yoktu.', { thought: true });
  await S.say('lawyer', 'Ama bir kez olsun kapımı açtığımda içeriden biri adımı söylememişti.', { thought: true });
  // kamyon
  st.tz = car.position.z - 150; st.tv = 24; truck.visible = true;
  await S.shot(() => V3(car.position.x - 0.35, 1.12, car.position.z + 0.35), () => V3(car.position.x - 1.2, 0.9, car.position.z - 30), 0);
  G.env.flash(1); Audio.sfx('thunder');
  await S.wait(1.4);
  S.sfx('horn');
  const t0 = G.t;
  L.anims.push(dt => { if (truck.visible && st.tz > car.position.z - 70) st.tx = damp(st.tx, 1.7, 1.6, dt); });
  await S.say('lawyer', 'Ne...?');
  await S.until(() => st.tz > car.position.z - 45 || Story.skipping);
  G.timeScale = 0.3; Screen.set({ sat: 0.6 });
  L.anims.push(dt => { st.sw = damp(st.sw, 3.6, 2.2, dt); st.spin = damp(st.spin, -0.7, 2, dt); st.roll = damp(st.roll, 0.12, 2, dt); });
  S.sfx('skid');
  await S.shot(() => V3(car.position.x + 5, 1.6, car.position.z - 5), carC, 0);
  await S.wait(0.45);
  Audio.sfx('crash'); Screen.addShake(1.2); G.env.flash(1);
  await UI.fade(1, 0.05); $('#fade').style.background = '#fff';
  G.timeScale = 1; await S.wait(0.6);
  $('#fade').style.transition = 'background 1.5s'; $('#fade').style.background = '#000';
  Audio.stopAmbience();
  await S.wait(1.6);
  $('#fade').style.transition = ''; Screen.reset();
  for (let i = 0; i < 3; i++) { S.sfx('heart', 1 - i * 0.25); await S.wait(1.1 + i * 0.4); }
  await S.narr('Son düşüncem bir pişmanlıktı.');
  await S.narr('Keşke biri için yaşasaydım.');
  await S.wait(1.2);
  await S.say({ name: '???', color: '#f4a9bb' }, '...abi?');
  await S.say({ name: '???', color: '#eab48e' }, 'Tanrım, lütfen... lütfen onu bana geri ver...');
  await S.wait(0.8);
  G.env.flashFn = null;
});

Story.def('p_wake', { chapter: 'Prolog', title: 'Uyanış', sub: 'Yabancı bir beden', kind: 'Hikâye' }, async S => {
  const L = await S.level(() => buildHut('day'), 'interior', { sunDir: [0.25, 0.55, -0.8], noSky: true });
  S.amb('interior'); S.amb('fire');
  const p = spawnJoseph(10, -2.5, -1.25, 0); p.model.setStance('lie', true); p.lockY = 0.47; p.model.closedEyes = true; p.solid = false; p.collides = false;
  const marta = S.cast('marta', npc(LOOK.marta(), -1.55, -1.45, -Math.PI / 2, { stance: 'kneel', watch: false }));
  marta.model.setUpper('cry'); marta.pinned = true;
  const lily = S.cast('lily', npc(LOOK.lily(10), -2.45, 0.05, Math.PI, { watch: false }));
  const daniel = S.cast('daniel', npc(LOOK.daniel(), -1.6, 2.2, Math.PI, { watch: false, weapon: 'bucket' }));
  S.cine(true);
  Screen.set({ blur: 9, vig: 0.85, bright: 0.6 }, true);
  const eye = V3(-2.5, 0.95, -2.0);
  await S.shot(eye, V3(-2.3, 2.7, -1.3), 0);
  await S.fadeIn(3);
  S.music('sad');
  await S.wait(1.0);
  p.model.closedEyes = false;
  Screen.set({ blur: 4, bright: 0.85 });
  await S.shot(eye, V3(-1.75, 0.95, -1.5), 2.2);
  await S.say('lily', 'Anne! Anne, bak! Gözlerini açtı!');
  Screen.set({ blur: 1.2, vig: 0.5, bright: 1 });
  marta.model.setUpper(null); marta.lookAt(V3(-2.5, 0.8, -2.0));
  await S.say('marta', 'Joseph? Joseph, beni duyuyor musun, oğlum?');
  await S.think('Joseph mu? Kimden bahsediyor bu kadın?');
  Screen.set({ blur: 0, vig: 0.3 });
  await S.think('Onu tanımıyorum. Ama ağladığını görünce neden göğsüm sıkışıyor?');
  daniel.model.setWeapon(null); S.sfx('door'); S.sfx('splash', 0.6);
  await S.shot(V3(-3.05, 1.55, -0.3), V3(-1.6, 1.2, 2.2), 0.8);
  await S.say('daniel', 'Uyandı mı? Gerçekten uyandı mı?');
  S.walk(daniel, [V3(-1.2, 0, 0.6), V3(-1.55, 0, -0.25)], 2.6);
  await S.shot(V3(-0.5, 1.7, -2.55), V3(-2.3, 0.75, -0.9), 1.6);
  daniel.faceTo(p); daniel.lookAt(p.root);
  await S.say('marta', 'İki hafta, Daniel. İki hafta ateşler içinde yattı...');
  lily.model.play('jump'); S.sfx('ui');
  await S.say('lily', 'Abim uyandı! Abim uyandı!');
  lily.model.play('jump');
  const c = await S.choice(['"...Su."', '"Siz... kimsiniz?"', '(Sessiz kal)']);
  if (c === 0) {
    await S.say('marta', 'Su! Tabii, tabii. Lily, koş, kupayı getir!');
    S.walk(lily, [V3(0.1, 0, 0.6)], 3); await S.wait(1.2); lily.model.setWeapon('cup'); await S.walk(lily, [V3(-2.45, 0, 0.05)], 3); lily.model.play('reach');
    await S.say('lily', 'Al abi. Yavaş iç, olur mu? Ben de hasta olunca annem hep öyle der.');
    lily.model.setWeapon(null);
  } else if (c === 1) {
    marta.model.play('flinch');
    await S.say('daniel', 'Ateş... hafızasını mı almış?');
    await S.say('marta', 'Önemli değil. Önemli değil, duydun mu? Ben annenim. Marta.');
    await S.say('marta', 'Bu baban, Daniel. Şu zıplayıp duran da kardeşin, Lily.');
    await S.say('lily', 'Beni unuttun mu abi? Ben Lily! Hani sana tahta at yapmıştın, sonra bacağı kırılmıştı...');
  } else {
    await S.wait(0.8);
    S.walk(lily, [V3(-2.1, 0, -0.9)], 2.5); await S.wait(0.7); lily.model.play('hug');
    await S.say('lily', 'Bir daha uyuma. Söz ver. Bir daha bu kadar uzun uyuma.');
  }
  await S.say('daniel', 'Rahibe Agnes "umut yok" demişti. Umut yokmuş! Ha!');
  daniel.model.play('laugh');
  await S.say('daniel', 'Bak şuna, Marta. Bize bakıyor. Gerçekten bakıyor.');
  // doğrul
  await S.fadeOut(0.5);
  p.place(-2.12, -1.3, Math.PI / 2); p.model.setStance('sit', true); p.lockY = 0.21;
  lily.place(-1.3, 0.2, -2.3); marta.place(-1.25, -1.9, -1.1); marta.model.setStance(null, true); marta.pinned = false;
  daniel.place(-0.9, -0.9, -1.6);
  for (const a of [lily, marta, daniel]) a.lookAt(p.root);
  await S.shot(V3(-1.55, 0.95, -1.05), V3(-2.12, 0.62, -1.3), 0);
  await S.fadeIn(0.6);
  p.model.play('reach'); p.model.act.hold = true; p.model.lookTarget = V3(-1.6, 0.55, -1.3);
  await S.shot(V3(-1.15, 1.0, -0.7), V3(-1.9, 0.62, -1.3), 1.5);
  await S.think('Bu eller... küçük. Bir çocuğun elleri.');
  await S.think('Yağmur. Kamyonun farları. Camın kırılma sesi.');
  await S.think('Ben... ölmüştüm.');
  p.model.act = null; p.model.lookTarget = null;
  await S.shot(V3(-0.2, 1.7, -0.2), V3(-2.0, 0.7, -1.3), 1.2);
  await S.say('marta', 'Kalkma hemen. Bacakların seni taşımaz, iki haftadır yemek yemedin.');
  await S.think('Biraz suya ihtiyacım var. Ve kim olduğuma bakmaya.');
  // kontrol
  await S.fadeOut(0.4);
  p.model.setStance(null, true); p.lockY = null; p.solid = true; p.collides = true; p.place(-1.7, -0.7, Math.PI * 0.8);
  marta.place(-0.9, 0.9, -2.2); marta.model.setStance('crossArms'); daniel.place(2.3, 1.75, -2.4); daniel.model.setStance('crossArms', true);
  lily.place(-1.0, -0.2, -2.0);
  S.cine(false); p.speedMul = 0.55; p.allowRun = false; Cam.yaw = 0.15; Cam.pitch = 0.5;
  await S.fadeIn(0.5);
  S.objective('Leğene git ve suya bak', L.pts.basin);
  S.tip('Sol tarafa dokunup sürükle: yürü · Sağ tarafı sürükle: kamerayı çevir', 6000);
  lily.follow = p; lily.followDist = 1.4;
  await S.interact(L.pts.basin, 'Suya bak', 1.2);
  S.clearObjective(); lily.follow = null;
  S.cine(true); p.faceNow(V3(1.25, 0, -2.6));
  p.model.play('pickup'); await S.wait(0.5); p.model.act.hold = true;
  await S.shot(V3(1.15, 0.9, -2.3), V3(1.25, 0.6, -2.55), 1.0);
  await S.wait(0.5);
  Screen.set({ sat: 0.75, wobble: 0.4 });
  const fx = p.pos.x + Math.sin(p.facing) * 0.5, fz = p.pos.z + Math.cos(p.facing) * 0.5;
  await S.shot(V3(fx, 0.62, fz), V3(p.pos.x, 0.95, p.pos.z), 1.4);
  p.model.act = null;
  await S.think('Siyah saçlar. Siyah gözler. Esmer, zayıf bir çocuk.');
  await S.think('Bu yüz benim değil.');
  await S.wait(0.8);
  await S.think('Ama artık... benim.');
  Screen.set({ sat: 1, wobble: 0 });
  await S.shot(V3(-0.3, 1.5, -0.6), V3(0.6, 0.8, -2.2), 1.0);
  lily.faceNow(p); lily.lookAt(p.root);
  await S.say('lily', 'Abi! Dışarı çıkalım mı? Güneş var! Annem izin verir, değil mi anne? Değil mi?');
  marta.lookAt(lily.root);
  await S.say('marta', 'Köyden uzaklaşmayın. Ve Joseph... yavaş ol. Olur mu?');
  p.model.play('nod');
  await S.say('joseph', 'Olur... anne.');
  marta.model.play('flinch');
  await S.wait(0.4);
  await S.say('marta', '...Git hadi. Git, güneşi gör.');
  S.cine(false); lily.follow = p;
  S.objective('Lily ile dışarı çık', L.pts.door);
  await S.interact(L.pts.door, 'Kapıyı aç', 1.3);
  S.sfx('door'); await S.fadeOut(0.6);
});

Story.def('p_village', { chapter: 'Prolog', title: 'Yeni Dünya', sub: 'Eros, köy tarafı', kind: 'Keşif' }, async S => {
  const L = await S.level(() => buildVillage({}), 'morning');
  S.amb('wind'); S.music('village');
  const d = L.pts.homeDoor;
  const p = spawnJoseph(10, d.x + 0.6, d.z + 0.6, Math.PI / 2); p.speedMul = 0.8;
  const lily = S.cast('lily', npc(LOOK.lily(10), d.x + 1.6, d.z - 0.6, Math.PI / 2));
  // köylüler
  seed(31);
  const wander = (x, z, f, r = 4) => { const w = new Wanderer({ look: randomVillager(rng() < 0.5) }); w.place(x, z, rnd(0, TAU)); w.home = V3(x, 0, z); w.homeR = r; return w; };
  const villagers = [wander(2, 6), wander(-3, -6), wander(8, -2), wander(-8, 10, 0, 3), wander(14, 2, 0, 5), wander(-4, 18, 0, 3), wander(20, -10, 0, 4), wander(-18, -10, 0, 4)];
  const ws = npc(randomVillager(true), 1.4, 1.2, -2.2, { stance: 'pickup' }); ws.model.setWeapon('bucket');
  const elder = S.cast('elder', npc(LOOK.elder(), L.pts.elder.x, L.pts.elder.z, -0.9, { stance: 'sit' })); elder.lockY = L.h(5.4, -3.2) + 0.0; elder.pinned = true; elder.solid = true; elder.collides = false;
  const kids = [];
  for (let i = 0; i < 3; i++) { const a = -0.9 + (i - 1) * 0.55, kx = 5.4 + Math.sin(a) * 1.9, kz = -3.2 + Math.cos(a) * 1.9; const k = npc(LOOK.kid(i === 1), kx, kz, a + Math.PI, { stance: 'sitGround', watch: false }); kids.push(k); k.lookAt(elder.root); }
  S.cast('kid', kids[1]);
  elder.watch = false; elder.lookAt(kids[1].root);
  S.cine(true);
  await S.shot(V3(d.x + 7, 3.2, d.z + 5), V3(d.x + 1, 1.0, d.z), 0);
  await S.fadeIn(1.2);
  UI.title('Eros · Köy tarafı', 'Yeni Dünya', 'Elonth Krallığı');
  await S.shot(V3(d.x + 4, 1.7, d.z + 2.5), V3(d.x + 0.6, 1.0, d.z + 0.2), 3.5);
  await S.wait(1.2);
  await S.think('Gerçek. Rüzgâr, toprak kokusu, uzaktaki çan sesi. Hepsi gerçek.');
  lily.lookAt(p.root);
  await S.say('lily', 'Gel abi! Meydana gidelim. Tobias Dede her sabah orada hikâye anlatıyor!');
  S.cine(false);
  lily.follow = p; lily.followDist = 1.8;
  S.tip('Joystick\'i sonuna kadar it: koş', 4500);
  S.objective('Köy meydanına git', V3(2, 0, -1));
  await S.reach(V3(2, 0, -1), 5);
  S.cine(true);
  await S.shot(V3(1.5, 2.2, 2.5), V3(5.4, 1.0, -3.2), 1.2);
  await S.say('elder', '...ve ejderha, şövalyeye dönüp şöyle demiş: "Benim hazinem altın değil, sabırdır."');
  await S.say('kid', 'Dede, bu hikâyeyi dün de anlattın!');
  await S.say('lily', 'Bak, Tobias Dede! Abim uyandı!');
  elder.lookAt(p.root);
  await S.say('elder', 'Ooo, kimler gelmiş! Ölüm meleğini kapıdan kovan çocuk!');
  S.cine(false);
  S.objective('Tobias Dede ile konuş', elder);
  await S.talkTo(elder, 'Konuş');
  S.clearObjective();
  S.cine(true); lily.follow = null;
  { const a = -0.9 + 0.95, jx = 5.4 + Math.sin(a) * 2.2, jz = -3.2 + Math.cos(a) * 2.2; p.place(jx, jz, a + Math.PI); lily.place(jx + 0.7, jz + 0.5, a + Math.PI); }
  p.model.setStance('sitGround'); lily.model.setStance('sitGround'); lily.lookAt(elder.root);
  await S.shot(V3(1.6, 1.5, 0.6), V3(4.6, 0.8, -2.0), 1.0);
  await S.say('elder', 'Otur bakalım. Bugün bu yumurcaklara Tanrı\'nın İradesi\'ni anlatıyordum.');
  await S.say('kid', 'On sekiz yaşına girince taşa dokunuyorsun, değil mi Dede?');
  await S.say('elder', 'Her yılın ilk günü, o yıl on sekizine basan herkes saraya çağrılır. Soylu da, köylü de. Taşa dokunursun ve Tanrı sana büyü bahşeder.');
  await S.say('elder', 'Ama bazılarına daha fazlası verilir. Yüz kişiden belki on kişiye. Buna Enkron denir.');
  await S.say('lily', 'Enkron ne yapıyor, Dede?');
  await S.say('elder', 'Kimse bilmez, küçüğüm. Yalnızca sahibi bilir. Kimininki ateş saçar, kimininki yaraları kapatır, kimininki hiçbir işe yaramaz gibi görünür. Ama Enkron\'u olanın kaderi değişir.');
  const asked = new Set();
  while (true) {
    const opts = ['Enkron güçlenebilir mi?', 'Enkron\'u olmayanlar ne yapar?', 'Rütbe ne demek?', 'Teşekkürler, Dede.'];
    const c = await S.choice(opts.map((o, i) => (asked.has(i) && i < 3 ? '· ' : '') + o));
    if (c === 3) break;
    asked.add(c);
    if (c === 0) {
      elder.model.play('laugh');
      await S.say('elder', 'Hah! Enkron doğduğu gibi ölür, evlat. Zayıflayabilir ama asla büyümez. Tanrı ne verdiyse odur.');
      await S.think('Değişmez bir yetenek. Doğuştan gelen bir hak. Ya da bir ceza.');
    } else if (c === 1) {
      await S.say('elder', 'Çoğu tarlasına döner. Cesur olanlar Maceracılar Loncası\'na yazılır. Lonca kimseye kapıyı kapatmaz, Enkron\'un olmasa bile.');
      await S.say('elder', 'Ama on gümüş ister. Bir köylü için bu, iki yıllık birikim demektir.');
    } else {
      await S.say('elder', 'Lonca herkesi G rütbesinden başlatır. G sıradan halktır, sayılmaz bile. Sonra F, E, D...');
      await S.say('elder', 'Bu köyde D rütbeli birine herkes eğilir. C rütbeli biri buraya gelse yolunu kendi ellerimizle süpürürdük.');
      await S.say('elder', 'B\'yi geç. A rütbeliler kralın sağ koludur. S\'ler krallar gibi yaşar. Ve SS...');
      await S.say('elder', 'Dünyada yalnızca üç tane var. Hiçbiri Elonth\'ta değil. Tanrıların gölgesi gibi dolaşırlar.');
      await S.think('Rütbeler. Kastlar. Doğuştan dağıtılan güç. Hukuk fakültesinde okuduğum her adaletsizlik burada kanun olarak yazılmış.');
    }
  }
  elder.model.play('nod'); p.model.setStance(null); lily.model.setStance(null);
  await S.say('elder', 'Hadi bakalım. Güneş yükselmeden kardeşine köyü göster. Ama yoldan uzak durun, bugün sarayın adamları geçiyor.');
  // şövalye geçişi
  const horse = spawnRider(LOOK.knight()); horse.place(-7, 34, Math.PI);
  S.sfx('horse');
  await S.shot(V3(p.pos.x + 2, 1.4, p.pos.z + 3), V3(-4, 1.5, 18), 1.0);
  await S.say('villager', 'Şövalye! Yol açın, şövalye geliyor!');
  for (const v of [...villagers, ws]) { v.stopWalk && v.stopWalk(); v.home = null; v.faceTo(V3(-3, 0, 10)); v.model.setStance(null); }
  lily.faceTo(V3(-3, 0, 12)); lily.model.play('pickup');
  await S.say('lily', 'Abi, eğil! Çabuk!');
  const ride = horse.walkTo([V3(-6, 0, 26), V3(-3, 0, 12), V3(-3.2, 0, 2), V3(-2.4, 0, -6), V3(1.2, 0, -14), V3(-1, 0, -30), V3(-2, 0, -64)], 6.5);
  const hornT = setInterval(() => Audio.sfx('horse', 0.8), 450);
  await S.shot(() => V3(p.pos.x + 3, 2.2, p.pos.z + 4.5), () => V3(horse.pos.x, 1.5, horse.pos.z), 0);
  await S.until(() => horse.pos.z < 8 || Story.skipping);
  for (const v of [...villagers, ws, lily]) v.model.play('bow', 0.5);
  await S.until(() => horse.pos.z < 2 || Story.skipping);
  FX.dust(V3(p.pos.x, 0.4, p.pos.z), 10, '#5a4a32'); S.sfx('splash');
  p.model.play('flinch');
  await S.wait(0.8);
  await S.shot(V3(p.pos.x - 2, 1.5, p.pos.z + 2.2), V3(p.pos.x, 1.0, p.pos.z), 0.6);
  await S.think('Başını kaldırmadı bile. Kimse kaldırmıyor.');
  await S.until(() => horse.pos.z < -40 || Story.skipping); clearInterval(hornT); horse.remove();
  for (const v of villagers) v.home = v.home || V3(v.pos.x, 0, v.pos.z);
  await S.say('lily', 'Üstün çamur oldu... Boş ver, annem yıkar. Hadi! Sana en sevdiğim yeri göstereceğim!');
  S.cine(false);
  S.objective('Lily\'yi takip et', lily);
  await lilyLead(S, lily, [V3(-8, 0, 4), V3(-15, 0, -6), V3(-22, 0, -19), V3(-27, 0, -29), V3(-30.3, 0, -34.2)]);
  await S.reach(L.pts.hillTop, 3.2);
  S.clearObjective();
  // tepe
  S.cine(true); S.music('title');
  lily.place(-30.3, -34.2, 2.85); lily.model.setStance('sitGround'); p.walkTo([V3(-31.3, 0, -34.6)], 1.2);
  const hy = L.h(-31, -35);
  await S.shot(V3(-32.5, hy + 2.4, -30.5), V3(-26, hy + 5, -70), 0);
  await S.shot(V3(-31.0, hy + 5.2, -36.5), V3(-12, hy + 8, -120), 5, easeInOut);
  p.model.setStance('sitGround'); p.faceNow(V3(-25, 0, -70));
  await S.shot(V3(-33.4, hy + 2.1, -29.4), V3(-24, hy + 3.2, -72), 0);
  await S.say('lily', 'Şurası Eros Sarayı. Lordlar orada yaşıyor. Hepsinin kendine ait bir yatağı varmış!');
  await S.say('lily', 'Bir gün ben de orada beyaz ekmek yiyeceğim.');
  await S.say('joseph', 'Beyaz ekmek mi?');
  await S.say('lily', 'Hiç yemedik ki! Ama bir kere fırının önünden geçerken kokusunu duymuştum.');
  await S.think('Önceki hayatımda beyaz ekmeği çöpe atardım.');
  await S.wait(0.6);
  lily.lookAt(p.root);
  await S.say('lily', 'Abi... bir daha uyumayacaksın, değil mi? O kadar uzun?');
  const c2 = await S.choice(['"Söz veriyorum."', '"Artık hiçbir yere gitmiyorum."']);
  await S.say('joseph', c2 === 0 ? 'Söz veriyorum.' : 'Artık hiçbir yere gitmiyorum.');
  lily.model.setStance('hugKnees');
  await S.say('lily', 'İyi. Çünkü sen uyurken annem her gece ağladı. Babam da ağladı ama gizli gizli.');
  await S.shot(V3(-30.4, hy + 1.7, -37.4), V3(-30.8, hy + 0.7, -34.4), 3);
  await S.think('Bu insanları tanımıyorum. Bir hafta önce yoktular.');
  await S.think('Ama onları ağlatan her şeyle savaşırım.');
  await S.wait(0.8);
  await S.fadeOut(1.5);
});

Story.def('p_window', { chapter: 'Prolog', title: 'Pencere', sub: 'İlk gece', kind: 'Hikâye' }, async S => {
  const L = await S.level(() => buildHut('night'), 'interiorNight', { sunDir: [0.2, 0.5, -0.85], noSky: true });
  S.amb('interior'); S.music('none');
  const p = spawnJoseph(10, -2.1, -0.4, Math.PI * 0.9); p.speedMul = 0.6; p.allowRun = false;
  const lily = npc(LOOK.lily(10), 2.6, -1.85, 0, { stance: 'lie', watch: false }); lily.lockY = 0.38; lily.model.closedEyes = true; lily.solid = false; lily.collides = false;
  S.cast('lily', lily);
  S.cine(true);
  await S.shot(V3(0.5, 2.2, 1.8), V3(-1.5, 0.7, -1), 0);
  await S.fadeIn(1.5);
  await S.think('Herkes uyudu. Ben uyuyamıyorum.');
  S.cine(false); Cam.yaw = 0.4;
  S.objective('Pencereye git', L.pts.window);
  await S.interact(V3(0, 0, -2.3), 'Dışarı bak', 1.4);
  S.clearObjective();
  S.cine(true); p.faceNow(V3(0, 0, -5)); p.model.setStance('behind');
  await S.shot(V3(0.6, 1.35, -0.9), V3(0, 1.5, -6), 1.2);
  S.music('title');
  await S.shot(V3(0.25, 1.4, -1.9), V3(0, 1.45, -6), 4);
  await S.think('Elonth. Eros. Lonca. Enkron.');
  await S.think('Yeni bir dünyanın kurallarını öğrenmek, bir dava dosyasını okumaya benziyor. Ama bu sefer müvekkil benim.');
  await S.think('Burası benim dünyam değil.');
  await S.wait(0.8);
  await S.say('lily', '...mm... abi...');
  p.model.setStance(null); p.faceNow(V3(2.6, 0, -1.8));
  await S.shot(V3(0.8, 1.6, -0.6), V3(2.6, 0.5, -1.9), 1.5);
  await S.think('...Ama ailem burada.');
  await S.wait(1);
  await S.fadeOut(2.2);
  S.music('none');
  UI.title('Prolog', 'Elonth', 'Tabandaki Çocuk');
  await S.wait(5.2);
  UI.title('Bölüm 1', 'Taban', 'Birkaç hafta sonra');
  await S.wait(5.2);
});
