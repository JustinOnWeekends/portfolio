/* ============================================
   JUSTIN MIRANDA — DASHBOARD JS
   Full honest roadmap + project tracker
   ============================================ */
'use strict';

const PASSCODE = '251112';
const LSget = k => { try { return JSON.parse(localStorage.getItem('jm_dash_'+k)); } catch { return null; } };
const LSset = (k,v) => localStorage.setItem('jm_dash_'+k, JSON.stringify(v));
function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

/* ── PROJECTS (shared storage with portfolio) ─ */
const DEFAULT_PROJECTS = [
  { id:'wos', title:'Web of Science Research Intelligence', desc:'Full-stack research data platform (Spring WebFlux + Angular + Elasticsearch). 100k+ records, sub-second retrieval for 5,000+ active users. Certificate of Appreciation for September 2024 launch.', status:'completed', tags:['Spring WebFlux','Angular','Elasticsearch','AWS','Java'], public:true, link:'', image:'', highlight:'50% faster queries · 5,000+ users' },
  { id:'kookur', title:'Kookur & Praani — Pet Platform', desc:'Sole engineer for a venture-backed pet-care startup. Full backend (Spring WebFlux), Angular frontend, AWS infrastructure (S3, RDS, Elastic Beanstalk) from scratch. CI/CD pipelines. Live in beta.', status:'completed', tags:['Spring WebFlux','Angular','AWS','CI/CD','PostgreSQL'], public:true, link:'', image:'', highlight:'Sole engineer · full stack + AWS infra' },
  { id:'patent', title:'Intelligent Safety System — Patent #202341004169', desc:'ML-powered seat sensors detect anti-triple riding >90% accuracy. Helmet sensors (IR, pressure, ultrasonic) automate safety checks. Alcohol sensor eliminated drink-and-drive ignition starts.', status:'completed', tags:['Machine Learning','IoT','C++','Patent','Sensors'], public:true, link:'', image:'', highlight:'Spirit of Invention Award · $1,300 prize' },
  { id:'boneconductor', title:'Bone Conduction Hearing Aid via Jawbone', desc:'Bone conduction device mounted on the jawbone for eardrum-impaired patients. ~70% improvement in sound clarity over conventional aids.', status:'completed', tags:['Hardware','Signal Processing','Electronics','Biomedical'], public:true, link:'', image:'', highlight:'1st place · GITAM Tech Expo & Symbiot 2020' },
  { id:'carbonglass', title:'Carbon Glass — Sustainability Widget', desc:'Built at MTU SDGs Hackathon (2 hours). Widget showing carbon emissions, water usage, and chemical impact for clothing products.', status:'completed', tags:['Hackathon','Sustainability','SDGs','UI/UX'], public:true, link:'', image:'', highlight:'3rd place · MTU SDG Hackathon 2025' },
  { id:'dbmigration', title:'Large-Scale DB Migration — Clarivate', desc:'Led end-to-end database migration. Redesigned CRUD and group queries. 30% faster processing, near-zero downtime.', status:'completed', tags:['PostgreSQL','SQL Optimisation','Spring','Java','Migration'], public:true, link:'', image:'', highlight:'30% faster · near-zero downtime' }
];
function getProjects(){ try{ const r=localStorage.getItem('jm_projects'); if(r) return JSON.parse(r); }catch(e){} localStorage.setItem('jm_projects',JSON.stringify(DEFAULT_PROJECTS)); return [...DEFAULT_PROJECTS]; }
function saveProjects(arr){ localStorage.setItem('jm_projects',JSON.stringify(arr)); }

/* ── STATIC DATA ─────────────────────────────── */
const TIMELINE_PHASES = [
  { when:'Month 1 — May 2026', title:'Foundation', what:'Python & SQL properly — write by hand, no AI. CS50 weeks 1–5. OOP basics. 1 NeetCode Easy/day. Fix LinkedIn headline today.', state:'active' },
  { when:'Month 2 — June 2026', title:'Systems thinking', what:'Data structures conceptually. Start DDIA ch1–4. ByteByteGo YouTube. NeetCode Mediums begin. Build ML fraud detection project. Apply to Qumulo, Fenergo, Trend Micro.', state:'future' },
  { when:'Month 3 — July 2026', title:'Build & apply', what:'Finish fraud detection API — deployed, documented, on LinkedIn. 2 mock interviews on Pramp. Apply broadly. NeetCode: arrays, two pointers, sliding window.', state:'future' },
  { when:'Month 4–5 — Aug/Sept 2026', title:'MSc finish + scale up', what:'Build log anomaly detector project. Finish MSc. Apply to Apple, HubSpot, Workday, Salesforce. Practice Clarivate war stories out loud. Post 1 LinkedIn video per 2 weeks.', state:'future' },
  { when:'Month 6–9 — Oct 2026+', title:'Offer sprint', what:'15–20 active applications simultaneously. 3 STAR stories rehearsed. Counter every first offer. Email every rejection asking for feedback.', state:'future' }
];

const WEEKLY_PLAN = {
  Mon:['Python / SQL fundamentals — write by hand, no AI (1.5 hrs)','CS50 lecture or DDIA chapter (1 hr)','1 NeetCode problem — read, think 15 min, write, then watch solution (45 min)','LinkedIn: send 2 connection requests with personalised note (30 min)'],
  Tue:['Project work — push something to GitHub (1.5 hrs)','System design: ByteByteGo video + sketch system on paper (1 hr)','1 NeetCode problem (45 min)','Write draft for this week\'s LinkedIn post (45 min)'],
  Wed:['Project work (1.5 hrs)','Read DDIA or Alex Xu ch (1 hr)','1 NeetCode problem (45 min)','Apply to 1 job OR do 1 professor/peer email (30 min)'],
  Thu:['Project work (1.5 hrs)','OOP / data structures revision (1 hr)','1 NeetCode problem (45 min)','Engage with 5 LinkedIn posts from engineers at target companies (30 min)'],
  Fri:['Project work (1 hr)','Post on LinkedIn — publish this week\'s post (30 min)','Review: what did you ship this week? Write 3 bullet points (30 min)','1 job application (45 min)'],
  Sat:['Mock interview on Pramp — free, no excuses (1 hr)','Practice explaining Clarivate / Kookur projects out loud — record yourself (45 min)','Read tech blog / newsletter (30 min)','Plan next week — fill in dashboard (30 min)'],
  Sun:['Rest. Seriously — burnout is the biggest risk over 9 months.','Optional: 1 hr light reading only — no coding, no applications']
};

