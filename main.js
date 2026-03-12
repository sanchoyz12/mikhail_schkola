/* === main.js — Михаила Козловского Ship School === */
'use strict';

// ── UTILS ──────────────────────────────────────────────────────
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ── NAVBAR SCROLL ──────────────────────────────────────────────
(function initNavbar() {
  const nav = qs('.navbar');
  const hamburger = qs('.hamburger');
  const links     = qs('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    links.classList.toggle('open');
  });

  links?.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      hamburger.classList.remove('open');
      links.classList.remove('open');
    }
  });
})();

// ── RIPPLE / GLOW on CTA buttons ──────────────────────────────
qsa('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const y = ((e.clientY - r.top ) / r.height * 100).toFixed(1) + '%';
    btn.style.setProperty('--mx', x);
    btn.style.setProperty('--my', y);
  });
});

// ── PARALLAX HERO SHIP ────────────────────────────────────────
(function initParallax() {
  const ship = qs('.hero-ship-wrapper');
  if (!ship) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      ship.style.transform = `translateY(calc(-50% + ${y * 0.2}px))`;
      ship.style.opacity   = 1 - y / window.innerHeight;
    }
  }, { passive: true });
})();

// ── STARS GENERATOR ───────────────────────────────────────────
(function generateStars() {
  const container = qs('.hero-stars');
  if (!container) return;
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size  = Math.random() * 2.5 + 0.5;
    const dur   = (Math.random() * 3 + 2).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    Object.assign(star.style, {
      width:  size + 'px',
      height: size + 'px',
      top:    Math.random() * 100 + '%',
      left:   Math.random() * 100 + '%',
      '--dur':   dur   + 's',
      '--delay': delay + 's',
    });
    container.appendChild(star);
  }
})();

// ── ANIMATE ON SCROLL (Intersection Observer) ─────────────────
(function initReveal() {
  const els = qsa('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ── SVG TOOL DRAW ANIMATION ───────────────────────────────────
(function initToolDraw() {
  const items = qsa('.svg-tool-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('drawn'), 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  items.forEach((item, i) => {
    item.style.transitionDelay = (i * 0.15) + 's';
    obs.observe(item);
  });
})();

// ── 3D TILT ON COURSE CARDS ───────────────────────────────────
qsa('.course-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const cx   = r.left + r.width  / 2;
    const cy   = r.top  + r.height / 2;
    const rotX = ((e.clientY - cy) / (r.height / 2) * -6).toFixed(2);
    const rotY = ((e.clientX - cx) / (r.width  / 2) *  6).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});

// ── GALLERY LIGHTBOX ──────────────────────────────────────────
(function initLightbox() {
  const lightbox = qs('.lightbox');
  const lbImg    = qs('.lightbox img');
  const lbCap    = qs('.lightbox-caption');
  const lbClose  = qs('.lightbox-close');
  if (!lightbox) return;

  qsa('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img  = item.querySelector('img');
      const cap  = item.querySelector('.gallery-item-title');
      lbImg.src  = img.src;
      lbImg.alt  = img.alt;
      if (lbCap && cap) lbCap.textContent = cap.textContent;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  lbClose?.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLb();
  });
})();

// ── TESTIMONIALS CAROUSEL ─────────────────────────────────────
(function initCarousel() {
  const track  = qs('.testimonials-track');
  const btnL   = qs('.carousel-btn-l');
  const btnR   = qs('.carousel-btn-r');
  const dots   = qsa('.carousel-dot');
  if (!track) return;

  let idx = 0;
  const cards = qsa('.testimonial-card', track);
  const total = cards.length;
  const visible = window.innerWidth <= 900 ? 1 : 2;

  const updateDots = () => {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  };

  const move = () => {
    const pct = (100 / visible) * idx;
    track.style.transform = `translateX(-${pct}%)`;
    updateDots();
  };

  btnR?.addEventListener('click', () => {
    idx = (idx + 1) % (total - visible + 1);
    move();
  });
  btnL?.addEventListener('click', () => {
    idx = (idx - 1 + (total - visible + 1)) % (total - visible + 1);
    move();
  });
  dots.forEach((d, i) => d.addEventListener('click', () => { idx = i; move(); }));

  // Auto-advance
  let timer = setInterval(() => {
    idx = (idx + 1) % (total - visible + 1);
    move();
  }, 5000);
  track.parentElement?.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement?.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => { idx = (idx + 1) % (total - visible + 1); move(); }, 5000);
  });
})();

// ── FORM MICROANIMATIONS ──────────────────────────────────────
(function initForm() {
  const form = qs('.signup-form');
  if (!form) return;

  // Add animated line to each group
  qsa('.form-group', form).forEach(group => {
    const line = document.createElement('span');
    line.className = 'form-line';
    group.appendChild(line);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = qs('[type="submit"]', form) || qs('.form-submit', form);
    const orig = btn.textContent;
    btn.textContent = '✓ Заявка отправлена!';
    btn.style.background = 'linear-gradient(135deg, #4ECDC4, #2bb5ad)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 3500);
  });
})();

// ── SAILING SHIP TRIGGER ──────────────────────────────────────
(function initSailingShip() {
  const el = qs('.sailing-ship-el');
  if (!el) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        el.classList.add('sailing');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  const track = qs('.sailing-track');
  if (track) obs.observe(track);
})();

// ── COMPASS ROTATION ON SCROLL ────────────────────────────────
(function initCompassScroll() {
  const compass = qs('.floating-compass-inner');
  if (!compass) return;
  window.addEventListener('scroll', () => {
    const deg = (window.scrollY / document.body.scrollHeight * 720).toFixed(1);
    compass.style.transform = `rotate(${deg}deg)`;
  }, { passive: true });
})();

// ── ANIMATED COUNTER ──────────────────────────────────────────
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 1800;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
qsa('[data-target]').forEach(el => counterObs.observe(el));

// ── SVG SAIL BREATHING ANIMATION ─────────────────────────────
(function initSailBreath() {
  const sails = qsa('.sail-animate');
  sails.forEach((sail, i) => {
    sail.style.animationDelay = (i * 0.4) + 's';
  });
})();

// ── ANCHOR DROP ON SCROLL ─────────────────────────────────────
(function initAnchorDrop() {
  const anchor = qs('.anchor-drop-el');
  if (!anchor) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        anchor.style.animation = 'anchorDrop 1.2s cubic-bezier(0.34,1.56,0.64,1) forwards';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(anchor);
})();
