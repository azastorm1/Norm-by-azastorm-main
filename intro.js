// Вход на сайт: толпа точек собирается в колокол нормы, посетитель бросает свою красную точку.
(function () {
'use strict';
var seen = false; try { seen = sessionStorage.getItem('intro') === '1'; } catch (e) {}
var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
if (seen || reduce) return;
var I = window.I18N, lang = 'ru';
try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
if (!I[lang]) { var nl = (navigator.language || 'ru').slice(0, 2); lang = I[nl] ? nl : 'ru'; }
var T = function (k) { return I[lang][k] != null ? I[lang][k] : I.ru[k]; };

var root = document.createElement('div'); root.id = 'intro'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Norm');
root.innerHTML = '<canvas></canvas><div class="i-top"><div class="i-logo">Norm</div><p class="i-line" aria-live="polite"></p></div><button class="i-skip" type="button"></button><div class="i-cta" hidden><button class="btn" type="button"></button></div>';
document.body.appendChild(root); document.body.style.overflow = 'hidden';
var cv = root.querySelector('canvas'), ctx = cv.getContext('2d'), line = root.querySelector('.i-line'), cta = root.querySelector('.i-cta'), enter = cta.querySelector('button'), skip = root.querySelector('.i-skip');
enter.textContent = T('intro_enter'); skip.textContent = T('intro_skip'); line.textContent = T('intro_crowd');
var W, H, dpr, ground, sigma, r, bins = {}, dots = [], you = null, phase = 'crowd', t0 = performance.now(), mx = null, raf;

function size() {
  dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ground = H * .8; sigma = Math.min(W * .17, 190); r = Math.max(2.5, Math.min(5, W / 130));
}
size();
function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
var BW = function () { return r * 2.2; };
function binOf(x) { return Math.round((x - W / 2) / BW()); }
var N = W < 600 ? 90 : 150;
for (var i = 0; i < N; i++) {
  var g = Math.max(-3, Math.min(3, gauss())), b = binOf(W / 2 + g * sigma); bins[b] = (bins[b] || 0) + 1;
  dots.push({ x: W / 2 + b * BW(), ty: ground - (bins[b] - .5) * r * 2.1, y: -10, vy: 0, t: i * 14 + Math.random() * 30, a: .55 + Math.random() * .4, done: false });
}
var base = {}; Object.keys(bins).forEach(function (k) { base[k] = bins[k]; });

function drawYou() {
  ctx.fillStyle = '#c0344d'; ctx.beginPath(); ctx.arc(you.x, you.y, r * 1.7, 0, 7); ctx.fill();
  ctx.font = '34px "Mrs Saint Delafield", cursive'; ctx.textAlign = 'center'; ctx.fillText(T('you'), you.x, you.y - r * 3.2);
}
var last = performance.now();
function frame(now) {
  var dt = Math.min(40, now - last); last = now; var el = now - t0;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(239,237,232,.25)'; ctx.beginPath(); ctx.moveTo(W * .08, ground + 2); ctx.lineTo(W * .92, ground + 2); ctx.stroke();
  var allDone = true;
  dots.forEach(function (d) {
    if (el < d.t) { allDone = false; return; }
    if (!d.done) { d.vy += .0016 * H * dt / 16; d.y += d.vy * dt / 16; if (d.y >= d.ty) { d.y = d.ty; d.done = true; } else allDone = false; }
    ctx.fillStyle = 'rgba(141,151,179,' + d.a + ')'; ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, 7); ctx.fill();
  });
  if (phase === 'crowd' && allDone) { phase = 'hover'; line.textContent = T('intro_where'); you = { x: W / 2, y: H * .2, vy: 0, drop: false }; }
  if (you) {
    if (phase === 'hover' && mx != null) you.x += (mx - you.x) * .25;
    if (you.drop) {
      var b = binOf(you.x); you.vy += .0018 * H * dt / 16; you.y += you.vy * dt / 16;
      var ty = ground - (base[b] || 0) * r * 2.1 - r * 1.7;
      if (you.y >= ty) { you.y = ty; you.drop = false; phase = 'landed'; line.textContent = Math.abs(you.x - W / 2) < sigma * 1.1 ? T('intro_in') : T('intro_out'); cta.hidden = false; enter.focus({ preventScroll: true }); }
    }
    drawYou();
  }
  raf = requestAnimationFrame(frame);
}
raf = requestAnimationFrame(frame);

function drop() { if (phase !== 'hover' || !you) return; if (mx == null) mx = you.x; you.x = Math.round((you.x - W / 2) / BW()) * BW() + W / 2; you.drop = true; you.vy = 0; phase = 'drop'; }
root.addEventListener('pointermove', function (e) { mx = Math.max(W * .06, Math.min(W * .94, e.clientX)); });
cv.addEventListener('pointerdown', function (e) { mx = Math.max(W * .06, Math.min(W * .94, e.clientX)); if (you) you.x = mx; drop(); });
document.addEventListener('keydown', function (e) { if (!document.getElementById('intro')) return; if (e.key === 'ArrowLeft' && mx != null) mx -= 30; if (e.key === 'ArrowRight' && mx != null) mx += 30; if ((e.key === ' ' || e.key === 'ArrowDown') && e.target === document.body) { e.preventDefault(); drop(); } });
window.addEventListener('resize', function () { /* простая адаптация: перезагрузка не нужна */ size(); });
function close() { cancelAnimationFrame(raf); try { sessionStorage.setItem('intro', '1'); } catch (e) {} root.classList.add('out'); document.body.style.overflow = ''; setTimeout(function () { root.remove(); }, 700); }
enter.addEventListener('click', close); skip.addEventListener('click', close);
})();