const SKILLS_P1 = [
  { name:'Python — write from scratch', pct:10, note:'Python Crash Course ch1–10. Write every exercise by hand. No Copilot for 6 weeks.' },
  { name:'SQL — all JOIN types + window functions', pct:20, note:'Mode Analytics SQL Tutorial (free). Write 5 real queries per session.' },
  { name:'OOP — 4 pillars in Python', pct:15, note:'Corey Schafer YouTube OOP series. Build a bank account system using all 4 pillars.' },
  { name:'Data structures conceptual', pct:10, note:'CS50 weeks 3–5. Draw every structure on paper. Understand time complexity.' },
];
const SKILLS_P2 = [
  { name:'System design — fundamentals', pct:20, note:'DDIA ch1–4 + ByteByteGo. After each session sketch the system from memory.' },
  { name:'FastAPI + async Python', pct:25, note:'Build the fraud detection project. This is where Python depth comes from.' },
  { name:'DSA — NeetCode Easy', pct:5, note:'1 problem/day. Arrays and strings first. Time yourself. Explain solution in English.' },
  { name:'Elasticsearch deep dive', pct:55, note:'You already know it — now document it. Write 3 LinkedIn posts explaining how it works internally.' },
];

const QUICK_WINS = [
  { text:'Change LinkedIn headline NOW — "Software Engineer · Distributed Systems | Python · Go · AWS · Elasticsearch"', badge:'now' },
  { text:'Start Python Crash Course chapter 1 today — write the exercises by hand', badge:'now' },
  { text:'Email your MSc supervisor asking if they know anyone in industry', badge:'now' },
  { text:'Apply to Qumulo Cork — your existing CV is good enough', badge:'now' },
  { text:'Enable Open to Work on LinkedIn (recruiters only)', badge:'now' },
  { text:'Add Patent #202341004169 as a LinkedIn Publication entry', badge:'now' },
  { text:'Archive the 6 old LinkedIn Learning certificate posts', badge:'now' },
  { text:'Sign up for Pramp (free mock interviews) — pramp.com', badge:'now' },
];

const LINKEDIN_CHECKS = [
  { text:'Headline → "Software Engineer · Distributed Systems | Python · Go · AWS · Elasticsearch"', badge:'now' },
  { text:'About section — lead with 3 yrs prod experience, key results, open to work', badge:'now' },
  { text:'Enable Open to Work (recruiters only)', badge:'now' },
  { text:'Add Patent #202341004169 as a Publication entry', badge:'now' },
  { text:'Reorder skills: Python, Distributed Systems, AWS, Elasticsearch, Kubernetes first', badge:'now' },
  { text:'Archive/delete the 6 LinkedIn Learning certificate posts from 2022', badge:'now' },
  { text:'Pin the MTU hackathon post to top of activity', badge:'now' },
  { text:'Featured section: add 2 GitHub projects with screenshot', badge:'week' },
  { text:'Get 3-5 recommendations from Clarivate manager and Kookur co-founders', badge:'month' },
  { text:'Post 1 native LinkedIn video showing a project working', badge:'week' },
];

const JOB_TARGETS = [
  { tier:'Apply Now — CV ready today', jobs:[
    { company:'Qumulo', location:'Cork', role:'Software Engineer', salary:'€75-90k' },
    { company:'Fenergo', location:'Dublin', role:'Backend Engineer', salary:'€75-90k' },
    { company:'Trend Micro', location:'Cork', role:'Platform Engineer', salary:'€70-85k' },
  ]},
  { tier:'Month 2–3 — after first project done', jobs:[
    { company:'HubSpot', location:'Dublin', role:'Backend / Platform Engineer', salary:'€80-110k' },
    { company:'Workday', location:'Dublin', role:'Software Engineer', salary:'€80-105k' },
    { company:'Salesforce', location:'Dublin', role:'Software Engineer', salary:'€80-110k' },
  ]},
  { tier:'Month 4–5 — after MSc + 2 projects', jobs:[
    { company:'Apple', location:'Cork', role:'Software Engineer', salary:'€90-120k' },
    { company:'Stripe', location:'Dublin', role:'Backend Engineer', salary:'€100-140k' },
    { company:'Cloudflare', location:'Remote/Dublin', role:'Platform Engineer', salary:'€95-130k' },
  ]}
];

const CONTENT_IDEAS = [
  { title:'"I learned that SQL window functions work like this — real example from code I wrote today"', desc:'Month 1–2 format. Short, specific, genuine. 3 bullet points + 1 code snippet. Most shareable format.', tags:['SQL','#backend','#learning'] },
  { title:'"I built a fraud detection API in a weekend — here\'s the full architecture"', desc:'Screen recording of the API working + Postman demo. Explain one design decision. End with GitHub link. Native video = 4x reach.', tags:['Python','FastAPI','ML','#buildinpublic'] },
  { title:'"Here\'s what broke first when I built a rate limiter — and what I learned"', desc:'Failure post. These do incredibly well. Authentic, relatable, shows real thinking. Before → what broke → fix → lesson.', tags:['#systemdesign','Python','Redis'] },
  { title:'"I used Elasticsearch at production scale for 3 years — here\'s how it actually works internally"', desc:'Your strongest unique angle. You have lived experience. Explain inverted index, BM25, shard routing in plain terms.', tags:['Elasticsearch','#backend','#systemdesign'] },
  { title:'"I finished my MSc in Data Science. Here\'s what I built, what I learned, and what I\'m looking for next"', desc:'Post this in September when you finish. High-engagement milestone post. Will outperform everything else you\'ve posted.', tags:['#career','#opentowork','#datascience'] },
  { title:'"Before vs after: how I cut query execution time by 40% at Clarivate"', desc:'Real numbers from your resume. Specific SQL change. Every engineer has had this problem — endless reshares.', tags:['SQL','#performance','#engineering'] },
];

/* ── LOCK ────────────────────────────────────── */
const lockScreen = document.getElementById('lockScreen');
const dashboard  = document.getElementById('dashboard');
const inputEl    = document.getElementById('passcodeInput');
const errEl      = document.getElementById('lockError');

