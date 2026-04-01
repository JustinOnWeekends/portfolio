/* ============================================
   JUSTIN MIRANDA — DASHBOARD JS
   All data stored in localStorage.
   Project changes sync to portfolio page.
   ============================================ */
'use strict';

const PASSCODE = '251112';
const LSget = key => { try { return JSON.parse(localStorage.getItem('jm_dash_' + key)); } catch { return null; } };
const LSset = (key, val) => localStorage.setItem('jm_dash_' + key, JSON.stringify(val));

/* ── DEFAULT PROJECTS (mirror of main.js) ──── */
const DEFAULT_PROJECTS = [
  {
    id: 'wos', title: 'Web of Science Research Intelligence',
    desc: 'Full-stack research data platform (Spring WebFlux + Angular + Elasticsearch). Handles 100k+ academic records with sub-second retrieval for 5,000+ active users. Certificate of Appreciation for September 2024 launch.',
    status: 'completed', tags: ['Spring WebFlux','Angular','Elasticsearch','AWS','Java'],
    public: true, link: '', image: '', highlight: '50% faster queries · 5,000+ users'
  },
  {
    id: 'kookur', title: 'Kookur & Praani — Pet Platform',
    desc: 'Sole engineer for a venture-backed pet-care startup. Built full backend (Spring WebFlux), Angular frontend, and AWS infrastructure (S3, RDS, Elastic Beanstalk) from scratch. CI/CD pipelines. Live in beta.',
    status: 'completed', tags: ['Spring WebFlux','Angular','AWS','CI/CD','PostgreSQL'],
    public: true, link: '', image: '', highlight: 'Sole engineer · full stack + AWS infra'
  },
  {
    id: 'patent', title: 'Intelligent Safety System — Patent #202341004169',
    desc: 'ML-powered seat sensors detect anti-triple riding with >90% accuracy. Helmet sensors (IR, pressure, ultrasonic) automate safety checks. Alcohol sensor eliminated drink-and-drive ignition starts in testing.',
    status: 'completed', tags: ['Machine Learning','IoT','C++','Patent','Sensors'],
    public: true, link: '', image: '', highlight: 'Spirit of Invention Award · $1,300 prize'
  },
  {
    id: 'boneconductor', title: 'Bone Conduction Hearing Aid via Jawbone',
    desc: 'Bone conduction device mounted on the jawbone for patients with eardrum impairments. ~70% improvement in sound clarity over conventional aids.',
    status: 'completed', tags: ['Hardware','Signal Processing','Electronics','Biomedical'],
    public: true, link: '', image: '', highlight: '1st place · GITAM Tech Expo & Symbiot 2020'
  },
  {
    id: 'carbonglass', title: 'Carbon Glass — Sustainability Widget',
    desc: 'Built at MTU SDGs Hackathon (2 hours). Widget for clothing products showing carbon emissions, water usage, and chemical impact.',
    status: 'completed', tags: ['Hackathon','Sustainability','SDGs','UI/UX'],
    public: true, link: '', image: '', highlight: '3rd place · MTU SDG Hackathon 2025'
  },
  {
    id: 'dbmigration', title: 'Large-Scale DB Migration — Clarivate',
    desc: 'Led end-to-end database migration. Redesigned CRUD and group queries. 30% faster processing, near-zero downtime.',
    status: 'completed', tags: ['PostgreSQL','SQL Optimisation','Spring','Java','Migration'],
    public: true, link: '', image: '', highlight: '30% faster · near-zero downtime'
  }
];

