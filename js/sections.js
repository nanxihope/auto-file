/* ===== Collapsible Sections ===== */
function toggleSec(title) {
  if (title.classList.contains('flipping')) return;
  const body = title.parentNode.querySelector('.section-body');
  if (!body) return;

  title.classList.add('flipping');
  setTimeout(() => title.classList.remove('flipping'), 250);

  const isOpen = !body.classList.contains('collapsed');
  title.classList.toggle('collapsed', isOpen);

  if (isOpen) {
    const h = body.scrollHeight;
    body.style.height = `${h}px`;
    requestAnimationFrame(() => {
      body.classList.add('collapsed');
      requestAnimationFrame(() => { body.style.height = '0px'; });
    });
  } else {
    body.classList.remove('collapsed');
    const h = body.scrollHeight;
    body.style.height = '0px';
    requestAnimationFrame(() => {
      body.style.height = `${h}px`;
      body.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'height') {
          body.style.height = 'auto';
          body.removeEventListener('transitionend', handler);
        }
      });
    });
  }
}

function initSections() {
  document.querySelectorAll('.section-desc').forEach((desc) => {
    const bodyEl = desc.closest('.section-body');
    if (bodyEl) {
      const title = bodyEl.previousElementSibling;
      if (title?.classList.contains('section-title')) {
        bodyEl.parentNode.insertBefore(desc, bodyEl);
      }
    }
  });

  document.querySelectorAll('.section-title').forEach((title) => {
    title.addEventListener('click', () => toggleSec(title));
  });
}

window.AIG = window.AIG || {};
window.AIG.initSections = initSections;
