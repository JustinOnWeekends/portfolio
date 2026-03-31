/* ============================================
   JUSTIN MIRANDA — DASHBOARD JS
   Career tracker, weekly planner, job board
   ============================================ */

'use strict';

const PASSCODE = '251112';
const LS = key => localStorage.getItem('jm_dash_' + key);
const LSset = (key, val) => localStorage.setItem('jm_dash_' + key, JSON.stringify(val));
const LSget = key => { try { return JSON.parse(LS(key)); } catch { return null; } };

/* ── LOCK ───────────────────────────────────── */
const lockScreen = document.getElementById('lockScreen');
const dashboard  = document.getElementById('dashboard');
const inputEl    = document.getElementById('passcodeInput');
const errEl      = document.getElementById('lockError');

function tryUnlock(code) {
  if (code === PASSCODE) {
    lockScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    initDashboard();
  } else {
    errEl.textContent = 'access denied. try again.';
    inputEl.value = '';
    inputEl.classList.add('shake');
    setTimeout(() => { inputEl.classList.remove('shake'); errEl.textContent = ''; }, 1500);
  }
}

// Allow inline style for shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = '.shake{animation:shake 0.4s linear}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
document.head.appendChild(shakeStyle);

document.getElementById('unlockBtn').addEventListener('click', () => tryUnlock(inputEl.value.trim()));
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(inputEl.value.trim()); });

// Auto-unlock if session active
if (sessionStorage.getItem('jm_unlocked') === '1') {
  lockScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  initDashboard();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('jm_unlocked');
  location.reload();
});

/* ── SIDEBAR NAV ────────────────────────────── */
function initNav() {
  document.querySelectorAll('.sb-btn[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.panel).classList.add('active');
    });
  });
}

/* ── DATA ───────────────────────────────────── */
const TIMELINE_PHASES = [
  {
    when: 'Now → May 2026',
    what: 'Fix LinkedIn headline. Start NeetCode 150 (2/day). Apply to Qumulo Cork immediately. Read Alex Xu System Design ch1–5.',
    state: 'active'
  },
  {
    when: 'June – July 2026',
    what: 'Build Go distributed KV store project. Build Python ML FastAPI project. Finish NeetCode 75. Start K8s basics. Post 1 LinkedIn video/article per 2 weeks.',
    state: 'future'
  },
  {
    when: 'Aug – Sept 2026 (MSc finishes)',
    what: 'Prime application window — fresh degree, polished projects, 3 months DSA prep. Apply to Apple, Workday, Salesforce Dublin. Do 2 mock interviews/week.',
    state: 'future'
  },
  {
    when: 'Oct – Nov 2026',
    what: 'Broad wave — 15-20 active applications. Apply to Stripe, Cloudflare, HubSpot. Negotiate hard, don\'t accept first offers.',
    state: 'future'
  },
  {
    when: 'Dec 2026 – Mar 2027',
    what: 'If no offer yet — reassess interview performance. Consider 3-month contract at big tech for brand name on CV.',
    state: 'future'
  }
];

const QUICK_WINS = [
  { text: 'Change LinkedIn headline to: "Software Engineer · Distributed Systems | Python · Go · AWS · Elasticsearch"', badge: 'now' },
  { text: 'Rewrite LinkedIn About section — lead with 3 years prod experience, key results, open to work', badge: 'now' },
  { text: 'Enable "Open to Work" (recruiters only) on LinkedIn', badge: 'now' },
  { text: 'Add Patent No. 202341004169 as a LinkedIn Publication entry', badge: 'now' },
  { text: 'Archive/delete old LinkedIn Learning certificate posts', badge: 'now' },
  { text: 'Pin the MTU hackathon post to the top of your activity feed', badge: 'now' },
  { text: 'Set up green square habit — commit something every weekday on GitHub', badge: 'now' },
];