/* ── PROJECT STORAGE (shared with portfolio) ─ */
function getProjects() {
  try {
    const raw = localStorage.getItem('jm_projects');
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem('jm_projects', JSON.stringify(DEFAULT_PROJECTS));
  return [...DEFAULT_PROJECTS];
}
function saveProjects(arr) { localStorage.setItem('jm_projects', JSON.stringify(arr)); }
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

/* ── LOCK ───────────────────────────────────── */
const lockScreen = document.getElementById('lockScreen');
const dashboard  = document.getElementById('dashboard');
const inputEl    = document.getElementById('passcodeInput');
const errEl      = document.getElementById('lockError');

const shakeStyle = document.createElement('style');
shakeStyle.textContent = '.shake{animation:shake .4s linear}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
document.head.appendChild(shakeStyle);

function tryUnlock(code) {
  if (code === PASSCODE) {
    lockScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    sessionStorage.setItem('jm_unlocked','1');
    initDashboard();
  } else {
    errEl.textContent = 'access denied.';
    inputEl.value = '';
    inputEl.classList.add('shake');
    setTimeout(() => { inputEl.classList.remove('shake'); errEl.textContent = ''; }, 1500);
  }
}

document.getElementById('unlockBtn').addEventListener('click', () => tryUnlock(inputEl.value.trim()));
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(inputEl.value.trim()); });
document.getElementById('logoutBtn').addEventListener('click', () => { sessionStorage.removeItem('jm_unlocked'); location.reload(); });

if (sessionStorage.getItem('jm_unlocked') === '1') {
  lockScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  initDashboard();
}

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

