(function () {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('primary-nav');
  var backdrop = document.querySelector('.nav-backdrop');

  function isMobileNav() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function syncNavAccessibility() {
    var open = document.body.classList.contains('nav-open');
    var mobile = isMobileNav();
    if (!panel) return;
    if (mobile) {
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if ('inert' in panel) panel.inert = !open;
      if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    } else {
      panel.setAttribute('aria-hidden', 'false');
      if ('inert' in panel) panel.inert = false;
      if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    }
    if (toggle) {
      toggle.setAttribute(
        'aria-expanded',
        mobile && open ? 'true' : 'false'
      );
      toggle.setAttribute(
        'aria-label',
        mobile && open ? 'Cerrar menú' : 'Abrir menú'
      );
    }
  }

  function setDrawerOpen(open) {
    document.body.classList.toggle('nav-open', open);
    syncNavAccessibility();
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function toggleDrawer() {
    var open = !document.body.classList.contains('nav-open');
    setDrawerOpen(open);
  }

  if (toggle && panel) {
    toggle.addEventListener('click', toggleDrawer);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
    backdrop.setAttribute('aria-hidden', 'true');
  }
  if (panel) {
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isMobileNav()) closeDrawer();
      });
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeDrawer();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
    if (e.matches) closeDrawer();
    syncNavAccessibility();
  });

  syncNavAccessibility();

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () {
            e.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });
})();
