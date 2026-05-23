/* ===== Data-Driven Renderer ===== */
let currentData = null;

const renderTierItem = (platform, tag, tagClass, isFair) => {
  if (isFair) {
    return `<div class="tier-item">
      <div class="tier-header"><span class="tier-platform">${platform.name}</span><span class="tag ${tagClass}">${tag}</span></div>
      <div class="tier-compare">
        ${platform.tiers.map((t) => `<div class="tier-col tier-col-high">
          <div class="tier-col-price">${t.price} · ${t.tier}</div>
          <div class="tier-col-model">${t.model}</div>
          <div class="tier-col-note">${t.note}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }
  return `<div class="tier-item">
    <div class="tier-header"><span class="tier-platform">${platform.name}</span><span class="tag ${platform.tagClass || tagClass}">${platform.tag || tag}</span></div>
    <div class="tier-compare">
      <div class="tier-col tier-col-low">
        <div class="tier-col-price">${platform.low.price} · ${platform.low.tier}</div>
        <div class="tier-col-model">${platform.low.model}</div>
        <div class="tier-col-note">${platform.low.note}</div>
      </div>
      <div class="tier-col tier-col-high">
        <div class="tier-col-price">${platform.high.price} · ${platform.high.tier}</div>
        <div class="tier-col-model">${platform.high.model}</div>
        <div class="tier-col-note">${platform.high.note}</div>
      </div>
    </div>
  </div>`;
};

const renderSec1 = (sec) => {
  const castration = sec.tierTypes.find((t) => t.id === 'castration');
  const fair = sec.tierTypes.find((t) => t.id === 'fair');
  return `<div class="cols">
    <div class="glass reveal">
      <h3 style="margin-bottom:12px;color:var(--${castration.color})">${castration.title}</h3>
      <p style="color:var(--dim);font-size:0.9rem;margin-bottom:16px">${castration.desc}</p>
      <div class="tier-list">${castration.platforms.map((p) => renderTierItem(p, castration.tag, castration.tagClass, false)).join('')}</div>
      <p style="margin-top:12px;font-size:0.85rem;color:var(--${castration.color})">${castration.warning}</p>
    </div>
    <div class="glass reveal">
      <h3 style="margin-bottom:12px;color:var(--${fair.color})">${fair.title}</h3>
      <p style="color:var(--dim);font-size:0.9rem;margin-bottom:16px">${fair.desc}</p>
      <div class="tier-list">${fair.platforms.map((p) => renderTierItem(p, fair.tag, fair.tagClass, true)).join('')}</div>
      <p style="margin-top:12px;font-size:0.85rem;color:var(--${fair.color})">${fair.conclusion}</p>
    </div>
  </div>`;
};

const renderSec2 = (sec) => {
  return `<div class="platform-grid reveal">${sec.platforms.map((p) =>
    `<div class="platform-card-sm">
      <div class="pc-header"><strong>${p.name}</strong><span class="tag ${p.tagClass}">${p.tag}</span></div>
      <div class="pc-tiers">${p.tiers.map((t) =>
        `<div class="pc-tier">
          <span class="pc-name">${t.name}</span>
          <span class="pc-price">${t.price}</span>
          <span class="pc-limit"${t.limitColor ? ` style="color:var(--${t.limitColor})"` : ''}>${t.limit}</span>
        </div>`).join('')}</div>
      <div class="pc-footer">${p.footer}</div>
    </div>`).join('')}</div>`;
};

