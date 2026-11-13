# Anadolu Zaman Haritası

Göbekli Tepe'den Cumhuriyet'e, Anadolu'nun yaklaşık 12.000 yıllık tarihini tek bir haritada gezdiren etkileşimli bir atlas.

- **127 kayıt, 12 dönem:** yerleşimler, anıtlar, savaşlar ve olaylar; her biri kısa bir açıklama, tarih, konum ve (çoğunda) bir görselle.
- **Zaman çizelgesi:** alttaki şeritten dönem seçilir; çentikler tek tek kayıtlardır.
- **Hâkimiyet haritası:** sağ üstteki düğmeyle açılır. Yıl kaydırıcısıyla MÖ 1300'den 1938'e dönem dönem kimin nereye hükmettiği izlenir; bir alana tıklayınca o devletin kartı ve o alandaki kayıtlar gelir.
- **Kronolojik tur, iki sınav** ("Yeri bul", "Hangisi daha eski?"), güzergâhlar, antik bölge adları, açık/koyu tema.
- Kayıtlara doğrudan bağlantı verilebilir: `index.html#k=4` (sayı, `OLAYLAR` listesindeki sıradır).

## Yerelde açmak

Derleme gerekmez. `index.html` dosyasına çift tıklamak yeterlidir (`file://` ile çalışır).
Harita altlığı, yazı tipleri, Leaflet ve görseller internetten yüklenir; çevrimdışıyken kayıtlar ve sınırlar yine görünür, ama altlık ve görseller gelmez.

İsterseniz basit bir sunucuyla da açabilirsiniz:

```
python -m http.server 8000
```

ve tarayıcıda `http://localhost:8000` adresine gidin. ("Ana ekrana ekle" ve uygulama simgesi yalnız `http(s)://` üzerinden çalışır; `file://` ile açınca tarayıcı `manifest.webmanifest` dosyasını yükleyemediğini konsola yazabilir, bu zararsızdır.)

GitHub Pages'te yayımlamak için depoyu olduğu gibi yayımlamak yeterlidir (kök klasör, `index.html`).
Yayın adresi belli olunca `index.html` içindeki `og:image` değerini tam adresle (`https://…/icons/og.png`) değiştirin; bağlantı önizlemeleri göreli adresi okumaz.

## Klasör yapısı

```
index.html              sayfa iskeleti
css/app.css             bütün stiller
js/app.js               uygulama
data/olaylar.js         DONEMLER, TURLER, OLAYLAR, DONEM_EK, harita etiketleri, güzergâhlar  (elle düzenlenir)
data/gorseller.js       görsel listesi                     (tools/gorsel_bul.js üretir)
data/sinirlar.js        hâkimiyet haritası anlıkları        (tools/sinir_uret.py üretir)
tools/                  veri üreten araçlar
icons/, manifest.webmanifest   uygulama simgeleri ("Ana ekrana ekle")
```

Bütün dosyalar düz `<script src>` / `<link>` ile yüklenir; modül, `fetch` ya da derleme adımı yoktur. Bu yüzden veri dosyaları JSON değil, küresel değişken tanımlayan küçük JavaScript dosyalarıdır.

## Yeni kayıt eklemek

1. `data/olaylar.js` içindeki `OLAYLAR` listesine bir satır ekleyin. Alanlar dosyanın başında açıklanmıştır (`t` başlık, `p` dönem anahtarı, `k` tür, `lat`/`lng`, `y` sıralama yılı, `d` tarih metni, `il`, `c`, `s`, isteğe bağlı `a:1` = konum yaklaşık).
2. **Görsel için:** `tools/gorsel_bul.js` içindeki `MADDE` listesine kaydın başlığıyla aday Vikipedi maddelerini yazın (önce `tr:`, sonra `en:`), aracı çalıştırın ve `tools/cache/rapor.txt` dosyasında seçilen dosyayı kontrol edin (aşağıya bakın).
3. Kayıtlar dizideki sıralarıyla numaralandığı için (`#k=` bağlantıları buna dayanır) yeni kayıtları **listenin sonuna** eklemek, var olan bağlantıları bozmaz. Listedeki görünüm sırası `y` alanına göre ayrıca hesaplanır.

## Verileri yeniden üretmek

### Görseller — `tools/gorsel_bul.js`

```
node tools/gorsel_bul.js           # önbellekten (tools/cache/), yoksa ağdan
node tools/gorsel_bul.js --taze    # önbelleği yok say
```

Node 18 veya üstü yeterlidir (ek paket yok). Araç, her kayıt için elle seçilmiş Vikipedi maddesini MediaWiki API ile çözer (`prop=pageimages|info`), maddenin baş görselinin yazar, lisans ve dosya sayfası bilgisini Wikimedia Commons'tan (`imageinfo`, `extmetadata`) alır ve `data/gorseller.js` dosyasını yazar. Özgür olmayan ya da Commons'ta bulunmayan (yerel/adil kullanım) dosyalar, SVG haritalar ve bayraklar elenir.

