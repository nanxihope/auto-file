/* ===== Theme, Glass & Settings Toggle ===== */
function initTheme(canvasRef) {
  const themeBtn = document.getElementById('themeBtn');
  const glassBtn = document.getElementById('glassBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('particleCtrl');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  const savedGlass = localStorage.getItem('glass') || 'off';
  body.setAttribute('data-glass', savedGlass);
  if (savedGlass === 'on') glassBtn.classList.add('active');

  if (canvasRef) AIG.updateCanvasFilter(canvasRef);

  const updateThemeTip = (theme) => {
    themeBtn.setAttribute('data-tip', theme === 'light' ? '深色主题' : '明亮主题');
  };
  const updateGlassTip = (glass) => {
    glassBtn.setAttribute('data-tip', glass === 'on' ? '关闭质感' : '玻璃质感');
  };

  updateThemeTip(savedTheme);
  updateGlassTip(savedGlass);

  themeBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeTip(next);
  });

  glassBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-glass');
    const next = current === 'on' ? 'off' : 'on';
    body.setAttribute('data-glass', next);
    localStorage.setItem('glass', next);
    glassBtn.classList.toggle('active', next === 'on');
    updateGlassTip(next);
    if (canvasRef) AIG.updateCanvasFilter(canvasRef);
  });

  // Settings panel toggle
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCollapsed = settingsPanel.classList.contains('collapsed');
      settingsPanel.classList.toggle('collapsed', !isCollapsed);
      settingsBtn.classList.toggle('active', isCollapsed);
    });
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
        settingsPanel.classList.add('collapsed');
        settingsBtn.classList.remove('active');
      }
    });
    settingsPanel.addEventListener('click', (e) => e.stopPropagation());
  }

  // Particle toggle
  const toggleParticlesBtn = document.getElementById('toggleParticles');
  if (toggleParticlesBtn) {
    toggleParticlesBtn.addEventListener('click', () => {
      const active = toggleParticlesBtn.classList.toggle('active');
      if (AIG.toggleParticles) AIG.toggleParticles(active);
    });
  }

  // Background animation toggle
  const toggleBgAnimBtn = document.getElementById('toggleBgAnim');
  if (toggleBgAnimBtn) {
    toggleBgAnimBtn.addEventListener('click', () => {
      const active = toggleBgAnimBtn.classList.toggle('active');
      if (AIG.toggleBgAnim) AIG.toggleBgAnim(active);
    });
  }

  initTooltip();
}

function initTooltip() {
  const tip = document.createElement('div');
  tip.className = 'tip';
  document.body.appendChild(tip);
  let currentTarget = null;

  const positionTip = (el) => {
    const rect = el.getBoundingClientRect();
    const tipTop = rect.bottom + 8;
    const tipLeft = rect.left + rect.width / 2;
    requestAnimationFrame(() => {
      const tipRect = tip.getBoundingClientRect();
      let left = tipLeft - tipRect.width / 2;
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - 8 - tipRect.width;
      tip.style.top = `${tipTop}px`;
      tip.style.left = `${left}px`;
    });
  };

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-tip]');
    if (!el) return;
    currentTarget = el;
    tip.textContent = el.getAttribute('data-tip');
    positionTip(el);
    tip.classList.add('show');
  });

  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('[data-tip]');
    if (el && el === currentTarget) {
      tip.classList.remove('show');
      currentTarget = null;
    }
  });
}

window.AIG = window.AIG || {};
window.AIG.initTheme = initTheme;
