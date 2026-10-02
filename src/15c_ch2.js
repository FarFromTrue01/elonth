// ---------- Bölüm 2 · Dipten (Arc 1: 4–7. bölümler) ----------
const SYS = {
  row: (a, b, cls = '') => `<div class="row ${cls}"><span>${a}</span><b>${b}</b></div>`,
  head: t => `<div class="h">${t}</div>`,
  dim: t => `<div class="dim">${t}</div>`,
  warn: t => `<div class="warn">${t}</div>`,
  stats: (s, d = {}) => '<div class="stats">' + ['STR', 'AGI', 'VIT', 'PER', 'INT'].map(k => `<div><small>${k}</small><b>${s[k] || 0}${d[k] ? ' <i style="color:#7ad87a;font-style:normal">+' + d[k] + '</i>' : ''}</b></div>`).join('') + '</div>',
};
// Dövüş döngüsü: kaybedersen tekrar dene
async function fightLoop(S, p, setup, isWin, o = {}) {
  while (true) {
    const st = setup();
    S.cine(false); S.music(o.music || 'battle'); combatOn(S, p, o.combat || {}); p.noDeath = true; p.downs = 0; p.hp = p.maxHp; p.stamina = p.staminaMax;
    if (o.objective) S.objective(o.objective);
    let res = 'lose';
    await S.until(() => { if (o.tick) o.tick(st); if (isWin(st)) { res = 'win'; return true; } if (p.downs > 0) return true; return false; });
    if (res === 'win') { combatOff(p); p.noDeath = false; S.clearObjective(); return st; }
    combatOff(p); S.clearObjective(); for (const e of [...G.enemies]) { e.removeRing && e.removeRing(); e.remove && e.remove(); } G.enemies.length = 0;
    S.sfx('fail'); await retryPrompt(S, o.failText || 'Yeniden denemeliyim.');
    S.cine(false); p.place(...(o.respawn || [p.pos.x, p.pos.z])); Screen.reset();
  }
}
const RAT_AI = (o = {}) => Object.assign({ moves: ['bite', 'bite', 'leap'], aggr: 1.1, speed: 3.3, circleR: 1.7, maxTokens: 2, cooldown: [0.9, 1.7], windMul: 1.05, poise: 0 }, o);

