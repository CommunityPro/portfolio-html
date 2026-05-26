/**
 * Tests for chart-related functions embedded in src/index.html:
 *  - spark(id, data, color) — sparkline chart factory
 *  - Chart.js defaults initialization
 *  - Scroll progress bar logic
 *  - Active nav link tracking
 */

'use strict';

// ── HELPERS ────────────────────────────────────────────────────────────────────

/**
 * Minimal mock of Chart.js that records construction arguments.
 */
class MockChart {
  constructor(el, config) {
    this.el = el;
    this.config = config;
    MockChart._instances.push(this);
  }
  static get instances() { return {}; }
}
MockChart._instances = [];
MockChart.defaults = {
  font: { family: '', size: 12 },
  color: '',
  borderColor: '',
  plugins: {
    legend: {
      labels: { usePointStyle: false, pointStyle: '' }
    }
  }
};

/**
 * Recreates the spark() function from the main script block.
 */
function makeSpark(ChartCtor) {
  function spark(id, data, color) {
    const el = document.getElementById(id);
    if (!el || typeof ChartCtor === 'undefined') return null;
    return new ChartCtor(el, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: 'transparent' // simplified for test
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 100,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        animation: { duration: 1400, easing: 'easeOutQuart' }
      }
    });
  }
  return spark;
}

// ══════════════════════════════════════════════════════════════════════════════
// spark() function
// ══════════════════════════════════════════════════════════════════════════════

