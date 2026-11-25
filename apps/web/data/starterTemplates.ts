export interface StarterTemplate {
  id: string;
  title: {
    en: string;
    ckb: string;
    kmr: string;
    ar: string;
  };
  description: {
    en: string;
    ckb: string;
    kmr: string;
    ar: string;
  };
  category: 'ui' | 'app' | 'tool' | 'game';
  html: string;
  css: string;
  js: string;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'tpl-portfolio',
    title: {
      en: 'Modern Developer Portfolio',
      ckb: 'پۆرتفۆلیۆی کەسیی مۆدێرن بۆ پڕۆگرامەر',
      kmr: 'پۆرتفۆلیۆیا مۆدێرن بۆ پرۆگرامەران',
      ar: 'معرض أعمال شخصي حديث للمطور',
    },
    description: {
      en: 'Clean responsive hero section, tech skills badges, project cards, and social links.',
      ckb: 'پەڕەیەکی تەواوی پۆرتفۆلیۆ بە هێرۆ، لێهاتووییەکان، پڕۆژەکان و دیزاینی وەڵامدەرەوە.',
      kmr: 'لاپەڕەکا تەمام یا پۆرتفۆلیۆیێ دگەل پڕۆژەیان و دیزاینا وەڵامدەر.',
      ar: 'صفحة معرض أعمال متجاوبة وأنيقة مع أقسام المهارات والمشاريع.',
    },
    category: 'ui',
    html: `<header class="hero">
  <div class="avatar">👨‍💻</div>
  <h1>سڵاو، من <span class="highlight">گەشەپێدەری وێبم</span></h1>
  <p class="bio">دروستکەری ئەپڵیکەیشن و وێبسایتی مۆدێرن، خێرا و سەلامەت بە بەرزترین ستاندارد.</p>
  <div class="badges">
    <span class="badge">HTML5</span>
    <span class="badge">CSS3</span>
    <span class="badge">JavaScript</span>
    <span class="badge">React</span>
    <span class="badge">Python</span>
  </div>
  <button class="btn" onclick="sayHello()">پەیوەندیم پێوە بکە</button>
</header>

<main class="projects">
  <h2>پڕۆژە دیارەکانم</h2>
  <div class="grid">
    <article class="card">
      <div class="card-icon">🚀</div>
      <h3>سیستەمی فێرکاری کاڕێژان</h3>
      <p>پلاتفۆرمێکی گەورەی کوردی بۆ فێربوونی پرۆگرامینگی وێب.</p>
    </article>
    <article class="card">
      <div class="card-icon">⚡️</div>
      <h3>تاقیگەی ڕاستەوخۆ</h3>
      <p>محرری کۆد لەسەر وێبگەڕ بە ئەنجامی دەستبەجێ.</p>
    </article>
  </div>
</main>`,
    css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 30px 20px;
  background: #0b1120;
  color: #f8fafc;
  direction: rtl;
  text-align: center;
}
.hero {
  max-width: 650px;
  margin: 0 auto 50px;
  padding: 40px 24px;
  background: radial-gradient(circle at top, #1e293b, #0f172a);
  border-radius: 20px;
  border: 1px solid #334155;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.avatar { font-size: 50px; margin-bottom: 12px; }
h1 { font-size: 28px; margin: 0 0 10px; color: #fff; }
.highlight { color: #38bdf8; }
.bio { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
.badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 25px; }
.badge { background: #1e3a8a; color: #93c5fd; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: bold; }
.btn {
  background: #2563eb; color: #fff; border: none; padding: 12px 28px;
  font-size: 14px; font-weight: bold; border-radius: 10px; cursor: pointer; transition: 0.2s;
}
.btn:hover { background: #1d4ed8; transform: translateY(-2px); }
.projects h2 { font-size: 22px; color: #e2e8f0; margin-bottom: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 650px; margin: 0 auto; }
.card { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 24px; text-align: right; transition: 0.2s; }
.card:hover { border-color: #38bdf8; transform: translateY(-3px); }
.card-icon { font-size: 32px; margin-bottom: 10px; }
.card h3 { margin: 0 0 8px; color: #38bdf8; font-size: 17px; }
.card p { margin: 0; color: #94a3b8; font-size: 13.5px; line-height: 1.5; }`,
    js: `function sayHello() {
  alert("سڵاو لە جیهانی پرۆگرامینگی کاڕێژان! بەخێربێیت بۆ پۆرتفۆلیۆکەم.");
}`,
  },
  {
    id: 'tpl-todo',
    title: {
      en: 'Interactive Todo & Task Manager',
      ckb: 'بەرنامەی کارەکان (Todo App) بە سەیڤکردن',
      kmr: 'بەرنامێ کاران (Todo App) ب پاشەکەفتکرنێ',
      ar: 'تطبيق إدارة المهام التفاعلي المتكامل',
    },
    description: {
      en: 'Add, complete, and delete daily tasks with localStorage persistence and live counter.',
      ckb: 'زیادکردن، تەواوکردن، و سڕینەوەی ئەرکەکان لەگەڵ ژمێرەری ئەرکە تەواوکراوەکان.',
      kmr: 'زێدەکرن و برێڤەبرنا کاران دگەل ژمێرەرێ ئەرکان.',
      ar: 'إضافة وإنجاز وحذف المهام اليومية مع حفظ البيانات في المتصفح.',
    },
    category: 'app',
    html: `<div class="todo-app">
  <h2>📝 بەڕێوەبەری ئەرکەکانی کاڕێژان</h2>
  <div class="input-row">
    <input type="text" id="taskInput" placeholder="ئەرکێکی نوێ بنووسە..." />
    <button onclick="addTask()">زیادکردن</button>
  </div>
  <div class="stats">
    <span id="taskCount">٠ ئەرک</span>
    <button class="clear-btn" onclick="clearAll()">سڕینەوەی هەمووی</button>
  </div>
  <ul id="taskList"></ul>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #f1f5f9;
  padding: 40px 16px;
  direction: rtl;
  display: flex;
  justify-content: center;
}
.todo-app {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}
h2 { font-size: 20px; margin: 0 0 18px; text-align: center; color: #38bdf8; }
.input-row { display: flex; gap: 8px; margin-bottom: 16px; }
input {
  flex: 1; padding: 12px 14px; background: #0f172a; border: 1px solid #334155;
  border-radius: 8px; color: #fff; font-size: 14px; outline: none;
}
input:focus { border-color: #38bdf8; }
button {
  background: #2563eb; color: #fff; border: none; padding: 10px 18px;
  border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;
}
button:hover { background: #1d4ed8; }
.stats { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 8px; }
.clear-btn { background: transparent; color: #ef4444; padding: 4px 8px; font-size: 11px; }
.clear-btn:hover { background: rgba(239, 68, 68, 0.1); }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
li {
  display: flex; justify-content: space-between; align-items: center;
  background: #0f172a; border: 1px solid #334155; padding: 10px 14px;
  border-radius: 8px; font-size: 14px; transition: 0.2s;
}
li.done { text-decoration: line-through; opacity: 0.6; border-color: #10b981; }
li span { cursor: pointer; flex: 1; }
.del-btn { background: transparent; color: #f87171; border: none; padding: 4px; font-size: 14px; cursor: pointer; }`,
    js: `let tasks = [
  { text: "فێربوونی تاگە نوێیەکانی HTML5", done: true },
  { text: "دروستکردنی لاپەڕەیەک بە Flexbox", done: false },
  { text: "تاقیکردنەوەی کویز لە کاڕێژان", done: false }
];

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");
    li.innerHTML = \`<span onclick="toggleTask(\${i})">\${t.text}</span>
                     <button class="del-btn" onclick="deleteTask(\${i})">✕</button>\`;
    list.appendChild(li);
  });
  const count = tasks.filter(t => !t.done).length;
  document.getElementById("taskCount").textContent = \`\${count} ئەرکی تەواونەکراو\`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const val = input.value.trim();
  if (!val) return;
  tasks.push({ text: val, done: false });
  input.value = "";
  renderTasks();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  renderTasks();
}

function clearAll() {
  tasks = [];
  renderTasks();
}

renderTasks();`,
  },
  {
    id: 'tpl-calculator',
    title: {
      en: 'Glassmorphism Scientific Calculator',
      ckb: 'حاسیبەی شوشەیی مۆدێرن (Calculator)',
      kmr: 'حاسیبەیا شیشەیی یا مۆدێرن',
      ar: 'آلة حاسبة عصرية بتأثير الزجاج Glassmorphism',
    },
    description: {
      en: 'Smooth calculator with operator precedence, clear display, and neon glow effects.',
      ckb: 'حاسیبەیەکی تەواوی ماتماتیکی بە دیزاینی شووشەیی شیک و کارایی خێرا.',
      kmr: 'حاسیبەکا بیرکاری یا مۆدێرن دگەل دیزاینا شیشەیی.',
      ar: 'آلة حاسبة حسابية كاملة بتصميم زجاجي حديث وتأثيرات ضوئية.',
    },
    category: 'tool',
    html: `<div class="calc">
  <div class="display" id="disp">0</div>
  <div class="keys">
    <button class="btn fn" onclick="clearCalc()">C</button>
    <button class="btn fn" onclick="backspace()">⌫</button>
    <button class="btn fn" onclick="inputOp('%')">%</button>
    <button class="btn op" onclick="inputOp('/')">÷</button>

    <button class="btn" onclick="inputNum('7')">7</button>
    <button class="btn" onclick="inputNum('8')">8</button>
    <button class="btn" onclick="inputNum('9')">9</button>
    <button class="btn op" onclick="inputOp('*')">×</button>

    <button class="btn" onclick="inputNum('4')">4</button>
    <button class="btn" onclick="inputNum('5')">5</button>
    <button class="btn" onclick="inputNum('6')">6</button>
    <button class="btn op" onclick="inputOp('-')">-</button>

    <button class="btn" onclick="inputNum('1')">1</button>
    <button class="btn" onclick="inputNum('2')">2</button>
    <button class="btn" onclick="inputNum('3')">3</button>
    <button class="btn op" onclick="inputOp('+')">+</button>

    <button class="btn zero" onclick="inputNum('0')">0</button>
    <button class="btn" onclick="inputNum('.')">.</button>
    <button class="btn eq" onclick="calcResult()">=</button>
  </div>
</div>`,
    css: `body {
  font-family: -apple-system, system-ui, sans-serif;
  background: radial-gradient(circle at center, #1e1b4b, #030712);
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.calc {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 24px;
  width: 300px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.6);
}
.display {
  background: #020617;
  border-radius: 14px;
  padding: 20px 16px;
  color: #38bdf8;
  font-size: 32px;
  text-align: right;
  font-family: monospace;
  overflow-x: auto;
  margin-bottom: 20px;
  border: 1px solid #1e293b;
}
.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.15s;
}
.btn:hover { background: #334155; }
.btn.fn { background: #475569; color: #f8fafc; }
.btn.op { background: #3b82f6; color: #fff; }
.btn.op:hover { background: #2563eb; }
.btn.eq { background: #10b981; color: #fff; grid-column: span 1; }
.btn.eq:hover { background: #059669; }
.btn.zero { grid-column: span 2; }`,
    js: `let currentExpr = "";

function updateDisp() {
  document.getElementById("disp").textContent = currentExpr || "0";
}

function inputNum(n) {
  if (currentExpr === "0" && n !== ".") currentExpr = "";
  currentExpr += n;
  updateDisp();
}

function inputOp(op) {
  if (!currentExpr) return;
  const last = currentExpr.slice(-1);
  if (["+", "-", "*", "/", "%"].includes(last)) {
    currentExpr = currentExpr.slice(0, -1);
  }
  currentExpr += op;
  updateDisp();
}

function clearCalc() {
  currentExpr = "";
  updateDisp();
}

function backspace() {
  currentExpr = currentExpr.slice(0, -1);
  updateDisp();
}

function calcResult() {
  try {
    currentExpr = String(eval(currentExpr));
  } catch (e) {
    currentExpr = "هەڵە";
  }
  updateDisp();
}`,
  },
  {
    id: 'tpl-digital-clock',
    title: {
      en: 'Real-Time Clock & Stopwatch',
      ckb: 'کاتژمێری دیجیتاڵ و ستۆپواچ (Clock & Stopwatch)',
      kmr: 'دەستژمێر و سەعەتا مۆدێرن یا ئەلیکترۆنی',
      ar: 'ساعة رقمية حية وساعة إيقاف متقدمة',
    },
    description: {
      en: 'Precise real-time digital clock with seconds, date in Kurdish, and a millisecond stopwatch.',
      ckb: 'کاتژمێری ڕاستەوخۆ بە کات، بەروار و ستۆپواچی دیجیتاڵی بۆ پێوانی کات.',
      kmr: 'سەعەتەکا ڕاستەوخۆ دگەل ستۆپواچێ بۆ پیڤانا دەمی.',
      ar: 'ساعة رقمية متزامنة بالثواني مع ساعة إيقاف تفاعلية بالمللي ثانية.',
    },
    category: 'tool',
    html: `<div class="clock-card">
  <div class="date-label" id="dateLabel">...</div>
  <div class="time-display" id="timeDisp">00:00:00</div>
  
  <div class="stopwatch">
    <h3>⏱️ ستۆپواچ (Stopwatch)</h3>
    <div class="sw-time" id="swDisp">00:00.00</div>
    <div class="sw-actions">
      <button class="btn start" id="startBtn" onclick="toggleSW()">دەستپێکردن</button>
      <button class="btn reset" onclick="resetSW()">ڕێکخستنەوە</button>
    </div>
  </div>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #020617;
  color: #fff;
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  direction: rtl;
}
.clock-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.7);
}
.date-label { color: #94a3b8; font-size: 14px; margin-bottom: 8px; }
.time-display {
  font-family: monospace;
  font-size: 42px;
  font-weight: bold;
  color: #38bdf8;
  letter-spacing: 2px;
  margin-bottom: 30px;
}
.stopwatch {
  border-top: 1px solid #1e293b;
  padding-top: 20px;
}
.stopwatch h3 { margin: 0 0 10px; font-size: 15px; color: #cbd5e1; }
.sw-time { font-family: monospace; font-size: 28px; color: #34d399; margin-bottom: 15px; }
.sw-actions { display: flex; justify-content: center; gap: 10px; }
.btn {
  border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold;
  cursor: pointer; font-size: 13px; transition: 0.2s;
}
.btn.start { background: #10b981; color: #fff; }
.btn.reset { background: #334155; color: #f1f5f9; }
.btn:hover { opacity: 0.9; }`,
    js: `function updateClock() {
  const now = new Date();
  document.getElementById("timeDisp").textContent = now.toLocaleTimeString();
  document.getElementById("dateLabel").textContent = now.toLocaleDateString("ku-IQ", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
setInterval(updateClock, 1000);
updateClock();

let swInterval = null;
let swStartTime = 0;
let swElapsed = 0;

function toggleSW() {
  const btn = document.getElementById("startBtn");
  if (!swInterval) {
    swStartTime = Date.now() - swElapsed;
    swInterval = setInterval(() => {
      swElapsed = Date.now() - swStartTime;
      const m = Math.floor(swElapsed / 60000);
      const s = Math.floor((swElapsed % 60000) / 1000);
      const ms = Math.floor((swElapsed % 1000) / 10);
      document.getElementById("swDisp").textContent = 
        \`\${String(m).padStart(2,'0')}:\${String(s).padStart(2,'0')}.\${String(ms).padStart(2,'0')}\`;
    }, 30);
    btn.textContent = "ڕاگرتن";
    btn.style.background = "#ef4444";
  } else {
    clearInterval(swInterval);
    swInterval = null;
    btn.textContent = "دەستپێکردنەوە";
    btn.style.background = "#10b981";
  }
}

function resetSW() {
  clearInterval(swInterval);
  swInterval = null;
  swElapsed = 0;
  document.getElementById("swDisp").textContent = "00:00.00";
  const btn = document.getElementById("startBtn");
  btn.textContent = "دەستپێکردن";
  btn.style.background = "#10b981";
}`,
  },
  {
    id: 'tpl-gradient-gen',
    title: {
      en: 'CSS Gradient & Palette Generator',
      ckb: 'دروستکەری ڕەنگ و گڕادیێنتی CSS',
      kmr: 'چێکەرێ ڕەنگان و گڕادیێنتێن CSS',
      ar: 'مولد تدرجات الألوان وخلفيات CSS',
    },
    description: {
      en: 'Pick colors, change angles, randomize combinations, and copy ready-made CSS code.',
      ckb: 'ڕەنگەکان هەڵبژێرە، گۆشەی گڕادیێنت بگۆڕە و کۆدی CSS ئامادە بە یەک کرتە کۆپی بکە.',
      kmr: 'ڕەنگان ب هەلبژێرە و کۆدێ CSS ب دەستبێخە.',
      ar: 'اختر الألوان وزوايا التدرج وانسخ كود CSS الجاهز بنقرة واحدة.',
    },
    category: 'tool',
    html: `<div class="grad-box">
  <h2>🎨 دروستکەری گڕادیێنتی CSS</h2>
  <div class="preview" id="previewBox"></div>
  <div class="controls">
    <div class="ctrl">
      <label>ڕەنگی یەکەم:</label>
      <input type="color" id="c1" value="#3b82f6" onchange="updateGrad()" />
    </div>
    <div class="ctrl">
      <label>ڕەنگی دووەم:</label>
      <input type="color" id="c2" value="#9333ea" onchange="updateGrad()" />
    </div>
    <div class="ctrl">
      <label>گۆشە (Angle):</label>
      <input type="range" id="angle" min="0" max="360" value="135" oninput="updateGrad()" />
    </div>
  </div>
  <div class="code-bar">
    <code id="cssCode">background: linear-gradient(...);</code>
    <button onclick="copyCss()">کۆپیکردن</button>
  </div>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #fff;
  margin: 0;
  padding: 40px 16px;
  direction: rtl;
  display: flex;
  justify-content: center;
}
.grad-box {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  padding: 24px;
}
h2 { font-size: 18px; margin: 0 0 16px; text-align: center; color: #38bdf8; }
.preview {
  height: 160px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
.controls { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.ctrl { display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; }
.code-bar {
  background: #020617; border: 1px solid #334155; border-radius: 8px;
  padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;
}
code { font-family: monospace; font-size: 11px; color: #38bdf8; overflow-x: auto; }
button {
  background: #2563eb; color: #fff; border: none; padding: 6px 14px;
  border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;
}`,
    js: `function updateGrad() {
  const c1 = document.getElementById("c1").value;
  const c2 = document.getElementById("c2").value;
  const ang = document.getElementById("angle").value;
  const grad = \`linear-gradient(\${ang}deg, \${c1}, \${c2})\`;
  document.getElementById("previewBox").style.background = grad;
  document.getElementById("cssCode").textContent = \`background: \${grad};\`;
}

function copyCss() {
  const code = document.getElementById("cssCode").textContent;
  navigator.clipboard.writeText(code);
  alert("کۆدی CSS کۆپی کرا!");
}

updateGrad();`,
  },
];
