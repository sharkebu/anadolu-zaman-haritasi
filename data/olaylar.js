/*
  ANADOLU ZAMAN HARİTASI — VERİ DOSYASI
  -------------------------------------
  Yeni bir yer/olay eklemek için aşağıdaki listeye bir satır ekleyin.
  Alanlar:
    t   : Başlık
    p   : Dönem anahtarı (DONEMLER içindeki anahtarlardan biri)
    k   : Tür  -> "yer" (yerleşim/kent), "savas", "yapi" (anıt/yapı), "olay"
    lat, lng : Koordinat
    y   : Sıralama için yıl (MÖ için eksi sayı)
    d   : Ekranda gösterilecek tarih metni
    il  : Bugünkü il / ilçe
    c   : Uygarlık / taraflar
    s   : Açıklama
    a   : 1 ise konum yaklaşıktır / tartışmalıdır
*/

const DONEMLER = {
  paleo: { n: "Paleolitik",               r: "~1,3 milyon yıl – MÖ 10.000", c: "#8b6f5a" },
  neo:   { n: "Neolitik",                 r: "MÖ 10.000 – 5500",            c: "#5a9a3a" },
  tunc:  { n: "Kalkolitik & Tunç Çağı",   r: "MÖ 5500 – 1950",              c: "#c99a1c" },
  hitit: { n: "Asur Kolonileri & Hitit",  r: "MÖ 1950 – 1180",              c: "#e0703a" },
  demir: { n: "Demir Çağı Krallıkları",   r: "MÖ 1180 – 550",               c: "#8a56c2" },
  hel:   { n: "Pers & Helenistik",        r: "MÖ 550 – 30",                 c: "#2b9bc0" },
  roma:  { n: "Roma",                     r: "MÖ 30 – MS 330",              c: "#c8407a" },
  biz:   { n: "Bizans & Orta Çağ",        r: "330 – 1461",                  c: "#3a56c8" },
  sel:   { n: "Selçuklu & Beylikler",     r: "1071 – 1450",                 c: "#13a08a" },
  osm:   { n: "Osmanlı",                  r: "1299 – 1918",                 c: "#9e2a2a" },
  kurt:  { n: "Kurtuluş Savaşı",          r: "1919 – 1923",                 c: "#e5383b" },
  cum:   { n: "Cumhuriyet",               r: "1923 – günümüz",              c: "#55657a" }
};

const TURLER = {
  yer:   "Yerleşim / kent",
  yapi:  "Anıt / yapı",
  savas: "Savaş",
  olay:  "Olay"
};

