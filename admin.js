(function () {
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ST = { new: 'Новый', confirmed: 'Подтверждён', sewing: 'Идёт пошив', printing: 'Нанесение', shipped: 'Отправлен', done: 'Выполнен', cancelled: 'Отменён' };
const fmt = n => String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0сум';
let D = null, tab = 'orders';

async function api(method, url, body) {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (r.status === 401 && !url.includes('login')) { showLogin(); throw new Error('auth'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'error'), { code: r.status });
  return j;
}
function pick(file, max, png) {
  return new Promise((res, rej) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => {
      const m = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * m); c.height = Math.round(img.height * m);
      const x = c.getContext('2d'); if (!png) { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
      x.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      let d = png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', .9);
      if (png && d.length > 6.5e6) d = c.toDataURL('image/jpeg', .9);
      res(d);
    };
    img.onerror = () => rej(new Error('img')); img.src = u;
  });
}
function flash(id, text) { const e = $(id); e.textContent = text; setTimeout(() => { e.textContent = ''; }, 3500); }

// ---------- вход ----------
function showLogin() { $('app').hidden = true; $('login').hidden = false; }
$('loginForm').addEventListener('submit', async e => {
  e.preventDefault(); $('loginErr').textContent = '';
  try { await api('POST', '/api/admin/login', { password: $('pw').value }); $('pw').value = ''; await start(); }
  catch (x) { $('loginErr').textContent = x.code === 429 ? 'Слишком много попыток. Подождите 10 минут.' : 'Неверный пароль.'; }
});
$('logout').addEventListener('click', async () => { try { await api('POST', '/api/admin/logout'); } catch (e) {} showLogin(); });
async function start() {
  try { D = await api('GET', '/api/admin/data'); } catch (e) { return; }
  $('login').hidden = true; $('app').hidden = false;
  renderAll(); setTab(location.hash.slice(1) || tab);
}
function setTab(t) {
  if (!['orders', 'designs', 'settings', 'tees', 'site'].includes(t)) t = 'orders'; tab = t; location.hash = t;
  ['orders', 'designs', 'settings', 'tees', 'site'].forEach(k => { $('t-' + k).hidden = k !== t; });
  document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
}
$('tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setTab(b.dataset.t); });
function renderAll() { renderOrders(); renderDesigns(); renderSettings(); renderTees(); renderSite(); }

// ---------- заказы ----------
$('filter').innerHTML = '<option value="">Все</option>' + Object.keys(ST).map(k => '<option value="' + k + '">' + ST[k] + '</option>').join('');
$('filter').addEventListener('change', renderOrders);
function colorName(id) { const c = D.settings.colors.find(x => x.id === id); return c ? c.ru : id; }
function describe(o) {
  const c = o.config, d = D.designs.find(x => x.id === c.designId);
  const art = c.mode === 'photo' ? 'своё фото клиента' : c.mode === 'ref' ? 'по описанию: «' + c.desc + '»' + (c.ref ? '\nРеференс: ' + c.ref : '') : c.mode === 'design' ? 'дизайн «' + (d ? d.name.ru : c.designId) + '»' : 'текст «' + c.text + '»';
  const ITEMS = { tee: 'футболка', polo: 'поло финка', hoodie: 'худи', cap: 'кепка', joggers: 'джоггеры' };
  let item = ITEMS[c.item] || 'футболка';
  if (c.item === 'hoodie') item += c.zip ? ' на молнии' : ' без молнии';
  if (c.item === 'joggers') item += c.cuff ? ' с манжетом' : ' без манжета';
  const col = c.color === 'custom' ? 'свой ' + c.customHex : colorName(c.color);
  const txt = c.mode === 'text' ? '\nШрифт: ' + (c.font || 'Manrope') + (c.tcolor ? ', цвет текста ' + c.tcolor : '') +
    ((c.runs || []).some(r => r.f || r.c) ? '\nЧасти текста: ' + c.runs.map(r => '«' + r.t + '»' + (r.f || r.c ? ' (' + [r.f, r.c].filter(Boolean).join(', ') + ')' : '')).join(' + ') : '') : '';
  return 'Вещь: ' + item + '\nЦвет: ' + col + txt + '\nНанесение: ' + (c.kind === 'emb' ? 'вышивка' : 'принт') + ', ' + (c.place === 'back' ? 'спина' : 'грудь') + '\nРазмер: ' + (c.size || '—') + '\nРисунок: ' + art + '\nМасштаб рисунка: ' + c.scale + '% (сдвиг ' + c.dx + ' / ' + c.dy + ')\nЦена: ' + (o.price ? fmt(o.price) : 'не задана');
}
function renderOrders() {
  const f = $('filter').value, all = D.orders, list = f ? all.filter(o => o.status === f) : all;
  const cnt = k => all.filter(o => o.status === k).length;
  const rev = all.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.price || 0), 0);
  $('stats').innerHTML = [['Всего', all.length], ['Новых', cnt('new')], ['В работе', cnt('confirmed') + cnt('sewing') + cnt('printing') + cnt('shipped')], ['Выполнено', cnt('done')]].map(x => '<div class="stat"><b>' + x[1] + '</b>' + x[0] + '</div>').join('') + '<div class="stat"><b>' + fmt(rev) + '</b>Сумма (без отменённых)</div>';
  const open = new Set([...document.querySelectorAll('#orders details[open]')].map(d => d.dataset.id));
  $('orders').innerHTML = list.length ? list.map(o => '<details class="order" data-id="' + o.id + '"' + (open.has(o.id) ? ' open' : '') + '><summary><b>' + esc(o.number) + '</b><span>' + esc(o.customer.name) + ' · ' + esc(o.customer.phone) + '<br><span class="muted">' + new Date(o.createdAt).toLocaleString('ru') + (o.customer.city ? ' · ' + esc(o.customer.city) : '') + '</span></span><span>' + (o.price ? fmt(o.price) : '') + '</span><span class="badge ' + o.status + '">' + ST[o.status] + '</span></summary>' +
    '<div class="det"><div>' + (o.preview ? '<a href="' + o.preview + '" target="_blank"><img alt="Макет" src="' + o.preview + '"></a>' : '<p class="muted">Макет не сохранился</p>') +
    (o.photo ? '<p><a href="' + o.photo + '" target="_blank">Фото клиента (открыть)</a></p>' : '') + (o.refImg ? '<p><a href="' + o.refImg + '" target="_blank">Референс клиента (открыть)</a></p>' : '') + (o.config.mode === 'photo' || o.config.mode === 'ref' ? '<p class="muted">' + (o.rights ? 'Клиент подтвердил права на изображение' : 'Права не подтверждены') + '</p>' : '') + '</div><div><pre>' + esc(describe(o)) + '</pre>' +
    (o.customer.comment ? '<p><b>Комментарий клиента:</b> ' + esc(o.customer.comment) + '</p>' : '') +
    '<label>Статус<select data-f="status">' + Object.keys(ST).map(k => '<option value="' + k + '"' + (o.status === k ? ' selected' : '') + '>' + ST[k] + '</option>').join('') + '</select></label>' +
    '<label>Заметка (видите только вы)<textarea data-f="note" rows="3">' + esc(o.note) + '</textarea></label>' +
    '<p><button class="btn sm" data-act="save">Сохранить</button> <button class="btn sm del" data-act="del">Удалить</button> <span class="muted" data-m></span></p></div></div></details>').join('') : '<p class="muted">Заказов пока нет.</p>';
}
$('orders').addEventListener('click', async e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const box = b.closest('details'), id = box.dataset.id, m = box.querySelector('[data-m]');
  try {
    if (b.dataset.act === 'save') {
      await api('PATCH', '/api/admin/orders/' + id, { status: box.querySelector('[data-f=status]').value, note: box.querySelector('[data-f=note]').value });
      D = await api('GET', '/api/admin/data'); renderOrders();
    } else if (confirm('Удалить заказ безвозвратно?')) {
      await api('DELETE', '/api/admin/orders/' + id); D = await api('GET', '/api/admin/data'); renderOrders();
    }
  } catch (x) { if (m) m.textContent = 'Ошибка'; }
});
setInterval(async () => { if (!$('app').hidden && tab === 'orders' && !document.querySelector('#orders :focus')) { try { D = await api('GET', '/api/admin/data'); renderOrders(); } catch (e) {} } }, 30000);

