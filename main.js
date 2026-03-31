/* ============================================
   JUSTIN MIRANDA — PORTFOLIO JS
   ============================================ */

'use strict';

/* ── DATA ───────────────────────────────────── */
const PROJECTS = [
  {
    id: 'wos',
    title: 'Web of Science Research Intelligence',
    desc: 'Full-stack research data platform built with Spring WebFlux, Angular & Elasticsearch. Handles 100k+ academic records with sub-second retrieval for 5,000+ active users across institutions.',
    status: 'completed',
    tags: ['Spring WebFlux', 'Angular', 'Elasticsearch', 'AWS'],
    public: true
  },
  {
    id: 'kookur',
    title: 'Kookur & Praani Platform',
    desc: 'Sole engineer for a venture-backed startup. Designed and built the complete backend, Angular frontend, and AWS cloud infrastructure (S3, RDS, Elastic Beanstalk) from scratch. Now in beta.',
    status: 'completed',
    tags: ['Spring WebFlux', 'Angular', 'AWS', 'CI/CD'],
    public: true
  },
  {
    id: 'patent',
    title: 'Intelligent Safety System — Patent #202341004169',
    desc: 'Patented ML-powered two-wheeler safety system. Seat sensors detect anti-triple riding with >90% accuracy. Integrated helmet sensors + alcohol detection. Won the Avery Dennison Spirit of Invention Award ($1,300).',
    status: 'completed',
    tags: ['Machine Learning', 'IoT', 'C++', 'Patent'],
    public: true
  },
  {
    id: 'ratelimiter',
    title: 'Distributed Rate Limiter',
    desc: 'Production-grade rate limiting service in Go. Implements sliding window + token bucket across multiple K8s replicas backed by Redis. Benchmarked at 50k+ req/sec with full observability via Prometheus.',
    status: 'progress',
    tags: ['Go', 'Redis', 'Kubernetes', 'Prometheus'],
    public: false
  },
  {
    id: 'featurestore',
    title: 'Real-Time ML Feature Store',
    desc: 'Event-driven feature pipeline: Kafka ingestion → rolling feature computation → low-latency REST serving. Online store in Redis, offline in PostgreSQL. Targets <10ms feature retrieval for fraud detection.',
    status: 'progress',
    tags: ['Python', 'Kafka', 'Redis', 'FastAPI', 'scikit-learn'],
    public: false
  },
  {
    id: 'boneconductor',
    title: 'Bone Conduction Hearing Aid',
    desc: 'Designed a jawbone-mounted bone conduction device for patients with eardrum impairments. Transmits vibrations directly to the cochlea, achieving ~70% improvement in sound clarity. Won 1st place at GITAM Tech Expo 2020.',
    status: 'completed',
    tags: ['Hardware', 'Signal Processing', 'Electronics'],
    public: true
  }
];

const SKILLS = [
  { name: 'Python', pct: 85 },
  { name: 'Java / Spring', pct: 90 },
  { name: 'Elasticsearch', pct: 88 },
  { name: 'AWS', pct: 80 },
  { name: 'TypeScript / Angular', pct: 82 },
  { name: 'Go', pct: 60 },
  { name: 'System Design', pct: 78 },
  { name: 'Kubernetes / Docker', pct: 70 },
];

/* ── LOADER ─────────────────────────────────── */
(function initLoader() {
  const msgs = ['initialising...', 'loading portfolio...', 'ready.'];
  const el = document.getElementById('loaderText');
  let i = 0;
  const interval = setInterval(() => {
    el.textContent = msgs[Math.min(i, msgs.length - 1)];
    i++;
    if (i >= msgs.length) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        // Trigger hero reveals after load
        document.querySelectorAll('.reveal-line').forEach(el => el.classList.add('visible'));
        document.querySelectorAll('#hero .reveal-up').forEach(el => el.classList.add('visible'));
      }, 500);
    }
  }, 450);
})();

/* ── CURSOR ─────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // Trail follows with slight lag
  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  document.querySelectorAll('a, button, .chip, .project-card, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ── THEME TOGGLE ───────────────────────────── */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  const avatarBase = document.getElementById('avatarBase');

  // Restore preference
  const saved = localStorage.getItem('jm_theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    // Cinematic flash on avatar
    if (avatarBase) {
      avatarBase.classList.remove('flashing');
      void avatarBase.offsetWidth; // reflow
      avatarBase.classList.add('flashing');
      avatarBase.addEventListener('animationend', () => {
        avatarBase.classList.remove('flashing');
      }, { once: true });
    }

    html.setAttribute('data-theme', next);
    localStorage.setItem('jm_theme', next);
  });
})();

/* ── NAV SCROLL ─────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── SCROLL REVEALS ─────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // If this section has skill bars, animate them
        if (e.target.id === 'skillBars' || e.target.closest('#skills')) {
          animateSkillBars();
        }
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    observer.observe(el);
  });
})();

/* ── PROJECTS ───────────────────────────────── */
(function initProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card reveal-up';
    card.dataset.id = p.id;

    const statusClass = p.status === 'completed' ? 'status-completed' : 'status-progress';
    const statusText = p.status === 'completed' ? 'completed' : 'in progress';

    card.innerHTML = `
      <div class="project-header">
        <div class="project-title">${p.title}</div>
        <span class="project-status ${statusClass}">${statusText}</span>
      </div>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
})();

/* ── SKILLS ─────────────────────────────────── */
(function initSkills() {
  const container = document.getElementById('skillBars');
  if (!container) return;

  SKILLS.forEach(s => {
    const item = document.createElement('div');
    item.className = 'skill-item';
    item.innerHTML = `
      <div class="skill-meta">
        <span class="skill-name mono">${s.name}</span>
        <span class="skill-pct">${s.pct}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-pct="${s.pct}"></div>
      </div>
    `;
    container.appendChild(item);
  });
})();

let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-fill').forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.pct + '%';
    }, i * 80);
  });
}

// Also trigger skills on scroll into view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateSkillBars(); obs.disconnect(); }
  }, { threshold: 0.2 });
  obs.observe(skillsSection);
}

/* ── PARALLAX ───────────────────────────────── */
(function initParallax() {
  const grid = document.querySelector('.hero-bg-grid');
  if (!grid) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.4}px)`;
  }, { passive: true });
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
