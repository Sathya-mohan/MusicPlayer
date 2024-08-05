const play = document.querySelector(".play"),
    previous = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    trackImage = document.querySelector(".track-image"),
    title = document.querySelector(".title"),
    artist = document.querySelector(".artist"),
    trackCurrentTime = document.querySelector(".current-time"),
    trackDuration = document.querySelector(".duration-time"),
    slider = document.querySelector(".duration-slider"),
    showVolume = document.querySelector("#show-volume"),
    volumeIcon = document.querySelector("#volume-icon"),
    currentVolume = document.querySelector("#volume"),
    autoPlayBtn = document.querySelector(".play-all"),
    hamBurger = document.querySelector(".fa-bars"),
    closeIcon = document.querySelector(".fa-times"),
    musicPlaylist = document.querySelector(".music-playlist"),
    pDiv = document.querySelector(".playlist-div");

let timer;
let autoplay = 0;
let indexTrack = 0;
let songIsPlaying = false;
let track = document.createElement("audio");
let trackList = [
    {
        name: "--Friendship Anthem--",
        path: "https://s23.aconvert.com/convert/p3r68-cdx67/efz0d-j7jyv.mp3",
        img: "https://s4.aconvert.com/convert/p3r68-cdx67/a32bl-a2hzf.jpg",
        singer: "Aniruth",
    },
    {
        name: "--Taxi Taxi--",
        path: "https://s21.aconvert.com/convert/p3r68-cdx67/7cfql-7u6f1.mp3",
        img: "https://s4.aconvert.com/convert/p3r68-cdx67/aojjx-6tdd4.jpg",
        singer: "Benny dayal",
    },
    {
        name: "--Yen Enral--",
        path: "https://s21.aconvert.com/convert/p3r68-cdx67/jpfzk-mt03m.mp3",
        img: "https://s4.aconvert.com/convert/p3r68-cdx67/a4fi7-a4ccc.jpg",
        singer: "Tippu",
    },
    {
        name: "--Nanbiye Nanbiye--",
        path: "https://s23.aconvert.com/convert/p3r68-cdx67/q6twz-ajmg3.mp3",
        img: "https://s4.aconvert.com/convert/p3r68-cdx67/a21ke-mr99v.jpg",
        singer: "D Imman",
    },
    {
        name: "--Gala Gala--",
        path: "https://s23.aconvert.com/convert/p3r68-cdx67/v2a3j-4svpz.mp3",
        img: "https://s4.aconvert.com/convert/p3r68-cdx67/a9sfs-tboow.jpg",
        singer: "Hariharan",
    }
];

play.addEventListener("click", justPlay);
next.addEventListener("click", nextSong);
previous.addEventListener("click", prevSong);
autoPlayBtn.addEventListener("click", autoPlayToggle);
volumeIcon.addEventListener("click", muteSound);
currentVolume.addEventListener("change", changeVolume);
slider.addEventListener("change", changeDuration);
track.addEventListener("timeupdate", songTimeUpdate);
hamBurger.addEventListener("click", showPlayList);
closeIcon.addEventListener("click", hidePlayList);

function loadTrack(indexTrack) {
    clearInterval(timer);
    resetSlider();

    track.src = trackList[indexTrack].path;
    trackImage.src = trackList[indexTrack].img;
    title.innerHTML = trackList[indexTrack].name;
    artist.innerHTML = trackList[indexTrack].singer;
    track.load();

    timer = setInterval(updateSlider, 1000);
}

loadTrack(indexTrack);

function justPlay() {
    if (!songIsPlaying) {
        playSong();
    } else {
        pauseSong();
    }
}

function playSong() {
    track.play();
    songIsPlaying = true;
    play.innerHTML = '<i class="fa fa-pause"></i>';
}

function pauseSong() {
    track.pause();
    songIsPlaying = false;
    play.innerHTML = '<i class="fa fa-play"></i>';
}

function nextSong() {
    if (indexTrack < trackList.length - 1) {
        indexTrack++;
    } else {
        indexTrack = 0;
    }
    loadTrack(indexTrack);
    playSong();
}

function prevSong() {
    if (indexTrack > 0) {
        indexTrack--;
    } else {
        indexTrack = trackList.length - 1;
    }
    loadTrack(indexTrack);
    playSong();
}

function muteSound() {
    track.volume = 0;
    showVolume.innerHTML = 0;
    currentVolume.value = 0;
}

function changeVolume() {
    showVolume.innerHTML = currentVolume.value;
    track.volume = currentVolume.value / 100;
}

function changeDuration() {
    let sliderPosition = track.duration * (slider.value / 100);
    track.currentTime = sliderPosition;
}

function autoPlayToggle() {
    if (autoplay === 0) {
        autoplay = 1;
        autoPlayBtn.style.background = "#db6400";
    } else {
        autoplay = 0;
        autoPlayBtn.style.background = "#ccc";
    }
}

function resetSlider() {
    slider.value = 0;
}

function updateSlider() {
    let position = 0;

    if (!isNaN(track.duration)) {
        position = track.currentTime * (100 / track.duration);
        slider.value = position;
    }

    if (track.ended) {
        play.innerHTML = '<i class="fa fa-play"></i>';
        if (autoplay === 1) {
            nextSong();
        }
    }
}

function songTimeUpdate() {
    if (track.duration) {
        let curmins = Math.floor(track.currentTime / 60);
        let cursecs = Math.floor(track.currentTime % 60);
        let durmins = Math.floor(track.duration / 60);
        let dursecs = Math.floor(track.duration % 60);

        if (dursecs < 10) dursecs = "0" + dursecs;
        if (durmins < 10) durmins = "0" + durmins;
        if (curmins < 10) curmins = "0" + curmins;
        if (cursecs < 10) cursecs = "0" + cursecs;

        trackCurrentTime.innerHTML = `${curmins}:${cursecs}`;
        trackDuration.innerHTML = `${durmins}:${dursecs}`;
    } else {
        trackCurrentTime.innerHTML = "00:00";
        trackDuration.innerHTML = "00:00";
    }
}

function showPlayList() {
    musicPlaylist.style.transform = "translateX(0)";
}

function hidePlayList() {
    musicPlaylist.style.transform = "translateX(-100%)";
}

let counter = 1;

function displayTracks() {
    trackList.forEach(track => {
        let div = document.createElement("div");
        div.classList.add("playlist");
        div.innerHTML = `
            <span class="song-index">${counter++}</span>
            <p class="single-song">${track.name}</p>
        `;
        pDiv.appendChild(div);
    });
    playFromPlaylist();
}

displayTracks();

function playFromPlaylist() {
    pDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("single-song")) {
            const indexNum = trackList.findIndex(track => track.name === e.target.innerHTML);
            loadTrack(indexNum);
            playSong();
            hidePlayList();
        }
    });
}
