/* ===== App Entry Point ===== */
const DEFAULT_VERSION = '2026-05';

function initUI() {
  const canvas = AIG.initParticles();
  AIG.initTheme(canvas);
  AIG.initSections();
  AIG.initNavigation();
  AIG.initBackToTop();
  AIG.initReveal();
  AIG.initBarAnimations();
  AIG.initTabs();
  initVersionSelector();
}

const isFileProtocol = () => window.location.protocol === 'file:';

function initVersionSelector() {
  const selector = document.getElementById('versionSelector');
  if (!selector) return;

  if (isFileProtocol()) {
    selector.style.display = 'none';
    return;
  }

  const btn = document.getElementById('versionBtn');
  const dropdown = document.getElementById('versionDropdown');
  const text = document.getElementById('versionText');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    selector.classList.toggle('open');
  });

  document.addEventListener('click', () => selector.classList.remove('open'));
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  const options = dropdown.querySelectorAll('.version-option');
  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      const newVersion = opt.dataset.value;
      options.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      text.textContent = opt.textContent;
      selector.classList.remove('open');
      switchVersion(newVersion);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') selector.classList.remove('open');
  });
}

async function switchVersion(version) {
  let data = await tryFetchData(version);
  if (!data && window.AIG_EMBEDDED_DATA) {
    data = window.AIG_EMBEDDED_DATA[version];
  }
  if (data) {
    AIG.renderPage(data);
    localStorage.setItem('dataVersion', version);
    AIG.initSections();
    AIG.initNavigation();
    AIG.initReveal();
    AIG.initBarAnimations();
    AIG.initTabs();
  } else {
    console.error('Failed to load version:', version);
  }
}

async function tryFetchData(version) {
  try {
    const resp = await fetch(`data/${version}.json`);
    if (resp.ok) return await resp.json();
  } catch { /* file:// or CORS blocked */ }
  return null;
}

async function init() {
  const version = localStorage.getItem('dataVersion') || DEFAULT_VERSION;

  let data = await tryFetchData(version);

  if (!data && window.AIG_EMBEDDED_DATA) {
    data = window.AIG_EMBEDDED_DATA[version] || window.AIG_EMBEDDED_DATA[DEFAULT_VERSION];
  }

  if (!data) {
    console.error('No data available');
    return;
  }

  AIG.renderPage(data);
  initUI();

  if (!isFileProtocol()) {
    const text = document.getElementById('versionText');
    if (text) {
      const activeOpt = document.querySelector('.version-option.active');
      if (activeOpt) text.textContent = activeOpt.textContent;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
