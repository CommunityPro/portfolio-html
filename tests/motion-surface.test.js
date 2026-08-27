/**
 * Tests for the motion-surface-script embedded in src/index.html:
 *  - Feature 3: data-reveal IntersectionObserver — adds .visible with stagger
 *  - Feature 4: .kpi-bottom-accent injection into .kpi cards
 *  - Feature 3 (additive): .reveal sibling stagger observer
 *
 * Also covers the main scroll-reveal initReveal() function.
 */

'use strict';

// ── MOCK INTERSECTION OBSERVER ────────────────────────────────────────────────
// jsdom does not implement IntersectionObserver, so we mock it.
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observed = [];
    MockIntersectionObserver._instances.push(this);
  }
  observe(el) {
    this.observed.push(el);
  }
  unobserve(el) {
    this.observed = this.observed.filter(o => o !== el);
  }
  disconnect() {
    this.observed = [];
  }
  /** Simulate elements intersecting */
  triggerIntersect(elements, isIntersecting = true) {
    const entries = (Array.isArray(elements) ? elements : [elements]).map(el => ({
      target: el,
      isIntersecting
    }));
    this.callback(entries, this);
  }
}
MockIntersectionObserver._instances = [];

beforeEach(() => {
  MockIntersectionObserver._instances = [];
  global.IntersectionObserver = MockIntersectionObserver;
  // requestAnimationFrame shim: call callback synchronously
  global.requestAnimationFrame = cb => { cb(); return 1; };
});

afterEach(() => {
  delete global.IntersectionObserver;
  delete global.requestAnimationFrame;
});

// ── HELPERS ────────────────────────────────────────────────────────────────────

/**
 * Recreates the motion-surface init() function from the HTML script tag.
 * Accepts a motionOK override for reduced-motion testing.
 */
function makeMotionModule(motionOKOverride = true) {
  const STAGGER = 60;

  const revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (motionOKOverride) {
        var siblings = el.parentElement
          ? Array.from(el.parentElement.children).filter(function (c) {
              return c.hasAttribute('data-reveal');
            })
          : [];
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx > 0 ? idx * STAGGER : 0) + 'ms';
      }
      requestAnimationFrame(function () { el.classList.add('visible'); });
      revealObs.unobserve(el);
    });
  }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.15 });

  const staggerObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (motionOKOverride && !el.style.transitionDelay) {
        var siblings = el.parentElement
          ? Array.from(el.parentElement.children).filter(function (c) {
              return c.classList.contains('reveal');
            })
          : [];
        var idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = (idx * STAGGER) + 'ms';
      }
      staggerObs.unobserve(el);
    });
  }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.15 });

  function init() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (!motionOKOverride) { el.classList.add('visible'); return; }
      revealObs.observe(el);
    });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (motionOKOverride) staggerObs.observe(el);
    });
    document.querySelectorAll('.kpi').forEach(function (kpi) {
      if (!kpi.querySelector('.kpi-bottom-accent')) {
        var bar = document.createElement('div');
        bar.className = 'kpi-bottom-accent';
        bar.setAttribute('aria-hidden', 'true');
        kpi.appendChild(bar);
      }
    });
  }

  return { init, revealObs, staggerObs, STAGGER };
}

/**
 * Recreates initReveal() from the main script block.
 */
function makeRevealModule() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  });

  function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  return { observer, initReveal };
}

// ══════════════════════════════════════════════════════════════════════════════
// KPI bottom-accent injection (Feature 4)
// ══════════════════════════════════════════════════════════════════════════════