const WEEKLY_PLAN = {
  Mon: ['2 NeetCode problems (arrays/hashing)', 'Read 1 chapter System Design (Alex Xu)', 'LinkedIn profile review & edit'],
  Tue: ['2 NeetCode problems (two pointers)', 'Go tutorial: Tour of Go — 1 section', 'GitHub: add README to existing projects'],
  Wed: ['2 NeetCode problems (sliding window)', 'Work on Distributed Rate Limiter project', 'Write LinkedIn post draft'],
  Thu: ['2 NeetCode problems (trees)', 'Go tutorial: goroutines & channels', 'Apply to 1 target company'],
  Fri: ['2 NeetCode problems (graphs BFS/DFS)', 'Work on Feature Store project', 'Post on LinkedIn (native video or article)'],
  Sat: ['Mock interview (Pramp or with a peer)', 'Review week: what did you ship?', 'Read ByteByteGo newsletter / system design video'],
  Sun: ['Rest / optional: read tech blogs', 'Plan next week tasks', 'Update dashboard progress'],
};

const SKILLS_P1 = [
  { name: 'DSA — Arrays & Hashing', pct: 20, note: 'NeetCode 150: target 2/day. ~3 months to complete.' },
  { name: 'DSA — Trees & Graphs', pct: 10, note: 'Critical for big tech phone screens. Do after arrays.' },
  { name: 'System Design — fundamentals', pct: 35, note: 'Alex Xu book + ByteByteGo channel. CAP, consistent hashing, load balancing.' },
  { name: 'System Design — databases', pct: 30, note: 'Sharding, replication, indexing, ACID vs BASE.' },
];

const SKILLS_P2 = [
  { name: 'Go — basics & concurrency', pct: 15, note: 'Tour of Go → Effective Go → goroutines, channels, gRPC.' },
  { name: 'Kubernetes', pct: 20, note: 'Pods, services, deployments, Helm charts. Target CKA cert.' },
  { name: 'Python — async & FastAPI', pct: 40, note: 'asyncio, FastAPI, Pydantic. Build the ML serving project.' },
  { name: 'Observability — OpenTelemetry', pct: 10, note: 'Prometheus + Grafana. Build the log pipeline project.' },
];

const ALL_PROJECTS = [
  {
    id: 'wos', title: 'Web of Science Research Intelligence',
    desc: 'Production platform at Clarivate. Spring WebFlux + Elasticsearch + Angular. 100k+ records, 5000+ users.',
    defaultStatus: 'done', defaultPublic: true
  },
  {
    id: 'kookur', title: 'Kookur & Praani Platform',
    desc: 'Full stack solo build — backend, frontend, AWS infra. Beta stage.',
    defaultStatus: 'done', defaultPublic: true
  },
  {
    id: 'patent', title: 'Intelligent Safety System — Patent',
    desc: 'ML seat sensors + helmet sensors + alcohol detection. >90% accuracy. Spirit of Invention Award.',
    defaultStatus: 'done', defaultPublic: true
  },
  {
    id: 'ratelimiter', title: 'Distributed Rate Limiter (Go + Redis + K8s)',
    desc: 'Sliding window + token bucket across multiple replicas. Benchmarked at 50k req/sec. Prometheus metrics.',
    defaultStatus: 'progress', defaultPublic: false
  },
  {
    id: 'featurestore', title: 'Real-Time ML Feature Store',
    desc: 'Kafka → feature computation → FastAPI serving. Redis online, PostgreSQL offline. <10ms retrieval.',
    defaultStatus: 'progress', defaultPublic: false
  },
  {
    id: 'miniES', title: 'Mini Elasticsearch from Scratch',
    desc: 'Inverted index + tokeniser + BM25 ranking + Boolean queries. THE wow project for interviews.',
    defaultStatus: 'idea', defaultPublic: false
  },
  {
    id: 'logpipeline', title: 'Distributed Log Aggregation Pipeline',
    desc: 'Mini-Datadog: OpenTelemetry agents → aggregator → anomaly detection → Grafana. SRE signal.',
    defaultStatus: 'idea', defaultPublic: false
  },
  {
    id: 'taskqueue', title: 'Fault-Tolerant Task Queue',
    desc: 'Persistent job queue with at-least-once delivery, dead letter queue, exponential backoff. No Celery.',
    defaultStatus: 'idea', defaultPublic: false
  },
];