const renderSec3 = (sec) => {
  const notes = sec.benchmarkNotes || sec.notes || [];
  return `<div class="cols">${sec.benchmarks.map((b) => {
    const [gFrom = '', gTo = ''] = (b.gradient || '').split(',');
    return `<div class="glass reveal" style="text-align:center;padding:32px">
      <div style="font-size:2.8rem;font-weight:700;background:linear-gradient(135deg,${gFrom},${gTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent">${b.swe || b.score}</div>
      <div style="margin-top:6px;font-weight:600;font-size:0.95rem">${b.name || b.model}</div>
      <div class="score-badge ${b.badgeClass || ''}" style="margin-top:8px;${b.badgeStyle || ''}">${b.badge}</div>
      <div style="margin-top:10px;font-size:0.78rem;color:var(--dim)">${b.details}</div>
    </div>`;
  }).join('')}</div>
  <div class="glass reveal" style="margin-top:24px;padding:20px 24px">
    <h4 style="margin-bottom:12px;color:var(--dim);font-size:0.9rem">📊 综合评测说明</h4>
    <ul style="font-size:0.85rem;color:var(--dim);line-height:1.8;padding-left:18px">
      ${notes.map((n) => `<li>${n}</li>`).join('')}
    </ul>
  </div>`;
};

const renderSec4 = (sec) => {
  return `<div class="glass reveal">${sec.hallucinations.map((h) =>
    `<div class="chart-row">
      <div class="chart-label">${h.model}</div>
      <div class="chart-bar"><div class="chart-bar-inner ${h.barClass}" data-w="${h.rate || h.dataW}">${h.barLabel || (h.rate + '%')}</div></div>
      <div class="chart-val">${h.label || h.level}</div>
    </div>`).join('')}
    <div style="margin-top:20px;padding:14px;background:rgba(243,156,18,0.08);border-radius:8px;font-size:0.85rem;border:1px solid rgba(243,156,18,0.2);color:#b7860b">
      <strong style="color:#d68910">关键提醒：</strong>${sec.warning}
    </div>
  </div>`;
};

const renderSec5 = (sec) => {
  return `<div class="glass reveal">${sec.contexts.map((c) =>
    `<div class="chart-row">
      <div class="chart-label">${c.model}</div>
      <div class="chart-bar"><div class="chart-bar-inner ${c.barClass || 'purple'}" data-w="${c.barWidth || c.dataW}">${c.barLabel || (c.tokens + ' Tokens')}</div></div>
      <div class="chart-val">${c.val || c.tokens}</div>
    </div>`).join('')}</div>`;
};

const renderSec6 = (sec) => {
  return `<div class="cols">${sec.valueIndex.map((v) => {
    const [gFrom = '', gTo = ''] = (v.gradient || '').split(',');
    return `<div class="glass vi-card reveal">
      <div class="vi-num" style="background:linear-gradient(135deg,${gFrom},${gTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent">${v.score}</div>
      <div class="vi-label">${v.name || v.label}</div>
      <div class="vi-bar"><div class="vi-bar-inner ${v.barClass}" data-w="${v.score}" style="background:linear-gradient(90deg,${gFrom},${gTo})"></div></div>
    </div>`;
  }).join('')}</div>`;
};