/* ── STATIC DATA ────────────────────────────── */
const TIMELINE_PHASES = [
  { when: 'Now → May 2026', what: 'Fix LinkedIn headline. Start NeetCode 150 (2/day). Apply to Qumulo Cork now. Read Alex Xu System Design ch1–5. Start Go tutorial.', state: 'active' },
  { when: 'June – July 2026', what: 'Build Go distributed KV store. Build Python ML FastAPI project. Finish NeetCode 75. Start K8s basics. Post 1 LinkedIn video per 2 weeks. Apply to Fenergo, Trend Micro, HubSpot.', state: 'future' },
  { when: 'Aug – Sept 2026 (MSc done)', what: 'Prime window — fresh degree, polished projects, 3 months DSA prep. Apply to Apple, Workday, Salesforce Dublin. Mock interviews 2x/week.', state: 'future' },
  { when: 'Oct – Nov 2026', what: 'Broad wave — 15-20 active applications. Apply to Stripe, Cloudflare. Negotiate hard.', state: 'future' },
  { when: 'Dec 2026 – Mar 2027', what: 'If no offer — reassess interview performance. Consider 3-month contract at big tech for brand-name CV entry.', state: 'future' }
];
const WEEKLY_PLAN = {
  Mon:['2 NeetCode problems (arrays/hashing)','1 chapter System Design (Alex Xu)','LinkedIn profile: edit one section'],
  Tue:['2 NeetCode problems (two pointers)','Go tutorial: 1 section (Tour of Go)','Add README to a GitHub project'],
  Wed:['2 NeetCode problems (sliding window)','Work on Distributed Rate Limiter / Feature Store','Draft a LinkedIn post'],
  Thu:['2 NeetCode problems (trees)','Go tutorial: goroutines & channels','Apply to 1 target company'],
  Fri:['2 NeetCode problems (graphs BFS/DFS)','Work on main side project','Post on LinkedIn (native video or article)'],
  Sat:['Mock interview (Pramp or peer)','Review week — what shipped?','Watch ByteByteGo system design video'],
  Sun:['Rest / read tech blogs','Plan next week tasks','Update dashboard progress']
};
const SKILLS_P1 = [
  { name: 'DSA — Arrays & Hashing', pct: 20, note: 'NeetCode 150: 2/day. 3 months to finish.' },
  { name: 'DSA — Trees & Graphs',   pct: 10, note: 'Critical for big tech phone screens.' },
  { name: 'System Design — basics', pct: 35, note: 'Alex Xu + ByteByteGo. CAP, hashing, load balancing.' },
  { name: 'System Design — DBs',    pct: 30, note: 'Sharding, replication, ACID vs BASE.' },
];
const SKILLS_P2 = [
  { name: 'Go — basics & concurrency', pct: 15, note: 'Tour of Go → Effective Go → goroutines, channels.' },
  { name: 'Kubernetes',                pct: 20, note: 'Pods, services, Helm charts. Target CKA cert.' },
  { name: 'Python — async & FastAPI',  pct: 40, note: 'asyncio, FastAPI, Pydantic. Build the ML project.' },
  { name: 'Observability (OTel)',      pct: 10, note: 'Prometheus + Grafana. Build log pipeline project.' },
];
const LINKEDIN_CHECKS = [
  { text: 'Headline → "Software Engineer · Distributed Systems | Python · Go · AWS · Elasticsearch"', badge: 'now' },
  { text: 'Rewrite About section — lead with 3 yrs prod exp, key results, open to work', badge: 'now' },
  { text: 'Enable "Open to Work" for recruiters only', badge: 'now' },
  { text: 'Add Patent No. 202341004169 as a Publication entry', badge: 'now' },
  { text: 'Reorder Skills: Python, Go, Distributed Systems, AWS, Kubernetes, Elasticsearch first', badge: 'now' },
  { text: 'Delete/archive old LinkedIn Learning certificate posts (6 posts from 2022)', badge: 'now' },
  { text: 'Pin the MTU hackathon post to top of activity feed', badge: 'now' },
  { text: 'Add Featured section with 2 best GitHub projects (screenshot/GIF)', badge: 'week' },
  { text: 'Get 3-5 recommendations — Clarivate manager, Kookur co-founder', badge: 'month' },
  { text: 'Post 1 native LinkedIn video showing a project demo', badge: 'week' },
];
const QUICK_WINS = [
  { text: 'Change LinkedIn headline today (5 min)', badge: 'now' },
  { text: 'Rewrite LinkedIn About section', badge: 'now' },
  { text: 'Enable Open to Work (recruiters only)', badge: 'now' },
  { text: 'Add patent as LinkedIn Publication', badge: 'now' },
  { text: 'Archive old certificate posts on LinkedIn', badge: 'now' },
  { text: 'Set up daily GitHub commit habit', badge: 'now' },
  { text: 'Apply to Qumulo Cork — CV is ready', badge: 'now' },
];
const JOB_TARGETS = [
  { tier:'Apply Now (CV ready)', jobs:[
    { company:'Qumulo', location:'Cork', role:'Software Engineer', salary:'€75-90k' },
    { company:'Fenergo', location:'Dublin', role:'Backend Engineer', salary:'€75-90k' },
    { company:'Trend Micro', location:'Cork', role:'Platform Engineer', salary:'€70-85k' },
  ]},
  { tier:'Tier 1 — after 2-3 months DSA prep', jobs:[
    { company:'Apple', location:'Cork', role:'Software Engineer', salary:'€90-120k' },
    { company:'HubSpot', location:'Dublin', role:'Backend / Platform', salary:'€80-110k' },
    { company:'Workday', location:'Dublin', role:'Software Engineer', salary:'€80-105k' },
    { company:'Salesforce', location:'Dublin', role:'Software Engineer', salary:'€80-110k' },
  ]},
  { tier:'Reach — after Go + K8s projects', jobs:[
    { company:'Stripe', location:'Dublin', role:'Backend Engineer', salary:'€100-140k' },
    { company:'Cloudflare', location:'Remote/Dublin', role:'Platform Engineer', salary:'€95-130k' },
  ]}
];
const CONTENT_IDEAS = [
  { title:'"I built a distributed rate limiter in Go — here\'s how sliding window works"', desc:'30-60s screen recording. Show load test + Prometheus graph. Explain one design decision in voice-over.', tags:['Go','#backend','#systemdesign'] },
  { title:'"How I cut Elasticsearch query latency by 50% at Clarivate"', desc:'Before vs after. Specific indexing change or query rewrite. Numbers make it credible.', tags:['Elasticsearch','#performance','#engineering'] },
  { title:'"Building an ML feature store from scratch — the architecture"', desc:'Whiteboard/diagram: Kafka → feature compute → Redis → FastAPI serve. Why feature stores matter at scale.', tags:['#mlops','Kafka','Redis'] },
  { title:'"3 system design tradeoffs I learned at production scale"', desc:'Short numbered list from real work. Consistency vs availability, SQL vs NoSQL for your use case, async vs sync.', tags:['#systemdesign','#softwareengineering'] },
  { title:'"I hold a patent and 3 years of engineering experience — here\'s what I\'m building next"', desc:'Personal narrative. Announce open to work. Mention projects. Authenticity converts.', tags:['#career','#opentowork'] },
];

