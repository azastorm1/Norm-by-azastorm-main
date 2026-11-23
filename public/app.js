(function () {
'use strict';
var I = window.I18N, CFG = null, lang = 'ru', score = 0, qi = 0;
try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
if (!I[lang]) { var nl = (navigator.language || 'ru').slice(0, 2); lang = I[nl] ? nl : 'ru'; }
var S = { st: [], item: 'tee', font: 'Manrope', tcolor: '', customHex: '', zip: false, cuff: false, refArt: '', color: '', kind: 'print', place: 'front', text: 'Norm', size: '', mode: 'text', photoArt: '', designId: '', designArt: '', designName: null, extra: 0, scale: 100, dx: 0, dy: 0 };
var $ = function (id) { return document.getElementById(id); };
var ITEMS = { tee: { ru: 'Футболка', uz: 'Futbolka', en: 'T-shirt' }, polo: { ru: 'Поло финка', uz: 'Polo finka', en: 'Polo finka' }, hoodie: { ru: 'Худи', uz: 'Hudi', en: 'Hoodie' }, cap: { ru: 'Кепка', uz: 'Kepka', en: 'Cap' }, joggers: { ru: 'Джоггеры', uz: 'Jogerlar', en: 'Joggers' } };
var FONTS = ['Manrope', 'Inter', 'Montserrat', 'Unbounded', 'Russo One', 'Bebas Neue', 'Oswald', 'Playfair Display', 'Cormorant Garamond', 'Righteous', 'Bowlby One', 'Rubik Mono One', 'Pacifico', 'Lobster', 'Marck Script', 'Caveat', 'Comfortaa', 'Mrs Saint Delafield'];
var UI = {
  ru: { hint: 'Выдели часть текста, чтобы поменять ей шрифт и цвет. Ничего не выделено — меняется весь текст.', color: 'Цвет', item: 'Вид одежды', zip: 'Молния', cuff: 'Манжет', custom: 'Свой цвет', font: 'Шрифт текста', tcol: 'Цвет текста', zipOn: 'С молнией', zipOff: 'Без молнии', cuffOn: 'С манжетом', cuffOff: 'Без манжета' },
  uz: { hint: 'Shrift va rangini o‘zgartirish uchun matnning bir qismini belgilang. Hech narsa belgilanmasa — butun matn o‘zgaradi.', color: 'Rang', item: 'Kiyim turi', zip: 'Zamok', cuff: 'Manjet', custom: 'O‘z rangi', font: 'Matn shrifti', tcol: 'Matn rangi', zipOn: 'Zamokli', zipOff: 'Zamoksiz', cuffOn: 'Manjetli', cuffOff: 'Manjetsiz' },
  en: { hint: 'Select part of the text to change its font and color. Nothing selected = whole text.', color: 'Color', item: 'Item', zip: 'Zip', cuff: 'Cuff', custom: 'Custom color', font: 'Text font', tcol: 'Text color', zipOn: 'With zip', zipOff: 'No zip', cuffOn: 'With cuff', cuffOff: 'No cuff' }
};
function U(k) { return (UI[lang] || UI.ru)[k]; }
function itemName() { return L(ITEMS[S.item]); }
function setLabels() {
  $('hColor').textContent = U('color'); $('hItem').textContent = U('item'); $('hZip').textContent = U('zip');
  $('hCuff').textContent = U('cuff'); $('hCustom').textContent = U('custom'); $('thint').textContent = U('hint'); $('tcol').title = U('tcol'); $('font').title = U('font');
}
$('font').innerHTML = FONTS.map(function (f) { return '<option value="' + f + '">' + f + '</option>'; }).join('');
function T(k) { return I[lang][k] != null ? I[lang][k] : I.ru[k]; }
function L(o) { return o ? (o[lang] || o.ru || '') : ''; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0' + T('currency'); }
function colorObj() {
  if (S.color === 'custom') return { id: 'custom', hex: S.customHex, ru: U('custom'), uz: U('custom'), en: U('custom') };
  return CFG.settings.colors.find(function (c) { return c.id === S.color; }) || CFG.settings.colors[0];
}
function total() {
  var p = CFG.settings.prices, t = (+p.base || 0) + ((S.kind === 'emb' ? +p.emb : +p.print) || 0);
  if (S.mode === 'photo' || S.mode === 'ref') t += +p.custom || 0;
  if (S.mode === 'design') t += +S.extra || 0;
  return t;
}
function priceText() { return (+CFG.settings.prices.base) ? fmt(total()) : T('price_na'); }

// ---------- язык ----------
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function (e) { e.textContent = T(e.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (e) { e.placeholder = T(e.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (e) { e.setAttribute('aria-label', T(e.dataset.i18nAria)); });
  document.querySelectorAll('#lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === lang); });
  $('curve').setAttribute('aria-label', T('curve_alt'));
  if (CFG) { buildCurve(); showQ(); renderGallery(); renderSite(); renderTimeline(); renderInfo(); renderContacts(); draw(); }
}
$('lang').addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b) return;
  lang = b.dataset.l; try { localStorage.setItem('lang', lang); } catch (x) {} applyLang();
});

// ---------- колокол ----------
var BASE = 232, SX = 108, SY = 190;
function px(x) { return 350 + x * SX; } function py(x) { return BASE - Math.exp(-x * x / 2) * SY; }
function buildCurve() {
  var d = 'M' + px(-3.2) + ' ' + py(-3.2);
  for (var x = -3.2; x <= 3.2; x += .1) d += ' L' + px(x).toFixed(1) + ' ' + py(x).toFixed(1);
  var s = '<path d="' + d + '" fill="none" stroke="#efede8" stroke-width="2" opacity=".85"/><line x1="20" x2="680" y1="' + BASE + '" y2="' + BASE + '" stroke="#efede8" opacity=".25"/>';
  var seed = 7; function r() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < 54; i++) { var xx = (r() + r() + r() - 1.5) * 2.1, top = py(xx), y = top + 8 + r() * (BASE - top - 14); s += '<circle cx="' + px(xx).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="#8d97b3" opacity=".7"/>'; }
  var yx = score / 6 * 2.7;
  s += '<g id="you" style="transform:translate(' + px(yx) + 'px,' + (py(yx) - 16) + 'px)"><circle r="8" fill="#c0344d"/><text y="-16" text-anchor="middle" font-family="Mrs Saint Delafield,cursive" font-size="30" fill="#c0344d">' + esc(T('you')) + '</text></g>';
  s += '<text x="350" y="248" text-anchor="middle" font-size="12" fill="#efede8" opacity=".5" font-family="Manrope,sans-serif">' + esc(T('norm')) + '</text>';
  $('curve').innerHTML = s;
}
function moveYou() { var x = score / 6 * 2.7; $('you').style.transform = 'translate(' + px(x) + 'px,' + (py(x) - 16) + 'px)'; }

// ---------- проверка на норму ----------
var quiz = $('quiz');
function showQ() {
  var Q = I[lang].quiz; if (qi >= Q.length) return showRes();
  var q = Q[qi];
  quiz.innerHTML = '<div class="step">' + esc(T('q_step').replace('{n}', qi + 1).replace('{m}', Q.length)) + '</div><h2>' + esc(q.q) + '</h2><div class="opts">' +
    q.a.map(function (a, i) { return '<button data-v="' + i + '">' + esc(a) + '</button>'; }).join('') + '</div>';
}
quiz.addEventListener('click', function (e) {
  var b = e.target.closest('.opts button'); if (!b) return;
  score += +b.dataset.v; qi++; moveYou(); showQ();
});
function showRes() {
  var i = score <= 1 ? 0 : (score <= 4 ? 1 : 2), r = I[lang].res[i];
  quiz.innerHTML = '<div class="result"><div class="step">' + esc(T('result_label')) + '</div><h2>' + esc(r.t) + '</h2><p>' + esc(r.p) + '</p><button class="btn" id="apply">' + esc(T('apply')) + '</button><button class="btn ghost" id="again">' + esc(T('again')) + '</button></div>';
  $('apply').onclick = function () {
    var cs = CFG.settings.colors, pick = [0, 1, 0][i]; S.color = cs[Math.min(pick, cs.length - 1)].id;
    S.kind = ['emb', 'print', 'print'][i]; S.place = ['front', 'front', 'back'][i]; S.mode = 'text'; S.text = r.text; S.st = []; $('txt').value = S.text; draw();
    $('builder').scrollIntoView();
  };
  $('again').onclick = function () { qi = 0; score = 0; moveYou(); showQ(); };
}

// ---------- конструктор ----------
function opts(k) {
  var s = CFG.settings;
  if (k === 'color') return s.colors.map(function (c) { return [c.id, L(c), c.hex]; });
  if (k === 'kind') return [['print', T('kind_print')], ['emb', T('kind_emb')]];
  if (k === 'place') return [['front', T('place_front')], ['back', T('place_back')]];
  if (k === 'size') return s.sizes.map(function (z) { return [z, z]; });
  if (k === 'item') return Object.keys(ITEMS).map(function (x) { return [x, L(ITEMS[x]), '']; });
  if (k === 'zip') return [['true', U('zipOn')], ['false', U('zipOff')]];
  if (k === 'cuff') return [['true', U('cuffOn')], ['false', U('cuffOff')]];
  if (k === 'mode') return [['text', T('art_text')], ['photo', T('art_photo')], ['ref', T('art_ref')]];
  return [];
}
function chips() {
  document.querySelectorAll('.chips').forEach(function (el) {
    var k = el.dataset.k;
    el.innerHTML = opts(k).map(function (o) {
      return '<button type="button" data-v="' + esc(o[0]) + '" aria-pressed="' + (String(S[k]) === o[0]) + '">' + (k === 'color' ? '<span class="sw" style="background:' + o[2] + '"></span>' : '') + esc(o[1]) + '</button>';
    }).join('');
  });
}
document.querySelector('.ctl').addEventListener('click', function (e) {
  var b = e.target.closest('.chips button'); if (!b) return;
  var v = b.dataset.v; S[b.parentNode.dataset.k] = v === 'true' ? true : v === 'false' ? false : v; draw();
});
function syncStyles(prev, next) {
  var p = 0; while (p < prev.length && p < next.length && prev[p] === next[p]) p++;
  var q = 0; while (q < prev.length - p && q < next.length - p && prev[prev.length - 1 - q] === next[next.length - 1 - q]) q++;
  var inherit = S.st[p - 1] || S.st[p] || null, mid = [];
  for (var i = 0; i < next.length - p - q; i++) mid.push(inherit ? { f: inherit.f, c: inherit.c } : null);
  S.st = S.st.slice(0, p).concat(mid, S.st.slice(prev.length - q));
}
var sel = [0, 0];
function remember() { var t = $('txt'); sel = [t.selectionStart || 0, t.selectionEnd || 0]; }
['select', 'keyup', 'mouseup', 'touchend', 'focus'].forEach(function (ev) { $('txt').addEventListener(ev, remember); });
function styleSel(key, val) {
  var a = sel[0], b = sel[1];
  if (a === b) { if (key === 'f') S.font = val; else S.tcolor = val; for (var i = 0; i < S.st.length; i++) if (S.st[i]) delete S.st[i][key]; }
  else for (var j = a; j < b; j++) { var o = S.st[j] || {}; o[key] = val; S.st[j] = o; }
  draw();
}
$('txt').addEventListener('input', function () { syncStyles(S.text || '', this.value); S.text = this.value; remember(); draw(); });
$('font').addEventListener('change', function () { styleSel('f', this.value); });
$('tcol').addEventListener('input', function () { styleSel('c', this.value); });
function runs() {
  var t = S.text || ' ', out = [], k = '';
  for (var i = 0; i < t.length; i++) {
    var o = S.st[i] || {}, f = o.f || '', c = o.c || '', key = f + '|' + c;
    if (out.length && key === k) out[out.length - 1].t += t[i]; else { out.push({ t: t[i], f: f, c: c }); k = key; }
  }
  return out;
}
function tspans(emb) {
  return runs().map(function (r) {
    var a = r.f ? ' font-family="' + esc(r.f) + '"' : '';
    if (r.c) a += emb ? ' fill="' + r.c + '" stroke="' + r.c + '"' : ' fill="' + r.c + '"';
    return a ? '<tspan' + a + '>' + esc(r.t) + '</tspan>' : esc(r.t);
  }).join('');
}
$('ccol').addEventListener('input', function () { S.customHex = this.value; S.color = 'custom'; draw(); });
[['sc', 'scale'], ['dx', 'dx'], ['dy', 'dy']].forEach(function (p) { $(p[0]).addEventListener('input', function () { S[p[1]] = +this.value; draw(); }); });
$('reset').addEventListener('click', function () { S.scale = 100; S.dx = 0; S.dy = 0; draw(); });
function lum(h) { var n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
function artEl(fs, t, attr) {
  var a = CFG.settings.printArea[S.place], x = a.x * 2, y = a.y * 2, w = a.w * 2, cx = x + w / 2, cy = y + w / 2, inner;
  if (S.mode === 'text') {
    inner = '<text x="' + cx + '" y="' + (cy + fs * .15) + '" text-anchor="middle" font-family="' + esc(S.font) + '" font-size="' + fs + '" ' + attr + ' xml:space="preserve">' + tspans(S.kind === 'emb') + '</text>';
  } else {
    var src = S.mode === 'photo' ? S.photoArt : S.mode === 'design' ? S.designArt : S.mode === 'ref' ? S.refArt : '';
    inner = src ? '<image href="' + src + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" preserveAspectRatio="xMidYMid meet"/>'
      : '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" fill="none" stroke="rgba(128,128,128,.8)" stroke-dasharray="3 3"/><text x="' + cx + '" y="' + (cy + 3) + '" text-anchor="middle" font-size="8" fill="rgba(128,128,128,.95)" font-family="Manrope,sans-serif">' + esc(S.mode === 'ref' ? T('mock_ref') : T('mock_art')) + '</text>';
  }
  var tr = 'translate(' + (cx + S.dx) + ' ' + (cy + S.dy) + ') scale(' + (S.scale / 100) + ') translate(' + (-cx) + ' ' + (-cy) + ')';
  return '<g filter="url(#bend)"><g transform="' + tr + '">' + inner + '</g></g>';
}
function garment(item, c) {
  var h = c.hex, sh = 'fill="#000" fill-opacity=".2"', sd = 'stroke="#000" stroke-opacity=".28" stroke-width=".8" fill="none"', g = '';
  if (item === 'polo') {
    g = '<path d="M70 20 L40 32 L12 66 L38 86 L52 74 L52 182 L148 182 L148 74 L162 86 L188 66 L160 32 L130 20 Q100 40 70 20Z" fill="' + h + '"/>' +
      '<path d="M80 22 Q100 44 120 22" ' + sd + ' stroke-width="3"/><path d="M100 44 L100 76" ' + sd + ' stroke-width="2.2"/>' +
      '<circle cx="100" cy="54" r="1.6" ' + sh + '/><circle cx="100" cy="66" r="1.6" ' + sh + '/>';
  } else if (item === 'hoodie') {
    g = '<path d="M74 22 Q100 4 126 22 L168 58 L186 110 L158 120 L150 92 L150 182 L50 182 L50 92 L42 120 L14 110 L32 58 Z" fill="' + h + '"/>' +
      '<path d="M80 26 Q100 10 120 26 Q116 48 100 50 Q84 48 80 26Z" ' + sh + '/>' +
      '<path d="M66 136 Q100 124 134 136 L138 170 L62 170 Z" ' + sd + '/>' +
      '<path d="M94 46 L92 70 M106 46 L108 70" ' + sd + '/>';
    if (S.zip) g += '<path d="M100 52 L100 182" stroke="#000" stroke-opacity=".4" stroke-width="1.6"/>';
  } else if (item === 'cap') {
    g = '<path d="M40 120 Q40 46 100 44 Q160 46 160 120 Z" fill="' + h + '"/>' +
      '<path d="M26 118 Q100 150 174 118 Q170 136 146 140 Q100 152 54 140 Q30 136 26 118 Z" fill="' + h + '"/>' +
      '<path d="M100 46 L100 118" ' + sd + '/><path d="M26 118 Q100 150 174 118" ' + sd + '/>';
  } else if (item === 'joggers') {
    g = '<path d="M52 20 L148 20 L152 180 L110 180 L100 112 L90 180 L48 180 Z" fill="' + h + '"/>' +
      '<path d="M52 20 L148 20 L149 34 L51 34 Z" ' + sh + '/>' +
      '<path d="M90 34 L88 56 M110 34 L112 56" ' + sd + '/>';
    if (S.cuff) g += '<rect x="48" y="160" width="42" height="20" ' + sh + '/><rect x="110" y="160" width="42" height="20" ' + sh + '/>';
  }
  return '<ellipse cx="100" cy="187" rx="60" ry="4" fill="#000" opacity=".2"/>' + g;
}
function draw() {
  if (!CFG) return;
  if (S.mode === 'design' && !S.designArt) S.mode = 'text';
  var c = colorObj(), back = S.place === 'back', a = CFG.settings.printArea[S.place], n = (S.text || ' ').length;
  var fs = Math.max(12, Math.min(a.w * 1.5, a.w * 2.3 / (n * .34)));
  S._fs = fs;
  var ink = S.tcolor || (Math.abs(lum(c.hex) - lum('#c0344d')) < .2 ? '#efede8' : '#c0344d');
  S._ink = ink;
  var attr = S.kind === 'emb' ? 'fill="' + ink + '" fill-opacity=".18" stroke="' + ink + '" stroke-width=".9" stroke-dasharray="2 1.5"' : 'fill="' + ink + '"';
  var defs = '<defs><filter id="bend"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="1" seed="5" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.5"/></filter>';
  var base = S.item === 'tee' ? (CFG.settings.tees[S.color] || {})[S.place] : '', html;
  if (base) {
    html = defs + '</defs><image href="' + base + '" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet"/>' + artEl(fs, esc(S.text || ' '), attr) +
      '<image href="' + base + '" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply" opacity=".4"/>';
  } else if (S.item !== 'tee') {
    html = defs + '</defs>' + garment(S.item, c) + artEl(fs, esc(S.text || ' '), attr);
  } else {
    var nq = back ? 32 : 44, P = 'M70 20 L40 32 L12 66 L38 86 L52 74 L52 182 L148 182 L148 74 L162 86 L188 66 L160 32 L130 20 Q100 ' + nq + ' 70 20Z';
    defs += '<linearGradient id="sh" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' +
      '<filter id="bl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>' +
      '<filter id="fab" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/></filter>' +
      '<clipPath id="cp"><path d="' + P + '"/></clipPath></defs>';
    var folds = '<g filter="url(#bl)" clip-path="url(#cp)" fill="none" stroke-linecap="round"><path d="M68 96 Q78 130 66 176" stroke="#000" stroke-opacity=".17" stroke-width="5"/><path d="M134 92 Q124 130 136 176" stroke="#000" stroke-opacity=".17" stroke-width="5"/><path d="M98 118 Q104 150 96 180" stroke="#000" stroke-opacity=".12" stroke-width="6"/><path d="M84 88 Q92 130 84 176" stroke="#fff" stroke-opacity=".1" stroke-width="6"/><path d="M46 44 Q38 58 30 72" stroke="#000" stroke-opacity=".16" stroke-width="4"/><path d="M154 44 Q162 58 170 72" stroke="#000" stroke-opacity=".16" stroke-width="4"/></g>';
    var seams = '<g fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".7"><path d="M52 176 L148 176" stroke-dasharray="1.6 1.4"/><path d="M17 66 L40 83" stroke-dasharray="1.6 1.4"/><path d="M183 66 L160 83" stroke-dasharray="1.6 1.4"/><path d="M52 74 Q50 52 42 33"/><path d="M148 74 Q150 52 158 33"/></g>';
    var inside = back ? '' : '<path d="M70 20 Q100 44 130 20 Q100 27 70 20Z" fill="#000" fill-opacity=".38"/>';
    var collar = '<path d="M70 21 Q100 ' + (nq + 1) + ' 130 21" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="5"/><path d="M70 23.5 Q100 ' + (nq + 3.5) + ' 130 23.5" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>';
    html = defs + '<ellipse cx="100" cy="187" rx="60" ry="4" fill="#000" opacity=".22" filter="url(#bl)"/><path d="' + P + '" fill="' + c.hex + '"/>' + inside + '<path d="' + P + '" fill="url(#sh)"/>' + folds + seams + collar +
      artEl(fs, esc(S.text || ' '), attr) + '<rect width="200" height="200" filter="url(#fab)" clip-path="url(#cp)" opacity=".3" style="mix-blend-mode:overlay"/>';
  }
  $('tee').innerHTML = html;
  $('tee').setAttribute('aria-label', L(c));
  chips();
  ['text', 'photo', 'ref', 'design'].forEach(function (m) { $('p-' + m).hidden = S.mode !== m; });
  $('row-zip').hidden = S.item !== 'hoodie'; $('row-cuff').hidden = S.item !== 'joggers';
  setLabels();
  $('dname').textContent = S.designName ? L(S.designName) : '';
  $('rightsBox').hidden = !(S.mode === 'photo' || S.mode === 'ref');
  $('price').textContent = priceText();
  $('o-sc').textContent = S.scale + '%'; $('o-dx').textContent = S.dx; $('o-dy').textContent = S.dy;
  $('sc').value = S.scale; $('dx').value = S.dx; $('dy').value = S.dy;
  renderSummary();
}

// ---------- галерея ----------
function renderGallery() {
  var d = CFG.designs, has = d.length > 0;
  $('gallery').hidden = !has; $('navGal').hidden = !has;
  if (!has) return;
  $('gal').innerHTML = d.map(function (x) {
    return '<article class="dz"><div class="tile"><img loading="lazy" alt="' + esc(L(x.name)) + '" src="' + esc(x.src) + '"></div><h3>' + esc(L(x.name)) + '</h3>' +
      ((+CFG.settings.prices.base) ? '<p class="note">' + esc(T('from')) + ' ' + fmt((+CFG.settings.prices.base) + (+CFG.settings.prices.print || 0) + (+x.extra || 0)) + '</p>' : '') +
      '<button class="btn2" data-d="' + esc(x.id) + '">' + esc(T('choose')) + '</button></article>';
  }).join('');
}
$('gal').addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b) return;
  var d = CFG.designs.find(function (x) { return x.id === b.dataset.d; }); if (!d) return;
  S.mode = 'design'; S.designId = d.id; S.designArt = d.src; S.designName = d.name; S.extra = d.extra || 0; draw();
  $('builder').scrollIntoView();
});

// ---------- своё фото ----------
function loadImage(file, max, cb) {
  var img = new Image(), u = URL.createObjectURL(file);
  img.onload = function () {
    var m = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.round(img.width * m); c.height = Math.round(img.height * m);
    var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(u); cb(c.toDataURL('image/jpeg', .88));
  };
  img.onerror = function () { URL.revokeObjectURL(u); };
  img.src = u;
}
$('file').addEventListener('change', function () { var f = this.files[0]; if (f) loadImage(f, 900, function (d) { S.photoArt = d; draw(); }); });

// ---------- заказ ----------
function artLine() {
  if (S.mode === 'photo') return T('s_photo');
  if (S.mode === 'ref') return T('s_ref') + ($('desc').value ? ': «' + $('desc').value + '»' : '');
  if (S.mode === 'design') return T('s_design') + ': ' + L(S.designName);
  return T('s_text') + ': «' + S.text + '»';
}
function renderSummary() {
  var c = colorObj();
  $('sum').textContent = itemName() + ', ' + L(c) + ', ' + (S.kind === 'emb' ? T('kind_emb') : T('kind_print')).toLowerCase() + ', ' + (S.place === 'back' ? T('place_back') : T('place_front')).toLowerCase() +
    '\n' + T('tee_size') + ': ' + (S.size || '—') + '\n' + artLine() + '\n' + T('s_scale') + ': ' + S.scale + '%\n' + priceText();
}
['desc'].forEach(function (id) { $(id).addEventListener('input', renderSummary); });
function toData(u) { return fetch(u).then(function (r) { return r.blob(); }).then(function (b) { return new Promise(function (res) { var f = new FileReader(); f.onload = function () { res(f.result); }; f.readAsDataURL(b); }); }); }
function drawRuns(x) {
  var a = CFG.settings.printArea[S.place], bx = a.x * 2, w = a.w * 2, cx = bx + w / 2, cy = a.y * 2 + w / 2, fs = S._fs;
  x.save(); x.scale(4, 4); x.translate(cx + S.dx, cy + S.dy); x.scale(S.scale / 100, S.scale / 100); x.translate(-cx, -cy);
  x.textBaseline = 'alphabetic';
  var rs = runs().map(function (r) { x.font = fs + 'px "' + (r.f || S.font) + '"'; return { t: r.t, font: x.font, c: r.c || S._ink, w: x.measureText(r.t).width }; });
  var pos = cx - rs.reduce(function (s, r) { return s + r.w; }, 0) / 2, y = cy + fs * .15;
  rs.forEach(function (r) {
    x.font = r.font;
    if (S.kind === 'emb') { x.globalAlpha = .18; x.fillStyle = r.c; x.fillText(r.t, pos, y); x.globalAlpha = 1; x.setLineDash([2, 1.5]); x.lineWidth = .9; x.strokeStyle = r.c; x.strokeText(r.t, pos, y); x.setLineDash([]); }
    else { x.fillStyle = r.c; x.fillText(r.t, pos, y); }
    pos += r.w;
  });
  x.restore();
}
function exportPreview() {
  return new Promise(function (resolve) {
    try {
      var textMode = S.mode === 'text', cl = $('tee').cloneNode(true); if (textMode) cl.querySelectorAll('text').forEach(function (t) { t.remove(); }); cl.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); cl.setAttribute('width', 800); cl.setAttribute('height', 800);
      var s = new XMLSerializer().serializeToString(cl), urls = [];
      s.replace(/href="(\/uploads\/[^"]+)"/g, function (_, u) { if (urls.indexOf(u) < 0) urls.push(u); });
      Promise.all(urls.map(toData)).then(function (ds) {
        urls.forEach(function (u, i) { s = s.split('href="' + u + '"').join('href="' + ds[i] + '"'); });
        var img = new Image();
        img.onload = function () { var c = document.createElement('canvas'); c.width = c.height = 800; var x = c.getContext('2d'); x.fillStyle = '#e9e7e1'; x.fillRect(0, 0, 800, 800); x.drawImage(img, 0, 0, 800, 800);
          var done = function () { resolve(c.toDataURL('image/jpeg', .85)); };
          if (!textMode) return done();
          var fams = [S.font].concat(runs().map(function (r) { return r.f; }).filter(Boolean));
          Promise.all(fams.map(function (f) { return document.fonts.load(S._fs + 'px "' + f + '"', S.text || 'a'); })).catch(function () {}).then(function () { drawRuns(x); done(); });
        };
        img.onerror = function () { resolve(''); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
      }).catch(function () { resolve(''); });
    } catch (e) { resolve(''); }
  });
}
$('form').addEventListener('submit', function (e) {
  e.preventDefault();
  var msg = $('msg'), btn = $('send'); msg.textContent = '';
  if ((S.mode === 'photo' || S.mode === 'ref') && !$('rights').checked) { msg.textContent = T('need_rights'); return; }
  if (!S.size) { msg.textContent = T('need_size'); $('builder').scrollIntoView(); return; }
  if ($('fName').value.trim().length < 2 || $('fPhone').value.replace(/\D/g, '').length < 7) { msg.textContent = T('need_contact'); return; }
  btn.disabled = true; btn.textContent = T('sending');
  exportPreview().then(function (preview) {
    return fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      website: $('website').value, lang: lang, rights: $('rights').checked, refImage: S.mode === 'ref' ? S.refArt : '', preview: preview, photo: S.mode === 'photo' ? S.photoArt : '',
      customer: { name: $('fName').value, phone: $('fPhone').value, city: $('fCity').value, comment: $('fComment').value },
      config: { color: S.color, customHex: S.customHex, item: S.item, zip: S.zip, cuff: S.cuff, font: S.font, tcolor: S.tcolor, runs: runs(), kind: S.kind, place: S.place, size: S.size, mode: S.mode, text: S.text, desc: $('desc').value, ref: $('ref').value, designId: S.designId, scale: S.scale, dx: S.dx, dy: S.dy }
    }) });
  }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
    $('form').hidden = true; $('ok').hidden = false; $('okText').textContent = T('ok_text').replace('{n}', j.number);
    $('tNum').value = j.number; $('tPhone').value = $('fPhone').value;
  }).catch(function () { msg.textContent = T('err'); btn.disabled = false; btn.textContent = T('submit'); });
});