const OLAYLAR = [
  // ───────── PALEOLİTİK ─────────
  { t:"Kocabaş Homo erectus'u", p:"paleo", k:"yer", lat:37.83, lng:29.28, a:1, y:-1200000, d:"~1,1–1,3 milyon yıl önce", il:"Denizli", c:"Homo erectus",
    s:"2002'de bir traverten ocağında bulunan kafatası parçası, Anadolu'da bulunmuş en eski insan (Homo erectus) kalıntısıdır. Anadolu'nun, erken insanların Afrika'dan Avrasya'ya yayıldığı yollar üzerinde olduğunu gösterir." },
  { t:"Yarımburgaz Mağarası", p:"paleo", k:"yer", lat:41.06, lng:28.70, y:-400000, d:"Alt Paleolitik'ten itibaren", il:"İstanbul, Küçükçekmece", c:"Erken insan toplulukları",
    s:"Küçükçekmece Gölü yakınındaki mağara Alt Paleolitik dönemden itibaren insanlar tarafından kullanıldı; aynı katmanlarda mağara ayısı kemikleri de bulundu. Çok daha sonra, Bizans döneminde içine şapeller yapıldı." },
  { t:"Karain Mağarası", p:"paleo", k:"yer", lat:37.07, lng:30.57, y:-250000, d:"Alt Paleolitik – Demir Çağı", il:"Antalya, Döşemealtı", c:"Neandertaller ve modern insanlar",
    s:"Türkiye'nin en önemli mağara yerleşimlerinden biri. Çok uzun bir tabaka dizisi, Neandertal kalıntıları ve binlerce taş alet içerir. Kazılara 1946'da Kılıç Kökten başladı." },

  // ───────── NEOLİTİK ─────────
  { t:"Çayönü", p:"neo", k:"yer", lat:38.216, lng:39.727, y:-10200, d:"MÖ ~10.200 – 6500", il:"Diyarbakır, Ergani", c:"Erken çiftçi toplulukları",
    s:"Evcilleştirilmiş buğday ve hayvanların erken izleri, doğal bakırın dövülerek işlenmesi ve ızgara/hücre planlı yapılarıyla 'tarım devrimini' en iyi belgeleyen yerleşmelerden biri. 1964'ten itibaren Halet Çambel ve Robert Braidwood tarafından kazıldı." },
  { t:"Göbekli Tepe", p:"neo", k:"yapi", lat:37.2233, lng:38.9224, y:-9600, d:"MÖ ~9600 – 8200", il:"Şanlıurfa, Haliliye", c:"Avcı-toplayıcı topluluklar",
    s:"Bilinen en eski anıtsal yapı topluluğu. Hayvan kabartmalı, 5 metreyi aşan T biçimli dikilitaşlar, avcı-toplayıcıların tarımdan önce büyük ortak yapılar inşa ettiğini gösterdi ve 'önce tapınak mı, köy mü?' tartışmasını başlattı. 1995'ten itibaren Klaus Schmidt tarafından kazıldı; 2018'de UNESCO Dünya Mirası Listesi'ne girdi." },
  { t:"Karahan Tepe", p:"neo", k:"yapi", lat:37.104, lng:39.299, y:-9400, d:"MÖ ~9400 – 8000", il:"Şanlıurfa", c:"Avcı-toplayıcı topluluklar",
    s:"'Taş Tepeler' bölgesinin en büyük alanlarından biri. Ana kayaya oyulmuş, duvardan çıkan insan başı ve yılan figürleriyle donatılmış yapılar, Göbekli Tepe'nin tek olmadığını; bölgede benzer pek çok merkez bulunduğunu gösterdi." },
  { t:"Nevali Çori", p:"neo", k:"yer", lat:37.556, lng:38.60, y:-8400, d:"MÖ ~8400 – 8000", il:"Şanlıurfa, Hilvan", c:"Erken Neolitik köy toplulukları",
    s:"T biçimli dikilitaşları ve kireçtaşı heykelleriyle Göbekli Tepe'nin çağdaşı bir köy. Atatürk Barajı gölü altında kaldığı için 1992'de sular altına girdi; buluntular Şanlıurfa Müzesi'nde." },
  { t:"Aşıklı Höyük", p:"neo", k:"yer", lat:38.35, lng:34.23, y:-8300, d:"MÖ ~8300 – 7400", il:"Aksaray, Gülağaç", c:"Erken Neolitik köy toplulukları",
    s:"Orta Anadolu'nun bilinen en eski köylerinden. Bitişik kerpiç evleri, koyun-keçinin evcilleştirilme sürecine dair kanıtları ve trepanasyon (kafatası açma) izi taşıyan bir kafatasıyla bilinir." },
  { t:"Çatalhöyük", p:"neo", k:"yer", lat:37.668, lng:32.828, y:-7100, d:"MÖ ~7100 – 5950", il:"Konya, Çumra", c:"Neolitik kent toplulukları",
    s:"Neolitik çağın en büyük ve en iyi korunmuş yerleşmelerinden biri: binlerce kişi kapısız, bitişik evlerde yaşar ve evlere damdan girerdi. Duvar resimleri, kabartmalar ve ünlü 'oturan kadın' heykelciği burada bulundu. 1961'de James Mellaart, 1993'ten sonra Ian Hodder kazdı; 2012'den beri UNESCO Dünya Mirası." },
  { t:"Hacılar", p:"neo", k:"yer", lat:37.58, lng:30.08, y:-7000, d:"MÖ 7. – 6. binyıl", il:"Burdur", c:"Neolitik–Kalkolitik çiftçiler",
    s:"Göller Bölgesi'nde, kırmızı astarlı boyalı çanak çömlekleri ve ana tanrıça figürinleriyle tanınan köy. Neolitik'ten Kalkolitik'e geçişi izlemek için önemli bir merkezdir." },

  // ───────── KALKOLİTİK & TUNÇ ─────────
  { t:"Arslantepe", p:"tunc", k:"yer", lat:38.382, lng:38.361, y:-3300, d:"MÖ 4. binyıl ve sonrası", il:"Malatya, Battalgazi", c:"Erken devlet toplulukları; sonra Geç Hitit Melid",
    s:"MÖ 4. binyılda Anadolu'nun en eski saray/yönetim yapılarından birine sahipti. Burada bulunan arsenikli bakır kılıçlar (MÖ ~3300) dünyanın bilinen en eski kılıçlarıdır. Demir Çağı'nda Geç Hitit krallığı Melid'in merkezi oldu; 2021'de UNESCO Dünya Mirası Listesi'ne alındı." },
  { t:"Troya", p:"tunc", k:"yer", lat:39.957, lng:26.239, y:-3000, d:"MÖ ~3000 – MS 500", il:"Çanakkale", c:"Troya / Hitit kaynaklarında Wilusa",
    s:"Üst üste kurulmuş dokuz ana katmandan oluşan efsanevi kent; Homeros'un İlyada'sındaki Troya Savaşı'nın geçtiği yer olarak kabul edilir. 1871'de Heinrich Schliemann'ın kazılarıyla ünlendi; Hitit belgelerindeki 'Wilusa' ile eşleştirilir. 1998'den beri UNESCO Dünya Mirası." },
  { t:"Alacahöyük", p:"tunc", k:"yer", lat:40.235, lng:34.695, y:-2500, d:"MÖ ~2500 (kral mezarları)", il:"Çorum", c:"Hattiler; sonra Hititler",
    s:"Erken Tunç Çağı kral mezarlarından çıkan bronz güneş kursları ve geyik heykelcikleri Anadolu maden sanatının şaheserleridir. Hitit döneminde kente sfenksli bir kapı eklendi. 1935'te Atatürk'ün desteğiyle başlayan, Türk arkeologlarca yürütülen ilk ulusal kazılardandır." },

  // ───────── ASUR KOLONİLERİ & HİTİT ─────────
  { t:"Kültepe – Kaniş/Neşa", p:"hitit", k:"yer", lat:38.85, lng:35.635, y:-1950, d:"MÖ ~1950 – 1750 (Karum dönemi)", il:"Kayseri, Kocasinan", c:"Asurlu tüccarlar ve yerli Anadolu krallıkları",
    s:"Asurlu tüccarların kurduğu ticaret kolonilerinin (karum) merkezi. Burada bulunan 20 binden fazla çivi yazılı tablet, Anadolu'da yazının kullanıldığını gösteren ilk belgelerdir ve Anadolu'da tarih çağlarını başlatır. Kalay ve kumaş getirip altın-gümüş götüren bu ağ, Asur ile Anadolu'yu birbirine bağladı." },
  { t:"Hattuşa", p:"hitit", k:"yer", lat:40.0197, lng:34.6153, y:-1650, d:"MÖ ~1650 – 1180", il:"Çorum, Boğazkale", c:"Hititler",
    s:"Hitit İmparatorluğu'nun başkenti; Aslanlı Kapı, Kral Kapısı ve Yer Kapı'lı surlarla çevriliydi. Arşivlerinden çıkan binlerce tablet arasında, Mısır ile yapılan ve bilinen en eski yazılı barış antlaşmalarından sayılan Kadeş Antlaşması'nın (MÖ ~1259) Akadca nüshası da vardır. Hititçenin Hint-Avrupa dili olduğu 1915'te bu tabletlerden çözüldü. 1986'dan beri UNESCO Dünya Mirası." },
  { t:"Şapinuva", p:"hitit", k:"yer", lat:40.27, lng:35.25, y:-1400, d:"MÖ 15. – 14. yy", il:"Çorum, Ortaköy", c:"Hititler",
    s:"Hitit krallarının ikinci bir yönetim ve askeri merkez olarak kullandığı kent. Aygül Süel başkanlığındaki kazılarda binlerce Hitit tableti ve büyük yapı kalıntıları bulundu." },
  { t:"Yazılıkaya", p:"hitit", k:"yapi", lat:40.0255, lng:34.6316, y:-1250, d:"MÖ 13. yy", il:"Çorum, Boğazkale", c:"Hititler",
    s:"Hattuşa'nın hemen yakınındaki açık hava kaya tapınağı. Kayalara işlenmiş tanrı-tanrıça alayı ve Kral IV. Tuthaliya kabartması, Hitit inanç dünyasının en önemli görsel kaynağıdır." },
  { t:"Eflatunpınar", p:"hitit", k:"yapi", lat:37.865, lng:31.665, y:-1250, d:"MÖ 13. yy", il:"Konya, Beyşehir", c:"Hititler",
    s:"Kaynak suyunun toplandığı havuzun kenarına kurulmuş, kabartmalı bloklardan oluşan Hitit kutsal su anıtı. Hititlerin suyu ve kaynakları kutsal saydığını gösteren en etkileyici örneklerdendir." },
  { t:"Karabel Kabartması", p:"hitit", k:"yapi", lat:38.38, lng:27.40, a:1, y:-1220, d:"MÖ 13. yy sonu", il:"İzmir, Kemalpaşa", c:"Mira Krallığı (Hitit vasalı)",
    s:"Batı Anadolu'daki Mira krallığının kralı Tarkasnawa'yı gösteren kaya kabartması. Herodotos onu yanlışlıkla Mısır firavunu Sesostris'e bağlamıştı; Luvice yazıtının okunması Hitit dönemi Batı Anadolu'sunun siyasi haritasını netleştirdi." },
  { t:"Yesemek Heykel Atölyesi", p:"hitit", k:"yapi", lat:36.886, lng:36.735, a:1, y:-1300, d:"MÖ 14. – 8. yy", il:"Gaziantep, İslahiye", c:"Hititler ve Geç Hitit krallıkları",
    s:"Anadolu'nun bilinen en büyük antik taş ocağı ve heykel atölyesi. Yarım kalmış yüzlerce aslan, sfenks ve dağ tanrısı heykeli, üretimin her aşamasını bir arada gösterir." },

  // ───────── DEMİR ÇAĞI KRALLIKLARI ─────────
  { t:"Karkamış", p:"demir", k:"yer", lat:36.83, lng:38.01, y:-1100, d:"MÖ ~1180 – 605 (Geç Hitit)", il:"Gaziantep, Karkamış", c:"Geç Hitit krallığı",
    s:"Hitit İmparatorluğu çöktükten sonra varlığını sürdüren en güçlü Geç Hitit krallığının merkezi; Luvi hiyeroglifli kabartmaları ünlüdür. MÖ 605'te Babil veliahtı Nebukadnezar'ın Mısır ordusunu yendiği Karkamış Savaşı burada yaşandı." },
  { t:"Zincirli – Sam'al", p:"demir", k:"yer", lat:37.10, lng:36.68, y:-850, d:"MÖ 10. – 7. yy", il:"Gaziantep, İslahiye", c:"Sam'al Krallığı (Arami-Luvi)",
    s:"Geç Hitit–Arami krallığı Sam'al'ın başkenti. Burada bulunan Kuttamuwa steli, ölümden sonra ruhun taşta yaşadığı inancını anlatan yazıtıyla ünlüdür." },
  { t:"Tuşpa – Van Kalesi", p:"demir", k:"yer", lat:38.502, lng:43.343, y:-840, d:"MÖ ~840 – 600", il:"Van, Tuşba", c:"Urartular (Biainili)",
    s:"Urartu Krallığı'nın başkenti. I. Sarduri'nin yaptırdığı 'Sardur Burcu' yazıtı Urartu tarihinin başlangıç belgesidir. Kayalığa oyulmuş kral mezarları, kilometrelerce uzanan su kanalları ve kaleler Urartuların mühendislik becerisini gösterir." },
  { t:"Gordion", p:"demir", k:"yer", lat:39.65, lng:31.98, y:-800, d:"MÖ ~900 – 540 (Frig başkenti)", il:"Ankara, Polatlı", c:"Frigler",
    s:"Frig Krallığı'nın başkenti. MÖ 8. yy sonuna tarihlenen dev Midas Tümülüsü, ayakta kalmış en eski ahşap yapılardan birini barındırır. Efsaneye göre Büyük İskender MÖ 333'te 'Gordion düğümü'nü kılıcıyla burada kesti. 2023'te UNESCO Dünya Mirası Listesi'ne girdi." },
  { t:"Çavuştepe – Sardurihinili", p:"demir", k:"yer", lat:38.37, lng:43.47, y:-750, d:"MÖ 8. yy", il:"Van, Gürpınar", c:"Urartular",
    s:"II. Sarduri'nin kurdurduğu Urartu kalesi. Kayaya oyulmuş sarnıçları, tahıl ve şarap depoları ve Haldi tapınağı kalıntılarıyla Urartu kale-kent düzeninin iyi korunmuş bir örneğidir." },
  { t:"İvriz Kabartması", p:"demir", k:"yapi", lat:37.43, lng:34.17, y:-730, d:"MÖ 8. yy", il:"Konya, Ereğli", c:"Tabal Krallığı",
    s:"Tabal kralı Warpalawas'ın, elinde üzüm salkımı ve buğday başakları tutan bereket tanrısı Tarhunza'ya dua edişini gösteren kaya kabartması; Luvi hiyeroglif yazıtlıdır." },
  { t:"Karatepe-Aslantaş", p:"demir", k:"yapi", lat:37.29, lng:36.25, y:-700, d:"MÖ 8. – 7. yy", il:"Osmaniye, Kadirli", c:"Geç Hitit / Kue Krallığı",
    s:"Azatiwada'nın sınır kalesi. Kapılardaki Fenikece–Luvice iki dilli yazıt, Luvi hiyeroglif yazısının çözülmesinde anahtar rol oynadı. 1946'da Halet Çambel ve Helmuth Bossert tarafından keşfedildi; bugün açık hava müzesidir." },
  { t:"Eski Smyrna – Bayraklı", p:"demir", k:"yer", lat:38.4637, lng:27.1683, y:-700, d:"MÖ ~3000'den; 7. yy'da zirve", il:"İzmir, Bayraklı", c:"İyonyalılar",
    s:"İzmir'in ilk kuruluş yeri. Athena tapınağı ve düzenli sokak planıyla erken İyon kentleşmesinin en iyi örneklerinden; Homeros'un bu kentte yaşadığı rivayet edilir. MÖ 600 civarında Lidya kralı Alyattes tarafından tahrip edildi." },
  { t:"Ayanis Kalesi", p:"demir", k:"yapi", lat:38.71, lng:43.20, a:1, y:-673, d:"MÖ 7. yy (~673)", il:"Van, Tuşba", c:"Urartular",
    s:"II. Rusa'nın Van Gölü kıyısına kurdurduğu kale (Rusahinili Eiduru-kai). Taş kakma süslemeli Haldi tapınağı duvarları ve uzun yazıtıyla Urartu'nun son büyük inşa evresini temsil eder." },
  { t:"Sardes", p:"demir", k:"yer", lat:38.488, lng:28.04, y:-650, d:"MÖ ~680 – 546 (Lidya başkenti)", il:"Manisa, Salihli", c:"Lidyalılar",
    s:"Lidya Krallığı'nın başkenti. Bilinen ilk madeni paralar (elektron sikkeler) MÖ 7. yy sonunda Lidya'da basıldı; Kroisos döneminde saf altın ve gümüş sikkeye geçildi. MÖ 547/546'da Pers kralı Kyros kenti aldı; Sardes, Susa'ya uzanan Pers Kral Yolu'nun batı ucu oldu." },
  { t:"Milet", p:"demir", k:"yer", lat:37.53, lng:27.278, y:-600, d:"MÖ 7. – 6. yy'da zirve", il:"Aydın, Didim", c:"İyonyalılar",
    s:"Thales, Anaksimandros ve Anaksimenes'in yetiştiği, doğayı mitlerle değil akılla açıklamaya çalışan İyon doğa felsefesinin doğduğu kent. Karadeniz kıyılarında onlarca koloni kurdu. MÖ 494'te Perslerce yıkıldı; yeniden kurulurken Miletli Hippodamos'un ızgara planı uygulandı." },
  { t:"Midas Şehri", p:"demir", k:"yapi", lat:39.19, lng:30.73, y:-600, d:"MÖ 7. – 6. yy", il:"Eskişehir, Han", c:"Frigler",
    s:"Frig vadisinde kayaya oyulmuş, yaklaşık 17 metrelik cephesiyle Midas Anıtı; üzerindeki Frigce yazıtta 'Midas' adı geçer. Ana tanrıça Kybele (Matar) kültünün en önemli merkezlerinden biridir." },
  { t:"Artemis Tapınağı (Artemision)", p:"demir", k:"yapi", lat:37.9497, lng:27.3639, y:-550, d:"MÖ ~550", il:"İzmir, Selçuk", c:"İyonyalılar / Lidya",
    s:"Dünyanın Yedi Harikası'ndan biri. Lidya kralı Kroisos'un katkısıyla inşa edilen dev tapınak MÖ 356'da Herostratos tarafından yakıldı, sonra yeniden yapıldı. Bugün yerinde tek bir sütun yükselir." },
  { t:"Kerkenes (Pteria?)", p:"demir", k:"yer", lat:39.75, lng:34.61, a:1, y:-547, d:"MÖ 7. – 6. yy (~547'de yıkıldı)", il:"Yozgat, Sorgun", c:"Frig kültürü / Medler?",
    s:"Yaklaşık 7 km'lik surlarla çevrili, Demir Çağı'nın en büyük kentlerinden biri. Antik Pteria olduğu düşünülür; MÖ 547 civarında Lidya kralı Kroisos'un seferi sırasında yakılıp terk edildiği tahmin edilir." },
  { t:"Ksanthos – Letoon", p:"demir", k:"yer", lat:36.356, lng:29.318, y:-545, d:"MÖ 6. yy – Roma dönemi", il:"Antalya, Kaş / Muğla, Seydikemer", c:"Likyalılar",
    s:"Likya'nın başkenti. MÖ 545'te Pers kuşatmasına teslim olmak yerine halkın kenti ateşe verdiği anlatılır. Yakındaki Letoon'da bulunan Likçe–Yunanca–Aramice üç dilli yazıt (MÖ 337), Likçenin çözülmesine yardımcı oldu. 1988'den beri UNESCO Dünya Mirası." },

  // ───────── PERS & HELENİSTİK ─────────
  { t:"Daskyleion", p:"hel", k:"yer", lat:40.13, lng:28.08, a:1, y:-540, d:"MÖ 6. – 4. yy", il:"Balıkesir, Bandırma", c:"Persler (Akamenidler)",
    s:"Hellespontos Frygiası satraplığının merkezi; Anadolu'daki Pers yönetiminin önemli kentlerinden. Kazılarda satrap arşivine ait mühür baskıları ve Greko-Pers üslupta kabartmalı steller bulundu." },
  { t:"Halikarnas Mozolesi", p:"hel", k:"yapi", lat:37.038, lng:27.424, y:-350, d:"MÖ ~350", il:"Muğla, Bodrum", c:"Karya Satraplığı (Hekatomnidler)",
    s:"Karya satrabı Mausolos için yapılan anıt mezar; Dünyanın Yedi Harikası'ndan biri ve 'mozole' sözcüğünün kaynağı. Depremlerle yıkıldı; taşları 15. yy'da Rodos Şövalyeleri tarafından Bodrum Kalesi'nde kullanıldı. 'Tarihin babası' Herodotos da Halikarnaslıdır." },
  { t:"Priene", p:"hel", k:"yer", lat:37.66, lng:27.30, y:-350, d:"MÖ 4. yy (yeniden kuruluş)", il:"Aydın, Söke", c:"İyonyalılar",
    s:"Yamaçta ızgara (Hippodamik) planla kurulmuş, Helenistik kent planlamasının en iyi korunmuş örneği. Athena Tapınağı'nı Büyük İskender'in finanse ettiğini bildiren yazıtıyla bilinir." },
  { t:"Granikos Savaşı", p:"hel", k:"savas", lat:40.25, lng:27.24, a:1, y:-334, d:"MÖ 334 (Mayıs)", il:"Çanakkale, Biga", c:"Makedonya – Pers İmparatorluğu",
    s:"Büyük İskender'in Anadolu'ya geçtikten sonra Pers satraplarına karşı kazandığı ilk büyük meydan savaşı (bugünkü Biga Çayı kıyısı). Bu zaferle Batı Anadolu'nun kapısı İskender'e açıldı." },
  { t:"Termessos", p:"hel", k:"yer", lat:36.98, lng:30.46, y:-333, d:"MÖ 333'te kuşatıldı", il:"Antalya, Döşemealtı", c:"Pisidyalılar",
    s:"Güllük Dağı'nda 1000 metrenin üzerinde kurulmuş Pisidya kenti. İskender MÖ 333'te kenti kuşattı ama alamadan vazgeçti. Tiyatrosu ve dağa yayılan mezarlığıyla etkileyicidir." },
  { t:"İssos Savaşı", p:"hel", k:"savas", lat:36.85, lng:36.20, a:1, y:-333, d:"MÖ 333 (Kasım)", il:"Hatay, Dörtyol – Erzin", c:"Makedonya – Pers İmparatorluğu",
    s:"İskender'in Pers kralı III. Dareios'u yendiği savaş; İskenderun Körfezi kıyısında, Pinaros çayı yakınında yaşandı. Dareios kaçtı, ailesi esir düştü ve Doğu'nun yolu İskender'e açıldı." },
  { t:"Didyma Apollon Tapınağı", p:"hel", k:"yapi", lat:37.385, lng:27.256, y:-300, d:"MÖ 4. yy sonu – hiç tamamlanmadı", il:"Aydın, Didim", c:"Miletliler / Helenistik krallıklar",
    s:"Milet'e kutsal yolla bağlı Apollon kehanet merkezi. Helenistik dönemde yeniden inşasına başlanan, yüzü aşkın sütunlu dev tapınak hiçbir zaman tamamlanmadı." },
  { t:"Amasya Kral Kaya Mezarları", p:"hel", k:"yapi", lat:40.6535, lng:35.8285, y:-300, d:"MÖ 3. – 1. yy", il:"Amasya", c:"Pontus Krallığı",
    s:"Pontus krallarının Harşena Dağı'na oyduğu kaya mezarları Amasya'nın simgesidir. Pontus kralı VI. Mithridates, Roma'ya karşı Anadolu'nun en uzun direnişini yürüttü. Ünlü coğrafyacı Strabon da Amasyalıdır." },
  { t:"Bergama – Pergamon", p:"hel", k:"yer", lat:39.132, lng:27.184, y:-281, d:"MÖ 281 – 133 (Attalos Krallığı)", il:"İzmir, Bergama", c:"Attalosoğulları",
    s:"Helenistik dünyanın kültür başkentlerinden. Büyük kütüphanesiyle İskenderiye'ye rakip oldu; rivayete göre Mısır papirüs satışını kısınca geliştirilen parşömen adını buradan aldı (pergamene). Zeus Sunağı bugün Berlin'dedir. III. Attalos MÖ 133'te krallığı Roma'ya miras bıraktı. 2014'ten beri UNESCO Dünya Mirası." },
  { t:"Nemrut Dağı", p:"hel", k:"yapi", lat:37.981, lng:38.741, y:-62, d:"MÖ 1. yy (I. Antiokhos)", il:"Adıyaman, Kahta", c:"Kommagene Krallığı",
    s:"Kommagene kralı I. Antiokhos'un yaklaşık 2150 metredeki tümülüsü ve çevresindeki dev tanrı-kral heykelleri. Pers ve Yunan tanrılarını harmanlayan bu anıt, Doğu ile Batı kültürlerinin buluşmasının simgesidir. 1987'den beri UNESCO Dünya Mirası." },
  { t:"Zela Savaşı – 'Veni, vidi, vici'", p:"hel", k:"savas", lat:40.30, lng:35.89, y:-47, d:"MÖ 47 (2 Ağustos)", il:"Tokat, Zile", c:"Roma – Pontus",
    s:"Julius Caesar'ın Pontus kralı II. Pharnakes'i birkaç saat içinde yendiği savaş. Caesar zaferi Roma'ya 'Veni, vidi, vici' (Geldim, gördüm, yendim) sözleriyle bildirdi." },

  // ───────── ROMA ─────────
  { t:"Ankara – Augustus Tapınağı", p:"roma", k:"yapi", lat:39.9446, lng:32.8578, y:-20, d:"MÖ ~25 – MS 20", il:"Ankara, Altındağ", c:"Roma İmparatorluğu (Galatya eyaleti)",
    s:"Galatya eyaletinin başkenti Ankyra'daki tapınağın duvarlarında, İmparator Augustus'un kendi icraatlarını anlattığı Res Gestae metninin Latince–Yunanca en eksiksiz kopyası bulunur; bu yüzden 'Monumentum Ancyranum' olarak anılır." },
  { t:"Tarsus", p:"roma", k:"yer", lat:36.917, lng:34.893, y:5, d:"MÖ 41 / MS 1. yy", il:"Mersin, Tarsus", c:"Roma İmparatorluğu (Kilikya)",
    s:"Kilikya'nın başkenti. MÖ 41'de Kleopatra'nın Marcus Antonius ile buluştuğu kent; Hristiyanlığın yayılmasında büyük rol oynayan Aziz Pavlus da burada doğdu. Antik Roma yolu ve 'Kleopatra Kapısı' bugün de görülebilir." },
  { t:"Antakya – Antiokheia", p:"roma", k:"yer", lat:36.20, lng:36.16, y:40, d:"MÖ 300'de kuruldu; Roma'da zirve", il:"Hatay, Antakya", c:"Seleukoslar & Roma",
    s:"I. Seleukos tarafından kuruldu; Roma döneminde imparatorluğun en büyük kentlerinden biri oldu. İsa'nın takipçilerine ilk kez 'Hristiyan' denilen kent olarak bilinir; kayaya oyulmuş St. Pierre Kilisesi bu geleneğe bağlanır. Hatay Arkeoloji Müzesi dünyanın en zengin mozaik koleksiyonlarından birine sahiptir." },
  { t:"Zeugma", p:"roma", k:"yer", lat:37.06, lng:37.87, y:100, d:"MÖ 300 – MS 3. yy", il:"Gaziantep, Nizip", c:"Kommagene & Roma",
    s:"Fırat'ın geçit noktasındaki garnizon ve ticaret kenti. Villalarından çıkarılan mozaikler, özellikle 'Çingene Kızı', Gaziantep Zeugma Mozaik Müzesi'nde sergilenir. Kentin bir bölümü 2000'de Birecik Barajı suları altında kaldı." },
  { t:"Hierapolis – Pamukkale", p:"roma", k:"yer", lat:37.925, lng:29.126, y:100, d:"MÖ 2. yy – MS 7. yy", il:"Denizli, Pamukkale", c:"Bergama Krallığı & Roma",
    s:"Termal sularıyla şifa merkezi olan kent, bembeyaz traverten teraslarının üzerine kurulmuştur. Anadolu'nun en büyük antik mezarlıklarından birine ve Aziz Philippos'a adanmış yapıya sahiptir. 1988'den beri UNESCO Dünya Mirası." },
  { t:"Efes", p:"roma", k:"yer", lat:37.9394, lng:27.3417, y:110, d:"MÖ 10. yy – MS 15. yy; Roma'da zirve", il:"İzmir, Selçuk", c:"Roma İmparatorluğu (Asya eyaleti)",
    s:"Roma'nın Asya eyaletinin en büyük kentlerinden. MS 2. yy başında yapılan Celsus Kütüphanesi, yaklaşık 25 bin kişilik büyük tiyatro ve yamaç evleri ünlüdür. Aziz Pavlus burada vaaz verdi; 431'de III. Ekümenik Konsil toplandı. 2015'ten beri UNESCO Dünya Mirası." },
  { t:"Perge", p:"roma", k:"yer", lat:36.96, lng:30.854, y:120, d:"Roma'da zirve (MS 2. yy)", il:"Antalya, Aksu", c:"Pamfilya / Roma",
    s:"Pamfilya'nın önde gelen kentlerinden. Ortasından su kanalı akan sütunlu caddesi, stadyumu ve heykelleri ünlüdür. Kadın hayırsever Plancia Magna kentin anıtsal kapısını yaptırdı; Aziz Pavlus ilk misyon yolculuğunda buraya uğradı." },
  { t:"Afrodisias", p:"roma", k:"yer", lat:37.709, lng:28.724, y:150, d:"MÖ 1. yy – MS 6. yy", il:"Aydın, Karacasu", c:"Roma İmparatorluğu",
    s:"Afrodit'e adanmış kent; yakındaki mermer ocakları sayesinde Roma dünyasının ünlü heykeltıraşlık okuluna ev sahipliği yaptı. Tetrapylon (anıtsal kapı), stadyum ve Sebasteion kabartmaları ünlüdür. Kazılarını uzun yıllar Kenan Erim yürüttü; 2017'den beri UNESCO Dünya Mirası." },
  { t:"Sagalassos", p:"roma", k:"yer", lat:37.677, lng:30.517, y:160, d:"MÖ 4. yy – MS 7. yy", il:"Burdur, Ağlasun", c:"Pisidyalılar / Roma",
    s:"Toros Dağları'nda yaklaşık 1500 m yükseklikte kurulmuş Pisidya kenti. Restore edilen Antoninler Çeşmesi ve bulunan dev Hadrianus heykeli parçalarıyla tanınır." },
  { t:"Aspendos Tiyatrosu", p:"roma", k:"yapi", lat:36.939, lng:31.172, y:165, d:"MS 2. yy", il:"Antalya, Serik", c:"Roma İmparatorluğu",
    s:"Marcus Aurelius döneminde mimar Zenon'un inşa ettiği tiyatro, antik dünyadan günümüze en iyi korunmuş tiyatrolardan biridir ve hâlâ etkinliklere ev sahipliği yapar. Kentin su kemerleri de Roma mühendisliğinin önemli örneklerindendir." },

  // ───────── BİZANS & ORTA ÇAĞ ─────────
  { t:"İznik – Nikaia", p:"biz", k:"olay", lat:40.4295, lng:29.7195, y:325, d:"325 ve 787 (Konsiller)", il:"Bursa, İznik", c:"Roma / Bizans",
    s:"325'te I. Constantinus'un topladığı İznik Konsili, Hristiyanlığın temel inanç metnini belirledi; 787'de VII. Ekümenik Konsil de burada toplandı. Kent sonra Türkiye Selçuklularının ilk başkenti (1075–1097) oldu, 1331'de Orhan Gazi tarafından alındı ve 16. yy'da çinileriyle ünlendi." },
  { t:"Konstantinopolis'in kuruluşu", p:"biz", k:"olay", lat:41.0084, lng:28.9714, y:330, d:"11 Mayıs 330", il:"İstanbul, Fatih", c:"Roma / Bizans İmparatorluğu",
    s:"I. Constantinus, eski Byzantion'u 'Yeni Roma' olarak yeniden kurup imparatorluğun başkenti yaptı. 5. yy'da inşa edilen Theodosius surları kenti bin yıl korudu; Konstantinopolis 1453'e kadar Doğu Roma (Bizans) İmparatorluğu'nun başkenti kaldı." },
  { t:"Diyarbakır Surları", p:"biz", k:"yapi", lat:37.91, lng:40.24, y:349, d:"4. yy (Roma) ve sonrası", il:"Diyarbakır", c:"Roma, Bizans, Mervaniler, Artuklular…",
    s:"Amida kentini çevreleyen yaklaşık 5,5 km'lik surlar, Roma imparatoru II. Constantius döneminde bugünkü boyutuna ulaştı; sonraki her hâkim güç yazıt ve burç ekledi. Hevsel Bahçeleri ile birlikte 2015'te UNESCO Dünya Mirası oldu." },
  { t:"Sümela Manastırı", p:"biz", k:"yapi", lat:40.69, lng:39.658, y:386, d:"4. yy'da kuruldu (rivayet)", il:"Trabzon, Maçka", c:"Bizans / Trabzon Rum İmparatorluğu",
    s:"Altındere vadisinde sarp bir kayalığa kurulmuş Meryem Ana manastırı. Rivayete göre 386'da kuruldu; bugün görülen yapıların çoğu daha geç dönemlere aittir. Freskleriyle tanınır." },
  { t:"Kadıköy – Khalkedon Konsili", p:"biz", k:"olay", lat:40.99, lng:29.025, y:451, d:"451", il:"İstanbul, Kadıköy", c:"Bizans İmparatorluğu",
    s:"451'de toplanan IV. Ekümenik Konsil, İsa'nın doğasına dair aldığı kararla bazı Doğu kiliselerinin ayrılmasına yol açtı. Khalkedon, Byzantion'dan önce kurulduğu için antik çağda 'Körler Ülkesi' diye anılmıştır." },
  { t:"Dara", p:"biz", k:"yer", lat:37.175, lng:40.94, y:505, d:"505 – 7. yy", il:"Mardin, Artuklu (Oğuz köyü)", c:"Bizans – Sasani sınırı",
    s:"İmparator I. Anastasios'un Sasani sınırına karşı kurdurduğu kale kent. Kayaya oyulmuş dev sarnıçları ve nekropolüyle Bizans–Sasani rekabetinin en önemli izlerindendir; 530'daki Dara Savaşı'nda Belisarius Sasanileri yendi." },
  { t:"Ayasofya", p:"biz", k:"yapi", lat:41.0086, lng:28.9802, y:537, d:"537", il:"İstanbul, Fatih", c:"Bizans İmparatorluğu",
    s:"İmparator I. Justinianus'un mimarlar Anthemios ve İsidoros'a yaptırdığı, dev kubbesiyle mimarlık tarihinde çığır açan bazilika. 1453'te camiye çevrildi, 1934'te müze oldu, 2020'de yeniden camiye dönüştürüldü." },
  { t:"Derinkuyu Yeraltı Şehri", p:"biz", k:"yapi", lat:38.3735, lng:34.735, y:700, d:"Kökeni MÖ 1. binyıl; Bizans'ta genişledi", il:"Nevşehir, Derinkuyu", c:"Kapadokya halkı / Bizans",
    s:"Yaklaşık 85 m derinliğe inen, sekiz kattan fazla yeraltı şehri. Havalandırma bacaları, ahırları, şarap işlikleri ve yuvarlak sürgü taş kapıları vardır; özellikle Bizans döneminde Arap akınlarına karşı sığınak olarak genişletildi." },
  { t:"Harran", p:"biz", k:"yer", lat:36.866, lng:39.03, y:744, d:"MÖ 3. binyıl – 13. yy; 744–750 Emevi başkenti", il:"Şanlıurfa, Harran", c:"Asur, Roma, Emeviler, Abbasiler",
    s:"Ay tanrısı Sin'in kült merkezi olarak Asur kaynaklarında geçen kadim kent. Son Emevi halifesi II. Mervan'ın başkenti oldu; Abbasi döneminde astronomi ve felsefe çalışmalarıyla bir bilim merkezi olarak öne çıktı. Konik kubbeli kerpiç evleri bugün de görülebilir." },
  { t:"Akdamar Kilisesi", p:"biz", k:"yapi", lat:38.341, lng:43.035, y:915, d:"915 – 921", il:"Van, Gevaş", c:"Vaspurakan Ermeni Krallığı",
    s:"Van Gölü'ndeki Akdamar Adası'nda, Vaspurakan kralı I. Gagik Artsruni'nin yaptırdığı Kutsal Haç Kilisesi. Dış cephedeki kutsal kitap sahnelerini anlatan kabartmalar Orta Çağ Ermeni sanatının başyapıtıdır; 2007'de restore edilerek müze olarak açıldı." },
  { t:"Ani", p:"biz", k:"yer", lat:40.5075, lng:43.5725, y:961, d:"961 – 1045 başkent; 1064 Selçuklu fethi", il:"Kars", c:"Bagratlı Ermeni Krallığı; sonra Selçuklular",
    s:"Bagratlı Ermeni Krallığı'nın başkenti; 'bin bir kilise kenti' olarak anılır. 1064'te Alp Arslan tarafından fethedildi; Ebu'l-Menuçehr Camii Anadolu'daki ilk Türk camilerinden sayılır. 2016'dan beri UNESCO Dünya Mirası." },
  { t:"Kapadokya – Göreme", p:"biz", k:"yapi", lat:38.6396, lng:34.8448, y:1000, d:"Kaya kiliseleri: 4. – 12. yy", il:"Nevşehir, Göreme", c:"Bizans İmparatorluğu",
    s:"Volkanik tüfün aşınmasıyla oluşan peribacalarına oyulmuş yüzlerce kilise ve manastır. 10.–12. yy'a ait Karanlık Kilise ve Tokalı Kilise freskleri Bizans sanatının başyapıtları arasındadır. 1985'ten beri UNESCO Dünya Mirası." },
  { t:"Trabzon Rum İmparatorluğu", p:"biz", k:"olay", lat:41.0045, lng:39.7178, y:1204, d:"1204 – 1461", il:"Trabzon", c:"Komnenos hanedanı",
    s:"IV. Haçlı Seferi sırasında Komnenos hanedanından prensler Trabzon'da bağımsız bir imparatorluk kurdu. Karadeniz ticaretiyle zenginleşen devlet 1461'de Fatih Sultan Mehmed tarafından Osmanlı topraklarına katıldı. Trabzon Ayasofyası bu dönemin eseridir." },

  // ───────── SELÇUKLU & BEYLİKLER ─────────
  { t:"Malazgirt Meydan Muharebesi", p:"sel", k:"savas", lat:39.145, lng:42.54, a:1, y:1071, d:"26 Ağustos 1071", il:"Muş, Malazgirt", c:"Büyük Selçuklu – Bizans",
    s:"Sultan Alp Arslan'ın Bizans imparatoru IV. Romanos Diogenes'i yenip esir aldığı savaş. Bu zaferle Anadolu'nun kapıları Türklere açıldı; kısa sürede Türkiye Selçukluları ile Danişmendli, Saltuklu, Artuklu ve Mengücekli beylikleri kuruldu." },
  { t:"Niksar – Danişmendliler", p:"sel", k:"yer", lat:40.59, lng:36.95, y:1080, d:"~1071 – 1178", il:"Tokat, Niksar", c:"Danişmendliler",
    s:"Danişmend Gazi'nin kurduğu Danişmendli Beyliği'nin ilk merkezlerinden. Yağıbasan Medresesi (1157), Anadolu'da tarihi bilinen en eski medreselerdendir. Beylik 1178'de Türkiye Selçuklularına katıldı." },
  { t:"Dorylaion Savaşı", p:"sel", k:"savas", lat:39.78, lng:30.52, a:1, y:1097, d:"1 Temmuz 1097", il:"Eskişehir", c:"Türkiye Selçukluları – I. Haçlı Seferi",
    s:"İznik'i Haçlılara kaptıran I. Kılıç Arslan'ın Haçlı ordusuyla yaptığı savaş. Yenilginin ardından başkent Konya'ya taşındı; Haçlılar Anadolu'yu geçerek Antakya'ya ilerledi." },
  { t:"Konya – Selçuklu Başkenti", p:"sel", k:"yer", lat:37.8745, lng:32.4935, y:1097, d:"~1097 – 1308", il:"Konya, Selçuklu", c:"Türkiye Selçukluları",
    s:"Türkiye Selçuklu Devleti'nin başkenti. Alaeddin Tepesi'ndeki Alaeddin Camii, Karatay ve İnce Minareli medreseler Selçuklu taş ve çini işçiliğinin seçkin örnekleridir. Kent, I. Alaeddin Keykubad döneminde (1220–1237) en parlak çağını yaşadı." },
  { t:"Antakya Kuşatması", p:"sel", k:"savas", lat:36.21, lng:36.17, y:1098, d:"1097 – 1098", il:"Hatay, Antakya", c:"I. Haçlı Seferi – Selçuklu valileri",
    s:"Haçlılar sekiz ay süren kuşatmanın ardından 1098'de Antakya'yı aldı ve Antakya Haçlı Prinkepsliği'ni kurdu. Kent 1268'de Memluk sultanı Baybars tarafından geri alındı." },
  { t:"Hasankeyf", p:"sel", k:"yer", lat:37.713, lng:41.412, y:1150, d:"Artuklu dönemi: 12. – 13. yy", il:"Batman, Hasankeyf", c:"Artuklular & Eyyubiler",
    s:"Dicle kıyısında, binlerce mağara konutu barındıran kadim kent. Artuklular döneminde yapılan dev Dicle köprüsü, Orta Çağ'ın en büyük köprülerinden biriydi. Ilısu Barajı nedeniyle 2020'de kentin büyük kısmı sular altında kaldı; bazı anıtlar yeni yerleşim alanına taşındı." },
  { t:"Miryokefalon Savaşı", p:"sel", k:"savas", lat:38.10, lng:30.70, a:1, y:1176, d:"17 Eylül 1176", il:"Isparta / Denizli civarı (yeri tartışmalı)", c:"Türkiye Selçukluları – Bizans",
    s:"II. Kılıç Arslan'ın Bizans imparatoru I. Manuel Komnenos'u dar bir geçitte pusuya düşürüp yendiği savaş. Bizans'ın Anadolu'yu geri alma umudu sona erdi; Anadolu'nun Türk yurdu olduğu kesinleşti. Savaşın tam yeri hâlâ tartışmalıdır." },
  { t:"Ahlat Selçuklu Mezarlığı", p:"sel", k:"yapi", lat:38.765, lng:42.475, a:1, y:1200, d:"12. – 16. yy", il:"Bitlis, Ahlat", c:"Selçuklular, Ahlatşahlar, Akkoyunlular",
    s:"Anadolu'nun en büyük Türk-İslam mezarlıklarından biri. Boyları 3–4 metreyi bulan, ince işçilikli mezar taşları ve kümbetleriyle bölgenin Türk yurdu oluşunun simgesidir." },
  { t:"Gevher Nesibe Şifahanesi", p:"sel", k:"yapi", lat:38.726, lng:35.49, y:1206, d:"1206", il:"Kayseri, Melikgazi", c:"Türkiye Selçukluları",
    s:"I. Gıyaseddin Keyhüsrev'in, kız kardeşi Gevher Nesibe Sultan'ın vasiyeti üzerine yaptırdığı hastane ve tıp medresesi. Anadolu'nun bilinen ilk tıp okullarındandır; bugün tıp tarihi müzesidir." },
  { t:"Alanya – Kızıl Kule", p:"sel", k:"yapi", lat:36.5395, lng:31.9985, y:1226, d:"1226", il:"Antalya, Alanya", c:"Türkiye Selçukluları",
    s:"1221'de Alanya'yı (Alaiye) alan I. Alaeddin Keykubad'ın yaptırdığı sekizgen kule; limanı ve 1228'de yapılan tersaneyi koruyordu. Selçukluların Akdeniz'deki denizcilik faaliyetlerinin simgesidir." },
  { t:"Divriği Ulu Camii ve Darüşşifası", p:"sel", k:"yapi", lat:39.371, lng:38.12, y:1228, d:"1228 – 1229", il:"Sivas, Divriği", c:"Mengücekliler",
    s:"Mengücekli Ahmed Şah ve eşi Turan Melek Sultan'ın yaptırdığı cami ve şifahane. Taş kapılarındaki üç boyutlu, adeta dantel gibi oyulmuş bezemeler İslam mimarisinde eşsizdir. 1985'te Türkiye'den UNESCO Dünya Mirası Listesi'ne giren ilk eserler arasındadır." },
  { t:"Sultanhanı Kervansarayı", p:"sel", k:"yapi", lat:38.248, lng:33.546, y:1229, d:"1229", il:"Aksaray, Sultanhanı", c:"Türkiye Selçukluları",
    s:"I. Alaeddin Keykubad'ın Konya–Aksaray yolu üzerinde yaptırdığı, Anadolu'nun en büyük Selçuklu kervansaraylarından biri. Kervansaray ağı tüccarlara güvenli konaklama sağlayarak ticaret yollarını canlandırdı; devletin, yağmalanan tüccarın zararını karşıladığı da bilinir." },
  { t:"Kösedağ Savaşı", p:"sel", k:"savas", lat:40.07, lng:38.40, a:1, y:1243, d:"Haziran 1243", il:"Sivas, Suşehri – Zara arası", c:"Türkiye Selçukluları – Moğollar",
    s:"Moğol komutanı Baycu Noyan'ın II. Gıyaseddin Keyhüsrev komutasındaki Selçuklu ordusunu yendiği savaş. Türkiye Selçukluları İlhanlılara bağımlı hale geldi; devletin zayıflaması Anadolu'da beyliklerin doğmasına yol açtı." },
  { t:"Erzurum – Çifte Minareli Medrese", p:"sel", k:"yapi", lat:39.9035, lng:41.2795, y:1250, d:"Saltuklular 1071–1202; medrese 13. yy", il:"Erzurum", c:"Saltuklular / Türkiye Selçukluları",
    s:"Erzurum, Malazgirt'in ardından kurulan Saltuklu Beyliği'nin merkeziydi. Çifte Minareli Medrese Anadolu Selçuklu medreselerinin en görkemlilerindendir; yakınındaki Üç Kümbetler beyliğin hatırasını taşır." },
  { t:"Hacı Bektaş-ı Veli Dergâhı", p:"sel", k:"yapi", lat:38.94, lng:34.56, y:1270, d:"13. yy", il:"Nevşehir, Hacıbektaş", c:"Anadolu Türk tasavvufu",
    s:"Horasan'dan gelerek Anadolu'nun Türkleşmesi ve İslamlaşmasında etkili olan Hacı Bektaş-ı Veli'nin dergâhı ve türbesi. Bektaşi ve Alevi geleneğinin merkezidir." },
  { t:"Mevlana Türbesi", p:"sel", k:"yapi", lat:37.8708, lng:32.5047, y:1273, d:"Mevlana'nın vefatı: 17 Aralık 1273", il:"Konya, Karatay", c:"Türkiye Selçukluları dönemi",
    s:"Mesnevi'nin yazarı Mevlana Celaleddin Rumi'nin türbesi ve Mevlevi dergâhı; Yeşil Kubbe Konya'nın simgesidir. Her yıl 17 Aralık'ta 'Şeb-i Arus' törenleriyle anılır; Mevlevi sema töreni UNESCO Somut Olmayan Kültürel Miras listesindedir." },
  { t:"Karaman – Karamanoğulları", p:"sel", k:"olay", lat:37.181, lng:33.224, y:1277, d:"1256 – 1487; ferman 1277", il:"Karaman", c:"Karamanoğulları",
    s:"Osmanlı'nın en güçlü rakibi olan beylik. 1277'de Karamanoğlu Mehmed Bey'in yayımladığı ferman, Türkçeyi divanda, dergâhta ve mecliste resmi dil ilan etmesiyle bilinir; 13 Mayıs bugün Türk Dil Bayramı olarak kutlanır." },
  { t:"Kütahya – Germiyanoğulları", p:"sel", k:"yer", lat:39.42, lng:29.985, y:1300, d:"~1300 – 1429", il:"Kütahya", c:"Germiyanoğulları",
    s:"Germiyanoğulları Beyliği'nin merkezi. Beylik, Osmanlı ile evlilik ve toprak devri yoluyla bütünleşti; son bey II. Yakub vasiyetiyle topraklarını Osmanlı'ya bıraktı. Kütahya, sonraki yüzyıllarda İznik'in yanında ikinci büyük çini merkezi oldu." },
  { t:"Kastamonu – Candaroğulları", p:"sel", k:"yer", lat:41.377, lng:33.776, y:1300, d:"1292 – 1461", il:"Kastamonu", c:"Candaroğulları (İsfendiyaroğulları)",
    s:"Candaroğulları Beyliği'nin merkezi. Kasaba köyündeki Mahmut Bey Camii (1366), çivisiz ahşap işçiliğiyle ünlüdür. Beylik 1461'de Osmanlı'ya katıldı." },
  { t:"Beçin – Menteşeoğulları", p:"sel", k:"yer", lat:37.29, lng:27.79, y:1300, d:"14. yy", il:"Muğla, Milas", c:"Menteşeoğulları",
    s:"Menteşeoğulları Beyliği'nin başkenti. Kalesi, Orhan Bey Camii ve Ahmed Gazi Medresesi beylikler dönemi mimarisinin güzel örnekleridir." },
  { t:"Birgi – Aydınoğulları", p:"sel", k:"yer", lat:38.255, lng:28.068, y:1312, d:"1308 – 1426", il:"İzmir, Ödemiş", c:"Aydınoğulları",
    s:"Aydınoğulları Beyliği'nin ilk başkenti. 1312'de yapılan Ulu Camii'nin ahşap minberi ve çinileri beylikler dönemi sanatının şaheserlerindendir. Beylik, Umur Bey döneminde Ege'de güçlü bir donanmaya sahip oldu." },
  { t:"Mardin – Artuklu Başkenti", p:"sel", k:"yer", lat:37.313, lng:40.735, y:1385, d:"1104 – 1409 (Artuklu Mardin kolu)", il:"Mardin, Artuklu", c:"Artuklular; sonra Akkoyunlular",
    s:"Artukluların Mardin kolunun başkenti. Mezopotamya ovasına bakan yamaca kademeli kurulan taş evler, Zinciriye (1385) ve Kasımiye medreseleri kenti bir açık hava müzesine çevirir." },

  // ───────── OSMANLI ─────────
  { t:"Söğüt – Osmanlı'nın doğuşu", p:"osm", k:"olay", lat:40.0185, lng:30.18, y:1299, d:"~1299", il:"Bilecik, Söğüt", c:"Osmanlı Beyliği",
    s:"Ertuğrul Gazi'nin yurt edindiği ve Osman Bey'in beyliği kurduğu yer; Osmanlı Devleti'nin kuruluşu geleneksel olarak 1299'a tarihlenir. Ertuğrul Gazi Türbesi buradadır." },
  { t:"Koyunhisar (Bafeus) Savaşı", p:"osm", k:"savas", lat:40.70, lng:29.90, a:1, y:1302, d:"27 Temmuz 1302", il:"Kocaeli civarı", c:"Osmanlı – Bizans",
    s:"Osman Bey'in Bizans ordusunu yendiği ilk büyük savaş. Bu zafer, Osmanlı'nın bir uç beyliğinden devlete dönüşmesinin başlangıcı sayılır." },
  { t:"Bursa – İlk Başkent", p:"osm", k:"yer", lat:40.1838, lng:29.0617, y:1326, d:"1326", il:"Bursa, Osmangazi", c:"Osmanlı Beyliği",
    s:"1326'da Orhan Bey tarafından alınarak Osmanlı'nın ilk büyük başkenti oldu. Ulu Cami (1399), Yeşil Türbe, hanlar bölgesi ve Cumalıkızık köyü, 'Bursa ve Cumalıkızık: Osmanlı İmparatorluğu'nun Doğuşu' adıyla 2014'te UNESCO Dünya Mirası'na girdi." },
  { t:"Ankara Savaşı", p:"osm", k:"savas", lat:40.08, lng:32.95, a:1, y:1402, d:"28 Temmuz 1402", il:"Ankara, Çubuk Ovası", c:"Osmanlı – Timur İmparatorluğu",
    s:"Timur'un Yıldırım Bayezid'i yenip esir aldığı savaş. Anadolu birliği bozuldu, beylikler yeniden kuruldu ve Osmanlı 11 yıl sürecek Fetret Devri'ne girdi." },
  { t:"İstanbul'un Fethi", p:"osm", k:"savas", lat:41.0185, lng:28.9215, y:1453, d:"29 Mayıs 1453", il:"İstanbul, Topkapı surları", c:"Osmanlı – Bizans",
    s:"II. Mehmed'in 53 günlük kuşatma sonunda Konstantinopolis'i alması. Gemilerin karadan Haliç'e indirilmesi ve dev toplar kuşatmanın sembolleri oldu. Bizans İmparatorluğu sona erdi; bazı tarihçiler bu olayı Orta Çağ'ın sonu kabul eder." },
  { t:"Otlukbeli Savaşı", p:"osm", k:"savas", lat:39.95, lng:39.85, a:1, y:1473, d:"11 Ağustos 1473", il:"Erzincan", c:"Osmanlı – Akkoyunlu",
    s:"Fatih Sultan Mehmed'in Akkoyunlu hükümdarı Uzun Hasan'ı yendiği savaş. Osmanlı ateşli silahlarının üstünlüğünü gösterdi ve Anadolu'da Osmanlı birliğinin önündeki büyük engeli kaldırdı." },
  { t:"Topkapı Sarayı", p:"osm", k:"yapi", lat:41.0115, lng:28.9834, y:1478, d:"1460'lar – 1856", il:"İstanbul, Fatih", c:"Osmanlı İmparatorluğu",
    s:"Fatih Sultan Mehmed'in yaptırdığı, yaklaşık 400 yıl boyunca padişahların ikametgâhı ve devletin yönetim merkezi olan saray. Saray halkı 1856'da Dolmabahçe'ye taşındı; 1924'te müzeye dönüştürüldü." },
  { t:"Çaldıran Savaşı", p:"osm", k:"savas", lat:39.06, lng:44.38, a:1, y:1514, d:"23 Ağustos 1514", il:"Bugünkü İran sınırları içinde (Van'ın doğusu)", c:"Osmanlı – Safevi",
    s:"Yavuz Sultan Selim'in Safevi hükümdarı Şah İsmail'i yendiği savaş. Doğu Anadolu'da Osmanlı hâkimiyeti güçlendi; ardından Mercidabık (1516) ve Ridaniye (1517) zaferleriyle Mısır yolu açıldı. Van'daki Çaldıran ilçesi adını bu savaştan alır." },
  { t:"Süleymaniye Külliyesi", p:"osm", k:"yapi", lat:41.016, lng:28.964, y:1557, d:"1550 – 1557", il:"İstanbul, Fatih", c:"Osmanlı İmparatorluğu",
    s:"Kanuni Sultan Süleyman adına Mimar Sinan'ın inşa ettiği külliye: cami, medreseler, darüşşifa, imaret ve hamam. Sinan'ın 'kalfalık eserim' dediği yapıdır; mimarın kendi türbesi de külliyenin köşesindedir." },
  { t:"Edirne – Selimiye Camii", p:"osm", k:"yapi", lat:41.678, lng:26.559, y:1575, d:"Fethi ~1361; Selimiye 1568–1575", il:"Edirne", c:"Osmanlı İmparatorluğu",
    s:"Edirne, fethinden İstanbul'un fethine kadar Osmanlı başkentiydi. Mimar Sinan'ın 'ustalık eserim' dediği Selimiye Camii, dev kubbesi ve dört ince minaresiyle Osmanlı mimarisinin zirvesi sayılır; 2011'den beri UNESCO Dünya Mirası." },
  { t:"Tanzimat Fermanı", p:"osm", k:"olay", lat:41.0135, lng:28.9815, y:1839, d:"3 Kasım 1839", il:"İstanbul, Gülhane Parkı", c:"Osmanlı İmparatorluğu",
    s:"Mustafa Reşid Paşa'nın Gülhane Parkı'nda okuduğu ferman; can, mal ve namus güvencesi ile yasa önünde eşitliği ilan ederek Osmanlı modernleşmesinin hukuki başlangıcı oldu." },
  { t:"Sinop Baskını", p:"osm", k:"savas", lat:42.025, lng:35.15, y:1853, d:"30 Kasım 1853", il:"Sinop", c:"Osmanlı – Rusya",
    s:"Rus filosunun Sinop limanındaki Osmanlı donanmasını yok ettiği baskın. Olay, İngiltere ve Fransa'nın Kırım Savaşı'na Osmanlı yanında girmesini hızlandırdı." },
  { t:"I. Meşrutiyet – Kanun-i Esasi", p:"osm", k:"olay", lat:41.0125, lng:28.976, y:1876, d:"23 Aralık 1876", il:"İstanbul, Babıali", c:"Osmanlı İmparatorluğu",
    s:"Osmanlı'nın ilk anayasası Kanun-i Esasi ilan edildi ve ilk Osmanlı meclisi toplandı. II. Abdülhamid 1878'de meclisi tatil etti; anayasa 1908'de II. Meşrutiyet ile yeniden yürürlüğe girdi." },
  { t:"Sarıkamış Harekâtı", p:"osm", k:"savas", lat:40.33, lng:42.59, y:1914, d:"Aralık 1914 – Ocak 1915", il:"Kars, Sarıkamış", c:"Osmanlı – Rusya",
    s:"I. Dünya Savaşı'nda Enver Paşa'nın planladığı kış harekâtı. Allahuekber Dağları'nda ağır kış koşullarında on binlerce asker soğuk ve salgın hastalıklar yüzünden hayatını kaybetti; Osmanlı'nın en ağır kayıplarından biridir." },
  { t:"Çanakkale Savaşları", p:"osm", k:"savas", lat:40.15, lng:26.38, y:1915, d:"18 Mart 1915 (deniz) · Nisan 1915 – Ocak 1916 (kara)", il:"Çanakkale, Gelibolu Yarımadası", c:"Osmanlı – İtilaf Devletleri",
    s:"İtilaf donanmasının 18 Mart 1915'te boğazı geçme girişimi başarısız oldu; ardından Gelibolu Yarımadası'nda aylarca süren kara savaşları yaşandı. Anafartalar ve Conkbayırı'nda öne çıkan Yarbay Mustafa Kemal burada tanındı. İki taraftan toplam yarım milyonu aşkın kayıp verildi." },

  // ───────── KURTULUŞ SAVAŞI ─────────
  { t:"Samsun'a Çıkış", p:"kurt", k:"olay", lat:41.29, lng:36.34, y:1919.38, d:"19 Mayıs 1919", il:"Samsun", c:"Milli Mücadele",
    s:"Mustafa Kemal Paşa'nın 9. Ordu Müfettişi olarak Bandırma Vapuru ile Samsun'a çıkışı Milli Mücadele'nin başlangıcı kabul edilir. 19 Mayıs, Atatürk'ü Anma, Gençlik ve Spor Bayramı olarak kutlanır." },
  { t:"Amasya Genelgesi", p:"kurt", k:"olay", lat:40.651, lng:35.837, y:1919.47, d:"22 Haziran 1919", il:"Amasya", c:"Milli Mücadele",
    s:"'Milletin istiklalini yine milletin azim ve kararı kurtaracaktır' ilkesiyle, ulusal egemenliğe dayalı kurtuluş fikrini ilk kez açıkça ortaya koyan genelge; Sivas'ta bir kongre toplanması kararını da içerir." },
  { t:"Erzurum Kongresi", p:"kurt", k:"olay", lat:39.9075, lng:41.2715, y:1919.56, d:"23 Temmuz – 7 Ağustos 1919", il:"Erzurum", c:"Milli Mücadele",
    s:"Doğu illerinin temsilcileriyle toplanan kongre, vatanın bölünmez bir bütün olduğunu ve manda ile himayenin kabul edilemeyeceğini ilan etti; Mustafa Kemal Temsil Heyeti başkanlığına seçildi." },
  { t:"Sivas Kongresi", p:"kurt", k:"olay", lat:39.749, lng:37.016, y:1919.68, d:"4 – 11 Eylül 1919", il:"Sivas", c:"Milli Mücadele",
    s:"Tüm yurttan temsilcilerin katıldığı kongrede ulusal cemiyetler 'Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti' adıyla birleştirildi ve manda fikri kesin olarak reddedildi." },
  { t:"Maraş Savunması", p:"kurt", k:"savas", lat:37.585, lng:36.937, y:1920.05, d:"21 Ocak – 11 Şubat 1920", il:"Kahramanmaraş", c:"Kuva-yi Milliye – Fransa",
    s:"Sütçü İmam'ın başlattığı direnişle halk, Fransız işgal kuvvetlerine karşı 22 gün süren sokak savaşları verdi ve Fransızlar 11 Şubat 1920'de kenti terk etti. Kent 1973'te 'Kahraman' unvanını aldı." },
  { t:"TBMM'nin Açılışı", p:"kurt", k:"olay", lat:39.9418, lng:32.8538, y:1920.31, d:"23 Nisan 1920", il:"Ankara, Ulus", c:"Türkiye Büyük Millet Meclisi",
    s:"Ankara'da açılan Büyük Millet Meclisi, ulusal egemenliği esas alan yeni devletin temelini attı; Mustafa Kemal meclis başkanlığına seçildi. 23 Nisan, Ulusal Egemenlik ve Çocuk Bayramı olarak kutlanır." },
  { t:"Antep Savunması", p:"kurt", k:"savas", lat:37.066, lng:37.383, y:1920.3, d:"Nisan 1920 – Şubat 1921", il:"Gaziantep", c:"Kuva-yi Milliye – Fransa",
    s:"Şahin Bey ve Karayılan gibi önderlerin öncülüğünde halk, Fransız kuşatmasına yaklaşık on ay direndi. TBMM 1921'de kente 'Gazi' unvanını verdi." },
  { t:"I. ve II. İnönü Savaşları", p:"kurt", k:"savas", lat:39.818, lng:30.148, y:1921.02, d:"6–10 Ocak 1921 · 23 Mart–1 Nisan 1921", il:"Eskişehir, İnönü", c:"TBMM – Yunanistan",
    s:"Düzenli ordunun Yunan kuvvetlerine karşı kazandığı ilk zaferler. Birinci zaferin ardından Teşkilat-ı Esasiye (ilk anayasa) kabul edildi; 12 Mart 1921'de İstiklal Marşı kabul edildi. İkinci zaferden sonra Mustafa Kemal İsmet Paşa'ya düşmanla birlikte 'milletin makus talihini' de yendiklerini yazdı." },
  { t:"Sakarya Meydan Muharebesi", p:"kurt", k:"savas", lat:39.60, lng:32.00, a:1, y:1921.64, d:"23 Ağustos – 13 Eylül 1921", il:"Ankara, Polatlı", c:"TBMM – Yunanistan",
    s:"22 gün 22 gece süren savaşta 'Hattı müdafaa yoktur, sathı müdafaa vardır' anlayışıyla Yunan ilerleyişi durduruldu. TBMM, Mustafa Kemal'e Mareşal rütbesi ve Gazi unvanını verdi." },
  { t:"Kars Antlaşması", p:"kurt", k:"olay", lat:40.60, lng:43.095, y:1921.78, d:"13 Ekim 1921", il:"Kars", c:"TBMM – Sovyet Kafkas cumhuriyetleri",
    s:"TBMM ile Azerbaycan, Ermenistan ve Gürcistan Sovyet cumhuriyetleri arasında (Sovyet Rusya'nın katılımıyla) imzalanan antlaşma, bugünkü Türkiye'nin kuzeydoğu sınırını belirledi." },
  { t:"Büyük Taarruz – Kocatepe", p:"kurt", k:"savas", lat:38.685, lng:30.42, a:1, y:1922.65, d:"26 Ağustos 1922", il:"Afyonkarahisar", c:"TBMM – Yunanistan",
    s:"Başkomutan Mustafa Kemal'in Kocatepe'den yönettiği Büyük Taarruz şafakta topçu ateşiyle başladı ve Yunan cephesi kısa sürede yarıldı." },
  { t:"Başkomutan Meydan Muharebesi", p:"kurt", k:"savas", lat:38.86, lng:29.98, a:1, y:1922.66, d:"30 Ağustos 1922", il:"Kütahya, Dumlupınar", c:"TBMM – Yunanistan",
    s:"Yunan ana kuvvetleri kuşatılarak yok edildi; 30 Ağustos Zafer Bayramı olarak kutlanır. Mustafa Kemal'in 'Ordular! İlk hedefiniz Akdeniz'dir, ileri!' emri bu zaferin ardından verildi." },
  { t:"İzmir'in Kurtuluşu", p:"kurt", k:"olay", lat:38.4189, lng:27.1287, y:1922.69, d:"9 Eylül 1922", il:"İzmir, Konak", c:"TBMM ordusu",
    s:"Türk süvarileri İzmir'e girdi ve Batı Anadolu'nun işgali sona erdi. Birkaç gün sonra kentte büyük bir yangın çıktı." },
  { t:"Mudanya Ateşkesi", p:"kurt", k:"olay", lat:40.375, lng:28.885, y:1922.78, d:"11 Ekim 1922", il:"Bursa, Mudanya", c:"TBMM – İtilaf Devletleri",
    s:"Kurtuluş Savaşı'nın silahlı evresini sona erdiren ateşkes. Doğu Trakya savaşılmadan geri alındı; İstanbul ve Boğazların yönetimi TBMM'ye bırakıldı. Ardından Lozan Barış Antlaşması (24 Temmuz 1923) imzalandı." },

  // ───────── CUMHURİYET ─────────
  { t:"Cumhuriyetin İlanı", p:"cum", k:"olay", lat:39.9405, lng:32.8550, y:1923.83, d:"29 Ekim 1923", il:"Ankara, Ulus", c:"Türkiye Cumhuriyeti",
    s:"Ankara 13 Ekim 1923'te başkent oldu; 29 Ekim'de Cumhuriyet ilan edildi ve Mustafa Kemal ilk cumhurbaşkanı seçildi. Bunu hilafetin kaldırılması (1924), Medeni Kanun (1926) ve Harf Devrimi (1928) gibi köklü reformlar izledi." },
  { t:"Hatay'ın Anavatana Katılması", p:"cum", k:"olay", lat:36.2025, lng:36.1605, y:1939, d:"29 Haziran / 23 Temmuz 1939", il:"Hatay", c:"Türkiye Cumhuriyeti",
    s:"1938'de kurulan Hatay Devleti'nin meclisi 29 Haziran 1939'da Türkiye'ye katılma kararı aldı; son Fransız birlikleri 23 Temmuz'da çekildi. Atatürk'ün 'şahsi meselem' dediği Hatay sorunu böylece çözüldü; ancak Atatürk bunu göremeden 1938'de vefat etti." },
  { t:"Anıtkabir", p:"cum", k:"yapi", lat:39.925, lng:32.837, y:1953, d:"1944 – 1953; nakil 10 Kasım 1953", il:"Ankara, Çankaya", c:"Türkiye Cumhuriyeti",
    s:"Atatürk'ün anıt mezarı. Emin Onat ve Orhan Arda'nın tasarımında Anadolu'nun binlerce yıllık mirasına göndermeler vardır: Aslanlı Yol'daki aslan heykelleri Hitit sanatından esinlenmiştir." },
  { t:"Boğaziçi Köprüsü", p:"cum", k:"yapi", lat:41.0455, lng:29.034, y:1973, d:"30 Ekim 1973", il:"İstanbul", c:"Türkiye Cumhuriyeti",
    s:"Cumhuriyet'in 50. yılında açılan köprü, Asya ile Avrupa'yı ilk kez sabit bir yapıyla bağladı. 2016'dan beri '15 Temmuz Şehitler Köprüsü' adını taşır." },
  { t:"Atatürk Barajı", p:"cum", k:"yapi", lat:37.48, lng:38.32, y:1992, d:"1992 (açılış)", il:"Adıyaman – Şanlıurfa", c:"Türkiye Cumhuriyeti (GAP)",
    s:"Güneydoğu Anadolu Projesi'nin (GAP) kalbi olan Fırat üzerindeki dev baraj; Şanlıurfa tünelleriyle Harran Ovası'nı sulamaya açtı. Göl alanında Nevali Çori ve Kommagene başkenti Samsat gibi arkeolojik yerler sular altında kaldı." },
  { t:"1999 Marmara Depremi", p:"cum", k:"olay", lat:40.715, lng:29.82, y:1999, d:"17 Ağustos 1999", il:"Kocaeli, Gölcük", c:"Doğal afet",
    s:"Gölcük merkezli büyük deprem Kocaeli, Sakarya, Yalova ve çevresinde büyük yıkıma yol açtı; resmi rakamlara göre 17 binden fazla kişi hayatını kaybetti. Sonrasında yapı denetimi ve zorunlu deprem sigortası (DASK) gibi düzenlemeler getirildi." },
  { t:"6 Şubat 2023 Depremleri", p:"cum", k:"olay", lat:37.17, lng:37.04, y:2023, d:"6 Şubat 2023", il:"Kahramanmaraş, Pazarcık ve Elbistan", c:"Doğal afet",
    s:"Pazarcık (Mw 7,7) ve Elbistan (Mw 7,6) merkezli iki büyük deprem 11 ili etkiledi; 50 binden fazla kişi hayatını kaybetti. Antakya'daki tarihi yapıların büyük bölümü yıkıldı; Cumhuriyet tarihinin en büyük doğal afetidir." }
];

