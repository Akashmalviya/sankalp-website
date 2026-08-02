(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Nav ── */
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      var links = document.querySelector('.nav-links');
      if (links) links.classList.remove('open');
      document.querySelectorAll('.nav-toggle').forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  });
  document.querySelectorAll('.nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var raft = btn.closest('.nav-raft') || btn.parentElement;
      var links = raft.querySelector('.nav-links');
      if (!links) return;
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ── CTA tracking ── */
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'cta_click', { location: el.dataset.cta });
      }
    });
  });

  /* ── Stress ↔ Recovery toggle ── */
  var modeVisual = document.getElementById('mode-visual');
  var modeLabel = document.getElementById('mode-label');
  var modeHint = document.getElementById('mode-hint');
  var modeMatrix = document.getElementById('mode-matrix');
  var modeBtns = document.querySelectorAll('.mode-toggle button');

  // Build a seamlessly-tiling wave across a range wider than the 180u viewBox,
  // so scrolling by exactly one WAVELENGTH loops with no visible seam.
  var WAVELENGTH = 60;
  var RANGE_START = -WAVELENGTH * 2; // -120
  var RANGE_END = 180 + WAVELENGTH * 2; // 300

  function buildHeal() {
    var amp = 14;
    var d = 'M' + RANGE_START + ',40';
    for (var x = RANGE_START; x < RANGE_END; x += WAVELENGTH) {
      d +=
        ' C' + (x + 10) + ',' + (40 - amp) + ' ' + (x + 20) + ',' + (40 - amp) + ' ' + (x + 30) + ',40' +
        ' C' + (x + 40) + ',' + (40 + amp) + ' ' + (x + 50) + ',' + (40 + amp) + ' ' + (x + WAVELENGTH) + ',40';
    }
    return d;
  }

  function buildStress() {
    var d = 'M' + RANGE_START + ',40';
    for (var x = RANGE_START; x < RANGE_END; x += WAVELENGTH) {
      d +=
        ' L' + (x + 12) + ',40' +
        ' L' + (x + 18) + ',12' +
        ' L' + (x + 26) + ',68' +
        ' L' + (x + 34) + ',30' +
        ' L' + (x + 42) + ',40' +
        ' L' + (x + WAVELENGTH) + ',40';
    }
    return d;
  }

  var modes = {
    stress: {
      label: 'Stress mode',
      hint: 'Accelerator on. Digestion, sleep and repair get postponed.',
      path: buildStress(),
    },
    heal: {
      label: 'Recovery mode',
      hint: 'The brake engages. This is where your body actually heals.',
      path: buildHeal(),
    },
  };

  function setMode(mode) {
    if (!modeVisual || !modes[mode]) return;
    modeVisual.className = 'mode-visual ' + mode;
    var path = modeVisual.querySelector('.wave-morph');
    if (path) path.setAttribute('d', modes[mode].path);
    if (modeLabel) modeLabel.textContent = modes[mode].label;
    if (modeHint) modeHint.textContent = modes[mode].hint;
    if (modeMatrix) modeMatrix.setAttribute('data-mode', mode);
    modeBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.mode === mode);
      b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
    });
  }

  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setMode(btn.dataset.mode);
      autoHeal = false;
    });
  });

  var autoHeal = true;
  if (!reduced && modeVisual) {
    setInterval(function () {
      if (!autoHeal) return;
      setMode(modeVisual.classList.contains('stress') ? 'heal' : 'stress');
    }, 5000);
  }
  setMode('heal');

  /* ── Scroll reveal ── */
  if (reduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
