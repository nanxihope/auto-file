/* ===== Scroll Reveal, Bar Animations, Tabs ===== */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  reveals.forEach((el) => revealObserver.observe(el));
}

function initBarAnimations() {
  const bars = document.querySelectorAll('.chart-bar-inner, .vi-bar-inner');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.w;
        if (w) entry.target.style.width = `${w}%`;
      }
    });
  }, { threshold: 0.3 });
  bars.forEach((el) => barObserver.observe(el));
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });
}

window.AIG = window.AIG || {};
window.AIG.initReveal = initReveal;
window.AIG.initBarAnimations = initBarAnimations;
window.AIG.initTabs = initTabs;
