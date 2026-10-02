# Elonth

Elonth dünyasında geçen, tarayıcıda çalışan 3D aksiyon ve hikâye oyunu. Tablet için dokunmatik kontrollü, ana ekrana uygulama olarak kurulabilir (PWA).

**Arc 1 · Tabandaki Çocuk** — tamamı oynanabilir: Prolog, Bölüm 1 ve Bölüm 2 · Dipten (Ceza, On Gümüş, G Görevleri, Fareler, Fare Kralı).

## Oynamak

GitHub Pages açıkken: `https://farfromtrue01.github.io/elonth/`

Tablette Chrome ile aç, menüden **Ana ekrana ekle** de. Oyun tam ekran, yatay açılır.

## Kontroller

| Dokunmatik | Klavye | İşlev |
|---|---|---|
| Sol yarıda sürükle | WASD | Yürü / koş |
| Sağ yarıda sürükle | Fare ile sürükle | Kamerayı çevir |
| Saldır | J | 3'lü kombo |
| Kaç | K / Shift | Yuvarlan (doğru anda: mükemmel kaçış) |
| Tekme / Ağır | L | Güçlü vuruş, nefes harcar |
| Etkileşim butonu | E | Konuş, incele |
| Ekrana dokun | Boşluk | Diyaloğu ilerlet |
| Kilit (sağ üst) | — | Shift lock: karakter kameranın baktığı yöne döner |

Dövüşte hafif hedef yardımı vardır: saldırı yönün rakibe ~35° yakınsa karakter kendiliğinden döner ve vurur.

## Ayarlar

Arayüz boyutu (tablette sağ alttaki butonları büyütür), shift lock, ekran sarsıntısı, kamera hassasiyeti, metin hızı, müzik/efekt sesi, grafik kalitesi ve **karakter görünümü** (Anime: VRM modelleri / Basit: hafif modeller, zayıf cihazlar için).

## Sürüm 0.4.0'da neler değişti

