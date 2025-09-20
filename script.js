const songListEl = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');
const searchInput = document.getElementById('search');
const currentSongEl = document.getElementById('current-song');

const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');

const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// List your songs (file names in /songs folder)
const songs = [
    { name: "For A Reason", file: "songs/for_a_reason_karan_aujla.mp3" },
    { name: "MF GABHRU", file: "songs/mf_gabhru_karan_aujla.mp3" },
    { name: "SOFTLY", file: "songs/softly_karan_aujla.mp3" }
];

let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;

// Render song list
function renderSongList(filter = '') {
    songListEl.innerHTML = '';
    songs.forEach((song, index) => {
        if (!song.name.toLowerCase().includes(filter.toLowerCase())) return;
        const li = document.createElement('li');
        li.textContent = song.name;
        li.addEventListener('click', () => playSong(index));
        if (index === currentIndex) li.classList.add('active');
        songListEl.appendChild(li);
    });
}

// Play a song
function playSong(index) {
    currentIndex = index;
    audioPlayer.src = songs[index].file;
    audioPlayer.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';
    currentSongEl.textContent = songs[index].name;
    highlightActiveSong();
}

// Highlight active song
function highlightActiveSong() {
    [...songListEl.children].forEach((li, idx) => {
        li.classList.toggle('active', idx === currentIndex);
    });
}

// Play / Pause
playBtn.addEventListener('click', () => {
    if (!audioPlayer.src) return;
    if (isPlaying) {
        audioPlayer.pause();
        playBtn.textContent = '▶️';
    } else {
        audioPlayer.play();
        playBtn.textContent = '⏸️';
    }
    isPlaying = !isPlaying;
});

// Next / Previous
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

function nextSong() {
    if (shuffle) {
        currentIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    playSong(currentIndex);
}

function prevSong() {
    if (shuffle) {
        currentIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    playSong(currentIndex);
}

// Shuffle & Repeat
shuffleBtn.addEventListener('click', () => shuffle = !shuffle);
repeatBtn.addEventListener('click', () => repeat = !repeat);

// Auto play next
audioPlayer.addEventListener('ended', () => {
    if (repeat) {
        playSong(currentIndex);
    } else {
        nextSong();
    }
});

// Search songs
searchInput.addEventListener('input', () => renderSongList(searchInput.value));

// Progress bar updates
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
});

// Seek functionality
progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    }
});

// Helper: format seconds to mm:ss
function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Initial render
renderSongList();
