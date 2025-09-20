const folderPicker = document.getElementById('folderPicker');
const songListEl = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');
const searchInput = document.getElementById('search');

const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');

let songs = [];
let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;

// Load songs from folder
folderPicker.addEventListener('change', (event) => {
    songs = Array.from(event.target.files)
                 .filter(file => file.name.endsWith('.mp3'))
                 .map(file => ({ file, name: file.name.replace('.mp3','') }));
    renderSongList();
});

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
    audioPlayer.src = URL.createObjectURL(songs[index].file);
    audioPlayer.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';
    highlightActiveSong();
}

// Highlight the currently playing song
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