/* ══════════════════════════════════════════════
   INIT DASHBOARD
══════════════════════════════════════════════ */
function initDashboard() {
  initNav();
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-IE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  renderStats();
  renderTimeline();
  renderQuickWins();
  renderWeekly();
  renderSkillSprint();
  renderProjectBoard();  /* ← projects panel */
  renderLinkedinChecklist();
  renderJobBoard();
  renderContentPlan();
  document.getElementById('resetWeekBtn').addEventListener('click', () => {
    if (confirm('Reset all weekly tasks?')) { LSset('weekdone',{}); renderWeekly(); renderStats(); }
  });
}

/* ── STATS ──────────────────────────────────── */
function renderStats() {
  const liDone    = getChecks('linkedin').filter(c=>c.done).length;
  const qwDone    = getChecks('quickwins').filter(c=>c.done).length;
  const total     = LINKEDIN_CHECKS.length + QUICK_WINS.length;
  const weekTotal = Object.values(WEEKLY_PLAN).reduce((a,d)=>a+d.length,0);
  const weekDone  = Object.values(LSget('weekdone')||{}).filter(Boolean).length;
  const pct       = Math.round(((liDone+qwDone)/Math.max(total,1))*100);
  const months    = Math.max(0,Math.round((new Date('2026-09-01')-new Date())/(1000*60*60*24*30)));

  sc('statDone',   liDone+qwDone+'/'+total,  'tasks done');
  sc('statWeek',   weekDone+'/'+weekTotal,    'week tasks', 'var(--accent-2)');
  sc('statGoal',   '€80k+',                  'target salary', 'var(--accent)');
  sc('statDays',   months+' mo',             'to MSc finish', 'var(--amber)');

  const fill = document.getElementById('overallFill');
  const meta = document.getElementById('overallMeta');
  setTimeout(()=>{ if(fill) fill.style.width=pct+'%'; },300);
  if(meta) meta.textContent = pct+'% of setup tasks complete';
}
function sc(id,num,label,color){
  const el=document.getElementById(id); if(!el)return;
  el.innerHTML=`<div class="stat-num" style="color:${color||'var(--text)'}">${num}</div><div class="stat-label">${label}</div>`;
}

/* ── CHECKS ─────────────────────────────────── */
function getChecks(key) {
  const data = LSget(key+'_checks') || {};
  const src  = key==='quickwins' ? QUICK_WINS : LINKEDIN_CHECKS;
  return src.map((item,i)=>({...item, id:i, done:!!data[i]}));
}
function saveChecks(key,checks){ const m={}; checks.forEach(c=>{m[c.id]=c.done;}); LSset(key+'_checks',m); }
function toggleCheck(key,id){
  const checks=getChecks(key); const c=checks.find(x=>x.id===id); if(c)c.done=!c.done;
  saveChecks(key,checks);
  if(key==='quickwins') renderQuickWins();
  if(key==='linkedin')  renderLinkedinChecklist();
  renderStats();
}
function checkItem(text,done,badge,onclick){
  return `<div class="check-item ${done?'done':''}" onclick="${onclick}">
    <div class="check-box"></div>
    <span class="check-text">${escHtml(text)}</span>
    ${badge?`<span class="check-badge badge-${badge}">${badge}</span>`:''}
  </div>`;
}

function renderQuickWins(){
  const el=document.getElementById('quickWins'); if(!el)return;
  el.innerHTML=getChecks('quickwins').map(c=>checkItem(c.text,c.done,c.badge,`toggleCheck('quickwins',${c.id})`)).join('');
}
function renderLinkedinChecklist(){
  const el=document.getElementById('linkedinChecklist'); if(!el)return;
  el.innerHTML=getChecks('linkedin').map(c=>checkItem(c.text,c.done,c.badge,`toggleCheck('linkedin',${c.id})`)).join('');
}

