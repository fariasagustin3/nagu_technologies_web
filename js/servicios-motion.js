(function () {
  if (!document.body.classList.contains('page-services')) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal-up, .pop-reveal').forEach(function (el) {
      el.classList.add('active');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Lenis (intensidad media: un poco más “suave” que Home)
  var lenis = null;
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = anchor.getAttribute('href');
        if (!id || id === '#' || id.indexOf('#svc-') === 0) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -88 });
      });
    });
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );

  document.querySelectorAll('.reveal-up, .pop-reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.services-hero .reveal-up').forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('active');
      }, prefersReduced ? 0 : 80 + i * 70);
    });
  });

  gsap.to('#scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true }
  });

  if (!prefersReduced) {
    document.querySelectorAll('.parallax-el').forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0.3;
      var section = el.closest('section');
      if (!section) return;
      gsap.to(el, {
        y: function () {
          return -130 * speed;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.35
        }
      });
    });
  }

  // Línea de proceso (como Home)
  var processLine = document.getElementById('process-line');
  var processDot = document.getElementById('process-dot');
  if (processLine) {
    var isDesktopLine = function () {
      return window.matchMedia('(min-width: 768px)').matches;
    };
    var processTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#proceso',
        start: 'top 65%',
        end: 'bottom 55%',
        scrub: 1
      }
    });
    processTl.to(processLine, { scaleX: 1, scaleY: 1, ease: 'none' }, 0);
    if (processDot) {
      if (isDesktopLine()) {
        processTl.fromTo(processDot, { left: '0%' }, { left: '100%', ease: 'none' }, 0);
      } else {
        processTl.fromTo(processDot, { top: '0%' }, { top: '100%', ease: 'none' }, 0);
      }
    }
  }

  if (!prefersReduced && finePointer) {
    var heroSection = document.getElementById('services-hero');
    var cursorGlow = document.getElementById('cursorGlow');
    if (heroSection && cursorGlow) {
      heroSection.addEventListener('mousemove', function (e) {
        var r = heroSection.getBoundingClientRect();
        cursorGlow.classList.add('visible');
        gsap.to(cursorGlow, {
          x: e.clientX - r.left,
          y: e.clientY - r.top,
          duration: 0.6,
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
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });

    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: px * 9,
          rotateX: py * -9,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 900
        });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' });
      });
    });
  }

  // Acordeón animado + deep-link desde cards
  var accordion = document.querySelector('.services-accordion');
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

    // Cards / footer links → abrir acordeón
    document.querySelectorAll('a[href^="#svc-"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        var item = id ? document.querySelector(id) : null;
        if (!item || !item.classList.contains('accordion-item')) return;

        e.preventDefault();
        accordion.querySelectorAll('details').forEach(function (other) {
          if (other !== item) closeItem(other);
        });
        openItem(item);

        var scrollFn = function () {
          if (lenis) lenis.scrollTo(item, { offset: -88 });
          else item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        setTimeout(scrollFn, 50);
      });
    });

    // Hash al cargar
    if (window.location.hash && window.location.hash.indexOf('#svc-') === 0) {
      var initial = document.querySelector(window.location.hash);
      if (initial && initial.classList.contains('accordion-item')) {
        openItem(initial);
        setTimeout(function () {
          if (lenis) lenis.scrollTo(initial, { offset: -88 });
        }, 200);
      }
    }
  }

  var navObserver = new MutationObserver(function () {
    if (!lenis) return;
    if (document.body.classList.contains('nav-open')) lenis.stop();
    else lenis.start();
  });
  navObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
