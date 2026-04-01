/* ============================================
   JUSTIN MIRANDA — PORTFOLIO JS
   Projects driven by localStorage so the
   secret dashboard can add / edit them live.
   ============================================ */
'use strict';

/* ── DEFAULT PROJECTS (seeded from resume) ─── */
const DEFAULT_PROJECTS = [
  {
    id: 'wos',
    title: 'Web of Science Research Intelligence',
    desc: 'Full-stack research data platform (Spring WebFlux + Angular + Elasticsearch). Handles 100k+ academic records with sub-second retrieval for 5,000+ active users. Received a Certificate of Appreciation for the September 2024 product launch.',
    status: 'completed',
    tags: ['Spring WebFlux', 'Angular', 'Elasticsearch', 'AWS', 'Java'],
    public: true,
    link: '',
    image: '',
    highlight: '50% faster queries · 5,000+ users'
  },
  {
    id: 'kookur',
    title: 'Kookur & Praani — Pet Platform',
    desc: 'Sole engineer for a venture-backed pet-care startup. Built the full backend (Spring WebFlux), Angular frontend, and AWS infrastructure (S3, RDS, Elastic Beanstalk) from scratch. Set up CI/CD pipelines for rapid iteration. Platform is live in beta.',
    status: 'completed',
    tags: ['Spring WebFlux', 'Angular', 'AWS', 'CI/CD', 'PostgreSQL'],
    public: true,
    link: '',
    image: '',
    highlight: 'Sole engineer · full stack + AWS infra'
  },
  {
    id: 'patent',
    title: 'Intelligent Safety System — Patent #202341004169',
    desc: 'Patented ML-powered two-wheeler safety system. Seat sensors detect anti-triple riding with >90% accuracy. Helmet sensors (IR, pressure, ultrasonic) automate safety checks. Alcohol sensor eliminated drink-and-drive ignition starts in testing.',
    status: 'completed',
    tags: ['Machine Learning', 'IoT', 'C++', 'Patent', 'Sensors'],
    public: true,
    link: '',
    image: '',
    highlight: 'Spirit of Invention Award · $1,300 prize'
  },
  {
    id: 'boneconductor',
    title: 'Bone Conduction Hearing Aid via Jawbone',
    desc: 'Designed a bone conduction device mounted on the jawbone to assist patients with eardrum impairments. Transmits vibrations directly to the cochlea, achieving approximately 70% improvement in sound clarity over conventional hearing aids.',
    status: 'completed',
    tags: ['Hardware', 'Signal Processing', 'Electronics', 'Biomedical'],
    public: true,
    link: '',
    image: '',
    highlight: '1st place · GITAM Tech Expo & Symbiot 2020'
  },
  {
    id: 'carbonglass',
    title: 'Carbon Glass — Sustainability Transparency Widget',
    desc: 'Built at the MTU SDGs Hackathon in 2 hours. A concept widget for clothing products that shows carbon emissions, water usage, and hazardous chemical impact — enabling consumers to make informed purchasing choices. Carbon = emissions, Glass = brand transparency.',
    status: 'completed',
    tags: ['Hackathon', 'Sustainability', 'SDGs', 'UI/UX'],
    public: true,
    link: '',
    image: '',
    highlight: '3rd place · MTU SDG Hackathon 2025'
  },
  {
    id: 'dbmigration',
    title: 'Large-Scale Database Migration — Clarivate',
    desc: 'Led end-to-end database migration for a large user base at Clarivate Analytics. Redesigned complex CRUD and group-formation queries. Improved data processing speed by 30% and reduced production downtime during the transition to near zero.',
    status: 'completed',
    tags: ['PostgreSQL', 'SQL Optimisation', 'Spring', 'Java', 'Migration'],
    public: true,
    link: '',
    image: '',
    highlight: '30% faster · near-zero downtime'
  }
];

/* ── STORAGE HELPERS ─────────────────────────── */
function getProjects() {
  try {
    const raw = localStorage.getItem('jm_projects');
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem('jm_projects', JSON.stringify(DEFAULT_PROJECTS));
  return DEFAULT_PROJECTS;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── LOADER ─────────────────────────────────── */
(function initLoader() {
  const msgs = ['initialising...', 'loading portfolio...', 'ready.'];
  const el = document.getElementById('loaderText');
  if (!el) return;
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = msgs[Math.min(i, msgs.length - 1)];
    i++;
    if (i >= msgs.length) {
      clearInterval(iv);
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.querySelectorAll('.reveal-line').forEach(r => r.classList.add('visible'));
        document.querySelectorAll('#hero .reveal-up').forEach(r => r.classList.add('visible'));
      }, 500);
    }
  }, 450);
})();

