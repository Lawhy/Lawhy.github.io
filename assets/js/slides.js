/* slides.js — Reusable slide deck engine for yuanhe.wiki
   Scales a fixed 1920×1080 canvas to fit any viewport. */

(function () {
  var SLIDE_W = 1920;
  var SLIDE_H = 1080;

  var deck = document.querySelector('.deck');
  var slides = Array.from(document.querySelectorAll('.slide'));
  var progress = document.getElementById('progress');
  var hint = document.getElementById('hint');
  var cur = 0;

  function scaleSlides() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scale = Math.min(vw / SLIDE_W, vh / SLIDE_H);

    slides.forEach(function (s) {
      s.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
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

  function go(idx) {
    if (idx < 0 || idx >= slides.length) return;
    slides[cur].classList.remove('active');
    getFrags(slides[cur]).forEach(function (f) { f.classList.remove('visible'); });
    cur = idx;
    slides[cur].classList.add('active');
    updateProgress();
  }

  function next() {
    var hidden = hiddenFrags(slides[cur]);
    if (hidden.length) {
      hidden[0].classList.add('visible');
      return;
    }
    go(cur + 1);
  }

  function prev() {
    var shown = shownFrags(slides[cur]);
    if (shown.length) {
      shown[shown.length - 1].classList.remove('visible');
      return;
    }
    go(cur - 1);
  }

  function updateProgress() {
    var pct = slides.length > 1 ? (cur / (slides.length - 1)) * 100 : 100;
    progress.style.width = pct + '%';
  }

  document.addEventListener('keydown', function (e) {
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

    // Don't navigate when clicking inside slide content
    if (e.target.closest('.slide-inner')) return;

    // Links — don't navigate slides
    if (e.target.closest('a')) return;

    // Default: click to navigate slides (only on empty areas / margins)
    if (e.clientX > window.innerWidth / 3) {
      next();
    } else {
      prev();
    }
  });

  window.addEventListener('resize', scaleSlides);
  scaleSlides();
  updateProgress();

  setTimeout(function () {
    if (hint) hint.classList.add('hidden');
  }, 4000);
})();
