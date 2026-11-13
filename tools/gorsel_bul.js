#!/usr/bin/env node
/*
  GÖRSEL BULUCU — data/gorseller.js üretir
  ========================================
  Her kayıt için elle seçilmiş Vikipedi maddesini çözer (önce tr, sonra en),
  maddenin baş görselini (ya da aşağıda elle seçilen dosyayı) Wikimedia Commons'tan
  yazar + lisans + dosya sayfası bilgisiyle birlikte alır.

  Kullanım:   node tools/gorsel_bul.js            (önbellekten; yoksa ağdan)
              node tools/gorsel_bul.js --taze     (önbelleği yok say)
  Gereken:    Node 18+ (yerleşik fetch). Ek paket yok.
  Çıktı:      data/gorseller.js     (window.GORSELLER = { "<kayıt başlığı>": {...} })
              tools/cache/rapor.txt (gözden geçirme listesi: hangi dosya seçildi)

  Görseller depoya indirilmez; upload.wikimedia.org üzerindeki küçük boyutlu
  sürüme doğrudan bağlanılır ve her görselin yazarı/lisansı arayüzde gösterilir.

  Yeni kayıt eklediğinizde: MADDE listesine kaydın başlığıyla bir satır ekleyin,
  aracı çalıştırın, rapor.txt'de seçilen dosyanın gerçekten yerin/nesnenin bir
  fotoğrafı olduğunu kontrol edin (harita, bayrak, arma, portre, logo değil).
  Değilse DOSYA'ya elle bir Commons dosyası yazın ya da YOK'a ekleyin.
*/
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const KOK = path.resolve(__dirname, "..");
const CACHE = path.join(__dirname, "cache");
const TAZE = process.argv.includes("--taze");
const UA = "AnadoluZamanHaritasi/1.0 (educational map)";
const GENISLIK = 960;

