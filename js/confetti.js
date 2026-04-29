// ================================================
// js/confetti.js — Celebration Animation
// ================================================
// Zero dependencies. Pure canvas math.
// One exported function: launchConfetti()
//
// How it works:
//   1. Creates 100 colored particles at the top
//   2. Each frame: moves them down (gravity) + sideways (wobble)
//   3. Fades them out in the last 30% of duration
//   4. Clears the canvas when done
// ================================================

const COLORS = [
  '#fbbf24', // gold
  '#8b5cf6', // purple
  '#22d3ee', // cyan
  '#f9a8d4', // pink
  '#86efac', // green
  '#fb923c', // orange
  '#ffffff',  // white
];

export function launchConfetti({ count = 100, duration = 2500 } = {}) {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');

  // Match canvas size to the screen
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create all the particles
  const particles = Array.from({ length: count }, (_, i) => ({
    x:        Math.random() * canvas.width,          // random horizontal start
    y:        Math.random() * canvas.height * 0.3,   // starts in top 30%
    vx:       (Math.random() - 0.5) * 7,             // random left/right speed
    vy:       Math.random() * 5 + 2,                  // falls downward
    color:    COLORS[i % COLORS.length],
    size:     Math.random() * 9 + 4,                  // 4px to 13px
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10,             // spins while falling
    wobble:   Math.random() * Math.PI * 2,            // sine wave phase
    shape:    Math.random() > 0.4 ? 'rect' : 'circle',
  }));

  const startTime = performance.now();

  // This function runs ~60 times per second
  function drawFrame(now) {
    const elapsed = now - startTime;

    // Stop after duration is over
    if (elapsed > duration + 500) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate fade: full opacity until 70% done, then fade out
    const fadeStart = duration * 0.7;
    const alpha = elapsed < fadeStart
      ? 1
      : Math.max(0, 1 - (elapsed - fadeStart) / (duration * 0.3));

    for (const p of particles) {
      // Physics: update position each frame
      p.wobble   += 0.05;
      p.vx       += Math.sin(p.wobble) * 0.2; // gentle horizontal drift
      p.vy       += 0.12;                       // gravity pulls down
      p.x        += p.vx;
      p.y        += p.vy;
      p.rotation += p.rotSpeed;

      // Draw each particle
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Schedule the next frame
    requestAnimationFrame(drawFrame);
  }

  // Kick off the animation loop
  requestAnimationFrame(drawFrame);
}