// ---------- дизайны ----------
function renderDesigns() {
  $('dList').innerHTML = D.designs.length ? D.designs.map(d => '<div class="card"><img alt="" src="' + esc(d.src) + '"><b>' + esc(d.name.ru) + '</b><span class="muted">+' + fmt(d.extra) + (d.published === false ? ' · скрыт' : '') + '</span><div><button class="btn sm ghost" data-e="' + d.id + '">Изменить</button> <button class="btn sm del" data-x="' + d.id + '">Удалить</button></div></div>').join('') : '<p class="muted">Дизайнов пока нет. Добавьте первый выше.</p>';
}
function resetD() { $('dForm').reset(); $('dId').value = ''; $('dCancel').hidden = true; $('dPub').checked = true; }
$('dCancel').addEventListener('click', resetD);
$('dList').addEventListener('click', async e => {
  const ed = e.target.closest('[data-e]'), del = e.target.closest('[data-x]');
  if (ed) {
    const d = D.designs.find(x => x.id === ed.dataset.e);
    $('dId').value = d.id; $('dRu').value = d.name.ru; $('dUz').value = d.name.uz; $('dEn').value = d.name.en; $('dExtra').value = d.extra; $('dPub').checked = d.published !== false; $('dCancel').hidden = false; $('dRu').scrollIntoView();
  } else if (del && confirm('Удалить дизайн?')) {
    await api('DELETE', '/api/admin/designs/' + del.dataset.x); D = await api('GET', '/api/admin/data'); renderDesigns();
  }
});
$('dForm').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const f = $('dFile').files[0], body = { id: $('dId').value || undefined, name: { ru: $('dRu').value, uz: $('dUz').value, en: $('dEn').value }, extra: +$('dExtra').value || 0, published: $('dPub').checked };
    if (f) body.image = await pick(f, 1400, f.type === 'image/png');
    await api('POST', '/api/admin/designs', body); D = await api('GET', '/api/admin/data'); renderDesigns(); resetD(); flash('dMsg', 'Сохранено');
  } catch (x) { flash('dMsg', x.message === 'image' ? 'Нужно выбрать фото дизайна.' : 'Ошибка сохранения'); }
});

