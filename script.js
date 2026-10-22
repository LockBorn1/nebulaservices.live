(function () {
  var THEME_KEY = 'nebula_theme';

  var SUN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
  var MOON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"></path></svg>';

  function getTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    t = document.body && document.body.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    try {
      t = localStorage.getItem(THEME_KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {}
    return 'dark';
  }

  function setThemeIcons(theme) {
    var iconBtn = document.getElementById('themeToggle');
    if (iconBtn) {
      iconBtn.innerHTML = theme === 'light' ? SUN_SVG : MOON_SVG;
      iconBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      iconBtn.setAttribute('title', theme === 'light' ? 'Light mode — click for dark' : 'Dark mode — click for light');
    }
    var drawer = document.getElementById('themeToggleDrawer');
    if (drawer) {
      drawer.textContent = theme === 'light' ? '☀ Light mode (tap for dark)' : '☾ Dark mode (tap for light)';
    }
  }

  function applyTheme(theme) {
    theme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) document.body.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    if (document.body) {
      document.body.classList.toggle('theme-light', theme === 'light');
      document.body.classList.toggle('theme-dark', theme === 'dark');
    }
    setThemeIcons(theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#030712');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function toggleTheme(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    applyTheme(getTheme() === 'light' ? 'dark' : 'light');
  }

  // Apply as early as possible
  applyTheme(getTheme());

  function bind() {
    applyTheme(getTheme());
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.onclick = toggleTheme;
    }
    var themeDrawer = document.getElementById('themeToggleDrawer');
    if (themeDrawer) {
      themeDrawer.onclick = toggleTheme;
    }

    var btn = document.getElementById('menuBtn');
    if (btn && !btn.__nebulaBound) {
      btn.__nebulaBound = true;
      btn.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
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
      var btn = document.getElementById('menuBtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  if (window.location.search.indexOf('sent=1') !== -1) {
    document.addEventListener('DOMContentLoaded', function () {
      var success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('show');
        success.textContent = 'Request sent. Check your inbox for a confirmation from FormSubmit the first time — after that, requests go straight to milnerg-admin@nebulaservices.live.';
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
  }
})();
