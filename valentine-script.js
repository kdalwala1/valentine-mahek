// ===============================
// GLOBAL STATE
// ===============================
let bgMusic;
let userInteracted = false;
let isOnSongsPage = false;

let songs = [];
let currentSongIndex = 0;
let currentlyPlaying = null;

// ===============================
// USER INTERACTION UNLOCK
// ===============================
function unlockAudioOnce() {
  if (userInteracted) return;
  userInteracted = true;

  if (bgMusic && !isOnSongsPage) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});
    fadeInAudio(bgMusic);
  }
}
document.addEventListener("click", unlockAudioOnce, { once: true });

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
// NAVIGATION (FIXED)
// ===============================
function navigateToPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (!page) return;
  page.classList.add("active");

  // ---------- SONG PAGE ----------
  if (pageId === "songs") {
    isOnSongsPage = true;

    // HARD STOP BG MUSIC
    if (bgMusic) {
      fadeOutAudio(bgMusic);
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }

    setupSongs();

    // Auto play cassette ONLY after interaction
    if (userInteracted) playSongSequence();
  }

  // ---------- LEAVING SONG PAGE ----------
  else {
    if (isOnSongsPage) {
      stopAllSongs();
      isOnSongsPage = false;
    }

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
// PETALS
// ===============================
function initializePetals() {
  const c = document.getElementById("petalsContainer");
  if (!c) return;

  ["🌸","🌺","💖","💕","🌹","💗"].forEach(() => {
    const p = document.createElement("div");
    p.className = "petal";
    p.textContent = ["🌸","🌺","💖","💕","🌹","💗"][Math.floor(Math.random()*6)];
    p.style.left = Math.random()*100 + "%";
    p.style.animationDuration = Math.random()*3 + 5 + "s";
    p.style.animationDelay = Math.random()*5 + "s";
    c.appendChild(p);
  });
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
  document.querySelectorAll(".explore-item").forEach(i =>
    i.onclick = () => navigateToPage(i.dataset.page)
  );
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
// CASSETTE MUSIC (FIXED)
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
  currentlyPlaying = s;

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
  currentlyPlaying = null;
  currentSongIndex = 0;
}

// Manual play/pause button still works
function toggleSong(n) {
  const audio = document.getElementById("song"+n);
  if (!audio) return;

  if (currentlyPlaying && currentlyPlaying !== audio) {
    currentlyPlaying.pause();
    currentlyPlaying.currentTime = 0;
  }

  if (audio.paused) {
    audio.play();
    currentlyPlaying = audio;
  } else {
    audio.pause();
    currentlyPlaying = null;
  }
}

// ===============================
// MEMORY GAME (FINAL – MATCHES YOUR HTML)
// ===============================
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;

function initializeMemoryGame() {
  const board = document.getElementById("gameBoard");
  if (!board) return;

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;

  document.getElementById("moves").textContent = "0";
  document.getElementById("matches").textContent = "0";
  document.getElementById("finalMoves").textContent = "0";
  document.getElementById("gameWin").classList.remove("show");

  const emojis = ["💕", "💖", "💗", "💘", "💝", "💞"];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  board.innerHTML = "";

  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.dataset.emoji = emoji;
    card.dataset.flipped = "false";
    card.onclick = () => handleCardClick(card);
    board.appendChild(card);
  });
}

function handleCardClick(card) {
  if (lockBoard) return;
  if (card.dataset.flipped === "true") return;

  card.textContent = card.dataset.emoji;
  card.dataset.flipped = "true";

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves++;
  document.getElementById("moves").textContent = moves;

  setTimeout(checkForMatch, 700);
}

function checkForMatch() {
  if (!firstCard || !secondCard) return;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    matches++;
    document.getElementById("matches").textContent = matches;

    if (matches === 6) {
      document.getElementById("finalMoves").textContent = moves;
      setTimeout(() => {
        document.getElementById("gameWin").classList.add("show");
      }, 400);
    }
  } else {
    firstCard.textContent = "";
    secondCard.textContent = "";
    firstCard.dataset.flipped = "false";
    secondCard.dataset.flipped = "false";
  }

  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ===============================
// FINAL LETTER
// ===============================
function sealLetter() {
  document.getElementById("finalLetterCard").style.display = "none";
  document.getElementById("sealedMessage").classList.add("show");
  createConfetti();
}

function goToVideo() {
  stopAllSongs();
  if (bgMusic) fadeOutAudio(bgMusic);

  setTimeout(() => {
    window.location.href =
      "https://kdalwala1.github.io/valentine-mahek/video/";
  }, 800);
}

// ===============================
// POLAROIDS
// ===============================
function animatePolaroids() {
  document.querySelectorAll(".polaroid").forEach((p,i)=>
    setTimeout(()=>p.classList.add("show"), i*400)
  );
}

// ===============================
// AUDIO FADES
// ===============================
function fadeInAudio(a,t=0.4,d=800){
  if(!a) return;
  a.volume=0;
  const s=t/(d/50);
  const i=setInterval(()=>{
    a.volume=Math.min(a.volume+s,t);
    if(a.volume>=t) clearInterval(i);
  },50);
}

function fadeOutAudio(a,d=600){
  if(!a) return;
  const s=a.volume/(d/50);
  const i=setInterval(()=>{
    a.volume=Math.max(a.volume-s,0);
    if(a.volume===0){
      a.pause();
      clearInterval(i);
    }
  },50);
}