// ================================================
// js/games.js — Mini Games Module
// ================================================
// Two games, both rotate daily using a date seed.
// Same seed = same game for everyone on the team.
//
// Game 1: Pharma IQ Quiz  — 5 questions from a bank of 15
// Game 2: Word Hunt       — find pharma buzzwords in a grid
// ================================================

import { launchConfetti } from './confetti.js';

// ── Daily seed ────────────────────────────────
// Converts today's date into a stable number.
// Every team member gets the same seed → same game.
const TODAY_SEED = (() => {
  const d = new Date().toDateString();
  let h = 5381;
  for (const c of d) h = ((h << 5) + h) ^ c.charCodeAt(0);
  return Math.abs(h & 0x7fffffff);
})();

// Seeded shuffle — same input always produces same order
function seededShuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const x = Math.sin(TODAY_SEED + i * 9301) * 233280;
    const j = Math.floor((x - Math.floor(x)) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ════════════════════════════════════════════════
// QUIZ — Question Bank (15 questions, 5 picked daily)
// ════════════════════════════════════════════════
const QUIZ_BANK = [
  {
    q: "What does PBM stand for in the drug supply chain?",
    a: "Pharmacy Benefit Manager",
    opts: ["Pharmacy Benefit Manager", "Patient Billing Module", "Provider Benefits Market", "Pharma Budget Management"]
  },
  {
    q: "RWE in pharma stands for?",
    a: "Real World Evidence",
    opts: ["Real World Evidence", "Regulatory Workflow Engine", "Research Writing Engine", "Rapid Work Evaluation"]
  },
  {
    q: "HEOR is the study of?",
    a: "Health Economics & Outcomes Research",
    opts: ["Health Economics & Outcomes Research", "Hospital Efficiency Optimization Review", "Healthcare Enrollment Operations Report", "High-End Outcomes Registry"]
  },
  {
    q: "NDA in drug approval means?",
    a: "New Drug Application",
    opts: ["New Drug Application", "National Drug Authorization", "Network Data Architecture", "Neutral Drug Assessment"]
  },
  {
    q: "GLP-1 agonists are primarily indicated for?",
    a: "Type 2 diabetes & obesity",
    opts: ["Type 2 diabetes & obesity", "Hypertension management", "Cholesterol reduction", "Antibiotic resistance"]
  },
  {
    q: "CMS oversees which U.S. programs?",
    a: "Medicare & Medicaid",
    opts: ["Medicare & Medicaid", "VA & TRICARE", "Private insurance markets", "FDA drug trials"]
  },
  {
    q: "EHR stands for?",
    a: "Electronic Health Record",
    opts: ["Electronic Health Record", "Enhanced Healthcare Reporting", "External Health Registry", "Enterprise Hospital Resource"]
  },
  {
    q: "The IRA (2022) allowed Medicare to do what for the first time?",
    a: "Negotiate drug prices directly",
    opts: ["Negotiate drug prices directly", "Manufacture generic drugs", "Approve biosimilars faster", "Set insurance premiums"]
  },
  {
    q: "A formulary is best described as?",
    a: "An insurer's approved drug list",
    opts: ["An insurer's approved drug list", "A drug manufacturing protocol", "A clinical trial design", "A sales territory map"]
  },
  {
    q: "A biosimilar is?",
    a: "A near-copy of an approved biologic drug",
    opts: ["A near-copy of an approved biologic drug", "A generic small-molecule drug", "An AI-designed compound", "A synthetic hormone"]
  },
  {
    q: "KOL in pharma marketing stands for?",
    a: "Key Opinion Leader",
    opts: ["Key Opinion Leader", "Knowledge Operations Lead", "Known Outcomes Level", "Key Outreach Liaison"]
  },
  {
    q: "Phase III clinical trials primarily test?",
    a: "Efficacy and safety in large populations",
    opts: ["Efficacy and safety in large populations", "Drug dosage in healthy volunteers", "Drug manufacturing processes", "Post-market surveillance"]
  },
  {
    q: "Step Therapy means a patient must?",
    a: "Try cheaper drugs before a premium one is approved",
    opts: ["Try cheaper drugs before a premium one is approved", "Increase dosage gradually", "Combine multiple drugs", "Use the newest drug first"]
  },
  {
    q: "What does ESI stand for in PBM context?",
    a: "Express Scripts Inc.",
    opts: ["Express Scripts Inc.", "Electronic Systems Integration", "Employer Services Index", "Extended Supply Initiative"]
  },
  {
    q: "PDUFA fees are paid by pharma companies to?",
    a: "Fund FDA drug review operations",
    opts: ["Fund FDA drug review operations", "Cover Medicare co-pays", "Finance clinical trials", "Pay for drug rebates"]
  },
];

// Pick today's 5 questions using the seed
function getDailyQuestions() {
  return seededShuffle(QUIZ_BANK).slice(0, 5);
}

// ── Quiz State ────────────────────────────────
let quizState = null;

function renderQuiz(container) {
  quizState = {
    questions: getDailyQuestions(),
    current: 0,
    score: 0,
  };
  renderQuestion(container);
}

function renderQuestion(container) {
  const { questions, current } = quizState;
  const q = questions[current];

  // Shuffle answer options differently per question
  const opts = seededShuffle(q.opts).sort(
    () => Math.sin(TODAY_SEED + current * 7777) - 0.5
  );

  container.innerHTML = `
    <div class="quiz-progress">
      ${questions.map((_, i) => `
        <div class="progress-dot ${i < current ? 'done' : i === current ? 'current' : ''}"></div>
      `).join('')}
    </div>

    <p class="quiz-meta">Q${current + 1} of ${questions.length} · Pharma IQ Check 🧠</p>
    <h3 class="quiz-question">${q.q}</h3>

    <div class="quiz-options">
      ${opts.map(opt => `
        <button class="quiz-option" data-opt="${opt}">${opt}</button>
      `).join('')}
    </div>
  `;

  // Wire up each answer button
  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn, container));
  });
}

