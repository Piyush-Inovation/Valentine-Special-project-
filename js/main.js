/* ═══════════════════════════════════════════════════
   💖 VALENTINE WEEK — Main JavaScript
   For Aditi, created with love
   ═══════════════════════════════════════════════════ */

// ── Backend API Configuration ──
const API_BASE = 'http://localhost:3000/api';

// ── Floating Hearts Background Effect ──
function createFloatingHearts(count = 15) {
  const hearts = ['💖', '💕', '💗', '💝', '❤️', '💘', '✨', '🌸'];
  const container = document.body;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 8 + 6) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    heart.style.opacity = Math.random() * 0.4 + 0.1;
    container.appendChild(heart);
  }
}

// ── Hearts Burst Effect (on YES click) ──
function createHeartsBurst(x, y) {
  const burstContainer = document.createElement('div');
  burstContainer.className = 'heart-burst';
  document.body.appendChild(burstContainer);

  const heartEmojis = ['❤️', '💖', '💕', '💗', '💝', '💘', '🌹', '✨', '💋', '🥰'];

  for (let i = 0; i < 40; i++) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const angle = (Math.PI * 2 * i) / 40;
    const distance = Math.random() * 400 + 200;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.setProperty('--tx', tx + 'px');
    heart.style.setProperty('--ty', ty + 'px');
    heart.style.fontSize = (Math.random() * 25 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
    heart.style.animationDelay = (Math.random() * 0.3) + 's';

    burstContainer.appendChild(heart);
  }

  setTimeout(() => burstContainer.remove(), 3000);
}

// ── Confetti Effect ──
function createConfetti(duration = 5000) {
  const colors = ['#ff6b9d', '#e84393', '#a29bfe', '#fd79a8', '#f9ca24', '#ff9ff3', '#feca57', '#ff6348'];
  const shapes = ['circle', 'square', 'strip'];

  const interval = setInterval(() => {
    for (let i = 0; i < 5; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.background = color;
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = confetti.style.width;
      } else if (shape === 'strip') {
        confetti.style.width = (Math.random() * 4 + 2) + 'px';
        confetti.style.height = (Math.random() * 20 + 10) + 'px';
        confetti.style.borderRadius = '2px';
      } else {
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = confetti.style.width;
      }

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }, 100);

  setTimeout(() => clearInterval(interval), duration);
}

// ── NO Button Logic ──
let noClickCount = 0;
const noMessages = [
  "Oops 😜 try again!",
  "No is not allowed 💘",
  "Nice try Aditi 😉",
  "Hehe, you can't escape love 💕",
  "The button ran away! 😂",
  "I won't let you say no 🥰",
  "Aditi please 🥺💖",
  "You know you want to say YES 💝",
  "Nah nah nah... try again! 😜",
  "That button is scared of you! 😄",
  "You're stuck with me 💗",
  "NO button doesn't work here 😏",
  "Love always wins, Aditi! 🌹",
  "Keep trying, it's impossible 😉💘"
];

function initNoButton() {
  const noBtn = document.getElementById('noBtn');
  const counterEl = document.getElementById('noCounter');

  if (!noBtn) return;

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('click', moveNoButton);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });
}

function moveNoButton() {
  const noBtn = document.getElementById('noBtn');
  const counterEl = document.getElementById('noCounter');

  noClickCount++;

  // Update counter display
  if (counterEl) {
    counterEl.style.display = 'block';
    counterEl.textContent = `😜 NO attempts: ${noClickCount}`;
  }

  // Send NO attempt to backend
  sendToBackend('no-attempt', {
    name: 'Aditi',
    day: 'proposal',
    action: 'NO_ATTEMPT',
    attemptNumber: noClickCount,
    timestamp: new Date().toISOString()
  });

  // Move button to random position
  const maxX = window.innerWidth - noBtn.offsetWidth - 20;
  const maxY = window.innerHeight - noBtn.offsetHeight - 20;
  const randomX = Math.max(20, Math.random() * maxX);
  const randomY = Math.max(20, Math.random() * maxY);

  noBtn.style.position = 'fixed';
  noBtn.style.left = randomX + 'px';
  noBtn.style.top = randomY + 'px';
  noBtn.style.zIndex = '999';
  noBtn.style.transition = 'none';

  // Make button smaller each time
  const scale = Math.max(0.5, 1 - noClickCount * 0.03);
  noBtn.style.transform = `scale(${scale})`;

  // Show playful message
  showNoMessage();
}

function showNoMessage() {
  const message = noMessages[noClickCount % noMessages.length];

  // Remove existing message
  const existing = document.querySelector('.no-message');
  if (existing) existing.remove();

  const msgDiv = document.createElement('div');
  msgDiv.className = 'no-message';
  msgDiv.textContent = message;
  document.body.appendChild(msgDiv);

  setTimeout(() => {
    msgDiv.style.opacity = '0';
    msgDiv.style.transition = 'opacity 0.3s';
    setTimeout(() => msgDiv.remove(), 300);
  }, 1500);
}

// ── YES Button Logic ──
function initYesButton() {
  const yesBtn = document.getElementById('yesBtn');
  if (!yesBtn) return;

  yesBtn.addEventListener('click', handleYesClick);
}

function handleYesClick(e) {
  const rect = e.target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Create hearts burst effect
  createHeartsBurst(x, y);

  // Create confetti
  createConfetti(4000);

  // Send YES response to backend (with notification)
  sendToBackend('response', {
    name: 'Aditi',
    day: 'proposal',
    response: 'YES',
    noAttempts: noClickCount,
    timestamp: new Date().toISOString()
  });

  // Show success overlay after a short delay
  setTimeout(() => showSuccessOverlay(), 800);
}

function showSuccessOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  overlay.innerHTML = `
    <span class="emoji-large" style="animation-delay: 0s;">💖</span>
    <h1 class="main-title glow-text" style="margin-top: 20px;">Yayyy! I knew it, Aditi! 💖</h1>
    <p class="love-message" style="opacity: 1; font-size: 1.3rem;">
      You just made my heart the happiest ❤️<br>
      <small style="opacity: 0.7;">She tried to click NO ${noClickCount} time${noClickCount !== 1 ? 's' : ''} 😂</small>
    </p>
    <div class="love-divider">💕 💕 💕</div>
    <p class="love-message" style="opacity: 1; font-size: 1.1rem; margin-top: 10px;">
      Get ready for the most beautiful Valentine Week! 🌹✨
    </p>
    <a href="rose-day.html" class="btn btn-love" style="margin-top: 25px; display: inline-block; text-decoration: none;">
      Start Our Journey 💕➡️
    </a>
  `;

  document.body.appendChild(overlay);
  createConfetti(3000);
}

// ── Backend Communication ──
async function sendToBackend(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Data sent to backend (${endpoint}):`, result);

      // Show toast notification for successful YES response
      if (endpoint === 'response' && data.response === 'YES') {
        showToast('💖 Response saved! Notification sent!');
      }
    }
  } catch (error) {
    // Backend might not be running — that's okay for frontend demo
    console.log(`ℹ️ Backend not available (${endpoint}). Data:`, data);
  }
}

// ── Toast Notification ──
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// ── Navigation Dots (disabled — each page is standalone) ──
function createNavDots(currentPage) {
  // Pages are sent individually, no navigation needed
}

// ── Rose Day Floating Roses ──
function createFloatingRoses() {
  const roseContainer = document.getElementById('roseContainer');
  if (!roseContainer) return;

  const roses = ['🌹', '🌺', '🌸', '🏵️', '💐'];

  for (let i = 0; i < 8; i++) {
    const rose = document.createElement('span');
    rose.className = 'floating-rose';
    rose.textContent = roses[Math.floor(Math.random() * roses.length)];
    rose.style.left = (i * 12 + Math.random() * 5) + '%';
    rose.style.top = (Math.random() * 60 + 20) + '%';
    rose.style.animationDelay = (i * 0.4) + 's';
    rose.style.animationDuration = (3 + Math.random() * 2) + 's';
    roseContainer.appendChild(rose);
  }
}

// ── Kiss Day Flying Kisses ──
function createFlyingKisses() {
  const kissContainer = document.getElementById('kissContainer');
  if (!kissContainer) return;

  const kisses = ['💋', '😘', '💕', '💗', '💖'];

  for (let i = 0; i < 10; i++) {
    const kiss = document.createElement('span');
    kiss.className = 'flying-kiss';
    kiss.textContent = kisses[Math.floor(Math.random() * kisses.length)];
    kiss.style.left = (Math.random() * 80 + 10) + '%';
    kiss.style.animationDuration = (3 + Math.random() * 3) + 's';
    kiss.style.animationDelay = (Math.random() * 4) + 's';
    kiss.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
    kissContainer.appendChild(kiss);
  }
}

// ── Valentine Day Final Celebrations ──
function initValentinePage() {
  createConfetti(8000);
  createFloatingHearts(25);

  // Send page visit to backend
  sendToBackend('page-visit', {
    name: 'Aditi',
    day: 'valentine-day',
    timestamp: new Date().toISOString()
  });
}

// ── Track Page Visits ──
function trackPageVisit(dayName) {
  sendToBackend('page-visit', {
    name: 'Aditi',
    day: dayName,
    timestamp: new Date().toISOString()
  });
}

// ── Music Toggle (Optional) ──
function initMusicToggle() {
  const toggle = document.getElementById('musicToggle');
  if (!toggle) return;

  let isPlaying = false;

  toggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    toggle.textContent = isPlaying ? '🔊' : '🔇';
    toggle.classList.toggle('playing', isPlaying);

    // Music could be added as an audio element
    const audio = document.getElementById('bgMusic');
    if (audio) {
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  });
}

// ── Loading Screen ──
function hideLoadingScreen() {
  const loading = document.getElementById('loadingScreen');
  if (loading) {
    setTimeout(() => {
      loading.classList.add('fade-out');
      setTimeout(() => loading.remove(), 500);
    }, 1200);
  }
}

// ── Initialize Everything on DOM Load ──
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen
  hideLoadingScreen();

  // Create floating hearts on all pages
  createFloatingHearts(12);

  // Init music toggle
  initMusicToggle();

  // Page-specific initialization
  const page = document.body.dataset.page;

  switch (page) {
    case 'proposal':
      initNoButton();
      initYesButton();
      break;
    case 'rose':
      createFloatingRoses();
      trackPageVisit('rose-day');
      break;
    case 'propose':
      trackPageVisit('propose-day');
      break;
    case 'chocolate':
      trackPageVisit('chocolate-day');
      break;
    case 'teddy':
      trackPageVisit('teddy-day');
      break;
    case 'promise':
      trackPageVisit('promise-day');
      break;
    case 'hug':
      trackPageVisit('hug-day');
      break;
    case 'kiss':
      createFlyingKisses();
      trackPageVisit('kiss-day');
      break;
    case 'valentine':
      initValentinePage();
      break;
  }
});
