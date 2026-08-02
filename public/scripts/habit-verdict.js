(function () {
  var DATA = {
    fire: {
      v: 'neutral',
      badge: 'Neutral',
      title: 'Fine for you.',
      text: 'You run warm — a cool glass is mildly soothing.',
      fix: '<b>Keep it</b> — not ice-cold.',
    },
    air: {
      v: 'wrong',
      badge: 'Wrong for you',
      title: 'It slows digestion before the day starts.',
      text: 'Cold water on a cold body is like pouring cold water on an engine you\u2019re trying to start.',
      fix: '<b>Try</b> warm water with lemon.',
    },
    earth: {
      v: 'right',
      badge: 'Right for you',
      title: 'It wakes a sluggish morning.',
      text: 'A cool glass nudges a slow metabolism into gear.',
      fix: '<b>Keep it</b> — cool, not iced.',
    },
  };

  var ICONS = {
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12l5 5L20 6"/></svg>',
    wrong: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    neutral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  };

  var toggle = document.getElementById('rtoggle');
  var verdict = document.getElementById('rverdict');
  if (!toggle || !verdict) return;

  var buttons = toggle.querySelectorAll('.body-orb');

  function render(body) {
    var d = DATA[body];
    if (!d) return;
    verdict.className = 'proof-verdict ' + d.v;
    document.getElementById('rv-badge').innerHTML = ICONS[d.v] + ' ' + d.badge;
    document.getElementById('rv-title').textContent = d.title;
    document.getElementById('rv-text').textContent = d.text;
    document.getElementById('rv-fix').innerHTML = d.fix;
  }

  function select(btn) {
    buttons.forEach(function (b) {
      b.classList.remove('on');
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });
    btn.classList.add('on');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    render(btn.dataset.body);
    if (typeof gtag === 'function') {
      gtag('event', 'habit_demo_interact', { body_type: btn.dataset.body });
    }
  }

  buttons.forEach(function (btn, i) {
    btn.setAttribute('aria-controls', 'rverdict');
    btn.addEventListener('click', function () { select(btn); });
    btn.addEventListener('keydown', function (e) {
      var idx = Array.prototype.indexOf.call(buttons, btn);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = buttons[(idx + 1) % buttons.length];
        select(next);
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = buttons[(idx - 1 + buttons.length) % buttons.length];
        select(prev);
        prev.focus();
      }
    });
  });

  render('air');
})();