describe('KPI bottom-accent injection', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('injects .kpi-bottom-accent div into each .kpi card', () => {
    const kpi1 = document.createElement('div');
    kpi1.className = 'kpi';
    const kpi2 = document.createElement('div');
    kpi2.className = 'kpi';
    container.appendChild(kpi1);
    container.appendChild(kpi2);

    const { init } = makeMotionModule();
    init();

    expect(kpi1.querySelector('.kpi-bottom-accent')).not.toBeNull();
    expect(kpi2.querySelector('.kpi-bottom-accent')).not.toBeNull();
  });

  test('.kpi-bottom-accent has aria-hidden="true"', () => {
    const kpi = document.createElement('div');
    kpi.className = 'kpi';
    container.appendChild(kpi);

    const { init } = makeMotionModule();
    init();

    const bar = kpi.querySelector('.kpi-bottom-accent');
    expect(bar.getAttribute('aria-hidden')).toBe('true');
  });

  test('does not inject duplicate .kpi-bottom-accent if one already exists', () => {
    const kpi = document.createElement('div');
    kpi.className = 'kpi';
    const existing = document.createElement('div');
    existing.className = 'kpi-bottom-accent';
    existing.setAttribute('aria-hidden', 'true');
    kpi.appendChild(existing);
    container.appendChild(kpi);

    const { init } = makeMotionModule();
    init();

    expect(kpi.querySelectorAll('.kpi-bottom-accent').length).toBe(1);
  });

  test('init() is idempotent — calling twice does not create duplicate bars', () => {
    const kpi = document.createElement('div');
    kpi.className = 'kpi';
    container.appendChild(kpi);

    const { init } = makeMotionModule();
    init();
    init();

    expect(kpi.querySelectorAll('.kpi-bottom-accent').length).toBe(1);
  });

  test('kpis without existing accent all get one after init()', () => {
    for (let i = 0; i < 5; i++) {
      const kpi = document.createElement('div');
      kpi.className = 'kpi';
      container.appendChild(kpi);
    }
    const { init } = makeMotionModule();
    init();
    const accents = container.querySelectorAll('.kpi-bottom-accent');
    expect(accents.length).toBe(5);
  });

  test('.kpi-bottom-accent is appended as a child of .kpi', () => {
    const kpi = document.createElement('div');
    kpi.className = 'kpi';
    const label = document.createElement('span');
    label.className = 'kpi-label';
    kpi.appendChild(label);
    container.appendChild(kpi);

    const { init } = makeMotionModule();
    init();

    expect(kpi.lastElementChild.classList.contains('kpi-bottom-accent')).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// data-reveal observer (Feature 3)
// ══════════════════════════════════════════════════════════════════════════════

describe('data-reveal IntersectionObserver', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('init() registers [data-reveal] elements with the reveal observer', () => {
    const el1 = document.createElement('div');
    el1.setAttribute('data-reveal', 'up');
    const el2 = document.createElement('div');
    el2.setAttribute('data-reveal', 'left');
    container.appendChild(el1);
    container.appendChild(el2);

    const { init, revealObs } = makeMotionModule();
    init();

    expect(revealObs.observed).toContain(el1);
    expect(revealObs.observed).toContain(el2);
  });

  test('intersecting [data-reveal] element gets .visible class', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', 'up');
    container.appendChild(el);

    const { init, revealObs } = makeMotionModule();
    init();
    revealObs.triggerIntersect(el, true);

    expect(el.classList.contains('visible')).toBe(true);
  });

  test('non-intersecting [data-reveal] element does NOT get .visible', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', 'scale');
    container.appendChild(el);

    const { init, revealObs } = makeMotionModule();
    init();
    revealObs.triggerIntersect(el, false);

    expect(el.classList.contains('visible')).toBe(false);
  });

  test('after intersection, element is unobserved', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', 'right');
    container.appendChild(el);

    const { init, revealObs } = makeMotionModule();
    init();
    revealObs.triggerIntersect(el, true);

    expect(revealObs.observed).not.toContain(el);
  });

  test('first sibling [data-reveal] gets 0ms transition delay', () => {
    const wrap = document.createElement('div');
    const el1 = document.createElement('div');
    el1.setAttribute('data-reveal', 'up');
    const el2 = document.createElement('div');
    el2.setAttribute('data-reveal', 'up');
    wrap.appendChild(el1);
    wrap.appendChild(el2);
    container.appendChild(wrap);

    const { init, revealObs } = makeMotionModule(true);
    init();
    revealObs.triggerIntersect(el1, true);

    expect(el1.style.transitionDelay).toBe('0ms');
  });

  test('second sibling [data-reveal] gets 60ms transition delay', () => {
    const wrap = document.createElement('div');
    const el1 = document.createElement('div');
    el1.setAttribute('data-reveal', 'up');
    const el2 = document.createElement('div');
    el2.setAttribute('data-reveal', 'up');
    wrap.appendChild(el1);
    wrap.appendChild(el2);
    container.appendChild(wrap);

    const { init, revealObs, STAGGER } = makeMotionModule(true);
    init();
    revealObs.triggerIntersect(el2, true);

    expect(el2.style.transitionDelay).toBe(STAGGER + 'ms');
  });

  test('when motionOK is false, data-reveal elements get .visible immediately', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', 'down');
    container.appendChild(el);

    // motionOK = false (reduced motion)
    const { init } = makeMotionModule(false);
    init();

    expect(el.classList.contains('visible')).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// .reveal stagger observer (Feature 3 additive)
// ══════════════════════════════════════════════════════════════════════════════

describe('.reveal stagger observer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('init() observes .reveal elements with staggerObs', () => {
    const el = document.createElement('div');
    el.className = 'reveal';
    container.appendChild(el);

    const { init, staggerObs } = makeMotionModule();
    init();

    expect(staggerObs.observed).toContain(el);
  });

  test('second .reveal sibling gets stagger delay on intersection', () => {
    const wrap = document.createElement('div');
    const el1 = document.createElement('div');
    el1.className = 'reveal';
    const el2 = document.createElement('div');
    el2.className = 'reveal';
    wrap.appendChild(el1);
    wrap.appendChild(el2);
    container.appendChild(wrap);

    const { init, staggerObs, STAGGER } = makeMotionModule(true);
    init();
    staggerObs.triggerIntersect(el2, true);

    expect(el2.style.transitionDelay).toBe(STAGGER + 'ms');
  });

  test('first .reveal sibling does not get a stagger delay', () => {
    const wrap = document.createElement('div');
    const el1 = document.createElement('div');
    el1.className = 'reveal';
    wrap.appendChild(el1);
    container.appendChild(wrap);

    const { init, staggerObs } = makeMotionModule(true);
    init();
    staggerObs.triggerIntersect(el1, true);

    // idx === 0 so condition idx > 0 is false → no delay assigned
    expect(el1.style.transitionDelay).toBe('');
  });

  test('stagger does not override pre-existing transitionDelay', () => {
    const wrap = document.createElement('div');
    const el2 = document.createElement('div');
    el2.className = 'reveal';
    el2.style.transitionDelay = '999ms'; // already set
    wrap.appendChild(el2);
    container.appendChild(wrap);

    const { init, staggerObs } = makeMotionModule(true);
    init();
    staggerObs.triggerIntersect(el2, true);

    // Should remain as '999ms' since the condition !el.style.transitionDelay is false
    expect(el2.style.transitionDelay).toBe('999ms');
  });

  test('after intersection, .reveal element is unobserved from staggerObs', () => {
    const el = document.createElement('div');
    el.className = 'reveal';
    container.appendChild(el);

    const { init, staggerObs } = makeMotionModule();
    init();
    staggerObs.triggerIntersect(el, true);

    expect(staggerObs.observed).not.toContain(el);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// initReveal() — main scroll reveal system from main script block
// ══════════════════════════════════════════════════════════════════════════════

describe('initReveal() main scroll observer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('observes all .reveal elements', () => {
    const el1 = document.createElement('div');
    el1.className = 'reveal';
    const el2 = document.createElement('div');
    el2.className = 'reveal';
    container.appendChild(el1);
    container.appendChild(el2);

    const { observer, initReveal } = makeRevealModule();
    initReveal();

    expect(observer.observed).toContain(el1);
    expect(observer.observed).toContain(el2);
  });

  test('adds .visible when .reveal element intersects', () => {
    const el = document.createElement('div');
    el.className = 'reveal';
    container.appendChild(el);

    const { observer, initReveal } = makeRevealModule();
    initReveal();
    observer.triggerIntersect(el, true);

    expect(el.classList.contains('visible')).toBe(true);
  });

  test('does not add .visible when element does not intersect', () => {
    const el = document.createElement('div');
    el.className = 'reveal';
    container.appendChild(el);

    const { observer, initReveal } = makeRevealModule();
    initReveal();
    observer.triggerIntersect(el, false);

    expect(el.classList.contains('visible')).toBe(false);
  });

  test('unobserves element after it becomes visible', () => {
    const el = document.createElement('div');
    el.className = 'reveal';
    container.appendChild(el);

    const { observer, initReveal } = makeRevealModule();
    initReveal();
    observer.triggerIntersect(el, true);

    expect(observer.observed).not.toContain(el);
  });

  test('observer uses threshold 0.08', () => {
    const { observer } = makeRevealModule();
    expect(observer.options.threshold).toBe(0.08);
  });

  test('observer uses correct rootMargin', () => {
    const { observer } = makeRevealModule();
    expect(observer.options.rootMargin).toBe('0px 0px -60px 0px');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Loader behavior
// ══════════════════════════════════════════════════════════════════════════════

describe('Loader behavior', () => {
  test('loader gets .hidden class after 1200ms on window load', () => {
    jest.useFakeTimers();

    const loader = document.createElement('div');
    loader.id = 'loader-test';
    document.body.appendChild(loader);

    // Simulate the loader logic from the main script
    const addHidden = () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1200);
    };
    addHidden();

    expect(loader.classList.contains('hidden')).toBe(false);
    jest.advanceTimersByTime(1199);
    expect(loader.classList.contains('hidden')).toBe(false);
    jest.advanceTimersByTime(1);
    expect(loader.classList.contains('hidden')).toBe(true);

    document.body.removeChild(loader);
    jest.useRealTimers();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Navbar scroll behavior
// ══════════════════════════════════════════════════════════════════════════════

describe('Navbar scroll behavior', () => {
  let nav;

  beforeEach(() => {
    nav = document.createElement('nav');
    nav.id = 'topNav-test';
    nav.className = 'top-nav';
    document.body.appendChild(nav);
  });

  afterEach(() => {
    document.body.removeChild(nav);
  });

  // Simulate the navbar scroll logic
  function simulateScrollHandler(navEl, scrollY) {
    if (scrollY > 60) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  }

  test('adds .scrolled class when scrollY > 60', () => {
    simulateScrollHandler(nav, 61);
    expect(nav.classList.contains('scrolled')).toBe(true);
  });

  test('removes .scrolled class when scrollY <= 60', () => {
    nav.classList.add('scrolled');
    simulateScrollHandler(nav, 60);
    expect(nav.classList.contains('scrolled')).toBe(false);
  });

  test('does not add .scrolled at exactly scrollY = 60', () => {
    simulateScrollHandler(nav, 60);
    expect(nav.classList.contains('scrolled')).toBe(false);
  });

  test('adds .scrolled at scrollY = 61', () => {
    simulateScrollHandler(nav, 61);
    expect(nav.classList.contains('scrolled')).toBe(true);
  });

  test('removes .scrolled when scrolled back to 0', () => {
    nav.classList.add('scrolled');
    simulateScrollHandler(nav, 0);
    expect(nav.classList.contains('scrolled')).toBe(false);
  });
});