// ---------------------------------------------------------------------------
//  Kayıt başlığı -> aday maddeler (sırayla denenir; "tr:" / "en:" öneki zorunlu)
// ---------------------------------------------------------------------------
const MADDE = {
  "Kocabaş Homo erectus'u": ["tr:Kocabaş Homo erectus fosili", "en:Kocabaş fossil", "en:Kocabaş Homo erectus"],
  "Yarımburgaz Mağarası": ["tr:Yarımburgaz Mağarası", "en:Yarımburgaz Cave"],
  "Karain Mağarası": ["tr:Karain Mağarası", "en:Karain Cave"],
  "Çayönü": ["tr:Çayönü", "en:Çayönü"],
  "Göbekli Tepe": ["tr:Göbekli Tepe", "en:Göbekli Tepe"],
  "Karahan Tepe": ["tr:Karahan Tepe", "en:Karahan Tepe"],
  "Nevali Çori": ["tr:Nevali Çori", "en:Nevalı Çori"],
  "Aşıklı Höyük": ["tr:Aşıklı Höyük", "en:Aşıklı Höyük"],
  "Çatalhöyük": ["tr:Çatalhöyük", "en:Çatalhöyük"],
  "Hacılar": ["tr:Hacılar Höyük", "tr:Hacılar Höyüğü", "en:Hacılar"],
  "Arslantepe": ["tr:Arslantepe", "en:Arslantepe"],
  "Troya": ["tr:Troya", "en:Troy"],
  "Alacahöyük": ["tr:Alacahöyük", "en:Alaca Höyük"],
  "Kültepe – Kaniş/Neşa": ["tr:Kültepe", "en:Kültepe"],
  "Hattuşa": ["tr:Hattuşa", "en:Hattusa"],
  "Şapinuva": ["tr:Şapinuva", "en:Sapinuwa"],
  "Yazılıkaya": ["tr:Yazılıkaya (Hattuşa)", "tr:Yazılıkaya Açık Hava Tapınağı", "en:Yazılıkaya"],
  "Eflatunpınar": ["tr:Eflatunpınar", "en:Eflatun Pınar"],
  "Karabel Kabartması": ["tr:Karabel Anıtı", "tr:Karabel kabartması", "en:Karabel relief", "en:Karabel"],
  "Yesemek Heykel Atölyesi": ["tr:Yesemek Açık Hava Müzesi", "tr:Yesemek", "en:Yesemek Quarry and Sculpture Workshop"],
  "Karkamış": ["tr:Kargamış", "tr:Karkamış (antik kent)", "en:Carchemish"],
  "Zincirli – Sam'al": ["tr:Sam'al", "tr:Zincirli Höyük", "en:Sam'al"],
  "Tuşpa – Van Kalesi": ["tr:Van Kalesi", "en:Van Fortress"],
  "Gordion": ["tr:Gordion", "en:Gordion"],
  "Çavuştepe – Sardurihinili": ["tr:Çavuştepe Kalesi", "tr:Çavuştepe", "en:Çavuştepe"],
  "İvriz Kabartması": ["tr:İvriz Kabartması", "tr:İvriz kaya kabartması", "en:İvriz relief"],
  "Karatepe-Aslantaş": ["tr:Karatepe-Aslantaş Açık Hava Müzesi", "tr:Karatepe (Kadirli)", "en:Karatepe"],
  "Eski Smyrna – Bayraklı": ["tr:Smyrna", "en:Smyrna"],
  "Ayanis Kalesi": ["tr:Ayanis Kalesi", "en:Ayanis"],
  "Sardes": ["tr:Sardes", "en:Sardis"],
  "Milet": ["tr:Milet", "en:Miletus"],
  "Midas Şehri": ["tr:Midas Şehri", "en:Midas City"],
  "Artemis Tapınağı (Artemision)": ["tr:Artemis Tapınağı", "en:Temple of Artemis"],
  "Kerkenes (Pteria?)": ["tr:Kerkenes", "tr:Kerkenes Dağı", "en:Kerkenes"],
  "Ksanthos – Letoon": ["tr:Ksanthos", "en:Xanthos"],
  "Daskyleion": ["tr:Daskyleion", "en:Dascylium"],
  "Halikarnas Mozolesi": ["tr:Halikarnas Mozolesi", "en:Mausoleum at Halicarnassus"],
  "Priene": ["tr:Priene", "en:Priene"],
  "Granikos Savaşı": ["tr:Granikos Muharebesi", "tr:Granikos Savaşı", "en:Battle of the Granicus"],
  "Termessos": ["tr:Termessos", "en:Termessos"],
  "İssos Savaşı": ["tr:İssos Muharebesi", "tr:İssos Savaşı", "en:Battle of Issus"],
  "Didyma Apollon Tapınağı": ["tr:Didyma", "tr:Apollon Tapınağı (Didim)", "en:Didyma"],
  "Amasya Kral Kaya Mezarları": ["tr:Amasya Kral Kaya Mezarları", "tr:Kral Kaya Mezarları", "en:Tombs of the Kings of Pontus"],
  "Bergama – Pergamon": ["tr:Pergamon", "tr:Bergama (antik kent)", "en:Pergamon"],
  "Nemrut Dağı": ["tr:Nemrut Dağı", "en:Mount Nemrut"],
  "Zela Savaşı – 'Veni, vidi, vici'": ["tr:Zela Muharebesi", "tr:Zela Savaşı", "en:Battle of Zela"],
  "Ankara – Augustus Tapınağı": ["tr:Augustus Tapınağı (Ankara)", "tr:Augustus Tapınağı", "en:Monumentum Ancyranum"],
  "Tarsus": ["tr:Tarsus", "en:Tarsus, Mersin"],
  "Antakya – Antiokheia": ["tr:Antiokheia", "en:Antioch"],
  "Zeugma": ["tr:Zeugma (antik kent)", "tr:Zeugma", "en:Zeugma (Commagene)"],
  "Hierapolis – Pamukkale": ["tr:Hierapolis", "en:Hierapolis"],
  "Efes": ["tr:Efes", "en:Ephesus"],
  "Perge": ["tr:Perge", "en:Perga"],
  "Afrodisias": ["tr:Afrodisias", "en:Aphrodisias"],
  "Sagalassos": ["tr:Sagalassos", "en:Sagalassos"],
  "Aspendos Tiyatrosu": ["tr:Aspendos", "en:Aspendos"],
  "İznik – Nikaia": ["tr:I. İznik Konsili", "tr:Birinci İznik Konsili", "en:First Council of Nicaea"],
  "Konstantinopolis'in kuruluşu": ["tr:Konstantinopolis", "en:Constantinople"],
  "Diyarbakır Surları": ["tr:Diyarbakır Surları", "en:Diyarbakır Fortress"],
  "Sümela Manastırı": ["tr:Sümela Manastırı", "en:Sumela Monastery"],
  "Kadıköy – Khalkedon Konsili": ["tr:Kadıköy Konsili", "en:Council of Chalcedon"],
  "Dara": ["tr:Dara (antik kent)", "tr:Dara Antik Kenti", "en:Dara (Mesopotamia)"],
  "Ayasofya": ["tr:Ayasofya", "en:Hagia Sophia"],
  "Derinkuyu Yeraltı Şehri": ["tr:Derinkuyu Yeraltı Şehri", "en:Derinkuyu underground city"],
  "Harran": ["tr:Harran (antik kent)", "tr:Harran", "en:Harran"],
  "Akdamar Kilisesi": ["tr:Akdamar Kilisesi", "en:Cathedral of the Holy Cross, Aghtamar"],
  "Ani": ["tr:Ani (antik kent)", "tr:Ani Harabeleri", "tr:Ani", "en:Ani"],
  "Kapadokya – Göreme": ["tr:Göreme Millî Parkı", "tr:Göreme", "en:Göreme"],
  "Trabzon Rum İmparatorluğu": ["tr:Trabzon İmparatorluğu", "en:Empire of Trebizond"],
  "Malazgirt Meydan Muharebesi": ["tr:Malazgirt Meydan Muharebesi", "en:Battle of Manzikert"],
  "Niksar – Danişmendliler": ["tr:Niksar Kalesi", "tr:Danişmendliler", "en:Danishmendids"],
  "Dorylaion Savaşı": ["tr:Dorylaion Muharebesi (1097)", "tr:Dorylaion Muharebesi", "en:Battle of Dorylaeum (1097)"],
  "Konya – Selçuklu Başkenti": ["tr:Alâeddin Camii (Konya)", "tr:Alaeddin Camii (Konya)", "en:Alâeddin Mosque"],
  "Antakya Kuşatması": ["tr:Antakya Kuşatması (1097-1098)", "tr:Antakya Kuşatması", "en:Siege of Antioch"],
  "Hasankeyf": ["tr:Hasankeyf", "en:Hasankeyf"],
  "Miryokefalon Savaşı": ["tr:Miryokefalon Muharebesi", "en:Battle of Myriokephalon"],
  "Ahlat Selçuklu Mezarlığı": ["tr:Ahlat Selçuklu Meydan Mezarlığı", "tr:Ahlat Selçuklu Mezarlığı", "en:Seljuk Cemetery of Ahlat"],
  "Gevher Nesibe Şifahanesi": ["tr:Gevher Nesibe Şifahanesi", "tr:Gevher Nesibe Darüşşifası", "en:Gevher Nesibe Medical History Museum"],
  "Alanya – Kızıl Kule": ["tr:Kızıl Kule (Alanya)", "tr:Kızıl Kule", "en:Kızıl Kule"],
  "Divriği Ulu Camii ve Darüşşifası": ["tr:Divriği Ulu Camii ve Darüşşifası", "en:Great Mosque and Hospital of Divriği"],
  "Sultanhanı Kervansarayı": ["tr:Sultanhanı Kervansarayı", "en:Sultan Han"],
  "Kösedağ Savaşı": ["tr:Kösedağ Muharebesi", "tr:Kösedağ Savaşı", "en:Battle of Köse Dağ"],
  "Erzurum – Çifte Minareli Medrese": ["tr:Çifte Minareli Medrese (Erzurum)", "tr:Çifte Minareli Medrese", "en:Çifte Minareli Medrese (Erzurum)"],
  "Hacı Bektaş-ı Veli Dergâhı": ["tr:Hacı Bektaş-ı Veli Külliyesi", "tr:Hacıbektaş Müzesi", "en:Hacı Bektaş Veli Complex"],
  "Mevlana Türbesi": ["tr:Mevlânâ Müzesi", "tr:Mevlana Müzesi", "en:Mevlâna Museum"],
  "Karaman – Karamanoğulları": ["tr:Karaman Kalesi", "tr:Karamanoğulları", "en:Karamanids"],
  "Kütahya – Germiyanoğulları": ["tr:Kütahya Kalesi", "tr:Germiyanoğulları", "en:Germiyanids"],
  "Kastamonu – Candaroğulları": ["tr:Kastamonu Kalesi", "tr:Candaroğulları", "en:Jandarids"],
  "Beçin – Menteşeoğulları": ["tr:Beçin Kalesi", "tr:Beçin", "en:Beçin"],
  "Birgi – Aydınoğulları": ["tr:Birgi Ulu Camii", "tr:Birgi, Ödemiş", "en:Birgi"],
  "Mardin – Artuklu Başkenti": ["tr:Mardin", "en:Mardin"],
  "Söğüt – Osmanlı'nın doğuşu": ["tr:Ertuğrul Gazi Türbesi", "tr:Söğüt", "en:Söğüt"],
  "Koyunhisar (Bafeus) Savaşı": ["tr:Koyunhisar Muharebesi", "en:Battle of Bapheus"],
  "Bursa – İlk Başkent": ["tr:Bursa", "en:Bursa"],
  "Ankara Savaşı": ["tr:Ankara Muharebesi", "en:Battle of Ankara"],
  "İstanbul'un Fethi": ["tr:İstanbul'un Fethi", "en:Fall of Constantinople"],
  "Otlukbeli Savaşı": ["tr:Otlukbeli Muharebesi", "en:Battle of Otlukbeli"],
  "Topkapı Sarayı": ["tr:Topkapı Sarayı", "en:Topkapı Palace"],
  "Çaldıran Savaşı": ["tr:Çaldıran Muharebesi", "en:Battle of Chaldiran"],
  "Süleymaniye Külliyesi": ["tr:Süleymaniye Camii", "en:Süleymaniye Mosque"],
  "Edirne – Selimiye Camii": ["tr:Selimiye Camii", "en:Selimiye Mosque"],
  "Tanzimat Fermanı": ["tr:Tanzimat Fermanı", "en:Edict of Gülhane"],
  "Sinop Baskını": ["tr:Sinop Baskını", "en:Battle of Sinop"],
  "I. Meşrutiyet – Kanun-i Esasi": ["tr:Kânûn-ı Esâsî", "tr:I. Meşrutiyet", "en:Ottoman constitution of 1876"],
  "Sarıkamış Harekâtı": ["tr:Sarıkamış Harekâtı", "en:Battle of Sarikamish"],
  "Çanakkale Savaşları": ["tr:Çanakkale Savaşı", "en:Gallipoli campaign"],
  "Samsun'a Çıkış": ["tr:Samsun'a çıkış", "tr:Mustafa Kemal'in Samsun'a çıkışı", "en:Mustafa Kemal's landing at Samsun"],
  "Amasya Genelgesi": ["tr:Amasya Genelgesi", "en:Amasya Circular"],
  "Erzurum Kongresi": ["tr:Erzurum Kongresi", "en:Erzurum Congress"],
  "Sivas Kongresi": ["tr:Sivas Kongresi", "en:Sivas Congress"],
  "Maraş Savunması": ["tr:Maraş Savunması", "tr:Maraş Muharebesi", "en:Battle of Marash"],
  "TBMM'nin Açılışı": ["tr:Kurtuluş Savaşı Müzesi", "tr:Türkiye Büyük Millet Meclisi", "en:Grand National Assembly of Turkey"],
  "Antep Savunması": ["tr:Antep Savunması", "en:Siege of Aintab"],
  "I. ve II. İnönü Savaşları": ["tr:Birinci İnönü Muharebesi", "en:First Battle of İnönü"],
  "Sakarya Meydan Muharebesi": ["tr:Sakarya Meydan Muharebesi", "en:Battle of Sakarya"],
  "Kars Antlaşması": ["tr:Kars Antlaşması", "en:Treaty of Kars"],
  "Büyük Taarruz – Kocatepe": ["tr:Büyük Taarruz", "en:Great Offensive"],
  "Başkomutan Meydan Muharebesi": ["tr:Başkomutan Meydan Muharebesi", "en:Battle of Dumlupınar"],
  "İzmir'in Kurtuluşu": ["tr:İzmir'in Kurtuluşu", "en:Recapture of Smyrna"],
  "Mudanya Ateşkesi": ["tr:Mudanya Ateşkes Antlaşması", "en:Armistice of Mudanya"],
  "Cumhuriyetin İlanı": ["tr:Cumhuriyetin ilanı", "tr:Türkiye Cumhuriyeti'nin ilanı", "en:Proclamation of the Republic of Turkey"],
  "Hatay'ın Anavatana Katılması": ["tr:Hatay Devleti", "en:Hatay State"],
  "Anıtkabir": ["tr:Anıtkabir", "en:Anıtkabir"],
  "Boğaziçi Köprüsü": ["tr:15 Temmuz Şehitler Köprüsü", "en:Bosphorus Bridge"],
  "Atatürk Barajı": ["tr:Atatürk Barajı", "en:Atatürk Dam"],
  "1999 Marmara Depremi": ["tr:1999 Gölcük depremi", "tr:1999 Marmara depremi", "en:1999 İzmit earthquake"],
  "6 Şubat 2023 Depremleri": ["tr:2023 Kahramanmaraş depremleri", "en:2023 Turkey–Syria earthquakes"]
};