// ---------- информация, сроки, контакты, статус ----------
function renderTimeline() { $('tl').innerHTML = T('steps').map(function (s) { return '<li><b>' + esc(s.b) + '</b><span>' + esc(s.s) + '</span></li>'; }).join(''); }
function renderInfo() {
  var s = CFG.settings, out = '';
  [['lead_label', 'leadTime'], ['pay_label', 'payment'], ['del_label', 'delivery']].forEach(function (p) { var v = L(s[p[1]]); if (v) out += '<p><b>' + esc(T(p[0])) + ':</b> ' + esc(v) + '</p>'; });
  $('info').innerHTML = out;
}
function renderContacts() {
  var c = CFG.settings.contacts, h = [];
  if (c.instagram) h.push('<a href="https://www.instagram.com/' + encodeURIComponent(c.instagram) + '/" target="_blank" rel="noopener">Instagram @' + esc(c.instagram) + '</a>');
  if (c.telegram) h.push('<a href="https://t.me/' + encodeURIComponent(c.telegram) + '" target="_blank" rel="noopener">Telegram @' + esc(c.telegram) + '</a>');
  if (c.phone) h.push('<a href="tel:' + esc(c.phone.replace(/[^\d+]/g, '')) + '">' + esc(c.phone) + '</a>');
  $('contacts').innerHTML = 'by Azastorm ' + h.join(' · ');
}
$('tBtn').addEventListener('click', function () {
  var r = $('tRes'); r.textContent = '';
  fetch('/api/track?number=' + encodeURIComponent($('tNum').value) + '&phone=' + encodeURIComponent($('tPhone').value)).then(function (x) { if (!x.ok) throw 0; return x.json(); }).then(function (j) {
    r.textContent = j.number + ': ' + (T('status')[j.status] || j.status);
    var step = { new: 0, confirmed: 0, sewing: 1, printing: 2, shipped: 3, done: 3 }[j.status];
    document.querySelectorAll('#tl li').forEach(function (li, i) { li.classList.toggle('on', step !== undefined && i <= step); });
  }).catch(function () { r.textContent = T('track_nf'); });
});