// ---------- настройки ----------
function setPath(o, p, v) { const k = p.split('.'); let t = o; for (let i = 0; i < k.length - 1; i++) t = t[k[i]] = t[k[i]] || {}; t[k[k.length - 1]] = v; }
function renderSettings() {
  const s = D.settings, p = s.prices, c = s.contacts;
  $('fPrices').innerHTML = [['base', 'Футболка (заготовка), сум'], ['print', 'Принт, сум'], ['emb', 'Вышивка, сум'], ['custom', 'Свой дизайн клиента, сум']].map(x => '<label>' + x[1] + '<input type="number" min="0" data-p="prices.' + x[0] + '" value="' + (+p[x[0]] || 0) + '"></label>').join('') + '<p class="muted" style="grid-column:1/-1;margin:0">Если цена футболки равна 0, на сайте будет написано «Цена уточняется».</p>';
  $('fColors').innerHTML = s.colors.map((x, i) => '<div class="row"><label>Код<input value="' + esc(x.id) + '" disabled></label><label>Название (рус)<input data-p="colors.' + i + '.ru" value="' + esc(x.ru) + '"></label><label>Название (uz)<input data-p="colors.' + i + '.uz" value="' + esc(x.uz) + '"></label><label>Название (en)<input data-p="colors.' + i + '.en" value="' + esc(x.en) + '"></label><label>Цвет<input type="color" data-p="colors.' + i + '.hex" value="' + esc(x.hex) + '"></label><button class="btn sm del" data-rc="' + i + '" type="button">×</button></div>').join('') + '<button class="btn sm ghost" id="addColor" type="button">+ Добавить цвет</button>';
  $('fMisc').innerHTML = '<label>Размеры через запятую<input data-p="sizes" data-list="1" value="' + esc(s.sizes.join(', ')) + '"></label><label>Instagram (без @)<input data-p="contacts.instagram" value="' + esc(c.instagram) + '"></label><label>Telegram (без @)<input data-p="contacts.telegram" value="' + esc(c.telegram) + '"></label><label>Телефон<input data-p="contacts.phone" value="' + esc(c.phone) + '"></label>';
  $('fTexts').innerHTML = [['leadTime', 'Срок изготовления'], ['payment', 'Условия оплаты'], ['delivery', 'Доставка']].map(x => '<div><b>' + x[1] + '</b><div class="grid3">' + ['ru', 'uz', 'en'].map(l => '<label>' + l.toUpperCase() + '<textarea rows="2" data-p="' + x[0] + '.' + l + '">' + esc((s[x[0]] || {})[l] || '') + '</textarea></label>').join('') + '</div></div>').join('') + '<p class="muted" style="margin:0">Пустые поля на сайте не показываются.</p>';
}
document.addEventListener('input', e => {
  const t = e.target, p = t.dataset && t.dataset.p; if (!p) return;
  let v = t.value; if (t.type === 'number') v = +v || 0; if (t.dataset.list) v = v.split(',').map(x => x.trim()).filter(Boolean);
  setPath(D.settings, p, v); if (p.startsWith('printArea')) updRects();
});
$('fColors').addEventListener('click', e => {
  if (e.target.id === 'addColor') { D.settings.colors.push({ id: 'c' + Date.now().toString(36).slice(-6), hex: '#888888', ru: 'Новый цвет', uz: '', en: '' }); renderSettings(); renderTees(); }
  const r = e.target.closest('[data-rc]'); if (r && D.settings.colors.length > 1 && confirm('Удалить этот цвет?')) { D.settings.colors.splice(+r.dataset.rc, 1); renderSettings(); renderTees(); }
});
async function saveSettings(id) {
  try { const j = await api('PUT', '/api/admin/settings', D.settings); D.settings = j.settings; flash(id, 'Сохранено'); } catch (x) { flash(id, 'Ошибка: проверьте цвета и размеры'); }
}
$('saveSettings').addEventListener('click', () => saveSettings('sMsg'));
$('saveTees').addEventListener('click', () => saveSettings('tMsg'));

