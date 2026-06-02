/* slides.js — Reusable slide deck engine for yuanhe.wiki
   Scales a fixed 1920×1080 canvas to fit any viewport. */

(function () {
  var SLIDE_W = 1920;
  var SLIDE_H = 1080;

  var slides = Array.from(document.querySelectorAll('.slide'));
  var progress = document.getElementById('progress');
  var hint = document.getElementById('hint');
  var cur = 0;
  // True when the canvas is rotated 90° (portrait phone). In that state the
  // slide's left→right axis runs top→bottom down the device, so navigation
  // gestures are measured against the slide, not the device. See scaleSlides.
  var isRotated = false;

  function scaleSlides() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // A landscape (16:9) slide on a portrait viewport fits-to-width and ends up
    // tiny, wasting most of the screen. Rotating the canvas 90° lets the slide's
    // long axis run down the screen instead — much bigger. Only do it when the
    // rotated fit is actually larger, so the embedded (landscape) iframe and
    // landscape phones are left upright untouched.
    // rotate(90deg): slide top points to the device's right, so it reads
    // upright when the phone is turned counter-clockwise — the natural motion
    // for a right-hander gripping the phone (bottom edge swings out to the right).
    var upright = Math.min(vw / SLIDE_W, vh / SLIDE_H);
    var rotated = Math.min(vw / SLIDE_H, vh / SLIDE_W);
    var doRotate = rotated > upright;
    isRotated = doRotate;
    var scale = doRotate ? rotated : upright;
    var rot = doRotate ? ' rotate(90deg)' : '';

    slides.forEach(function (s) {
      s.style.transform = 'translate(-50%, -50%)' + rot + ' scale(' + scale + ')';
      s.style.left = '50%';
      s.style.top = '50%';
    });
  }

  function getFrags(slide) {
    return Array.from(slide.querySelectorAll('.frag'));
  }

  function shownFrags(slide) {
    return getFrags(slide).filter(function (f) { return f.classList.contains('visible'); });
  }

  function hiddenFrags(slide) {
    return getFrags(slide).filter(function (f) { return !f.classList.contains('visible'); });
  }

  // Mirror each visible frag's `frag-*` classes onto the slide as `fragv-*`,
  // so CSS can target them via simple class selectors (more reliable than :has()
  // when the .visible toggle happens on SVG descendants).
  function syncFragClasses(slide) {
    Array.from(slide.classList).forEach(function (c) {
      if (c.indexOf('fragv-') === 0) slide.classList.remove(c);
    });
    shownFrags(slide).forEach(function (f) {
      Array.from(f.classList).forEach(function (c) {
        if (c.indexOf('frag-') === 0) {
          slide.classList.add('fragv-' + c.slice(5));
        }
      });
    });
  }

  function go(idx) {
    if (idx < 0 || idx >= slides.length) return;
    slides[cur].classList.remove('active');
    getFrags(slides[cur]).forEach(function (f) { f.classList.remove('visible'); });
    syncFragClasses(slides[cur]);
    cur = idx;
    slides[cur].classList.add('active');
    syncFragClasses(slides[cur]);
    updateProgress();
    updateHash();
  }

  function next() {
    var hidden = hiddenFrags(slides[cur]);
    if (hidden.length) {
      hidden[0].classList.add('visible');
      syncFragClasses(slides[cur]);
      updateHash();
      return;
    }
    go(cur + 1);
  }

  function prev() {
    var shown = shownFrags(slides[cur]);
    if (shown.length) {
      shown[shown.length - 1].classList.remove('visible');
      syncFragClasses(slides[cur]);
      updateHash();
      return;
    }
    go(cur - 1);
  }

  // Tap/click the left half of the SLIDE → prev, right half → next. Measured
  // against the slide's left→right axis: that's the device X normally, but when
  // the canvas is rotated 90° (portrait phone) the slide runs down the device,
  // so we use Y instead — keeping left/right relative to the slide, not the screen.
  function navByPoint(x, y) {
    var pos = isRotated ? y : x;
    var extent = isRotated ? window.innerHeight : window.innerWidth;
    if (pos < extent / 2) prev(); else next();
  }

  function updateProgress() {
    var pct = slides.length > 1 ? (cur / (slides.length - 1)) * 100 : 100;
    progress.style.width = pct + '%';
  }

  // ── Deep-link: keep current slide (+ revealed frag count) in the URL hash,
  //    so a refresh lands you right back where you were (#7 or #7-2). ──
  function updateHash() {
    var n = shownFrags(slides[cur]).length;
    var h = (cur + 1) + (n ? '-' + n : '');
    if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h);
  }

  function restoreFromHash() {
    var m = /^#(\d+)(?:-(\d+))?$/.exec(location.hash);
    if (!m) return;
    var idx = Math.min(Math.max(parseInt(m[1], 10) - 1, 0), slides.length - 1);
    go(idx);
    var nf = m[2] ? parseInt(m[2], 10) : 0;
    var frags = getFrags(slides[idx]);
    for (var i = 0; i < nf && i < frags.length; i++) frags[i].classList.add('visible');
    syncFragClasses(slides[idx]);
    updateHash();
  }

  // ── Overview / TOC overlay (press 'o'); hidden by default, zero slide footprint ──
  var toc = document.createElement('div');
  toc.className = 'toc-overlay';
  var tocHtml = '<div class="toc-panel"><div class="toc-title">Slides</div><ul class="toc-list">';
  slides.forEach(function (s, i) {
    var h2 = s.querySelector('h2');
    var label = s.dataset.toc || (h2 ? h2.textContent.trim() : ('Slide ' + (i + 1)));
    tocHtml += '<li class="toc-item" data-idx="' + i + '"><span class="toc-num">' + (i + 1) + '</span><span>' + label + '</span></li>';
  });
  tocHtml += '</ul></div>';
  toc.innerHTML = tocHtml;
  document.body.appendChild(toc);

  function markToc() {
    toc.querySelectorAll('.toc-item').forEach(function (it, i) {
      it.classList.toggle('current', i === cur);
    });
  }

  function toggleToc(force) {
    var open = (force != null) ? force : !toc.classList.contains('open');
    toc.classList.toggle('open', open);
    if (open) markToc();
  }

  toc.addEventListener('click', function (e) {
    e.stopPropagation();
    var item = e.target.closest('.toc-item');
    if (item) { go(parseInt(item.dataset.idx, 10)); toggleToc(false); return; }
    if (e.target === toc) toggleToc(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'o' || e.key === 'O') { e.preventDefault(); toggleToc(); return; }
    if (e.key === 'Escape') { toggleToc(false); return; }
    if (toc.classList.contains('open')) return;
    if (hint && !hint.classList.contains('hidden')) {
      hint.classList.add('hidden');
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(slides.length - 1);
        break;
      case '1':
        e.preventDefault();
        go(0);
        break;
    }
  });

  document.addEventListener('click', function (e) {
    // Interactive elements (e.g., clickable methods) — handle and don't navigate
    var method = e.target.closest('.env-method');
    if (method) {
      var slide = method.closest('.slide');
      slide.querySelectorAll('.env-method').forEach(function (m) { m.classList.remove('active'); });
      method.classList.add('active');
      var targetId = method.dataset.target;
      slide.querySelectorAll('.env-ex').forEach(function (ex) { ex.classList.remove('active'); });
      var target = slide.querySelector('#' + targetId);
      if (target) target.classList.add('active');
      return;
    }

    // Click-to-reveal popinfo tooltip — toggle clicked trigger, close others
    var pop = e.target.closest('.popinfo');
    var hadOpenPop = document.querySelector('.popinfo.open');
    document.querySelectorAll('.popinfo.open').forEach(function (p) {
      if (p !== pop) p.classList.remove('open');
    });
    if (pop) {
      pop.classList.toggle('open');
      return;
    }
    // A click that only dismissed an open tooltip shouldn't also flip the slide.
    if (hadOpenPop) return;

    // Links — let them work, never navigate.
    if (e.target.closest('a')) return;

    navByPoint(e.clientX, e.clientY);
  });

  window.addEventListener('resize', scaleSlides);
  window.addEventListener('orientationchange', scaleSlides);
  scaleSlides();
  updateProgress();
  restoreFromHash();

  setTimeout(function () {
    if (hint) hint.classList.add('hidden');
  }, 4000);
})();
