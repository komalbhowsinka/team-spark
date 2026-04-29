// ================================================
// js/jar.js — The Star Jar
// ================================================
// Two jobs:
//   1. Build the floating star particles inside the jar
//   2. Handle tap → fetch quote → show card
//
// The stars are just divs. CSS animates them floating
// upward. JS randomizes size, color, speed, position
// so no two jars ever look identical.
// ================================================

import { getMotivation } from './motivations.js';
import { launchConfetti } from './confetti.js';

// Star colors — matches the app's color palette
const STAR_COLORS = [
  '#fbbf24', // gold
  '#8b5cf6', // purple
  '#22d3ee', // cyan
  '#f9a8d4', // pink
  '#86efac', // green
  '#fb923c', // orange
];

// ── Build floating stars ──────────────────────
// Creates 20 div elements inside the jar.
// Each gets random: size, position, color, speed.
// CSS float-star animation moves them upward.
function buildStars() {
  const container = document.getElementById('jar-stars');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const star  = document.createElement('div');
    star.className = 'star-particle';

    const size     = Math.random() * 9 + 3;     // 3px – 12px
    const left     = Math.random() * 125 + 8;   // horizontal position inside jar
    const bottom   = Math.random() * 30;         // starts near the base
    const delay    = Math.random() * 5;          // staggered start time
    const duration = Math.random() * 3 + 4;      // 4s – 7s to float to top
    const color    = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    // Apply everything as inline styles
    // The CSS animation picks these up automatically
    star.style.cssText = `
      width:            ${size}px;
      height:           ${size}px;
      left:             ${left}px;
      bottom:           ${bottom}px;
      background:       ${color};
      box-shadow:       0 0 ${size * 2.5}px ${color};
      animation-duration:  ${duration}s;
      animation-delay:    -${delay}s;
    `;

    container.appendChild(star);
  }
}

// ── Main init ─────────────────────────────────
// Called once by app.js when the page loads.
export function initJar() {
  const jar          = document.getElementById('jar');
  const card         = document.getElementById('motivation-card');
  const motivationEl = document.getElementById('motivation-text');
  const tapHint      = document.getElementById('tap-hint');
  const btnCopy      = document.getElementById('btn-copy');

  // Build the star particles on load
  buildStars();

  // ── Tap / Click handler ───────────────────
  async function handleTap() {

    // 1. Shake the jar (CSS animation)
    jar.classList.remove('tapped');
    void jar.offsetWidth;        // force browser to reset animation
    jar.classList.add('tapped');
    setTimeout(() => jar.classList.remove('tapped'), 500);

    // 2. Fetch a quote (AI if configured, else local)
    const quote = await getMotivation();

    // 3. Put the quote in the card
    motivationEl.textContent = quote;

    // 4. Show the card with animation
    card.removeAttribute('hidden');
    card.style.animation = 'none';
    void card.offsetWidth;       // force animation reset
    card.style.animation = '';

    // 5. Update the hint text
    tapHint.textContent = 'tap again for a new one ✨';

    // 6. Small confetti burst (bigger bursts are for game wins)
    launchConfetti({ count: 40, duration: 1800 });
  }

  // Mouse click
  jar.addEventListener('click', handleTap);

  // Keyboard support (Enter or Space = tap)
  jar.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTap();
    }
  });

  // ── Copy button ───────────────────────────
  btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(motivationEl.textContent);
      btnCopy.textContent = 'copied! ✅';
    } catch {
      // clipboard requires HTTPS — works fine on GitHub Pages
      btnCopy.textContent = 'open via HTTPS to copy';
    }
    // Reset button text after 2 seconds
    setTimeout(() => { btnCopy.textContent = 'copy 📋'; }, 2200);
  });
}
