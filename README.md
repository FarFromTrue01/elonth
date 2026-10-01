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

## Yapı

- `src/*.js` — oyun kodu (alfabetik sırayla tek dosyada birleşir)
- `src/style.css`, `src/body.html` — arayüz
- `vendor/three.module.min.js` — Three.js r160
- `tools/build.mjs` — `node tools/build.mjs` ile `index.html`, `sw.js` ve `dist/elonth.html` (artifact sürümü) üretilir
- `version.json` — sürüm numarası; her güncellemede artırılır, böylece uygulama önbelleği yenilenir

## Kayıt

İlerleme tarayıcının yerel depolamasında tutulur. Bölümler menüsünden açılmış her sahne tekrar oynanabilir.
