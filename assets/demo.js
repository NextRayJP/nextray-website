/* デモサイト共通のふるまい
   - .rv のスクロール表示
   - モバイルメニュー（#bg で開く／#mc で閉じる／#mn が本体）
   - .filter による絞り込み（カードの data-c と button の data-f を突き合わせる）
   - フォームの入力チェックと完了表示（action は付けず、実送信はしない）
   本体サイトとは無関係。sample-*.html だけが読み込む。 */
(function () {
  'use strict';

  // ---- スクロールで浮かび上がる ----
  var els = [].slice.call(document.querySelectorAll('.rv'));
  function show(el) { el.classList.add('in'); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ens) {
      ens.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 3 * .09) + 's'; io.observe(el); });
    // IntersectionObserver が発火しない環境でも本文が必ず見えるようにする
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll('.rv:not(.in)'), function (e) {
        if (e.getBoundingClientRect().top < innerHeight) show(e);
      });
    }, 700);
  } else {
    els.forEach(show);
  }

  // ---- モバイルメニュー ----
  var bg = document.getElementById('bg'),
      mn = document.getElementById('mn'),
      mc = document.getElementById('mc');
  if (bg && mn) {
    bg.addEventListener('click', function () { mn.classList.add('open'); });
    if (mc) mc.addEventListener('click', function () { mn.classList.remove('open'); });
    [].forEach.call(mn.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { mn.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') mn.classList.remove('open');
    });
  }

  // ---- 絞り込み ----
  var btns = [].slice.call(document.querySelectorAll('.filter button')),
      grid = document.getElementById('grid'),
      cnt = document.getElementById('cnt');
  if (btns.length && grid) {
    var cards = [].slice.call(grid.children);
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-f'), n = 0;
        btns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === btn)); });
        cards.forEach(function (card) {
          var hit = (f === 'all') || (' ' + (card.getAttribute('data-c') || '') + ' ').indexOf(' ' + f + ' ') > -1;
          card.style.display = hit ? '' : 'none';
          show(card);
          if (hit) n++;
        });
        if (cnt) cnt.textContent = n;
      });
    });
  }

  // ---- フォーム（サンプルのため実送信はしない） ----
  var f = document.getElementById('cform'), done = document.getElementById('done');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [].forEach.call(f.querySelectorAll('[required]'), function (el) {
        var bad = !el.value.trim() ||
          (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        el.style.borderColor = bad ? '#c0392b' : '';
        if (bad && ok) { el.focus(); ok = false; }
      });
      // チェックボックス群が必須の場合（data-need-check を持つ .checks）
      var need = f.querySelector('.checks[data-need-check]');
      if (need && !need.querySelector('input:checked')) {
        ok = false;
        alert('1つ以上お選びください。');
      }
      if (!ok) return;
      if (done) {
        done.classList.add('on');
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
})();
