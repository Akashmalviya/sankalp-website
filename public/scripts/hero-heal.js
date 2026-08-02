(function () {
  var canvas = document.getElementById('hero-waves');
  var hero = document.getElementById('top');
  if (!canvas || !hero) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var start = performance.now();
  var running = false;
  var dpr = 1;
  var w = 0;
  var h = 0;

  var layers = [
    { amp: 10, len: 0.0036, speed: 0.36, y: 0.62, fill: 'rgba(58,158,115,0.03)', stroke: 'rgba(58,158,115,0.08)', width: 0.9 },
    { amp: 14, len: 0.0040, speed: 0.44, y: 0.70, fill: 'rgba(58,158,115,0.045)', stroke: 'rgba(58,158,115,0.11)', width: 1.0 },
    { amp: 16, len: 0.0030, speed: 0.30, y: 0.78, fill: 'rgba(31,125,91,0.05)', stroke: 'rgba(31,125,91,0.12)', width: 1.1 },
    { amp: 12, len: 0.0048, speed: 0.40, y: 0.86, fill: 'rgba(194,149,78,0.05)', stroke: 'rgba(194,149,78,0.12)', width: 1.0 },
    { amp: 9, len: 0.0058, speed: 0.50, y: 0.93, fill: 'rgba(58,158,115,0.04)', stroke: 'rgba(58,158,115,0.09)', width: 0.85 },
  ];

  function resize() {
    var rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawWave(layer, t) {
    var baseY = h * layer.y;
    var phase = t * layer.speed;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, baseY);
    for (var x = 0; x <= w; x += 4) {
      var y =
        baseY +
        Math.sin(x * layer.len + phase) * layer.amp +
        Math.sin(x * layer.len * 0.45 + phase * 1.3) * (layer.amp * 0.35);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = layer.fill;
    ctx.fill();

    ctx.beginPath();
    for (var x2 = 0; x2 <= w; x2 += 3) {
      var y2 =
        baseY +
        Math.sin(x2 * layer.len + phase) * layer.amp +
        Math.sin(x2 * layer.len * 0.45 + phase * 1.3) * (layer.amp * 0.35);
      if (x2 === 0) ctx.moveTo(x2, y2);
      else ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = layer.stroke;
    ctx.lineWidth = layer.width;
    ctx.stroke();
  }

  function draw(now) {
    var t = (now - start) / 1000;
    var breath = 0.5 + 0.5 * Math.sin(t * 0.7);

    ctx.clearRect(0, 0, w, h);

    /* soft sky glow — biased left toward copy */
    var g = ctx.createRadialGradient(w * 0.28, h * 0.28, 10, w * 0.32, h * 0.32, w * 0.5);
    g.addColorStop(0, 'rgba(58,158,115,' + (0.035 + breath * 0.02) + ')');
    g.addColorStop(0.5, 'rgba(194,149,78,' + (0.02 + breath * 0.012) + ')');
    g.addColorStop(1, 'rgba(246,244,239,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    layers.forEach(function (layer) {
      drawWave(layer, t);
    });

    /* floating motes across the field */
    if (!reduced) {
      for (var i = 0; i < 28; i++) {
        var px = ((i * 137.5 + t * (6 + i % 5)) % (w + 40)) - 20;
        var py = h * (0.12 + (i % 9) * 0.08) + Math.sin(t * 0.55 + i) * 22;
        var pr = 1.1 + (i % 3) * 0.8;
        var gold = i % 3 === 0;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = gold
          ? 'rgba(194,149,78,' + (0.16 + breath * 0.18) + ')'
          : 'rgba(58,158,115,' + (0.14 + breath * 0.16) + ')';
        ctx.fill();
      }
    }

    if (!reduced && running) requestAnimationFrame(draw);
  }

  function startLoop() {
    if (running || reduced) return;
    running = true;
    requestAnimationFrame(draw);
  }

  function stopLoop() {
    running = false;
  }

  resize();
  draw(performance.now());

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      resize();
      if (!running) draw(performance.now());
    }).observe(hero);
  } else {
    window.addEventListener('resize', function () {
      resize();
      if (!running) draw(performance.now());
    });
  }

  if (!reduced) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) startLoop();
        else stopLoop();
      }, { threshold: 0.05 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopLoop();
      else startLoop();
    });
    startLoop();
  }
})();
