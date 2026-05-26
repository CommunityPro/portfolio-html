/**
 * Tests for the enhancement script embedded in src/index.html:
 *  - Feature 1: buildQuickJump() — adaptive quick-jump navigation
 *  - Feature 2: applyTheme() / repaintCharts() / buildToggle() — theme switcher
 *  - Feature 5: injectTooltips() — competency level tooltips
 *
 * Functions are extracted and tested in isolation using a jsdom environment.
 */

'use strict';

// ── HELPERS ────────────────────────────────────────────────────────────────────

/**
 * Recreates the SECTIONS constant and buildQuickJump() from the enh-script block
 * so it can be unit-tested.
 */
function makeQuickJumpModule() {
  const SECTIONS = [
    { id: 'summary',        label: 'Summary' },
    { id: 'competencies',   label: 'Skills' },
    { id: 'experience',     label: 'Experience' },
    { id: 'transformation', label: 'Portfolio' },
    { id: 'kpi',            label: 'KPIs' },
    { id: 'dashboard',      label: 'Dashboard' },
    { id: 'education',      label: 'Credentials' }
  ];

  function buildQuickJump() {
    var wrap = document.createElement('div');
    wrap.className = 'quick-jump';

    var trigger = document.createElement('button');
    trigger.className = 'quick-jump-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Quick jump to section');
    trigger.innerHTML =
      '<span class="qj-accent">Quick Jump</span>' +
      '<svg class="qj-chev" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

    var overlay = document.createElement('div');
    overlay.className = 'quick-jump-overlay';

    var menu = document.createElement('div');
    menu.className = 'quick-jump-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'Quick jump navigation');

    SECTIONS.forEach(function (s) {
      var a = document.createElement('a');
      a.className = 'qj-link';
      a.href = '#' + s.id;
      a.textContent = s.label;
      a.setAttribute('role', 'menuitem');
      a.setAttribute('data-qj', s.id);
      a.addEventListener('click', function () { close(); });
      menu.appendChild(a);
    });

    function open() {
      wrap.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      document.addEventListener('keydown', onKey);
    }
    function close() {
      wrap.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); trigger.focus(); }
      if (e.key === 'Tab') {
        var f = menu.querySelectorAll('.qj-link');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    trigger.addEventListener('click', function () {
      wrap.classList.contains('open') ? close() : open();
    });
    overlay.addEventListener('click', close);

    wrap.appendChild(trigger);
    wrap.appendChild(overlay);
    wrap.appendChild(menu);

    wrap.__sync = function (activeId) {
      menu.querySelectorAll('.qj-link').forEach(function (l) {
        l.classList.toggle('is-active', l.getAttribute('data-qj') === activeId);
      });
    };

    return { wrap, trigger, overlay, menu, open, close };
  }

  return { SECTIONS, buildQuickJump };
}

/**
 * Recreates applyTheme, repaintCharts, buildToggle from the enh-script block.
 */
function makeThemeModule() {
  const STORE = 'mohanad-theme';
  const root = document.documentElement;

  function repaintCharts(t) {
    if (typeof window.Chart === 'undefined' || !window.Chart.instances) return;
    var grid = (t === 'light') ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)';
    var tick = (t === 'light') ? '#475569' : '#94A3B8';
    var lbl  = (t === 'light') ? '#334155' : '#CBD5E1';
    try {
      window.Chart.defaults.color = lbl;
      window.Chart.defaults.borderColor = grid;
      Object.keys(window.Chart.instances).forEach(function (k) {
        var c = window.Chart.instances[k];
        if (!c || !c.options) return;
        var sc = c.options.scales || {};
        Object.keys(sc).forEach(function (ax) {
          if (sc[ax].grid)  sc[ax].grid.color  = grid;
          if (sc[ax].ticks) sc[ax].ticks.color = tick;
        });
        if (c.options.plugins && c.options.plugins.legend && c.options.plugins.legend.labels)
          c.options.plugins.legend.labels.color = lbl;
        c.update('none');
      });
    } catch (e) {}
  }

  function applyTheme(t, animate) {
    if (animate) {
      root.classList.add('theme-anim');
      setTimeout(function () { root.classList.remove('theme-anim'); }, 560);
    }
    if (t === 'light') root.classList.add('light');
    else root.classList.remove('light');
    try { localStorage.setItem(STORE, t); } catch (e) {}
    repaintCharts(t);
  }

  function buildToggle() {
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle light or dark theme');
    btn.setAttribute('title', 'Toggle theme');
    btn.innerHTML =
      '<svg class="ico-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '<svg class="ico-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2"/></svg>';
    btn.addEventListener('click', function () {
      var next = root.classList.contains('light') ? 'dark' : 'light';
      applyTheme(next, true);
    });
    return btn;
  }

  return { applyTheme, repaintCharts, buildToggle, STORE };
}