const LINKEDIN_CHECKS = [
  { text: 'Headline → "Software Engineer · Distributed Systems | Python · Go · AWS · Elasticsearch"', badge: 'now' },
  { text: 'About section → lead with 3 years prod experience, key results, open to work', badge: 'now' },
  { text: 'Enable "Open to Work" for recruiters only', badge: 'now' },
  { text: 'Add Patent No. 202341004169 as Publication entry', badge: 'now' },
  { text: 'Reorder skills: Python, Go, Distributed Systems, AWS, Kubernetes, Elasticsearch first', badge: 'now' },
  { text: 'Delete or archive old LinkedIn Learning certificate posts (6 posts from 2022)', badge: 'now' },
  { text: 'Pin the MTU hackathon post to top of activity', badge: 'now' },
  { text: 'Add Featured section with 2 best GitHub projects (screenshot/GIF)', badge: 'week' },
  { text: 'Get 3-5 recommendations — Clarivate manager, Kookur co-founder', badge: 'month' },
  { text: 'Post 1 native LinkedIn video showing a project demo', badge: 'week' },
  { text: 'Add location "Cork, Ireland" explicitly', badge: 'now' },
];

const JOB_TARGETS = [
  {
    tier: 'Apply Now (your CV is ready)',
    jobs: [
      { company: 'Qumulo', location: 'Cork', role: 'Software Engineer', salary: '€75-90k', url: '' },
      { company: 'Fenergo', location: 'Dublin', role: 'Backend Engineer', salary: '€75-90k', url: '' },
      { company: 'Trend Micro', location: 'Cork', role: 'Platform / Security Engineer', salary: '€70-85k', url: '' },
    ]
  },
  {
    tier: 'Tier 1 — after 2-3 months DSA prep',
    jobs: [
      { company: 'Apple', location: 'Cork', role: 'Software Engineer', salary: '€90-120k', url: '' },
      { company: 'HubSpot', location: 'Dublin', role: 'Backend / Platform Engineer', salary: '€80-110k', url: '' },
      { company: 'Workday', location: 'Dublin', role: 'Software Engineer', salary: '€80-105k', url: '' },
      { company: 'Salesforce', location: 'Dublin', role: 'Software Engineer', salary: '€80-110k', url: '' },
    ]
  },
  {
    tier: 'Reach — after Go + K8s projects',
    jobs: [
      { company: 'Stripe', location: 'Dublin', role: 'Backend Engineer', salary: '€100-140k', url: '' },
      { company: 'Cloudflare', location: 'Remote/Dublin', role: 'Platform Engineer', salary: '€95-130k', url: '' },
    ]
  }
];

const CONTENT_PLAN = [
  {
    format: 'LinkedIn Native Video (primary)',
    items: [
      {
        title: '"I built a distributed rate limiter in Go — here\'s how sliding window works"',
        desc: '30-60s screen recording. Show the system handling load, Prometheus graph showing req/sec. Voice-over explaining one design decision.',
        tags: ['Go', 'System Design', 'Distributed Systems', '#backend', '#software']
      },
      {
        title: '"How I cut Elasticsearch query latency by 50% at Clarivate"',
        desc: 'Before vs after. Explain the specific indexing change or query rewrite. Numbers make it credible.',
        tags: ['Elasticsearch', 'Backend', 'Performance', '#engineering']
      },
      {
        title: '"Building a feature store from scratch — here\'s the architecture"',
        desc: 'Whiteboard/diagram walkthrough. Show Kafka → compute → Redis → serve. Explain why feature stores matter for ML at scale.',
        tags: ['ML Engineering', 'Kafka', 'Redis', '#mlops']
      },
    ]
  },
  {
    format: 'LinkedIn Text Posts (supporting)',
    items: [
      {
        title: '"3 system design tradeoffs I learned at production scale"',
        desc: 'Short numbered list: consistency vs availability, SQL vs NoSQL for your use case, async vs sync processing. Specific examples from real work.',
        tags: ['System Design', 'Lessons', '#softwareengineering']
      },
      {
        title: '"I have a patent and 3 years of engineering experience — here\'s what I\'m building next"',
        desc: 'Personal narrative post. Use it to announce you\'re open to work. Mention the projects you\'re building. Authenticity converts here.',
        tags: ['Career', 'Open to Work', '#engineer']
      },
    ]
  },
];

