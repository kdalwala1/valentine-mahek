// Valentine Website JavaScript

// 🎵 Music sequence variables
let currentSongIndex = 0;
let songs = [];

// 🎵 Background music
let bgMusic = null;

// ===============================
// INITIAL LOAD
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  initializePetals();
  startLoadingAnimation();
  setupHamburgerMenu();

  // Background music (unchanged)
  bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    bgMusic.loop = true;
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeInAudio(bgMusic);
  }
});

// ===============================
// PETALS
// ===============================
function initializePetals() {
  const petalsContainer = document.getElementById("petalsContainer");
  if (!petalsContainer) return;

  const petalEmojis = ["🌸", "🌺", "💖", "💕", "🌹", "💗"];

  for (let i = 0; i < 15; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent =
      petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = Math.random() * 3 + 5 + "s";
    petal.style.animationDelay = Math.random() * 5 + "s";
    petalsContainer.appendChild(petal);
  }
}

// ===============================
// LOADING
// ===============================
function startLoadingAnimation() {
  const progressFill = document.getElementById("progressFill");
  if (!progressFill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    progressFill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => navigateToPage("proposal"), 500);
    }
  }, 60);
}

// ===============================
// NAVIGATION
// ===============================
function navigateToPage(pageId) {
  document.querySelectorAll(".page").forEach((p) =>
    p.classList.remove("active")
  );

  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;
  targetPage.classList.add("active");

  // 🔁 Restart loading animation when Start is clicked
if (pageId === "loading") {
  const progressFill = document.getElementById("progressFill");
  if (progressFill) {
    progressFill.style.width = "0%";
  }
  startLoadingAnimation();
}

  // Envelope fix
  if (pageId === "envelope") setupEnvelope();

  // Memory game fix
  if (pageId === "memory-game") initializeMemoryGame();

  // Polaroid animation
  if (pageId === "moments") animatePolaroids();

  document.getElementById("exploreOverlay")?.classList.remove("active");
}

// ===============================
// HAMBURGER MENU
// ===============================
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("exploreOverlay");
  const close = document.getElementById("closeExplore");

  hamburger?.addEventListener("click", () =>
    overlay.classList.add("active")
  );
  close?.addEventListener("click", () =>
    overlay.classList.remove("active")
  );

  document.querySelectorAll(".explore-item").forEach((item) => {
    item.onclick = () => navigateToPage(item.dataset.page);
  });
}

// ===============================
// ENVELOPE FIX
// ===============================
function setupEnvelope() {
  const envelope = document.getElementById("envelope");
  const envelopeHint = document.getElementById("envelopeHint");

  if (!envelope || !envelopeHint) return;

  envelope.onclick = () => {
    envelope.classList.toggle("open");
    if (envelope.classList.contains("open")) {
      envelopeHint.textContent = "Beautiful! 💕";
      setTimeout(() => navigateToPage("love-letter"), 2000);
    }
  };
}

// ===============================
// SONG PLAYER
// ===============================
let currentlyPlaying = null;

function toggleSong(songNumber) {
  const audio = document.getElementById("song" + songNumber);
  if (!audio) return;

  const button = audio.previousElementSibling;
  const reels = audio
    .closest(".cassette-card")
    .querySelectorAll(".reel");

  if (currentlyPlaying && currentlyPlaying !== audio) {
    currentlyPlaying.pause();
    currentlyPlaying.currentTime = 0;
  }

  if (audio.paused) {
    audio.play();
    button.textContent = "⏸ Pause";
    reels.forEach((r) => r.classList.add("spinning"));
    currentlyPlaying = audio;
  } else {
    audio.pause();
    button.textContent = "▶ Play";
    reels.forEach((r) => r.classList.remove("spinning"));
    currentlyPlaying = null;
  }
}

// ===============================
// MEMORY GAME FIX
// ===============================
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initializeMemoryGame() {
  const gameBoard = document.getElementById("gameBoard");
  if (!gameBoard) return;

  matchedPairs = 0;
  moves = 0;
  flippedCards = [];
  canFlip = true;

  document.getElementById("moves").textContent = "0";
  document.getElementById("matches").textContent = "0";
  document.getElementById("gameWin").classList.remove("show");

  const emojis = ["💕", "💖", "💗", "💘", "💝", "💞"];
  gameCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  gameBoard.innerHTML = "";
  gameCards.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.onclick = () => flipCard(card, emoji);
    gameBoard.appendChild(card);
  });
}

function flipCard(card, emoji) {
  if (!canFlip || card.textContent) return;

  card.textContent = emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    canFlip = false;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [a, b] = flippedCards;
  if (a.textContent === b.textContent) {
    matchedPairs++;
    document.getElementById("matches").textContent = matchedPairs;
  } else {
    a.textContent = "";
    b.textContent = "";
  }
  flippedCards = [];
  canFlip = true;
}

// ===============================
// FINAL LETTER FIX
// ===============================
function sealLetter() {
  const letterCard = document.getElementById("finalLetterCard");
  const sealedMessage = document.getElementById("sealedMessage");

  if (!letterCard || !sealedMessage) return;

  letterCard.style.display = "none";
  sealedMessage.classList.add("show");
  createConfetti();
}

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
// POLAROIDS
// ===============================
function animatePolaroids() {
  document.querySelectorAll(".polaroid").forEach((p, i) => {
    setTimeout(() => p.classList.add("show"), i * 400);
  });
}

// ===============================
// AUDIO FADES (UNCHANGED)
// ===============================
function fadeInAudio(audio, target = 0.4, duration = 1000) {
  if (!audio) return;
  audio.volume = 0;
  const step = target / (duration / 50);
  const fade = setInterval(() => {
    audio.volume = Math.min(audio.volume + step, target);
    if (audio.volume >= target) clearInterval(fade);
  }, 50);
}

function fadeOutAudio(audio, duration = 800) {
  if (!audio) return;
  const step = audio.volume / (duration / 50);
  const fade = setInterval(() => {
    audio.volume = Math.max(audio.volume - step, 0);
    if (audio.volume === 0) clearInterval(fade);
  }, 50);
}