/*
  DÖNEM EKLERİ
  ------------
    o  : Dönem kartında gösterilen kısa özet
    cd : Koyu temada kullanılan (açık zemine göre daha parlak) dönem rengi
    cl : (isteğe bağlı) Açık temada DONEMLER.c yerine kullanılacak renk
*/
const DONEM_EK = {
  paleo: { cd: "#bb9c83", o: "Avcı-toplayıcı küçük gruplar mağaralarda ve açık hava konak yerlerinde yaşadı. Anadolu, erken insanların Afrika'dan Avrasya'ya yayıldığı doğal bir köprüydü." },
  neo:   { cd: "#7fc25c", o: "Yerleşik hayata, tarıma ve hayvancılığa geçiş çağı. Güneydoğu Anadolu'da anıtsal yapılar köylerden bile önce ortaya çıktı; Orta Anadolu'da Çatalhöyük gibi büyük yerleşmeler doğdu." },
  tunc:  { cd: "#dcc046", cl: "#b8890f", o: "Bakırın, ardından tuncun işlenmesiyle ticaret, zanaat ve toplumsal tabakalaşma hızlandı. İlk saraylar, surlu kentler ve zengin kral mezarları bu çağın ürünüdür." },
  hitit: { cd: "#f08b55", o: "Asurlu tüccarlar yazıyı Anadolu'ya getirdi; ardından Hititler Hattuşa merkezli, Mısır'la boy ölçüşen bir imparatorluk kurdu. İmparatorluk MÖ 1180 dolaylarında çöktü." },
  demir: { cd: "#b28be6", o: "Hitit'in çöküşünden sonra Anadolu bir krallıklar mozaiğine dönüştü: doğuda Urartu, ortada Frigya, batıda Lidya, güneydoğuda Geç Hitit kent devletleri, kıyılarda İyon, Karya ve Likya kentleri." },
  hel:   { cd: "#4dbadf", o: "MÖ 546'da Persler Anadolu'yu satraplıklara böldü; MÖ 334'te İskender Pers egemenliğine son verdi. Ardından Bergama, Pontus ve Kommagene gibi Helenistik krallıklar yükseldi." },
  roma:  { cd: "#e4729f", o: "Anadolu, Roma'nın en zengin eyaletlerinden oldu: yollar, su kemerleri, tiyatrolar ve mermer kentler. Hristiyanlığın ilk cemaatleri bu topraklarda kuruldu." },
  biz:   { cd: "#7f95f2", o: "Başkentin Konstantinopolis'e taşınmasıyla Anadolu, Doğu Roma'nın kalbi oldu. Konsiller, kaya kiliseleri, sınır kaleleri ve doğudaki Ermeni krallıkları bu dönemin izleridir." },
  sel:   { cd: "#36c3a9", o: "Malazgirt'ten sonra Anadolu hızla Türk yurdu oldu. Selçuklular ülkeyi kervansaraylar, medreseler ve şifahanelerle donattı; Moğol baskısıyla devlet zayıflayınca beylikler dönemi başladı." },
  osm:   { cd: "#c96a5c", o: "Söğüt'te küçük bir uç beyliği olarak doğan Osmanlı, üç kıtaya yayılan bir imparatorluğa dönüştü; 19. yüzyılda reformlarla ayakta kalmaya çalıştı ve I. Dünya Savaşı'yla dağıldı." },
  kurt:  { cd: "#ff5b52", o: "İşgale karşı Anadolu'da örgütlenen direniş, kongreler ve TBMM ile ulusal bir harekete dönüştü. Cephelerde kazanılan zaferler Lozan'a ve Cumhuriyet'e giden yolu açtı." },
  cum:   { cd: "#9cacc1", o: "1923'te ilan edilen Cumhuriyet, köklü reformlarla yeni bir devlet ve toplum düzeni kurdu. Büyük altyapı projeleri ve büyük depremler yakın tarihin dönüm noktaları oldu." }
};

