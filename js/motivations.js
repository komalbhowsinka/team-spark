// ================================================
// js/motivations.js — The Quote Engine
// ================================================
// Every tap → tries AI first (via Cloudflare Worker)
// If AI fails, times out, or is unsafe → uses your
// 125 hardcoded quotes silently. User never notices.
// Returns { text, source } so jar.js knows which glow to show.
// ================================================

import { AI_CONFIG, CONTENT_FILTERS } from './ai-config.js';

const MOTIVATIONS = [

  // ── RISE & GRIND ──────────────────────────
  "The sun didn't ask permission to rise today. Neither should you.",
  "Good morning. Your competition just hit snooze for the third time.",
  "Every great day starts with the decision that it's going to be one.",
  "You woke up before your alarm. Your brain already knows what's at stake.",
  "Morning is the only time of day that belongs entirely to you. Before the Slack notifications. Cherish this.",
  "Rise early enough and you'll catch the world before it's had time to go wrong.",
  "The most motivated people don't wait for motivation. They start anyway.",
  "New day. Clean slate. Zero excuses. Same excellent you.",
  "Your morning routine is the first project you ship every day. Make it count.",
  "The version of you who sleeps in and the version who doesn't are living completely different lives. Choose your protagonist.",
  "Today hasn't failed yet. Let's keep it that way for as long as possible.",
  "Every morning is a blank document. Stop leaving the cursor on the first line.",
  "You are not a morning person or a night person. You are a results person.",
  "The alarm is not your enemy. Comfort is.",
  "Sunrise: the universe's daily reminder that darkness has a hard stop.",
  "Before the world has opinions about your day, you get to have one first.",
  "The best version of you woke up with the same number of hours as everyone else. Math doesn't lie.",
  "Today's to-do list is tomorrow's 'remember when I did all that' story.",
  "Morning people didn't get extra hours. They just learned to value the ones they have.",
  "You already survived 100% of your worst mornings. Today is practice.",
  "Start before you're ready. The confidence arrives later, usually in the car.",
  "Good morning. The people who outwork you are already 20 minutes in. Not a threat. Just a data point.",
  "Your bed is the most persuasive opponent you will face today. You already won. That's the first W. Bank it.",
  "The hour before the world starts is the hour you make the world start your way.",
  "Greatness does not begin with a grand gesture. It begins with getting up.",

  // ── FOCUS BEFORE NOON ─────────────────────
  "Deep work doesn't happen by accident. It happens by closing the other 47 tabs.",
  "Your most important task today is not urgent. That's exactly why it keeps getting skipped.",
  "The difference between productive and busy is what you're doing with your attention.",
  "Your brain does its best thinking before the first meeting. Guard that window like rent depends on it.",
  "A clear morning mind is a competitive advantage. Protect it from email for at least one hour.",
  "The hardest thing isn't doing the work. It's starting it. The rest is just momentum.",
  "If it's important, it gets the morning. If it's urgent, it gets scheduled.",
  "Great ideas arrive in the morning. Mediocre ones arrive after lunch meetings.",
  "Every hour of focused work is worth three hours of scattered effort.",
  "The meeting could have been an email. The email could have been clarity.",
  "Clarity in the morning means fewer corrections at midnight.",
  "You don't need more time. You need better time. There is a difference.",
  "The project you keep postponing isn't waiting for the right moment. It's waiting for you.",
  "One thing done well before 10am changes the trajectory of the entire day.",
  "If your morning routine doesn't include time to think, you're reacting all day.",
  "Not every task deserves your best hour. Learn which ones do. Give those the morning.",
  "The inbox is a list of other people's priorities. Don't let it manage yours.",
  "Block the time before you plan the work. An unprotected calendar is an unprotected day.",
  "Morning focus is not about doing more. It's about doing the right thing first.",
  "Write it down before you talk about it. Talking makes it feel done. Writing makes it real.",
  "Your brain's first two hours are premium real estate. Stop renting them to notifications.",
  "The question isn't whether you'll be productive today. The question is at what.",
  "A sharp mind in the morning is not an accident. It is a practice.",
  "Do the hard thing first. Everything after it is slightly easier by comparison.",
  "The people who seem to get the most done aren't faster. They're clearer.",

  // ── RESILIENCE & GRIT ─────────────────────
  "A rough yesterday is not a rough tomorrow. New data. New day.",
  "The comeback is always more interesting than the cruise control.",
  "You didn't come this far to stop at the part where it gets hard. That's literally the plot twist you were training for.",
  "Failure is just a draft. Every great final version went through a terrible first one.",
  "Resilience isn't bouncing back. It's bouncing forward, slightly smarter.",
  "The obstacle is not in the way of the work. The obstacle is the work.",
  "Good morning. Whatever broke yesterday, today is the fix window.",
  "The setback is real. The story you tell about it is optional. Choose wisely.",
  "You are not defined by the difficult sprint. You are defined by how you shipped after it.",
  "Every expert was once a beginner who refused to stop being bad at it.",
  "Scars from hard work are a form of credentials nobody can take away.",
  "The version of you who quit is in a parallel universe. Don't let timelines merge.",
  "Criticism is just undeployed feedback. File it, review it, decide what to keep.",
  "Today you will face something uncomfortable. That is the schedule. It was always the schedule.",
  "The hard morning is still better than the regret of not trying.",
  "You were not built for perfect conditions. You were built to create them.",
  "Every morning you get up after a hard day is a declaration of intent.",
  "The people who change industries don't do it in one morning. They do it in a thousand.",
  "Problems that seem permanent in the evening usually look optional by morning.",
  "Grit is not a personality trait. It is a decision you remake every morning.",
  "Your worst day at work is still someone else's dream job on a good day.",
  "Exhaustion means you showed up fully. Rest, then show up again.",
  "The mess is not a sign you failed. The mess is a sign you attempted.",
  "Every morning that feels hard is just opportunity wearing bad lighting.",
  "You have survived every difficult morning so far. Current streak remains unbroken. Maintain it.",

  // ── FOR THE HIGH PERFORMERS ────────────────
  "Being the smartest person in the room is less impressive than making the room smarter.",
  "High standards are not a burden. They are the reason people trust you with things that matter.",
  "You don't need to announce your work ethic. Let the output make the introduction.",
  "The overachiever's fatal flaw is doing it all. The discipline is knowing what not to do.",
  "Excellence is not overrated. It is under-practiced. You already know the difference.",
  "Your attention to detail is not perfectionism. It is respect for the end user.",
  "The work you do when no one is watching is your actual standard of living.",
  "Outperformers don't have a different clock. They have a different relationship with discomfort.",
  "You are allowed to be proud of what you built. Just don't stop building.",
  "Great work has a compounding effect. Every excellent output raises the floor for the next one.",
  "The person who over-prepares rarely regrets it. The person who under-prepares always does.",
  "You already know what needs to happen. You are waiting on courage, not clarity.",
  "The high performer's superpower is not energy. It is the ability to direct energy precisely.",
  "The people who call you 'too much' have never seen what 'enough' can accomplish.",
  "Doing it right the first time is never as slow as doing it wrong twice.",
  "Your best idea is not the first one or the flashiest one. It's the one that survives the most questions.",
  "Excellence does not require an audience. It only requires you and the standard.",
  "The overachiever in the room isn't showing off. They just genuinely cannot do it halfway.",
  "Being organized isn't boring. It's how you make space for the actually interesting work.",
  "You are not overthinking. You are thoroughness disguised as anxiety. Know the difference.",
  "The work you are most proud of cost you something. That's not a coincidence.",
  "Raise the bar slowly enough that others can follow. That's leadership, not limitation.",
  "Your instinct has been right more often than your doubt has.",
  "The post-launch silence is not indifference. It's the sound of something working.",
  "Good morning, overachiever. The rest of the day will struggle to keep up. Help it.",

  // ── JOY, HUMOR & PERSPECTIVE ───────────────
  "Good morning. Your coffee is ready and your expectations are already too high. Both are fine.",
  "Today's goal: do great work and leave before the building hosts a third optional sync.",
  "Morning affirmation: I am capable, I am ready, and I already responded to that email at 6am.",
  "The sunrise happens whether you acknowledge it or not. It does not need your calendar invite.",
  "You have 24 hours. You will waste approximately 3 of them. Budget accordingly.",
  "Not everything that feels urgent is important. Not everything important will ever feel urgent.",
  "Good morning. Someone out there is already impressed by you. Return the favor to yourself.",
  "Your to-do list does not define your worth. Your to-do list is a tool. You are the craftsperson.",
  "You are not behind. You are at exactly the pace that got you here. And here is not bad. Look around.",
  "The goal is not to be perfect. The goal is to be slightly less wrong than yesterday.",
  "Celebrate small wins before someone schedules a meeting to discuss them.",
  "Some days are a sprint. Some days are a trudge. Both count the same in the annual review.",
  "Good morning. The version of you from five years ago would be absolutely floored right now.",
  "A good laugh in the morning is a productivity tool that HR can't block.",
  "Your worth is not in your output. Your output is just what you do with your worth.",
  "The meeting you were dreading will probably be fine. It is almost always fine.",
  "Do one thing today that the version of you from last year couldn't do.",
  "Good morning. You are statistically unlikely to regret trying. The data supports the attempt.",
  "Everything looks more solvable after breakfast. This is not philosophy. This is blood sugar.",
  "Today will be imperfect and productive. These are not in conflict.",
  "The most impressive thing about you isn't what you've done. It's that you're still curious.",
  "You are not trying to be the best version of you. You are trying to be a slightly better one. Easier target.",
  "Good morning. The world is not ready for what you're about to bring to it today.",
  "Rest is not the opposite of ambition. It is the infrastructure ambition runs on.",
  "You made it to another morning. That's the baseline. Everything else today is bonus.",

];

