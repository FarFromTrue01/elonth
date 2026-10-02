# Elonth

Elonth dünyasında geçen, tarayıcıda çalışan 3D aksiyon ve hikâye oyunu. Tablet için dokunmatik kontrollü, ana ekrana uygulama olarak kurulabilir (PWA).

**Arc 1 · Tabandaki Çocuk** — şu an oynanabilir olan kısım: Prolog ve Bölüm 1.

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