/**
 * Recreates injectTooltips and TIPS from the enh-script block.
 */
function makeTooltipModule() {
  var TIPS = {
    expert:     { label: 'Expert · 5/5',     desc: 'Deep, board-level mastery — leads strategy, sets standards, and mentors teams in this domain.' },
    advanced:   { label: 'Advanced · 4/5',   desc: 'Strong independent command — delivers complex work end-to-end with minimal oversight.' },
    proficient: { label: 'Proficient · 3/5', desc: 'Solid working capability — executes core tasks reliably and contributes to larger initiatives.' }
  };

  function injectTooltips() {
    var rows = document.querySelectorAll('.skill-row');
    rows.forEach(function (row) {
      var lvl = row.querySelector('.level');
      if (!lvl || row.querySelector('.skill-tip')) return;
      var cls = lvl.classList.contains('expert') ? 'expert'
              : lvl.classList.contains('advanced') ? 'advanced'
              : 'proficient';
      var nameEl = row.querySelector('.name');
      var name = nameEl ? nameEl.textContent.trim() : '';
      var t = TIPS[cls];
      lvl.setAttribute('tabindex', '0');
      lvl.setAttribute('role', 'img');
      lvl.setAttribute('aria-label', name + ' — ' + t.label);
      var tip = document.createElement('span');
      tip.className = 'skill-tip';
      tip.setAttribute('role', 'tooltip');
      tip.innerHTML =
        '<span class="skill-tip-level ' + cls + '">' + t.label + '</span>' +
        '<span class="skill-tip-desc">' + t.desc + '</span>';
      lvl.insertAdjacentElement('afterend', tip);
    });
  }

  return { injectTooltips, TIPS };
}

// ══════════════════════════════════════════════════════════════════════════════
// Feature 1 · buildQuickJump
// ══════════════════════════════════════════════════════════════════════════════