// ===== 4. Ceza =====
Story.def('c2_penalty', { chapter: 'Bölüm 2 · Dipten', title: 'Ceza', sub: '18 yaş · Tören sonrası', kind: 'Hikâye' }, async S => {
  let L = await S.level(() => buildHut('dark'), 'interiorNight', { sunDir: [0.2, 0.5, -0.85], noSky: true, hemi: 0.7, sun: 0.8 });
  S.amb('interior'); S.music('none');
  let p = spawnJoseph(18, -2.5, -1.15, 0); p.model.setStance('lie', true); p.lockY = 0.455; p.solid = false; p.collides = false;
  const lily = S.cast('lily', npc(LOOK.lily(18), 2.6, -1.85, 0, { stance: 'lie', watch: false })); lily.lockY = 0.38; lily.model.closedEyes = true; lily.solid = false; lily.collides = false;
  S.cine(true); Screen.set({ vig: 0.8, sat: 0.6 }, true);
  await S.shot(V3(-1.6, 2.3, -0.1), V3(-2.5, 0.6, -1.6), 0);
  await S.fadeIn(2.5);
  UI.title('Bölüm 2', 'Dipten', 'Ceza');
  await S.wait(3.5);
  await S.think('Gün doğuyor. Görevin süresi dolmak üzere ve ben bir parmağımı bile oynatamadım.');
  await S.shot(V3(-1.9, 1.0, -1.0), V3(-2.45, 0.75, -1.6), 2);
  await S.think('Dün gece denedim. Dirseğimi kaldırdım, kol geri düştü. Sanki içine kurşun dökmüşler.');
  await S.wait(0.6);
  await UI.system([
    SYS.warn('GÖREV BAŞARISIZ'), SYS.row('Bedenin Uyanışı', '0 / 4', 'warn'), SYS.dim('Reddedilen görevlerin bedeli ödenir.'),
    SYS.row('Ceza', 'UYGULANIYOR', 'warn'),
  ], { glitch: true, speed: 420 });
  S.sfx('collapse'); Screen.set({ blur: 3, gray: 0.5, vig: 1, wobble: 0.5 });
  p.model.setStance('lie'); await S.wait(1.4);
  await UI.system([
    SYS.head('İKİNCİ CEZA'), SYS.row('Bedensel kapasite', '%25', 'warn'), SYS.row('Durum', 'AĞIR ZAYIFLIK', 'warn'),
    SYS.stats({}), SYS.dim('Yürümek için destek gerekebilir.'), SYS.row('Sınır', 'YOK', 'reveal'),
  ], { speed: 380 });
  await S.think('Bir önceki cezanın yarısı kadar güçlüyüm. Bir kuru yaprak kadar.');
  await S.think('Tamam. Anladım. Bu şey beni pazarlığa çağırmıyor. Dayatıyor.');
  await S.fadeOut(2);
  // ---- çorba
  Screen.reset(); Screen.set({ vig: 0.5, sat: 0.8 }, true);
  L = await S.level(() => buildHut('day'), 'interior', { sunDir: [0.25, 0.55, -0.8], noSky: true });
  S.amb('interior'); S.amb('fire'); S.music('sad');
  p = spawnJoseph(18, -2.5, -1.15, 0); p.model.setStance('lie', true); p.lockY = 0.455; p.solid = false; p.collides = false;
  const lily2 = S.cast('lily', npc(LOOK.lily(18), -1.7, -0.75, Math.PI / 2, { stance: 'sit', watch: false })); lily2.lockY = 0.22; lily2.solid = false; lily2.collides = false; lily2.model.setWeapon('cup');
  const marta = S.cast('marta', npc(LOOK.marta(), 0.4, 1.1, Math.PI, { watch: false })); marta.model.setUpper('cry');
  S.cine(true);
  await S.shot(V3(-0.6, 1.5, 0.2), V3(-2.3, 0.7, -1.2), 0);
  await S.fadeIn(2);
  await S.say('lily', 'Abi, çorba. Annem sabah erkenden yaptı. Bir kaşık, sadece bir kaşık.');
  await S.say('joseph', '...Kolum kalkmıyor, Lily.');
  await S.say('lily', 'O zaman ben içiririm. Sen uyurken de ben içirmiştim, hatırlamazsın.');
  await S.shot(V3(-1.2, 1.0, -0.4), V3(-1.9, 0.75, -1.0), 1.5);
  lily2.model.play('reach'); S.sfx('ui');
  await S.say('lily', 'Tören günü senin yere düştüğünü gördüm. Herkes güldü. Ben bağıracaktım. Annem elimi tuttu.');
  await S.say('lily', 'Annem hiç ağlamaz abi. Dün gece ağladı.');
  await S.think('Dokuz yıl önce kimsem yoktu. Şimdi bu çocuğun elleri titriyor çünkü ben kalkamıyorum.');
  await S.think('Tamam. Tamam, Sistem. İster ceza de, ister dava. Kabul ediyorum.');
  await UI.system([SYS.head('GÜNLÜK GÖREV · Yenilendi'), SYS.row('Koşu', '0 / 10 km'), SYS.row('Şınav', '0 / 100'), SYS.row('Mekik', '0 / 100'), SYS.row('Squat', '0 / 100'), SYS.dim('Kalan süre: 23:59:59')], { speed: 320, auto: 4 });
  await S.say('joseph', 'Lily. Yarın sabah erken kalkacağım. Beni kapıya kadar götür.');
  await S.say('lily', 'Abi... kalkamıyorsun ki?');
  await S.say('joseph', 'O zaman sürünürüm.');
  await S.fadeOut(1.8);
  Screen.reset();
  // ---- sürünerek koşu
  L = await S.level(() => buildVillage({}), 'morning');
  S.amb('wind');
  const hd = L.pts.homeDoor;
  p = spawnJoseph(18, hd.x + 0.8, hd.z, Math.PI / 2); p.speedMul = 0.32; p.allowRun = false; p.weakWalk = true; p.model.setStance('weak');
  const lily3 = S.cast('lily', npc(LOOK.lily(18), hd.x + 0.6, hd.z + 1.4, Math.PI / 2, { stance: 'sitGround', watch: false }));
  S.cine(true);
  await S.shot(V3(hd.x + 4, 1.7, hd.z - 2.4), V3(hd.x + 0.8, 0.9, hd.z), 0);
  await S.fadeIn(1.2);
  UI.title('Ertesi sabah', 'Sürünerek', '');
  await S.wait(2.6);
  await S.say('lily', 'Abi, yavaş ol. Ben buradayım. Sayacağım, sen sadece yürü.');
  S.cine(false); Cam.yaw = Math.PI / 2 + Math.PI; Cam.dist = 4.6;
  const route = [V3(hd.x + 9, 0, hd.z - 2), V3(hd.x + 18, 0, hd.z + 2), V3(hd.x + 26, 0, hd.z - 1)];
  const lines = [['Kalk. Kalk. Bir adım daha.', 'Kustum. Çok iyi. Hâlâ nefes alıyorum, demek ki yapıyorum.'], ['Yirmi adım. Dün on yedi.', 'Dizlerim çözüldü. Yerde yatan bir adam hiç böyle kararlı görünmemiştir.'], ['Rakip kendi dünün. Eski dünyada bunu söyleyenlere gülerdim.', 'Bitti. Bu gün bitti. Yarın daha uzağa.']];
  for (let i = 0; i < route.length; i++) {
    const cp = checkpointMesh(L, route[i]); S.objective(`Yürü (${i}/${route.length})`, route[i]);
    if (i === 0) S.tip('Joystick\'le yavaşça ilerle. Beden titriyor; ağır yürüyor.', 5000);
    await S.until(() => distXZ(p.pos, route[i]) < 1.7); cp.parent.remove(cp); S.clearObjective(); S.sfx('checkpoint');
    S.cine(true); p.model.setStance('lieFace'); S.sfx('collapse'); p.weakWalk = false;
    await S.shot(V3(p.pos.x - 1.6, 0.7, p.pos.z + 1.6), V3(p.pos.x, 0.3, p.pos.z), 0.8);
    await S.think(lines[i][0]); S.sfx('gasp'); await S.wait(0.7); await S.think(lines[i][1]);
    p.model.setStance('weak'); p.weakWalk = true; S.cine(false); Cam.dist = 4.6;
  }
  S.cine(true); p.model.setStance('lieFace'); await S.shot(V3(p.pos.x + 2, 1.4, p.pos.z + 2.5), V3(p.pos.x, 0.4, p.pos.z), 1.2);
  await S.wait(1.5); await S.fadeOut(1.5);
  // ---- üç hafta
  L = await S.level(() => buildVillage({}), 'day');
  const p4 = spawnJoseph(18, 0, 3, Math.PI);
  const nora = S.cast('nora', npc(LOOK.nora(18), -1.4, 0.4, 0, { watch: false })), leo = S.cast('leo', npc(LOOK.leo(18), 1.6, 0.8, 0, { watch: false })), clara = S.cast('clara', npc(LOOK.clara(18), -0.2, -0.6, 0, { watch: false }));
  S.cine(true);
  await S.shot(V3(0.4, 1.6, 7), V3(0, 1.3, 1.6), 0);
  await S.fadeIn(1.2);
  UI.title('Üç hafta sonra', 'Normal bir insan', '');
  await S.wait(3);
  await UI.system([SYS.head('SİSTEM · DEĞERLENDİRME'), SYS.row('Bedensel kapasite', '%100', 'reveal'), SYS.row('Durum', 'ZAYIFLAMA KALKTI'), SYS.dim('Artık sıradan bir insan kadar güçlüsün.'), SYS.stats({})], { speed: 380 });
  await S.say('nora', 'Bir bakıyorum yürüyorsun, bir bakıyorum koşuyorsun. Ne yedin sen?');
  await S.say('joseph', 'Kendi yediğimi. Acı.');
  await S.say('leo', 'Hepimiz tören günü çok korktuk, biliyor musun? Clara iki gün konuşmadı.');
  await S.say('clara', 'Konuşmadım çünkü Tanrı\'yı suçlamak istemedim. Ama kızdım.');
  await S.say('joseph', 'Dinleyin. Üçünüzün de Enkron\'u var. Lonca sizi bekler. Kaydolun.');
  await S.say('nora', 'Sen?');
  await S.say('joseph', 'Ben gelirim. Bir gün. Ama benim yolum biraz daha uzun.');
  await S.say('nora', 'Yalnız mı çalışacaksın? Kafayı yedin mi sen?');
  await S.say('joseph', 'İşim bu, Nora. Sizi de bu işe bulaştırmak istemiyorum.');
  await S.think('Tek başına çalışmanın tek faydası var: yalnızca kendi yenilgilerinden sorumlu olursun.');
  await S.fadeOut(1.4);
});