/* ── TIMELINE ───────────────────────────────── */
function renderTimeline(){
  const el=document.getElementById('timeline'); if(!el)return;
  el.innerHTML=TIMELINE_PHASES.map(p=>`
    <div class="tl-item ${p.state==='active'?'is-active':''}">
      <div class="tl-dot ${p.state}"></div>
      <div class="tl-when mono">${p.when}</div>
      <div class="tl-what">${p.what}</div>
    </div>`).join('');
}

/* ── WEEKLY ─────────────────────────────────── */
function renderWeekly(){
  const el=document.getElementById('weeklyBoard'); if(!el)return;
  const saved=LSget('weekdone')||{};
  el.innerHTML=Object.keys(WEEKLY_PLAN).map(day=>`
    <div class="week-day">
      <div class="week-day-title">${day} <span>${WEEKLY_PLAN[day].length} tasks</span></div>
      ${WEEKLY_PLAN[day].map((task,i)=>{
        const k=day+'_'+i; const done=!!saved[k];
        return `<div class="check-item ${done?'done':''}" onclick="toggleWeek('${k}')">
          <div class="check-box"></div><span class="check-text">${task}</span></div>`;
      }).join('')}
    </div>`).join('');
}
function toggleWeek(key){ const s=LSget('weekdone')||{}; s[key]=!s[key]; LSset('weekdone',s); renderWeekly(); renderStats(); }

/* ── SKILL SPRINT ───────────────────────────── */
function renderSkillSprint(){ renderSkillList('skillList1',SKILLS_P1); renderSkillList('skillList2',SKILLS_P2); renderDSATracker(); }
function renderSkillList(id,skills){
  const el=document.getElementById(id); if(!el)return;
  const saved=LSget(id+'_pct')||{};
  el.innerHTML=skills.map((s,i)=>{
    const pct=saved[i]!==undefined?saved[i]:s.pct;
    return `<div class="skill-row">
      <div class="skill-head"><span class="skill-name">${s.name}</span><span class="skill-pct" id="${id}_p${i}">${pct}%</span></div>
      <div class="skill-track"><div class="skill-fill" id="${id}_f${i}" style="width:${pct}%"></div></div>
      <div class="skill-note">${s.note}</div>
      <input type="range" min="0" max="100" value="${pct}" step="5"
        style="width:100%;margin-top:6px;accent-color:var(--accent)"
        oninput="updateSkillPct(this,'${id}',${i})"/>
    </div>`;
  }).join('');
}
function updateSkillPct(input,listId,idx){
  const pct=+input.value;
  document.getElementById(listId+'_p'+idx).textContent=pct+'%';
  document.getElementById(listId+'_f'+idx).style.width=pct+'%';
  const s=LSget(listId+'_pct')||{}; s[idx]=pct; LSset(listId+'_pct',s);
}
function renderDSATracker(){
  const el=document.getElementById('dsaTracker'); if(!el)return;
  const done=LSget('dsa_done')||{};
  const doneCount=Object.values(done).filter(Boolean).length;
  el.innerHTML=`
    <div class="dsa-grid">${Array.from({length:150},(_,i)=>
      `<div class="dsa-day ${done[i]?'done':''}" data-i="${i}" onclick="toggleDSA(${i})" title="Problem ${i+1}"></div>`
    ).join('')}</div>
    <div class="dsa-label">${doneCount} / 150 problems completed</div>`;
}
function toggleDSA(i){ const s=LSget('dsa_done')||{}; s[i]=!s[i]; LSset('dsa_done',s); renderDSATracker(); }