/* ── INIT DASHBOARD ─────────────────────────── */
function initDashboard() {
  sessionStorage.setItem('jm_unlocked', '1');
  initNav();
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-IE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  renderStats();
  renderTimeline();
  renderQuickWins();
  renderWeekly();
  renderSkillSprint();
  renderProjects();
  renderLinkedinChecklist();
  renderJobBoard();
  renderContentPlan();
}

/* ── STATS ──────────────────────────────────── */
function renderStats() {
  // Gather all check items
  const allChecks = getChecks('linkedin').filter(c => c.done).length
    + getChecks('quickwins').filter(c => c.done).length;
  const totalChecks = QUICK_WINS.length + LINKEDIN_CHECKS.length;
  const weekTasks = getWeekDone();
  const totalWeek = Object.values(WEEKLY_PLAN).reduce((a,d) => a + d.length, 0);

  renderStatCard('statDone', allChecks + '/' + totalChecks, 'tasks done');
  renderStatCard('statWeek', weekTasks + '/' + totalWeek, 'week tasks', 'var(--accent-2)');
  renderStatCard('statGoal', '€80k+', 'target salary', 'var(--accent)');
  const months = Math.max(0, Math.round((new Date('2026-09-01') - new Date()) / (1000*60*60*24*30)));
  renderStatCard('statDays', months + ' mo', 'to MSc finish', 'var(--amber)');

  const pct = Math.round(((allChecks / Math.max(totalChecks, 1)) * 100));
  const fillEl = document.getElementById('overallFill');
  const metaEl = document.getElementById('overallMeta');
  setTimeout(() => { if (fillEl) fillEl.style.width = pct + '%'; }, 300);
  if (metaEl) metaEl.textContent = pct + '% of setup tasks complete · keep going';
}