// ===== 5. On Gümüş =====
Story.def('c2_fee', { chapter: 'Bölüm 2 · Dipten', title: 'On Gümüş', sub: '18 yaş · Kayıt', kind: 'Hikâye' }, async S => {
  let L = await S.level(() => buildHut('night'), 'interiorNight', { sunDir: [0.2, 0.5, -0.85], noSky: true });
  S.amb('interior'); S.amb('fire'); S.music('sad');
  let p = spawnJoseph(18, 0.3, 1.9, Math.PI); p.speedMul = 0.8;
  const daniel = S.cast('daniel', npc(LOOK.daniel(), -0.9, 0.9, -Math.PI / 2, { watch: false }));
  const marta = S.cast('marta', npc(LOOK.marta(), 1.5, 0.6, Math.PI / 2, { watch: false }));
  const lily = S.cast('lily', npc(LOOK.lily(18), 0.4, 0.2, 0, { watch: false }));
  S.cine(true); await S.shot(V3(0.9, 1.9, 3.3), V3(0.3, 0.9, 0.9), 0); await S.fadeIn(1.2);
  await S.think('Ceza bitti. Para bitmedi.');
  await S.say('joseph', 'Beş gümüşüm var. Bu ay işlerden iki gümüş daha çıktı. Yedi.');
  await S.say('daniel', 'Üç gümüş de benden. Ödünç. Faiz yok.');
  await S.say('joseph', 'Baba... bu sizin kışlık odun parası.');
  await S.say('daniel', 'Odunu yakacak başka bir şey buluruz. Oğlum, ben bunu sana borç olarak vermiyorum. Yatırım yapıyorum. Benim de avukatlığım olur arada.');
  lily.walkTo([V3(0.2, 0, 1.3)], 2);
  await S.say('lily', 'Benim de var. Okul parası. Abi, itiraz edemezsin! Bu sefer ben aldım kararı.');
  await S.say('joseph', 'Lily, ben...');
  await S.say('marta', 'Al, oğlum. Bu bir çocuğun hayali. Ona hayır demek hakkını sana vermiyoruz.');
  S.sfx('coin');
  await UI.system([SYS.head('KESE'), SYS.row('Birikim', '5 gümüş'), SYS.row('İşler', '+2 gümüş'), SYS.row('Daniel', '+3 gümüş'), SYS.row('Lily', '+2 gümüş (okul)'), SYS.row('Toplam', '12 gümüş', 'reveal')], { speed: 380, auto: 4 });
  await S.think('On iki gümüş. Eskiden bir dilim kekin bahşişi bundan fazlaydı. Şimdi bir ailenin kışı.');
  await S.fadeOut(1.5);
  // ---- Eros
  L = await S.level(() => buildEros({}), 'day');
  S.amb('crowd'); S.music('village');
  p = spawnJoseph(18, 0, 29, Math.PI);
  seed(15);
  for (let i = 0; i < 8; i++) { const w = new Wanderer({ look: rng() < 0.3 ? randomNoble(rng() < 0.5) : randomVillager(rng() < 0.5) }); const x = rnd(-14, 14), z = rnd(-6, 22); w.place(x, z, rnd(0, TAU)); w.home = V3(x, 0, z); w.homeR = 5; }
  S.cine(true); await S.shot(V3(6, 3.5, 33), V3(0, 3, 0), 0); await S.fadeIn(1);
  await S.think('Onlarca basamak, onlarca yüz. Hepsi bir şey almaya geliyor. Ben ise bir şeye girmeye.');
  S.cine(false); Cam.yaw = 0;
  S.objective('Lonca kapısına git', L.pts.guildDoor);
  await S.reach(L.pts.guildDoor, 2.2);
  S.clearObjective(); S.cine(true); await S.fadeOut(0.8);
  // ---- lonca iç
  L = await S.level(buildGuildInterior, 'interior', { sunDir: [0.3, 0.6, -0.4], noSky: true });
  S.amb('crowd'); S.music('village');
  p = spawnJoseph(18, 0, 4.8, Math.PI); p.speedMul = 0.85;
  const greta = S.cast('greta', npc(LOOK.greta(), 0, -4.6, 0, { watch: false, stance: 'behind' }));
  const garrick = S.cast('garrick', npc(LOOK.garrick(), 4.2, 3.4, Math.PI, { watch: false, stance: 'sit' })); garrick.lockY = 0; garrick.solid = false;
  const mira = S.cast('mira', npc(LOOK.mira(), -4.4, 3.2, 0, { watch: false, stance: 'sit' })); mira.lockY = 0; mira.solid = false;
  for (let i = 0; i < 5; i++) { const w = new Wanderer({ look: randomVillager(i % 2 === 0) }); w.place(rnd(-7, 7), rnd(-1, 4), rnd(0, TAU)); w.home = V3(rnd(-6, 6), 0, rnd(0, 4)); w.homeR = 2.2; }
  await S.shot(V3(0, 2.4, 6.2), V3(0, 1.4, -4), 0); await S.fadeIn(1);
  S.cine(false); Cam.yaw = Math.PI;
  S.objective('Greta\'ya git', L.pts.desk);
  await S.talkTo(greta, 'Konuş', 2.6);
  S.clearObjective(); S.cine(true); p.faceNow(greta); greta.faceTo(p);
  await S.shot(V3(1.4, 1.7, -1.5), V3(0, 1.4, -4.4), 0.8);
  await S.say('greta', 'Bir köylü çocuk daha. Ne istiyorsun?');
  await S.say('joseph', 'Kaydolmak istiyorum.');
  await S.say('greta', 'On gümüş. Peşin.');
  S.sfx('coin'); p.model.setWeapon('pouch');
  await S.say('greta', 'On iki var burada. İkisi fazla.');
  await S.say('joseph', 'Kalan iki gümüş yarın işe başlarken lazım olacak. Ekipman. Çizme.');
  greta.model.play('nod');
  await S.say('greta', 'Bu paranın arkasında kimler var, biliyorum evlat. Bir çiftçinin kışlık odunu. Bir kızın okulu. Saymama gerek yok.');
  await S.say('greta', 'Kayıt tamam. Rütben G. Panoda hep iş var; para azdır, çünkü senin gibi çok kişi bu kapıdan girdi ve kimse bir şey sormadı.');
  await S.say('greta', 'Bir kural: Kendinden büyük işleri alma. Ölenleri defterden silmek zorunda kalıyorum, ve ben bu işten nefret ediyorum.');
  p.model.setWeapon(null);
  await S.shot(V3(-2.0, 1.5, 3.2), V3(4.2, 1.0, 3.4), 1.0);
  garrick.lookAt(p.root); garrick.model.play('laugh');
  await S.say('garrick', 'Bir G daha. Kaç gün dayanır dersin, Mira?');
  mira.lookAt(p.root);
  await S.say('mira', 'Garrick, yeter. Herkes bir yerden başladı. Sen de bir zamanlar ahırlarda çöp taşıyordun.');
  await S.say('garrick', '...Ahır değil. Kışla.');
  await S.say('mira', 'İyi, kışla. Hoş geldin! Ben Mira. Lonca kapısında kimse yalnız dolaşmasın diye varım.');
  await S.shot(V3(p.pos.x + 1.0, 1.6, p.pos.z - 1.4), V3(p.pos.x, 1.3, p.pos.z), 0.8);
  S.sfx('system');
  await UI.system([SYS.head('LONCA KAYDI'), SYS.row('Rütbe', 'G'), SYS.row('Kayıt', 'Tamam'), SYS.dim('İlk Başarı: Tabandan girdin.'), SYS.stats({}, { STR: 1, VIT: 1 }), SYS.row('Seviye', '1  ·  XP 40 / 100')], { speed: 380 });
  await S.think('G rütbe. Zincirin en alt halkası. Ama zincir şimdi benim.');
  await S.fadeOut(1.5);
});