// ── Session memory ────────────────────────────
const usedThisSession = new Set();

// ── Daily seed ────────────────────────────────
function getDailyIndex() {
  const dateStr = new Date().toDateString();
  let hash = 5381;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) + hash) ^ dateStr.charCodeAt(i);
    hash = hash & 0x7fffffff;
  }
  return hash % MOTIVATIONS.length;
}

// ── Pick a local quote ────────────────────────
function getLocalMotivation() {
  if (usedThisSession.size === 0) {
    const idx = getDailyIndex();
    usedThisSession.add(idx);
    return MOTIVATIONS[idx];
  }
  if (usedThisSession.size >= MOTIVATIONS.length) {
    usedThisSession.clear();
  }
  let idx;
  do {
    idx = Math.floor(Math.random() * MOTIVATIONS.length);
  } while (usedThisSession.has(idx));
  usedThisSession.add(idx);
  return MOTIVATIONS[idx];
}

// ── Safety check ──────────────────────────────
function isSafe(text) {
  if (!text || text.length > 300) return false;
  const lower = text.toLowerCase();
  return !CONTENT_FILTERS.some(term => lower.includes(term));
}

// ── AI fetch via Cloudflare Worker ────────────
async function fetchAIMotivation() {
  if (!AI_CONFIG || !AI_CONFIG.workerUrl) return null;
  const workerUrl = AI_CONFIG.workerUrl;
  const model     = AI_CONFIG.model;

  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(workerUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        max_tokens: 80,
        temperature: 0.9,
        messages: [
          {
            role: 'system',
            content: `Write a short motivational quote for high-performing tech and pharma professionals.
Style: sharp, witty, honest — like the book "Good Morning Overachiever".
Rules: max 30 words, no politics, no religion, no offensive content,
no hustle culture clichés. One quote only. No quotation marks.`
          },
          { role: 'user', content: "Give me today's quote." }
        ]
      })
    });

    clearTimeout(timeout);
    if (!res.ok) return null;
    const data  = await res.json();
    const quote = data?.choices?.[0]?.message?.content?.trim();
    return isSafe(quote) ? quote : null;

  } catch {
    return null;
  }
}

// ── Main export ───────────────────────────────
// Returns { text, source } — source is 'ai' or 'local'
// jar.js uses source to decide which glow color to show
export async function getMotivation() {
  const aiQuote = await fetchAIMotivation();
  if (aiQuote) {
    return { text: aiQuote, source: 'ai' };
  }
  return { text: getLocalMotivation(), source: 'local' };
}