// Elle seçilen Commons dosyaları (baş görsel uygunsuzsa). Değer "File:..." ya da null.
// (Gözden geçirme notu: baş görsel harita / plan / yanlış konu çıkanlar.)
const DOSYA = {
  "Nevali Çori": "File:Şanlıurfa Müzesi Nevali Çori.jpg",                       // baş görsel: konum haritası
  "Kültepe – Kaniş/Neşa": "File:Kultepe Karum excavations (1993) 01.jpg",        // konum haritası
  "Zincirli – Sam'al": "File:Lion Zincirli.JPG",                                 // konum haritası
  "Kerkenes (Pteria?)": "File:Kerkenes 01.jpg",                                  // konum haritası
  "Hierapolis – Pamukkale": "File:The Roman theatre, built in the 2nd century AD under Hadrian on the ruins of an earlier theatre, later renovated under Septimius Severus, Hierapolis, Turkey - 17033619498.jpg", // konum haritası
  "Karkamış": "File:Royal Buttress of Carchemish - servants carrying weapons.jpg", // kent planı
  "Midas Şehri": "File:Midas Monument, Yazılıkaya.jpg",                          // köy sokağı
  "Daskyleion": "File:Funerary stele from Dascylium.jpg",                         // satraplık haritası
  "İznik – Nikaia": "File:First Council of Nicaea Michael Damaskinos.png",        // Trento Konsili tablosu
  "Kadıköy – Khalkedon Konsili": "File:Fourth ecumenical council of chalcedon - 1876.jpg", // Trento Konsili tablosu
  "Konstantinopolis'in kuruluşu": "File:Theodosian Walls of Constantinople, Istanbul (24053561188).jpg", // şehir haritası
  "Kütahya – Germiyanoğulları": "File:Kütahya castle 8812.jpg",                  // kale planı
  "Bursa – İlk Başkent": "File:Bursa Osman Gazi Türbesi 2014 0051.jpg",           // Uludağ teleferiği
  "Tanzimat Fermanı": "File:Edict of Gülhane.jpg",                                // 1877 meclis açılışı
  "İvriz Kabartması": "File:IvrizRelief.JPG",                                     // baş görsel yok
  "Niksar – Danişmendliler": "File:Niksar Castle panorama.JPG",                   // SVG harita
  "Gevher Nesibe Şifahanesi": "File:Gevher Nesibe Medrese (Cifte Medrese) DSCF0761.jpg", // baş görsel yok
  // 2. gözden geçirme (görsel tek tek görülerek seçildi)
  "Çayönü": "File:Cayönü - Grillplangebäude.jpg",                                // önceki: Roma mezarları
  "Eski Smyrna – Bayraklı": "File:Храм Афины в древней Смирне.jpg",              // önceki: İzmir Agorası (başka yer)
  "Troya": "File:Walls of Troy (2).jpg",                                          // önceki: Roma odeionu
  "Tarsus": "File:Tarsus Cleopatra gate in 2013 9781.jpg",                         // önceki: Ulu Camii
  "Antakya – Antiokheia": "File:Antioch Saint Pierre Church Front.JPG",            // önceki: modern çarşı
  "TBMM'nin Açılışı": "File:War of Independence Museum.jpg",                      // birinci meclis binası; önceki: 2021 sokak fotoğrafı
  "Büyük Taarruz – Kocatepe": "File:Kocatepe1922.jpg",                            // önceki: kolaj
  "Başkomutan Meydan Muharebesi": "File:Dumlupinar-memorial-statue.jpg",          // önceki: Kocatepe fotoğrafı (öbür kayda taşındı)
  "Çanakkale Savaşları": "File:Canakkale Martyrs Monument 01.jpg",                // önceki: gazete kupürü
  "Sardes": "File:Sardis Temple of Artemis from NW (1991).jpg"                    // önceki: Roma hamamı
};

