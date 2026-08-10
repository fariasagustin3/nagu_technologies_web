(function () {
  if (!document.body.classList.contains('page-products')) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // Reveal más pausado que el Home (aparición “tardía”)
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = 0;
        var styleDelay = window.getComputedStyle(el).transitionDelay;
        if (styleDelay && styleDelay !== '0s') {
          delay = parseFloat(styleDelay) * 1000 || 0;
        }
        setTimeout(function () {
          el.classList.add('active');
        }, delay + 40);
        revealObserver.unobserve(el);
      });
    },
    { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.14 }
  );

  document.querySelectorAll('.reveal-up, .pop-reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Hero visible al cargar (sin cortina)
  window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.products-hero .reveal-up').forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('active');
      }, prefersReduced ? 0 : 120 + i * 90);
    });
  });

  // Parallax suave (sin Lenis; intensidad menor)
  if (!prefersReduced && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.parallax-el').forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0.25;
      var section = el.closest('section');
      if (!section) return;
      gsap.to(el, {
        y: function () {
          return -100 * speed;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6
        }
      });
    });
  }

  // Cursor glow solo en hero (más suave)
  if (!prefersReduced && finePointer && typeof gsap !== 'undefined') {
    var heroSection = document.getElementById('products-hero');
    var cursorGlow = document.getElementById('cursorGlow');
    if (heroSection && cursorGlow) {
      heroSection.addEventListener('mousemove', function (e) {
        var r = heroSection.getBoundingClientRect();
        cursorGlow.classList.add('visible');
        gsap.to(cursorGlow, {
          x: e.clientX - r.left,
          y: e.clientY - r.top,
          duration: 0.7,
          ease: 'power2.out'
        });
      });
      heroSection.addEventListener('mouseleave', function () {
        cursorGlow.classList.remove('visible');
      });
    }

    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.16, y: y * 0.16, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });
      });
    });
  }

  // Acordeón animado: altura + fade, un ítem abierto a la vez
  var accordion = document.querySelector('.products-accordion');
  if (accordion) {
    var closeTimers = new WeakMap();

    function closeItem(item) {
      var prev = closeTimers.get(item);
      if (prev) clearTimeout(prev);
      item.classList.remove('is-open');
      var timer = setTimeout(function () {
        item.open = false;
        closeTimers.delete(item);
      }, 400);
      closeTimers.set(item, timer);
    }

    function openItem(item) {
      var prev = closeTimers.get(item);
      if (prev) {
        clearTimeout(prev);
        closeTimers.delete(item);
      }
      item.open = true;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          item.classList.add('is-open');
        });
      });
    }

    accordion.querySelectorAll('details').forEach(function (item) {
      var summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();

        var willOpen = !item.classList.contains('is-open');

        accordion.querySelectorAll('details').forEach(function (other) {
          if (other !== item && (other.open || other.classList.contains('is-open'))) {
            closeItem(other);
          }
        });

        if (willOpen) openItem(item);
        else closeItem(item);
      });
    });
  }
})();
