// ================================================
// js/app.js — The traffic cop of the entire app
// ================================================
// This file does ONE job:
// When you tap "Spark" or "Fun Zone" in the nav,
// it shows the right panel and hides the others.
//
// It also boots the jar and games when the page loads.
// ================================================

import { initJar }   from './jar.js';
import { initGames } from './games.js';

// ── Tab Switching ─────────────────────────────
// Grab every tab button and every panel
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab; // reads data-tab="home" or data-tab="fun"

    // Remove .active from everything
    tabBtns.forEach(b   => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    // Add .active only to what was clicked
    btn.classList.add('active');
    document.getElementById(`panel-${target}`).classList.add('active');
  });
});

// ── Boot the modules ──────────────────────────
// Each module is self-contained — app.js just wakes them up
initJar();
initGames();