function handleAnswer(btn, container) {
  const correct = quizState.questions[quizState.current].a;
  const isRight = btn.dataset.opt === correct;

  // Lock all buttons immediately
  container.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.dataset.opt === correct) b.classList.add('correct');
  });

  if (isRight) {
    quizState.score++;
  } else {
    btn.classList.add('wrong');
  }

  // Short pause then advance
  setTimeout(() => {
    quizState.current++;
    quizState.current < quizState.questions.length
      ? renderQuestion(container)
      : renderQuizResult(container);
  }, 900);
}

function renderQuizResult(container) {
  const { score, questions } = quizState;
  const pct  = score / questions.length;
  const won  = pct >= 0.6;

  // Pick emoji and message based on score
  const emoji = pct === 1   ? '🏆'
              : pct >= 0.8  ? '🎯'
              : pct >= 0.6  ? '✅'
              : '😅';

  const msg = pct === 1
    ? "Perfect score. The PBMs fear you."
    : pct >= 0.8
    ? "Sharp. Your formulary knowledge is showing."
    : pct >= 0.6
    ? "Passed. Go treat yourself."
    : "The buzzwords will return. Come back stronger.";

  container.innerHTML = `
    <div class="quiz-result">
      <span class="result-emoji">${emoji}</span>
      <h2 class="result-title">${score} / ${questions.length}</h2>
      <p class="result-msg">${msg}</p>
      <button class="btn-primary" id="btn-retry">Play Again 🔄</button>
    </div>
  `;

  // 🎉 Confetti only on win (score ≥ 60%)
  if (won) launchConfetti({ count: 130, duration: 3500 });

  container.querySelector('#btn-retry')
    .addEventListener('click', () => renderQuiz(container));
}

// ════════════════════════════════════════════════
// WORD HUNT — find pharma buzzwords in a grid
// ════════════════════════════════════════════════

// ── Word Bank ─────────────────────────────────
// 40 real pharma/health words, 5-8 characters.
// 5 are picked randomly on every game load.
// Short enough to fit the 10x10 grid.
const WORD_BANK = [
  'REBATE',    'COPAY',     'GENERIC',   'PATENT',
  'CLINICAL',  'PIPELINE',  'MOLECULE',  'PRICING',
  'PAYER',     'TRIAL',     'DOSAGE',    'LABEL',
  'MARKET',    'ACCESS',    'LAUNCH',    'OUTCOME',
  'PATIENT',   'SAFETY',    'EFFICACY',  'APPROVAL',
  'COVERAGE',  'BENEFIT',   'THERAPY',   'CHRONIC',
  'BRANDED',   'PROVIDER',  'MANAGED',   'CHANNEL',
  'POLICY',    'BURDEN',    'PHARMA',    'NETWORK',
  'BIOTECH',   'VACCINE',   'ADVERSE',   'COMPOUND',
  'FORMULARY', 'SPECIALTY', 'ADHERENCE', 'APPROVED',
];

// Pick 5 random words on every call
// Math.random() = different every refresh — no seed
function getRandomWords() {
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}
// Build a 10×10 letter grid with words hidden inside
function buildGrid(words) {
  const SIZE = 10;
  const grid  = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const placed = [];

  // Only horizontal and vertical — easier to play on mobile
  const DIRS = [[0, 1], [1, 0]];

  for (const word of words) {
    let success  = false;
    let attempts = 0;

    while (!success && attempts++ < 200) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const maxR = SIZE - (dr ? word.length : 0);
      const maxC = SIZE - (dc ? word.length : 0);
      if (maxR < 1 || maxC < 1) continue;

      const r0 = Math.floor(Math.random() * maxR);
      const c0 = Math.floor(Math.random() * maxC);

      // Check if placement collides
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const cell = grid[r0 + i * dr]?.[c0 + i * dc];
        if (cell !== '' && cell !== word[i]) { fits = false; break; }
      }

      if (fits) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const r = r0 + i * dr;
          const c = c0 + i * dc;
          grid[r][c] = word[i];
          cells.push([r, c]);
        }
        placed.push({ word, cells });
        success = true;
      }
    }
  }

  // Fill empty cells with random letters
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c])
        grid[r][c] = ALPHA[Math.floor(Math.random() * ALPHA.length)];

  return { grid, placed };
}

