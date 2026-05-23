/* ===== Canvas Particle System with Connections ===== */
const CONNECTION_DIST = 120;
const MOUSE_DIST = 150;
let pRunning = true;
let pAnimId = null;
let pAnimateFn = null;
let pCanvasEl = null;

class Particle {
  constructor(W, H) {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = Math.random() * 3 + 2;
    const colors = ['100,140,255', '0,184,148', '255,107,107', '180,120,255', '243,156,18'];
    const darkColors = ['35,70,190', '0,120,100', '190,50,50', '110,45,170', '200,150,0'];
    const cidx = Math.floor(Math.random() * colors.length);
    this.color = colors[cidx];
    this.darkColor = darkColors[cidx];
    this.alpha = Math.random() * 0.15 + 0.85;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.04 + 0.02;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
  }

  update(W, H, mouse, pSpeedScale) {
    this.x += this.vx * pSpeedScale;
    this.y += this.vy * pSpeedScale;
    this.angle += this.spin;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    this.pulse += this.pulseSpeed;
    if (mouse.x != null) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_DIST) {
        const f = (MOUSE_DIST - d) / MOUSE_DIST;
        this.x -= dx / d * f * 1.2;
        this.y -= dy / d * f * 1.2;
      }
    }
  }

  draw(ctx, isLight, pSizeScale) {
    const pulseSize = (this.size + Math.sin(this.pulse) * 0.8) * pSizeScale;
    const drawColor = isLight ? this.darkColor : this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${drawColor},${this.alpha})`;
    ctx.fill();
    if (isLight) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(20,40,100,0.35)';
      ctx.stroke();
    }
  }
}

function drawGlow(ctx, particles, isLight, pSizeScale) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0, len = particles.length; i < len; i++) {
    const p = particles[i];
    const pulseSize = (p.size + Math.sin(p.pulse) * 0.8) * pSizeScale;
    const drawColor = isLight ? p.darkColor : p.color;
    const glowSize = pulseSize * 3;
    const grad = ctx.createRadialGradient(p.x, p.y, pulseSize * 0.5, p.x, p.y, glowSize);
    grad.addColorStop(0, `rgba(${drawColor},0.25)`);
    grad.addColorStop(1, `rgba(${drawColor},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(p.x - glowSize, p.y - glowSize, glowSize * 2, glowSize * 2);
  }
  ctx.restore();
}

function drawConnections(ctx, particles, isLight) {
  const connColor = isLight ? '35,70,190' : '100,140,255';
  const maxDist2 = CONNECTION_DIST * CONNECTION_DIST;
  const len = particles.length;
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(${connColor},0.3)`;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const pi = particles[i];
    for (let j = i + 1; j < len; j++) {
      const pj = particles[j];
      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < maxDist2) {
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
      }
    }
  }
  ctx.stroke();
}

function initParticles() {
  const canvas = document.getElementById('cvs');
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const mouse = { x: null, y: null };

  window.pSizeScale = 1;
  window.pSpeedScale = 1;
  window.pBlurValue = 6;
  window.pBlurMode = 'global';

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const pCountSlider = document.getElementById('pCount');
  const initialCount = pCountSlider ? parseInt(pCountSlider.value) || 100 : 100;
  for (let i = 0; i < initialCount; i++) {
    particles.push(new Particle(W, H));
  }

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    const isLight = document.body.getAttribute('data-theme') !== 'dark';
    drawConnections(ctx, particles, isLight);
    particles.forEach((p) => {
      p.update(W, H, mouse, window.pSpeedScale);
      p.draw(ctx, isLight, window.pSizeScale);
    });
    drawGlow(ctx, particles, isLight, window.pSizeScale);
    if (pRunning) pAnimId = requestAnimationFrame(animate);
  };
  pAnimateFn = animate;
  pCanvasEl = canvas;
  animate();

  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  pCountSlider?.addEventListener('input', (e) => {
    const targetCount = parseInt(e.target.value);
    const currentCount = particles.length;
    if (targetCount > currentCount) {
      for (let i = currentCount; i < targetCount; i++) particles.push(new Particle(W, H));
    } else if (targetCount < currentCount) {
      particles.splice(targetCount, currentCount - targetCount);
    }
  });

  document.getElementById('pSize')?.addEventListener('input', (e) => { window.pSizeScale = parseFloat(e.target.value) / 4; });
  document.getElementById('pSpeed')?.addEventListener('input', (e) => { window.pSpeedScale = parseFloat(e.target.value); });
  document.getElementById('pBlur')?.addEventListener('input', (e) => {
    window.pBlurValue = parseFloat(e.target.value);
    AIG.updateCanvasFilter(canvas);
  });

  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.pBlurMode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach((b) => b.classList.toggle('active', b === btn));
      AIG.updateCanvasFilter(canvas);
    });
  });

  return canvas;
}

function updateCanvasFilter(canvas) {
  const glassOn = document.body.getAttribute('data-glass') === 'on';
  const mode = window.pBlurMode || 'global';
  const blurVal = typeof window.pBlurValue === 'number' ? window.pBlurValue : 6;

  document.body.setAttribute('data-blur-mode', mode);

  // Canvas: global = blur whole background; local = no canvas blur
  canvas.style.filter = (glassOn && mode === 'global' && blurVal > 0)
    ? `blur(${blurVal}px)` : 'none';

  // Update --g as a concrete value
  const root = document.documentElement;
  let bfValue;
  if (glassOn) {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const sat = isDark ? '1.8' : '2.2';
    if (mode === 'global') {
      root.style.setProperty('--g', 'none');
      bfValue = 'none';
    } else {
      root.style.setProperty('--g', `blur(${blurVal}px) saturate(${sat})`);
      bfValue = `blur(${blurVal}px) saturate(${sat})`;
    }
  } else {
    root.style.setProperty('--g', 'blur(50px) saturate(2.2)');
    bfValue = null;
  }

  // Some elements can't resolve var(--g) in backdrop-filter correctly.
  // Apply concrete value directly to bypass CSS variable resolution issues.
  applyDirectBackdrop(bfValue);
}

function applyDirectBackdrop(value) {
  const sel = '.sidebar, .nav-toggle, header .meta span, .toolbar-btn, .tip, .settings-panel, .version-dropdown, .back-top-float, footer';
  const els = document.querySelectorAll(sel);
  els.forEach((el) => {
    if (value === null) {
      el.style.backdropFilter = '';
      el.style.webkitBackdropFilter = '';
    } else {
      el.style.backdropFilter = value;
      el.style.webkitBackdropFilter = value;
    }
  });
}

function toggleParticles(on) {
  if (!pCanvasEl) return;
  if (on) {
    pCanvasEl.style.display = '';
    if (!pRunning) {
      pRunning = true;
      if (pAnimateFn) pAnimateFn();
    }
  } else {
    pRunning = false;
    if (pAnimId) cancelAnimationFrame(pAnimId);
    pCanvasEl.style.display = 'none';
  }
}

function toggleBgAnim(on) {
  document.body.setAttribute('data-bg-anim', on ? 'on' : 'off');
}

window.AIG = window.AIG || {};
window.AIG.initParticles = initParticles;
window.AIG.updateCanvasFilter = updateCanvasFilter;
window.AIG.applyDirectBackdrop = applyDirectBackdrop;
window.AIG.toggleParticles = toggleParticles;
window.AIG.toggleBgAnim = toggleBgAnim;