// ===== 6. G Görevleri =====
function chorePile(L, x, z, kind) {
  const g = new T.Group(); const box = (c, sx, sy, sz, px, py, pz, ry = 0) => { const m = new T.Mesh(prim('boxb'), TOON.mat(c, { gradientMap: TOON.gradSoft })); m.scale.set(sx, sy, sz); m.position.set(px, py, pz); m.rotation.y = ry; m.castShadow = true; g.add(m); };
  if (kind === 'hay') { for (let i = 0; i < 6; i++) box(pick(['#d4b45a', '#c8a84a', '#dcc070']), 0.9, 0.45, 0.5, (i % 3) * 0.95 - 0.95, Math.floor(i / 3) * 0.45, (i % 2) * 0.3); box('#6a4a2a', 3.4, 0.9, 0.12, 0, 0, -0.7); box('#6a4a2a', 0.12, 0.9, 1.5, -1.7, 0, -0.1); }
  if (kind === 'butcher') { box('#6a4a2a', 2.6, 0.9, 1.2, 0, 0, 0); box('#8a2a2a', 2.4, 0.04, 1.1, 0, 0.9, 0); for (let i = 0; i < 3; i++) { box('#4a3422', 0.08, 1.6, 0.08, -1.0 + i, 0, -1.0); box('#c8706a', 0.3, 0.7, 0.2, -1.0 + i, 0.6, -1.0); } box('#7a5a3a', 0.8, 0.55, 0.8, 1.6, 0, 0.8); }
  if (kind === 'step') { box('#9a9080', 3.0, 0.2, 1.4, 0, 0, 0); box('#a89e8e', 2.6, 0.2, 1.1, 0, 0.2, -0.1); box('#5a3e28', 1.2, 2.0, 0.12, 0, 0.4, -0.7); for (let i = 0; i < 5; i++) { const m = new T.Mesh(new T.CircleGeometry(0.12, 6), new T.MeshBasicMaterial({ color: '#8a7a3a' })); m.rotation.x = -Math.PI / 2; m.position.set(rnd(-1, 1), 0.41, rnd(0, 0.5)); g.add(m); } }
  g.position.set(x, L.h(x, z), z); L.add(g); L.addBox(x, z, 1.6, kind === 'step' ? 0.8 : 0.9); return g;
}
Story.def('c2_chores', { chapter: 'Bölüm 2 · Dipten', title: 'G Görevleri', sub: '18 yaş · İlk iş', kind: 'Oynanış' }, async S => {
  const L = await S.level(() => buildEros({}), 'day');
  S.amb('crowd'); S.music('village');
  const p = spawnJoseph(18, 0, -10, 0); p.speedMul = 0.9;
  seed(25);
  for (let i = 0; i < 9; i++) { const w = new Wanderer({ look: rng() < 0.3 ? randomNoble(rng() < 0.5) : randomVillager(rng() < 0.5) }); const x = rnd(-14, 14), z = rnd(-6, 22); w.place(x, z, rnd(0, TAU)); w.home = V3(x, 0, z); w.homeR = 5; }
  const spots = { hay: V3(-14, 0, 13), butcher: V3(14, 0, 12), step: V3(-13.4, 0, -10) };
  chorePile(L, spots.hay.x, spots.hay.z, 'hay'); chorePile(L, spots.butcher.x, spots.butcher.z, 'butcher'); chorePile(L, spots.step.x, spots.step.z, 'step');
  S.cine(true); await S.shot(V3(3, 2.2, -6.5), V3(6.2, 1.5, -13.2), 0); await S.fadeIn(1);
  UI.title('Bölüm 2', 'G Görevleri', 'Eros loncası panosu');
  await S.wait(3.2);
  await S.think('Pano: Ahır temizliği, on beş bronz. Kasap avlusu, yirmi bronz. Kapı önü, on bronz.');
  await S.think('Toplam kırk beş bronz. Bir gün. Eski hayatımda bu rakamı bir kahveye bile bırakmazdım.');
  S.cine(false); Cam.yaw = 0;
  let earned = 0;
  const work = async (spot, label, n, cname) => {
    S.objective(cname, spot); await S.reach(spot, 2.4);
    for (let i = 0; i < n; i++) {
      UI.counter(`${cname} · ${i}/${n}`);
      await S.interact(V3(spot.x + (i % 2 ? 0.7 : -0.7), 0, spot.z + 1.4), label, 1.6);
      p.faceNow(V3(spot.x, 0, spot.z)); p.model.play('pickup'); S.sfx(cname.includes('süpür') ? 'whoosh' : 'wood');
      await S.wait(1.0);
    }
    UI.counter(null); S.clearObjective();
  };
  // ahır
  await work(spots.hay, 'Samanı yığ', 4, 'Ahır temizliği');
  earned += 15; UI.toast('+15 bronz  ·  Toplam ' + earned, 2400); S.sfx('coin');
  // kasap avlusu: Victor
  S.objective('Kasap avlusu', spots.butcher); await S.reach(spots.butcher, 3.0);
  S.cine(true);
  const victor = S.cast('victor', npc(LOOK.victor(18), spots.butcher.x - 6, spots.butcher.z + 5, Math.PI * 0.7, { watch: false })), bram = S.cast('bram', npc(LOOK.bram(18), spots.butcher.x - 6.8, spots.butcher.z + 6, 1.2, { watch: false })), osric = S.cast('osric', npc(LOOK.osric(18), spots.butcher.x - 5.4, spots.butcher.z + 6.3, 0.6, { watch: false }));
  await S.shot(V3(spots.butcher.x + 3, 1.7, spots.butcher.z + 4.5), V3(spots.butcher.x - 4, 1.4, spots.butcher.z + 4), 0.8);
  await S.say('victor', 'Bak, bak. Köylünün lonca tulumu da kasap önlüğüne dönüşmüş.');
  await S.say('bram', 'Ne kadar da yakışmış.');
  victor.walkTo([V3(spots.butcher.x - 1.8, 0, spots.butcher.z + 2.4)], 1.8);
  await S.wait(1.6);
  await S.say('victor', 'G rütbe. Evet duydum. Isolde\'nin gölgesine bile yaklaşamazsın, dilersen bana bir kova su getir de başlayalım.');
  await S.say('joseph', 'Kovalar kasabın. Bana kasap ödüyor, sen değil.');
  victor.model.play('push'); await S.wait(0.3); S.sfx('hit', 0.6); S.sfx('splash');
  await S.say('victor', 'Ah. Dökülmüş. Bir daha sil bakalım.');
  victor.walkTo([V3(spots.butcher.x - 7, 0, spots.butcher.z + 6)], 2.1);
  await S.think('Sakin. Sakin ol. Avukat olsaydım, bu sahneyi mahkemede anlatırdım ve haklı çıkardım. Ama burada mahkeme yok.');
  S.cine(false); Cam.yaw = 0;
  await work(spots.butcher, 'Avluyu yıka', 3, 'Kasap avlusu');
  earned += 20; UI.toast('+20 bronz  ·  Toplam ' + earned, 2400); S.sfx('coin');
  // kapı önü: Mira
  S.objective('Soylu evi kapı önü', spots.step); await S.reach(spots.step, 3.0);
  S.cine(true);
  const mira = S.cast('mira', npc(LOOK.mira(), spots.step.x + 5, spots.step.z + 4, Math.PI * 1.2, { watch: false }));
  mira.walkTo([V3(spots.step.x + 1.8, 0, spots.step.z + 3.2)], 1.8);
  S.cine(false);
  await work(spots.step, 'Süpür', 3, 'Kapı önü süpür');
  S.cine(true);
  await S.shot(V3(spots.step.x + 3, 1.6, spots.step.z + 5), V3(spots.step.x + 0.8, 1.3, spots.step.z + 2.4), 0.8);
  await S.say('mira', 'Su iç. Üç saattir fırçayla uğraşıyorsun, güneşin altında. Kimse susuzluktan ölmemeli.');
  mira.model.setWeapon('cup'); mira.model.play('reach'); await S.wait(0.8);
  await S.say('joseph', 'Teşekkür ederim. Yani... teşekkür ederim.');
  await S.say('mira', 'Mira Ashford. E rütbeyim. Küçük işlerden başlayanları not alırım; bazıları büyüyor, bazıları vazgeçiyor. Sen ne olacaksın?');
  await S.say('joseph', 'Henüz bilmiyorum. Ama vazgeçmeyeceğim.');
  await S.say('mira', 'Bunu herkes söylüyor. Neyse. Çok şanslısın, çünkü bu kapının sahibi iyi bir adam. Her akşam çorbayı ona getiririm.');
  earned += 10; UI.toast('+10 bronz  ·  Toplam ' + earned, 2400); S.sfx('coin');
  await UI.system([SYS.head('GÖREV TAMAM · G Görevleri'), SYS.row('Kazanç', '45 bronz'), SYS.dim('Küçük bir kaleden büyük bir ev yapılır.'), SYS.row('XP', '+50'), SYS.row('Seviye', '1  ·  XP 90 / 100')], { speed: 380, auto: 3.5 });
  await S.think('Kırk beş bronz. Yarın üçünü birden alırsam altmış. Altmış, Lily\'nin bir aylık defteri.');
  await S.fadeOut(1.5);
});