// ---------- референс по ссылке ----------
$('refBtn').addEventListener('click', function () {
  var m = $('refMsg'), link = $('ref').value.trim(); if (!link) return;
  m.textContent = T('ref_loading'); $('refBtn').disabled = true;
  fetch('/api/ref-image?url=' + encodeURIComponent(link)).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (x) {
    if (!x.ok) { m.textContent = x.j.error === 'host' ? T('ref_host') : T('ref_fail'); return; }
    S.refArt = x.j.image; m.textContent = T('ref_ok'); draw();
  }).catch(function () { m.textContent = T('ref_fail'); }).then(function () { $('refBtn').disabled = false; });
});

// ---------- фото сайта: герой, lookbook, о бренде ----------
function renderSite() {
  var s = CFG.settings.site || {}, h = $('top');
  if (s.hero) { h.classList.add('photo'); h.style.backgroundImage = 'linear-gradient(rgba(22,33,58,.72),rgba(22,33,58,.92)),url("' + s.hero + '")'; } else { h.classList.remove('photo'); h.style.backgroundImage = ''; }
  var lb = s.lookbook || [];
  $('look').hidden = !lb.length;
  $('lookList').innerHTML = lb.map(function (u) { return '<img loading="lazy" alt="" src="' + esc(u) + '">'; }).join('');
  var txt = L(s.about), pr = s.process || [];
  $('about').hidden = !(txt || pr.length);
  $('aboutText').textContent = txt;
  $('procList').innerHTML = pr.map(function (u) { return '<img loading="lazy" alt="" src="' + esc(u) + '">'; }).join('');
}

// ---------- старт ----------
applyLang();
fetch("/api/public").then(function (r) { return r.json(); }).then(function (d) {
  CFG = d; S.color = d.settings.colors[0].id; applyLang();
});
})();