/* ══════════════════════════════════════════════
   PROJECT BOARD — full CRUD
══════════════════════════════════════════════ */
function renderProjectBoard() {
  const el = document.getElementById('projectBoard');
  if (!el) return;

  const projects = getProjects();

  el.innerHTML = `
    <!-- ADD PROJECT BUTTON -->
    <button class="add-proj-btn mono" onclick="openAddForm()">+ add project</button>

    <!-- ADD / EDIT FORM (hidden by default) -->
    <div id="projForm" class="proj-form hidden">
      <div class="proj-form-title mono" id="formTitle">new project</div>

      <div class="form-row">
        <label class="form-label mono">title</label>
        <input id="fTitle" class="form-input" placeholder="Project name" />
      </div>
      <div class="form-row">
        <label class="form-label mono">description</label>
        <textarea id="fDesc" class="form-input form-textarea" placeholder="What did you build? What does it do?"></textarea>
      </div>
      <div class="form-row">
        <label class="form-label mono">highlight <span style="color:var(--text-3)">(e.g. "50% faster · 5k users")</span></label>
        <input id="fHighlight" class="form-input" placeholder="Key achievement or metric" />
      </div>
      <div class="form-row">
        <label class="form-label mono">tags <span style="color:var(--text-3)">(comma-separated)</span></label>
        <input id="fTags" class="form-input" placeholder="Go, Redis, Kubernetes" />
      </div>
      <div class="form-row">
        <label class="form-label mono">image URL <span style="color:var(--text-3)">(optional — paste a direct image link)</span></label>
        <input id="fImage" class="form-input" placeholder="https://..." />
      </div>
      <div class="form-row">
        <label class="form-label mono">project link <span style="color:var(--text-3)">(optional — GitHub, live URL)</span></label>
        <input id="fLink" class="form-input" placeholder="https://github.com/..." />
      </div>
      <div class="form-row-split">
        <div>
          <label class="form-label mono">status</label>
          <select id="fStatus" class="form-input form-select">
            <option value="completed">completed</option>
            <option value="progress">in progress</option>
            <option value="idea">idea / planned</option>
          </select>
        </div>
        <div>
          <label class="form-label mono">visibility</label>
          <select id="fPublic" class="form-input form-select">
            <option value="true">public (show on portfolio)</option>
            <option value="false">private (hidden)</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-save mono" onclick="saveProject()">save project</button>
        <button class="btn-cancel mono" onclick="closeForm()">cancel</button>
      </div>
      <div id="formMsg" class="form-msg mono"></div>
    </div>

    <!-- PROJECT LIST -->
    <div id="projList">
      ${projects.map(p => projRowHTML(p)).join('')}
    </div>
  `;
}

function projRowHTML(p) {
  const statusClass = p.status === 'completed' ? 'pill-done' : p.status === 'progress' ? 'pill-prog' : 'pill-idea';
  const imgPreview  = p.image ? `<img src="${escHtml(p.image)}" style="width:100%;height:80px;object-fit:cover;border-radius:3px;margin-bottom:0.75rem;display:block" onerror="this.style.display='none'"/>` : '';

  return `<div class="proj-row" id="prow_${p.id}">
    ${imgPreview}
    <div class="proj-row-header">
      <span class="proj-row-title">${escHtml(p.title)}</span>
      <span class="status-pill ${statusClass}">${p.status}</span>
      <span class="status-pill ${p.public ? 'pill-done' : 'pill-idea'}">${p.public ? 'public' : 'private'}</span>
    </div>
    ${p.highlight ? `<div style="font-family:'Space Mono',monospace;font-size:0.62rem;color:var(--accent);margin-bottom:0.5rem">${escHtml(p.highlight)}</div>` : ''}
    <div class="proj-row-desc">${escHtml(p.desc)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin:0.5rem 0 0.75rem">
      ${p.tags.map(t=>`<span style="font-family:'Space Mono',monospace;font-size:0.6rem;padding:2px 6px;border:1px solid var(--border);border-radius:2px;color:var(--text-3)">${escHtml(t)}</span>`).join('')}
    </div>
    <div class="proj-row-actions">
      <button class="toggle-btn" onclick="editProject('${p.id}')">edit</button>
      <button class="toggle-btn ${p.public ? 'active-btn' : ''}" onclick="togglePublic('${p.id}')">${p.public ? '● public' : '○ private'}</button>
      <button class="toggle-btn" onclick="deleteProject('${p.id}')" style="color:var(--red);border-color:var(--red)">delete</button>
    </div>
  </div>`;
}

let _editingId = null;

function openAddForm() {
  _editingId = null;
  clearForm();
  document.getElementById('formTitle').textContent = 'new project';
  document.getElementById('projForm').classList.remove('hidden');
  document.getElementById('fTitle').focus();
}