const shakeStyle = document.createElement('style');
shakeStyle.textContent='.shake{animation:shake .4s linear}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
document.head.appendChild(shakeStyle);

function tryUnlock(code){
  if(code===PASSCODE){
    lockScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    sessionStorage.setItem('jm_unlocked','1');
    initDashboard();
  } else {
    errEl.textContent='access denied.';
    inputEl.value='';
    inputEl.classList.add('shake');
    setTimeout(()=>{ inputEl.classList.remove('shake'); errEl.textContent=''; },1500);
  }
}
document.getElementById('unlockBtn').addEventListener('click',()=>tryUnlock(inputEl.value.trim()));
inputEl.addEventListener('keydown',e=>{ if(e.key==='Enter') tryUnlock(inputEl.value.trim()); });
document.getElementById('logoutBtn').addEventListener('click',()=>{ sessionStorage.removeItem('jm_unlocked'); location.reload(); });
if(sessionStorage.getItem('jm_unlocked')==='1'){ lockScreen.classList.add('hidden'); dashboard.classList.remove('hidden'); initDashboard(); }

/* ── SIDEBAR NAV ─────────────────────────────── */
function initNav(){
  document.querySelectorAll('.sb-btn[data-panel]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.sb-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-'+btn.dataset.panel).classList.add('active');
    });
  });
}

