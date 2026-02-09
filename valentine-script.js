// Valentine Website JavaScript

// ===============================
// GLOBAL VARIABLES
// ===============================
let currentSongIndex = 0;
let songs = [];
let bgMusic = null;
let userInteracted = false;

// ===============================
// AUDIO UNLOCK (REQUIRED BY BROWSER)
// ===============================
function unlockAudio() {
  if (userInteracted) return;
  userInteracted = true;

  if (bgMusic) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeInAudio(bgMusic);
  }
}

// First user interaction unlocks audio
document.addEventListener("click", unlockAudio, { once: true });

// ===============================
// INITIAL LOAD
// ===============================
document.addEventListener("DOMContentLoaded", function () {
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

  progressFill.style.width = "0%";
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
// NAVIGATION + MUSIC CONTROL
// ===============================
function navigateToPage(pageId) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;
  targetPage.classList.add("active");

  // ---------- MUSIC LOGIC ----------
  if (pageId === "songs") {
    // Stop BG music
    if (bgMusic) fadeOutAudio(bgMusic);

    setupSongs();

    // Cassette autoplay ONLY after user interaction
    if (userInteracted) {
      playSongSequence();
    }
  } else {
    // Leaving songs page
    stopAllSongs();

    // Resume BG music
    if (bgMusic && userInteracted) {
      bgMusic.play().catch(() => {});
      fadeInAudio(bgMusic);
    }
  }

  // ---------- PAGE SETUPS ----------
  if (pageId === "loading") startLoadingAnimation();
  if (pageId === "envelope") setupEnvelope();
  if (pageId === "memory-game") initializeMemoryGame();
  if (pageId === "moments") animatePolaroids();

  document.getElementById("exploreOverlay")?.classList.remove("active");
}

// ===============================
// HAMBURGER MENU
// ===============================
function setupHamburgerMenu() {
  document.getElementById("hamburger")?.addEventListener("click", () =>
    document.getElementById("exploreOverlay")?.classList.add("active")
  );

  document.getElementById("closeExplore")?.addEventListener("click", () =>
    document.getElementById("exploreOverlay")?.classList.remove("active")
  );

  document.querySelectorAll(".explore-item").forEach(item => {
    item.onclick = () => navigateToPage(item.dataset.page);
  });
}

// ===============================
// ENVELOPE
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
  const song = songs[currentSongIndex];
  if (!song) return;

  song.play().catch(() => {});
  song.onended = () => {
    currentSongIndex++;
    playCurrentSong();
  };
}

function stopAllSongs() {
  songs.forEach(song => {
    song.pause();
    song.currentTime = 0;
  });
  currentSongIndex = 0;
}

// ===============================
// FINAL LETTER + VIDEO
// ===============================
function sealLetter() {
  const letterCard = document.getElementById("finalLetterCard");
  const sealedMessage = document.getElementById("sealedMessage");

  if (!letterCard || !sealedMessage) return;

  letterCard.style.display = "none";
  sealedMessage.classList.add("show");
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
// AUDIO FADE HELPERS
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
    if (audio.volume === 0) {
      audio.pause();
      clearInterval(fade);
    }
  }, 50);
}