// ---------- фото заготовок ----------
function renderTees() {
  const s = D.settings, pa = s.printArea;
  const area = side => '<div class="card"><b>' + (side === 'front' ? 'Область нанесения: грудь' : 'Область нанесения: спина') + '</b><div class="grid3">' + ['x', 'y', 'w'].map(k => '<label>' + { x: 'Слева, %', y: 'Сверху, %', w: 'Ширина, %' }[k] + '<input type="number" min="0" max="90" data-p="printArea.' + side + '.' + k + '" value="' + pa[side][k] + '"></label>').join('') + '</div></div>';
  $('teeList').innerHTML = '<div class="tee">' + area('front') + area('back') + '</div>' + s.colors.map(c => '<h2>' + esc(c.ru) + '</h2><div class="tee">' + ['front', 'back'].map(side => {
    const u = (s.tees[c.id] || {})[side];
    return '<div class="card"><b>' + (side === 'front' ? 'Спереди' : 'Сзади') + '</b><div class="pv">' + (u ? '<img alt="" src="' + esc(u) + '">' : '') + '<i data-side="' + side + '"></i></div>' +
      '<label>' + (u ? 'Заменить фото' : 'Загрузить фото') + '<input type="file" accept="image/*" data-up="' + esc(c.id) + '|' + side + '"></label>' + (u ? '<button class="btn sm del" data-rm="' + esc(c.id) + '|' + side + '" type="button">Убрать фото</button>' : '<span class="muted">Пока используется нарисованная футболка</span>') + '</div>';
  }).join('') + '</div>').join('');
  updRects();
}
function updRects() { document.querySelectorAll('.pv i').forEach(i => { const a = D.settings.printArea[i.dataset.side]; i.style.left = a.x + '%'; i.style.top = a.y + '%'; i.style.width = a.w + '%'; i.style.height = a.w + '%'; }); }
$('teeList').addEventListener('change', async e => {
  const t = e.target; if (!t.dataset.up || !t.files[0]) return;
  const [cid, side] = t.dataset.up.split('|');
  try {
    const d = await pick(t.files[0], 1400, false), j = await api('POST', '/api/admin/upload', { image: d });
    (D.settings.tees[cid] = D.settings.tees[cid] || {})[side] = j.url; renderTees(); await saveSettings('tMsg');
  } catch (x) { flash('tMsg', 'Не удалось загрузить фото'); }
});
$('teeList').addEventListener('click', async e => {
  const b = e.target.closest('[data-rm]'); if (!b) return;
  const [cid, side] = b.dataset.rm.split('|'); delete D.settings.tees[cid][side]; renderTees(); await saveSettings('tMsg');
});