function renderStatCard(id, num, label, color) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="stat-num" style="color:${color||'var(--text)'}">${num}</div><div class="stat-label">${label}</div>`;
}

function getWeekDone() {
  const saved = LSget('weekdone') || {};
  return Object.values(saved).filter(Boolean).length;
}

/* ── TIMELINE ───────────────────────────────── */
function renderTimeline() {
  const el = document.getElementById('timeline');
  if (!el) return;
  el.innerHTML = TIMELINE_PHASES.map(p => `
    <div class="tl-item ${p.state === 'active' ? 'is-active' : ''}">
      <div class="tl-dot ${p.state}"></div>
      <div class="tl-when mono">${p.when}</div>
      <div class="tl-what">${p.what}</div>
    </div>
  `).join('');
}

/* ── QUICK WINS ─────────────────────────────── */
function getChecks(key) {
  const data = LSget(key + '_checks');
  const defaults = key === 'quickwins' ? QUICK_WINS : LINKEDIN_CHECKS;
  if (!data) return defaults.map((item, i) => ({ ...item, done: false, id: i }));
  return defaults.map((item, i) => ({ ...item, done: data[i] || false, id: i }));
}
function saveChecks(key, checks) {
  const map = {};
  checks.forEach(c => { map[c.id] = c.done; });
  LSset(key + '_checks', map);
}

function renderQuickWins() {
  const el = document.getElementById('quickWins');
  if (!el) return;
  const checks = getChecks('quickwins');
  el.innerHTML = checks.map(c => `
    <div class="check-item ${c.done ? 'done' : ''}" data-key="quickwins" data-id="${c.id}">
      <div class="check-box"></div>
      <span class="check-text">${c.text}</span>
      <span class="check-badge badge-${c.badge}">${c.badge}</span>
    </div>
  `).join('');
  el.querySelectorAll('.check-item').forEach(item => {
    item.addEventListener('click', () => toggleCheck('quickwins', +item.dataset.id));
  });
}

function renderLinkedinChecklist() {
  const el = document.getElementById('linkedinChecklist');
  if (!el) return;
  const checks = getChecks('linkedin');
  el.innerHTML = checks.map(c => `
    <div class="check-item ${c.done ? 'done' : ''}" data-key="linkedin" data-id="${c.id}">
      <div class="check-box"></div>
      <span class="check-text">${c.text}</span>
      <span class="check-badge badge-${c.badge}">${c.badge}</span>
    </div>
  `).join('');
  el.querySelectorAll('.check-item').forEach(item => {
    item.addEventListener('click', () => toggleCheck('linkedin', +item.dataset.id));
  });
}

function toggleCheck(key, id) {
  const checks = getChecks(key);
  const c = checks.find(x => x.id === id);
  if (c) c.done = !c.done;
  saveChecks(key, checks);
  if (key === 'quickwins') renderQuickWins();
  if (key === 'linkedin') renderLinkedinChecklist();
  renderStats();
}

/* ── WEEKLY ─────────────────────────────────── */
function renderWeekly() {
  const el = document.getElementById('weeklyBoard');
  if (!el) return;
  const saved = LSget('weekdone') || {};
  const days = Object.keys(WEEKLY_PLAN);
  el.innerHTML = days.map(day => `
    <div class="week-day">
      <div class="week-day-title">${day} <span>${WEEKLY_PLAN[day].length} tasks</span></div>
      ${WEEKLY_PLAN[day].map((task, i) => {
        const key = day + '_' + i;
        const done = !!saved[key];
        return `<div class="check-item ${done ? 'done' : ''}" data-wkey="${key}">
          <div class="check-box"></div>
          <span class="check-text">${task}</span>
        </div>`;
      }).join('')}
    </div>
  `).join('');
  el.querySelectorAll('.check-item[data-wkey]').forEach(item => {
    item.addEventListener('click', () => toggleWeek(item.dataset.wkey));
  });
  document.getElementById('resetWeekBtn').addEventListener('click', () => {
    if (confirm('Reset all weekly tasks?')) { LSset('weekdone', {}); renderWeekly(); renderStats(); }
  });
}

function toggleWeek(key) {
  const saved = LSget('weekdone') || {};
  saved[key] = !saved[key];
  LSset('weekdone', saved);
  renderWeekly();
  renderStats();
}

/* ── SKILL SPRINT ───────────────────────────── */
function renderSkillSprint() {
  renderSkillList('skillList1', SKILLS_P1);
  renderSkillList('skillList2', SKILLS_P2);
  renderDSATracker();
}

function renderSkillList(id, skills) {
  const el = document.getElementById(id);
  if (!el) return;
  const saved = LSget(id + '_pct') || {};
  el.innerHTML = skills.map((s, i) => {
    const pct = saved[i] !== undefined ? saved[i] : s.pct;
    return `<div class="skill-row">
      <div class="skill-head">
        <span class="skill-name">${s.name}</span>
        <span class="skill-pct" id="${id}_pct_${i}">${pct}%</span>
      </div>
      <div class="skill-track"><div class="skill-fill" id="${id}_fill_${i}" style="width:${pct}%"></div></div>
      <div class="skill-note">${s.note}</div>
      <input type="range" min="0" max="100" value="${pct}" step="5"
        style="width:100%;margin-top:6px;accent-color:var(--accent)"
        data-list="${id}" data-idx="${i}"
        oninput="updateSkillPct(this,'${id}',${i})"
      />
    </div>`;
  }).join('');
}

function updateSkillPct(input, listId, idx) {
  const pct = +input.value;
  document.getElementById(listId + '_pct_' + idx).textContent = pct + '%';
  document.getElementById(listId + '_fill_' + idx).style.width = pct + '%';
  const saved = LSget(listId + '_pct') || {};
  saved[idx] = pct;
  LSset(listId + '_pct', saved);
}

function renderDSATracker() {
  const el = document.getElementById('dsaTracker');
  if (!el) return;
  const total = 150;
  const done = LSget('dsa_done') || {};
  const doneCount = Object.values(done).filter(Boolean).length;
  el.innerHTML = `
    <div class="dsa-grid" id="dsaGrid">
      ${Array.from({length: total}, (_, i) =>
        `<div class="dsa-day ${done[i] ? 'done' : ''}" data-i="${i}" title="Problem ${i+1}"></div>`
      ).join('')}
    </div>
    <div class="dsa-label">${doneCount} / ${total} problems completed · click to mark done</div>
  `;
  el.querySelectorAll('.dsa-day').forEach(d => {
    d.addEventListener('click', () => {
      const i = +d.dataset.i;
      const saved = LSget('dsa_done') || {};
      saved[i] = !saved[i];
      LSset('dsa_done', saved);
      renderDSATracker();
    });
  });
}

/* ── PROJECTS ───────────────────────────────── */
function renderProjects() {
  const el = document.getElementById('projectBoard');
  if (!el) return;
  const saved = LSget('proj_state') || {};
  el.innerHTML = ALL_PROJECTS.map(p => {
    const state = saved[p.id] || { status: p.defaultStatus, public: p.defaultPublic };
    const statusOptions = ['idea', 'progress', 'done'];
    return `<div class="proj-row" id="projrow_${p.id}">
      <div class="proj-row-header">
        <span class="proj-row-title">${p.title}</span>
        <span class="status-pill pill-${state.status}">${state.status}</span>
        <span class="status-pill ${state.public ? 'pill-done' : 'pill-idea'}">${state.public ? 'public' : 'private'}</span>
      </div>
      <div class="proj-row-desc">${p.desc}</div>
      <div class="proj-row-actions">
        ${statusOptions.map(s => `
          <button class="toggle-btn ${state.status === s ? 'active-btn' : ''}"
            onclick="setProjStatus('${p.id}','${s}')">
            ${s}
          </button>
        `).join('')}
        <button class="toggle-btn ${state.public ? 'active-btn' : ''}"
          onclick="toggleProjPublic('${p.id}')">
          ${state.public ? '● public' : '○ private'}
        </button>
      </div>
    </div>`;
  }).join('');
}

function setProjStatus(id, status) {
  const saved = LSget('proj_state') || {};
  const proj = ALL_PROJECTS.find(p => p.id === id);
  if (!saved[id]) saved[id] = { status: proj.defaultStatus, public: proj.defaultPublic };
  saved[id].status = status;
  LSset('proj_state', saved);
  renderProjects();
}
function toggleProjPublic(id) {
  const saved = LSget('proj_state') || {};
  const proj = ALL_PROJECTS.find(p => p.id === id);
  if (!saved[id]) saved[id] = { status: proj.defaultStatus, public: proj.defaultPublic };
  saved[id].public = !saved[id].public;
  LSset('proj_state', saved);
  renderProjects();
}

/* ── JOB BOARD ──────────────────────────────── */
function renderJobBoard() {
  const el = document.getElementById('jobBoard');
  if (!el) return;
  const saved = LSget('job_status') || {};
  el.innerHTML = JOB_TARGETS.map(tier => `
    <div class="job-tier">
      <div class="tier-title">${tier.tier}</div>
      ${tier.jobs.map((job, i) => {
        const key = tier.tier + '_' + i;
        const status = saved[key] || 'not applied';
        return `<div class="job-card">
          <div>
            <div class="job-company">${job.company} <span style="color:var(--text-3);font-size:0.75rem;font-weight:400">· ${job.location}</span></div>
            <div class="job-role">${job.role}</div>
          </div>
          <div class="job-actions">
            <span class="job-salary">${job.salary}</span>
            <select class="job-status-select" onchange="setJobStatus('${key}',this.value)">
              ${['not applied','researching','applied','interview','offer','rejected'].map(s =>
                `<option value="${s}" ${status === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
        </div>`;
      }).join('')}
    </div>
  `).join('');
}
function setJobStatus(key, val) {
  const saved = LSget('job_status') || {};
  saved[key] = val;
  LSset('job_status', saved);
}

/* ── CONTENT PLAN ───────────────────────────── */
function renderContentPlan() {
  const el = document.getElementById('contentPlan');
  if (!el) return;
  el.innerHTML = CONTENT_PLAN.map(section => `
    <div class="content-format">
      <div class="cf-title mono">${section.format}</div>
      ${section.items.map(item => `
        <div class="content-item">
          <div class="ci-title">${item.title}</div>
          <div class="ci-desc">${item.desc}</div>
          <div class="ci-tags">${item.tags.map(t => `<span class="ci-tag">${t}</span>`).join('')}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

// Expose to inline handlers
window.updateSkillPct = updateSkillPct;
window.setProjStatus  = setProjStatus;
window.toggleProjPublic = toggleProjPublic;
window.setJobStatus   = setJobStatus;
