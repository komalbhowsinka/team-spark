// ================================================
// js/jar.js — The Star Jar
// ================================================
// Handles tap → fetch quote → show card
// Uses { text, source } from motivations.js
// source === 'ai'    → green glow + AI badge
// source === 'local' → blue glow  + vault badge
// ================================================

import { getMotivation } from './motivations.js';
import { launchConfetti } from './confetti.js';

const STAR_COLORS = [
  '#fbbf24', // gold
  '#8b5cf6', // purple
  '#22d3ee', // cyan
  '#f9a8d4', // pink
  '#86efac', // green
  '#fb923c', // orange
];

// ── Build floating stars inside the jar ───────
function buildStars() {
  const container = document.getElementById('jar-stars');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const star     = document.createElement('div');
    star.className = 'star-particle';

    const size     = Math.random() * 9 + 3;
    const left     = Math.random() * 125 + 8;
    const bottom   = Math.random() * 30;
    const delay    = Math.random() * 5;
    const duration = Math.random() * 3 + 4;
    const color    = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

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
export function initJar() {
  const jar          = document.getElementById('jar');
  const card         = document.getElementById('motivation-card');
  const motivationEl = document.getElementById('motivation-text');
  const tapHint      = document.getElementById('tap-hint');
  const btnCopy      = document.getElementById('btn-copy');
  const badge        = document.getElementById('motivation-badge');

  buildStars();

  // ── Tap handler ───────────────────────────
  async function handleTap() {

    // 1. Shake the jar
    jar.classList.remove('tapped');
    void jar.offsetWidth;
    jar.classList.add('tapped');
    setTimeout(() => jar.classList.remove('tapped'), 500);

    // 2. Fetch quote — returns { text, source }
    const { text, source } = await getMotivation();

    // 3. Put quote text in the card
    motivationEl.textContent = text;

    // 4. Apply glow color based on source
    card.classList.remove('glow-ai', 'glow-local');
    card.classList.add(source === 'ai' ? 'glow-ai' : 'glow-local');

    // 5. Update badge text and color
    if (source === 'ai') {
      badge.textContent = '✨ AI generated';
      badge.classList.add('badge-ai');
      badge.classList.remove('badge-local');
    } else {
      badge.textContent = '📚 from the vault';
      badge.classList.add('badge-local');
      badge.classList.remove('badge-ai');
    }

    // 6. Show the card with animation
    card.removeAttribute('hidden');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';

    // 7. Update hint text
    tapHint.textContent = 'tap again for a new one ✨';

    // 8. Small confetti burst
    launchConfetti({ count: 40, duration: 1800 });
  }

  // Mouse + touch
  jar.addEventListener('click', handleTap);

  // Keyboard accessibility
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
      btnCopy.textContent = 'open via HTTPS to copy';
    }
    setTimeout(() => { btnCopy.textContent = 'copy 📋'; }, 2200);
  });
}