/* ── INIT ────────────────────────────────────── */
function initDashboard(){
  initNav();
  document.getElementById('todayDate').textContent=new Date().toLocaleDateString('en-IE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  renderStats();
  renderTimeline();
  renderQuickWins();
  renderWeekly();
  renderSkillSprint();
  renderProjectBoard();
  renderLinkedinChecklist();
  renderJobBoard();
  renderContentPlan();
  renderReality();
  renderPhases();
  renderLearn();
  renderBuildProjs();
  renderNetwork();
  renderPosting();
  document.getElementById('resetWeekBtn').addEventListener('click',()=>{ if(confirm('Reset all weekly tasks?')){ LSset('weekdone',{}); renderWeekly(); renderStats(); } });
}

/* ── STATS ───────────────────────────────────── */
function renderStats(){
  const liDone=getChecks('linkedin').filter(c=>c.done).length;
  const qwDone=getChecks('quickwins').filter(c=>c.done).length;
  const total=LINKEDIN_CHECKS.length+QUICK_WINS.length;
  const weekTotal=Object.values(WEEKLY_PLAN).reduce((a,d)=>a+d.length,0);
  const weekDone=Object.values(LSget('weekdone')||{}).filter(Boolean).length;
  const pct=Math.round(((liDone+qwDone)/Math.max(total,1))*100);
  const months=Math.max(0,Math.round((new Date('2026-09-01')-new Date())/(1000*60*60*24*30)));
  sc('statDone',liDone+qwDone+'/'+total,'tasks done');
  sc('statWeek',weekDone+'/'+weekTotal,'week tasks','var(--accent-2)');
  sc('statGoal','€80k+','target salary','var(--accent)');
  sc('statDays',months+' mo','to MSc finish','var(--amber)');
  const fill=document.getElementById('overallFill');
  const meta=document.getElementById('overallMeta');
  setTimeout(()=>{ if(fill) fill.style.width=pct+'%'; },300);
  if(meta) meta.textContent=pct+'% of setup tasks complete';
}
function sc(id,num,label,color){ const el=document.getElementById(id); if(!el)return; el.innerHTML=`<div class="stat-num" style="color:${color||'var(--text)'}">${num}</div><div class="stat-label">${label}</div>`; }

/* ── CHECKS ──────────────────────────────────── */
function getChecks(key){ const data=LSget(key+'_checks')||{}; const src=key==='quickwins'?QUICK_WINS:LINKEDIN_CHECKS; return src.map((item,i)=>({...item,id:i,done:!!data[i]})); }
function saveChecks(key,checks){ const m={}; checks.forEach(c=>{m[c.id]=c.done;}); LSset(key+'_checks',m); }
function toggleCheck(key,id){ const checks=getChecks(key); const c=checks.find(x=>x.id===id); if(c)c.done=!c.done; saveChecks(key,checks); if(key==='quickwins') renderQuickWins(); if(key==='linkedin') renderLinkedinChecklist(); renderStats(); }
function chkItem(text,done,badge,fn){ return `<div class="check-item ${done?'done':''}" onclick="${fn}"><div class="check-box"></div><span class="check-text">${escHtml(text)}</span>${badge?`<span class="check-badge badge-${badge}">${badge}</span>`:''}</div>`; }

function renderQuickWins(){ const el=document.getElementById('quickWins'); if(!el)return; el.innerHTML=getChecks('quickwins').map(c=>chkItem(c.text,c.done,c.badge,`toggleCheck('quickwins',${c.id})`)).join(''); }
function renderLinkedinChecklist(){ const el=document.getElementById('linkedinChecklist'); if(!el)return; el.innerHTML=getChecks('linkedin').map(c=>chkItem(c.text,c.done,c.badge,`toggleCheck('linkedin',${c.id})`)).join(''); }

/* ── TIMELINE ────────────────────────────────── */
function renderTimeline(){
  const el=document.getElementById('timeline'); if(!el)return;
  el.innerHTML=TIMELINE_PHASES.map(p=>`<div class="tl-item ${p.state==='active'?'is-active':''}"><div class="tl-dot ${p.state}"></div><div class="tl-when mono">${p.when}</div><div class="tl-what"><strong>${p.title}:</strong> ${p.what}</div></div>`).join('');
}

/* ── WEEKLY ──────────────────────────────────── */
function renderWeekly(){
  const el=document.getElementById('weeklyBoard'); if(!el)return;
  const saved=LSget('weekdone')||{};
  el.innerHTML=Object.keys(WEEKLY_PLAN).map(day=>`<div class="week-day"><div class="week-day-title">${day} <span>${WEEKLY_PLAN[day].length} tasks</span></div>${WEEKLY_PLAN[day].map((task,i)=>{ const k=day+'_'+i; const done=!!saved[k]; return `<div class="check-item ${done?'done':''}" onclick="toggleWeek('${k}')"><div class="check-box"></div><span class="check-text">${task}</span></div>`; }).join('')}</div>`).join('');
}
function toggleWeek(key){ const s=LSget('weekdone')||{}; s[key]=!s[key]; LSset('weekdone',s); renderWeekly(); renderStats(); }

/* ── SKILL SPRINT ────────────────────────────── */
function renderSkillSprint(){ renderSkillList('skillList1',SKILLS_P1); renderSkillList('skillList2',SKILLS_P2); renderDSATracker(); }
function renderSkillList(id,skills){
  const el=document.getElementById(id); if(!el)return;
  const saved=LSget(id+'_pct')||{};
  el.innerHTML=skills.map((s,i)=>{ const pct=saved[i]!==undefined?saved[i]:s.pct; return `<div class="skill-row"><div class="skill-head"><span class="skill-name">${s.name}</span><span class="skill-pct" id="${id}_p${i}">${pct}%</span></div><div class="skill-track"><div class="skill-fill" id="${id}_f${i}" style="width:${pct}%"></div></div><div class="skill-note">${s.note}</div><input type="range" min="0" max="100" value="${pct}" step="5" style="width:100%;margin-top:6px;accent-color:var(--accent)" oninput="updateSkillPct(this,'${id}',${i})"/></div>`; }).join('');
}
function updateSkillPct(input,listId,idx){ const pct=+input.value; document.getElementById(listId+'_p'+idx).textContent=pct+'%'; document.getElementById(listId+'_f'+idx).style.width=pct+'%'; const s=LSget(listId+'_pct')||{}; s[idx]=pct; LSset(listId+'_pct',s); }
function renderDSATracker(){
  const el=document.getElementById('dsaTracker'); if(!el)return;
  const done=LSget('dsa_done')||{};
  const count=Object.values(done).filter(Boolean).length;
  el.innerHTML=`<div class="dsa-grid">${Array.from({length:150},(_,i)=>`<div class="dsa-day ${done[i]?'done':''}" onclick="toggleDSA(${i})" title="Problem ${i+1}"></div>`).join('')}</div><div class="dsa-label">${count} / 150 problems completed · click to mark done</div>`;
}
function toggleDSA(i){ const s=LSget('dsa_done')||{}; s[i]=!s[i]; LSset('dsa_done',s); renderDSATracker(); }

/* ── PROJECTS BOARD ──────────────────────────── */
function renderProjectBoard(){
  const el=document.getElementById('projectBoard'); if(!el)return;
  const projects=getProjects();
  el.innerHTML=`<button class="add-proj-btn mono" onclick="openAddForm()">+ add project</button>
  <div id="projForm" class="proj-form hidden">
    <div class="proj-form-title mono" id="formTitle">new project</div>
    <div class="form-row"><label class="form-label mono">title</label><input id="fTitle" class="form-input" placeholder="Project name"/></div>
    <div class="form-row"><label class="form-label mono">description</label><textarea id="fDesc" class="form-input form-textarea" placeholder="What did you build?"></textarea></div>
    <div class="form-row"><label class="form-label mono">highlight <span style="color:var(--text-3)">(key metric)</span></label><input id="fHighlight" class="form-input" placeholder="50% faster · 5k users"/></div>
    <div class="form-row"><label class="form-label mono">tags <span style="color:var(--text-3)">(comma-separated)</span></label><input id="fTags" class="form-input" placeholder="Go, Redis, Docker"/></div>
    <div class="form-row"><label class="form-label mono">image URL <span style="color:var(--text-3)">(optional)</span></label><input id="fImage" class="form-input" placeholder="https://..."/></div>
    <div class="form-row"><label class="form-label mono">project link <span style="color:var(--text-3)">(GitHub / live)</span></label><input id="fLink" class="form-input" placeholder="https://github.com/..."/></div>
    <div class="form-row-split">
      <div><label class="form-label mono">status</label><select id="fStatus" class="form-input form-select"><option value="completed">completed</option><option value="progress">in progress</option><option value="idea">idea / planned</option></select></div>
      <div><label class="form-label mono">visibility</label><select id="fPublic" class="form-input form-select"><option value="true">public (show on portfolio)</option><option value="false">private (hidden)</option></select></div>
    </div>
    <div class="form-actions"><button class="btn-save mono" onclick="saveProject()">save project</button><button class="btn-cancel mono" onclick="closeForm()">cancel</button></div>
    <div id="formMsg" class="form-msg mono"></div>
  </div>
  <div id="projList">${projects.map(p=>projRowHTML(p)).join('')}</div>`;
}
function projRowHTML(p){
  const sc=p.status==='completed'?'pill-done':p.status==='progress'?'pill-prog':'pill-idea';
  const img=p.image?`<img src="${escHtml(p.image)}" style="width:100%;height:80px;object-fit:cover;border-radius:3px;margin-bottom:.75rem;display:block" onerror="this.style.display='none'"/>`:'';
  return `<div class="proj-row" id="prow_${p.id}">${img}<div class="proj-row-header"><span class="proj-row-title">${escHtml(p.title)}</span><span class="status-pill ${sc}">${p.status}</span><span class="status-pill ${p.public?'pill-done':'pill-idea'}">${p.public?'public':'private'}</span></div>${p.highlight?`<div style="font-family:'Space Mono',monospace;font-size:.62rem;color:var(--accent);margin-bottom:.5rem">${escHtml(p.highlight)}</div>`:''}<div class="proj-row-desc">${escHtml(p.desc)}</div><div style="display:flex;flex-wrap:wrap;gap:4px;margin:.5rem 0 .75rem">${p.tags.map(t=>`<span style="font-family:'Space Mono',monospace;font-size:.6rem;padding:2px 6px;border:1px solid var(--border);border-radius:2px;color:var(--text-3)">${escHtml(t)}</span>`).join('')}</div><div class="proj-row-actions"><button class="toggle-btn" onclick="editProject('${p.id}')">edit</button><button class="toggle-btn ${p.public?'active-btn':''}" onclick="togglePublic('${p.id}')">${p.public?'● public':'○ private'}</button><button class="toggle-btn" onclick="deleteProject('${p.id}')" style="color:var(--red);border-color:var(--red)">delete</button></div></div>`;
}
let _editingId=null;
function openAddForm(){ _editingId=null; clearForm(); document.getElementById('formTitle').textContent='new project'; document.getElementById('projForm').classList.remove('hidden'); document.getElementById('fTitle').focus(); }
function editProject(id){ const p=getProjects().find(x=>x.id===id); if(!p)return; _editingId=id; document.getElementById('fTitle').value=p.title; document.getElementById('fDesc').value=p.desc; document.getElementById('fHighlight').value=p.highlight||''; document.getElementById('fTags').value=p.tags.join(', '); document.getElementById('fImage').value=p.image||''; document.getElementById('fLink').value=p.link||''; document.getElementById('fStatus').value=p.status; document.getElementById('fPublic').value=String(p.public); document.getElementById('formTitle').textContent='edit project'; document.getElementById('projForm').classList.remove('hidden'); document.getElementById('projForm').scrollIntoView({behavior:'smooth',block:'nearest'}); }
function closeForm(){ document.getElementById('projForm').classList.add('hidden'); _editingId=null; clearForm(); }
function clearForm(){ ['fTitle','fDesc','fHighlight','fTags','fImage','fLink'].forEach(id=>{ document.getElementById(id).value=''; }); document.getElementById('fStatus').value='completed'; document.getElementById('fPublic').value='true'; document.getElementById('formMsg').textContent=''; }
function saveProject(){ const title=document.getElementById('fTitle').value.trim(); const desc=document.getElementById('fDesc').value.trim(); if(!title||!desc){ document.getElementById('formMsg').textContent='title and description required.'; return; } const tags=document.getElementById('fTags').value.split(',').map(t=>t.trim()).filter(Boolean); const project={ id:_editingId||uid(), title, desc, highlight:document.getElementById('fHighlight').value.trim(), tags, image:document.getElementById('fImage').value.trim(), link:document.getElementById('fLink').value.trim(), status:document.getElementById('fStatus').value, public:document.getElementById('fPublic').value==='true' }; const projects=getProjects(); if(_editingId){ const idx=projects.findIndex(p=>p.id===_editingId); if(idx>-1) projects[idx]=project; } else { projects.push(project); } saveProjects(projects); closeForm(); renderProjectBoard(); }
function togglePublic(id){ const projects=getProjects(); const p=projects.find(x=>x.id===id); if(p) p.public=!p.public; saveProjects(projects); renderProjectBoard(); }
function deleteProject(id){ if(!confirm('Delete this project?')) return; saveProjects(getProjects().filter(p=>p.id!==id)); renderProjectBoard(); }

/* ── JOB BOARD ───────────────────────────────── */
function renderJobBoard(){
  const el=document.getElementById('jobBoard'); if(!el)return;
  const saved=LSget('job_status')||{};
  el.innerHTML=JOB_TARGETS.map(tier=>`<div class="job-tier"><div class="tier-title">${tier.tier}</div>${tier.jobs.map((job,i)=>{ const key=tier.tier+'_'+i; const status=saved[key]||'not applied'; return `<div class="job-card"><div><div class="job-company">${job.company} <span style="color:var(--text-3);font-size:.75rem;font-weight:400">· ${job.location}</span></div><div class="job-role">${job.role}</div></div><div class="job-actions"><span class="job-salary">${job.salary}</span><select class="job-status-select" onchange="setJobStatus('${key}',this.value)">${['not applied','researching','applied','interview','offer','rejected'].map(s=>`<option value="${s}" ${status===s?'selected':''}>${s}</option>`).join('')}</select></div></div>`; }).join('')}</div>`).join('');
}
function setJobStatus(key,val){ const s=LSget('job_status')||{}; s[key]=val; LSset('job_status',s); }

/* ── CONTENT PLAN ────────────────────────────── */
function renderContentPlan(){
  const el=document.getElementById('contentPlan'); if(!el)return;
  el.innerHTML=CONTENT_IDEAS.map(item=>`<div class="content-item"><div class="ci-title">${escHtml(item.title)}</div><div class="ci-desc">${escHtml(item.desc)}</div><div class="ci-tags">${item.tags.map(t=>`<span class="ci-tag">${escHtml(t)}</span>`).join('')}</div></div>`).join('');
}

/* ════════════════════════════════════════════════
   NEW ROADMAP PANELS
════════════════════════════════════════════════ */

/* Helper renderers */
function infoBox(text,type='info'){ return `<div class="rbox rbox-${type}"><div class="rbox-text">${text}</div></div>`; }
function card2(title,body){ return `<div class="r-card"><div class="r-card-title">${title}</div><div class="r-card-body">${body}</div></div>`; }
function secLabel(text){ return `<div class="r-sec">${text}</div>`; }
function grid2(...cards){ return `<div class="r-grid2">${cards.join('')}</div>`; }
function grid3(...cards){ return `<div class="r-grid3">${cards.join('')}</div>`; }

/* ── REALITY CHECK ───────────────────────────── */
function renderReality(){
  const el=document.getElementById('realityContent'); if(!el)return;
  el.innerHTML=`
    ${infoBox('<strong style="color:#F7C1C1">The honest truth:</strong> You built real production systems using Copilot as a crutch — that\'s more common than you think. But if you walked into a Google or Stripe interview today, you\'d fail the coding round. You can\'t write algorithms from scratch. That\'s the gap. The good news: it\'s fixable in 3–6 months, not a permanent one.','warn')}
    ${infoBox('<strong style="color:#C0DD97">What you actually have that\'s real:</strong> You shipped code 5,000 people used. You built AWS infrastructure solo. You hold a patent. You debugged production Elasticsearch issues. You understand how systems connect at a high level. Companies like Qumulo, Fenergo, and Trend Micro care about this more than your ability to reverse a linked list.','ok')}
    ${secLabel('The two tracks — choose based on where you apply')}
    ${grid2(
      card2('Track A — product / startup eng (your realistic first target)',
        'Qumulo, Fenergo, Trend Micro, HubSpot. They care more about: can you ship? Do you understand distributed systems? Have you built real things? Less focus on whiteboard DSA. You can get hired here in 3–4 months with focused prep.'),
      card2('Track B — big tech FAANG (9–12 months away)',
        'Apple, Stripe, Google, Meta. Require strong DSA — you WILL be asked to write algorithms from scratch. Don\'t aim here first. Aim here after landing Track A and building 6+ months of strong-company experience.')
    )}
    ${secLabel('What interviewers will actually ask at Track A')}
    ${card2('The real interview format',
      '(1) Technical chat about your past projects — what you built, how it worked, what broke. (2) Take-home or pairing session building something real — a small API, SQL query, script. (3) System design discussion. You can ace all three with 3–4 months of prep because you have real war stories from Clarivate and Kookur.')}
    ${secLabel('The Copilot rule — critical for the next 6 weeks')}
    ${infoBox('Write everything yourself first. Spend 20–30 minutes genuinely stuck before using any AI. This is how you build real understanding. After month 2 you can use Copilot for boilerplate again — but you\'ll now know what it\'s generating and be able to catch its mistakes. That\'s the difference between a user and an engineer.','warn')}
  `;
}

/* ── PHASES ──────────────────────────────────── */
function renderPhases(){
  const el=document.getElementById('phasesContent'); if(!el)return;
  const phases=[
    { when:'Month 1 — May 2026', title:'Foundation: learn to code deliberately', active:true,
      body:'<strong>Week 1–2:</strong> Python fundamentals properly — functions, loops, classes, files, exceptions. Write everything by hand first, no AI.<br><br><strong>Week 3–4:</strong> SQL properly — joins, aggregations, window functions, indexes, explain plans. Use SQLZoo + Mode Analytics free exercises.<br><br><strong>OOP:</strong> learn the 4 pillars in Python. Build a small bank account system — classes, inheritance, encapsulation. Covers 90% of OOP interview questions.<br><br><strong>Goal:</strong> able to write a 20-line Python program from scratch without any AI help.' },
    { when:'Month 2 — June 2026', title:'Systems thinking: understand what you already built',
      body:'CS50\'s free course weeks 1–5 — covers how computers work, memory, data structures. Fast to watch, directly fills your gaps.<br><br>Data structures: arrays, linked lists, hash maps, trees, stacks, queues — understand conceptually, draw on paper.<br><br>System design: read DDIA ch1–4. Watch ByteByteGo YouTube — 15-min videos, very visual. You\'ll recognise everything from Clarivate.<br><br>NeetCode Easy — 1/day. Arrays and strings only. Time yourself.' },
    { when:'Month 3 — July 2026', title:'Build & apply: first real project + start applying',
      body:'Build the FastAPI fraud detection API (see Projects to Build). Deploy it. Write a LinkedIn post about it.<br><br>Apply to Qumulo, Fenergo, Trend Micro. Your existing CV + project is enough. The interviews will teach you exactly what gaps remain.<br><br>NeetCode Medium — 1/day. Arrays, two pointers, sliding window.<br><br>Mock interviews: 2 on Pramp (free). Real interviews feel different from practice — you need reps.' },
    { when:'Month 4–5 — Aug/Sept 2026', title:'MSc finish + scale up',
      body:'Build the log anomaly detector project using Elasticsearch (your superpower). Deploy + LinkedIn post.<br><br>MSc finishes September — post a milestone career update. It will outperform every post you\'ve done before.<br><br>Apply broadly: Apple Cork, HubSpot, Workday, Salesforce Dublin.<br><br>Practice explaining Clarivate architecture out loud — record yourself for 10 minutes. Uncomfortable but essential.' },
    { when:'Month 6–9 — Oct 2026+', title:'Offer sprint',
      body:'15–20 active applications simultaneously. Track every one in the Jobs panel.<br><br>3 STAR stories from Clarivate rehearsed cold: (1) the DB migration, (2) the Elasticsearch optimisation, (3) the Kookur solo build. These answer almost every behavioural question.<br><br>First offer is almost never the best — counter with market data from Glassdoor / LinkedIn Salary.<br><br>Email every rejection asking for feedback. 1 in 5 will respond and it\'s gold.' }
  ];
  el.innerHTML=phases.map(p=>`<div class="ph-block ${p.active?'ph-active':''}"><div class="ph-dot-wrap"><div class="ph-dot2 ${p.active?'active':''}"></div></div><div class="ph-right"><div class="ph-when mono">${p.when}</div><div class="ph-title2">${p.title}</div><div class="ph-body2">${p.body}</div></div></div>`).join('');
}

/* ── WHAT TO LEARN ───────────────────────────── */
function renderLearn(){
  const el=document.getElementById('learnContent'); if(!el)return;
  el.innerHTML=`
    ${infoBox('You do NOT need to learn everything. You need to learn what interviewers at Track A companies actually test. Here\'s the exact list — nothing more, nothing less.','ok')}
    ${secLabel('Must learn — in this order')}
    ${grid2(
      card2('1. Python properly (2 weeks)','Lists, dicts, sets, tuples and when to use each. List/dict comprehensions. Classes and inheritance. Error handling. File I/O. async/await basics.<br><br><strong>Resource:</strong> "Python Crash Course" ch1–10 (free online). Write every exercise by hand.'),
      card2('2. SQL properly (1.5 weeks)','SELECT, WHERE, GROUP BY, HAVING. All JOIN types. Subqueries. Window functions (ROW_NUMBER, RANK, LAG). Indexes — what they are and when to add one. EXPLAIN ANALYZE on a slow query.<br><br><strong>Resource:</strong> Mode Analytics SQL Tutorial (free).'),
      card2('3. OOP — 4 pillars (1 week)','Encapsulation, Inheritance, Polymorphism, Abstraction. Learn in Python. Build 1 system (bank account, library, e-commerce cart) using all four. Covers 90% of OOP interview questions.<br><br><strong>Resource:</strong> Corey Schafer OOP YouTube series.'),
      card2('4. Data structures conceptual (2 weeks)','Arrays/lists, hash maps, stacks, queues, trees (binary search tree), graphs. For each: what it\'s used for, how to add/remove/search, time complexity. Draw them on paper.<br><br><strong>Resource:</strong> CS50 weeks 3–5 (free).'),
      card2('5. System design basics (3 weeks)','Load balancing, caching (Redis, CDN), message queues (Kafka), DB replication and sharding, CAP theorem intuition, REST vs gRPC.<br><br>You know half of this from Clarivate — you just don\'t have the vocabulary yet.<br><br><strong>Resource:</strong> ByteByteGo YouTube + DDIA ch1–4.'),
      card2('6. Networks minimum (1 week)','HTTP/HTTPS request lifecycle. DNS lookup. TCP vs UDP — why it matters. What a REST API is at the network level. SSL/TLS handshake (1-paragraph understanding).<br><br><strong>Resource:</strong> Julia Evans\' free networking zines (wizardzines.com).')
    )}
    ${secLabel('Skip for now (seriously)')}
    ${card2('Things to ignore until you have a job offer',
      'Computer architecture (COA) — only needed for embedded/hardware roles. Formal DBMS theory (normalisation, relational algebra) — know practical SQL, skip the theory. Advanced graph algorithms (Dijkstra, Bellman-Ford) — FAANG only. Advanced dynamic programming — same. Compiler theory — never.')}
  `;
}

/* ── PROJECTS TO BUILD ───────────────────────── */
function renderBuildProjs(){
  const el=document.getElementById('buildProjsContent'); if(!el)return;
  el.innerHTML=`
    ${infoBox('Build one project at a time, finish it properly, deploy it, document it. A half-built project on GitHub is worse than nothing. 3 strong finished projects beats 8 half-done ones.','ok')}

    ${secLabel('Project 1 — Month 3 (build after Python basics done)')}
    <div class="build-proj">
      <div class="bp-num">01</div>
      <div class="bp-body">
        <div class="bp-title">ML fraud detection API — end-to-end</div>
        <div class="bp-why">Combines your MSc ML knowledge with backend engineering. Completely deployable. Visually impressive to demo. Uses a real public dataset (Kaggle credit card fraud).</div>
        <div class="bp-what"><strong>What to build:</strong> Train a fraud detection model (logistic regression or random forest). Wrap it in a FastAPI endpoint. PostgreSQL table logging every prediction with timestamp + input features. Deploy on Railway or Render (free tier). Add a simple HTML page showing recent predictions.<br><br><strong>Why it grabs attention:</strong> It's end-to-end. Model → API → DB → UI. Most "ML projects" stop at the Jupyter notebook. This one doesn't.</div>
        <div class="bp-tags"><span class="bp-tag">Python</span><span class="bp-tag">FastAPI</span><span class="bp-tag">scikit-learn</span><span class="bp-tag">PostgreSQL</span><span class="bp-tag">Docker</span></div>
      </div>
    </div>

    ${secLabel('Project 2 — Month 4–5 (your Elasticsearch superpower)')}
    <div class="build-proj">
      <div class="bp-num">02</div>
      <div class="bp-body">
        <div class="bp-title">Real-time log anomaly detector</div>
        <div class="bp-why">Combines your 3 years of Elasticsearch expertise with observability tooling every platform/SRE team uses. Nobody else applying to Qumulo has this exact combo.</div>
        <div class="bp-what"><strong>What to build:</strong> Python script generates synthetic server logs. Parse and index them into Elasticsearch. Write anomaly detection (error rate spike > threshold). Fire a webhook alert when triggered. Show a Grafana dashboard of log volume + error rate over time.<br><br><strong>Why it grabs attention:</strong> This is what Datadog does. You can say "I built a mini-Datadog using Elasticsearch — which I ran at production scale at Clarivate." That sentence gets interviews.</div>
        <div class="bp-tags"><span class="bp-tag">Python</span><span class="bp-tag">Elasticsearch</span><span class="bp-tag">Grafana</span><span class="bp-tag">Docker</span><span class="bp-tag">Webhooks</span></div>
      </div>
    </div>

    ${secLabel('Project 3 — Month 5–6 (the wow project)')}
    <div class="build-proj">
      <div class="bp-num">03</div>
      <div class="bp-body">
        <div class="bp-title">Distributed rate limiter with real benchmarks</div>
        <div class="bp-why">Pure backend / platform engineering signal. Senior engineers immediately respect this. The benchmark results are the showpiece — a graph showing 50k req/sec is worth more than a paragraph of description.</div>
        <div class="bp-what"><strong>What to build:</strong> Rate limiting service in Python (sliding window algorithm). Backed by Redis. Run locust (Python load testing tool) against it. Screenshot the req/sec graph for your LinkedIn post. Write a README explaining: the algorithm choice, why Redis, what happens when Redis goes down.<br><br><strong>Why it grabs attention:</strong> The README explanation shows you understand tradeoffs. That separates someone who followed a tutorial from someone who actually thinks about systems.</div>
        <div class="bp-tags"><span class="bp-tag">Python</span><span class="bp-tag">Redis</span><span class="bp-tag">Docker</span><span class="bp-tag">Locust</span></div>
      </div>
    </div>

    ${secLabel('What "done" means for each project')}
    ${grid2(
      card2('Deployed and accessible','Not just on localhost. Use Railway, Render, or Fly.io — all free tier. The project must have a live URL you can share.'),
      card2('README that shows you think','Architecture diagram (draw.io or Excalidraw). Setup in one command. Your design decisions and why. What you\'d do differently at 10x scale.'),
      card2('Posted on LinkedIn','A native video or screenshot post. This is not optional — the post is half the value of the project. No post = the project doesn\'t exist to recruiters.'),
      card2('GitHub commits tell a story','Don\'t push everything at the end. Commit daily — the contribution graph should show a real build process, not one giant dump.')
    )}
  `;
}

/* ── NETWORK ─────────────────────────────────── */
function renderNetwork(){
  const el=document.getElementById('networkContent'); if(!el)return;
  el.innerHTML=`
    ${secLabel('The cold outreach message — exact script')}
    <div class="r-card" style="margin-bottom:1rem">
      <div class="r-card-title">LinkedIn connection request note (300 char limit)</div>
      <div class="r-card-body" style="background:var(--surface-2);padding:10px;border-radius:4px;margin-top:8px;font-style:italic;line-height:1.7">"Hi [Name] — I noticed you're a [role] at [company]. I'm a software engineer in Cork with 3 years backend experience, currently building ML systems and exploring roles in [their space]. Would love to connect and learn from your experience."</div>
      <div class="r-card-body" style="margin-top:8px">Keep it about them, not about you wanting a job. Never ask for a job in the first message. Goal is just the connection.</div>
    </div>

    ${secLabel('Who to target — in priority order')}
    <div class="net-items" id="networkList"></div>

    ${secLabel('The referral strategy')}
    ${card2('How to get referred (worth 10x a cold application)',
      'Most big tech companies have an employee referral bonus of €2,000–€5,000. Employees are financially incentivised to refer you if they think you\'re good. When you talk to engineers at target companies, explicitly ask: "If I apply, would you be comfortable referring me?" Most will say yes if you\'ve built any rapport. A referred application gets reviewed by a human — a cold one often doesn\'t.')}

    ${secLabel('Professor outreach — underused and very effective')}
    <div class="r-card">
      <div class="r-card-title">Email template for your MSc supervisor</div>
      <div class="r-card-body" style="background:var(--surface-2);padding:10px;border-radius:4px;margin-top:8px;font-style:italic;line-height:1.7">"Hi [Prof name],<br><br>I'm finishing my MSc dissertation and beginning to look for software engineering roles — specifically backend and ML engineering positions. I wanted to ask if you know anyone in industry it might be worth me speaking to?<br><br>My background is 3+ years backend engineering at Clarivate, and I've built a few ML projects as part of my MSc.<br><br>Even a single introduction would be incredibly helpful. Thank you for everything this year.<br><br>Justin"</div>
      <div class="r-card-body" style="margin-top:8px">Send this this week. One warm intro from a professor is worth 50 cold applications.</div>
    </div>
  `;

  const targets=[
    { n:'Engineers at target companies', body:'Search "Software Engineer Qumulo Cork" or "Backend Engineer HubSpot Dublin". Connect with 3–5 per company. After they accept: "Would you be open to a 15-min chat about what engineering culture is like there?" 1 in 5 says yes. That conversation is worth more than 10 applications.' },
    { n:'MTU professors and their contacts', body:'Email your MSc supervisor directly. Ask if they know anyone in industry. Professors have networks they never volunteer unless asked.' },
    { n:'Cork tech community in person', body:'Attend Cork Python Meetup and Cork Tech Meetup (both free, monthly). 30-second pitch: "I\'m Justin, software engineer, 3 years backend, Cork, looking for platform or ML engineering roles." In-person beats LinkedIn cold every time.' },
    { n:'Tech recruiters who specialise in your space', body:'Search LinkedIn for "tech recruiter Cork" or "software engineer recruiter Ireland". Connect with 5–10. Send: "I\'m a backend engineer in Cork, open to new roles. Happy to share my CV if you\'re placing people in this space."' },
    { n:'Ex-Clarivate colleagues', body:'Reconnect with anyone who has since moved to a company you want to work at. A "hey, I\'m looking — any openings where you are?" message to a former colleague has a 10x higher response rate than cold.' },
  ];
  const netEl=document.getElementById('networkList');
  if(netEl) netEl.innerHTML=targets.map((t,i)=>`<div class="net-row2"><div class="net-num">${i+1}</div><div><div class="net-title2">${t.n}</div><div class="net-sub2">${t.body}</div></div></div>`).join('');
}

/* ── POSTING PLAN ────────────────────────────── */
function renderPosting(){
  const el=document.getElementById('postingContent'); if(!el)return;
  el.innerHTML=`
    ${infoBox('Post consistently, not frantically. One post per week showing real work beats five posts of career advice. Quality + regularity builds trust faster than volume.','ok')}

    ${secLabel('Posting frequency by month')}
    ${grid3(
      card2('Month 1–2','1 post/week. Text only. Share one thing you learned: "I learned that SQL window functions work like this — here\'s a real example." Short, specific, genuine.'),
      card2('Month 3–5','1 post/week. Mix: 2 text posts + 1 video per month. The video is a 30–60s screen recording of your project working. Engagement starts building here.'),
      card2('Month 6+','2 posts/week. One technical, one personal/career. By now you have 3 projects, interview experience, and real things to say. Inbound starts.')
    )}

    ${secLabel('The 5 formats that actually work')}
    <div class="format-list">
      <div class="fmt-item"><div class="fmt-num">01</div><div><div class="fmt-title">"I learned X — here's what it actually means"</div><div class="fmt-body">Best for month 1–2. Open with: "Nobody explained [concept] clearly to me, so here's how I actually understand it now." 3 bullet points + 1 concrete example from your project. Most shareable format.</div></div></div>
      <div class="fmt-item"><div class="fmt-num">02</div><div><div class="fmt-title">"I built X in a weekend — here's how"</div><div class="fmt-body">Best for months 3+. Opens with a surprising number. Shows project working. Explains one interesting decision. GitHub link. Native video gets 4x the reach of a text post.</div></div></div>
      <div class="fmt-item"><div class="fmt-num">03</div><div><div class="fmt-title">"Here's what broke first when I tried X"</div><div class="fmt-body">Failure posts do incredibly well. Authentic, relatable, shows real thinking. Before → what broke → fix → lesson. People trust engineers who admit what went wrong.</div></div></div>
      <div class="fmt-item"><div class="fmt-num">04</div><div><div class="fmt-title">"Before vs after" with real numbers</div><div class="fmt-body">Query took 4s, now 40ms. Here's exactly what changed. Must have real numbers — fake ones are obvious. Endlessly shareable because every engineer has had this problem.</div></div></div>
      <div class="fmt-item"><div class="fmt-num">05</div><div><div class="fmt-title">The milestone post (use 1–2 times per year)</div><div class="fmt-body">"I finished my MSc. Here's what I built, what I learned, and what I'm looking for next." Post this in September. It will outperform everything else you've ever posted.</div></div></div>
    </div>

    ${secLabel('What NOT to post')}
    ${infoBox('LinkedIn Learning certificates. Generic "excited to start my journey" posts. Career advice you haven\'t earned yet. Reposting motivational content. Anything that sounds like ChatGPT wrote it — readers can feel it instantly and it destroys credibility.','warn')}
  `;
}

/* ── EXPOSE GLOBALS ──────────────────────────── */
window.toggleCheck=toggleCheck; window.toggleWeek=toggleWeek; window.toggleDSA=toggleDSA;
window.updateSkillPct=updateSkillPct; window.openAddForm=openAddForm; window.editProject=editProject;
window.saveProject=saveProject; window.closeForm=closeForm; window.togglePublic=togglePublic;
window.deleteProject=deleteProject; window.setJobStatus=setJobStatus;
