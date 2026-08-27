/**
 * Tests for src/index.html — HTML structure, meta tags, and DOM element presence
 * Covers the new Executive Finance Portfolio page added in this PR.
 *
 * Uses JSDOM directly (no script execution) to safely parse the HTML.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let doc;

beforeAll(() => {
  const htmlContent = fs.readFileSync(
    path.resolve(__dirname, '../src/index.html'),
    'utf-8'
  );
  // Parse without executing scripts so inline JS doesn't crash the test suite
  const dom = new JSDOM(htmlContent, { runScripts: 'outside-only' });
  doc = dom.window.document;
});

// ── HEAD / META ────────────────────────────────────────────────────────────────

describe('Head meta tags', () => {
  test('page title contains owner name and year', () => {
    expect(doc.title).toMatch(/Mohanad Ibrahim/);
    expect(doc.title).toMatch(/2026/);
  });

  test('meta description is present and non-empty', () => {
    const desc = doc.querySelector('meta[name="description"]');
    expect(desc).not.toBeNull();
    expect(desc.getAttribute('content').length).toBeGreaterThan(20);
  });

  test('meta description mentions ATS-optimized', () => {
    const desc = doc.querySelector('meta[name="description"]');
    expect(desc.getAttribute('content')).toMatch(/ATS-optimized/i);
  });

  test('meta author is set to Mohanad Ibrahim', () => {
    const author = doc.querySelector('meta[name="author"]');
    expect(author).not.toBeNull();
    expect(author.getAttribute('content')).toBe('Mohanad Ibrahim');
  });

  test('meta keywords include IFRS', () => {
    const kw = doc.querySelector('meta[name="keywords"]');
    expect(kw).not.toBeNull();
    expect(kw.getAttribute('content')).toMatch(/IFRS/);
  });

  test('meta keywords include Power BI', () => {
    const kw = doc.querySelector('meta[name="keywords"]');
    expect(kw.getAttribute('content')).toMatch(/Power BI/);
  });

  test('meta keywords include UAE', () => {
    const kw = doc.querySelector('meta[name="keywords"]');
    expect(kw.getAttribute('content')).toMatch(/UAE/);
  });

  test('charset is UTF-8', () => {
    const charset = doc.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
    expect(charset.getAttribute('charset').toUpperCase()).toBe('UTF-8');
  });

  test('viewport meta tag is present', () => {
    const vp = doc.querySelector('meta[name="viewport"]');
    expect(vp).not.toBeNull();
    expect(vp.getAttribute('content')).toMatch(/width=device-width/);
  });

  test('Chart.js CDN script tag is present', () => {
    const scripts = Array.from(doc.querySelectorAll('script[src]'));
    const chartScript = scripts.find(s => s.src && s.src.includes('chart'));
    expect(chartScript).not.toBeNull();
  });

  test('Google Fonts link is present', () => {
    const links = Array.from(doc.querySelectorAll('link[href]'));
    const fontLink = links.find(l => l.href && l.href.includes('fonts.googleapis.com'));
    expect(fontLink).not.toBeNull();
  });
});

// ── LOADING SCREEN ─────────────────────────────────────────────────────────────

describe('Loading screen', () => {
  test('#loader element is present', () => {
    expect(doc.getElementById('loader')).not.toBeNull();
  });

  test('loader does not have "hidden" class in static HTML', () => {
    expect(doc.getElementById('loader').classList.contains('hidden')).toBe(false);
  });

  test('loader contains a logo image (.loader-logo)', () => {
    const logo = doc.querySelector('#loader .loader-logo');
    expect(logo).not.toBeNull();
    expect(logo.tagName.toLowerCase()).toBe('img');
  });
});

// ── NAVIGATION ─────────────────────────────────────────────────────────────────

describe('Top navigation', () => {
  test('#topNav element exists', () => {
    const nav = doc.getElementById('topNav');
    expect(nav).not.toBeNull();
  });

  test('topNav is a <nav> element', () => {
    expect(doc.getElementById('topNav').tagName.toLowerCase()).toBe('nav');
  });

  test('topNav has aria-label="Primary"', () => {
    expect(doc.getElementById('topNav').getAttribute('aria-label')).toBe('Primary');
  });

  test('nav contains brand link pointing to #cover', () => {
    const brand = doc.querySelector('#topNav .brand');
    expect(brand).not.toBeNull();
    expect(brand.getAttribute('href')).toBe('#cover');
  });

  test('nav contains Summary link', () => {
    const links = Array.from(doc.querySelectorAll('#topNav .nav-item'));
    const labels = links.map(l => l.textContent.trim());
    expect(labels).toContain('Summary');
  });

  test('nav contains Experience link', () => {
    const links = Array.from(doc.querySelectorAll('#topNav .nav-item'));
    const labels = links.map(l => l.textContent.trim());
    expect(labels).toContain('Experience');
  });

  test('nav contains KPIs link', () => {
    const links = Array.from(doc.querySelectorAll('#topNav .nav-item'));
    const labels = links.map(l => l.textContent.trim());
    expect(labels).toContain('KPIs');
  });

  test('nav contains Dashboard link', () => {
    const links = Array.from(doc.querySelectorAll('#topNav .nav-item'));
    const labels = links.map(l => l.textContent.trim());
    expect(labels).toContain('Dashboard');
  });

  test('nav contains Credentials link', () => {
    const links = Array.from(doc.querySelectorAll('#topNav .nav-item'));
    const labels = links.map(l => l.textContent.trim());
    expect(labels).toContain('Credentials');
  });

  test('nav contains a CTA "Contact" button', () => {
    const cta = doc.querySelector('#topNav .nav-item.cta');
    expect(cta).not.toBeNull();
    expect(cta.textContent.trim()).toMatch(/Contact/i);
  });

  test('nav links pointing to anchors use #-prefixed hrefs', () => {
    const anchors = Array.from(doc.querySelectorAll('#topNav a.nav-item[href^="#"]'));
    expect(anchors.length).toBeGreaterThan(0);
  });
});

// ── PARTICLE CANVAS ────────────────────────────────────────────────────────────

describe('Particle canvas', () => {
  test('#particle-canvas element is present', () => {
    expect(doc.getElementById('particle-canvas')).not.toBeNull();
  });

  test('particle canvas is a <canvas> element', () => {
    expect(doc.getElementById('particle-canvas').tagName.toLowerCase()).toBe('canvas');
  });
});

// ── SECTIONS ───────────────────────────────────────────────────────────────────

describe('Page sections', () => {
  const expectedSections = [
    'cover', 'summary', 'positioning', 'competencies', 'technical',
    'experience', 'achievements', 'transformation', 'erp', 'performance',
    'ai', 'kpi', 'powerbi', 'visual', 'dashboard', 'education', 'branding'
  ];

  test.each(expectedSections)('section #%s exists', (id) => {
    expect(doc.getElementById(id)).not.toBeNull();
  });

  test('all expected sections are <section> elements', () => {
    expectedSections.forEach(id => {
      const el = doc.getElementById(id);
      expect(el.tagName.toLowerCase()).toBe('section');
    });
  });

  test('sections have the "section" CSS class', () => {
    expectedSections.forEach(id => {
      expect(doc.getElementById(id).classList.contains('section')).toBe(true);
    });
  });
});

// ── COVER / HERO ───────────────────────────────────────────────────────────────

describe('Cover / hero section', () => {
  test('cover-name heading contains the owner name "Mohanad Ibrahim"', () => {
    const name = doc.querySelector('.cover-name');
    expect(name).not.toBeNull();
    expect(name.textContent).toMatch(/Mohanad Ibrahim/);
  });

  test('cover-eyebrow contains "Executive Finance"', () => {
    const eyebrow = doc.querySelector('.cover-eyebrow');
    expect(eyebrow).not.toBeNull();
    expect(eyebrow.textContent).toMatch(/Executive Finance/i);
  });

  test('cover section has .cover-art', () => {
    expect(doc.querySelector('#cover .cover-art')).not.toBeNull();
  });

  test('cover section has .cover-text', () => {
    expect(doc.querySelector('#cover .cover-text')).not.toBeNull();
  });

  test('hero stage contains role badges (.hero-role)', () => {
    expect(doc.querySelectorAll('.hero-stage .hero-role').length).toBeGreaterThan(0);
  });

  test('hero stage contains KPI display items (.hero-kpi)', () => {
    expect(doc.querySelectorAll('.hero-stage .hero-kpi').length).toBeGreaterThan(0);
  });

  test('hero CTA buttons are present', () => {
    expect(doc.querySelectorAll('.hero-cta-row .hero-cta').length).toBeGreaterThan(0);
  });

  test('cover-title mentions Finance transformation roles', () => {
    const title = doc.querySelector('.cover-title');
    expect(title).not.toBeNull();
    expect(title.textContent).toMatch(/Finance/i);
  });
});

// ── COMPETENCIES MATRIX ────────────────────────────────────────────────────────

describe('Competencies matrix', () => {
  test('.skill-row elements exist (at least 20)', () => {
    const rows = doc.querySelectorAll('.skill-row');
    expect(rows.length).toBeGreaterThanOrEqual(20);
  });

  test('each .skill-row has a .name element', () => {
    const rows = doc.querySelectorAll('.skill-row');
    rows.forEach(row => {
      expect(row.querySelector('.name')).not.toBeNull();
    });
  });

  test('each .skill-row has a .level element', () => {
    const rows = doc.querySelectorAll('.skill-row');
    rows.forEach(row => {
      expect(row.querySelector('.level')).not.toBeNull();
    });
  });

  test('skill level elements only have expert, advanced, or proficient class', () => {
    const levels = doc.querySelectorAll('.skill-row .level');
    const valid = ['expert', 'advanced', 'proficient'];
    levels.forEach(lvl => {
      const hasValid = valid.some(cls => lvl.classList.contains(cls));
      expect(hasValid).toBe(true);
    });
  });

  test('at least one expert-level skill exists', () => {
    expect(doc.querySelectorAll('.skill-row .level.expert').length).toBeGreaterThan(0);
  });

  test('at least one advanced-level skill exists', () => {
    expect(doc.querySelectorAll('.skill-row .level.advanced').length).toBeGreaterThan(0);
  });

  test('.matrix-cluster elements exist', () => {
    expect(doc.querySelectorAll('.matrix-cluster').length).toBeGreaterThan(0);
  });
});

// ── DASHBOARD / KPI SECTION ────────────────────────────────────────────────────

describe('Dashboard and KPI cards', () => {
  test('.kpi cards exist in the dashboard section', () => {
    expect(doc.querySelectorAll('#dashboard .kpi').length).toBeGreaterThan(0);
  });

  test('sparkRevenue canvas is present', () => {
    expect(doc.getElementById('sparkRevenue')).not.toBeNull();
  });

  test('sparkMargin canvas is present', () => {
    expect(doc.getElementById('sparkMargin')).not.toBeNull();
  });

  test('sparkEbitda canvas is present', () => {
    expect(doc.getElementById('sparkEbitda')).not.toBeNull();
  });

  test('sparkNet canvas is present', () => {
    expect(doc.getElementById('sparkNet')).not.toBeNull();
  });

  test('sparkCash canvas is present', () => {
    expect(doc.getElementById('sparkCash')).not.toBeNull();
  });

  test('chartRevenue canvas is present', () => {
    expect(doc.getElementById('chartRevenue')).not.toBeNull();
  });

  test('chartCost canvas is present', () => {
    expect(doc.getElementById('chartCost')).not.toBeNull();
  });

  test('chartBridge canvas is present', () => {
    expect(doc.getElementById('chartBridge')).not.toBeNull();
  });

  test('chartCash canvas is present', () => {
    expect(doc.getElementById('chartCash')).not.toBeNull();
  });

  test('chartWC canvas is present', () => {
    expect(doc.getElementById('chartWC')).not.toBeNull();
  });

  test('chartEbitda canvas is present', () => {
    expect(doc.getElementById('chartEbitda')).not.toBeNull();
  });

  test('chartAR canvas is present', () => {
    expect(doc.getElementById('chartAR')).not.toBeNull();
  });

  test('KPI cards have .kpi-label children', () => {
    const kpis = doc.querySelectorAll('.kpi');
    kpis.forEach(kpi => {
      expect(kpi.querySelector('.kpi-label')).not.toBeNull();
    });
  });

  test('KPI cards have .kpi-value children', () => {
    const kpis = doc.querySelectorAll('.kpi');
    kpis.forEach(kpi => {
      expect(kpi.querySelector('.kpi-value')).not.toBeNull();
    });
  });
});

// ── EXPERIENCE SECTION ─────────────────────────────────────────────────────────

describe('Experience section', () => {
  test('.exp-block elements exist in #experience', () => {
    expect(doc.querySelectorAll('#experience .exp-block').length).toBeGreaterThan(0);
  });

  test('experience blocks have .exp-role', () => {
    const block = doc.querySelector('#experience .exp-block');
    expect(block.querySelector('.exp-role')).not.toBeNull();
  });

  test('experience blocks have .exp-org', () => {
    const block = doc.querySelector('#experience .exp-block');
    expect(block.querySelector('.exp-org')).not.toBeNull();
  });

  test('experience blocks have .exp-dates', () => {
    const block = doc.querySelector('#experience .exp-block');
    expect(block.querySelector('.exp-dates')).not.toBeNull();
  });

  test('experience bullet items are present', () => {
    expect(doc.querySelectorAll('#experience .exp-bullets li').length).toBeGreaterThan(0);
  });
});

// ── REVEAL ANIMATION ELEMENTS ──────────────────────────────────────────────────

describe('Reveal and data-reveal elements', () => {
  test('.reveal elements exist', () => {
    expect(doc.querySelectorAll('.reveal').length).toBeGreaterThan(0);
  });

  test('CSS defines data-reveal directional variants (up, down, left, right, scale)', () => {
    // The data-reveal attribute is a CSS-defined system: CSS rules exist for each variant.
    // The inline <style> blocks in the HTML define selectors like [data-reveal="up"] etc.
    const html = doc.documentElement.innerHTML;
    expect(html).toMatch(/\[data-reveal="up"\]/);
    expect(html).toMatch(/\[data-reveal="down"\]/);
    expect(html).toMatch(/\[data-reveal="left"\]/);
    expect(html).toMatch(/\[data-reveal="right"\]/);
    expect(html).toMatch(/\[data-reveal="scale"\]/);
  });

  test('.reveal elements include cover-art', () => {
    // cover-art has both .cover-art and .reveal
    expect(doc.querySelector('.cover-art.reveal')).not.toBeNull();
  });
});

// ── SCROLL PROGRESS ────────────────────────────────────────────────────────────

describe('Scroll progress bar', () => {
  test('#scrollProgress element exists', () => {
    expect(doc.getElementById('scrollProgress')).not.toBeNull();
  });

  test('scroll progress bar has aria-hidden="true"', () => {
    const bar = doc.getElementById('scrollProgress');
    expect(bar.getAttribute('aria-hidden')).toBe('true');
  });

  test('scroll progress bar has .scroll-progress class', () => {
    expect(doc.getElementById('scrollProgress').classList.contains('scroll-progress')).toBe(true);
  });
});

// ── FOOTER STAMP ───────────────────────────────────────────────────────────────

describe('Footer stamp', () => {
  test('.footer-stamp element is present', () => {
    expect(doc.querySelector('.footer-stamp')).not.toBeNull();
  });
});

// ── EDUCATION SECTION ──────────────────────────────────────────────────────────

describe('Education / Credentials section', () => {
  test('#education section exists', () => {
    expect(doc.getElementById('education')).not.toBeNull();
  });

  test('cert-cluster elements are present', () => {
    expect(doc.querySelectorAll('#education .cert-cluster').length).toBeGreaterThan(0);
  });

  test('.cert elements are present', () => {
    expect(doc.querySelectorAll('#education .cert').length).toBeGreaterThan(0);
  });
});

// ── ARABIC CONTENT ─────────────────────────────────────────────────────────────

describe('Arabic content elements', () => {
  test('.ar-banner element exists for Arabic bilingual content', () => {
    expect(doc.querySelector('.ar-banner')).not.toBeNull();
  });

  test('.insight-ar elements exist (Arabic chart insights)', () => {
    expect(doc.querySelectorAll('.insight-ar').length).toBeGreaterThan(0);
  });

  test('Arabic text content is present in insight-ar elements', () => {
    const firstInsight = doc.querySelector('.insight-ar');
    expect(firstInsight).not.toBeNull();
    // Arabic text contains Arabic Unicode characters (U+0600–U+06FF)
    expect(/[\u0600-\u06FF]/.test(firstInsight.textContent)).toBe(true);
  });
});

// ── CASE STUDIES ───────────────────────────────────────────────────────────────

describe('Case studies / Portfolio section', () => {
  test('.case-block elements exist', () => {
    expect(doc.querySelectorAll('.case-block').length).toBeGreaterThan(0);
  });

  test('case blocks have .case-title', () => {
    const block = doc.querySelector('.case-block');
    expect(block.querySelector('.case-title')).not.toBeNull();
  });

  test('case blocks have .case-id', () => {
    const block = doc.querySelector('.case-block');
    expect(block.querySelector('.case-id')).not.toBeNull();
  });

  test('case impact KPIs (.case-kpi) are present', () => {
    expect(doc.querySelectorAll('.case-kpi').length).toBeGreaterThan(0);
  });
});

// ── CTA / CONTACT LINKS ────────────────────────────────────────────────────────

describe('CTA / contact links in branding section', () => {
  test('.brand-cta-row is present', () => {
    expect(doc.querySelector('.brand-cta-row')).not.toBeNull();
  });

  test('LinkedIn CTA is an <a> element', () => {
    const li = doc.querySelector('.brand-cta.linkedin');
    expect(li).not.toBeNull();
    expect(li.tagName.toLowerCase()).toBe('a');
  });

  test('Email CTA exists', () => {
    expect(doc.querySelector('.brand-cta.email')).not.toBeNull();
  });
});

// ── BRAND STATEMENT ────────────────────────────────────────────────────────────

describe('Brand statement section', () => {
  test('.brand-statement element exists', () => {
    expect(doc.querySelector('.brand-statement')).not.toBeNull();
  });

  test('.brand-statement-quote is present', () => {
    expect(doc.querySelector('.brand-statement-quote')).not.toBeNull();
  });
});

// ── ACHIEVEMENTS SECTION ───────────────────────────────────────────────────────

describe('Achievements section', () => {
  test('.stat-block elements exist', () => {
    expect(doc.querySelectorAll('.stat-block').length).toBeGreaterThan(0);
  });

  test('stat blocks have .stat-num', () => {
    const block = doc.querySelector('.stat-block');
    expect(block.querySelector('.stat-num')).not.toBeNull();
  });

  test('.ach-card elements exist', () => {
    expect(doc.querySelectorAll('.ach-card').length).toBeGreaterThan(0);
  });
});

// ── DAX CODE BLOCK ─────────────────────────────────────────────────────────────

describe('DAX / code sections', () => {
  test('.dax-block element exists in powerbi section', () => {
    expect(doc.querySelector('#powerbi .dax-block')).not.toBeNull();
  });
});

// ── POSITIONING PILLARS ────────────────────────────────────────────────────────

describe('Positioning pillars', () => {
  test('.pillar elements exist', () => {
    expect(doc.querySelectorAll('.pillar').length).toBeGreaterThan(0);
  });

  test('pillars have .pillar-title', () => {
    const pillar = doc.querySelector('.pillar');
    expect(pillar.querySelector('.pillar-title')).not.toBeNull();
  });

  test('pillars have .pillar-num', () => {
    const pillar = doc.querySelector('.pillar');
    expect(pillar.querySelector('.pillar-num')).not.toBeNull();
  });
});

// ── TRUST ROW ─────────────────────────────────────────────────────────────────

describe('Trust indicator row', () => {
  test('.trust-row element is present', () => {
    expect(doc.querySelector('.trust-row')).not.toBeNull();
  });

  test('.trust-cell elements exist', () => {
    expect(doc.querySelectorAll('.trust-cell').length).toBeGreaterThan(0);
  });
});