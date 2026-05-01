// ================================================
// js/ai-config.js — AI Configuration
// ================================================
// The API key is NOT here anymore.
// It lives safely inside Cloudflare as a secret.
// This file just points to your Worker URL.
// ================================================

export const AI_CONFIG = {
  // Your Cloudflare Worker — this is your secure proxy
  workerUrl: 'https://team-spark-ai.komalbhowsinka99.workers.dev',
  model:     'llama3-8b-8192',
};

// Safety filter — rejects any AI response with these words
export const CONTENT_FILTERS = [
  'democrat', 'republican', 'trump', 'biden',
  'election', 'voter', 'maga', 'liberal',
  'conservative', 'congress', 'senate',
  'kill', 'killed', 'die', 'dead', 'death',
  'suicide', 'racist', 'racism', 'sexist',
  'sexism', 'hate', 'hatred', 'discrimination',
  'god', 'allah', 'jesus', 'bible',
  'quran', 'prayer', 'pray',
  'sleep when you\'re dead', 'no days off',
];
