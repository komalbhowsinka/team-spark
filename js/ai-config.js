// ================================================
// js/ai-config.js — Your Settings + Safety Filter
// ================================================
// Two jobs:
//   1. Holds your Groq AI API key (optional)
//   2. Defines words that BLOCK an AI response
//
// If AI response contains ANY word from CONTENT_FILTERS
// → it gets thrown away silently
// → app uses local quotes instead
//
// HOW TO GET A FREE GROQ KEY (takes 2 minutes):
//   1. Go to console.groq.com
//   2. Sign up — no credit card needed
//   3. Click "API Keys" → "Create API Key"
//   4. Paste it below
//
// If you leave it blank → app works fine with local quotes
// ================================================

export const AI_CONFIG = {
  apiKey: 'YOUR_GROQ_API_KEY_HERE', // ← paste your key here (optional)
  model:  'llama3-8b-8192',          // free + very fast model
};

// ── Safety Filter ─────────────────────────────
// Any AI output containing these words gets REJECTED.
// The app falls back to local quotes silently.
// Add your own terms at the bottom of each section.
export const CONTENT_FILTERS = [

  // Political — keep the workplace neutral
  'democrat', 'republican', 'trump', 'biden',
  'election', 'voter', 'maga', 'liberal',
  'conservative', 'congress', 'senate',
  'partisan', 'political party',

  // HR risk / offensive
  'kill', 'killed', 'die', 'dead', 'death',
  'suicide', 'racist', 'racism', 'sexist',
  'sexism', 'hate', 'hatred', 'discrimination',
  'slur', 'abuse', 'harass',

  // Religion — neutral workplace
  'god', 'allah', 'jesus', 'bible',
  'quran', 'prayer', 'pray', 'heaven',
  'hell', 'blessed',

  // Toxic hustle culture
  'sleep when you\'re dead',
  'no days off',
  'always be closing',

];