describe('spark()', () => {
  let container;

  beforeEach(() => {
    MockChart._instances = [];
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('returns null when element does not exist', () => {
    const spark = makeSpark(MockChart);
    const result = spark('nonExistentId', [1, 2, 3], '#fff');
    expect(result).toBeNull();
  });

  test('creates a Chart instance when element exists', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkCanvas';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const result = spark('testSparkCanvas', [1, 2, 3], '#5dd6a3');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(MockChart);
  });

  test('chart type is "line"', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkLine';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkLine', [1, 2, 3], '#56b4ff');
    expect(chart.config.type).toBe('line');
  });

  test('chart data uses provided data array', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkData';
    container.appendChild(canvas);
    const testData = [9.8, 10.2, 10.6, 11.4];

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkData', testData, '#fbbf24');
    expect(chart.config.data.datasets[0].data).toEqual(testData);
  });

  test('chart dataset uses provided color as borderColor', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkColor';
    container.appendChild(canvas);
    const color = '#a78bfa';

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkColor', [1, 2, 3], color);
    expect(chart.config.data.datasets[0].borderColor).toBe(color);
  });

  test('chart labels are sequential indices', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkLabels';
    container.appendChild(canvas);
    const data = [1, 2, 3, 4, 5];

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkLabels', data, '#fff');
    expect(chart.config.data.labels).toEqual([0, 1, 2, 3, 4]);
  });

  test('chart has legend.display = false', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkLegend';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkLegend', [1, 2, 3], '#fff');
    expect(chart.config.options.plugins.legend.display).toBe(false);
  });

  test('chart has tooltip.enabled = false', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkTooltip';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkTooltip', [1, 2, 3], '#fff');
    expect(chart.config.options.plugins.tooltip.enabled).toBe(false);
  });

  test('chart has x-axis and y-axis with display: false', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkAxes';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkAxes', [1, 2, 3], '#fff');
    expect(chart.config.options.scales.x.display).toBe(false);
    expect(chart.config.options.scales.y.display).toBe(false);
  });

  test('chart has animation duration 1400ms', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkAnim';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkAnim', [1, 2, 3], '#fff');
    expect(chart.config.options.animation.duration).toBe(1400);
  });

  test('chart has maintainAspectRatio = false', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkAspect';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkAspect', [1, 2, 3], '#fff');
    expect(chart.config.options.maintainAspectRatio).toBe(false);
  });

  test('chart dataset has pointRadius = 0', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkPoints';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkPoints', [1, 2, 3], '#fff');
    expect(chart.config.data.datasets[0].pointRadius).toBe(0);
  });

  test('chart dataset has fill = true', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkFill';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    const chart = spark('testSparkFill', [1, 2, 3], '#5dd6a3');
    expect(chart.config.data.datasets[0].fill).toBe(true);
  });

  test('returns null when Chart constructor is undefined', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkNoChart';
    container.appendChild(canvas);

    const spark = makeSpark(undefined);
    const result = spark('testSparkNoChart', [1, 2, 3], '#fff');
    expect(result).toBeNull();
  });

  test('handles empty data array gracefully', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'testSparkEmpty';
    container.appendChild(canvas);

    const spark = makeSpark(MockChart);
    expect(() => spark('testSparkEmpty', [], '#fff')).not.toThrow();
    const chart = spark('testSparkEmpty', [], '#fff');
    expect(chart.config.data.labels).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Chart.js defaults initialization
// ══════════════════════════════════════════════════════════════════════════════

describe('Chart.js global defaults initialization', () => {
  /**
   * Recreates the Chart defaults setup from the main script block.
   */
  function initChartDefaults(ChartCtor) {
    if (typeof ChartCtor === 'undefined') return;
    ChartCtor.defaults.font.family = "'Inter','Plus Jakarta Sans',system-ui,sans-serif";
    ChartCtor.defaults.font.size = 11;
    ChartCtor.defaults.color = '#CBD5E1';
    ChartCtor.defaults.borderColor = 'rgba(255,255,255,0.06)';
    ChartCtor.defaults.plugins.legend.labels.usePointStyle = true;
    ChartCtor.defaults.plugins.legend.labels.pointStyle = 'circle';
  }

  test('sets font.family to Inter/Plus Jakarta Sans stack', () => {
    const Chart = JSON.parse(JSON.stringify(MockChart.defaults)); // shallow copy as plain obj
    const mock = { defaults: Chart };
    mock.defaults.font = { family: '', size: 12 };
    mock.defaults.plugins = { legend: { labels: {} } };
    initChartDefaults(mock);
    expect(mock.defaults.font.family).toBe("'Inter','Plus Jakarta Sans',system-ui,sans-serif");
  });

  test('sets font.size to 11', () => {
    const mock = {
      defaults: { font: { family: '', size: 0 }, color: '', borderColor: '', plugins: { legend: { labels: {} } } }
    };
    initChartDefaults(mock);
    expect(mock.defaults.font.size).toBe(11);
  });

  test('sets color to inkSoft (#CBD5E1)', () => {
    const mock = {
      defaults: { font: { family: '', size: 0 }, color: '', borderColor: '', plugins: { legend: { labels: {} } } }
    };
    initChartDefaults(mock);
    expect(mock.defaults.color).toBe('#CBD5E1');
  });

  test('sets borderColor to grid line color', () => {
    const mock = {
      defaults: { font: { family: '', size: 0 }, color: '', borderColor: '', plugins: { legend: { labels: {} } } }
    };
    initChartDefaults(mock);
    expect(mock.defaults.borderColor).toBe('rgba(255,255,255,0.06)');
  });

  test('sets usePointStyle to true', () => {
    const mock = {
      defaults: { font: { family: '', size: 0 }, color: '', borderColor: '', plugins: { legend: { labels: {} } } }
    };
    initChartDefaults(mock);
    expect(mock.defaults.plugins.legend.labels.usePointStyle).toBe(true);
  });

  test('sets pointStyle to "circle"', () => {
    const mock = {
      defaults: { font: { family: '', size: 0 }, color: '', borderColor: '', plugins: { legend: { labels: {} } } }
    };
    initChartDefaults(mock);
    expect(mock.defaults.plugins.legend.labels.pointStyle).toBe('circle');
  });

  test('does not throw when Chart is undefined', () => {
    expect(() => initChartDefaults(undefined)).not.toThrow();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Scroll progress bar logic
// ══════════════════════════════════════════════════════════════════════════════

describe('Scroll progress bar', () => {
  /**
   * Recreates the scroll progress width calculation from the augmentation script.
   */
  function calculateScrollProgress(scrollTop, scrollHeight, clientHeight) {
    const total = scrollHeight - clientHeight;
    if (total <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / total) * 100));
  }

  test('returns 0% when at the top', () => {
    expect(calculateScrollProgress(0, 1000, 800)).toBe(0);
  });

  test('returns 100% when at the bottom', () => {
    expect(calculateScrollProgress(200, 1000, 800)).toBe(100);
  });

  test('returns ~50% halfway through page', () => {
    expect(calculateScrollProgress(100, 1000, 800)).toBe(50);
  });

  test('returns 0% when scrollHeight equals clientHeight (no scroll area)', () => {
    expect(calculateScrollProgress(0, 800, 800)).toBe(0);
  });

  test('caps at 100% when overscrolled', () => {
    expect(calculateScrollProgress(300, 1000, 800)).toBe(100);
  });

  test('returns correct percentage for non-round numbers', () => {
    // scrollTop=50, total=200 → 25%
    expect(calculateScrollProgress(50, 1200, 1000)).toBe(25);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Active nav link logic (scroll-based)
// ══════════════════════════════════════════════════════════════════════════════

describe('Active nav link scroll tracking', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * Simplified version of the tickActive() function from the augmentation script.
   */
  function tickActive(links, items, scrollY) {
    const y = scrollY + 200;
    let current = null;
    for (const it of items) {
      if (it.target.offsetTop <= y) current = it;
    }
    links.forEach(l => l.classList.remove('is-active'));
    if (current) current.link.classList.add('is-active');
  }

  function makeLink(href) {
    const a = document.createElement('a');
    a.className = 'nav-item';
    a.href = href;
    return a;
  }

  function makeSection(id, offsetTop) {
    const section = document.createElement('section');
    section.id = id;
    // offsetTop is read-only in jsdom, so we mock it with Object.defineProperty
    Object.defineProperty(section, 'offsetTop', { value: offsetTop, configurable: true });
    return section;
  }

  test('marks the link for the first section as active at scroll 0', () => {
    const link1 = makeLink('#sec1');
    const section1 = makeSection('sec1', 0);
    const link2 = makeLink('#sec2');
    const section2 = makeSection('sec2', 1000);
    container.appendChild(link1);
    container.appendChild(link2);
    container.appendChild(section1);
    container.appendChild(section2);

    const links = [link1, link2];
    const items = [
      { link: link1, target: section1 },
      { link: link2, target: section2 }
    ];

    tickActive(links, items, 0);
    expect(link1.classList.contains('is-active')).toBe(true);
    expect(link2.classList.contains('is-active')).toBe(false);
  });

  test('marks the second section link as active when scrolled past it', () => {
    const link1 = makeLink('#sec1');
    const section1 = makeSection('sec1', 0);
    const link2 = makeLink('#sec2');
    const section2 = makeSection('sec2', 500);

    const links = [link1, link2];
    const items = [
      { link: link1, target: section1 },
      { link: link2, target: section2 }
    ];

    tickActive(links, items, 400); // y = 600 > section2.offsetTop 500
    expect(link2.classList.contains('is-active')).toBe(true);
    expect(link1.classList.contains('is-active')).toBe(false);
  });

  test('removes is-active from all links when no section matches', () => {
    const link1 = makeLink('#sec1');
    link1.classList.add('is-active');
    const section1 = makeSection('sec1', 1000); // way below viewport

    const links = [link1];
    const items = [{ link: link1, target: section1 }];

    tickActive(links, items, -500); // y = -300, nothing matches
    expect(link1.classList.contains('is-active')).toBe(false);
  });

  test('only one link is active at a time', () => {
    const link1 = makeLink('#s1');
    const link2 = makeLink('#s2');
    const link3 = makeLink('#s3');
    const s1 = makeSection('s1', 0);
    const s2 = makeSection('s2', 300);
    const s3 = makeSection('s3', 600);

    const links = [link1, link2, link3];
    const items = [
      { link: link1, target: s1 },
      { link: link2, target: s2 },
      { link: link3, target: s3 }
    ];

    tickActive(links, items, 500); // y = 700, s3 is at 600 so s3 is active
    const activeLinks = links.filter(l => l.classList.contains('is-active'));
    expect(activeLinks.length).toBe(1);
    expect(link3.classList.contains('is-active')).toBe(true);
  });
});