/* ── CUSTOM CURSOR ───────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  (function tick() {
    tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
    trail.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.chip,.project-card,.contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ── THEME TOGGLE ───────────────────────────── */
(function initTheme() {
  const html  = document.documentElement;
  const btn   = document.getElementById('themeToggle');
  const ab    = document.getElementById('avatarBase');
  html.setAttribute('data-theme', localStorage.getItem('jm_theme') || 'dark');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (ab) {
      ab.classList.remove('flashing'); void ab.offsetWidth; ab.classList.add('flashing');
      ab.addEventListener('animationend', () => ab.classList.remove('flashing'), { once: true });
    }
    html.setAttribute('data-theme', next);
    localStorage.setItem('jm_theme', next);
  });
})();

/* ── NAV ────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
})();

/* ── PROJECTS ───────────────────────────────── */
function renderProjectGrid() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const projects = getProjects().filter(p => p.public);
  grid.innerHTML = '';

  if (!projects.length) {
    grid.innerHTML = '<p style="color:var(--text-3);font-family:\'Space Mono\',monospace;font-size:0.8rem;padding:2rem 0">no public projects yet — add them from the dashboard.</p>';
    return;
  }

  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal-up';
    card.style.transitionDelay = (i * 70) + 'ms';
    card.dataset.id = p.id;

    const statusClass = p.status === 'completed' ? 'status-completed' : 'status-progress';
    const statusText  = p.status === 'completed' ? 'completed' : 'in progress';

    const imgHTML = p.image
      ? `<div class="project-img-wrap"><img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" class="project-img" loading="lazy" onerror="this.parentElement.style.display='none'"/></div>`
      : '';

    const highlightHTML = p.highlight
      ? `<div class="project-highlight mono">${escHtml(p.highlight)}</div>`
      : '';

    const linkHTML = p.link
      ? `<a href="${escHtml(p.link)}" target="_blank" rel="noopener" class="project-link mono" onclick="event.stopPropagation()">view project ↗</a>`
      : '';

    card.innerHTML = `
      ${imgHTML}
      <div class="project-header">
        <div class="project-title">${escHtml(p.title)}</div>
        <span class="project-status ${statusClass}">${statusText}</span>
      </div>
      ${highlightHTML}
      <p class="project-desc">${escHtml(p.desc)}</p>
      <div class="project-footer">
        <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('')}</div>
        ${linkHTML}
      </div>
    `;
    grid.appendChild(card);
  });

  /* Re-observe newly created cards */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  grid.querySelectorAll('.project-card').forEach(c => obs.observe(c));
}

(function initProjects() { renderProjectGrid(); })();

/* ── SKILLS ─────────────────────────────────── */
const SKILLS = [
  { name: 'Java / Spring WebFlux', pct: 90 },
  { name: 'Elasticsearch',         pct: 88 },
  { name: 'Python',                pct: 85 },
  { name: 'AWS',                   pct: 80 },
  { name: 'TypeScript / Angular',  pct: 82 },
  { name: 'System Design',         pct: 78 },
  { name: 'Kubernetes / Docker',   pct: 70 },
  { name: 'Go',                    pct: 60 },
];

(function initSkills() {
  const c = document.getElementById('skillBars');
  if (!c) return;
  SKILLS.forEach(s => {
    const d = document.createElement('div');
    d.className = 'skill-item';
    d.innerHTML = `
      <div class="skill-meta">
        <span class="skill-name mono">${s.name}</span>
        <span class="skill-pct">${s.pct}%</span>
      </div>
      <div class="skill-track"><div class="skill-fill" data-pct="${s.pct}"></div></div>`;
    c.appendChild(d);
  });
})();

let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return; skillsAnimated = true;
  document.querySelectorAll('.skill-fill').forEach((b, i) =>
    setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, i * 80));
}
const _ss = document.getElementById('skills');
if (_ss) {
  const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { animateSkillBars(); obs.disconnect(); } }, { threshold: 0.2 });
  obs.observe(_ss);
}

/* ── SCROLL REVEALS ─────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
})();

/* ── PARALLAX ───────────────────────────────── */
(function initParallax() {
  const g = document.querySelector('.hero-bg-grid');
  if (!g) return;
  window.addEventListener('scroll', () => { g.style.transform = `translateY(${window.scrollY * 0.4}px)`; }, { passive: true });
})();

/* ── SMOOTH SCROLL ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  })
);