// ── Word Search State ─────────────────────────
let wsState = null;

function renderWordSearch(container) {
  const words = getRandomWords();
  const { grid, placed } = buildGrid(words);

  wsState = {
    words,
    placed,
    found:      new Set(),
    firstClick: null,
    grid,
  };

  container.innerHTML = `
    <p class="quiz-meta">Find all pharma buzzwords · Daily Hunt 🔍</p>

    <div class="ws-words" id="ws-words">
      ${words.map(w => `
        <span class="ws-word" id="wsw-${w}">${w}</span>
      `).join('')}
    </div>

    <div class="ws-grid-wrap">
      <div id="ws-grid">
        ${grid.map((row, r) => `
          <div class="ws-row">
            ${row.map((letter, c) => `
              <div class="ws-cell" data-r="${r}" data-c="${c}">${letter}</div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>

    <p class="ws-status" id="ws-status">
      Tap the first letter, then the last letter of a word
    </p>
  `;

  // Wire up cell clicks
  container.querySelectorAll('.ws-cell').forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell, container));
  });
}

function handleCellClick(cell, container) {
  const r = parseInt(cell.dataset.r);
  const c = parseInt(cell.dataset.c);

  if (!wsState.firstClick) {
    // ── First click: mark start ──
    wsState.firstClick = { r, c };
    cell.classList.add('selected');
    document.getElementById('ws-status').textContent =
      'Now tap the last letter of the word';
    return;
  }

  // ── Second click: evaluate selection ──
  const { r: r0, c: c0 } = wsState.firstClick;

  // Clear highlight
  container.querySelectorAll('.ws-cell.selected')
    .forEach(el => el.classList.remove('selected'));
  wsState.firstClick = null;

  // Must be straight line: horizontal or vertical only
  const isHorizontal = r === r0;
  const isVertical   = c === c0;

  if (!isHorizontal && !isVertical) {
    document.getElementById('ws-status').textContent =
      '⚠️ Select horizontally or vertically only';
    return;
  }

  // Collect letters between start and end
  const dr = Math.sign(r - r0);
  const dc = Math.sign(c - c0);
  const selected = [];
  let cr = r0, cc = c0;

  while (true) {
    selected.push([cr, cc]);
    if (cr === r && cc === c) break;
    cr += dr; cc += dc;
    if (selected.length > 12) break; // safety cap
  }

  const word = selected
    .map(([row, col]) => wsState.grid[row]?.[col] ?? '')
    .join('');

  // Check against placed words
  const match = wsState.placed.find(
    p => p.word === word && !wsState.found.has(p.word)
  );

  if (match) {
    wsState.found.add(match.word);

    // Highlight the found cells gold
    match.cells.forEach(([row, col]) => {
      container.querySelector(`[data-r="${row}"][data-c="${col}"]`)
        ?.classList.add('found');
    });

    // Cross off the word chip
    document.getElementById(`wsw-${match.word}`)?.classList.add('found');

    const remaining = wsState.words.length - wsState.found.size;

    if (remaining > 0) {
      document.getElementById('ws-status').textContent =
        `✅ Found "${match.word}"! ${remaining} word${remaining > 1 ? 's' : ''} left…`;
    } else {
      // 🎉 All words found — WIN
      setTimeout(() => {
        document.getElementById('ws-status').textContent =
          '🏆 All found! You are the pharma word wizard.';
        launchConfetti({ count: 160, duration: 4000 });
      }, 200);
    }

  } else {
    document.getElementById('ws-status').textContent =
      '❌ Not a match. Try again!';
  }
}

// ════════════════════════════════════════════════
// INIT — called by app.js on page load
// ════════════════════════════════════════════════
export function initGames() {
  const gameTabs      = document.querySelectorAll('.game-tab');
  const gameContainer = document.getElementById('game-container');

  function loadGame(type) {
    // Sync tab button active state
    gameTabs.forEach(t =>
      t.classList.toggle('active', t.dataset.game === type)
    );

    // Render the chosen game
    if      (type === 'quiz')       renderQuiz(gameContainer);
    else if (type === 'wordsearch') renderWordSearch(gameContainer);
  }

  // Tab click handler
  gameTabs.forEach(tab => {
    tab.addEventListener('click', () => loadGame(tab.dataset.game));
  });

  // Load quiz by default
  loadGame('quiz');
}
