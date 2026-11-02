(function () {
  var THEME_KEY = 'nebula_theme';

  var THEMES = [
    { id: 'dark', label: 'Dark', sw1: '#030712', sw2: '#38bdf8' },
    { id: 'light', label: 'Light', sw1: '#f8fafc', sw2: '#0284c7' },
    { id: 'mocha', label: 'Mocha', sw1: '#1c1917', sw2: '#e7b48a' },
    { id: 'cotton-candy', label: 'Cotton Candy', sw1: '#1a1024', sw2: '#f9a8d4' },
    { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', sw1: '#1e1e2e', sw2: '#cba6f7' },
    { id: 'catppuccin-latte', label: 'Catppuccin Latte', sw1: '#eff1f5', sw2: '#1e66f5' },
    { id: 'catppuccin-frappe', label: 'Catppuccin Frappé', sw1: '#303446', sw2: '#8caaee' },
    { id: 'catppuccin-macchiato', label: 'Catppuccin Macchiato', sw1: '#24273a', sw2: '#c6a0f6' },
    { id: 'nord', label: 'Nord', sw1: '#2e3440', sw2: '#88c0d0' },
    { id: 'dracula', label: 'Dracula', sw1: '#282a36', sw2: '#bd93f9' },
    { id: 'ocean', label: 'Ocean', sw1: '#0b1220', sw2: '#38bdf8' },
    { id: 'sunset', label: 'Sunset', sw1: '#1a0f0a', sw2: '#fb7185' }
  ];

  var PALETTE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>';

  function validTheme(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return id;
    return 'dark';
  }

  function getTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return validTheme(t);
    try {
      t = localStorage.getItem(THEME_KEY);
      if (t) return validTheme(t);
    } catch (e) {}
    return 'dark';
  }

  function themeMeta(id) {
    var el = document.documentElement;
    var prev = el.getAttribute('data-theme');
    el.setAttribute('data-theme', id);
    var bg = getComputedStyle(el).getPropertyValue('--theme-meta').trim() || '#030712';
    if (prev) el.setAttribute('data-theme', prev);
    return bg;
  }

  function applyTheme(theme) {
    theme = validTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) document.body.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      // read after apply
      var bg = getComputedStyle(document.documentElement).getPropertyValue('--theme-meta').trim();
      meta.setAttribute('content', bg || '#030712');
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    updateActiveOptions(theme);
    var drawer = document.getElementById('themeToggleDrawer');
    if (drawer) {
      var label = 'Theme';
      for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === theme) label = THEMES[i].label;
      drawer.textContent = 'Theme · ' + label;
    }
  }

  function updateActiveOptions(theme) {
    document.querySelectorAll('.theme-option').forEach(function (btn) {
      var on = btn.getAttribute('data-theme-id') === theme;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function buildPanel() {
    var panel = document.createElement('div');
    panel.className = 'theme-panel';
    panel.id = 'themePanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Choose theme');
    var title = document.createElement('div');
    title.className = 'theme-panel-title';
    title.textContent = 'Choose theme';
    panel.appendChild(title);
    var grid = document.createElement('div');
    grid.className = 'theme-grid';
    THEMES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-option';
      btn.setAttribute('data-theme-id', t.id);
      btn.setAttribute('aria-pressed', 'false');
      var sw = document.createElement('span');
      sw.className = 'theme-swatch';
      sw.style.setProperty('--sw1', t.sw1);
      sw.style.setProperty('--sw2', t.sw2);
      btn.appendChild(sw);
      var span = document.createElement('span');
      span.textContent = t.label;
      btn.appendChild(span);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        applyTheme(t.id);
        closePanel();
      });
      grid.appendChild(btn);
    });
    panel.appendChild(grid);
    return panel;
  }

  var panelEl = null;

  function ensurePanel() {
    if (panelEl) return panelEl;
    var actions = document.querySelector('.header-actions');
    if (!actions) return null;
    panelEl = buildPanel();
    actions.appendChild(panelEl);
    return panelEl;
  }

  function openPanel() {
    var p = ensurePanel();
    if (!p) return;
    p.classList.add('open');
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    updateActiveOptions(getTheme());
  }

  function closePanel() {
    if (panelEl) panelEl.classList.remove('open');
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function togglePanel(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var p = ensurePanel();
    if (!p) return;
    if (p.classList.contains('open')) closePanel();
    else openPanel();
  }

  // Apply early
  applyTheme(getTheme());

  function bind() {
    applyTheme(getTheme());

    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.innerHTML = PALETTE_SVG;
      themeToggle.setAttribute('aria-label', 'Choose theme');
      themeToggle.setAttribute('title', 'Themes');
      themeToggle.setAttribute('aria-expanded', 'false');
      themeToggle.onclick = togglePanel;
    }

    var themeDrawer = document.getElementById('themeToggleDrawer');
    if (themeDrawer) {
      themeDrawer.onclick = function (e) {
        e.preventDefault();
        // on mobile: open panel near header button
        openPanel();
        document.body.classList.remove('nav-open');
        var btn = document.getElementById('menuBtn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      };
    }

    document.addEventListener('click', function (e) {
      if (!panelEl || !panelEl.classList.contains('open')) return;
      var t = e.target;
      if (panelEl.contains(t)) return;
      if (themeToggle && themeToggle.contains(t)) return;
      closePanel();
    });

    var btn = document.getElementById('menuBtn');
    if (btn && !btn.__nebulaBound) {
      btn.__nebulaBound = true;
      btn.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) closePanel();
      });
      document.querySelectorAll('.nav-drawer a').forEach(function (a) {
        a.addEventListener('click', function () {
          document.body.classList.remove('nav-open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.body.classList.remove('nav-open');
      var m = document.getElementById('menuBtn');
      if (m) m.setAttribute('aria-expanded', 'false');
      closePanel();
    }
  });

  if (window.location.search.indexOf('sent=1') !== -1) {
    document.addEventListener('DOMContentLoaded', function () {
      var success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('show');
        success.textContent = 'Sent. We have received your form and will review your application and get back to you as soon as possible.';
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
  }
})();