describe('buildQuickJump()', () => {
  let SECTIONS, buildQuickJump;

  beforeEach(() => {
    ({ SECTIONS, buildQuickJump } = makeQuickJumpModule());
    // Clean up any lingering state on root
    document.documentElement.classList.remove('light');
  });

  test('returns a .quick-jump wrapper element', () => {
    const { wrap } = buildQuickJump();
    expect(wrap.classList.contains('quick-jump')).toBe(true);
  });

  test('trigger button has correct ARIA attributes', () => {
    const { trigger } = buildQuickJump();
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-label')).toBe('Quick jump to section');
    expect(trigger.type).toBe('button');
  });

  test('trigger contains .qj-accent "Quick Jump" text', () => {
    const { trigger } = buildQuickJump();
    expect(trigger.querySelector('.qj-accent').textContent).toBe('Quick Jump');
  });

  test('trigger contains .qj-chev SVG', () => {
    const { trigger } = buildQuickJump();
    expect(trigger.querySelector('.qj-chev')).not.toBeNull();
  });

  test('overlay has .quick-jump-overlay class', () => {
    const { overlay } = buildQuickJump();
    expect(overlay.classList.contains('quick-jump-overlay')).toBe(true);
  });

  test('menu has role="menu" and aria-label', () => {
    const { menu } = buildQuickJump();
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-label')).toBe('Quick jump navigation');
  });

  test(`menu contains ${7} section links`, () => {
    const { menu } = buildQuickJump();
    const links = menu.querySelectorAll('.qj-link');
    expect(links.length).toBe(SECTIONS.length);
  });

  test('each menu link has correct href, data-qj, and role', () => {
    const { menu } = buildQuickJump();
    const links = Array.from(menu.querySelectorAll('.qj-link'));
    SECTIONS.forEach((s, i) => {
      expect(links[i].getAttribute('href')).toBe('#' + s.id);
      expect(links[i].getAttribute('data-qj')).toBe(s.id);
      expect(links[i].getAttribute('role')).toBe('menuitem');
      expect(links[i].textContent).toBe(s.label);
    });
  });

  test('clicking trigger opens menu (adds .open, sets aria-expanded="true")', () => {
    const { wrap, trigger } = buildQuickJump();
    document.body.appendChild(wrap);
    trigger.click();
    expect(wrap.classList.contains('open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    document.body.removeChild(wrap);
  });

  test('clicking trigger again closes menu', () => {
    const { wrap, trigger } = buildQuickJump();
    document.body.appendChild(wrap);
    trigger.click(); // open
    trigger.click(); // close
    expect(wrap.classList.contains('open')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    document.body.removeChild(wrap);
  });

  test('clicking overlay closes menu', () => {
    const { wrap, trigger, overlay } = buildQuickJump();
    document.body.appendChild(wrap);
    trigger.click(); // open
    overlay.click(); // close via overlay
    expect(wrap.classList.contains('open')).toBe(false);
    document.body.removeChild(wrap);
  });

  test('close() removes .open from wrapper', () => {
    const { wrap, trigger, close } = buildQuickJump();
    document.body.appendChild(wrap);
    trigger.click(); // open
    close();
    expect(wrap.classList.contains('open')).toBe(false);
    document.body.removeChild(wrap);
  });

  test('__sync marks correct link as .is-active', () => {
    const { wrap } = buildQuickJump();
    document.body.appendChild(wrap);
    wrap.__sync('experience');
    const links = wrap.querySelectorAll('.qj-link');
    links.forEach(l => {
      if (l.getAttribute('data-qj') === 'experience') {
        expect(l.classList.contains('is-active')).toBe(true);
      } else {
        expect(l.classList.contains('is-active')).toBe(false);
      }
    });
    document.body.removeChild(wrap);
  });

  test('__sync with null clears all .is-active', () => {
    const { wrap } = buildQuickJump();
    document.body.appendChild(wrap);
    wrap.__sync('kpi');   // set one active
    wrap.__sync(null);    // clear all
    const active = wrap.querySelectorAll('.qj-link.is-active');
    expect(active.length).toBe(0);
    document.body.removeChild(wrap);
  });

  test('Escape key closes the menu', () => {
    const { wrap, trigger } = buildQuickJump();
    document.body.appendChild(wrap);
    trigger.click(); // open
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escEvent);
    expect(wrap.classList.contains('open')).toBe(false);
    document.body.removeChild(wrap);
  });

  test('SECTIONS array has exactly 7 items', () => {
    expect(SECTIONS).toHaveLength(7);
  });

  test('SECTIONS contains all expected section IDs', () => {
    const ids = SECTIONS.map(s => s.id);
    expect(ids).toContain('summary');
    expect(ids).toContain('competencies');
    expect(ids).toContain('experience');
    expect(ids).toContain('transformation');
    expect(ids).toContain('kpi');
    expect(ids).toContain('dashboard');
    expect(ids).toContain('education');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Feature 2 · applyTheme / buildToggle
// ══════════════════════════════════════════════════════════════════════════════

describe('applyTheme()', () => {
  let applyTheme, buildToggle, STORE;

  beforeEach(() => {
    ({ applyTheme, buildToggle, STORE } = makeThemeModule());
    // Ensure clean state
    document.documentElement.classList.remove('light', 'theme-anim');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove('light', 'theme-anim');
    localStorage.clear();
    jest.useRealTimers();
  });

  test('applyTheme("light") adds .light to <html>', () => {
    applyTheme('light', false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('applyTheme("dark") removes .light from <html>', () => {
    document.documentElement.classList.add('light');
    applyTheme('dark', false);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  test('applyTheme saves value to localStorage with correct key', () => {
    applyTheme('light', false);
    expect(localStorage.getItem(STORE)).toBe('light');
    applyTheme('dark', false);
    expect(localStorage.getItem(STORE)).toBe('dark');
  });

  test('applyTheme("light", true) adds .theme-anim temporarily', () => {
    jest.useFakeTimers();
    applyTheme('light', true);
    expect(document.documentElement.classList.contains('theme-anim')).toBe(true);
    jest.advanceTimersByTime(560);
    expect(document.documentElement.classList.contains('theme-anim')).toBe(false);
  });

  test('applyTheme("light", false) does NOT add .theme-anim', () => {
    applyTheme('light', false);
    expect(document.documentElement.classList.contains('theme-anim')).toBe(false);
  });

  test('STORE key is "mohanad-theme"', () => {
    expect(STORE).toBe('mohanad-theme');
  });
});

describe('buildToggle()', () => {
  let buildToggle, applyTheme, STORE;

  beforeEach(() => {
    ({ buildToggle, applyTheme, STORE } = makeThemeModule());
    document.documentElement.classList.remove('light', 'theme-anim');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove('light', 'theme-anim');
    localStorage.clear();
  });

  test('returns a <button> element', () => {
    const btn = buildToggle();
    expect(btn.tagName.toLowerCase()).toBe('button');
  });

  test('button has class .theme-toggle', () => {
    const btn = buildToggle();
    expect(btn.classList.contains('theme-toggle')).toBe(true);
  });

  test('button type is "button"', () => {
    const btn = buildToggle();
    expect(btn.type).toBe('button');
  });

  test('button has correct aria-label', () => {
    const btn = buildToggle();
    expect(btn.getAttribute('aria-label')).toBe('Toggle light or dark theme');
  });

  test('button has correct title attribute', () => {
    const btn = buildToggle();
    expect(btn.getAttribute('title')).toBe('Toggle theme');
  });

  test('button contains .ico-moon SVG', () => {
    const btn = buildToggle();
    expect(btn.querySelector('.ico-moon')).not.toBeNull();
  });

  test('button contains .ico-sun SVG', () => {
    const btn = buildToggle();
    expect(btn.querySelector('.ico-sun')).not.toBeNull();
  });

  test('both SVGs have aria-hidden="true"', () => {
    const btn = buildToggle();
    const svgs = btn.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });

  test('clicking toggle switches from dark to light', () => {
    const btn = buildToggle();
    // Start dark (no .light class)
    document.documentElement.classList.remove('light');
    btn.click();
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('clicking toggle twice returns to dark', () => {
    const btn = buildToggle();
    document.documentElement.classList.remove('light');
    btn.click(); // → light
    btn.click(); // → dark
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
});

describe('repaintCharts()', () => {
  let repaintCharts;

  beforeEach(() => {
    ({ repaintCharts } = makeThemeModule());
  });

  test('does nothing when Chart is undefined', () => {
    const origChart = window.Chart;
    delete window.Chart;
    expect(() => repaintCharts('light')).not.toThrow();
    window.Chart = origChart;
  });

  test('does nothing when Chart.instances is undefined', () => {
    window.Chart = { defaults: { color: '#000', borderColor: '#000' }, instances: undefined };
    expect(() => repaintCharts('light')).not.toThrow();
    delete window.Chart;
  });

  test('updates Chart.defaults.color for light theme', () => {
    window.Chart = {
      defaults: { color: '#CBD5E1', borderColor: 'rgba(255,255,255,0.06)', plugins: { legend: { labels: {} } } },
      instances: {}
    };
    repaintCharts('light');
    expect(window.Chart.defaults.color).toBe('#334155');
    delete window.Chart;
  });

  test('updates Chart.defaults.color for dark theme', () => {
    window.Chart = {
      defaults: { color: '#334155', borderColor: 'rgba(15,23,42,0.08)', plugins: { legend: { labels: {} } } },
      instances: {}
    };
    repaintCharts('dark');
    expect(window.Chart.defaults.color).toBe('#CBD5E1');
    delete window.Chart;
  });

  test('updates Chart.defaults.borderColor for light theme', () => {
    window.Chart = {
      defaults: { color: '#CBD5E1', borderColor: 'rgba(255,255,255,0.06)', plugins: { legend: { labels: {} } } },
      instances: {}
    };
    repaintCharts('light');
    expect(window.Chart.defaults.borderColor).toBe('rgba(15,23,42,0.08)');
    delete window.Chart;
  });

  test('calls update on each Chart instance', () => {
    const updateMock = jest.fn();
    window.Chart = {
      defaults: { color: '', borderColor: '', plugins: { legend: { labels: {} } } },
      instances: {
        c1: { options: { scales: {}, plugins: { legend: { labels: {} } } }, update: updateMock },
        c2: { options: { scales: {}, plugins: { legend: { labels: {} } } }, update: updateMock }
      }
    };
    repaintCharts('dark');
    expect(updateMock).toHaveBeenCalledTimes(2);
    expect(updateMock).toHaveBeenCalledWith('none');
    delete window.Chart;
  });

  test('updates grid and tick colors on chart scales', () => {
    const updateMock = jest.fn();
    window.Chart = {
      defaults: { color: '', borderColor: '', plugins: { legend: { labels: {} } } },
      instances: {
        c1: {
          options: {
            scales: {
              x: { grid: { color: '' }, ticks: { color: '' } },
              y: { grid: { color: '' }, ticks: { color: '' } }
            },
            plugins: { legend: { labels: { color: '' } } }
          },
          update: updateMock
        }
      }
    };
    repaintCharts('light');
    expect(window.Chart.instances.c1.options.scales.x.grid.color).toBe('rgba(15,23,42,0.08)');
    expect(window.Chart.instances.c1.options.scales.x.ticks.color).toBe('#475569');
    delete window.Chart;
  });

  test('does not throw on null chart instances', () => {
    window.Chart = {
      defaults: { color: '', borderColor: '', plugins: { legend: { labels: {} } } },
      instances: { c1: null, c2: undefined }
    };
    expect(() => repaintCharts('dark')).not.toThrow();
    delete window.Chart;
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Feature 5 · injectTooltips
// ══════════════════════════════════════════════════════════════════════════════

describe('injectTooltips()', () => {
  let injectTooltips, TIPS;
  let container;

  beforeEach(() => {
    ({ injectTooltips, TIPS } = makeTooltipModule());
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function makeSkillRow(levelClass, nameText) {
    const row = document.createElement('div');
    row.className = 'skill-row';
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = nameText || 'IFRS Reporting';
    const level = document.createElement('span');
    level.className = 'level ' + levelClass;
    level.textContent = levelClass.charAt(0).toUpperCase() + levelClass.slice(1);
    row.appendChild(name);
    row.appendChild(level);
    return row;
  }

  test('injects .skill-tip into each .skill-row', () => {
    container.appendChild(makeSkillRow('expert', 'IFRS'));
    container.appendChild(makeSkillRow('advanced', 'SAP'));
    injectTooltips();
    expect(container.querySelectorAll('.skill-tip').length).toBe(2);
  });

  test('skill-tip has role="tooltip"', () => {
    container.appendChild(makeSkillRow('expert', 'IFRS'));
    injectTooltips();
    const tip = container.querySelector('.skill-tip');
    expect(tip.getAttribute('role')).toBe('tooltip');
  });

  test('.skill-tip-level has the correct class (expert)', () => {
    container.appendChild(makeSkillRow('expert', 'IFRS'));
    injectTooltips();
    const tipLevel = container.querySelector('.skill-tip-level');
    expect(tipLevel.classList.contains('expert')).toBe(true);
  });

  test('.skill-tip-level has the correct class (advanced)', () => {
    container.appendChild(makeSkillRow('advanced', 'SAP'));
    injectTooltips();
    const tipLevel = container.querySelector('.skill-tip-level');
    expect(tipLevel.classList.contains('advanced')).toBe(true);
  });

  test('.skill-tip-level has the correct class (proficient)', () => {
    container.appendChild(makeSkillRow('proficient', 'Python'));
    injectTooltips();
    const tipLevel = container.querySelector('.skill-tip-level');
    expect(tipLevel.classList.contains('proficient')).toBe(true);
  });

  test('.skill-tip-level contains correct label text', () => {
    container.appendChild(makeSkillRow('expert', 'IFRS'));
    injectTooltips();
    const tipLevel = container.querySelector('.skill-tip-level');
    expect(tipLevel.textContent).toBe(TIPS.expert.label);
  });

  test('.skill-tip-desc contains correct description text', () => {
    container.appendChild(makeSkillRow('advanced', 'SAP'));
    injectTooltips();
    const tipDesc = container.querySelector('.skill-tip-desc');
    expect(tipDesc.textContent).toBe(TIPS.advanced.desc);
  });

  test('sets tabindex="0" on .level element', () => {
    container.appendChild(makeSkillRow('expert', 'IFRS'));
    injectTooltips();
    const level = container.querySelector('.level');
    expect(level.getAttribute('tabindex')).toBe('0');
  });

  test('sets role="img" on .level element', () => {
    container.appendChild(makeSkillRow('expert', 'IFRS'));
    injectTooltips();
    const level = container.querySelector('.level');
    expect(level.getAttribute('role')).toBe('img');
  });

  test('aria-label on .level includes skill name and level label', () => {
    container.appendChild(makeSkillRow('expert', 'Power BI'));
    injectTooltips();
    const level = container.querySelector('.level');
    const ariaLabel = level.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/Power BI/);
    expect(ariaLabel).toMatch(/Expert/);
  });

  test('.skill-tip is inserted immediately after .level (nextSibling)', () => {
    container.appendChild(makeSkillRow('advanced', 'Odoo'));
    injectTooltips();
    const level = container.querySelector('.level');
    expect(level.nextElementSibling.classList.contains('skill-tip')).toBe(true);
  });

  test('does not inject duplicate tooltips when called twice', () => {
    container.appendChild(makeSkillRow('advanced', 'Oracle'));
    injectTooltips();
    injectTooltips(); // second call — should be idempotent
    expect(container.querySelectorAll('.skill-tip').length).toBe(1);
  });

  test('does not inject tooltip into .skill-row with no .level', () => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    // No .level element
    container.appendChild(row);
    expect(() => injectTooltips()).not.toThrow();
    expect(container.querySelector('.skill-tip')).toBeNull();
  });

  test('TIPS.expert label is "Expert · 5/5"', () => {
    expect(TIPS.expert.label).toBe('Expert · 5/5');
  });

  test('TIPS.advanced label is "Advanced · 4/5"', () => {
    expect(TIPS.advanced.label).toBe('Advanced · 4/5');
  });

  test('TIPS.proficient label is "Proficient · 3/5"', () => {
    expect(TIPS.proficient.label).toBe('Proficient · 3/5');
  });

  test('defaults to proficient when level has no expert/advanced class', () => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = 'Unknown Skill';
    const level = document.createElement('span');
    level.className = 'level'; // no expert/advanced/proficient
    row.appendChild(name);
    row.appendChild(level);
    container.appendChild(row);
    injectTooltips();
    const tipLevel = container.querySelector('.skill-tip-level');
    expect(tipLevel.classList.contains('proficient')).toBe(true);
  });

  test('handles multiple skill rows correctly', () => {
    const skills = [
      { cls: 'expert', name: 'IFRS' },
      { cls: 'advanced', name: 'SAP' },
      { cls: 'proficient', name: 'Python' },
      { cls: 'expert', name: 'Corporate Tax' }
    ];
    skills.forEach(s => container.appendChild(makeSkillRow(s.cls, s.name)));
    injectTooltips();
    const tips = container.querySelectorAll('.skill-tip');
    expect(tips.length).toBe(4);
    // Each tip level class should match the skill level
    const levelEls = container.querySelectorAll('.skill-tip-level');
    expect(levelEls[0].classList.contains('expert')).toBe(true);
    expect(levelEls[1].classList.contains('advanced')).toBe(true);
    expect(levelEls[2].classList.contains('proficient')).toBe(true);
    expect(levelEls[3].classList.contains('expert')).toBe(true);
  });
});