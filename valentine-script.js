// Valentine Website JavaScript

// 🎵 Music sequence variables
let currentSongIndex = 0;
let songs = [];

// Initialize on page load
// 🎼 Background music reference
let bgMusic;
document.addEventListener('DOMContentLoaded', function() {
  initializePetals();
  startLoadingAnimation();
  setupHamburgerMenu();

  // 🎼 Start background music (looping)
  bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    bgMusic.volume = 0.4;
    bgMusic.loop = true;   // ✅ force loop
    bgMusic.play().catch(() => {});
  }
});

// Create floating petals animation
function initializePetals() {
    const petalsContainer = document.getElementById('petalsContainer');
    const petalEmojis = ['🌸', '🌺', '💖', '💕', '🌹', '💗'];
    
    // Create 15 petals
    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 5) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petalsContainer.appendChild(petal);
    }
}

// Loading animation
function startLoadingAnimation() {
    const progressFill = document.getElementById('progressFill');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                navigateToPage('proposal');
            }, 500);
        }
    }, 60); // 3 seconds total
}

// Navigation function
function navigateToPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Initialize specific page features
        if (pageId === 'memory-game') {
            initializeMemoryGame();
        }
// 🎵 Music control
if (pageId === "songs") {
  // Stop background music on Songs page
  if (bgMusic) bgMusic.pause();

  setupSongs();
  playSongSequence();
} else {
  // Stop cassette songs on other pages
  stopAllSongs();

  // Resume background music (looped)
  if (bgMusic && pageId !== "final-video") {
    bgMusic.play().catch(() => {});
  }
}
        // Animate polaroids when Moments page opens
if (pageId === "moments") {
  animatePolaroids();
}
    }
    
    // Close explore overlay if open
    const exploreOverlay = document.getElementById('exploreOverlay');
    exploreOverlay.classList.remove('active');
}

// Hamburger menu functionality
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const exploreOverlay = document.getElementById('exploreOverlay');
    const closeExplore = document.getElementById('closeExplore');
    const exploreItems = document.querySelectorAll('.explore-item');
    
    hamburger.addEventListener('click', () => {
        exploreOverlay.classList.add('active');
    });
    
    closeExplore.addEventListener('click', () => {
        exploreOverlay.classList.remove('active');
    });
    
    exploreItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
}

// Envelope interaction
const envelope = document.getElementById('envelope');
const envelopeHint = document.getElementById('envelopeHint');

if (envelope) {
    envelope.addEventListener('click', function() {
        this.classList.toggle('open');
        if (this.classList.contains('open')) {
            envelopeHint.textContent = 'Beautiful! 💕';
            setTimeout(() => {
                navigateToPage('love-letter');
            }, 2000);
        }
    });
}

// Song player functionality
let currentlyPlaying = null;

function toggleSong(songNumber) {
    const audio = document.getElementById('song' + songNumber);
    const button = audio.previousElementSibling;
    const cassette = audio.parentElement.querySelector('.cassette');
    const reels = cassette.querySelectorAll('.reel');
    
    // Stop currently playing song
    if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
        const prevButton = currentlyPlaying.previousElementSibling;
        prevButton.textContent = '▶ Play';
        const prevReels = currentlyPlaying.parentElement.querySelectorAll('.reel');
        prevReels.forEach(reel => reel.classList.remove('spinning'));
    }
    
    // Toggle current song
    if (audio.paused) {
        audio.play();
        button.textContent = '⏸ Pause';
        reels.forEach(reel => reel.classList.add('spinning'));
        currentlyPlaying = audio;
    } else {
        audio.pause();
        button.textContent = '▶ Play';
        reels.forEach(reel => reel.classList.remove('spinning'));
        currentlyPlaying = null;
    }
    
    // Reset when song ends
    audio.addEventListener('ended', function() {
        button.textContent = '▶ Play';
        reels.forEach(reel => reel.classList.remove('spinning'));
        currentlyPlaying = null;
    });
}

