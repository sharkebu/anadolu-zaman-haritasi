#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SINIR ÜRETİCİ — data/sinirlar.js üretir ("Hâkimiyet haritası")
=================================================================

İki kaynaktan anlık görüntüler (snapshot) üretir:

  A) historical-basemaps (André Ourednik, GPL-3.0)
     https://github.com/aourednik/historical-basemaps  ->  geojson/world_<yıl>.geojson
     Bu dosyaları tools/cache/hb/ içine indirin (depoya girmez, .gitignore'da).
     Kullanılan dosyalar aşağıdaki ANLIKLAR listesindedir.

  B) Elle çizilmiş "şematik" etki alanları (MÖ 1300, MÖ 550). Veri setinin
     veremediği dönemler için; bilerek yumuşak, cömert lekeler: sınır değil,
     nüfuz alanı. Çıktıda sematik:true olarak işaretlenir.

İşlem: pencereye kırp (boylam 18–52, enlem 29–48) -> adsız/kültür/göçebe
parçaları at -> Türkçe ad + kimlik ver -> aynı kimlikli parçaları birleştir ->
sadeleştir -> 2 ondalığa yuvarla -> komşular aynı rengi almasın diye renk ata.

Kullanım:   python tools/sinir_uret.py  [--kaynak tools/cache/hb]  [--onizleme klasör]
Gereken:    Python 3.9+, shapely 2.x   (pip install shapely)
            --onizleme için matplotlib (isteğe bağlı; her anlığın PNG'sini çizer)
Çıktı:      data/sinirlar.js   (window.SINIRLAR)

Biçim:  window.SINIRLAR = { kaynak, anliklar:[ {y, ad, sematik, not, p:[ {id, ad, not, c, g} ]} ] }
        g = çokgenler; her çokgen = halkalar; her halka = [enlem*100, boylam*100, ...] düz tamsayı dizisi
"""
import argparse, json, math, os, sys
from shapely.geometry import shape, box, Polygon, MultiPolygon, Point
from shapely.ops import unary_union
from shapely.validation import make_valid

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PENCERE = box(18, 29, 52, 48)
TOLERANS = 0.015      # derece; sadeleştirme
EN_KUCUK = 0.04       # derece²; bundan küçük parçalar atılır
RENK_SAYISI = 14

# ---------------------------------------------------------------------------
#  Kaynak adı -> (kimlik, Türkçe ad).  None = at.
#  Kimlik renk için kullanılır: aynı kimlik her anlıkta aynı rengi alır.
# ---------------------------------------------------------------------------
AT = None
ADLAR = {
    # MÖ 1. binyıl
    "Cimerians": ("kimmer", "Kimmerler"),
    "Hittites": ("gechitit", "Geç Hitit krallıkları"),
    "Arameans": ("arami", "Arami krallıkları"),
    "state societies and Aramaean kingdoms": ("arami", "Arami krallıkları"),
    "Urartu": ("urartu", "Urartu"),
    "Thrace": ("trak", "Trak kabileleri"),
    "Phrygians": ("frig", "Frigya"),
    "Assyria": ("asur", "Asur"),
    "Greek city-states": ("yunan", "Yunan kent devletleri"),
    "Illyrians": ("iliria", "İlirler"),
    "Babylonia": ("babil", "Babil"),
    "Elam": ("elam", "Elam"),
    "Egypt": ("misir", "Mısır"),
    "Kingdom of David and Solomon": AT,           # MÖ 700 için yanlış ve konumu kaymış
    "Achaemenid Empire": ("pers", "Pers (Ahameniş) İmparatorluğu"),
    "Carthaginian Empire": AT,
    "Empire of Alexander": ("iskender", "İskender İmparatorluğu"),
    "Cappadocia": ("kapadokya", "Kapadokya Krallığı"),
    "Atropatene": ("atropatene", "Atropatene"),
    "Armenia": ("ermeni", "Armenia Krallığı"),
    "Bosporan Kingdom": ("bosporos", "Bosporos Krallığı"),
    "Bosporian Kingdom": ("bosporos", "Bosporos Krallığı"),
    "Colchis": ("kolhis", "Kolhis"),
    "Seleucid Kingdom": ("selevkos", "Selevkos Krallığı"),
    "minor states": ("anadolukr", "Anadolu krallıkları"),
    "Scythians": ("iskit", "İskitler"),
    "Sarmates": ("sarmat", "Sarmatlar"),
    "Arabs": ("arap", "Arap kabileleri"),
    "Ptolemaic Kingdom": ("ptolemaios", "Ptolemaios Krallığı"),
    "Macedon and Hellenic League": ("makedon", "Makedonya"),
    "Nabatean Kingdom": ("nebati", "Nebati Krallığı"),
    "Dardania": ("dardanya", "Dardanya"),
    "Rome": ("roma", "Roma Cumhuriyeti"),
    "Roman Republic": ("roma", "Roma Cumhuriyeti"),
    "Pergamon": ("bergama", "Bergama Krallığı"),
    "Dacians": ("dakya", "Daklar"),
    "Roman Empire": ("roma", "Roma İmparatorluğu"),
    "Parthian Empire": ("part", "Part İmparatorluğu"),
    "Dacia": ("dakya", "Dakya"),
    "Odrysian Kingdom": ("trak", "Odrys Krallığı"),
    "Judea": ("yahudiye", "Yahudiye"),
    "Alans": ("alan", "Alanlar"),
    # Orta Çağ
    "Eastern Roman Empire": ("bizans", "Doğu Roma (Bizans)"),
    "Byzantine Empire": ("bizans", "Doğu Roma (Bizans)"),
    "Sasanian Empire": ("sasani", "Sasani İmparatorluğu"),
    "Ostrogoths": ("ostrogot", "Ostrogotlar"),
    "Abbasid Caliphate": ("abbasi", "Abbasi Halifeliği"),
    "Khazars": ("hazar", "Hazar Kağanlığı"),
    "Avars": ("avar", "Avar Kağanlığı"),
    "Magyars": ("macar", "Macarlar"),
    "Bulgars": ("bulgar", "Bulgar Hanlığı"),
    "Bulgar Khanate": ("bulgar", "Bulgar Çarlığı"),
    "Cyprus": ("kibris", "Kıbrıs"),
    "Buwayhid Emirates": ("buveyhi", "Büveyhîler"),
    "Fatimid Caliphate": ("fatimi", "Fâtımîler"),
    "Peshemegs": ("pecenek", "Peçenekler"),
    "Kingdom of Georgia": ("gurcu", "Gürcistan Krallığı"),
    "Georgia": ("gurcu", "Gürcistan Krallığı"),
    "Shirvan": ("sirvan", "Şirvanşahlar"),
    "Serbia": ("sirp", "Sırbistan"),
    "Kyivan Rus": ("rus", "Kiev Rus"),
    "Kievan Rus": ("rus", "Kiev Rus"),
    "Hungary": ("macar", "Macar Krallığı"),
    "Kingdom of Hungary": ("macar", "Macar Krallığı"),
    "Imperial Hungary": ("macar", "Macar Krallığı"),
    "Ilkhanate": ("ilhanli", "İlhanlılar"),
    "Khanate of the Golden Horde": ("altinorda", "Altın Orda"),
    "Golden Horde": ("altinorda", "Altın Orda"),
    "Blue Horde": ("altinorda", "Altın Orda"),
    "Mamluke Sultanate": ("memluk", "Memlûk Sultanlığı"),
    "Seljuk Caliphate": ("selcuk", "Türkiye Selçuklu Devleti"),
    "Trebizond": ("trabzon", "Trabzon İmparatorluğu"),
    "Timurid Empire": ("timur", "Timur İmparatorluğu"),
    "Ottoman Empire": ("osmanli", "Osmanlı Devleti"),
    "Bosnia": ("bosna", "Bosna Krallığı"),
    "Principality of Wallachia": ("eflak", "Eflak Prensliği"),
    "Beylik of Aydin": ("aydin", "Aydınoğulları Beyliği"),
    "Moldova": ("bogdan", "Boğdan Prensliği"),
    "Poland-Lithuania": ("lehlitvanya", "Lehistan-Litvanya"),
    "Emirate of the White Sheep Turks": ("akkoyunlu", "Akkoyunlular"),
    "Crimean Khanate": ("kirim", "Kırım Hanlığı"),
    # Yeni Çağ ve sonrası
    "Tsardom of Muscovy": ("rus", "Moskova Çarlığı"),
    "Safavid Empire": ("iran", "Safevî Devleti"),
    "Russian Empire": ("rus", "Rus İmparatorluğu"),
    "Persia": ("iran", "İran (Kaçar Devleti)"),
    "Austrian Empire": ("avusturya", "Avusturya İmparatorluğu"),
    "Austro-Hungarian Empire": ("avusturya", "Avusturya-Macaristan"),
    "Arabia (Nejd)": ("suud", "Necd Emirliği"),
    "Romania": ("romanya", "Romanya"),
    "Libya": ("libya", "Libya"),
    "Bulgaria": ("bulgar", "Bulgaristan"),
    "Greece": ("yunan", "Yunanistan"),
    "Azerbaijan": ("azerbaycan", "Azerbaycan"),
    "Albania": ("arnavut", "Arnavutluk"),
    "Montenegro": ("karadag", "Karadağ"),
    "United Kingdom of Great Britain and Ireland": ("kibris", "Kıbrıs (İngiliz)"),
    "United Kingdom": ("kibris", "Kıbrıs (İngiliz)"),
    "Kingdom of Italy": ("italya", "İtalya"),
    "Italy": ("italya", "İtalya"),
    "USSR": ("rus", "Sovyetler Birliği"),
    "Mesopotamia (GB)": ("irak", "Irak (İngiliz mandası)"),
    "Iran": ("iran", "İran"),
    "Syria (France)": ("suriye", "Suriye (Fransız mandası)"),
    "Ottoman Sultanate": ("osmanli", "Osmanlı Devleti"),
    "Libya (IT)": ("libya", "Libya (İtalyan)"),
    "Yugoslavia": ("sirp", "Yugoslavya"),
    "Ukraine": ("ukrayna", "Ukrayna"),
    "Mandatory Palestine (GB)": ("filistin", "Filistin (İngiliz mandası)"),
    "Israel": ("filistin", "Filistin (İngiliz mandası)"),   # 1938'de İsrail yoktu
    "Turkey": ("turkiye", "Türkiye Cumhuriyeti"),
    "Saudi Arabia": ("suud", "Suudi Arabistan"),
    "Hejaz": AT, "Czechoslovakia": AT, "South Russia": AT, "Kuwait": AT,
}
# Devlet olmayan ya da pencereye taşan küçük kayıtlar
ATILACAK_ONEK = ("Saharan", "Arabian pastoral", "Iranian pastoralists", "Urnfield", "Chernoles", "Karasuk",
                 "Proto-Scythian", "Berbers", "Slavonic", "Boihaenum", "Aghlabid", "Vandals", "Arran", "Syunik",
                 "Kakheti", "Tashir", "Artsakh", "Maskat", "Leks", "Durdzuks", "Khundzi", "Goghtn", "Emirate of Tiflis",
                 "Derbent", "Oghuz", "Sicily", "Ryazan", "White Horde", "Khiva", "Nogai", "Naples", "central Asian",
                 "Cyrenaica", "Tripolitania", "Kingdom of the Two Sicilies", "Arag", "?")

# ---------------------------------------------------------------------------
#  Kısa notlar (kimlik -> not; anlığa özel not için "yıl:kimlik")
# ---------------------------------------------------------------------------
NOTLAR = {
    "hitit": "Hattuşa merkezli imparatorluk; batıda Arzava, kuzeyde Kaşka, güneydoğuda Suriye kent devletleri üzerinde değişen ölçüde söz sahibiydi.",
    "kaska": "Karadeniz dağlarında yaşayan, Hititlerin hiçbir zaman tam boyun eğdiremediği kabile topluluğu.",
    "arzava": "Batı Anadolu'nun Luvice konuşan krallıkları (Mira, Şeha Nehri Ülkesi); çoğu kez Hitit vasalıydı.",
    "vilusa": "Troas'taki krallık; çoğu araştırmacı Troya ile eşleştirir. Hitit metinlerinde vasal olarak geçer.",
    "lukka": "Güneybatı kıyılarının denizci toplulukları; sonraki Likya'nın ataları sayılır.",
    "azzi": "Kuzeydoğu Anadolu dağlarındaki krallık; Hititlerle kâh savaştı kâh antlaşma yaptı.",
    "asur": "Dicle kıyısındaki Asur, bu dönemde Yukarı Mezopotamya'ya yayılıyordu.",
    "gechitit": "Hitit'in çöküşünden sonra Toroslar ile Fırat arasında yaşayan Luvi-Arami kent devletleri (Karkamış, Sam'al, Tabal…).",
    "frig": "Gordion merkezli krallık; Midas'ın ülkesi. MÖ 7. yy başında Kimmer akınlarıyla sarsıldı.",
    "urartu": "Van Gölü çevresinde kurulan, kaleleri ve sulama kanallarıyla tanınan dağ krallığı.",
    "kimmer": "Karadeniz'in kuzeyinden gelen atlı göçebeler; MÖ 7. yy'da Anadolu'ya akınlar yaptılar.",
    "arami": "Suriye ve Yukarı Mezopotamya'daki Arami beylikleri; çoğu bu tarihte Asur'a bağlanmıştı.",
    "lidya": "Sardes merkezli krallık; Kroisos döneminde Halys'e (Kızılırmak) kadar uzandı, MÖ 547/546'da Perslere yenildi.",
    "likya": "Ksanthos çevresindeki bağımsız kent birliği; Lidya'ya hiç bağlanmadı.",
    "kilikya": "Syennesis unvanlı krallarca yönetilen Çukurova ve Toros krallığı (Hilakku/Kue).",
    "med": "İran'dan Anadolu'ya uzanan krallık; Urartu topraklarını aldı, Halys'te Lidya ile sınırlandı (MÖ 585).",
    "yenibabil": "Nabukadnezar'ın imparatorluğu; Suriye ve Mezopotamya'yı denetliyordu.",
    "pers": "Anadolu'yu satraplıklara bölen dünya imparatorluğu; Sardes ile Susa'yı Kral Yolu bağlıyordu.",
    "yunan": "Yunanistan ve Ege'nin bağımsız kent devletleri.",
    "iskender": "İskender'in MÖ 323'teki ölümünde ulaştığı sınırlar; kısa süre sonra komutanları arasında bölündü.",
    "kapadokya": "İskender'in tam boyun eğdiremediği kuzey Anadolu; Pers soylu Ariarathes'in yönetimi.",
    "ermeni": "Doğu Anadolu ve Kafkasya'daki Ermeni krallığı.",
    "selevkos": "İskender'in komutanı Selevkos'un kurduğu krallık; başkenti Antakya.",
    "anadolukr": "Bitinya, Pontus, Kapadokya, Galatya gibi küçük Helenistik krallıklar; veri seti bunları tek alan olarak gösterir.",
    "bergama": "Attalos hanedanının krallığı; MÖ 133'te Roma'ya miras bırakıldı.",
    "roma": "Roma'nın doğrudan yönettiği eyaletler ve bağımlı krallıklar.",
    "part": "İran merkezli imparatorluk; Fırat boyunca Roma ile sınır komşusu.",
    "bizans": "Konstantinopolis merkezli Doğu Roma İmparatorluğu.",
    "sasani": "İran'ın Sasani hanedanı; Doğu Roma'nın yüzyıllık rakibi.",
    "abbasi": "Bağdat merkezli halifelik; Toroslar Bizans ile sınır bölgesiydi.",
    "buveyhi": "Bağdat'ı denetleyen İranlı hanedan; Yukarı Mezopotamya gerçekte Mervânîler gibi yerel emirliklerdeydi.",
    "fatimi": "Kahire merkezli Şii halifelik.",
    "gurcu": "Kafkasya'da Bagrationi hanedanının krallığı.",
    "selcuk": "Konya merkezli devlet; bu tarihte İlhanlılara bağlıydı ve dağılmak üzereydi. Batıda uç beylikleri güçleniyordu.",
    "1300:bizans": "Bizans 1300'de Batı Anadolu'nun yalnız birkaç kentini tutuyordu; veri seti bu bölgedeki yeni beylikleri ayrıca göstermez.",
    "ilhanli": "İran merkezli Moğol devleti; Anadolu Selçukluları bu tarihte İlhanlılara bağlıydı.",
    "memluk": "Kahire merkezli sultanlık; Suriye ve Kilikya'nın bir kısmını denetliyordu.",
    "trabzon": "1204'te kurulan, Karadeniz kıyısındaki Rum imparatorluğu (1461'e dek).",
    "beylik": "Karamanoğulları, Dulkadiroğulları ve Kadı Burhaneddin'in toprakları gibi Anadolu beylikleri; veri seti bunları tek alan gösterir.",
    "timur": "Timur'un Orta Asya'dan Anadolu'ya uzanan imparatorluğu; 1402'de Ankara'da Osmanlıyı yendi.",
    "aydin": "Birgi ve Ayasuluk (Selçuk) merkezli Batı Anadolu beyliği.",
    "osmanli": "Söğüt'te doğan, üç kıtaya yayılan devlet.",
    "akkoyunlu": "Diyarbakır ve Tebriz merkezli Türkmen konfederasyonu; 1473'te Otlukbeli'nde Osmanlıya yenildi.",
    "iran": "İran'da hüküm süren devlet.",
    "rus": "Kuzeyde Karadeniz'e ve Kafkasya'ya inen Rus devleti.",
    "turkiye": "1923'te ilan edilen Türkiye Cumhuriyeti; Hatay 1939'da katıldı.",
    "suriye": "I. Dünya Savaşı'ndan sonra Fransız mandasındaki Suriye; Hatay 1938'de ayrı bir devletti.",
    "1920:osmanli": "Sevr'in İstanbul hükûmetine bıraktığı alan. Gerçekte Anadolu'nun büyük kısmı Ankara'daki TBMM hükûmetinin denetimindeydi.",
    "1920:suriye": "Sevr'de Fransız mandası ve nüfuz bölgesi; Fransızlar 1920'de Kilikya'yı işgal altında tutuyordu.",
    "sevritalya": "Sevr'in İtalya'ya ayırdığı nüfuz bölgesi; İtalyanlar yalnız Antalya çevresini işgal etti, 1921'de çekildi.",
    "sevryunan": "Sevr'in Yunanistan'a bıraktığı İzmir bölgesi ve Doğu Trakya; Yunan ordusu 1922'de yenildi.",
    "sevrermeni": "Sevr'in Ermenistan'a öngördüğü sınır; hiç uygulanmadı, 1921 Kars Antlaşması doğu sınırını belirledi.",
    "irak": "İngiliz mandasındaki Irak.",
}

# Anlık başına not (scrubber altında ve kartta görünür)
ANLIK_NOTU = {
    -700: "Veri seti bu dönemde kaba: Lidya ve Karia ayrıca gösterilmez; \"Geç Hitit\" alanı Tabal gibi Orta Anadolu krallıklarını da kapsar.",
    -200: "Orta ve kuzey Anadolu'daki küçük krallıklar tek alan olarak gösterilir.",
    1000: "Yukarı Mezopotamya'daki yerel emirlikler ayrıca gösterilmez.",
    1300: "Batı Anadolu'daki yeni Türkmen beylikleri (Osmanlı, Germiyan, Menteşe…) veri setinde ayrıca yoktur.",
    1400: "Ankara Savaşı'ndan (1402) hemen önce.",
    1920: "Fiilî durumu değil, Sevr Antlaşması'nın (10 Ağustos 1920) öngördüğü bölüşümü gösterir. Antlaşma hiç uygulanmadı.",
    1938: "Hatay bu tarihte ayrı bir devletti; 1939'da Türkiye'ye katıldı.",
}

# Anlığa özel ad düzeltmeleri: (yıl, kaynak adı) -> (kimlik, ad) ; parça bazlı bölme için işlev
def ozel(yil, ad, parca):
    c = parca.representative_point()
    if yil == 1400 and ad == "Seljuk Caliphate":
        return ("beylik", "Anadolu beylikleri")
    if yil == 1300 and ad.startswith("Ra"):
        return ("sirp", "Sırp Krallığı")
    if yil == 1400 and ad == "Bulgar Khanate":
        return ("bulgar", "Vidin Çarlığı")
    if yil == 1914 and ad == "Egypt":
        return ("misir", "Mısır (İngiliz denetiminde)")
    if yil == 1920:
        if ad == "Italy" and c.x > 26:
            return ("sevritalya", "İtalyan nüfuz bölgesi (Sevr)")
        if ad == "Greece" and c.x > 26:
            return ("sevryunan", "Yunan bölgesi (Sevr)")
        if ad == "Armenia":
            return ("sevrermeni", "Ermenistan (Sevr sınırı)")
        if ad == "Syria (France)":
            return ("suriye", "Fransız mandası ve bölgesi (Sevr)")
        if ad == "Ottoman Sultanate":
            return ("osmanli", "Osmanlı Devleti (Sevr'e göre)")
    if yil in (1920, 1938) and ad == "Armenia" and yil == 1938:
        return ("ermeni", "Ermenistan (SSC)")
    if yil >= 1914 and ad == "Armenia":
        return ("ermeni", "Ermenistan")
    if yil >= 1914 and ad == "Georgia":
        return ("gurcu", "Gürcistan")
    if yil >= 1914 and ad == "Hungary":
        return ("macar", "Macaristan")
    if yil == 1000 and ad == "Armenia":
        return ("ermeni", "Ermeni krallıkları (Bagratlı)")
    if yil >= 1300 and ad == "Cyprus":
        return ("kibris", "Kıbrıs Krallığı")
    if yil == 1938 and ad == "Turkey":
        return ("turkiye", "Türkiye Cumhuriyeti")
    return "varsayilan"

# ---------------------------------------------------------------------------
#  Kullanılan anlıklar (yıl, dosya eki, etiket)
#  Bırakılanlar: MÖ 100 (Selevkos krallığını Mezopotamya'ya dek gösteriyor; o tarihte
#  Mezopotamya Partlardaydı), 1100 (bütün Anadolu'yu Bizans gösteriyor; Selçuklu ve
#  Danişmendliler yok). Ayrıntı README'de.
# ---------------------------------------------------------------------------
ANLIKLAR = [
    (-1300, None, "MÖ 1300"),
    (-700, "bc700", "MÖ 700"),
    (-550, None, "MÖ 550"),
    (-500, "bc500", "MÖ 500"),
    (-323, "bc323", "MÖ 323"),
    (-200, "bc200", "MÖ 200"),
    (-1, "bc1", "MÖ 1"),
    (100, "100", "MS 100"),
    (500, "500", "500"),
    (800, "800", "800"),
    (1000, "1000", "1000"),
    (1300, "1300", "1300"),
    (1400, "1400", "1400"),
    (1500, "1500", "1500"),
    (1600, "1600", "1600"),
    (1800, "1800", "1800"),
    (1914, "1914", "1914"),
    (1920, "1920", "1920"),
    (1938, "1938", "1938"),
]

# ---------------------------------------------------------------------------
#  Şematik çizimler (boylam, enlem). Önce yazılan öncelikli: çakışmada sonrakinden çıkarılır.
# ---------------------------------------------------------------------------
SEMATIK = {
    -1300: [
        ("hitit", "Hitit İmparatorluğu", [
            (30.5, 39.4), (31.3, 40.1), (32.6, 40.45), (34.0, 40.6), (35.6, 40.55), (37.0, 40.35), (38.0, 39.9),
            (38.6, 39.0), (38.75, 38.2), (38.6, 37.3), (38.4, 36.6), (37.9, 35.9), (37.0, 35.45), (36.3, 35.6),
            (35.9, 36.3), (35.3, 36.55), (34.3, 36.2), (33.2, 35.95), (32.4, 36.2), (31.9, 36.9), (31.0, 37.5), (30.55, 38.4)]),
        ("kaska", "Kaşkalar", [
            (32.8, 40.75), (34.2, 40.75), (35.7, 40.75), (37.2, 40.55), (38.3, 40.6), (38.3, 41.3), (37.0, 41.7),
            (35.5, 42.0), (34.0, 42.0), (32.8, 41.8)]),
        ("arzava", "Arzava ülkeleri (Mira, Şeha)", [
            (26.6, 37.1), (27.6, 36.95), (28.7, 37.05), (29.6, 37.15), (30.3, 37.7), (30.35, 38.6), (29.9, 39.3),
            (28.8, 39.55), (27.6, 39.45), (26.6, 39.2), (26.2, 38.3)]),
        ("vilusa", "Vilusa", [
            (25.9, 39.35), (26.9, 39.3), (27.6, 39.6), (27.6, 40.2), (27.0, 40.45), (26.3, 40.25), (25.9, 39.8)]),
        ("lukka", "Lukka ülkeleri", [
            (28.0, 36.15), (29.3, 36.05), (30.55, 36.2), (30.6, 36.95), (29.6, 37.05), (28.6, 37.0), (27.9, 36.7)]),
        ("azzi", "Azzi-Hayaşa", [
            (38.9, 39.5), (40.2, 39.3), (41.6, 39.5), (41.7, 40.3), (40.8, 40.8), (39.6, 40.8), (38.8, 40.2)]),
        ("asur", "Asur", [
            (38.9, 35.0), (40.5, 34.8), (42.5, 34.8), (44.2, 35.2), (44.3, 36.6), (43.2, 37.6), (41.5, 37.6),
            (39.8, 37.4), (38.9, 36.6)]),
    ],
    -550: [
        ("likya", "Likya", [
            (28.75, 36.2), (29.6, 36.0), (30.6, 36.2), (30.75, 36.9), (29.9, 37.1), (29.0, 37.0), (28.65, 36.6)]),
        ("kilikya", "Kilikya Krallığı", [
            (32.6, 36.05), (33.4, 36.0), (34.6, 36.4), (35.6, 36.4), (36.2, 36.55), (36.5, 37.2), (36.3, 37.85),
            (35.3, 38.0), (34.3, 37.75), (33.3, 37.4), (32.5, 36.9)]),
        ("lidya", "Lidya Krallığı", [
            (25.5, 35.6), (32.4, 35.6), (32.6, 36.3), (33.0, 37.3), (33.4, 38.2), (34.0, 38.7), (33.6, 39.2),
            (33.5, 39.8), (34.0, 40.4), (34.9, 41.0), (35.6, 41.6), (36.0, 42.4), (25.5, 42.4)]),
        ("med", "Med Krallığı", [
            (36.0, 42.4), (35.6, 41.6), (34.9, 41.0), (34.0, 40.4), (33.5, 39.8), (33.6, 39.2), (34.0, 38.7),
            (34.5, 38.15), (35.3, 38.0), (36.3, 37.85), (37.5, 37.7), (38.6, 37.35), (40.0, 37.1), (42.0, 37.05),
            (44.0, 36.8), (45.5, 35.6), (47.5, 34.6), (52.5, 34.4), (52.5, 42.4), (46.0, 42.6), (41.5, 41.9), (38.0, 41.6)]),
        ("yenibabil", "Yeni Babil", [
            (36.3, 36.6), (37.5, 36.95), (38.6, 37.1), (40.0, 36.95), (42.0, 36.9), (44.0, 36.6), (45.5, 35.4),
            (47.5, 33.6), (48.6, 30.0), (46.0, 28.5), (35.2, 28.5), (34.4, 31.3), (35.0, 33.4), (35.75, 35.4), (36.0, 36.1)]),
    ],
}
# Avrupa yakası (şematik lekeler Trakya'ya taşmasın diye çıkarılır)
AVRUPA = Polygon([(25.7, 35.0), (25.9, 40.0), (26.22, 40.03), (26.40, 40.13), (26.55, 40.25), (26.68, 40.37), (27.0, 40.5),
                  (28.0, 40.75), (28.9, 40.95), (29.02, 41.03), (29.07, 41.12), (29.12, 41.23), (29.6, 41.7), (30.5, 48.5),
                  (17.5, 48.5), (17.5, 35.0)])


def chaikin(pts, n=4):
    for _ in range(n):
        out = []
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            out.append((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]))
            out.append((0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))
        pts = out
    return pts


def poligonlar(g):
    if g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    if isinstance(g, MultiPolygon):
        return list(g.geoms)
    return [p for x in getattr(g, "geoms", []) for p in poligonlar(x)]


def temizle(g, tol=TOLERANS):
    g = make_valid(g)
    g = g.simplify(tol, preserve_topology=True)
    g = make_valid(g)
    parts = [p for p in poligonlar(g) if p.area >= EN_KUCUK]
    return MultiPolygon(parts) if parts else None


def kodla(g):
    out = []
    for p in poligonlar(g):
        rings = []
        for r in [p.exterior] + list(p.interiors):
            cs = list(r.coords)[:-1]
            flat, prev = [], None
            for x, y in cs:
                k = (round(y * 100), round(x * 100))
                if k == prev:
                    continue
                flat += [k[0], k[1]]
                prev = k
            if len(flat) >= 6:
                rings.append(flat)
        if rings and len(rings[0]) >= 6:
            out.append(rings)
    return out


def kara_maskesi(kaynak):
    j = json.load(open(os.path.join(kaynak, "world_1938.geojson"), encoding="utf-8"))
    u = unary_union([make_valid(shape(f["geometry"])) for f in j["features"] if f.get("geometry")])
    return u.intersection(PENCERE)


def veri_anligi(kaynak, yil, ek):
    j = json.load(open(os.path.join(kaynak, f"world_{ek}.geojson"), encoding="utf-8"))
    topla = {}   # id -> [ad, [geom]]
    for f in j["features"]:
        g = f.get("geometry")
        ad = (f.get("properties") or {}).get("NAME")
        if not g or not ad or ad == "None" or ad.startswith(ATILACAK_ONEK):
            continue
        s = make_valid(shape(g))
        if not s.intersects(PENCERE):
            continue
        s = s.intersection(PENCERE)
        for parca in poligonlar(s):
            if parca.area < 0.01:
                continue
            o = ozel(yil, ad, parca)
            if o == "varsayilan":
                if ad not in ADLAR:
                    print(f"  ! {yil}: tanımsız ad '{ad}' atlandı", file=sys.stderr)
                    continue
                o = ADLAR[ad]
            if o is None:
                continue
            kid, tr = o
            topla.setdefault(kid, [tr, []])[1].append(parca)
    return topla


def sematik_anligi(yil, kara):
    asya = kara.difference(AVRUPA)
    topla, dolu = {}, None
    for kid, tr, pts in SEMATIK[yil]:
        g = Polygon(chaikin(pts)).buffer(0.12, resolution=6)   # cömert: nüfuz alanı, sınır değil
        g = g.intersection(asya)
        if dolu is not None:
            g = g.difference(dolu)
        dolu = g if dolu is None else unary_union([dolu, g])
        topla[kid] = [tr, poligonlar(g)]
    return topla


def renk_ata(anliklar):
    """Her kimliğe sabit bir renk; herhangi bir anlıkta komşu olanlar farklı renk alır."""
    komsu, alan = {}, {}
    for a in anliklar:
        ids = list(a["_geo"].keys())
        for i in ids:
            komsu.setdefault(i, set())
            alan[i] = alan.get(i, 0) + a["_geo"][i].area
        for x in range(len(ids)):
            for y in range(x + 1, len(ids)):
                gx, gy = a["_geo"][ids[x]], a["_geo"][ids[y]]
                if gx.distance(gy) < 0.15:
                    komsu[ids[x]].add(ids[y])
                    komsu[ids[y]].add(ids[x])
    renk = {}
    # Büyük ve çok komşulu kimlikler önce; sabit bir başlangıç rengi için kimlik özetinden başla
    for i in sorted(komsu, key=lambda k: (-len(komsu[k]), -alan[k], k)):
        yasak = {renk[n] for n in komsu[i] if n in renk}
        h = sum(ord(ch) * (n + 1) for n, ch in enumerate(i)) % RENK_SAYISI
        for d in range(RENK_SAYISI):
            c = (h + d) % RENK_SAYISI
            if c not in yasak:
                renk[i] = c
                break
        else:
            renk[i] = h
            print(f"  ! {i}: komşularından farklı renk bulunamadı", file=sys.stderr)
    return renk


def onizleme(anliklar, klasor):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    os.makedirs(klasor, exist_ok=True)
    pal = plt.cm.tab20.colors
    for a in anliklar:
        fig, ax = plt.subplots(figsize=(12, 7))
        for p in a["p"]:
            for poly in p["g"]:
                r = poly[0]
                ax.fill(r[1::2], r[0::2], color=pal[p["c"] % 20], alpha=.55, ec="k", lw=.4)
            g = a["_geo"][p["id"]]
            pt = max(poligonlar(g), key=lambda q: q.area).representative_point()
            ax.text(pt.x * 100, pt.y * 100, p["ad"], fontsize=7, ha="center")
        ax.set_xlim(1800, 5200); ax.set_ylim(2900, 4800); ax.set_aspect(1.25)
        ax.set_title(a["ad"] + (" (şematik)" if a.get("sematik") else ""))
        fig.savefig(os.path.join(klasor, f"{a['y']}.png"), dpi=70, bbox_inches="tight")
        plt.close(fig)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8"); sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--kaynak", default=os.path.join(KOK, "tools", "cache", "hb"))
    ap.add_argument("--cikti", default=os.path.join(KOK, "data", "sinirlar.js"))
    ap.add_argument("--onizleme", default=None)
    a = ap.parse_args()
    if not os.path.isdir(a.kaynak):
        sys.exit(f"Kaynak klasörü yok: {a.kaynak}\nhistorical-basemaps geojson dosyalarını buraya indirin (README).")
    kara = kara_maskesi(a.kaynak)
    anliklar = []
    for yil, ek, etiket in ANLIKLAR:
        print(f"{etiket} …")
        topla = sematik_anligi(yil, kara) if ek is None else veri_anligi(a.kaynak, yil, ek)
        geo, p = {}, []
        for kid, (tr, parcalar) in topla.items():
            g = temizle(unary_union(parcalar), 0.006 if ek is None else TOLERANS)
            if g is None:
                continue
            geo[kid] = g
            not_ = NOTLAR.get(f"{yil}:{kid}") or NOTLAR.get(kid) or ""
            p.append({"id": kid, "ad": tr, "not": not_, "g": kodla(g)})
        p.sort(key=lambda x: -geo[x["id"]].area)
        an = {"y": yil, "ad": etiket, "p": p, "_geo": geo}
        if ek is None:
            an["sematik"] = True
        if yil in ANLIK_NOTU:
            an["not"] = ANLIK_NOTU[yil]
        anliklar.append(an)
        print("   " + " · ".join(f"{x['ad']}" for x in p))
    renk = renk_ata(anliklar)
    for an in anliklar:
        for p in an["p"]:
            p["c"] = renk[p["id"]]
    if a.onizleme:
        onizleme(anliklar, a.onizleme)
    cikti = {
        "kaynak": "historical-basemaps — André Ourednik (GPL-3.0); MÖ 1300 ve MÖ 550 elle çizilmiş şematik alanlar",
        "renkSayisi": RENK_SAYISI,
        "anliklar": [{k: v for k, v in an.items() if not k.startswith("_")} for an in anliklar],
    }
    js = ("/*\n  HÂKİMİYET HARİTASI — tools/sinir_uret.py tarafından üretildi; elle düzenlemeyin.\n"
          "  Kaynak: historical-basemaps (André Ourednik), GPL-3.0 — https://github.com/aourednik/historical-basemaps\n"
          "  MÖ 1300 ve MÖ 550: elle çizilmiş şematik etki alanları (sematik:true).\n"
          "  Sınırlar yaklaşıktır. g: [çokgen][halka] = [enlem*100, boylam*100, …]\n*/\n"
          "window.SINIRLAR = " + json.dumps(cikti, ensure_ascii=False, separators=(",", ":")) + ";\n")
    js = js.replace('{"y":', '\n{"y":').replace(',{"id":', ',\n {"id":')
    with open(a.cikti, "w", encoding="utf-8", newline="\n") as f:
        f.write(js)
    print(f"\n{a.cikti}: {len(js.encode('utf-8')) / 1024:.0f} KB, {len(anliklar)} anlık")


if __name__ == "__main__":
    main()