// Bilerek görselsiz bırakılan kayıtlar (uygun, özgür bir fotoğraf bulunamadı)
const YOK = new Set([
  "Kars Antlaşması",      // baş görsel: antlaşma haritası
  "Miryokefalon Savaşı",  // baş görsel bu savaşı değil, genel bir Haçlı gravürünü gösteriyor
  "Cumhuriyetin İlanı"    // baş görsel: 1927 tarihli harita-afiş, ilanın kendisi değil
]);

// ---------------------------------------------------------------------------
fs.mkdirSync(CACHE, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function api(host, params) {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", ...params }).toString();
  const key = host.split(".")[0] + "_" + crypto.createHash("sha1").update(host + "?" + qs).digest("hex").slice(0, 16);
  const f = path.join(CACHE, key + ".json");
  if (!TAZE && fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
  for (let t = 0; t < 6; t++) {
    try {
      const r = await fetch(`https://${host}/w/api.php?${qs}`, { headers: { "User-Agent": UA, "Api-User-Agent": UA }, signal: AbortSignal.timeout(20000) });
      if (r.status === 429 || r.status >= 500) { console.error("  HTTP " + r.status + ", bekleniyor…"); await sleep(4000 * (t + 1)); continue; }
      const j = await r.json();
      fs.writeFileSync(f, JSON.stringify(j));
      await sleep(150);
      return j;
    } catch (e) { console.error("  yeniden deneniyor:", e.message); await sleep(1000 * (t + 1)); }
  }
  throw new Error("API erişilemedi: " + host + " " + qs);
}

async function madde(aday) {
  const [lang, ...rest] = aday.split(":");
  const title = rest.join(":");
  const j = await api(`${lang}.wikipedia.org`, {
    action: "query", titles: title, redirects: "1", prop: "pageimages|info|pageprops",
    piprop: "name", inprop: "url", ppprop: "disambiguation"
  });
  const p = j.query && j.query.pages && j.query.pages[0];
  if (!p || p.missing || p.invalid) return null;
  if (p.pageprops && "disambiguation" in p.pageprops) return null;
  return { lang, title: p.title, url: p.canonicalurl || p.fullurl, image: p.pageimage || null };
}

const strip = s => String(s || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, " ").trim();

// Küçük resim adresini sade ve kalıcı biçime getir (izleme parametrelerini at, upload.wikimedia.org)
const temizUrl = u => String(u).split("?")[0].replace(/^https:\/\/thumb\.wikimedia\.org\//, "https://upload.wikimedia.org/");

async function dosya(name) {
  const t = name.startsWith("File:") ? name : "File:" + name;
  const j = await api("commons.wikimedia.org", {
    action: "query", titles: t, prop: "imageinfo", iiprop: "url|size|extmetadata|mime", iiurlwidth: String(GENISLIK)
  });
  const p = j.query && j.query.pages && j.query.pages[0];
  if (!p || p.missing || !p.imageinfo) return { hata: "Commons'ta yok (yerel/adil kullanım olabilir)" };
  const ii = p.imageinfo[0], m = ii.extmetadata || {};
  const v = k => (m[k] && m[k].value) || "";
  if (/true/i.test(v("NonFree"))) return { hata: "özgür değil" };
  if (!/^image\/(jpeg|png|webp)$/.test(ii.mime)) return { hata: "biçim " + ii.mime };
  let credit = (strip(v("Artist")) || strip(v("Credit")) || "")
    .replace(/^No machine-readable author provided\.\s*([^~\s]+)\S*\s+assumed.*$/i, "$1")
    .replace(/ at \S+ Wikipedia\.?$/i, "")
    .replace(/^The original uploader was (.+?) at .+$/i, "$1")
    .replace(/^(Unknown author\s*)+$/i, "").replace(/^Unknown\b.*$/i, "")
    .replace(/^User:/, "").trim();
  if (!credit) credit = "Yazarı bilinmiyor";
  if (credit.length > 70) credit = credit.slice(0, 68).trim() + "…";
  return {
    src: temizUrl(ii.thumburl || ii.url), w: ii.thumbwidth || ii.width, h: ii.thumbheight || ii.height,
    credit, license: strip(v("LicenseShortName")) || "bkz. dosya sayfası",
    page: ii.descriptionurl, file: p.title
  };
}

(async () => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(KOK, "data", "olaylar.js"), "utf8") + "\nthis.OLAYLAR = OLAYLAR;", ctx);
  const OLAYLAR = ctx.OLAYLAR;
  const out = {}, rapor = [], eksik = [];
  for (const [i, e] of OLAYLAR.entries()) {
    const adaylar = MADDE[e.t];
    if (!adaylar) { rapor.push(`${i}\t${e.t}\t— MADDE listesinde yok`); eksik.push(e.t); continue; }
    let wiki = null, img = null;
    for (const a of adaylar) {
      const r = await madde(a);
      if (!r) continue;
      if (!wiki) wiki = r;
      if (!img && r.image) img = r.image;
      if (wiki && img) break;
    }
    const kayit = {};
    if (wiki) kayit.wiki = wiki.url;
    let not = "";
    if (YOK.has(e.t)) not = "bilerek görselsiz";
    else {
      const sec = Object.prototype.hasOwnProperty.call(DOSYA, e.t) ? DOSYA[e.t] : img;
      if (sec) {
        const d = await dosya(sec);
        if (d.hata) not = `${sec}: ${d.hata}`;
        else { Object.assign(kayit, { src: d.src, w: d.w, h: d.h, credit: d.credit, license: d.license, page: d.page }); not = d.file + (DOSYA[e.t] ? "  [elle]" : ""); }
      } else not = "baş görsel yok";
    }
    if (!kayit.src) eksik.push(e.t);
    if (kayit.wiki || kayit.src) out[e.t] = kayit;
    rapor.push(`${i}\t${e.t}\t${wiki ? wiki.lang + ":" + wiki.title : "MADDE BULUNAMADI"}\t${not}`);
  }
  const js = `/*
  GÖRSEL LİSTESİ — tools/gorsel_bul.js tarafından üretildi; elle düzenlemeyin.
  Anahtar: kayıt başlığı (OLAYLAR[].t)
    src/w/h : Wikimedia Commons küçük boyutlu görsel (doğrudan bağlantı)
    credit  : yazar · license : lisans · page : Commons dosya sayfası
    wiki    : kaydın Vikipedi maddesi
*/
window.GORSELLER = ${JSON.stringify(out, null, 0).replace(/\},"/g, '},\n"')};
`;
  fs.writeFileSync(path.join(KOK, "data", "gorseller.js"), js);
  fs.writeFileSync(path.join(CACHE, "rapor.txt"), rapor.join("\n") + "\n");
  console.log(rapor.join("\n"));
  console.log(`\n${Object.values(out).filter(x => x.src).length} / ${OLAYLAR.length} kayıtta görsel var.`);
  if (eksik.length) console.log("Görselsiz: " + eksik.join(" · "));
})().catch(e => { console.error(e); process.exit(1); });