/*
  HARİTA ETİKETLERİ
  -----------------
    DENIZLER : [ad, enlem, boylam, sınıf]  (sınıf: "big" | "" | "sm" | "lake")
    BOLGELER : [antik bölge adı, enlem, boylam]
    SEHIRLER : [bugünkü şehir, enlem, boylam]
*/
const DENIZLER = [["Karadeniz", 42.6, 34.5, "big"], ["Akdeniz", 35.6, 31.5, "big"], ["Ege Denizi", 38.6, 25.6, ""], ["Marmara Denizi", 40.7, 28.2, "sm"], ["Van Gölü", 38.65, 42.9, "lake"], ["Tuz Gölü", 38.75, 33.4, "lake"]];
const BOLGELER = [["Troas", 39.8, 26.6], ["Mysia", 39.6, 28.0], ["Bithynia", 40.6, 30.3], ["Paphlagonia", 41.3, 33.6], ["Pontus", 40.7, 37.5], ["Ionia", 38.2, 27.0], ["Lydia", 38.6, 28.4], ["Karia", 37.3, 28.2], ["Lykia", 36.6, 29.8], ["Pamphylia", 37.0, 31.2], ["Pisidia", 37.7, 30.9], ["Phrygia", 39.0, 30.8], ["Galatia", 39.8, 32.9], ["Lykaonia", 38.0, 33.0], ["Kappadokia", 38.6, 35.2], ["Kilikia", 37.0, 35.0], ["Kommagene", 37.8, 38.3], ["Urartu / Armenia", 39.0, 42.5], ["Mezopotamya", 37.2, 40.2], ["Thrakia", 41.4, 27.3]];
const SEHIRLER = [["İstanbul", 41.01, 28.98], ["Ankara", 39.93, 32.86], ["İzmir", 38.42, 27.14], ["Bursa", 40.19, 29.06], ["Antalya", 36.89, 30.71], ["Konya", 37.87, 32.48], ["Adana", 37.0, 35.32], ["Mersin", 36.81, 34.64], ["Gaziantep", 37.07, 37.38], ["Şanlıurfa", 37.16, 38.79], ["Diyarbakır", 37.91, 40.23], ["Van", 38.5, 43.38], ["Erzurum", 39.9, 41.27], ["Kars", 40.6, 43.1], ["Trabzon", 41.0, 39.72], ["Samsun", 41.29, 36.33], ["Sinop", 42.03, 35.15], ["Kayseri", 38.72, 35.48], ["Sivas", 39.75, 37.02], ["Eskişehir", 39.78, 30.52], ["Malatya", 38.35, 38.31], ["Çanakkale", 40.15, 26.41], ["Edirne", 41.68, 26.56], ["Antakya", 36.2, 36.16], ["Denizli", 37.78, 29.09], ["Muğla", 37.22, 28.36]];

