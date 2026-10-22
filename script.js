(function () {
  var THEME_KEY = 'nebula_theme';

  var SUN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"/></svg>';

  var btn = document.getElementById('menuBtn');
  if (btn) {
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.body.classList.remove('nav-open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  if (window.location.search.indexOf('sent=1') !== -1) {
    var success = document.getElementById('formSuccess');
    if (success) {
      success.classList.add('show');
      success.textContent = 'Request sent. Check your inbox for a confirmation from FormSubmit the first time — after that, requests go straight to milnerg-admin@nebulaservices.live.';
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  function setThemeIcons(theme) {
    var iconBtn = document.getElementById('themeToggle');
    if (iconBtn) {
      iconBtn.innerHTML = theme === 'light' ? SUN_SVG : MOON_SVG;
      iconBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      iconBtn.setAttribute('title', theme === 'light' ? 'Light mode' : 'Dark mode');
    }
    var drawer = document.getElementById('themeToggleDrawer');
    if (drawer) {
      drawer.textContent = theme === 'light' ? '☀ Light mode (tap for dark)' : '☾ Dark mode (tap for light)';
    }
  }

  function applyTheme(theme) {
    theme = theme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    setThemeIcons(theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function toggleTheme(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var cur = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(cur === 'light' ? 'dark' : 'light');
  }

  try { applyTheme(localStorage.getItem(THEME_KEY) || 'dark'); } catch (e) { applyTheme('dark'); }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  var themeDrawer = document.getElementById('themeToggleDrawer');
  if (themeDrawer) themeDrawer.addEventListener('click', toggleTheme);
})();