// Memory Game
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function initializeMemoryGame() {
    // Reset game state
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    canFlip = true;
    
    // Update display
    document.getElementById('moves').textContent = '0';
    document.getElementById('matches').textContent = '0';
    document.getElementById('gameWin').classList.remove('show');
    
    // Card emojis (6 pairs)
    const cardEmojis = ['💕', '💖', '💗', '💘', '💝', '💞'];
    const cardPairs = [...cardEmojis, ...cardEmojis];
    
    // Shuffle cards
    gameCards = shuffleArray(cardPairs);
    
    // Create game board
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.dataset.testid = `game-card-${index}`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function flipCard(event) {
    if (!canFlip) return;
    
    const card = event.currentTarget;
    
    // Prevent flipping already matched or flipped cards
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);
    
    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        moves++;
        document.getElementById('moves').textContent = moves;
        
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('matches').textContent = matchedPairs;
        
        // Check if game is won
        if (matchedPairs === 6) {
            setTimeout(showWinMessage, 500);
        }
    } else {
        // No match - flip back
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    // Reset for next turn
    flippedCards = [];
    canFlip = true;
}

function showWinMessage() {
  const winMessage = document.getElementById("gameWin");
  const movesText = document.getElementById("finalMoves");
  const nextBtn = document.getElementById("gameNextBtn");

  movesText.textContent = moves;
  winMessage.classList.add("show");

  // Show Continue button ONLY after winning
  setTimeout(() => {
    nextBtn.style.display = "block";
  }, 800);
}

// Final letter functions
function sealLetter() {
  const letterCard = document.getElementById("finalLetterCard");
  const sealedMessage = document.getElementById("sealedMessage");

  // Hide the letter
  if (letterCard) {
    letterCard.style.display = "none";
  }

  // Show sealed message + button
  if (sealedMessage) {
    sealedMessage.classList.add("show");
  }

  // Confetti effect
  createConfetti();
}

function createConfetti() {
    const confettiEmojis = ['💕', '💖', '💗', '💘', '💝', '💞', '✨', '🌸', '🌺'];
    const body = document.body;
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-50px';
        confetti.style.fontSize = '2rem';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `fall ${Math.random() * 2 + 3}s linear forwards`;
        
        body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// 🎵 MUSIC SEQUENCE FUNCTIONS
function setupSongs() {
  songs = [
    document.getElementById("song1"),
    document.getElementById("song2"),
    document.getElementById("song3")
  ];
}

function playSongSequence() {
  // Stop all songs first
  songs.forEach(song => {
    song.pause();
    song.currentTime = 0;
  });

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
  if (!songs || songs.length === 0) return;

  songs.forEach(song => {
    song.pause();
    song.currentTime = 0;
  });

  currentSongIndex = 0;
}
function goToVideo() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  window.location.href =
    "https://kdalwala1.github.io/valentine-mahek/video/";
}
function animatePolaroids() {
  const polaroids = document.querySelectorAll(".polaroid");

  polaroids.forEach((polaroid, index) => {
    setTimeout(() => {
      polaroid.classList.add("show");
    }, index * 400);
  });
}
function restartJourney() {
    // Reset to loading page
    navigateToPage('loading');
    
    // Restart loading animation
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = '0%';
    
    // Hide sealed message
    const sealedMessage = document.getElementById('sealedMessage');
    sealedMessage.classList.remove('show');
    
    // Stop any playing audio
    if (currentlyPlaying) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
        currentlyPlaying = null;
    }
    
    // Restart loading animation
    setTimeout(() => {
        startLoadingAnimation();
    }, 500);
}

// Instructions for updating content:
/*
TO UPDATE CONTENT:

1. LOVE LETTER MESSAGES:
   - Edit the text inside the <p> tags in the #love-letter section
   - Edit the text inside the <p> tags in the #final-letter section

2. SONGS:
   - Replace [SONG_URL_1], [SONG_URL_2], [SONG_URL_3] with actual song URLs
   - Update the song titles and artist names in the HTML
   - Format: <source src="YOUR_SONG_URL.mp3" type="audio/mpeg">

3. PHOTOS:
   - Replace the emoji placeholders in the .polaroid sections
   - Use: <img src="YOUR_PHOTO_URL" alt="Description">
   - Example: <img src="https://example.com/photo.jpg" alt="Memory 1">
   - Also update the polaroid-caption text

4. PERSONALIZATION:
   - The name "Mahek" is used throughout the site
   - All text can be edited directly in the HTML file
*/
