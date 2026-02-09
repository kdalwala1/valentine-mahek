// Valentine Website JavaScript

// ===============================
// GLOBAL VARIABLES
// ===============================
let currentSongIndex = 0;
let songs = [];
let bgMusic = null;
let userInteracted = false;
let isOnSongsPage = false;

// ===============================
// AUDIO UNLOCK (REQUIRED)
// ===============================
function unlockAudio() {
  if (userInteracted) return;
  userInteracted = true;

  if (bgMusic && !isOnSongsPage) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeInAudio(bgMusic);
  }
}
document.addEventListener("click", unlockAudio, { once: true });

// ===============================
// INITIAL LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initializePetals();
  startLoadingAnimation();
  setupHamburgerMenu();

  bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    bgMusic.loop = true;
    bgMusic.volume = 0;
  }
});

// ===============================
// NAVIGATION
// ===============================
function navigateToPage(pageId) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  const page = document.getElementById(pageId);
  if (!page) return;
  page.classList.add("active");

  // ---------- MUSIC CONTROL ----------
  if (pageId === "songs") {
    isOnSongsPage = true;

    // HARD STOP BG MUSIC
    if (bgMusic) {
      fadeOutAudio(bgMusic);
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }

    setupSongs();
    if (userInteracted) playSongSequence();
  } else {
    // Leaving songs page
    isOnSongsPage = false;
    stopAllSongs();

    if (bgMusic && userInteracted) {
      bgMusic.volume = 0;
      bgMusic.play().catch(() => {});
      fadeInAudio(bgMusic);
    }
  }

  // ---------- PAGE INIT ----------
  if (pageId === "loading") startLoadingAnimation();
  if (pageId === "envelope") setupEnvelope();
  if (pageId === "memory-game") initializeMemoryGame();
  if (pageId === "moments") animatePolaroids();

  document.getElementById("exploreOverlay")?.classList.remove("active");
}

// ===============================
// LOADING
// ===============================
function startLoadingAnimation() {
  const bar = document.getElementById("progressFill");
  if (!bar) return;

  bar.style.width = "0%";
  let p = 0;

  const i = setInterval(() => {
    p += 2;
    bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(i);
      setTimeout(() => navigateToPage("proposal"), 500);
    }
  }, 60);
}

// ===============================
// HAMBURGER
// ===============================
function setupHamburgerMenu() {
  document.getElementById("hamburger")?.addEventListener("click", () =>
    document.getElementById("exploreOverlay")?.classList.add("active")
  );
  document.getElementById("closeExplore")?.addEventListener("click", () =>
    document.getElementById("exploreOverlay")?.classList.remove("active")
  );
  document.querySelectorAll(".explore-item").forEach(i => {
    i.onclick = () => navigateToPage(i.dataset.page);
  });
}

// ===============================
// ENVELOPE
// ===============================
function setupEnvelope() {
  const e = document.getElementById("envelope");
  const h = document.getElementById("envelopeHint");
  if (!e || !h) return;

  e.onclick = () => {
    e.classList.toggle("open");
    if (e.classList.contains("open")) {
      h.textContent = "Beautiful! 💕";
      setTimeout(() => navigateToPage("love-letter"), 2000);
    }
  };
}

// ===============================
// CASSETTE MUSIC
// ===============================
function setupSongs() {
  songs = [
    document.getElementById("song1"),
    document.getElementById("song2"),
    document.getElementById("song3")
  ].filter(Boolean);
}

function playSongSequence() {
  stopAllSongs();
  currentSongIndex = 0;
  playCurrentSong();
}

function playCurrentSong() {
  const s = songs[currentSongIndex];
  if (!s) return;

  s.play().catch(() => {});
  s.onended = () => {
    currentSongIndex++;
    playCurrentSong();
  };
}

function stopAllSongs() {
  songs.forEach(s => {
    s.pause();
    s.currentTime = 0;
  });
  currentSongIndex = 0;
}

// ===============================
// MEMORY GAME (FULLY RESTORED)
// ===============================
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initializeMemoryGame() {
  const board = document.getElementById("gameBoard");
  if (!board) return;

  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  canFlip = true;

  document.getElementById("moves").textContent = "0";
  document.getElementById("matches").textContent = "0";
  document.getElementById("gameWin").classList.remove("show");

  const emojis = ["💕","💖","💗","💘","💝","💞"];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  board.innerHTML = "";
  cards.forEach(e => {
    const c = document.createElement("div");
    c.className = "game-card";
    c.onclick = () => flipCard(c, e);
    board.appendChild(c);
  });
}

function flipCard(card, emoji) {
  if (!canFlip || card.textContent) return;

  card.textContent = emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    canFlip = false;
    moves++;
    document.getElementById("moves").textContent = moves;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [a, b] = flippedCards;

  if (a.textContent === b.textContent) {
    matchedPairs++;
    document.getElementById("matches").textContent = matchedPairs;

    if (matchedPairs === 6) {
      document.getElementById("gameWin").classList.add("show");
    }
  } else {
    a.textContent = "";
    b.textContent = "";
  }

  flippedCards = [];
  canFlip = true;
}

// ===============================
// FINAL LETTER + VIDEO
// ===============================
function sealLetter() {
  const c = document.getElementById("finalLetterCard");
  const m = document.getElementById("sealedMessage");
  if (!c || !m) return;

  c.style.display = "none";
  m.classList.add("show");
  createConfetti();
}

function goToVideo() {
  stopAllSongs();
  if (bgMusic) fadeOutAudio(bgMusic);

  setTimeout(() => {
    window.location.href =
      "https://kdalwala1.github.io/valentine-mahek/video/";
  }, 900);
}

// ===============================
// POLAROIDS
// ===============================
function animatePolaroids() {
  document.querySelectorAll(".polaroid").forEach((p, i) =>
    setTimeout(() => p.classList.add("show"), i * 400)
  );
}

// ===============================
// CONFETTI
// ===============================
function createConfetti() {
  for (let i = 0; i < 20; i++) {
    const c = document.createElement("div");
    c.textContent = "💖";
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "%";
    c.style.top = "-20px";
    c.style.fontSize = "2rem";
    c.style.animation = "fall 3s linear";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

// ===============================
// AUDIO FADES
// ===============================
function fadeInAudio(a, t = 0.4, d = 1000) {
  if (!a) return;
  a.volume = 0;
  const s = t / (d / 50);
  const i = setInterval(() => {
    a.volume = Math.min(a.volume + s, t);
    if (a.volume >= t) clearInterval(i);
  }, 50);
}

function fadeOutAudio(a, d = 800) {
  if (!a) return;
  const s = a.volume / (d / 50);
  const i = setInterval(() => {
    a.volume = Math.max(a.volume - s, 0);
    if (a.volume === 0) {
      a.pause();
      clearInterval(i);
    }
  }, 50);
}