Baş görseller bazen harita, arma, portre ya da logo olur. Bu yüzden her çalıştırmadan sonra `tools/cache/rapor.txt` gözden geçirilmeli; uygunsuz bir dosya için araçtaki `DOSYA` listesine elle bir Commons dosyası yazılır ya da kayıt `YOK` listesine eklenip görselsiz bırakılır.

### Sınırlar — `tools/sinir_uret.py`

```
pip install shapely            # (önizleme için ayrıca: pip install matplotlib)
python tools/sinir_uret.py [--onizleme klasör]
```

Kaynak dosyalar depoda yoktur. [historical-basemaps](https://github.com/aourednik/historical-basemaps) deposunun `geojson/` klasöründen şu dosyaları `tools/cache/hb/` içine indirin:

`world_bc700, world_bc500, world_bc323, world_bc200, world_bc1, world_100, world_500, world_800, world_1000, world_1300, world_1400, world_1500, world_1600, world_1800, world_1914, world_1920, world_1938` (`.geojson`)

Araç her anlığı boylam 18–52 / enlem 29–48 penceresine kırpar, adsız parçaları ve devlet olmayan kültür/göçebe alanlarını atar, adları Türkçeleştirir, aynı devletin parçalarını birleştirir, geometriyi sadeleştirir ve koordinatları iki ondalığa yuvarlar. Her devlet bütün anlıklarda aynı rengi alır; bir anlıkta komşu olan devletler farklı renklere düşer. MÖ 1300 ve MÖ 550 için veri seti yetersiz olduğundan bu iki anlık araç içinde elle çizilmiş "şematik" etki alanlarıdır.

Kullanılmayan anlıklar ve nedenleri:

- **MÖ 2000, MÖ 1500, MÖ 1000:** veri seti bu dönemde Anadolu için çok kaba; MÖ 1500, MÖ 1000'in kopyası. Yerine şematik MÖ 1300 kullanılır.
- **MÖ 100:** Selevkos Krallığı'nı Mezopotamya'ya kadar gösteriyor; o tarihte Mezopotamya Partlardaydı.
- **1100:** bütün Anadolu'yu Bizans'a veriyor; Türkiye Selçukluları ve Danişmendliler yok.
- **1200:** 1000'in kopyası gibi; Türkiye Selçukluları yok.
- **1920:** kullanılıyor, ama fiilî durumu değil **Sevr Antlaşması'nın öngördüğü bölüşümü** gösterdiği için arayüzde açıkça öyle adlandırılır.

## Kaynaklar ve haklar

- **Harita altlığı:** Esri (World Shaded Relief, World Imagery, World Light/Dark Gray Canvas). Kaynaklar: Esri ve katkıda bulunanlar.
- **Görseller:** Wikimedia Commons. Görseller depoya indirilmez, `upload.wikimedia.org` üzerinden doğrudan gösterilir; her görselin altında yazarı, lisansı ve Commons dosya sayfasına bağlantı yer alır.
- **Hâkimiyet sınırları:** [historical-basemaps](https://github.com/aourednik/historical-basemaps), André Ourednik, GPL-3.0. Türkçe adlar, notlar, düzeltmeler ve şematik anlıklar bu projeye aittir.
- **Kütüphaneler:** [Leaflet](https://leafletjs.com) (BSD-2-Clause) ve [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) (MIT), cdnjs üzerinden.
- **Yazı tipleri:** Fraunces ve Inter (SIL Open Font License), Google Fonts üzerinden.

GPL-3.0 lisanslı bir veri setinden türetilmiş veri içerdiği için proje GPL-3.0 ile dağıtılır (`LICENSE`).

## Doğruluk üzerine

Bu bir öğrenme ve keşif aracıdır, akademik bir kaynak değildir.

- Tarihlerin çoğu yaklaşıktır; tarih öncesi kayıtlarda yüzyıllar, hatta binyıllar mertebesinde belirsizlik vardır.
- Konumu tartışmalı olan yerler (ör. Miryokefalon, Kerkenes = Pteria?) kayıt kartında ayrıca belirtilir.
- Hâkimiyet haritasındaki alanlar kesin sınır değildir. Antik ve orta çağ devletlerinin çoğunun ölçülmüş sınırları yoktu; alanlar nüfuz bölgelerini kabaca gösterir ve kaynaklar arasında farklılık gösterir. "Şematik" anlıklar bilerek yumuşak kenarlı çizilmiştir.
- Görseller Vikipedi maddelerinin baş görsellerinden seçilmiş ve tek tek kontrol edilmiştir; uygun bir fotoğraf bulunamayan kayıtlar görselsiz bırakılmıştır.

Hata ya da öneri için depoda bir "issue" açabilirsiniz.