// ===== 7. Fareler =====
Story.def('c2_rats', { chapter: 'Bölüm 2 · Dipten', title: 'Fareler', sub: '18 yaş · Üç sözleşme', kind: 'Savaş' }, async S => {
  let L = await S.level(buildGuildInterior, 'interior', { sunDir: [0.3, 0.6, -0.4], noSky: true });
  S.amb('crowd'); S.music('village');
  let p = spawnJoseph(18, -5.4, -1.0, -Math.PI / 2); p.speedMul = 0.9;
  const greta = S.cast('greta', npc(LOOK.greta(), 0, -4.6, 0, { watch: false, stance: 'behind' }));
  const garrick = S.cast('garrick', npc(LOOK.garrick(), 4.2, 3.4, Math.PI, { watch: false, stance: 'sit' })); garrick.lockY = 0; garrick.solid = false;
  const mira = S.cast('mira', npc(LOOK.mira(), 4.9, 2.4, Math.PI, { watch: false, stance: 'sit' })); mira.lockY = 0; mira.solid = false;
  S.cine(true); await S.shot(V3(-2.6, 1.7, 3.0), V3(-7.8, 1.5, -1.0), 0); await S.fadeIn(1.2);
  UI.title('Bölüm 2', 'Fareler', 'Değirmen, mahzen, kanal');
  await S.wait(3);
  await S.think('G pano. Üç sözleşme: Değirmen fareleri, altmış bronz. Mahzen örümcekleri, seksen bronz. Kanal fare yuvası, bir gümüş yirmi bronz.');
  await S.think('Seviye iki, üç, dört. Fareler benim ilk basamak taşlarım.');
  const iso = S.cast('isolde', npc(LOOK.isolde(), 0, 6.0, Math.PI, { watch: false })), row = S.cast('rowena', npc(LOOK.rowena(), 1.2, 6.8, Math.PI, { watch: false }));
  S.sfx('door');
  await S.shot(V3(-4.4, 1.7, -1.4), V3(0, 1.5, 5.4), 1);
  S.walk(iso, [V3(-1.4, 0, 2.2), V3(-3.6, 0, -0.4)], 1.5); S.walk(row, [V3(-0.2, 0, 3.0), V3(-4.2, 0, -1.2)], 1.5);
  await S.wait(2.0);
  await S.say('rowena', 'Hah! Bak, Isolde, bizim G\'miz fare avına çıkıyor. Kulübe iyi bir isim olur: "Kasap Kediler".');
  await S.say('isolde', 'Fareler, kanal fareleri, mahzen örümcekleri. Sabırsız bir beden yerine temkinli bir akıl gerek. Sende hangisi var?');
  await S.say('joseph', 'Önce ikisini deneyeceğim. Üçüncüsüne hazır olduğumda gideceğim.');
  await S.say('isolde', '...İlginç. Hayatta kalırsan konuşuruz.');
  iso.walkTo([V3(0, 0, 4.4), V3(0, 0, 10)], 1.5); row.walkTo([V3(1.2, 0, 6.8), V3(1.2, 0, 11)], 1.5);
  await S.say('mira', 'Dikkat et. Mahzen örümcekleri küçük görünür ama ısırığı iki gün ateş verir. Al şu merhemi, Greta\'dan emanet.');
  await S.say('greta', 'Sözleşme imzalandı. Üçünü birden alırsan, kimse yardım etmez. Biliyorsun değil mi?');
  await S.say('joseph', 'Biliyorum.');
  await S.fadeOut(1.0);
  // ---- değirmen
  Screen.reset();
  L = await S.level(() => buildDungeon('mill'), 'interior', { sunDir: [0.3, 0.6, 0.6], noSky: true });
  S.amb('wind');
  p = spawnJoseph(18, 0, 6.2, Math.PI); p.speedMul = 0.95; p.stamina = p.staminaMax;
  S.cine(true); await S.shot(V3(3.8, 2.4, 6.8), V3(0, 1.0, -2), 0); await S.fadeIn(1);
  await S.think('Değirmen. Un tozu, çürük tahıl kokusu. Ve sesler. Kemirme sesleri.');
  S.tip('SALDIR: art arda dokun. KAÇ: yerde halka belirince yuvarlan.', 5200);
  L.arena = { x: 0, z: 1.5, r: 6.6 };
  let st = await fightLoop(S, p, () => {
    const rs = []; for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.5; const r = creature('rat', Math.cos(a) * 3.2, Math.sin(a) * 3.2 - 1.2, a + Math.PI, { hp: 18, name: 'Fare', ai: RAT_AI() }); rs.push(r); r.activate(); }
    return { rs, wave2: false };
  }, st => {
    if (!st.wave2 && st.rs.filter(r => r.alive).length <= 1) { st.wave2 = true; for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + 1.2; const r = creature('rat', Math.cos(a) * 4.8, Math.sin(a) * 4.8 + 0.5, a + Math.PI, { hp: 18, name: 'Fare', ai: RAT_AI({ speed: 3.6 }) }); st.rs.push(r); r.activate(); } UI.toast('Daha fazlası geliyor!', 1800); }
    return st.rs.every(r => !r.alive);
  }, { objective: 'Fareleri temizle', failText: 'Daha dikkatli olmalıyım. Onlar sayıca üstün.', respawn: [0, 6.2] });
  S.cine(true); await S.wait(0.6); G.enemies.length = 0;
  S.sfx('coin'); UI.toast('+60 bronz', 2200);
  await UI.system([SYS.head('SÖZLEŞME TAMAM · Değirmen'), SYS.row('Ödül', '60 bronz'), SYS.row('XP', '+70'), SYS.row('Seviye', '2', 'reveal'), SYS.stats({ VIT: 1 }, { STR: 1, AGI: 1 }), SYS.dim('Her seviye 1 stat puanı. Dağıtım otomatik.')], { speed: 380, auto: 4 });
  await S.think('Seviye iki. Küçücük bir adım. Ama attığım ilk adım değil; sekizinci.');
  await S.fadeOut(1);
  // ---- mahzen
  L = await S.level(() => buildDungeon('cellar'), 'interior', { sunDir: [0.3, 0.6, 0.6], noSky: true, hemi: 0.85, sun: 0.7 });
  S.amb('interior');
  p = spawnJoseph(18, 0, 6.2, Math.PI); p.speedMul = 0.95;
  S.cine(true); await S.shot(V3(3.0, 2.0, 6.8), V3(0, 1.0, 0), 0); await S.fadeIn(1);
  await S.think('Mahzen. Örümcek ağları ışıkta yalpalıyor. Ağ varsa, hemen yakınlarda bir avcı da var.');
  L.arena = { x: 0, z: 0.5, r: 6.8 };
  st = await fightLoop(S, p, () => {
    const rs = []; for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + 0.3; const r = creature('spider', Math.cos(a) * 3.8, Math.sin(a) * 3.8, a + Math.PI, { hp: 30, name: 'Örümcek', ai: RAT_AI({ moves: ['bite', 'leap'], speed: 2.8, heavyMove: 'leap', heavyChance: 0.3, circleR: 2.0, maxTokens: 2, cooldown: [1.2, 2.2], poise: 25 }) }); rs.push(r); r.activate(); }
    return { rs };
  }, st => st.rs.every(r => !r.alive), { objective: 'Örümcekleri temizle', failText: 'Isırıkları saymayı unuttum. Dikkat.', respawn: [0, 6.2] });
  S.cine(true); await S.wait(0.6); G.enemies.length = 0;
  S.sfx('coin'); UI.toast('+80 bronz', 2200);
  await UI.system([SYS.head('SÖZLEŞME TAMAM · Mahzen'), SYS.row('Ödül', '80 bronz'), SYS.row('XP', '+90'), SYS.row('Seviye', '3', 'reveal'), SYS.stats({ STR: 1, AGI: 1, VIT: 1 }, { VIT: 1, PER: 1 })], { speed: 380, auto: 4 });
  await S.fadeOut(1);
  // ---- kanal fare yuvası + Victor tehdidi
  L = await S.level(() => buildDungeon('canal'), 'interior', { sunDir: [0.3, 0.6, 0.6], noSky: true, hemi: 0.85, sun: 0.7 });
  S.amb('interior');
  p = spawnJoseph(18, -6.5, 17.5, Math.PI); p.speedMul = 0.95;
  S.cine(true); await S.shot(V3(-4.5, 2.4, 18.4), V3(0, 1.0, 4), 0); await S.fadeIn(1);
  await S.think('Kanal. Su akıntısı, rutubet, çürümüş ağaç. Ve fareler. Yuvanın ağzı sağ tarafta.');
  L.arena = { x: 1.5, z: 5.5, r: 8.2 };
  st = await fightLoop(S, p, () => {
    const rs = []; for (let i = 0; i < 6; i++) { const r = creature(i % 3 === 2 ? 'sewer' : 'rat', 5.2 + rnd(-0.8, 0.8), 6.5 + rnd(-2, 2), -2.0, { hp: 20, name: 'Kanal faresi', ai: RAT_AI({ speed: 3.5, maxTokens: 2 }) }); rs.push(r); if (i < 3) r.activate(); else r.waitT = 5 + i; }
    return { rs, t0: G.t };
  }, st => { for (const r of st.rs) if (r.alive && !r.active && G.t - st.t0 > r.waitT) r.activate(); return st.rs.every(r => !r.alive); },
    { objective: 'Yuvayı temizle', failText: 'Sayıca fazlalar. Yuvanın ağzında durmamalıyım.', respawn: [-6.5, 17.5] });
  S.cine(true); await S.wait(0.6); G.enemies.length = 0;
  S.sfx('coin'); UI.toast('+1 gümüş 20 bronz', 2400);
  await UI.system([SYS.head('SÖZLEŞME TAMAM · Kanal'), SYS.row('Ödül', '1 gümüş 20 bronz'), SYS.row('XP', '+110'), SYS.row('Seviye', '4', 'reveal'), SYS.stats({ STR: 2, AGI: 2, VIT: 2, PER: 1 }, { STR: 1, AGI: 1, PER: 1 }), SYS.dim('Bu bölümde 3 yeni seviye.')], { speed: 380, auto: 5 });
  await S.think('Seviye dört. Bir fare bile bana güç veriyor. Ama ne kadar süre?');
  await S.fadeOut(1.2);
  // ---- Eros kapısında: Victor
  L = await S.level(() => buildEros({}), 'dusk');
  S.amb('crowd'); S.music('village');
  p = spawnJoseph(18, 0, -8.5, 0);
  const nora = S.cast('nora', npc(LOOK.nora(18), -2.6, -10.2, 0.6, { watch: false })), vic = S.cast('victor', npc(LOOK.victor(18), 4.2, -9.6, -1.8, { watch: false })), bram = S.cast('bram', npc(LOOK.bram(18), 5.0, -9.0, -1.9, { watch: false }));
  S.cine(true); await S.shot(V3(0.4, 1.7, -4.2), V3(0, 1.4, -10.2), 0); await S.fadeIn(1);
  await S.say('nora', 'Joseph! Sen... iki gümüş bile bu kadar çabuk kazanamaz! Ben ilk F görevimde bir buçuk gün uğraştım.');
  await S.say('joseph', 'Sen bir başka sıradasın, Nora. Ben bodrum katından geliyorum.');
  await S.say('nora', 'Ben... ilk F görevim kurtlardı. İki gümüş. Kurtlar... Joseph, ben bugün ilk kez farkı hissettim. Seninle benim aramdaki fark değil. Benimle Isolde\'nin arasındaki fark.');
  vic.walkTo([V3(1.6, 0, -9.2)], 1.8); await S.wait(1.4);
  await S.say('victor', 'Hah! Köylü kız bir F alınca Isolde\'ye mi eş oldu? Ve sen, köylü, fareleri öldürüyormuşsun. Ne cesur.');
  await S.say('victor', 'Bak. Ben bir şey öğrendim: bir G\'nin parası benim sokağımda dolaşmaz. Yanlış bir gün, yanlış bir sokak...');
  await S.say('nora', 'Defol, Victor.');
  await S.say('victor', 'Enkron\'um bu gece uyanıyor, Nora. Yarın bana "defol" dediğine pişman olabilirsin.');
  S.sfx('laugh'); vic.walkTo([V3(8, 0, -3)], 2.2); bram.walkTo([V3(8, 0, -2)], 2.2);
  await S.think('Victor\'un Enkron\'u. Hepimiz gördük, kırmızı parlamıştı. Ne yaptığını bilmiyoruz. Bilmeyen kazanır mı, kaybeder mi?');
  await S.say('nora', 'Dikkat et, Joseph.');
  await S.fadeOut(1.4);
});