// ---------- фото сайта ----------
function thumbs(list, key, max) {
  const items = list.map((u, i) => '<div class="thumb"><img alt="" src="' + esc(u) + '"><button class="btn sm del" type="button" data-rs="' + key + '|' + i + '">Убрать</button></div>').join('');
  return items + (list.length < max ? '<div class="thumb"><label>Добавить фото<input type="file" accept="image/*" data-us="' + key + '"></label></div>' : '');
}
function renderSite() {
  const s = D.settings.site = D.settings.site || { hero: '', lookbook: [], process: [], about: { ru: '', uz: '', en: '' } };
  $('sHero').innerHTML = '<div class="thumbs">' + (s.hero ? '<div class="thumb"><img alt="" src="' + esc(s.hero) + '"><button class="btn sm del" type="button" data-rs="hero|0">Убрать</button></div>' : '') + '<div class="thumb"><label>' + (s.hero ? 'Заменить' : 'Загрузить') + '<input type="file" accept="image/*" data-us="hero"></label></div></div>';
  $('sLook').innerHTML = thumbs(s.lookbook, 'lookbook', 8);
  $('sProc').innerHTML = thumbs(s.process, 'process', 4);
  $('sAbout').innerHTML = ['ru', 'uz', 'en'].map(l => '<label>Текст о бренде (' + l.toUpperCase() + ')<textarea rows="5" data-p="site.about.' + l + '">' + esc((s.about || {})[l] || '') + '</textarea></label>').join('');
}
$('t-site').addEventListener('change', async e => {
  const t = e.target; if (!t.dataset.us || !t.files[0]) return;
  try {
    const d = await pick(t.files[0], 1800, false), j = await api('POST', '/api/admin/upload', { image: d }), s = D.settings.site, k = t.dataset.us;
    if (k === 'hero') s.hero = j.url; else s[k].push(j.url);
    renderSite(); await saveSettings('siteMsg');
  } catch (x) { flash('siteMsg', 'Не удалось загрузить фото'); }
});
$('t-site').addEventListener('click', async e => {
  const b = e.target.closest('[data-rs]'); if (!b) return;
  const [k, i] = b.dataset.rs.split('|'), s = D.settings.site;
  if (k === 'hero') s.hero = ''; else s[k].splice(+i, 1);
  renderSite(); await saveSettings('siteMsg');
});
$('saveSite').addEventListener('click', () => saveSettings('siteMsg'));

start();
})();
