// Valentine Website JavaScript
// =============================

// 🎵 Cassette music variables
let currentSongIndex = 0;
let songs = [];
let currentlyPlaying = null;

// 🎵 Background music reference (created dynamically)
let bgMusic = null;

// =============================
// PAGE LOAD
// =============================
document.addEventListener("DOMContentLoaded", () => {
  initializePetals();
  startLoadingAnimation();
  setupHamburgerMenu();

  // Start background music on first load
  createAndPlayBgMusic();
});

// =============================
// BACKGROUND MUSIC (HARD CONTROL)
// =============================
function createAndPlayBgMusic() {
  if (document.getElementById("bgMusic")) return;

  const audio = document.createElement("audio");
  audio.id = "bgMusic";
  audio.loop = true;

  const source = document.createElement("source");
  source.src = "audio/background-music.mp3";
  source.type = "audio/mpeg";

  audio.appendChild(source);
  document.body.appendChild(audio);

  audio.volume = 0;
  audio.play().catch(() => {});
  fadeInAudio(audio);

  bgMusic = audio;
}

function destroyBgMusic() {
  const audio = document.getElementById("bgMusic");
  if (!audio) return;

  fadeOutAudio(audio);
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    audio.remove();
    bgMusic = null;
  }, 900);
}

// Stop BG music when tab closes
window.addEventListener("beforeunload", () => {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
});

// =============================
// NAVIGATION
// =============================
function navigateToPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  // Show target page
  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;
  targetPage.classList.add("active");

  // 🎵 HARD MUSIC RULE
  if (pageId === "songs") {
    destroyBgMusic();
    setupSongs();
    playSongSequence();
  } else {
    stopAllSongs();
    createAndPlayBgMusic();
  }

  // Page-specific logic
  if (pageId === "memory-game") initializeMemoryGame();
  if (pageId === "moments") animatePolaroids();

  // Close hamburger overlay
  document.getElementById("exploreOverlay").classList.remove("active");
}

// =============================
// HAMBURGER MENU
// =============================
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("exploreOverlay");
  const close = document.getElementById("closeExplore");

  hamburger.onclick = () => overlay.classList.add("active");
  close.onclick = () => overlay.classList.remove("active");

  document.querySelectorAll(".explore-item").forEach(item => {
    item.onclick = () => navigateToPage(item.dataset.page);
  });
}

// =============================
// CASSETTE MUSIC
// =============================
function setupSongs() {
  songs = [
    document.getElementById("song1"),
    document.getElementById("song2"),
    document.getElementById("song3")
  ];
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

// =============================
// LOADING
// =============================
function startLoadingAnimation() {
  const bar = document.getElementById("progressFill");
  let progress = 0;

  const interval = setInterval(() => {
    progress += 2;
    bar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => navigateToPage("proposal"), 500);
    }
  }, 60);
}

// =============================
// VISUALS
// =============================
function initializePetals() {
  const container = document.getElementById("petalsContainer");
  const emojis = ["🌸", "🌺", "💖", "💕", "🌹"];

  for (let i = 0; i < 15; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = Math.random() * 3 + 5 + "s";
    container.appendChild(petal);
  }
}

function animatePolaroids() {
  document.querySelectorAll(".polaroid").forEach((p, i) => {
    setTimeout(() => p.classList.add("show"), i * 400);
  });
}

// =============================
// FADE UTILITIES
// =============================
function fadeInAudio(audio, target = 0.4, duration = 1000) {
  let step = target / (duration / 50);
  audio.volume = 0;

  const fade = setInterval(() => {
    audio.volume = Math.min(audio.volume + step, target);
    if (audio.volume >= target) clearInterval(fade);
  }, 50);
}

function fadeOutAudio(audio, duration = 800) {
  let step = audio.volume / (duration / 50);

  const fade = setInterval(() => {
    audio.volume = Math.max(audio.volume - step, 0);
    if (audio.volume <= 0) clearInterval(fade);
  }, 50);
}
