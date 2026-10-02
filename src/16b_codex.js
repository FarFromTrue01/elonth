// ---------- Günlük: hikâye ilerledikçe açılan dünya bilgisi ----------
const CODEX = [
  { id: 'joseph', cat: 'Kişiler', t: 'Joseph', at: 'p_wake', x: 'Eros\'un yoksul köy tarafında, on yaşında bir çocuk. İçinde, otuz altı yaşında bir trafik kazasında ölen bir avukatın anıları yaşıyor. Önceki hayatında hiç dava kaybetmedi; ama kapısını açtığında adını söyleyen kimse yoktu.' },
  { id: 'family', cat: 'Kişiler', t: 'Marta, Daniel ve Lily', at: 'p_wake', x: 'Joseph\'in yeni ailesi. Marta iki hafta boyunca ateşler içindeki oğlunun başında bekledi. Daniel tarlada çalışır; sevgisini şakayla saklar. Lily, abisinden birkaç yaş küçük, inatçı ve hiç susmayan bir kardeş.' },
  { id: 'eros', cat: 'Dünya', t: 'Eros', at: 'p_village', x: 'Elonth Krallığı\'nın şehirlerinden biri (başkent Enor\'dur). Köprünün bir yanında saray ve soyluların taş evleri, öbür yanında saman çatılı köy evleri. İki taraf aynı nehirden su içer ama aynı ekmeği yemez.' },
  { id: 'stone', cat: 'Dünya', t: 'Tanrı\'nın İradesi', at: 'p_village', x: 'Sarayın tören salonundaki taş. Her yılın ilk günü, o yıl on sekizine basan herkes, soylu ya da köylü, ona dokunur ve büyü kazanır.' },
  { id: 'enkron', cat: 'Dünya', t: 'Enkron', at: 'p_village', x: 'Taşın yüz kişiden yaklaşık onuna verdiği özel yetenek. Ne yaptığını yalnızca sahibi bilir. Kiminin ateşi, kiminin şifası olur. Tobias Dede\'ye göre Enkron doğduğu gibi ölür; zayıflayabilir ama asla büyümez.' },
  { id: 'ranks', cat: 'Dünya', t: 'Lonca rütbeleri', at: 'p_village', x: 'G, F, E, D, C, B, A, S ve SS. G sıradan halktır. Köyde D rütbeli birine herkes eğilir. A rütbeliler kralın sağ koludur. Dünyada yalnızca üç SS vardır ve hiçbiri Elonth\'ta değildir.' },
  { id: 'guild', cat: 'Dünya', t: 'Maceracılar Loncası', at: 'p_village', x: 'Enkron\'u olsun olmasın kimseye kapısını kapatmaz. Ama giriş on gümüştür: bir köylü için iki yıllık birikim. Ödüller rütbeyle büyür; ölüm ihtimali de.' },
  { id: 'friends', cat: 'Kişiler', t: 'Dörtlü İyi Çete', at: 'c1_alley', x: 'Nora: köyün en hızlı yumruğu, kardeşleri aç yatmasın diye loncaya girmek istiyor. Leo: düşmeyi "taktik" sayan, kalbi temiz bir çocuk. Clara: köprünün öbür yanından, kumaşçının kızı; bu tarafı seviyor çünkü burada insanlar gülüyor.' },
  { id: 'victor', cat: 'Kişiler', t: 'Victor', at: 'c1_alley', x: 'Eros sarayındaki bir soylunun oğlu. Babasının adıyla sokakları kendi bahçesi sanıyor. Bram ve Osric peşinden ayrılmaz.' },
  { id: 'selen', cat: 'Kişiler', t: 'Selen', at: 'c1_selen', x: 'Leo\'nun ablası, E rütbe maceracı. Kardeşiyle durmadan alay eder; ama geceleri kapısına merhem bırakan da odur.' },
  { id: 'silver', cat: 'Kişiler', t: 'Gümüş Kılıçlar', at: 'c1_guild', x: 'Eros loncasının en güçlüsü, D rütbe kılıç ustası Isolde Crane\'in ekibi. Yanında hiç konuşmayan büyücü Seraphine Vale (D) ve dilini hiç tutmayan okçu Rowena Hart (E). Köylülere toprağa bakan insanlar gözüyle bakarlar. Bir tek Seraphine, yere düşen köylü çocuğa uzun uzun baktı.' },
  { id: 'charm', cat: 'Eşyalar', t: 'Kayın tılsımı', at: 'c1_harvest', x: 'Daniel\'in kayın dalından oyduğu küçük halka. "Tören günü cebinde dursun" dedi. "O taş ne derse desin, sen benim oğlumsun."' },
  { id: 'holloway', cat: 'Kişiler', t: 'Victor Holloway', at: 'c1_ceremony', x: 'Aynı törende taş Victor için de parladı: kan kırmızısı. Enkron\'unun ne yaptığını kimse bilmiyor; ama gülüşü artık eskisinden soğuk.' },
  { id: 'guildlady', cat: 'Kişiler', t: 'Lonca Hanımı', at: 'c1_guild', x: 'Eros loncasının başı. Köyde görülmüş tek C rütbe olduğu söylenir. Kimse onu yakından görmedi; bazen üst kattaki pencerede bir gölge belirir, o kadar.' },
  { id: 'system', cat: 'Dünya', t: 'Sistem', at: 'c1_system', x: 'Joseph\'in Enkron\'u. Gözlerini kapattığında bile orada duran mavi bir pencere. Tören sırasında bir şey ters gitti ve pencere zayıfladı. Ama yazılarından biri "sınır yok" diyor.' },
];
function openCodex() {
  $('#panel').hidden = false; $('#p-title').textContent = 'Günlük';
  const body = $('#p-body'); body.innerHTML = '';
  const seen = Save.data.unlocked || [];
  const open = CODEX.filter(e => seen.includes(e.at) || Story.order.indexOf(e.at) < Math.max(-1, ...seen.map(s => Story.order.indexOf(s))));
  if (!open.length) { body.innerHTML = '<p class="cx-empty">Henüz bir şey yazılmadı. Hikâye ilerledikçe günlük dolacak.</p>'; return; }
  const cats = {}; for (const e of open) (cats[e.cat] = cats[e.cat] || []).push(e);
  for (const c in cats) {
    const g = document.createElement('div'); g.className = 'ch-group'; g.innerHTML = `<h3>${c}</h3>`;
    for (const e of cats[c]) { const d = document.createElement('details'); d.className = 'cx-item'; d.innerHTML = `<summary>${e.t}</summary><p></p>`; d.querySelector('p').textContent = e.x; g.appendChild(d); }
    body.appendChild(g);
  }
  const locked = CODEX.length - open.length; if (locked) { const p = document.createElement('p'); p.className = 'cx-empty'; p.textContent = `${locked} kayıt hikâye ilerledikçe açılacak.`; body.appendChild(p); }
}