function editProject(id) {
  const p = getProjects().find(x => x.id === id);
  if (!p) return;
  _editingId = id;
  document.getElementById('fTitle').value     = p.title;
  document.getElementById('fDesc').value      = p.desc;
  document.getElementById('fHighlight').value = p.highlight || '';
  document.getElementById('fTags').value      = p.tags.join(', ');
  document.getElementById('fImage').value     = p.image || '';
  document.getElementById('fLink').value      = p.link || '';
  document.getElementById('fStatus').value    = p.status;
  document.getElementById('fPublic').value    = String(p.public);
  document.getElementById('formTitle').textContent = 'edit project';
  document.getElementById('projForm').classList.remove('hidden');
  document.getElementById('projForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeForm() {
  document.getElementById('projForm').classList.add('hidden');
  _editingId = null;
  clearForm();
}

function clearForm() {
  ['fTitle','fDesc','fHighlight','fTags','fImage','fLink'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('fStatus').value = 'completed';
  document.getElementById('fPublic').value = 'true';
  document.getElementById('formMsg').textContent = '';
}

function saveProject() {
  const title = document.getElementById('fTitle').value.trim();
  const desc  = document.getElementById('fDesc').value.trim();
  if (!title || !desc) {
    document.getElementById('formMsg').textContent = 'title and description are required.';
    return;
  }
  const tags = document.getElementById('fTags').value
    .split(',').map(t => t.trim()).filter(Boolean);
  const project = {
    id:        _editingId || uid(),
    title,
    desc,
    highlight: document.getElementById('fHighlight').value.trim(),
    tags,
    image:     document.getElementById('fImage').value.trim(),
    link:      document.getElementById('fLink').value.trim(),
    status:    document.getElementById('fStatus').value,
    public:    document.getElementById('fPublic').value === 'true',
  };

  const projects = getProjects();
  if (_editingId) {
    const idx = projects.findIndex(p => p.id === _editingId);
    if (idx > -1) projects[idx] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
  closeForm();
  renderProjectBoard();

  /* Flash success */
  const msg = document.getElementById('formMsg');
  if (msg) { msg.textContent = 'saved!'; setTimeout(() => { msg.textContent = ''; }, 2000); }
}

function togglePublic(id) {
  const projects = getProjects();
  const p = projects.find(x => x.id === id);
  if (p) p.public = !p.public;
  saveProjects(projects);
  renderProjectBoard();
}

function deleteProject(id) {
  if (!confirm('Delete this project? This also removes it from the portfolio.')) return;
  saveProjects(getProjects().filter(p => p.id !== id));
  renderProjectBoard();
}

/* ── JOB BOARD ──────────────────────────────── */
function renderJobBoard() {
  const el = document.getElementById('jobBoard'); if (!el) return;
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
                `<option value="${s}" ${status===s?'selected':''}>${s}</option>`
              ).join('')}
            </select>
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');
}
function setJobStatus(key,val){ const s=LSget('job_status')||{}; s[key]=val; LSset('job_status',s); }

/* ── CONTENT PLAN ───────────────────────────── */
function renderContentPlan() {
  const el = document.getElementById('contentPlan'); if (!el) return;
  el.innerHTML = CONTENT_IDEAS.map(item => `
    <div class="content-item">
      <div class="ci-title">${escHtml(item.title)}</div>
      <div class="ci-desc">${escHtml(item.desc)}</div>
      <div class="ci-tags">${item.tags.map(t=>`<span class="ci-tag">${escHtml(t)}</span>`).join('')}</div>
    </div>`).join('');
}

/* ── EXPOSE TO HTML INLINE HANDLERS ────────── */
window.toggleCheck    = toggleCheck;
window.toggleWeek     = toggleWeek;
window.toggleDSA      = toggleDSA;
window.updateSkillPct = updateSkillPct;
window.openAddForm    = openAddForm;
window.editProject    = editProject;
window.saveProject    = saveProject;
window.closeForm      = closeForm;
window.togglePublic   = togglePublic;
window.deleteProject  = deleteProject;
window.setJobStatus   = setJobStatus;
