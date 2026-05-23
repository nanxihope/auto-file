/* ===== Sidebar Navigation & Back to Top ===== */
let closeNav;

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const sidebar = document.getElementById('sidebar');
  const navLinks = document.querySelectorAll('.nav-link');

  const openNav = () => {
    sidebar.classList.add('open');
    navOverlay.classList.add('active');
    navToggle.classList.add('shifted');
  };
  closeNav = () => {
    sidebar.classList.remove('open');
    navOverlay.classList.remove('active');
    navToggle.classList.remove('shifted');
  };

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const opening = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open');
    navOverlay.classList.toggle('active');
    navToggle.classList.toggle('shifted', opening);
  });

  navOverlay.addEventListener('click', closeNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.target;
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNav();
    });
  });
}

function initBackToTop() {
  const backTopFloat = document.getElementById('backTopFloat');
  const backTopNav = document.getElementById('backTopNav');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  if (backTopFloat) backTopFloat.addEventListener('click', scrollToTop);
  if (backTopNav) backTopNav.addEventListener('click', scrollToTop);

  window.addEventListener('scroll', () => {
    backTopFloat?.classList.toggle('visible', window.scrollY > 400);
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
}

window.AIG = window.AIG || {};
window.AIG.initNavigation = () => {
  closeNav = () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('navOverlay').classList.remove('active');
  };
  initNavigation();
};
window.AIG.initBackToTop = initBackToTop;
