(function () {
  if (!document.body.classList.contains('page-home')) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal-up, .pop-reveal').forEach(function (el) {
      el.classList.add('active');
    });
    var curtainFallback = document.getElementById('curtain');
    if (curtainFallback) curtainFallback.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var lenis = null;
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  document.querySelectorAll('.reveal-up, .pop-reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  gsap.to('#scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true }
  });

  if (!prefersReduced) {
    document.querySelectorAll('.parallax-el').forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0.3;
      var section = el.closest('section') || el.closest('.shopcore-band');
      gsap.to(el, {
        y: function () {
          return -160 * speed;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });
  }

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
    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  function scrambleReveal(el, options) {
    options = options || {};
    var charDelay = options.charDelay != null ? options.charDelay : 14;
    var minIter = options.minIter != null ? options.minIter : 4;
    var maxIter = options.maxIter != null ? options.maxIter : 10;
    var tick = options.tick != null ? options.tick : 28;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&/\\';
    var original = el.textContent;
    el.textContent = '';
    Array.prototype.forEach.call(original, function (ch, i) {
      if (ch === ' ') {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var span = document.createElement('span');
      span.textContent = ch;
      el.appendChild(span);
      var startDelay = i * charDelay;
      var iterations = minIter + Math.floor(Math.random() * (maxIter - minIter));
      var count = 0;
      setTimeout(function () {
        var interval = setInterval(function () {
          if (count < iterations) {
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
            count++;
          } else {
            span.textContent = ch;
            clearInterval(interval);
          }
        }, tick);
      }, startDelay);
    });
  }

  function runHeroEntrance() {
    var heroTitle = document.getElementById('hero-title');
    var scrambleTarget = document.getElementById('scramble-target');
    var heroHighlight = document.getElementById('hero-highlight');

    document.querySelectorAll('.home-hero .reveal-up').forEach(function (el) {
      el.classList.add('active');
    });

    if (scrambleTarget && !prefersReduced) {
      scrambleReveal(scrambleTarget);
    }

    var glitchDelay = prefersReduced ? 0 : 750;
    setTimeout(function () {
      if (heroTitle && !prefersReduced) {
        heroTitle.classList.add('glitch-on');
        setTimeout(function () {
          heroTitle.classList.remove('glitch-on');
        }, 550);
      }
      if (heroHighlight) heroHighlight.classList.add('shine-in');
    }, glitchDelay);
  }

  window.addEventListener('DOMContentLoaded', function () {
    var curtain = document.getElementById('curtain');
    if (prefersReduced || !curtain) {
      if (curtain) curtain.remove();
      runHeroEntrance();
      return;
    }
    var panelL = curtain.querySelector('.curtain-panel-l');
    var panelR = curtain.querySelector('.curtain-panel-r');
    var logo = curtain.querySelector('.curtain-logo');
    gsap
      .timeline({
        onComplete: function () {
          curtain.remove();
          runHeroEntrance();
        }
      })
      .fromTo(logo, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' })
      .to(logo, { opacity: 0, duration: 0.22, ease: 'power1.in' }, '+=0.2')
      .to(panelL, { xPercent: -100, duration: 0.65, ease: 'power4.inOut' }, '-=0.05')
      .to(panelR, { xPercent: 100, duration: 0.65, ease: 'power4.inOut' }, '<');
  });

  if (!prefersReduced && finePointer) {
    var heroSection = document.getElementById('hero-section');
    var cursorGlow = document.getElementById('cursorGlow');
    if (heroSection && cursorGlow) {
      heroSection.addEventListener('mousemove', function (e) {
        var r = heroSection.getBoundingClientRect();
        cursorGlow.classList.add('visible');
        gsap.to(cursorGlow, {
          x: e.clientX - r.left,
          y: e.clientY - r.top,
          duration: 0.55,
          ease: 'power2.out'
        });
      });
      heroSection.addEventListener('mouseleave', function () {
        cursorGlow.classList.remove('visible');
      });
    }

    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: px * 8,
          rotateX: py * -8,
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

  // Pause Lenis while mobile nav is open
  var navObserver = new MutationObserver(function () {
    if (!lenis) return;
    if (document.body.classList.contains('nav-open')) lenis.stop();
    else lenis.start();
  });
  navObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