- **Bölüm 2 · Dipten** eklendi (Arc 1'in sonu): Ceza, On Gümüş (lonca kaydı, Greta), G Görevleri (ahır, kasap avlusu, kapı önü; Victor ve Mira), Fareler (değirmen, mahzen, kanal) ve final **Fare Kralı** (tuzak levhası + savak mekaniği). Yeni mekânlar: lonca iç salonu, değirmen, mahzen, kanal. Yeni yaratıklar: fare, kanal faresi, örümcek, Fare Kralı. Yeni karakterler: Greta, Mira, Garrick.
- **Karakter çeşitliliği:** herkesin kafa/omuz/göğüs oranı, yüz ifadesi eğilimi, çil/yara ve **yaş** (kırışıklık, ağarmış saç, kamburluk) farklı. Yaşlı köylüler. Joseph ile Daniel artık aynı kişi gibi görünmüyor. Erkeklerin göğsü düzleştirildi, omuzları genişletildi.
- **Saç fiziği:** kökler kafaya yapışık, yalnızca uçlar savruluyor.
- **Kol pozları** ters kinematikle yeniden hesaplandı: eller gövdeye girmiyor, havada kalmıyor (bel, kolları kavuşturma, düşünme, ağlama, destek, sırtında taşınma).
- Tören: yürümeden art arda 12 kişi taşa dokunur, kimine Enkron çıkar kimine çıkmaz. Eve dönüşte yürüyüş hatası (kayma, daire, ani hızlanma) giderildi.
- Çanta/ekmek bohçası belirgin; Victor yakına gelip düşürüyor. Yatak: yorgan ve yastık gövdeye girmiyor. Kaza sonrası siyah ekranda metin artık görünüyor.
- Performans: uzak karakterlerde kemik/yay güncellemesi seyreltildi, kontur mesafesi kısaldı.

## Sürüm 0.3.0'da neler değişti

- **Karakterler VRM anime modelleriyle baştan yapıldı.** Gerçek anime yüzleri (göz, kaş, ağız ifadeleri, göz kırpma, bakış), saç ve kıyafet fiziği, toon gölgelendirme ve kontur.
- Ortaçağ kıyafetleri vücuttan üretilir: tunik, pantolon, çizme, yelek, elbise, cübbe, palto eteği, pelerin, zırh, miğfer, kemer ve aksesuarlar. Her karakterin kendi saç modeli, saç/göz/ten rengi var.
- Joseph: siyah dağınık saç, siyah göz, esmer ten. Yaşa göre (10, 12, 15, 17, 18) boy ve oranlar değişir.
- Kalabalıklar (tören salonu, Eros çarşısı) da aynı tarzda; sadeleştirilmiş, tek dokulu ve örneklenmiş (instanced) çizilir, tablet için hafiftir.
- Dövüşte ve diyalogda canlı yüz ifadeleri: saldırırken kararlı, darbe alınca acı; ünlemde dikkat, sessizlikte hüzün.
- Ana menü yeni açı: meşenin altında Joseph ve Lily, gün batımı.
- Hikâye rehberiyle uyum: törende Victor Holloway da Enkron alır; Lonca Hanımı üst kattaki pencerede bir anlık gölge olarak görünür; günlüğe yeni kayıtlar.
- Ayarlar'a "Karakterler: Anime / Basit" seçeneği eklendi.

## Sürüm 0.2.0'da neler değişti

- Karakterler baştan yapıldı: anime tarzı yüzler (göz, kaş, ağız ifadeleri, göz kırpma), toon gölgelendirme ve kontur, kız/erkek vücut ayrımı, saç modelleri, kıyafet katmanları.
- Konuşan karakterin canlı portresi diyalog kutusunda görünür.
- Dünya detaylandırıldı: köy evleri, kulübe içi (yatak başlıkları, ocak, kurutulmuş otlar, pencereden ışık huzmesi), Eros çarşısı ve yeni Lonca binası, tören salonu (avizeler, goblen, gül pencere), atlar, su, bulutlar, dağlar.
- Shift lock, dövüşte hedef yardımı, vuruş serisi sayacı, ekran sarsıntısı ayarı, arayüz boyutu.
- Sahne sonları siyah ekran yerine yükleniyor ekranına geçer; sinematik kameralar binaların içine girmez; takılan sahneler için zaman aşımı korumaları.
- Atla düğmesi yanlışlıkla basılmasın diye iki dokunuş ister; araba kazası sahnesi atlanamaz.
- Yatakta yatan karakterler yatağın üstünde yatıyor; NPC'ler sinematiklerde birbirini itmiyor.
- Yaban domuzu dövüşü çıkarıldı; yerine babayla hasat sahnesi geldi.
- Ana menüde ve duraklatma menüsünde **Günlük**: hikâye ilerledikçe açılan kişi ve dünya kayıtları.

## Yapı

- `src/*.js` — oyun kodu (alfabetik sırayla tek dosyada birleşir)
- `src/style.css`, `src/body.html` — arayüz
- `vendor/three.r160.js` — Three.js r160 (global `THREE`)
- `vendor/three-vrm.js` — three-vrm + GLTFLoader + meshoptimizer paketi (`tools/vrm-vendor` ile üretilir)
- `assets/vrm/*.vrm` — temel anime modelleri (`tools/vrm_pack.py` ile kıyafetsiz, küçültülmüş)
- `src/05b_vrm.js` — VRM karakter sistemi: yükleme, renklendirme, kıyafet üretimi, poz sürücüsü, kalabalık
- `tools/build.mjs` — `node tools/build.mjs` ile `index.html`, `sw.js` ve `dist/elonth.html` (artifact sürümü) üretilir
- `version.json` — sürüm numarası; her güncellemede artırılır, böylece uygulama önbelleği yenilenir

## Modeller ve lisans

Temel modeller VRoid Project'in (pixiv) örnek avatarlarıdır: AvatarSample_A, AvatarSample_C ve three-vrm örnek modeli. Lisansları ticari kullanım, değiştirme ve yeniden dağıtıma izin verir; kredi şartı yoktur. Oyunda orijinal kıyafetleri çıkarılmış, saçları ve renkleri değiştirilmiş hâlleri kullanılır.

## Kayıt

İlerleme tarayıcının yerel depolamasında tutulur. Bölümler menüsünden açılmış her sahne tekrar oynanabilir.