/*
  GÜZERGÂHLAR
  -----------
    id, era (dönem anahtarı), n (ad), lbl (etiket konumu), end (isteğe bağlı uç etiketi),
    pts  : [[enlem, boylam], …]
    egri : (isteğe bağlı) pts'den önce gelen ve yumuşatılarak çizilen kontrol noktaları
*/
const ROTALAR = [
  { id: "asur", era: "hitit", n: "Asur ticaret yolu (MÖ 20.–18. yy)", lbl: [36.95, 40.1],
    pts: [[35.46, 43.26], [36.7, 41.0], [36.87, 39.03], [37.03, 37.98], [37.07, 37.38], [37.58, 36.93], [38.2, 37.2], [38.85, 35.635]] },
  { id: "iskender", era: "hel", n: "İskender'in Anadolu seferi (MÖ 334–333)", lbl: [38.75, 30.6],
    pts: [[40.19, 26.41], [39.957, 26.239], [40.25, 27.24], [38.488, 28.04], [37.94, 27.34], [37.53, 27.28], [37.04, 27.42], [36.36, 29.32], [36.52, 30.55], [36.96, 30.85], [36.98, 30.46], [37.68, 30.52], [38.07, 30.17], [39.65, 31.98], [39.94, 32.86], [37.28, 34.79], [36.92, 34.89], [36.85, 36.2]] },
  { id: "kralyolu", era: "hel", n: "Pers Kral Yolu (güzergâhı tartışmalı)", lbl: [38.55, 37.4], end: { t: "Susa'ya", ll: [36.4, 43.1] },
    pts: [[38.488, 28.04], [39.65, 31.98], [39.94, 32.86], [39.75, 34.61], [38.72, 35.49], [38.35, 38.31], [37.91, 40.24], [36.4, 43.1]] },
  { id: "kervan", era: "sel", n: "Selçuklu kervan yolu", lbl: [39.2, 38.3],
    pts: [[36.89, 30.7], [37.68, 31.72], [37.87, 32.49], [38.25, 33.55], [38.37, 34.03], [38.72, 35.49], [39.75, 37.02], [39.75, 39.49], [39.905, 41.27]] },
  { id: "mk1919", era: "kurt", n: "Mustafa Kemal'in yolu, 1919 (Samsun'dan Ankara'ya)", lbl: [42.15, 32.6],
    egri: [[41.01, 28.98], [41.6, 31.5], [42.2, 34.5], [41.29, 36.34]],
    pts: [[40.97, 35.66], [40.65, 35.83], [40.31, 36.55], [39.75, 37.02], [39.75, 39.49], [39.905, 41.27], [39.75, 39.49], [39.75, 37.02], [38.72, 35.49], [39.15, 34.16], [39.94, 32.85]] }
];
