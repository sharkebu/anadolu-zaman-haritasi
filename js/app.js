(() => {
  "use strict";

  // =====================================================================
  //  Yardımcılar
  // =====================================================================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => Number(n).toLocaleString("tr-TR");
  const norm = s => (s || "").toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "");
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  const store = {
    get(k, d) { try { const v = localStorage.getItem("azh." + k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem("azh." + k, JSON.stringify(v)); } catch (_) { /* depolama kapalı olabilir */ } }
  };

  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  const MOBILE = matchMedia("(max-width: 819px)");
  const DARK_MQ = matchMedia("(prefers-color-scheme: dark)");
  const onMQ = (mq, fn) => { if (mq.addEventListener) mq.addEventListener("change", fn); else if (mq.addListener) mq.addListener(fn); };

  // ---------- Simgeler (1.5px çizgi) ----------
  const ICONS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    play: '<path d="M8.5 5.8v12.4L18.5 12z"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    prev: '<path d="M14.5 6l-6 6 6 6"/>',
    next: '<path d="M9.5 6l6 6-6 6"/>',
    skipPrev: '<path d="M7 6v12M18 6.5l-8 5.5 8 5.5z"/>',
    skipNext: '<path d="M17 6v12M6 6.5l8 5.5-8 5.5z"/>',
    tour: '<circle cx="12" cy="12" r="8.5"/><path d="M10.3 8.8v6.4l5-3.2z"/>',
    quiz: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
    layers: '<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.3L12 20.8l8.5-4.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>',
    auto: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    columns: '<path d="M4 9.3L12 4l8 5.3M5 20h14M6.5 10.5v7M10 10.5v7M14 10.5v7M17.5 10.5v7"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    zoom: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/>',
    ext: '<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
    list: '<path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h1M4.5 12h1M4.5 17.5h1"/>',
    chevUp: '<path d="M6 15l6-6 6 6"/>',
    chevDown: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.7 13.4L7.5 20.5l4.5-2.3 4.5 2.3-1.2-7.1"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
    gauge: '<path d="M4.5 16.5a8 8 0 1 1 15 0"/><path d="M12 13.5l3.8-3.8"/>',
    arrowR: '<path d="M4 12h15M14 7l5 5-5 5"/>',
    hourglass: '<path d="M7 3.5h10M7 20.5h10M8 3.5c0 4.5 8 4.5 8 8.5s-8 4-8 8.5M16 3.5c0 4.5-8 4.5-8 8.5s8 4 8 8.5"/>',
    stack: '<path d="M7 7.5h10M7 12h10M7 16.5h6"/><rect x="3.5" y="3.5" width="17" height="17" rx="3"/>',
    redo: '<path d="M19 8.5A8 8 0 1 0 20 13"/><path d="M19.5 4v4.5H15"/>',
    map: '<path d="M3.5 6.8l5.5-2.3 6 2.3 5.5-2.3v12.7L15 19.5l-6-2.3-5.5 2.3z"/><path d="M9 4.5v12.7M15 6.8v12.7"/>',
    book: '<path d="M4.5 5.5c2.5-1 5-1 7.5.8 2.5-1.8 5-1.8 7.5-.8v13c-2.5-1-5-1-7.5.8-2.5-1.8-5-1.8-7.5-.8z"/><path d="M12 6.3v13"/>'
  };
  const ic = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;

  // Tür şekilleri (dolu, dönem rengiyle)
  const KSHAPE = {
    yer: '<circle cx="8" cy="8" r="5.6"/>',
    yapi: '<rect x="2.6" y="2.6" width="10.8" height="10.8" rx="2.6"/>',
    savas: '<path d="M8 1.4L14.6 8 8 14.6 1.4 8z"/>',
    olay: '<circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" stroke-width="2.6"/>'
  };
  const kindSvg = k => `<svg class="ks" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">${KSHAPE[k] || KSHAPE.yer}</svg>`;

  // =====================================================================
  //  Veri hazırlığı
  // =====================================================================
  const PKEYS = Object.keys(DONEMLER);
  const KINDS = Object.keys(TURLER);
  const EK = typeof DONEM_EK === "object" ? DONEM_EK : {};
  const DATA = OLAYLAR.map((e, i) => ({ ...e, id: i }));
  const SORTED = [...DATA].sort((a, b) => a.y - b.y || a.id - b.id);
  const BY_ERA = {};
  PKEYS.forEach(p => { BY_ERA[p] = SORTED.filter(e => e.p === p); });
  DATA.forEach(e => { e._q = norm([e.t, e.il, e.c, e.s, e.d, DONEMLER[e.p] ? DONEMLER[e.p].n : "", TURLER[e.k]].join(" ")); });
  const NOW = new Date().getFullYear();

  // ---------- Görseller (data/gorseller.js; Wikimedia Commons'a doğrudan bağlantı) ----------
  const GOR = (typeof window.GORSELLER === "object" && window.GORSELLER) || {};
  const gorsel = e => { const g = GOR[e.t]; return g && g.src ? g : null; };
  const wikiUrl = e => (GOR[e.t] && GOR[e.t].wiki) || null;
  // Commons küçük resmini başka bir standart genişlikte iste (120, 1280…); olmuyorsa aynı adres
  const thumbW = (g, w) => (/\/thumb\/.+\/\d+px-[^/]+$/.test(g.src) && (g.w > w || w > 960)) ? g.src.replace(/\/\d+px-([^/]+)$/, `/${w}px-$1`) : g.src;
  const credHtml = g => `Görsel: <a href="${esc(g.page)}" target="_blank" rel="noopener">${esc(g.credit)} · ${esc(g.license)} · Wikimedia Commons</a>`;
  const thHtml = x => { const g = gorsel(x); return `<span class="th ec-${x.p}" aria-hidden="true">${g ? `<img src="${esc(thumbW(g, 120))}" alt="" loading="lazy" decoding="async">` : kindSvg(x.k)}</span>`; };

  // Dönem renklerini (açık/koyu çift) CSS değişkeni olarak tanımla
  (() => {
    const vars = dark => PKEYS.map(p => {
      const ek = EK[p] || {};
      return `--e-${p}:${dark ? (ek.cd || DONEMLER[p].c) : (ek.cl || DONEMLER[p].c)};`;
    }).join("");
    const cls = PKEYS.map(p => `.ec-${p}{--c:var(--e-${p})}`).join("\n");
    const st = document.createElement("style");
    st.textContent = `:root{${vars(false)}}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(true)}}}
:root[data-theme="dark"]{${vars(true)}}
${cls}`;
    document.head.appendChild(st);
  })();

  // =====================================================================
  //  Durum ve tercihler
  // =====================================================================
  const state = { periods: new Set(PKEYS), kinds: new Set(KINDS), q: "", sel: null, sheet: null, eraCardClosed: false };
  const prefs = {
    base: store.get("base", "atlas"),
    regions: store.get("regions", null),   // null = otomatik
    cities: store.get("cities", false),
    routes: store.get("routes", false),
    theme: store.get("theme", "auto"),
    sideCollapsed: store.get("sideCollapsed", false)
  };
  if (!["atlas", "uydu", "sade"].includes(prefs.base)) prefs.base = "atlas";
  if (!["auto", "light", "dark"].includes(prefs.theme)) prefs.theme = "auto";
  let routeOverride = {};
  let VIS = [], VISSET = new Set();

  // =====================================================================
  //  DOM referansları
  // =====================================================================
  const sideEl = $("#side"), sheetEl = $("#sheet"), sheetBody = $("#sheetBody"), dockEl = $("#dock"),
    listEl = $("#list"), tlEl = $("#tl"), qEl = $("#q"), tipEl = $("#tip"), layersEl = $("#layers"), tourbarEl = $("#tourbar");

  // Statik simgeleri yerleştir
  $("#qIcon").outerHTML = ic("search");
  $("#qClear").innerHTML = ic("x");
  $("#drawerClose").innerHTML = ic("x");
  $("#drawerBtn").innerHTML = ic("list") + '<span class="t">Kayıtlar</span>';
  $("#tourBtn").innerHTML = ic("tour") + '<span class="t">Tur</span>';
  $("#quizBtn").innerHTML = ic("quiz") + '<span class="t">Sınav</span>';
  $("#layersBtn").innerHTML = ic("layers") + '<span class="t">Katmanlar</span>';
  $("#hakBtn").innerHTML = ic("map") + '<span class="t">Hâkimiyet</span>';
  $("#hakBtn").setAttribute("aria-label", "Hâkimiyet haritası");
  $("#lbClose").innerHTML = ic("x");

  // Alt dock yüksekliğini CSS'e bildir
  const setDockH = () => document.documentElement.style.setProperty("--dock-h", dockEl.offsetHeight + "px");
  setDockH();
  if (window.ResizeObserver) new ResizeObserver(() => { setDockH(); sheetLayout(); }).observe(dockEl);
  else window.addEventListener("resize", setDockH);

  // =====================================================================
  //  Harita
  // =====================================================================
  const TR_BOUNDS = L.latLngBounds([[35.8, 25.9], [42.1, 44.8]]);
  const map = L.map("map", { zoomControl: false, attributionControl: false, minZoom: 4, maxZoom: 16, zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 90 });
  L.control.zoom({ position: "bottomright", zoomInTitle: "Yakınlaş", zoomOutTitle: "Uzaklaş" }).addTo(map);
  L.control.attribution({ position: "bottomright", prefix: '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>' }).addTo(map);
  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
  map.fitBounds(TR_BOUNDS, { animate: false });

  const mkPane = (n, z) => { const p = map.createPane(n); p.style.zIndex = z; p.style.pointerEvents = "none"; return p; };
  mkPane("routes", 410);
  mkPane("labels", 450);
  mkPane("cities", 395); // işaretlerin ve güzergâhların altında

  // ---------- Altlık (yalnızca Esri; file:// için referer gerektirmez) ----------
  const ESRI = s => `https://server.arcgisonline.com/ArcGIS/rest/services/${s}/MapServer/tile/{z}/{y}/{x}`;
  const tile = (s, nat) => L.tileLayer(ESRI(s), { maxNativeZoom: nat, maxZoom: 16, attribution: "Esri", className: "tl-" + nat });
  const TILES = {
    atlas: tile("World_Shaded_Relief", 13),
    uydu: tile("World_Imagery", 18),
    sadeL: tile("Canvas/World_Light_Gray_Base", 16),
    sadeD: tile("Canvas/World_Dark_Gray_Base", 16)
  };
  let curTile = null;
  const isDark = () => prefs.theme === "dark" || (prefs.theme === "auto" && DARK_MQ.matches);
  function setBase(b) {
    prefs.base = b; store.set("base", b);
    const t = TILES[b === "sade" ? (isDark() ? "sadeD" : "sadeL") : b];
    if (curTile !== t) { if (curTile) map.removeLayer(curTile); t.addTo(map); curTile = t; }
    const c = map.getContainer();
    c.classList.remove("base-atlas", "base-uydu", "base-sade");
    c.classList.add("base-" + b);
    syncLayersUI();
  }

  // ---------- Kendi etiketlerimiz ----------
  const SEAS = DENIZLER, REGIONS = BOLGELER, CITIES = SEHIRLER; // data/olaylar.js
  const lbl = (html, cls, ll) => L.marker(ll, { icon: L.divIcon({ className: "lbl-icon", html: `<span class="lbl ${cls}">${html}</span>`, iconSize: [0, 0] }), interactive: false, keyboard: false, pane: "labels" });
  const seaLayer = L.layerGroup(SEAS.map(([n, a, b, c]) => lbl(esc(n), "lbl-sea " + c, [a, b]))).addTo(map);
  const regionLayer = L.layerGroup(REGIONS.map(([n, a, b]) => lbl(esc(n), "lbl-region", [a, b])));
  const cityLayer = L.layerGroup(CITIES.map(([n, a, b]) => L.marker([a, b], { icon: L.divIcon({ className: "lbl-icon", html: `<span class="lbl lbl-city">${esc(n)}</span>`, iconSize: [0, 0] }), interactive: false, keyboard: false, pane: "cities" })));
  // Bir kayıt işareti ya da kümesi ~14px içindeyse şehir etiketini gizle
  let cityT = null;
  function cityCollide() {
    clearTimeout(cityT);
    cityT = setTimeout(() => {
      if (!map.hasLayer(cityLayer)) return;
      const pts = $$(".leaflet-marker-pane .mk-wrap, .leaflet-marker-pane .cl-wrap", map.getContainer()).map(el => {
        const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.width / 2 };
      });
      cityLayer.eachLayer(l => {
        const sp = l.getElement() && l.getElement().firstElementChild;
        if (!sp) return;
        sp.classList.remove("hid");
        const r = sp.getBoundingClientRect();
        if (!r.width) return;
        const pad = 14;
        const hit = pts.some(p => p.x + p.h > r.left - pad && p.x - p.h < r.right + pad && p.y + p.h > r.top - pad && p.y - p.h < r.bottom + pad);
        sp.classList.toggle("hid", hit);
      });
    }, 80);
  }
  map.on("zoomend moveend", cityCollide);
  void seaLayer;
  const ANTIQ = new Set(["demir", "hel", "roma", "biz"]);
  const regionsOn = () => prefs.regions !== null ? prefs.regions : [...state.periods].every(p => ANTIQ.has(p));
  const toggleLayer = (l, on) => { if (on && !map.hasLayer(l)) l.addTo(map); else if (!on && map.hasLayer(l)) map.removeLayer(l); };

  // ---------- Güzergâhlar ----------
  function catmull(pts, seg = 10) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
      for (let s = 0; s < seg; s++) {
        const t = s / seg, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  // Rota verisi data/olaylar.js içinde (ROTALAR); "egri" noktaları Catmull-Rom ile yumuşatılır
  const ROUTES = ROTALAR.map(r => ({ ...r, pts: r.egri ? [...catmull(r.egri, 12), ...r.pts] : r.pts }));
  const routeLayers = {};
  ROUTES.forEach(r => {
    const g = L.layerGroup();
    L.polyline(r.pts, { pane: "routes", className: "route-halo", interactive: false }).addTo(g);
    L.polyline(r.pts, { pane: "routes", className: `route ec-${r.era}`, interactive: false }).addTo(g);
    lbl(`<b>${esc(r.n)}</b><small>yaklaşık güzergâh</small>`, `lbl-route ec-${r.era}`, r.lbl || r.pts[Math.floor(r.pts.length / 2)]).addTo(g);
    if (r.end) lbl(esc(r.end.t) + ic("arrowR"), `lbl-end ec-${r.era}`, r.end.ll).addTo(g);
    routeLayers[r.id] = g;
  });
  const routeShown = r => {
    if (quiz.on) return false;
    if (Object.prototype.hasOwnProperty.call(routeOverride, r.id)) return routeOverride[r.id];
    return state.periods.has(r.era) && (prefs.routes || state.periods.size === 1);
  };
  const syncRoutes = () => ROUTES.forEach(r => toggleLayer(routeLayers[r.id], routeShown(r)));

  // ---------- İşaretler ----------
  const mkIcon = (e, sel) => L.divIcon({
    className: `mk-wrap ec-${e.p}${sel ? " sel" : ""}`,
    html: `<i class="mk k-${e.k}"></i><span class="mk-name">${esc(e.t)}</span>`,
    iconSize: [16, 16], iconAnchor: [8, 8]
  });
  const labelEl = (m, e) => { const el = m.getElement && m.getElement(); if (el) el.setAttribute("aria-label", `${e.t}, ${e.d}`); };
  const markers = new Map();
  DATA.forEach(e => {
    const m = L.marker([e.lat, e.lng], { icon: mkIcon(e, false), keyboard: true, riseOnHover: true, rec: e });
    m.on("add", () => labelEl(m, e));
    m.on("click", () => select(e, { user: true, fly: false }));
    markers.set(e.id, m);
  });

  const hasMC = typeof L.markerClusterGroup === "function";
  function clusterIcon(c) {
    const kids = c.getAllChildMarkers();
    const cnt = {};
    kids.forEach(k => { const p = k.options.rec.p; cnt[p] = (cnt[p] || 0) + 1; });
    let acc = 0;
    const stops = PKEYS.filter(p => cnt[p]).map(p => { const a = acc; acc += cnt[p] / kids.length * 100; return `var(--e-${p}) ${a.toFixed(2)}% ${acc.toFixed(2)}%`; }).join(",");
    return L.divIcon({ className: "cl-wrap", html: `<div class="cl" style="background:conic-gradient(${stops})"><span>${kids.length}</span></div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
  }
  const cluster = hasMC
    ? L.markerClusterGroup({
        maxClusterRadius: z => (z <= 7 ? 16 : z < 11 ? 22 : 8),showCoverageOnHover: false, zoomToBoundsOnClick: false, spiderfyOnMaxZoom: true,
        spiderfyDistanceMultiplier: 1.7, animate: !RM.matches, iconCreateFunction: clusterIcon,
        spiderLegPolylineOptions: { weight: 1.25, opacity: 0.8, className: "spider-leg" }
      })
    : (() => { // markercluster yüklenemezse basit yedek
        const g = L.layerGroup();
        g.addLayers = ls => ls.forEach(l => g.addLayer(l));
        g.zoomToShowLayer = (l, cb) => cb && cb();
        g.getVisibleParent = l => (g.hasLayer(l) ? l : null);
        return g;
      })();
  if (hasMC) {
    cluster.on("clusterclick", ev => {
      const c = ev.layer, b = c.getBounds();
      const span = map.distance(b.getSouthWest(), b.getNorthEast());
      if (map.getZoom() >= 10 || span < 4000) c.spiderfy();
      else c.zoomToBounds({ padding: [70, 70] });
    });
    cluster.on("clustermouseover", ev => { const el = ev.layer.getElement(); if (el) el.title = ev.layer.getChildCount() + " kayıt · ayırmak için tıkla"; });
  }
  cluster.addTo(map);
  if (hasMC) cluster.on("animationend spiderfied unspiderfied", () => cityCollide());
  const quizLayer = L.layerGroup().addTo(map);

  function zoomClasses() {
    const z = map.getZoom(), c = map.getContainer();
    c.classList.toggle("z-lo", z < 5.75);
    c.classList.toggle("z-hi", z >= 8);
    c.classList.toggle("z-xhi", z >= 10);
    c.classList.toggle("names", z >= 9);
  }
  map.on("zoomend", zoomClasses);

  // ---------- Görünür alan (yüzen paneller düşülerek) ----------
  function insets() {
    const dock = dockEl.offsetHeight;
    const open = sheetEl.classList.contains("open");
    const I = { t: MOBILE.matches ? 60 : 28, l: 16, r: 16, b: dock + 28 };
    if (!MOBILE.matches) {
      if (!sideEl.classList.contains("collapsed")) I.l = sideEl.offsetWidth + 28;
      if (open) { I.r = sheetEl.offsetWidth + 28; I.t = 64; }
    } else if (open) {
      const top = sheetMode === "full" ? innerHeight * 0.12 : dockEl.offsetTop - 8 - innerHeight * 0.35;
      I.b = Math.max(dock + 24, innerHeight - top + 12);
    }
    const s = map.getSize();
    if (I.l + I.r > s.x - 120) { const k = (s.x - 120) / (I.l + I.r); I.l *= k; I.r *= k; }
    if (I.t + I.b > s.y - 100) { const k = (s.y - 100) / (I.t + I.b); I.t *= k; I.b *= k; }
    return I;
  }
  let viewTouched = false;
  function flyToLL(ll, z) {
    viewTouched = true;
    const I = insets();
    const pt = map.project(L.latLng(ll), z).subtract([(I.l - I.r) / 2, (I.t - I.b) / 2]);
    const c = map.unproject(pt, z);
    if (RM.matches) map.setView(c, z, { animate: false });
    else map.flyTo(c, z, { duration: 1.0 });
  }
  function fitTo(bounds, maxZoom = 8) {
    viewTouched = true;
    const I = insets();
    const o = { paddingTopLeft: [I.l, I.t], paddingBottomRight: [I.r, I.b], maxZoom };
    if (RM.matches) map.fitBounds(bounds, { ...o, animate: false });
    else map.flyToBounds(bounds, { ...o, duration: 0.9 });
  }
  function ensureInView(ll) {
    const I = insets(), s = map.getSize(), p = map.latLngToContainerPoint(ll);
    if (p.x < I.l || p.x > s.x - I.r || p.y < I.t || p.y > s.y - I.b) flyToLL(ll, map.getZoom());
  }
  function fitVisible() {
    if (quiz.on || !VIS.length) return;
    fitTo(L.latLngBounds(VIS.map(e => [e.lat, e.lng])).pad(0.12), 8);
  }

  // =====================================================================
  //  Filtreleme ve çizim
  // =====================================================================
  function matchesQ(e) {
    const terms = norm(state.q.trim()).split(/\s+/).filter(Boolean);
    return terms.every(t => e._q.includes(t));
  }
  function visible() { return SORTED.filter(e => state.periods.has(e.p) && state.kinds.has(e.k) && matchesQ(e)); }

  function render() {
    VIS = visible();
    VISSET = new Set(VIS.map(e => e.id));
    if (!quiz.on) {
      cluster.clearLayers();
      cluster.addLayers(VIS.map(e => markers.get(e.id)));
    }
    if (state.sel && !VISSET.has(state.sel.id)) deselect();
    renderList();
    syncSegs();
    syncTicks();
    syncLabels();
    syncRoutes();
    if (!quiz.on) autoSheet();
    if (state.sheet === "quizpick") openQuizPicker();
    if (tour.on) { const i = state.sel ? VIS.findIndex(x => x.id === state.sel.id) : -1; if (i >= 0) tour.i = i; updTourLabel(); }
  }

  function syncLabels() {
    toggleLayer(regionLayer, regionsOn());
    toggleLayer(cityLayer, prefs.cities);
    cityCollide();
    syncLayersUI();
  }

  // ---------- Liste ----------
  const qTerms = () => norm(state.q.trim()).split(/\s+/).filter(Boolean);
  // Eşleşmeleri <mark> ile vurgula (karşılaştırma normalize edilmiş metinde, vurgu özgün metinde)
  function hl(text, terms) {
    text = String(text == null ? "" : text);
    if (!terms.length) return esc(text);
    let nm = "";
    const at = [];
    for (let i = 0; i < text.length; i++) { const n = norm(text[i]); for (let k = 0; k < n.length; k++) { nm += n[k]; at.push(i); } }
    const on = new Array(text.length).fill(false);
    terms.forEach(t => { for (let j = nm.indexOf(t); j >= 0; j = nm.indexOf(t, j + t.length)) for (let k = j; k < j + t.length; k++) on[at[k]] = true; });
    let out = "", m = false;
    for (let i = 0; i < text.length; i++) { if (on[i] !== m) { out += on[i] ? "<mark>" : "</mark>"; m = on[i]; } out += esc(text[i]); }
    return m ? out + "</mark>" : out;
  }
  function itemHtml(e, terms = []) {
    return `<button class="item ec-${e.p}${state.sel && state.sel.id === e.id ? " sel" : ""}" data-id="${e.id}">${kindSvg(e.k)}<span><b>${hl(e.t, terms)}</b><small>${hl(e.d, terms)} · ${hl(e.il, terms)}</small></span></button>`;
  }
  function renderList() {
    const terms = qTerms(), q = state.q.trim();
    $("#count").innerHTML = q
      ? `<b>“${esc(q)}”</b> için ${VIS.length ? `<b>${VIS.length}</b> sonuç` : "sonuç yok"}`
      : VIS.length === DATA.length ? `${DATA.length} kayıt` : `${DATA.length} kayıttan ${VIS.length} tanesi`;
    if (!VIS.length) {
      listEl.innerHTML = `<div class="empty">${q ? `“${esc(q)}” bu filtrelerle hiçbir kayıtta geçmiyor.` : "Bu filtrelerle eşleşen kayıt yok."}<br><button class="btn sm" data-act="reset">Filtreleri temizle</button></div>`;
      return;
    }
    listEl.innerHTML = PKEYS.map(p => {
      const arr = VIS.filter(e => e.p === p);
      if (!arr.length) return "";
      return `<section class="grp ec-${p}"><h3 class="grp-h"><i class="dot"></i><span>${esc(DONEMLER[p].n)}</span><span class="grp-c tnum">${arr.length}</span></h3>${arr.map(e => itemHtml(e, terms)).join("")}</section>`;
    }).join("");
  }
  function syncListSel() {
    $$(".item.sel", listEl).forEach(x => x.classList.remove("sel"));
    if (!state.sel) return;
    const li = $(`.item[data-id="${state.sel.id}"]`, listEl);
    if (li) { li.classList.add("sel"); if (!sideEl.classList.contains("collapsed")) li.scrollIntoView({ block: "nearest" }); }
  }
  listEl.addEventListener("click", ev => {
    const b = ev.target.closest(".item");
    if (b) { select(DATA[+b.dataset.id], { user: true, fly: true }); return; }
    if (ev.target.closest('[data-act="reset"]')) resetFilters();
  });
  function resetFilters() {
    state.periods = new Set(PKEYS); state.kinds = new Set(KINDS); state.q = ""; qEl.value = ""; $("#qClear").hidden = true;
    routeOverride = {}; syncChips(); render(); fitVisible();
  }

  // ---------- Tür çipleri ----------
  $("#kinds").innerHTML = KINDS.map(k => `<button class="chip" data-k="${k}" aria-pressed="true">${kindSvg(k)}${esc(TURLER[k])}</button>`).join("");
  const syncChips = () => $$(".chip", $("#kinds")).forEach(b => b.setAttribute("aria-pressed", state.kinds.has(b.dataset.k)));
  $("#kinds").addEventListener("click", ev => {
    const b = ev.target.closest(".chip"); if (!b) return;
    const k = b.dataset.k;
    if (state.kinds.has(k)) state.kinds.delete(k); else state.kinds.add(k);
    if (!state.kinds.size) KINDS.forEach(x => state.kinds.add(x));
    syncChips(); render();
  });

  // ---------- Arama ----------
  let qTimer;
  qEl.addEventListener("input", () => {
    $("#qClear").hidden = !qEl.value;
    $("#qKbd").hidden = !!qEl.value;
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { state.q = qEl.value; render(); }, 120);
  });
  qEl.addEventListener("keydown", ev => {
    if (ev.key === "Escape") {
      ev.stopPropagation();
      if (qEl.value) clearSearch(); else qEl.blur();
    } else if (ev.key === "Enter" && VIS.length) {
      select(VIS[0], { user: true, fly: true });
    }
  });
  function clearSearch() {
    qEl.value = ""; state.q = ""; $("#qClear").hidden = true; $("#qKbd").hidden = false; render();
  }
  $("#qClear").onclick = () => { clearSearch(); qEl.focus(); };
  function focusSearch() {
    if (MOBILE.matches) openDrawer();
    qEl.focus(); qEl.select();
  }

  // ---------- Sol panel daraltma / mobil çekmece ----------
  function setSideCollapsed(c) {
    prefs.sideCollapsed = c; store.set("sideCollapsed", c);
    sideEl.classList.toggle("collapsed", c);
    const b = $("#sideToggle");
    b.innerHTML = ic(c ? "chevDown" : "chevUp");
    b.setAttribute("aria-expanded", String(!c));
    b.title = c ? "Listeyi aç" : "Listeyi daralt";
    b.setAttribute("aria-label", b.title);
  }
  $("#sideToggle").onclick = () => setSideCollapsed(!prefs.sideCollapsed);
  const openDrawer = () => { document.body.classList.add("drawer"); };
  const closeDrawer = () => { document.body.classList.remove("drawer"); };
  $("#drawerBtn").onclick = () => { openDrawer(); setTimeout(() => qEl.focus({ preventScroll: true }), 50); };
  $("#drawerClose").onclick = closeDrawer;
  $("#scrim").onclick = closeDrawer;

  // =====================================================================
  //  Zaman çizelgesi
  // =====================================================================
  tlEl.innerHTML = PKEYS.map(p => {
    const arr = BY_ERA[p], n = arr.length || 1, P = DONEMLER[p];
    const words = P.n.split(" ");
    let best = P.n.length;
    for (let k = 1; k < words.length; k++) best = Math.min(best, Math.max(words.slice(0, k).join(" ").length, words.slice(k).join(" ").length));
    const minw = Math.ceil(Math.max(best, ...words.map(w => w.length)) * 7.6 + 22);
    return `<div class="seg ec-${p}" data-p="${p}" style="--w:${Math.max(arr.length, 5)};--minw:${minw}px">
      <button class="seg-h" data-p="${p}" aria-pressed="true" title="${esc(P.n)} · tıkla: yalnız bu dönem · Shift/Ctrl+tık: ekle/çıkar"><span class="nm">${esc(P.n)}</span><span class="dt">${esc(P.r)}</span></button>
      <div class="ticks">${arr.map((e, i) => `<button class="tick" tabindex="-1" data-id="${e.id}" aria-label="${esc(e.t)}, ${esc(e.d)}" style="left:${((i + 0.5) / n * 100).toFixed(3)}%;width:min(${(100 / n).toFixed(3)}%,14px)"></button>`).join("")}</div>
    </div>`;
  }).join("");

  function syncTlX() {
    const on = document.body.classList.contains("tl-x"), b = $("#tlX");
    b.innerHTML = ic(on ? "chevDown" : "chevUp");
    b.setAttribute("aria-expanded", String(on));
    b.title = on ? "Çentikleri gizle" : "Bütün çentikleri göster";
    b.setAttribute("aria-label", b.title);
  }
  $("#tlX").onclick = () => { document.body.classList.toggle("tl-x"); syncTlX(); };
  syncTlX();

  function syncSegs() {
    const all = state.periods.size === PKEYS.length;
    $$(".seg", tlEl).forEach(s => {
      const on = state.periods.has(s.dataset.p);
      s.classList.toggle("off", !on);
      s.classList.toggle("act", on && !all);
      $(".seg-h", s).setAttribute("aria-pressed", String(on));
    });
    $("#allBtn").setAttribute("aria-pressed", String(all));
  }
  function syncTicks() {
    const sid = state.sel ? state.sel.id : -1;
    $$(".tick", tlEl).forEach(t => {
      const id = +t.dataset.id;
      t.classList.toggle("dim", !VISSET.has(id));
      t.classList.toggle("on", id === sid);
    });
    if (state.sel) {
      const t = $(`.tick[data-id="${sid}"]`, tlEl);
      if (t && tlEl.scrollWidth > tlEl.clientWidth) {
        const seg = t.closest(".seg"), r = seg.getBoundingClientRect(), R = tlEl.getBoundingClientRect();
        if (r.left < R.left || r.right > R.right) tlEl.scrollBy({ left: r.left - R.left - 8, behavior: RM.matches ? "auto" : "smooth" });
      }
    }
  }

  function eraClick(p, ev) {
    hintSeen();
    const multi = ev && (ev.shiftKey || ev.ctrlKey || ev.metaKey);
    if (multi) {
      if (state.periods.has(p)) state.periods.delete(p); else state.periods.add(p);
      if (!state.periods.size) state.periods.add(p);
    } else if (state.periods.size === 1 && state.periods.has(p)) {
      state.periods = new Set(PKEYS);
    } else {
      state.periods = new Set([p]);
      if (state.sel) deselect();
    }
    state.eraCardClosed = false;
    routeOverride = {};
    if (tour.on) stopTour();
    render();
    fitVisible();
    if (hak.on && state.periods.size === 1) hakSet(snapForEra([...state.periods][0]));
  }
  tlEl.addEventListener("click", ev => {
    const t = ev.target.closest(".tick");
    if (t) { hideTip(); select(DATA[+t.dataset.id], { user: true, fly: true }); return; }
    const s = ev.target.closest(".seg");
    if (s) eraClick(s.dataset.p, ev);
  });
  $("#allBtn").onclick = () => {
    hintSeen();
    state.periods = new Set(PKEYS); state.eraCardClosed = false; routeOverride = {};
    render(); fitVisible();
  };

  // İpucu baloncuğu + haritada nabız
  let pinged = null;
  function ping(id) {
    unping();
    const m = markers.get(id);
    if (!m || quiz.on) return;
    const par = cluster.getVisibleParent ? cluster.getVisibleParent(m) : m;
    const el = par && par.getElement ? par.getElement() : null;
    if (el) { el.classList.add("ping"); pinged = el; }
  }
  function unping() { if (pinged) { pinged.classList.remove("ping"); pinged = null; } }
  function showTip(t) {
    const e = DATA[+t.dataset.id];
    tipEl.innerHTML = `<b>${esc(e.t)}</b><span>${esc(e.d)}</span>`;
    tipEl.hidden = false;
    const r = t.getBoundingClientRect();
    const w = tipEl.offsetWidth;
    const x = Math.min(Math.max(r.left + r.width / 2, w / 2 + 8), innerWidth - w / 2 - 8);
    tipEl.style.left = x + "px";
    tipEl.style.top = r.top + "px";
  }
  function hideTip() { tipEl.hidden = true; unping(); }
  tlEl.addEventListener("mouseover", ev => {
    const t = ev.target.closest(".tick");
    if (!t || quiz.on) return;
    showTip(t); ping(+t.dataset.id);
  });
  tlEl.addEventListener("mouseout", ev => { if (ev.target.closest(".tick")) hideTip(); });
  tlEl.addEventListener("scroll", hideTip, { passive: true });

  // İlk kullanım ipucu
  const hintEl = $("#tlHint");
  if (!store.get("hintSeen", false)) {
    hintEl.innerHTML = `${ic("info")}<span><b>Bir döneme tıkla:</b> yalnız o dönem · <b>tekrar tıkla:</b> tümü · <b>Shift/Ctrl+tık:</b> ekle/çıkar · <b>çentikler</b> tek tek kayıtlardır</span>`;
    hintEl.hidden = false;
  }
  function hintSeen() { if (!hintEl.hidden) { hintEl.hidden = true; store.set("hintSeen", true); } }

  // =====================================================================
  //  Sağ sayfa
  // =====================================================================
  // Mobilde sayfa iki durakta durur: "peek" (~%35, görsel + başlık) ve "full" (~%88)
  let sheetMode = "peek";
  function peekTy() {
    const vh = innerHeight;
    const want = Math.min(dockEl.offsetTop - 8 - vh * 0.35, vh - 220);
    return Math.max(0, Math.round(want - sheetEl.offsetTop));
  }
  function sheetLayout() {
    const open = sheetEl.classList.contains("open");
    if (!MOBILE.matches || !open) {
      sheetEl.style.removeProperty("--ty");
      sheetEl.classList.remove("peek");
      document.body.classList.remove("sheet-full");
      return;
    }
    sheetEl.style.setProperty("--ty", (sheetMode === "full" ? 0 : peekTy()) + "px");
    sheetEl.classList.toggle("peek", sheetMode === "peek");
    document.body.classList.toggle("sheet-full", sheetMode === "full");
    if (sheetMode === "peek") sheetEl.scrollTop = 0;
  }
  function setSheetMode(m) { sheetMode = m; sheetLayout(); }
  function openSheet(html, kind, o = {}) {
    const same = state.sheet === kind && sheetEl.classList.contains("open");
    sheetBody.innerHTML = html;
    state.sheet = kind;
    $("#quizBtn").setAttribute("aria-pressed", String(kind === "quiz" || kind === "quizpick"));
    sheetEl.classList.add("open");
    sheetEl.style.transform = "";
    document.body.classList.add("sheet-open");
    sheetEl.scrollTop = 0;
    if (o.full) sheetMode = "full";
    else if (!same || o.peek) sheetMode = "peek";
    sheetLayout();
    syncImgs();
    hideWelcome(false);
  }
  function closeSheet() {
    const kind = state.sheet;
    sheetEl.classList.remove("open");
    document.body.classList.remove("sheet-open");
    state.sheet = null;
    sheetLayout();
    if (kind === "hak") hakHi(null);
    if (kind === "era") state.eraCardClosed = true;
    if (kind === "rec") { deselect(); autoSheet(); }
    if ((kind === "quiz" || kind === "quizpick") && quiz.on) stopQuiz(true);
    if (kind === "quizpick") $("#quizBtn").setAttribute("aria-pressed", "false");
  }
  function autoSheet() {
    if (state.sel || quiz.on) return;
    if (state.sheet && state.sheet !== "era") return;
    if (state.periods.size === 1 && !state.eraCardClosed) showEra([...state.periods][0]);
    else if (state.sheet === "era") closeSheet();
  }

  function agoText(y) {
    const yy = Math.round(y), n = NOW - yy;
    if (yy >= 1900) return n <= 0 ? "bu yıl" : `${fmt(n)} yıl önce`;
    if (n >= 1e6) return `günümüzden ~${(n / 1e6).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} milyon yıl önce`;
    const r = n >= 10000 ? Math.round(n / 100) * 100 : n >= 1000 ? Math.round(n / 10) * 10 : n;
    return `günümüzden ~${fmt(r)} yıl önce`;
  }
  const km = (a, b) => map.distance([a.lat, a.lng], [b.lat, b.lng]) / 1000;
  const fmtKm = d => d < 10 ? d.toLocaleString("tr-TR", { maximumFractionDigits: 1 }) : fmt(Math.round(d));

  function pnCard(x, dir) {
    if (!x) return `<div class="pn-card empty ${dir}" aria-hidden="true"><small>${dir === "prev" ? "Önceki" : "Sonraki"}</small></div>`;
    return `<button class="pn-card ${dir} ec-${x.p}" data-id="${x.id}"><small>${dir === "prev" ? ic("prev") + "Önceki" : "Sonraki" + ic("next")}</small><span class="pn-m">${thHtml(x)}<span class="pn-t"><b>${esc(x.t)}</b><span>${esc(x.d)}</span></span></span></button>`;
  }
  function heroHtml(e) {
    const g = gorsel(e);
    if (!g) return "";
    return `<figure class="hero ec-${e.p}"><button class="hero-btn" data-act="lb" aria-label="Görseli büyüt: ${esc(e.t)}"><img src="${esc(g.src)}" width="${g.w}" height="${g.h}" alt="${esc(e.t)}" decoding="async"></button><figcaption>${credHtml(g)}</figcaption></figure>`;
  }
  function detailHtml(e) {
    const P = DONEMLER[e.p];
    const i = VIS.findIndex(x => x.id === e.id);
    const prev = i > 0 ? VIS[i - 1] : null, next = i >= 0 && i < VIS.length - 1 ? VIS[i + 1] : null;
    const near = DATA.filter(x => x.id !== e.id).map(x => [x, km(e, x)]).sort((a, b) => a[1] - b[1]).slice(0, 5);
    const unesco = e.s.includes("UNESCO Dünya Mirası");
    const wk = wikiUrl(e);
    return `
      <header class="band ec-${e.p}">
        <span class="band-era">${esc(P.n)}</span>
        <span class="band-kind">${kindSvg(e.k)}${esc(TURLER[e.k])}</span>
        <button class="ibtn" data-act="close" aria-label="Kapat (Esc)">${ic("x")}</button>
      </header>
      ${heroHtml(e)}
      <div class="sh-in">
        <h2 class="title">${esc(e.t)}</h2>
        <div class="when"><span class="date">${ic("cal")}${esc(e.d)}</span><span class="ago">${agoText(e.y)}</span></div>
        <ul class="facts">
          <li>${ic("pin")}<span><small>Konum</small>${esc(e.il)}</span></li>
          <li>${ic("columns")}<span><small>Uygarlık / taraflar</small>${esc(e.c)}</span></li>
        </ul>
        ${unesco ? `<span class="unesco">${ic("award")}UNESCO Dünya Mirası</span>` : ""}
        <p class="body">${esc(e.s)}</p>
        ${e.a ? `<p class="approx">${ic("info")}<span>Haritadaki konum yaklaşıktır ya da tartışmalıdır.</span></p>` : ""}
        <div class="acts">
          <button class="btn" data-act="zoom">${ic("zoom")}Haritada yakınlaş</button>
          ${wk ? `<a class="btn" href="${esc(wk)}" target="_blank" rel="noopener">${ic("book")}Vikipedi'de oku${/^https:\/\/en\./.test(wk) ? " (İng.)" : ""}</a>`
            : `<a class="btn" href="https://tr.wikipedia.org/w/index.php?search=${encodeURIComponent(e.t)}" target="_blank" rel="noopener">${ic("ext")}Vikipedi'de ara</a>`}
          <button class="btn" data-act="copy">${ic("link")}Bağlantıyı kopyala</button>
        </div>
        <div class="pn">${pnCard(prev, "prev")}${pnCard(next, "next")}</div>
        <h4 class="sub">Yakınındaki diğer yerler</h4>
        <ul class="near">${near.map(([x, d]) => `<li><button class="ec-${x.p}" data-id="${x.id}" title="${esc(DONEMLER[x.p].n)}"><i class="dot"></i><b>${esc(x.t)}</b><small>${fmtKm(d)} km</small></button></li>`).join("")}</ul>
      </div>`;
  }

  function eraHtml(p) {
    const P = DONEMLER[p], arr = BY_ERA[p];
    const cnt = {}; KINDS.forEach(k => { cnt[k] = 0; }); arr.forEach(e => { cnt[e.k]++; });
    const rts = ROUTES.filter(r => r.era === p);
    return `
      <header class="band ec-${p}">
        <span class="band-era">Dönem</span>
        <span class="band-kind tnum">${arr.length} kayıt</span>
        <button class="ibtn" data-act="close" aria-label="Kapat (Esc)">${ic("x")}</button>
      </header>
      <div class="sh-in ec-${p}">
        <h2 class="title">${esc(P.n)}</h2>
        <div class="when"><span class="date">${ic("cal")}${esc(P.r)}</span></div>
        <p class="body">${esc((EK[p] || {}).o || "")}</p>
        <div class="kcount">${KINDS.filter(k => cnt[k]).map(k => `<span class="kc">${kindSvg(k)}<b>${cnt[k]}</b>${esc(TURLER[k])}</span>`).join("")}</div>
        ${rts.length ? `<h4 class="sub">Güzergâhlar</h4><div class="rt-list">${rts.map(r => {
          const on = routeShown(r);
          return `<div class="rt"><i class="rt-line"></i><span>${esc(r.n)}<small>yaklaşık güzergâh</small></span><button class="btn sm" data-act="route" data-r="${r.id}" aria-pressed="${on}">${on ? "Gizle" : "Göster"}</button></div>`;
        }).join("")}</div>` : ""}
        <h4 class="sub">Bu dönemin kayıtları</h4>
        <ul class="erl">${arr.map(e => `<li><button class="ec-${e.p}${VISSET.has(e.id) ? "" : " dim"}" data-id="${e.id}">${thHtml(e)}<b>${esc(e.t)}</b><small>${esc(e.d)}</small></button></li>`).join("")}</ul>
        <div class="acts">
          <button class="btn primary" data-act="tour">${ic("tour")}Bu dönemi gez</button>
          <button class="btn" data-act="all">Tüm dönemler</button>
        </div>
      </div>`;
  }
  function showEra(p) { openSheet(eraHtml(p), "era"); }

  // Sayfa içi tıklamalar
  sheetBody.addEventListener("click", ev => {
    const a = ev.target.closest("[data-act]");
    if (a) {
      const act = a.dataset.act;
      if (act === "close") closeSheet();
      else if (act === "lb" && state.sel) openLB(state.sel);
      else if (act === "zoom" && state.sel) { const e = state.sel, m = markers.get(e.id); map.once("moveend", () => { if (state.sel === e) reveal(m); }); flyToLL([state.sel.lat, state.sel.lng], 12); }
      else if (act === "copy" && state.sel) copyLink(state.sel);
      else if (act === "route") {
        const r = ROUTES.find(x => x.id === a.dataset.r);
        if (r) { routeOverride[r.id] = !routeShown(r); syncRoutes(); if (state.sheet === "era") showEraKeepScroll(); }
      }
      else if (act === "tour") startTour();
      else if (act === "all") $("#allBtn").click();
      else if (act.startsWith("q-")) quizAction(act, a);
      return;
    }
    const b = ev.target.closest("[data-id]");
    if (b) select(DATA[+b.dataset.id], { user: true, fly: true });
  });
  function showEraKeepScroll() {
    const st = sheetEl.scrollTop;
    sheetBody.innerHTML = eraHtml([...state.periods][0]);
    sheetEl.scrollTop = st;
  }

  // ---------- Görsellerin yüklenmesi (iskelet -> yumuşak geçiş; hata -> sessizce kapan) ----------
  function syncImgs() {
    $$(".hero img", sheetBody).forEach(im => { if (im.complete) im.closest(".hero").classList.add(im.naturalWidth ? "ok" : "fail"); });
  }
  sheetBody.addEventListener("load", ev => {
    const im = ev.target;
    if (im.tagName === "IMG" && im.closest(".hero")) im.closest(".hero").classList.add("ok");
  }, true);
  sheetBody.addEventListener("error", ev => {
    const im = ev.target;
    if (im.tagName !== "IMG") return;
    const f = im.closest(".hero");
    if (f) f.classList.add("fail"); else im.style.display = "none";
  }, true);

  // ---------- Işık kutusu ----------
  const lbEl = $("#lb"), lbImg = $("#lbImg");
  let lbBack = null;
  function openLB(e) {
    const g = gorsel(e);
    if (!g) return;
    lbBack = document.activeElement;
    lbImg.onerror = () => { lbImg.onerror = null; if (lbImg.getAttribute("src") !== g.src) lbImg.src = g.src; };
    lbImg.src = thumbW(g, 1280);
    lbImg.alt = e.t;
    $("#lbCap").innerHTML = `<b>${esc(e.t)}</b>${credHtml(g)}`;
    lbEl.hidden = false;
    $("#lbClose").focus();
  }
  function closeLB() {
    if (lbEl.hidden) return;
    lbEl.hidden = true;
    lbImg.removeAttribute("src");
    if (lbBack && lbBack.focus && document.contains(lbBack)) lbBack.focus();
  }
  $("#lbClose").onclick = closeLB;
  lbEl.addEventListener("click", ev => { if (ev.target === lbEl || ev.target.classList.contains("lb-fig")) closeLB(); });
  lbEl.addEventListener("keydown", ev => {
    ev.stopPropagation();   // ← → ve Esc kayıtlarda gezinmesin
    if (ev.key === "Escape") { ev.preventDefault(); closeLB(); return; }
    if (ev.key === "Tab") {
      const f = $$("button, a[href]", lbEl);
      const i = f.indexOf(document.activeElement);
      ev.preventDefault();
      f[(i + (ev.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // ---------- Mobil alt sayfa: sürükle (peek ⇄ full, aşağı: kapat) ----------
  (() => {
    let d = null;
    const tyNow = () => parseFloat(sheetEl.style.getPropertyValue("--ty")) || 0;
    const swallow = () => {
      const sw = e => { e.stopPropagation(); e.preventDefault(); };
      window.addEventListener("click", sw, true);
      setTimeout(() => window.removeEventListener("click", sw, true), 60);
    };
    sheetEl.addEventListener("pointerdown", ev => {
      if (!MOBILE.matches || !sheetEl.classList.contains("open") || ev.button > 0) return;
      const head = ev.target.closest(".grab, .band");
      if (!head && sheetMode !== "peek") return;
      d = { id: ev.pointerId, y0: ev.clientY, ty0: tyNow(), on: false, last: ev.clientY, t: performance.now(), v: 0 };
    });
    sheetEl.addEventListener("pointermove", ev => {
      if (!d || ev.pointerId !== d.id) return;
      const dy = ev.clientY - d.y0;
      if (!d.on) {
        if (Math.abs(dy) < 7) return;
        d.on = true;
        sheetEl.classList.add("dragging");
        try { sheetEl.setPointerCapture(d.id); } catch (_) { /* yoksay */ }
      }
      const now = performance.now();
      d.v = 0.7 * d.v + 0.3 * ((ev.clientY - d.last) / Math.max(1, now - d.t));
      d.last = ev.clientY; d.t = now;
      const ty = d.ty0 + dy;
      sheetEl.style.setProperty("--ty", (ty < 0 ? ty * 0.25 : ty) + "px");
      ev.preventDefault();
    });
    const end = ev => {
      if (!d || ev.pointerId !== d.id) return;
      const g = d; d = null;
      if (!g.on) return;
      sheetEl.classList.remove("dragging");
      swallow();
      const pk = peekTy(), proj = tyNow() + g.v * 220;
      if (proj > pk + Math.min(110, innerHeight * 0.12)) closeSheet();
      else setSheetMode(proj < pk * 0.5 ? "full" : "peek");
    };
    sheetEl.addEventListener("pointerup", end);
    sheetEl.addEventListener("pointercancel", end);
    $("#grab").addEventListener("click", () => setSheetMode(sheetMode === "peek" ? "full" : "peek"));
    window.addEventListener("resize", sheetLayout);
    onMQ(MOBILE, sheetLayout);
  })();

  // ---------- Seçim ----------
  function setSel(e, on) {
    const m = markers.get(e.id); if (!m) return;
    m.setIcon(mkIcon(e, on));
    m.setZIndexOffset(on ? 1000 : 0);
    labelEl(m, e);
  }
  function deselect() {
    if (!state.sel) return;
    setSel(state.sel, false);
    state.sel = null;
    syncListSel(); syncTicks(); setHash(null);
    if (state.sheet === "rec") { sheetEl.classList.remove("open"); document.body.classList.remove("sheet-open"); state.sheet = null; sheetLayout(); }
  }
  function ensureVisible(e) {
    if (VISSET.has(e.id)) return;
    if (!state.periods.has(e.p)) state.periods.add(e.p);
    if (!state.kinds.has(e.k)) { state.kinds.add(e.k); syncChips(); }
    if (state.q && !matchesQ(e)) { state.q = ""; qEl.value = ""; $("#qClear").hidden = true; $("#qKbd").hidden = false; }
    routeOverride = {};
    render();
  }
  function reveal(m, tries = 0) {
    if (!m || !hasMC || !cluster.hasLayer(m)) return;
    // markercluster kendi yakınlaştırma animasyonu sürerken spiderfy isteğini yok sayar; bitmesini bekle
    if (cluster._inZoomAnimation && tries < 15) { setTimeout(() => reveal(m, tries + 1), 120); return; }
    const par = cluster.getVisibleParent(m);
    if (par === m) return;
    // Neredeyse üst üste duran kayıtlar: derin yakınlaştırmak yerine yerinde aç
    if (par && par.getBounds && map.getBounds().contains(par.getLatLng())) {
      const b = par.getBounds();
      if (map.distance(b.getSouthWest(), b.getNorthEast()) < 6000 || map.getZoom() >= 10) { par.spiderfy(); return; }
    }
    cluster.zoomToShowLayer(m, () => {});
  }
  function select(e, o = {}) {
    if (!e || quiz.on) return;
    if (o.user && tour.on) pauseTour();
    ensureVisible(e);
    if (state.sel && state.sel.id !== e.id) setSel(state.sel, false);
    state.sel = e;
    setSel(e, true);
    if (hak.on) hakSet(snapForYear(e.y, e.p));
    openSheet(detailHtml(e), "rec");
    syncListSel(); syncTicks(); setHash(e.id);
    if (tour.on) { const i = VIS.findIndex(x => x.id === e.id); if (i >= 0) tour.i = i; updTourLabel(); }
    welcomeDone();
    if (MOBILE.matches) closeDrawer();
    const m = markers.get(e.id);
    if (o.fly === false) { ensureInView([e.lat, e.lng]); return; }
    const ll = L.latLng(e.lat, e.lng);
    const far = !map.getBounds().pad(0.25).contains(ll);
    map.once("moveend", () => { if (state.sel === e) reveal(m); });
    flyToLL(ll, far ? 8 : Math.max(map.getZoom(), 8));
  }
  function step(dir) {
    if (quiz.on || !VIS.length) return;
    let i = state.sel ? VIS.findIndex(x => x.id === state.sel.id) : -1;
    i = i < 0 ? (dir > 0 ? 0 : VIS.length - 1) : i + dir;
    if (i < 0 || i >= VIS.length) return;
    if (tour.on) tourGo(i);
    else select(VIS[i], { fly: true });
  }

  // ---------- Bağlantı (#k=id) ----------
  const baseUrl = () => location.href.split("#")[0];
  function setHash(id) {
    if (!/^(file|https?):$/.test(location.protocol)) return;
    try { history.replaceState(null, "", id == null ? baseUrl() : "#k=" + id); } catch (_) { /* yoksay */ }
  }
  function hashRec() {
    const m = /^#k=(\d+)$/.exec(location.hash);
    return m && DATA[+m[1]] ? DATA[+m[1]] : null;
  }
  window.addEventListener("hashchange", () => { const e = hashRec(); if (e && (!state.sel || state.sel.id !== e.id)) select(e, { fly: true }); });
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = t; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (__) { ok = false; }
      ta.remove(); return ok;
    }
  }
  async function copyLink(e) {
    const ok = await copyText(baseUrl() + "#k=" + e.id);
    toast(ok ? "Bağlantı kopyalandı" : "Kopyalanamadı; adres çubuğundaki bağlantıyı kullanın");
  }
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // =====================================================================
  //  Katmanlar açılır paneli
  // =====================================================================
  layersEl.innerHTML = `
    <h3>Altlık</h3>
    <div class="radios" role="radiogroup" aria-label="Altlık harita">
      <label><input type="radio" name="base" value="atlas"><span>Atlas</span></label>
      <label><input type="radio" name="base" value="uydu"><span>Uydu</span></label>
      <label><input type="radio" name="base" value="sade"><span>Sade</span></label>
    </div>
    <h3>Katmanlar</h3>
    <label class="tg"><input type="checkbox" id="tgRegions"><span class="sw"></span><span>Antik bölge adları<small id="regNote"></small></span></label>
    <label class="tg"><input type="checkbox" id="tgCities"><span class="sw"></span><span>Bugünkü şehirler<small>Yön bulmak için</small></span></label>
    <label class="tg"><input type="checkbox" id="tgRoutes"><span class="sw"></span><span>Güzergâhlar<small>Yaklaşık; tek dönem seçiliyken kendiliğinden görünür</small></span></label>
    <h3>Lejant</h3>
    <ul class="legend">${KINDS.map(k => `<li>${kindSvg(k)}${esc(TURLER[k])}</li>`).join("")}</ul>
    <p class="leg-note">Renk, kaydın dönemini gösterir:</p>
    <div class="leg-eras">${PKEYS.map(p => `<span class="ec-${p}"><i></i>${esc(DONEMLER[p].n)}</span>`).join("")}</div>
    <p class="leg-note"><i class="leg-dash"></i>Kesikli çizgi: yaklaşık güzergâh</p>`;
  function syncLayersUI() {
    $$('input[name="base"]', layersEl).forEach(r => { r.checked = r.value === prefs.base; });
    $("#tgRegions").checked = regionsOn();
    $("#tgCities").checked = !!prefs.cities;
    $("#tgRoutes").checked = !!prefs.routes;
    $("#regNote").innerHTML = prefs.regions === null
      ? "Otomatik: antik dönemlerde açık"
      : `Elle ayarlandı · <button type="button" id="regAuto">otomatiğe dön</button>`;
  }
  layersEl.addEventListener("change", ev => {
    const t = ev.target;
    if (t.name === "base") setBase(t.value);
    else if (t.id === "tgRegions") { prefs.regions = t.checked; store.set("regions", t.checked); syncLabels(); }
    else if (t.id === "tgCities") { prefs.cities = t.checked; store.set("cities", t.checked); syncLabels(); }
    else if (t.id === "tgRoutes") { prefs.routes = t.checked; store.set("routes", t.checked); routeOverride = {}; syncRoutes(); if (state.sheet === "era") showEraKeepScroll(); }
  });
  layersEl.addEventListener("click", ev => {
    if (ev.target.id === "regAuto") { ev.preventDefault(); prefs.regions = null; store.set("regions", null); syncLabels(); }
  });
  function toggleLayersPop(open) {
    const o = open === undefined ? layersEl.hidden : open;
    layersEl.hidden = !o;
    $("#layersBtn").setAttribute("aria-expanded", String(o));
    if (o) syncLayersUI();
  }
  $("#layersBtn").onclick = ev => { ev.stopPropagation(); toggleLayersPop(); };
  document.addEventListener("pointerdown", ev => {
    if (!layersEl.hidden && !layersEl.contains(ev.target) && !$("#layersBtn").contains(ev.target)) toggleLayersPop(false);
  }, true);

  // =====================================================================
  //  Tema
  // =====================================================================
  const THEME_LBL = { auto: "Tema: otomatik", light: "Tema: açık", dark: "Tema: koyu" };
  function applyTheme() {
    const r = document.documentElement;
    if (prefs.theme === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", prefs.theme);
    const b = $("#themeBtn");
    b.innerHTML = ic(prefs.theme === "auto" ? "auto" : prefs.theme === "light" ? "sun" : "moon");
    b.title = THEME_LBL[prefs.theme] + " (değiştirmek için tıkla)";
    b.setAttribute("aria-label", THEME_LBL[prefs.theme]);
    setBase(prefs.base);
    syncThemeColor();
    if (typeof hakRestyle === "function" && hakReady) hakRestyle();
  }
  // Tarayıcı çubuğu rengi: otomatikte medya sorgulu iki etiket, elle seçimde ikisi de aynı renk
  function syncThemeColor() {
    const m = $$('meta[name="theme-color"]');
    const light = "#ece3d1", dark = "#12151c";
    m.forEach((x, k) => x.setAttribute("content", prefs.theme === "auto" ? (k === 0 ? light : dark) : (prefs.theme === "dark" ? dark : light)));
  }
  $("#themeBtn").onclick = () => {
    prefs.theme = { auto: "light", light: "dark", dark: "auto" }[prefs.theme];
    store.set("theme", prefs.theme);
    applyTheme();
    toast(THEME_LBL[prefs.theme]);
  };
  onMQ(DARK_MQ, () => { if (prefs.theme === "auto") { setBase(prefs.base); if (hakReady) hakRestyle(); } });
  let hakReady = false;

  // =====================================================================
  //  Kronolojik tur
  // =====================================================================
  const SPEEDS = [{ n: "yavaş", ms: 12000 }, { n: "normal", ms: 8000 }, { n: "hızlı", ms: 5000 }];
  const tour = { on: false, playing: false, i: 0, timer: null, sp: Math.min(2, Math.max(0, store.get("tourSpeed", 1) | 0)) };
  tourbarEl.innerHTML = `
    <button class="ibtn" id="tPrev" aria-label="Önceki kayıt">${ic("skipPrev")}</button>
    <button class="ibtn play" id="tPlay" aria-label="Duraklat"></button>
    <button class="ibtn" id="tNext" aria-label="Sonraki kayıt">${ic("skipNext")}</button>
    <span class="tb-pos" id="tPos"></span>
    <div class="tb-mid"><span class="tb-t" id="tTitle"></span><div class="tb-track"><div class="tb-fill" id="tFill"></div></div></div>
    <button class="btn sm tb-speed" id="tSpeed" title="Hız">${ic("gauge")}<span id="tSpeedL"></span></button>
    <button class="ibtn" id="tStop" aria-label="Turu bitir">${ic("x")}</button>`;
  function startTour() {
    if (quiz.on) stopQuiz(true);
    if (!VIS.length) return;
    tour.on = true; tour.playing = true;
    tour.i = state.sel ? Math.max(0, VIS.findIndex(x => x.id === state.sel.id)) : 0;
    tourbarEl.hidden = false;
    document.body.classList.add("touring");
    $("#tourBtn").setAttribute("aria-pressed", "true");
    welcomeDone();
    tourGo(tour.i);
  }
  function tourGo(i) {
    if (i >= VIS.length) { stopTour(); toast("Tur tamamlandı"); return; }
    tour.i = Math.max(0, i);
    select(VIS[tour.i], { fly: true });
    updTour();
  }
  function updTourLabel() {
    if (!tour.on) return;
    $("#tPos").textContent = `${tour.i + 1} / ${VIS.length}`;
    $("#tTitle").textContent = VIS[tour.i] ? VIS[tour.i].t : "";
  }
  function updTour() {
    updTourLabel();
    const b = $("#tPlay");
    b.innerHTML = ic(tour.playing ? "pause" : "play");
    b.setAttribute("aria-label", tour.playing ? "Duraklat" : "Oynat");
    $("#tSpeedL").textContent = SPEEDS[tour.sp].n;
    clearTimeout(tour.timer);
    const f = $("#tFill");
    f.style.transition = "none"; f.style.width = "0";
    if (tour.playing) {
      const ms = SPEEDS[tour.sp].ms;
      void f.offsetWidth;
      f.style.transition = `width ${ms}ms linear`; f.style.width = "100%";
      tour.timer = setTimeout(() => tourGo(tour.i + 1), ms);
    }
  }
  function pauseTour() { if (!tour.on || !tour.playing) return; tour.playing = false; updTour(); }
  function stopTour() {
    tour.on = false; tour.playing = false; clearTimeout(tour.timer);
    tourbarEl.hidden = true;
    document.body.classList.remove("touring");
    $("#tourBtn").setAttribute("aria-pressed", "false");
  }
  $("#tourBtn").onclick = () => (tour.on ? stopTour() : startTour());
  $("#tPlay").onclick = () => {
    tour.playing = !tour.playing;
    if (tour.playing && (!state.sel || VIS[tour.i] !== state.sel)) tourGo(tour.i); else updTour();
  };
  $("#tNext").onclick = () => tourGo(tour.i + 1);
  $("#tPrev").onclick = () => tourGo(Math.max(0, tour.i - 1));
  $("#tStop").onclick = stopTour;
  $("#tSpeed").onclick = () => { tour.sp = (tour.sp + 1) % SPEEDS.length; store.set("tourSpeed", tour.sp); updTour(); };
  // Kullanıcı haritayla etkileşince turu duraklat
  map.getContainer().addEventListener("pointerdown", () => pauseTour(), { passive: true });
  map.getContainer().addEventListener("wheel", () => pauseTour(), { passive: true });

  // =====================================================================
  //  Sınav: "Yeri bul" ve "Hangisi daha eski?"
  // =====================================================================
  const quiz = { on: false, game: null, qs: [], i: 0, score: 0, answered: false, hint: false, res: [] };
  const GAMES = {
    yer: { n: "Yeri bul", d: "Kaydın adı ve tarihi verilir; haritada yerini tıkla. Yakınlığa göre en çok 100 puan.", icon: "pin", max: 100 },
    eski: { n: "Hangisi daha eski?", d: "İki kayıt gelir; daha eski olanı seç. Her doğru 10 puan.", icon: "hourglass", max: 10 }
  };
  const ROUND = 10;
  const quizPool = () => SORTED.filter(e => state.periods.has(e.p) && state.kinds.has(e.k));
  function poolLabel() {
    const n = state.periods.size;
    if (n === PKEYS.length) return "Tüm dönemler";
    if (n === 1) return `${DONEMLER[[...state.periods][0]].n} dönemi`;
    return `${n} dönem (${PKEYS.filter(p => state.periods.has(p)).map(p => DONEMLER[p].n).join(", ")})`;
  }
  const distinctYears = pool => new Set(pool.map(e => e.y)).size;

  function openQuizPicker() {
    if (tour.on) stopTour();
    if (state.sel) deselect();
    const pool = quizPool();
    const can = { yer: pool.length >= 3, eski: distinctYears(pool) >= 3 };
    const best = g => { const b = store.get("best." + g, null); return b === null ? "Henüz oynanmadı" : `En iyi skor: ${fmt(b)} / ${fmt(GAMES[g].max * ROUND)}`; };
    openSheet(`
      <header class="band accent">
        <span class="band-era">Sınav</span>
        <button class="ibtn" data-act="close" aria-label="Kapat (Esc)" style="margin-left:auto">${ic("x")}</button>
      </header>
      <div class="sh-in">
        <h2 class="title">Ne kadar biliyorsun?</h2>
        <p class="q-instr">${ic("stack")}<span><b>Sorular:</b> ${esc(poolLabel())} · ${pool.length} kayıt. Kapsamı değiştirmek için alttaki zaman çizgisinden dönem seç.</span></p>
        <div class="pick">${Object.keys(GAMES).map(g => `
          <button class="pick-card" data-act="q-start" data-g="${g}" ${can[g] ? "" : "disabled"}>
            <span class="pi">${ic(GAMES[g].icon)}</span><b>${esc(GAMES[g].n)}</b><small>${esc(GAMES[g].d)}</small>
            <span class="best">${can[g] ? esc(best(g)) : "Bu seçimde yeterli kayıt yok"}</span>
          </button>`).join("")}
        </div>
        <p class="q-score">Her tur ${ROUND} sorudur.</p>
      </div>`, "quizpick", { full: true });
    $("#quizBtn").setAttribute("aria-pressed", "true");
  }

  function startGame(g) {
    const pool = quizPool();
    quiz.game = g; quiz.i = 0; quiz.score = 0; quiz.res = []; quiz.answered = false; quiz.hint = false;
    if (g === "yer") quiz.qs = shuffle(pool).slice(0, Math.min(ROUND, pool.length));
    else {
      const out = [], used = new Set();
      let guard = 0;
      while (out.length < ROUND && guard++ < 800) {
        const a = pick(pool), b = pick(pool);
        if (a.id === b.id || a.y === b.y) continue;
        const key = Math.min(a.id, b.id) + "-" + Math.max(a.id, b.id);
        if (used.has(key)) continue;
        used.add(key); out.push([a, b]);
      }
      quiz.qs = out;
    }
    if (!quiz.qs.length) return;
    quiz.on = true;
    hakStop(); hakInteractive();
    document.body.classList.add("quiz");
    $("#quizBtn").setAttribute("aria-pressed", "true");
    if (map.hasLayer(cluster)) map.removeLayer(cluster);
    syncRoutes();
    closeDrawer();
    showQ();
  }

  function stopQuiz(silent) {
    quiz.on = false;
    hakInteractive();
    document.body.classList.remove("quiz");
    $("#quizBtn").setAttribute("aria-pressed", "false");
    quizLayer.clearLayers();
    if (!map.hasLayer(cluster)) map.addLayer(cluster);
    render();
    if (!silent && (state.sheet === "quiz" || state.sheet === "quizpick")) closeSheet();
  }

  const dotsHtml = () => `<span class="dots" aria-hidden="true">${quiz.qs.map((_, i) => {
    const r = quiz.res[i];
    let c = i === quiz.i && !quiz.answered ? "cur" : "";
    if (r) c = quiz.game === "yer" ? (r.pts >= 70 ? "good" : r.pts >= 30 ? "mid" : "bad") : (r.ok ? "good" : "bad");
    return `<i class="${c}"></i>`;
  }).join("")}</span>`;
  const qHead = () => `
    <header class="band accent">
      <span class="band-era">${esc(GAMES[quiz.game].n)}</span>
      <span class="band-kind tnum">Soru ${quiz.i + 1} / ${quiz.qs.length}</span>
      <button class="ibtn" data-act="close" aria-label="Sınavı bitir (Esc)">${ic("x")}</button>
    </header>`;
  const qMeta = () => `<div class="q-meta">${dotsHtml()}<span class="tnum">Puan: ${fmt(quiz.score)}</span></div>`;

  function firstSentence(s) {
    const re = /([.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9'"(])/g;
    let m;
    while ((m = re.exec(s))) {
      const w = s.slice(0, m.index).split(/\s+/).pop();
      if (/^(?:[IVXLC]+|\d{1,2}|St|Dr|MÖ|MS)$/.test(w)) continue; // Roma rakamı / sıra sayısı ("9. Ordu")
      if (m.index + 1 < 40) continue; // çok kısa ilk cümleye bir sonrakini ekle
      return s.slice(0, m.index + 1);
    }
    return s;
  }

  function showQ() {
    quizLayer.clearLayers();
    quiz.answered = false; quiz.hint = false;
    if (quiz.game === "yer") {
      const e = quiz.qs[quiz.i];
      openSheet(`${qHead()}<div class="sh-in">${qMeta()}
        <span class="chipe ec-${e.p}"><i></i>${esc(DONEMLER[e.p].n)}</span>
        <h2 class="title">${esc(e.t)}</h2>
        <div class="when"><span class="date">${ic("cal")}${esc(e.d)}</span></div>
        <p class="q-instr">${ic("pin")}<span>Haritada nerede olduğunu düşünüyorsan oraya tıkla.</span></p>
        <div id="qHintBox"></div>
        <div class="acts">
          <button class="btn" data-act="q-hint">${ic("bulb")}İpucu (−20 puan)</button>
          <button class="btn" data-act="q-skip">Atla</button>
        </div>
        <p class="q-score">Her soru en fazla 100 puan · 300 km'den uzak tahmin 0 puan.</p>
      </div>`, "quiz");
      fitTo(TR_BOUNDS, 7);
    } else {
      const [a, b] = quiz.qs[quiz.i];
      openSheet(`${qHead()}<div class="sh-in">${qMeta()}
        <h2 class="title">Hangisi daha eski?</h2>
        <div class="duo">
          ${duoCard(a, 0)}<div class="vs">ya da</div>${duoCard(b, 1)}
        </div>
      </div>`, "quiz", { full: true });
    }
  }
  const duoCard = (e, i) => `<button class="pick-card" data-act="q-pick" data-i="${i}"><b>${esc(e.t)}</b><small>${esc(e.il)}</small><span class="reveal" hidden></span></button>`;

  function quizAction(act, el) {
    if (act === "q-start") startGame(el.dataset.g);
    else if (act === "q-hint" && !quiz.answered && !quiz.hint) {
      quiz.hint = true;
      const e = quiz.qs[quiz.i];
      $("#qHintBox").innerHTML = `<p><span class="q-hint">${ic("bulb")}İl: ${esc(e.il.split(",")[0])}</span></p>`;
      el.disabled = true;
    }
    else if (act === "q-skip" && !quiz.answered) {
      quiz.res[quiz.i] = { e: quiz.qs[quiz.i], pts: 0, d: null, skipped: true };
      nextQ();
    }
    else if (act === "q-pick" && !quiz.answered) answerEski(+el.dataset.i);
    else if (act === "q-next") nextQ();
    else if (act === "q-again") startGame(quiz.game);
    else if (act === "q-menu") { stopQuiz(true); openQuizPicker(); }
    else if (act === "q-open") { const e = DATA[+el.dataset.id]; stopQuiz(true); select(e, { fly: true }); }
  }
  function nextQ() {
    if (quiz.i + 1 >= quiz.qs.length) { scorecard(); return; }
    quiz.i++; showQ();
  }
  const nextBtn = () => quiz.i + 1 >= quiz.qs.length
    ? `<button class="btn primary" data-act="q-next">Sonucu gör${ic("next")}</button>`
    : `<button class="btn primary" data-act="q-next">Sonraki soru${ic("next")}</button>`;

  map.on("click", ev => {
    if (!quiz.on || quiz.game !== "yer" || quiz.answered) return;
    const e = quiz.qs[quiz.i];
    quiz.answered = true;
    const d = map.distance(ev.latlng, [e.lat, e.lng]) / 1000;
    const pts = Math.max(0, Math.round(100 - d / 3) - (quiz.hint ? 20 : 0));
    quiz.score += pts;
    quiz.res[quiz.i] = { e, pts, d };
    L.polyline([ev.latlng, [e.lat, e.lng]], { className: "q-line", interactive: false }).addTo(quizLayer);
    L.circleMarker(ev.latlng, { radius: 6, className: "q-guess", interactive: false }).addTo(quizLayer);
    L.marker([e.lat, e.lng], { icon: mkIcon(e, true), interactive: false, keyboard: false }).addTo(quizLayer);
    const msg = d < 25 ? "Tam isabet!" : d < 100 ? "Çok yakın!" : d < 250 ? "Fena değil." : "Biraz uzak kaldı.";
    openSheet(`${qHead()}<div class="sh-in">${qMeta()}
      <span class="chipe ec-${e.p}"><i></i>${esc(DONEMLER[e.p].n)}</span>
      <h2 class="title">${esc(e.t)}</h2>
      <div class="q-res"><b>${msg}</b><span>${fmtKm(d)} km uzaktaydın · +${pts} puan${quiz.hint ? " (ipucu −20)" : ""}</span></div>
      <p class="q-take">${esc(firstSentence(e.s))}</p>
      <ul class="facts"><li>${ic("pin")}<span><small>Konum</small>${esc(e.il)}</span></li><li>${ic("cal")}<span><small>Tarih</small>${esc(e.d)}</span></li></ul>
      <div class="acts">${nextBtn()}</div>
    </div>`, "quiz");
    fitTo(L.latLngBounds([ev.latlng, [e.lat, e.lng]]).pad(0.5), 8);
  });

  function answerEski(i) {
    const pair = quiz.qs[quiz.i];
    const older = pair[0].y < pair[1].y ? 0 : 1;
    const ok = i === older;
    quiz.answered = true;
    if (ok) quiz.score += 10;
    quiz.res[quiz.i] = { pair, ok, chosen: i };
    $$(".duo .pick-card", sheetBody).forEach((c, k) => {
      c.disabled = true;
      const r = $(".reveal", c); r.hidden = false;
      r.innerHTML = `${esc(pair[k].d)} · <span class="tnum" style="font-weight:500;color:var(--muted)">${esc(agoText(pair[k].y))}</span>${k === older ? ` <span class="tag">${ic("check")}daha eski</span>` : ""}`;
      if (k === i) c.classList.add(ok ? "right" : "wrong");
      else if (k === older) c.classList.add("right");
    });
    $(".q-meta", sheetBody).outerHTML = qMeta();
    const box = document.createElement("div");
    box.innerHTML = `<div class="q-res"><b>${ok ? "Doğru!" : "Yanlış."}</b><span>${ok ? "+10 puan" : `Daha eski olan: ${esc(pair[older].t)}`}</span></div><div class="acts">${nextBtn()}</div>`;
    $(".sh-in", sheetBody).appendChild(box);
    pair.forEach(e => L.marker([e.lat, e.lng], { icon: mkIcon(e, false), interactive: false, keyboard: false }).addTo(quizLayer));
    fitTo(L.latLngBounds(pair.map(e => [e.lat, e.lng])).pad(0.4), 8);
  }

  function scorecard() {
    quizLayer.clearLayers();
    const g = quiz.game, max = GAMES[g].max * quiz.qs.length, pct = max ? quiz.score / max : 0;
    const prevBest = store.get("best." + g, null);
    const rec = prevBest === null || quiz.score > prevBest;
    if (rec) store.set("best." + g, quiz.score);
    const verdict = pct >= 0.9 ? "Harika! Anadolu'yu avucunun içi gibi biliyorsun."
      : pct >= 0.7 ? "Çok iyi; birkaç küçük kaçırma dışında tam isabet."
      : pct >= 0.4 ? "Fena değil; birkaç konuyu yeniden okumaya değer."
      : "İyi bir başlangıç. Kayıtları gezip yeniden dene.";
    const rows = quiz.qs.map((q, i) => {
      const r = quiz.res[i] || {};
      if (g === "yer") {
        const good = (r.pts || 0) >= 50;
        return `<li><span class="${good ? "ok" : "no"}">${ic(good ? "check" : "x")}</span><span>${esc(q.t)}<small>${r.skipped ? "Atlandı · 0 puan" : `${fmtKm(r.d)} km · ${r.pts} puan`}</small></span><button class="lnk" data-act="q-open" data-id="${q.id}">konuyu aç</button></li>`;
      }
      const older = q[0].y < q[1].y ? q[0] : q[1];
      return `<li><span class="${r.ok ? "ok" : "no"}">${ic(r.ok ? "check" : "x")}</span><span>${esc(q[0].t)} / ${esc(q[1].t)}<small>Daha eski: ${esc(older.t)} · ${r.ok ? "doğru" : "yanlış"}</small></span><button class="lnk" data-act="q-open" data-id="${older.id}">konuyu aç</button></li>`;
    }).join("");
    openSheet(`
      <header class="band accent"><span class="band-era">${esc(GAMES[g].n)} · Sonuç</span>
        <button class="ibtn" data-act="close" aria-label="Kapat (Esc)" style="margin-left:auto">${ic("x")}</button></header>
      <div class="sh-in">
        <div class="big-score">${fmt(quiz.score)} <small>/ ${fmt(max)}</small></div>
        <p class="verdict">${verdict}</p>
        ${rec ? `<span class="record">${ic("award")}Yeni en iyi skor!</span>` : `<p class="q-score" style="margin-top:0">En iyi skorun: ${fmt(prevBest)}</p>`}
        <p class="q-score" style="margin:0 0 10px">Sorular: ${esc(poolLabel())}</p>
        <ul class="qlist">${rows}</ul>
        <div class="acts">
          <button class="btn primary" data-act="q-again">${ic("redo")}Tekrar oyna</button>
          <button class="btn" data-act="q-menu">Diğer oyun</button>
        </div>
      </div>`, "quiz", { full: true });
  }
  $("#quizBtn").onclick = () => {
    if (quiz.on) { stopQuiz(); return; }
    if (state.sheet === "quizpick") { closeSheet(); return; }
    toggleLayersPop(false);
    openQuizPicker();
  };

  // =====================================================================
  //  Hâkimiyet haritası: dönem dönem kim nereye hükmetti (data/sinirlar.js)
  // =====================================================================
  const SN = (typeof window.SINIRLAR === "object" && window.SINIRLAR && Array.isArray(window.SINIRLAR.anliklar)) ? window.SINIRLAR : { anliklar: [] };
  const SNAP = SN.anliklar;
  const HAS_HAK = SNAP.length > 0;
  // Dönemlerin sayısal aralıkları (DONEMLER.r metinleriyle aynı)
  const ERA_YIL = { paleo: [-1300000, -10000], neo: [-10000, -5500], tunc: [-5500, -1950], hitit: [-1950, -1180], demir: [-1180, -550],
    hel: [-550, -30], roma: [-30, 330], biz: [330, 1461], sel: [1071, 1450], osm: [1299, 1918], kurt: [1919, 1923], cum: [1923, NOW] };
  // Sakin, kartografik tonlar (dönem renklerinden daha az doygun; işaretler öne çıksın)
  const HAK_RENK = ["#b5895a", "#7f9a6b", "#6f8fae", "#b46f6a", "#8c7aa8", "#c2a24e", "#5f9c96", "#a77f9b", "#8e9b58", "#c48a63", "#6b7fa3", "#9a6b55", "#7aa58a", "#a99272"];
  const hak = { on: false, i: -1, cur: -1, playing: false, timer: null, built: {}, hi: null };
  {
    const si = store.get("hakI", 0) | 0;
    hak.i = HAS_HAK ? Math.min(SNAP.length - 1, Math.max(0, si)) : -1;
  }
  const mixHex = (a, b, t) => {
    const A = [1, 3, 5].map(k => parseInt(a.substr(k, 2), 16)), B = [1, 3, 5].map(k => parseInt(b.substr(k, 2), 16));
    return "#" + A.map((v, k) => Math.round(v + (B[k] - v) * t).toString(16).padStart(2, "0")).join("");
  };
  const hakCol = c => { const h = HAK_RENK[c % HAK_RENK.length]; return isDark() ? mixHex(h, "#ffffff", 0.12) : h; };
  const hakStyle = (p, hi) => {
    const c = hakCol(p.c), dk = isDark();
    return { color: mixHex(c, "#000000", dk ? 0.18 : 0.3), weight: hi ? 2.4 : 1.25, opacity: hi ? 1 : 0.85,
      fillColor: c, fillOpacity: (dk ? 0.34 : 0.28) + (p._sem ? 0.07 : 0) + (hi ? 0.14 : 0), lineJoin: "round" };
  };
  function decode(p) {
    if (!p._ll) p._ll = p.g.map(poly => poly.map(r => { const o = []; for (let k = 0; k < r.length; k += 2) o.push([r[k] / 100, r[k + 1] / 100]); return o; }));
    return p._ll;
  }
  const inRing = (x, y, R) => {   // R: [[lat,lng]…], x=lng, y=lat
    let c = false;
    for (let i = 0, j = R.length - 1; i < R.length; j = i++) {
      const yi = R[i][0], xi = R[i][1], yj = R[j][0], xj = R[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const inPolity = (p, e) => decode(p).some(poly => inRing(e.lng, e.lat, poly[0]) && !poly.slice(1).some(h => inRing(e.lng, e.lat, h)));

  // Bir kayda karşılık gelen anlık: kaydın tarihinde ya da öncesindeki son anlık;
  // o anlık kaydın döneminden önceyse dönemin içindeki ilk anlık. Tarih öncesi: yok (-1).
  function snapForYear(y, p) {
    if (!HAS_HAK) return -1;
    const E = ERA_YIL[p];
    if (E && E[1] < SNAP[0].y) return -1;
    let k = -1;
    SNAP.forEach((s, i) => { if (s.y <= y) k = i; });
    if (E && (k < 0 || SNAP[k].y < E[0])) {
      const j = SNAP.findIndex(s => s.y >= E[0] && s.y <= E[1]);
      if (j >= 0) return j;
    }
    return Math.max(0, k);
  }
  // Bir döneme karşılık gelen anlık: dönemin ortasına en yakın (önce dönemin içindekiler)
  function snapForEra(p) {
    const E = ERA_YIL[p];
    if (!HAS_HAK || !E || E[1] < SNAP[0].y) return -1;
    const mid = (E[0] + E[1]) / 2;
    let c = SNAP.map((_, i) => i).filter(i => SNAP[i].y >= E[0] && SNAP[i].y <= E[1]);
    if (!c.length) c = SNAP.map((_, i) => i);
    return c.reduce((a, b) => (Math.abs(SNAP[b].y - mid) < Math.abs(SNAP[a].y - mid) ? b : a));
  }

  // ---------- Katmanlar ----------
  // Tek doğruluk kaynağı: hak.i (seçili anlık) -> hak.cur (ekrandaki anlık, kapalıyken -1).
  // En çok iki anlık canlı tutulur: ekrandaki + sönmekte olan. Gerisi bölmesi ve tuvaliyle
  // birlikte yok edilir; yeniden gelindiğinde baştan kurulur.
  const HOVER = matchMedia("(hover: hover)");
  const FADE_MS = 560;
  let hakFading = null;      // { b, t } sönmekte olan anlık
  function hakBuild(i) {
    if (hak.built[i]) return hak.built[i];
    const s = SNAP[i];
    const pn = "hak" + i, ln = "hakL" + i;
    const pane = map.createPane(pn), lpane = map.createPane(ln);
    pane.style.zIndex = 350; lpane.style.zIndex = 352;
    [pane, lpane].forEach(x => { x.classList.add("hak-pane"); x.style.opacity = 0; });
    lpane.style.pointerEvents = "none";
    if (s.sematik) pane.classList.add("sem");
    const rend = L.canvas({ pane: pn, padding: 0.5, tolerance: 0 });
    const group = L.layerGroup(), labels = L.layerGroup();
    const polys = s.p.map(p => {
      p._sem = !!s.sematik;
      const pl = L.polygon(decode(p), { renderer: rend, pane: pn, interactive: !quiz.on, bubblingMouseEvents: false, ...hakStyle(p) });
      pl._hp = p;
      if (HOVER.matches) pl.bindTooltip(`<b>${esc(p.ad)}</b><span>${esc(s.ad)}${s.sematik ? " · şematik" : ""}</span>`, { sticky: true, direction: "top", offset: [0, -10], className: "hak-tip", opacity: 1 });
      pl.on("mouseover", () => { if (!quiz.on) pl.setStyle(hakStyle(p, true)); });
      pl.on("mouseout", () => { if (hak.hi !== pl) pl.setStyle(hakStyle(p, false)); });
      pl.on("click", () => { if (!quiz.on) hakCard(i, p, pl); });
      group.addLayer(pl);
      return pl;
    });
    return (hak.built[i] = { i, s, pn, ln, pane, lpane, rend, group, labels, polys });
  }
  function hakDestroy(b) {
    if (!b || hak.built[b.i] !== b) return;
    if (hak.hi && b.polys.includes(hak.hi)) hak.hi = null;
    map.removeLayer(b.group); map.removeLayer(b.labels);
    if (map.hasLayer(b.rend)) map.removeLayer(b.rend);   // tuval DOM'dan çıkar, bellek serbest kalır
    b.pane.remove(); b.lpane.remove();
    delete map._panes[b.pn]; delete map._panes[b.ln];
    delete hak.built[b.i];
  }
  const paneOp = (b, v) => { b.pane.style.opacity = v; b.lpane.style.opacity = v; };
  // En son istek kazanır: süren her geçişi iptal et, hedef anlığı hemen görünür yap.
  function hakDraw() {
    const want = hak.on ? hak.i : -1;
    if (want !== hak.cur) {
      const prev = hak.cur >= 0 ? hak.built[hak.cur] : null;
      // önceki sönme yarıda kesilir: o anlık hemen yok edilir
      if (hakFading) { clearTimeout(hakFading.t); if (hakFading.b !== prev && hakFading.b.i !== want) hakDestroy(hakFading.b); hakFading = null; }
      hak.cur = want;
      // ekrandaki ve (varsa) sönecek olan dışında her şeyi kaldır
      Object.values(hak.built).forEach(b => { if (b.i !== want && b !== prev) hakDestroy(b); });
      const anim = !RM.matches && !document.hidden;
      if (prev && prev.i !== want) {
        if (anim) {
          paneOp(prev, 0);
          const f = { b: prev, t: setTimeout(() => { if (hakFading === f) hakFading = null; if (hak.cur !== prev.i) hakDestroy(prev); }, FADE_MS) };
          hakFading = f;
        } else hakDestroy(prev);
      }
      if (want >= 0) {
        const b = hakBuild(want);
        if (!map.hasLayer(b.group)) b.group.addTo(map);
        if (!map.hasLayer(b.labels)) b.labels.addTo(map);
        hakLabels(b);
        if (anim && b.pane.style.opacity !== "1") {
          paneOp(b, 0);
          void b.pane.offsetWidth;   // geçişin 0'dan başlaması için yeniden akış
        }
        paneOp(b, 1);              // bitiş durumu eşzamanlı yazılır; rAF'a bağlı değil
      }
      if (state.sheet === "hak") closeSheet();
    }
    syncScrub();
  }
  function hakSet(i, o = {}) {
    if (!HAS_HAK) return;
    if (o.user) hakStop();
    if (i !== hak.i) {
      hak.i = i;
      if (i >= 0) store.set("hakI", i);
    }
    hakDraw();
  }
  // Uçuş/sürükleme sırasında tuvali yeniden çiz (kırpılmış dikdörtgen kalmasın)
  {
    let last = 0, tm = null;
    const redraw = () => {
      last = performance.now(); tm = null;
      [hak.cur >= 0 ? hak.built[hak.cur] : null, hakFading && hakFading.b].forEach(b => {
        if (b && map.hasLayer(b.rend) && b.rend._map) b.rend._reset();
      });
    };
    map.on("zoom move", () => {
      if (hak.cur < 0) return;
      const dt = performance.now() - last;
      if (dt >= 90) redraw();
      else if (!tm) tm = setTimeout(redraw, 90 - dt);
    });
  }
  // Öz-sınama (konsoldan: __hakSelfTest()) — rastgele hızlı adımlar, ardından tutarlılık
  window.__hakSelfTest = (n = 30) => {
    if (!HAS_HAK) return { ok: false, why: "veri yok" };
    if (!hak.on) setHak(true, { keep: true });
    for (let k = 0; k < n; k++) hakSet(Math.floor(Math.random() * SNAP.length), { user: true });
    const panes = [...document.querySelectorAll(".leaflet-pane.hak-pane")].filter(p => !p.className.includes("hakL"));
    const vis = panes.filter(p => p.style.opacity === "1");
    const i = hak.i;
    const probe = document.createElement("i"); probe.style.left = sPos(i);   // tarayıcının normalleştirdiği biçimle karşılaştır
    const thumbOk = $("#sThumb").style.left === probe.style.left;
    const labelOk = $("#sYr").textContent.startsWith(SNAP[i].ad);
    const paneOk = vis.length === 1 && vis[0].classList.contains("leaflet-hak" + i + "-pane");
    const r = { ok: thumbOk && labelOk && paneOk && panes.length <= 2, i, label: $("#sYr").textContent, visible: vis.length, panes: panes.length, thumbOk, labelOk, paneOk };
    console.log("hakSelfTest", r);
    return r;
  };
  function hakHi(pl) {
    if (hak.hi && hak.hi !== pl) hak.hi.setStyle(hakStyle(hak.hi._hp, false));
    hak.hi = pl;
    if (pl) pl.setStyle(hakStyle(pl._hp, true));
  }
  function hakRestyle() {
    Object.values(hak.built).forEach(b => b.polys.forEach(pl => pl.setStyle(hakStyle(pl._hp, pl === hak.hi))));
    if (hak.cur >= 0) hakLabels(hak.built[hak.cur]);
  }
  function hakInteractive() {
    Object.values(hak.built).forEach(b => b.polys.forEach(pl => { pl.options.interactive = !quiz.on; if (quiz.on) pl.closeTooltip(); }));
  }

  // ---------- Ad etiketleri: her alanın görünür kısmının görsel merkezine ----------
  const ringArea = P => { let a = 0; for (let i = 0, j = P.length - 1; i < P.length; j = i++) a += (P[j][0] + P[i][0]) * (P[j][1] - P[i][1]); return a / 2; };
  function clipRect(P, r) {   // Sutherland–Hodgman, ekran koordinatlarında
    const edges = [[p => p[0] >= r[0], (a, b) => { const t = (r[0] - a[0]) / (b[0] - a[0]); return [r[0], a[1] + t * (b[1] - a[1])]; }],
      [p => p[0] <= r[2], (a, b) => { const t = (r[2] - a[0]) / (b[0] - a[0]); return [r[2], a[1] + t * (b[1] - a[1])]; }],
      [p => p[1] >= r[1], (a, b) => { const t = (r[1] - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), r[1]]; }],
      [p => p[1] <= r[3], (a, b) => { const t = (r[3] - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), r[3]]; }]];
    let out = P;
    for (const [inside, cut] of edges) {
      const inp = out; out = [];
      if (!inp.length) break;
      for (let i = 0; i < inp.length; i++) {
        const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
        if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b); }
        else if (inside(a)) out.push(cut(a, b));
      }
    }
    return out;
  }
  const inPts = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; } return c; };
  function edgeDist(x, y, P) {
    let m = Infinity;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const ax = P[j][0], ay = P[j][1], bx = P[i][0], by = P[i][1], dx = bx - ax, dy = by - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
      const ex = ax + t * dx - x, ey = (ay + t * dy - y) * 1.8;   // dikey mesafe daha değerli: yazı yatay
      m = Math.min(m, ex * ex + ey * ey);
    }
    return Math.sqrt(m);
  }
  function labelPoint(P) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    P.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    let best = null, cw = (x1 - x0) / 10, ch = (y1 - y0) / 10;
    const test = (x, y) => { if (!inPts(x, y, P)) return; const d = edgeDist(x, y, P); if (!best || d > best.d) best = { x, y, d }; };
    for (let gx = 0; gx < 10; gx++) for (let gy = 0; gy < 10; gy++) test(x0 + (gx + 0.5) * cw, y0 + (gy + 0.5) * ch);
    for (let r = 0; r < 2 && best; r++) {
      cw /= 2.5; ch /= 2.5;
      const bx = best.x, by = best.y;
      for (let gx = -2; gx <= 2; gx++) for (let gy = -2; gy <= 2; gy++) test(bx + gx * cw, by + gy * ch);
    }
    return best;
  }
  function hakLabels(b) {
    if (!b) return;
    b.labels.clearLayers();
    const sz = map.getSize(), I = insets();
    const R = [I.l + 6, I.t + 6, sz.x - I.r - 6, sz.y - I.b - 6];
    if (R[2] - R[0] < 80 || R[3] - R[1] < 60) return;
    b.s.p.forEach(p => {
      let best = null;
      decode(p).forEach(poly => {
        const pts = poly[0].map(q => { const c = map.latLngToContainerPoint(q); return [c.x, c.y]; });
        const cl = clipRect(pts, R);
        if (cl.length < 3) return;
        const a = Math.abs(ringArea(cl));
        if (!best || a > best.a) best = { a, P: cl };
      });
      if (!best || best.a < 3200) return;
      const lp = labelPoint(best.P);
      if (!lp || lp.d < 9) return;
      const side = Math.sqrt(best.a);
      let fs = Math.max(9.5, Math.min(15, side / 15));
      let lines = [p.ad];
      const wOf = (t, f) => t.length * f * 0.86;
      if (wOf(p.ad, fs) > side * 1.5 && p.ad.includes(" ")) {
        const w = p.ad.split(" ");
        let k = 1, bestDiff = Infinity;
        for (let j = 1; j < w.length; j++) { const d = Math.abs(w.slice(0, j).join(" ").length - w.slice(j).join(" ").length); if (d < bestDiff) { bestDiff = d; k = j; } }
        lines = [w.slice(0, k).join(" "), w.slice(k).join(" ")];
      }
      const maxW = Math.max(...lines.map(t => wOf(t, fs)));
      if (maxW > side * 1.9) { fs = Math.max(9, fs * side * 1.9 / maxW); if (Math.max(...lines.map(t => wOf(t, fs))) > side * 2.3) return; }
      if (lp.d < fs * 0.9 * lines.length) return;
      const html = `<span class="hak-lbl${b.s.sematik ? " sem" : ""}" style="--fs:${fs.toFixed(1)}px;--hc:${hakCol(p.c)}">${lines.map(esc).join("<br>")}</span>`;
      L.marker(map.containerPointToLatLng([lp.x, lp.y]), { icon: L.divIcon({ className: "lbl-icon", html, iconSize: [0, 0] }), interactive: false, keyboard: false, pane: "hakL" + b.i }).addTo(b.labels);
    });
  }
  let hakLT = null;
  map.on("moveend zoomend resize", () => { clearTimeout(hakLT); hakLT = setTimeout(() => { if (hak.cur >= 0) hakLabels(hak.built[hak.cur]); }, 60); });

  // ---------- Siyasi alan kartı ----------
  function hakCard(i, p, pl) {
    const s = SNAP[i];
    const recs = SORTED.filter(e => snapForYear(e.y, e.p) === i && inPolity(p, e));
    if (tour.on) pauseTour();
    openSheet(`
      <header class="band" style="--c:${hakCol(p.c)}">
        <span class="band-era">Hâkimiyet · ${esc(s.ad)}</span>
        <button class="ibtn" data-act="close" aria-label="Kapat (Esc)" style="margin-left:auto">${ic("x")}</button>
      </header>
      <div class="sh-in">
        <h2 class="title">${esc(p.ad)}${s.sematik ? '<span class="sem-tag">şematik</span>' : ""}</h2>
        <div class="when"><span class="date">${ic("cal")}${esc(s.ad)} dolaylarında</span></div>
        ${p.not ? `<p class="body">${esc(p.not)}</p>` : ""}
        ${s.not ? `<p class="hak-note">${ic("info")}<span>${esc(s.not)}</span></p>` : ""}
        <h4 class="sub">Bu dönemde bu alandaki kayıtlar</h4>
        ${recs.length ? `<ul class="erl">${recs.map(e => `<li><button class="ec-${e.p}" data-id="${e.id}">${thHtml(e)}<b>${esc(e.t)}</b><small>${esc(e.d)}</small></button></li>`).join("")}</ul>`
          : `<p class="hak-empty">Bu anlığa düşen kayıt yok.</p>`}
        <p class="hak-note" style="margin-top:14px">${ic("map")}<span>Sınırlar yaklaşıktır · ${s.sematik ? "elle çizilmiş şematik etki alanı" : "historical-basemaps (André Ourednik, GPL-3.0)"}</span></p>
      </div>`, "hak");
    hakHi(pl);
  }

  // ---------- Yıl kaydırıcısı ----------
  const scrubEl = $("#scrub");
  const sPos = i => `calc(22px + (100% - 44px) * ${(SNAP.length > 1 ? i / (SNAP.length - 1) : 0).toFixed(4)})`;
  if (HAS_HAK) {
    scrubEl.innerHTML = `
      <button class="ibtn sc-pn" id="sPrev" aria-label="Önceki anlık">${ic("prev")}</button>
      <button class="ibtn play" id="sPlay" aria-label="Oynat"></button>
      <button class="ibtn sc-pn" id="sNext" aria-label="Sonraki anlık">${ic("next")}</button>
      <span class="sc-yr" id="sYr" aria-hidden="true"></span>
      <div class="sc-track" id="sTrack" role="slider" tabindex="0" aria-label="Hâkimiyet haritası yılı" aria-valuemin="0" aria-valuemax="${SNAP.length - 1}">
        <div class="sc-line"><div class="sc-fill" id="sFill"></div></div>
        ${SNAP.map((s, i) => `<i class="sc-stop${s.sematik ? " sem" : ""}" style="left:${sPos(i)}"></i><span class="sc-lbl ${i === 0 ? "first" : i === SNAP.length - 1 ? "last" : "mid"}" style="left:${sPos(i)}">${esc(s.ad)}</span>`).join("")}
        <i class="sc-thumb" id="sThumb"></i>
        <span class="sc-empty">Bu çağda devletler yok; yerleşmeler ve kültür bölgeleri var.</span>
      </div>
      <button class="sc-note" id="sNote" aria-expanded="false" aria-controls="hakPop" title="Bu harita nasıl okunmalı?">${ic("info")}<span class="t">Sınırlar yaklaşıktır</span></button>`;
  }
  function syncScrub() {
    if (!HAS_HAK) return;
    scrubEl.hidden = !hak.on;
    if (!hak.on) return;
    const tr = $("#sTrack"), i = hak.i, n = SNAP.length;
    tr.classList.toggle("none", i < 0);
    if (i >= 0) { $("#sThumb").style.left = sPos(i); $("#sFill").style.width = (n > 1 ? i / (n - 1) * 100 : 0) + "%"; }
    $$(".sc-stop", tr).forEach((x, k) => x.classList.toggle("past", i >= 0 && k <= i));
    $$(".sc-lbl", tr).forEach((x, k) => x.classList.toggle("cur", k === i));
    $("#sYr").innerHTML = i >= 0 ? `${esc(SNAP[i].ad)}${SNAP[i].sematik ? "<small>şematik</small>" : ""}` : "—";
    tr.setAttribute("aria-valuenow", String(Math.max(0, i)));
    tr.setAttribute("aria-valuetext", i >= 0 ? SNAP[i].ad + (SNAP[i].sematik ? " (şematik)" : "") : "Bu çağda devlet yok");
    const pb = $("#sPlay");
    pb.innerHTML = ic(hak.playing ? "pause" : "play");
    pb.setAttribute("aria-label", hak.playing ? "Duraklat" : "Anlıkları sırayla oynat");
    $("#sPrev").disabled = i <= 0;
    $("#sNext").disabled = i >= n - 1;
    tr.classList.toggle("wide", (tr.clientWidth - 44) / Math.max(1, n - 1) >= 50);
  }
  function hakStop() {
    if (!hak.playing) return;
    hak.playing = false; clearTimeout(hak.timer); syncScrub();
  }
  function hakPlay() {
    if (hak.playing) { hakStop(); return; }
    if (hak.i < 0 || hak.i >= SNAP.length - 1) hakSet(0);
    hak.playing = true; syncScrub();
    const tick = () => {
      if (!hak.playing) return;
      if (hak.i >= SNAP.length - 1) { hakStop(); return; }
      hakSet(hak.i + 1);
      hak.timer = setTimeout(tick, 1600);
    };
    hak.timer = setTimeout(tick, 1600);
  }
  if (HAS_HAK) {
    const tr = $("#sTrack");
    const idxAt = x => { const r = tr.getBoundingClientRect(); const t = (x - r.left - 22) / Math.max(1, r.width - 44); return Math.round(Math.min(1, Math.max(0, t)) * (SNAP.length - 1)); };
    let drag = null;
    tr.addEventListener("pointerdown", ev => {
      if (ev.button > 0) return;
      drag = ev.pointerId;
      try { tr.setPointerCapture(drag); } catch (_) { /* yoksay */ }
      tr.classList.add("drag");
      hakSet(idxAt(ev.clientX), { user: true });
    });
    tr.addEventListener("pointermove", ev => { if (drag === ev.pointerId) hakSet(idxAt(ev.clientX), { user: true }); });
    const up = ev => { if (drag !== ev.pointerId) return; drag = null; tr.classList.remove("drag"); };
    tr.addEventListener("pointerup", up);
    tr.addEventListener("pointercancel", up);
    tr.addEventListener("keydown", ev => {
      const n = SNAP.length, i = Math.max(0, hak.i);
      const k = { ArrowLeft: i - 1, ArrowDown: i - 1, ArrowRight: i + 1, ArrowUp: i + 1, Home: 0, End: n - 1, PageDown: i - 3, PageUp: i + 3 }[ev.key];
      if (k === undefined) return;
      ev.preventDefault(); ev.stopPropagation();
      hakSet(Math.min(n - 1, Math.max(0, k)), { user: true });
    });
    $("#sPrev").onclick = () => hakSet(Math.max(0, hak.i - 1), { user: true });
    $("#sNext").onclick = () => hakSet(Math.min(SNAP.length - 1, hak.i + 1), { user: true });
    $("#sPlay").onclick = hakPlay;
    if (window.ResizeObserver) new ResizeObserver(() => syncScrub()).observe(tr);
  }

  // ---------- "Sınırlar yaklaşıktır" bilgi kutusu ----------
  const hakPop = $("#hakPop");
  hakPop.innerHTML = `
    <h3 id="hakPopT">Sınırlar yaklaşıktır</h3>
    <p>Antik ve orta çağ devletlerinin çoğunun ölçülüp çizilmiş sınırları yoktu: merkezden uzaklaştıkça etkileri azalan <b>nüfuz bölgeleri</b>, vergi veren vasallar ve tartışmalı uç bölgeler vardı. Haritadaki alanlar bu yüzden kabaca bir resimdir; kaynaklar arasında farklılık gösterir.</p>
    <p><span class="sem-demo" aria-hidden="true"></span><b>Şematik</b> anlıklar (MÖ 1300, MÖ 550) veri setinin kapsamadığı dönemler için elle çizildi. Yumuşak kenarlı lekeler sınır değil, etki alanıdır.</p>
    <p>Kaynak: <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noopener">historical-basemaps</a> — André Ourednik, <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener">GPL-3.0</a>. Adlar Türkçeleştirildi; bazı anlıklar düzeltildi ya da çıkarıldı.</p>`;
  function toggleHakPop(open) {
    if (!HAS_HAK) return;
    const o = open === undefined ? hakPop.hidden : open;
    hakPop.hidden = !o;
    const b = $("#sNote");
    if (b) b.setAttribute("aria-expanded", String(o));
  }
  if (HAS_HAK) $("#sNote").onclick = ev => { ev.stopPropagation(); toggleHakPop(); };
  document.addEventListener("pointerdown", ev => {
    if (!hakPop.hidden && !hakPop.contains(ev.target) && !ev.target.closest("#sNote")) toggleHakPop(false);
  }, true);

  // ---------- Açma / kapama ----------
  function setHak(on, o = {}) {
    hak.on = !!on && HAS_HAK;
    if (!o.init) store.set("hak", hak.on);
    const b = $("#hakBtn");
    b.setAttribute("aria-pressed", String(hak.on));
    b.hidden = !HAS_HAK;
    if (!hak.on) {
      hakStop(); toggleHakPop(false);
      if (state.sheet === "hak") closeSheet();
    } else if (!o.keep) {
      if (state.sel) hak.i = snapForYear(state.sel.y, state.sel.p);
      else if (state.periods.size === 1) hak.i = snapForEra([...state.periods][0]);
    }
    hakDraw();
  }
  $("#hakBtn").onclick = () => { setHak(!hak.on); if (hak.on) toast("Hâkimiyet haritası: sınırlar yaklaşıktır"); };

  // =====================================================================
  //  Hoş geldin kartı
  // =====================================================================
  const welEl = $("#welcome");
  function hideWelcome(markSeen) { if (!welEl.hidden) { welEl.hidden = true; if (markSeen) store.set("welcomed", true); } }
  function welcomeDone() { hideWelcome(true); store.set("welcomed", true); }
  if (!store.get("welcomed", false)) {
    welEl.innerHTML = `
      <button class="ibtn" data-w="close" aria-label="Kapat">${ic("x")}</button>
      <h2 id="wTitle">Anadolu'da 12.000 yıllık bir gezinti</h2>
      <ul>
        <li>${ic("stack")}<span><b>Dönem seç.</b> Alttaki zaman çizgisinde bir döneme tıkla; harita o çağa odaklansın.</span></li>
        <li>${ic("pin")}<span><b>Kayda tıkla.</b> Haritadaki işaret, listedeki satır ya da çizgideki çentik ayrıntıyı açar.</span></li>
        <li>${ic("tour")}<span><b>Turu başlat.</b> Görünen kayıtları kronolojik sırayla, kendiliğinden gez.</span></li>
      </ul>
      <button class="btn primary" data-w="close">Başlayalım</button>`;
    welEl.hidden = false;
    welEl.addEventListener("click", ev => { if (ev.target.closest('[data-w="close"]')) welcomeDone(); });
  }

  // =====================================================================
  //  Klavye
  // =====================================================================
  document.addEventListener("keydown", ev => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName) || ev.target.isContentEditable;
    if (ev.key === "/" && !typing && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { ev.preventDefault(); focusSearch(); return; }
    if (ev.key === "Escape" && !layersEl.hidden) { ev.preventDefault(); toggleLayersPop(false); $("#layersBtn").focus(); return; }
    if (ev.key === "Escape" && !hakPop.hidden) { ev.preventDefault(); toggleHakPop(false); $("#sNote").focus(); return; }
    if (typing) return;
    if (ev.key === "Escape") {
      if (document.body.classList.contains("drawer")) closeDrawer();
      else if (quiz.on) stopQuiz();
      else if (tour.on) stopTour();
      else if (state.sheet) closeSheet();
      else if (!welEl.hidden) welcomeDone();
      return;
    }
    if ((ev.key === "ArrowRight" || ev.key === "ArrowLeft") && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
      if (map.getContainer().contains(document.activeElement) && document.activeElement === map.getContainer()) return; // Leaflet kaydırması
      ev.preventDefault();
      step(ev.key === "ArrowRight" ? 1 : -1);
    }
  });

  // =====================================================================
  //  Başlat
  // =====================================================================
  setSideCollapsed(!!prefs.sideCollapsed);
  hakReady = true;
  applyTheme();
  zoomClasses();
  render();
  // Paneller hesaba katılarak Türkiye'yi sığdır
  const initialFit = () => {
    const I = insets();
    map.fitBounds(TR_BOUNDS, { paddingTopLeft: [I.l, I.t], paddingBottomRight: [I.r, I.b], animate: false });
    zoomClasses();
  };
  initialFit();
  // Kullanıcı haritaya dokunana (ya da uygulama bir yere uçana) dek boyut değişiminde yeniden sığdır;
  // sonrasında görünüme dokunma, yalnız invalidateSize.
  {
    const mc = map.getContainer();
    const touched = () => { viewTouched = true; };
    ["pointerdown", "wheel", "keydown", "touchstart"].forEach(t => mc.addEventListener(t, touched, { passive: true }));
    let lastW = mc.clientWidth, lastH = mc.clientHeight, rt = null;
    const onSize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (mc.clientWidth === lastW && mc.clientHeight === lastH) return;
        lastW = mc.clientWidth; lastH = mc.clientHeight;
        map.invalidateSize({ pan: false });
        if (!viewTouched) initialFit();
      }, 120);
    };
    if (window.ResizeObserver) new ResizeObserver(onSize).observe(mc);
    window.addEventListener("resize", onSize);
    window.addEventListener("orientationchange", onSize);
  }
  const startRec = hashRec();
  setHak(store.get("hak", false), { init: true });
  if (startRec) setTimeout(() => select(startRec, { fly: true }), 60);
})();