// ===== 8. Fare Kralı =====
Story.def('c2_king', { chapter: 'Bölüm 2 · Dipten', title: 'Fare Kralı', sub: '18 yaş · Final', kind: 'Savaş' }, async S => {
  let L = await S.level(buildGuildInterior, 'interior', { sunDir: [0.3, 0.6, -0.4], noSky: true });
  S.amb('crowd'); S.music('village');
  let p = spawnJoseph(18, 0, 3.4, Math.PI); p.speedMul = 0.9;
  const greta = S.cast('greta', npc(LOOK.greta(), 0, -4.6, 0, { watch: false, stance: 'behind' }));
  const garrick = S.cast('garrick', npc(LOOK.garrick(), 4.2, 3.4, Math.PI, { watch: false, stance: 'sit' })); garrick.lockY = 0; garrick.solid = false;
  const iso = S.cast('isolde', npc(LOOK.isolde(), -4.4, 2.2, 0.3, { watch: false })), row = S.cast('rowena', npc(LOOK.rowena(), -5.4, 1.4, 0.5, { watch: false })), ser = S.cast('seraphine', npc(LOOK.seraphine(), 6.8, -2.0, -1.4, { watch: false }));
  for (let i = 0; i < 4; i++) { const w = new Wanderer({ look: randomVillager(i % 2 === 0) }); w.place(rnd(-7, 7), rnd(-1, 4), rnd(0, TAU)); w.home = V3(rnd(-6, 6), 0, rnd(0, 3)); w.homeR = 2.2; }
  S.cine(true); await S.shot(V3(0, 2.2, 5.6), V3(0, 1.4, -4), 0); await S.fadeIn(1.2);
  UI.title('Bölüm 2 · Final', 'Fare Kralı', 'Kanalın altında');
  await S.wait(3.2);
  await S.say('greta', 'Fare Kralı. Köpek büyüklüğünde, akıllı. Aylardır kimse almıyor. İki G sakatlandı. Ödül üç gümüş.');
  await S.say('garrick', 'Üç gümüş mü? Ben bile almam. Bir köylü almaz, almamalı.');
  await S.say('joseph', 'Alıyorum.');
  greta.model.play('nod'); await S.wait(0.5);
  await S.say('greta', '...Kaşımı kaldırdım, değil mi? Evet. Peki. Kaydı yazıyorum.');
  iso.lookAt(p.root); row.lookAt(p.root);
  await S.say('rowena', 'Ödül üç gümüş, cenaze masrafı sekiz. Hesaplayan var mı?');
  await S.say('isolde', 'Bu iş eğlence değil, Rowena. Gülmüyorum.');
  await S.shot(V3(5.6, 1.7, 1.0), V3(6.8, 1.5, -2.0), 1);
  ser.lookAt(p.root); await S.wait(1.2);
  await S.say('seraphine', '...');
  await S.think('Seraphine bana bakıyor. Yalnızca bakıyor. Ne düşündüğünü okuyamıyorum. Ve bu yüzden ürkütücü.');
  await S.fadeOut(1.0);
  // ---- hazırlık: gözlem
  Screen.reset();
  L = await S.level(() => buildDungeon('canal'), 'interior', { sunDir: [0.3, 0.6, 0.6], noSky: true, hemi: 0.85, sun: 0.7 });
  S.amb('interior');
  p = spawnJoseph(18, -6.5, 17.5, Math.PI); p.speedMul = 0.95;
  const trapC = V3(1.0, 0, -14.2), trapR = 3.0, leverP = L.pts.lever;
  // tuzak levhası: paslı, çivili tahta
  const plate = new T.Group(); { const m = new T.Mesh(new T.CylinderGeometry(trapR, trapR, 0.05, 20), TOON.mat('#4a3a2a')); m.position.y = 0.03; plate.add(m); for (let i = 0; i < 30; i++) { const a = rnd(0, TAU), r = rnd(0.4, trapR - 0.3), n = new T.Mesh(new T.ConeGeometry(0.07, 0.24, 5), TOON.mat('#7a6a5a')); n.position.set(Math.cos(a) * r, 0.14, Math.sin(a) * r); plate.add(n); } plate.position.set(trapC.x, 0, trapC.z); L.add(plate); }
  const glow = new T.Mesh(new T.RingGeometry(trapR - 0.15, trapR, 32), new T.MeshBasicMaterial({ color: '#ff6a3a', transparent: true, opacity: 0.0, side: T.DoubleSide, depthWrite: false })); glow.rotation.x = -Math.PI / 2; glow.position.set(trapC.x, 0.06, trapC.z); L.add(glow);
  // yükselen su (vana açılınca)
  const flood = new T.Mesh(new T.PlaneGeometry(9, 12), MAT.water); flood.rotation.x = -Math.PI / 2; flood.position.set(trapC.x, 0.04, trapC.z); flood.visible = false; L.add(flood);
  S.cine(true); await S.shot(V3(-4.5, 2.6, 18.4), V3(0, 1.0, 2), 0); await S.fadeIn(1.2);
  await S.think('Kral... Ben çocukken kitapta okurdum: büyük bir hayvan, gücüyle değil alışkanlığıyla yenilir.');
  await S.shot(V3(-5.2, 2.0, 10.0), V3(0, 1.2, -3), 3);
  await S.think('Girişte kuru ayak izleri: sağ taraftan çıkıyor, kanalın ortasındaki tahta levhaya kadar yürüyor.');
  await S.think('Her seferinde levhanın üstünden geçmiş. Çünkü ışığı oradan görüyor. Bir alışkanlık.');
  await S.shot(V3(5.6, 2.2, -10), V3(5.6, 1.0, -16.8), 2);
  await S.think('Şu vana. Çarkı açarsam üst kanaldan su dolar. Kral levhanın üstündeyken açarsam...');
  await S.think('Beni takip etsin. Levhanın üstünden geçsin. Ben kolun yanında durayım.');
  S.cine(false); Cam.yaw = Math.PI; S.tip('Kolun yanında dur. Kral tuzak levhasına girince kol kendiliğinden çekilir. Üç kez!', 7000);
  // ---- savaş
  const king = (() => { const k = creature('king', 4.0, -6.0, 0, { hp: 260, name: 'Fare Kralı', ai: { moves: ['bite', 'swipe'], heavyMove: 'slam', heavyChance: 0.3, aggr: 1.0, speed: 2.6, circleR: 2.6, maxTokens: 1, cooldown: [1.6, 2.6], windMul: 1.1, poise: 90 } }); return k; })();
  king.hpBar = false;
  S.objective('Kral\'ı tuzak levhasına çek'); 
  L.arena = { x: 0, z: 3, r: 10.5 };
  let fails = 0, hits = 0, kingPhase = 0, rats = [], lastRatT = 0, trapT = 0, resolved = false;
  const fightWin = async () => {
    S.cine(false); S.music('battle'); combatOn(S, p); p.noDeath = true; p.downs = 0; p.hp = p.maxHp; p.stamina = p.staminaMax; Cam.dist = 7;
    UI.boss('Fare Kralı', 1); king.activate();
    glow.material.opacity = 0.0;
    const t0 = G.t; lastRatT = G.t;
    const lowAt = king.maxHp * 0.12;
    await S.until(() => {
      UI.boss('', king.hp / king.maxHp);
      glow.material.opacity = 0.25 + Math.sin(G.t * 5) * 0.12;
      // yardımcı fareler
      if (G.t - lastRatT > 22 && king.alive && rats.filter(r => r.alive).length < 3) { lastRatT = G.t; for (let i = 0; i < 2; i++) { const r = creature('rat', trapC.x + rnd(-5, 5), -9 + rnd(-2, 2), 0, { hp: 14, name: 'Fare', ai: RAT_AI({ speed: 3.4 }) }); rats.push(r); r.activate(); } UI.toast('Kral yardım çağırıyor!', 1600); }
      // tuzak: oyuncu kolun yanında ve Kral levhada
      trapT -= 1 / 60;
      const near = distXZ(p.pos, leverP) < 1.9, inTrap = king.alive && distXZ(king.pos, trapC) < trapR + 0.2;
      if (hits < 3 && near && inTrap && G.t - (king._flooded || -99) > 8) {
        hits++; king._flooded = G.t; flood.visible = true; flood.scale.set(1, 1, 1); flood.position.y = 0.04; S.sfx('splash'); S.sfx('hitHeavy'); Screen.addShake(0.7); UI.flashEdge('#7ad8ff');
        king.hp = Math.max(king.maxHp * 0.06, king.hp - king.maxHp * 0.28); king.state = 'down'; king.stateT = 0; king.model.play('knock'); king.kv.set(0, 0, 0);
        FX.text(V3(king.pos.x, king.pos.y + 2.4, king.pos.z), 'TUZAK!', 'perfect'); UI.toast(`Tuzak çalıştı! (${hits}/3)`, 2000);
        let a = 0; L.anims.push(dt => { a += dt; flood.position.y = 0.04 + Math.min(1, a * 1.2) * 0.35 * (a < 2 ? 1 : Math.max(0, 1 - (a - 2) * 1.2)); if (a > 3.4) flood.visible = false; });
      }
      return !king.alive || (hits >= 3 && king.hp <= lowAt) || p.downs > 0;
    });
    return king.alive && p.downs > 0 ? 'lose' : 'win';
  };
  let result = await fightWin();
  while (result === 'lose') {
    combatOff(p); UI.boss(null); for (const r of rats) { r.removeRing && r.removeRing(); r.remove && r.remove(); } rats = []; G.enemies.length = 0; G.enemies.push(king); king.removeRing && king.removeRing();
    S.sfx('fail'); await retryPrompt(S, 'Kral çok güçlü. Levhayı kullanmalıyım; kolu doğru anda çekmeliyim.');
    S.cine(false); Screen.reset(); king.hp = king.maxHp; king.state = 'idle'; king.alive = true; king.corpse = false; king.untargetable = false; king.place(4.0, -6.0, 0); king.model.setStance(null); king.model.lieW = 0; hits = 0; king.active = false; p.place(-6.5, 17.5, Math.PI);
    result = await fightWin();
  }
  combatOff(p); UI.boss(null); S.clearObjective(); for (const r of rats) { r.active = false; if (r.alive) r.takeHit(999, p, { heavy: true }); } plate.visible = false; glow.visible = false;
  S.cine(true); G.enemies.length = 0; Screen.reset();
  // ---- son darbe
  king.active = false; king.alive = false; king.untargetable = true; king.state = 'yield'; king.model.setStance('lie');
  await S.shot(V3(p.pos.x - 1.5, 1.4, p.pos.z + 2.2), V3(king.pos.x, 0.6, king.pos.z), 1.2);
  S.sfx('hitHeavy'); Screen.addShake(0.5); p.model.setStance(null); p.model.play('swing', 1.2); G.hitstop = 0.2;
  await S.wait(1.2);
  await S.think('Nefesimi toparlayamıyorum. Ama o artık kalkmıyor.');
  S.sfx('system');
  await UI.system([
    SYS.head('BAŞARI'), SYS.row('Kendinden güçlü bir yaratığı yendin', '', 'reveal'),
    SYS.row('Ödül', 'İlk yetenek açıldı'), SYS.row('İKİNCİ NEFES', 'Pasif', 'reveal'), SYS.dim('Yorgunken dayanıklılık yenilenir. Seviye 1.'),
    SYS.row('Seviye', '5'), SYS.stats({ STR: 3, AGI: 3, VIT: 2, PER: 2 }, { VIT: 1, INT: 1 }),
  ], { speed: 400 });
  await S.think('Güçle değil, sabırla. Bu bir avukatın zaferi.');
  await S.fadeOut(1.4);
  // ---- lonca: ödül kesintisi, Seraphine
  L = await S.level(buildGuildInterior, 'interior', { sunDir: [0.3, 0.6, -0.4], noSky: true });
  S.amb('crowd'); S.music('sad');
  p = spawnJoseph(18, 0, 4.4, Math.PI);
  const g2 = S.cast('greta', npc(LOOK.greta(), 0, -4.6, 0, { watch: false, stance: 'behind' }));
  const ser2 = S.cast('seraphine', npc(LOOK.seraphine(), 5.8, -0.8, -1.5, { watch: false }));
  const gar2 = S.cast('garrick', npc(LOOK.garrick(), -4.2, 2.6, 0.6, { watch: false }));
  const iso2 = S.cast('isolde', npc(LOOK.isolde(), -5.2, 1.8, 0.4, { watch: false }));
  S.cine(true); await S.shot(V3(0, 2.0, 6.0), V3(0, 1.4, -3), 0); await S.fadeIn(1.2);
  await S.say('greta', 'Fare Kralı\'nın kuyruğu burada. Gerçek. Bunu nasıl yaptın?');
  await S.say('joseph', 'Kanalda bir tuzak var. İşi ben değil, su yaptı.');
  await S.say('greta', 'Düzensiz teslim. Ödül: 1 gümüş 50 bronz.');
  await S.say('joseph', 'Sözleşme üç gümüştü.');
  await S.say('greta', 'Düzensiz teslim, dedim. Kesinti: ceza ve vergi. Ben böyle yazıyorum, çünkü böyle yazmak zorundayım.');
  gar2.lookAt(p.root); gar2.model.play('laugh');
  await S.say('garrick', 'Bir köylü Fare Kralı\'nı yenmiş. Ben de gökyüzünde ejderha gördüm geçen yıl.');
  await S.say('rowena', 'Yok artık! Isolde, bu çocuk gerçekten...');
  await S.say('isolde', 'Kanıt kuyruğudur. Gerçek kuyruk. Susun.');
  await S.shot(V3(4.0, 1.7, 0.6), V3(5.8, 1.5, -0.8), 1);
  ser2.lookAt(p.root); await S.wait(1.4);
  await S.think('Seraphine kuyruğa bakıyor. Sonra yaralarıma. Sonra bana. Uzun uzun.');
  await S.say('seraphine', 'Su ve tuzak. Zekice. Ama kimse sana bunu öğretmedi.');
  await S.say('joseph', 'Hayır. Okuyarak öğrendim.');
  await S.say('seraphine', 'İlginç.');
  ser2.walkTo([V3(6, 0, -8)], 1.4);
  await S.think('Kimse bana inanmadı. Yalnızca Seraphine gözlerini kaçırmadı. Bu hem korkutucu, hem değerli.');
  await S.fadeOut(1.4);
  // ---- gece: Lily'nin kesesi
  L = await S.level(() => buildHut('night'), 'interiorNight', { sunDir: [0.2, 0.5, -0.85], noSky: true });
  S.amb('interior'); S.music('sad');
  p = spawnJoseph(18, -1.6, -0.5, Math.PI * 0.75); p.speedMul = 0.7;
  const lilyN = S.cast('lily', npc(LOOK.lily(18), 2.6, -1.85, 0, { stance: 'lie', watch: false })); lilyN.lockY = 0.38; lilyN.model.closedEyes = true; lilyN.solid = false; lilyN.collides = false;
  S.cine(true); await S.shot(V3(1.0, 2.1, 1.4), V3(2.6, 0.7, -1.9), 0); await S.fadeIn(1.5);
  await S.think('Fare Kralı\'nın bir gümüş elli bronzu. Kesinti bir yana, ilk kez bir ailenin kaybettiğinden fazlasını getirdim.');
  p.walkTo([V3(2.1, 0, -1.2)], 1.0); await S.wait(2.8);
  p.model.setWeapon('pouch'); S.sfx('coin'); await S.wait(0.7);
  await S.shot(V3(1.5, 1.2, -0.7), V3(2.6, 0.5, -1.9), 1);
  await S.think('Lily\'nin yastığının altına. Okul parasının fazlasıyla.');
  p.model.setWeapon(null);
  await S.wait(1.2);
  lilyN.model.closedEyes = false; lilyN.model.emote('smile', 3);
  await S.say('lily', '...abi? Yastığımın altında bir şey var.');
  await S.say('joseph', 'Uyu, Lily.');
  await S.say('lily', 'Abi... sen bir kahramansın.');
  await S.say('joseph', 'Hayır. Sadece ağabeyim.');
  await S.fadeOut(1.6);
  // ---- Arc 1 sonu: doğuda goblin izleri
  L = await S.level(() => buildVillage({}), 'dusk');
  S.amb('wind'); S.music('title');
  p = spawnJoseph(18, 28, -4.5, Math.PI / 2);
  S.cine(true); await S.shot(V3(22, 2.2, -9), V3(34, 0.8, -4), 0); await S.fadeIn(1.6);
  await S.think('Kanalı kapatırken köyün doğusundan geçtim. Taze çamurda küçük, çıplak ayak izleri. Üç parmak ve bir pençe.');
  for (let i = 0; i < 8; i++) { const m = new T.Mesh(new T.CircleGeometry(0.1, 5), new T.MeshBasicMaterial({ color: '#2a2018', transparent: true, opacity: 0.7, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(31 + i * 0.7, L.h(31 + i * 0.7, -4.4) + 0.03, -4.4 + Math.sin(i * 1.4) * 0.35); L.add(m); }
  await S.shot(V3(33, 1.6, -7), V3(37, 0.2, -4.4), 3);
  await S.think('Goblin izi. Eros\'a bu kadar yakın ilk kez görüyorum.');
  await S.think('Fare Kralı yalnızca bir başlangıçtı. Daha büyük işler yolda. Ve ben hâlâ G rütbeyim.');
  S.sfx('wind');
  UI.title('Arc 1 sonu', 'Tabandaki Çocuk', 'Sürecek...');
  await S.wait(6);
  await S.fadeOut(2);
});
