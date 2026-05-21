// Algorithm stepper: drives the play/pause + step-dot navigation for any
// <figure class="algorithm-stepper"> on the page. Each stepper holds a list
// of .algorithm-stepper__frame elements; only the active frame is shown.

(function () {
  function init(container) {
    const frames = Array.from(container.querySelectorAll('.algorithm-stepper__frame'));
    if (frames.length === 0) return;

    const dots = Array.from(container.querySelectorAll('.algorithm-stepper__dot'));
    const playBtn = container.querySelector('.algorithm-stepper__play');
    const prevBtn = container.querySelector('.algorithm-stepper__prev');
    const nextBtn = container.querySelector('.algorithm-stepper__next');
    const interval = parseInt(container.dataset.interval || '1500', 10);

    let current = 0;
    let playing = false;
    let timer = null;

    function show(i) {
      current = Math.max(0, Math.min(frames.length - 1, i));
      frames.forEach((f, idx) => f.classList.toggle('is-active', idx === current));
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current));
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === frames.length - 1;
    }

    function tick() {
      if (current >= frames.length - 1) {
        stop();
        return;
      }
      show(current + 1);
    }

    function play() {
      if (playing) return;
      // Restart from frame 0 if we're sitting at the end.
      if (current >= frames.length - 1) show(0);
      playing = true;
      if (playBtn) {
        playBtn.setAttribute('aria-pressed', 'true');
        playBtn.setAttribute('aria-label', 'Pause');
        playBtn.textContent = '⏸'; // ⏸
      }
      timer = setInterval(tick, interval);
    }

    function stop() {
      playing = false;
      if (playBtn) {
        playBtn.setAttribute('aria-pressed', 'false');
        playBtn.setAttribute('aria-label', 'Play');
        playBtn.textContent = '▶'; // ▶
      }
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => (playing ? stop() : play()));
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stop();
        show(current - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stop();
        show(current + 1);
      });
    }
    dots.forEach((d, idx) => {
      d.addEventListener('click', () => {
        stop();
        show(idx);
      });
    });

    show(0);
  }

  function boot() {
    document.querySelectorAll('.algorithm-stepper').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