const renderSec7 = (sec) => {
  const renderPlatformCard = (p) => {
    const [logoFrom = '', logoTo = ''] = (p.logoGradient || '').split(',');
    return `<div class="platform-card">
      <div class="card-header">
        <div class="logo" style="background:linear-gradient(135deg,${logoFrom},${logoTo})">${p.logoLetter || ''}</div>
        <div><h3>${p.name} <span class="tag ${p.tagClass}">${p.tag}</span></h3><div class="pos">${p.pos}</div></div>
      </div>
      <div class="detail-grid">${p.details.map((d) =>
        `<div class="detail-item"><span>${d.label}</span><strong>${d.highlight ? `<span style="color:var(--${d.highlight})">${d.value}</span>` : d.value}</strong></div>`
      ).join('')}</div>
    </div>`;
  };
  return `<div class="glass reveal">
    <div class="tab-btns">${sec.tabs.map((tab, i) =>
      `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${tab.id}">${tab.label}</button>`
    ).join('')}</div>
    ${sec.tabs.map((tab, i) =>
      `<div class="tab-content${i === 0 ? ' active' : ''}" id="${tab.id}">
        ${tab.platforms.map(renderPlatformCard).join('')}
      </div>`
    ).join('')}
  </div>`;
};

const renderSec8 = (sec) => {
  return `<div class="cols">${sec.recommendations.map((r) => {
    const borderStyle = r.borderColor ? `border-left-color:${r.borderColor.charAt(0) === '#' ? r.borderColor : `var(--${r.borderColor})`}` : '';
    return `<div class="glass rec-card${r.best ? ' best' : ''} reveal" style="${borderStyle}">
      <h4>${r.title}</h4>
      <ul>${r.items.map((item) => `<li>${item}</li>`).join('')}</ul>
      <div class="price">${r.price}</div>
      <div style="margin-top:8px;font-size:0.8rem;color:${r.platformColor || 'var(--dim)'}">${r.platform}</div>
    </div>`;
  }).join('')}</div>`;
};

const renderSec9 = (sec) => {
  return `<div class="cols">${sec.tips.map((tip) =>
    `<div class="glass reveal">
      <h4 style="margin-bottom:12px;color:var(--${tip.color})">${tip.title}</h4>
      <ul style="list-style:none;font-size:0.9rem;color:var(--dim)">
        ${tip.items.map((item) => `<li style="padding:6px 0">${item}</li>`).join('')}
      </ul>
    </div>`).join('')}</div>`;
};

const sectionRenderers = {
  sec1: renderSec1, sec2: renderSec2, sec3: renderSec3,
  sec4: renderSec4, sec5: renderSec5, sec6: renderSec6,
  sec7: renderSec7, sec8: renderSec8, sec9: renderSec9
};

const renderSection = (sec) => {
  const renderer = sectionRenderers[sec.id];
  const bodyContent = renderer ? renderer(sec) : `<p>Section ${sec.id} renderer not implemented</p>`;
  return `<div class="section" id="${sec.id}">
    <div class="section-title reveal"><div class="icon">${sec.num}</div>${sec.title}</div>
    ${sec.desc ? `<p class="section-desc reveal">${sec.desc}</p>` : ''}
    <div class="section-body">${bodyContent}</div>
  </div>`;
};

function renderPage(data) {
  currentData = data;

  const header = document.getElementById('pageHeader');
  if (header) {
    header.innerHTML = `<h1>${data.title}</h1>
      <p class="subtitle">${data.subtitle}</p>
      <div class="meta">${data.meta.map((m) => `<span>${m}</span>`).join('')}</div>`;
  }

  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.innerHTML = data.navItems.map((item) =>
      `<button class="nav-link" data-target="${item.target}"><span class="num">${item.num}</span>${item.label}</button>`
    ).join('');
  }

  const main = document.getElementById('mainContent');
  if (main) {
    main.innerHTML = data.sections.map(renderSection).join('');
  }

  const footer = document.getElementById('pageFooter');
  if (footer) {
    footer.innerHTML = `<p>${data.disclaimer}</p><p style="margin-top:8px">订阅前请以官方最新页面为准 | 支持明亮/黑暗主题切换</p>`;
  }

  const versionSelect = document.getElementById('versionSelect');
  if (versionSelect && data.version) {
    versionSelect.value = data.version;
  }

  // Re-apply direct backdrop after DOM rebuild (glass may already be on)
  if (document.body.getAttribute('data-glass') === 'on' && AIG.applyDirectBackdrop) {
    const mode = window.pBlurMode || 'global';
    const blurVal = typeof window.pBlurValue === 'number' ? window.pBlurValue : 6;
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const sat = isDark ? '1.8' : '2.2';
    AIG.applyDirectBackdrop(mode === 'global' ? 'none' : `blur(${blurVal}px) saturate(${sat})`);
  }
}

window.AIG = window.AIG || {};
window.AIG.renderPage = renderPage;
window.AIG.getData = () => currentData;
