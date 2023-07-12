let index; //index for songs
let loop = true;

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");
const volume_slider = document.getElementsByClassName("volume_slider");
const volume_progressBar = document.querySelector(".slider progress");

const songsList = [
    {
      name: "Tumhe Kitna Pyaar Karte",
      link: "TumheKitnaPyaarKarteBawaal.mp3",
      artist: "Arijit Singh",
      image: "TumheKitnaPyaarKarteBawaal.jpg",
    },
    {
      name: "Udd Jaa Kaale Kaava",
      link: "UddJaaKaaleKaava.mp3",
      artist: "Udit Narayan, Alka Yagnik",
      image: "UddJaaKaaleKaava.jpg",
    },
    {
      name: "Sun Sajni",
      link: "SunSajni.mp3",
      artist: "Meet Bros, Parampara Tandon, Piyush Mehroliyaa",
      image: "SunSajni.jpg",
    },
    {
      name: "Raatan Lambiyan",
      link: "RaatanLambiyan.mp3",
      artist: "Jubin Nautiyal, Asees Kaur",
      image: "RaatanLambiyan.jpg",
    },
    {
      name: "Kahani Suno 2.0",
      link: "KahaniSuno.mp3",
      artist: "Kaifi Khalil",
      image: "KahaniSuno.jpg",
    },
    {
      name: "Obsessed",
      link: "Obsessed.mp3",
      artist: "Riar Saab",
      image: "Obsessed.jpg",
    },
    {
      name: "Tu Sab Janda Hai",
      link: "TuSabJandaHai.mp3",
      artist: "B Praak",
      image: "TuSabJandaHai.jpg",
    },
  ];

  //events object
  let events = {
    mouse: {
      click: "click",
    },
    touch: {
      click: "touchstart",
    },
  };
  let deviceType = "";
  //Detect touch device
  const isTouchDevice = () => {
    try {
      //We try to create TouchEvent(it would fail for desktops and throw error)
      document.createEvent("TouchEvent");
      deviceType = "touch";
      return true;
    } 
    catch (e) {
      deviceType = "mouse";
      return false;
    }
  };

  //Format time (convert ms to seconds, minutes and add 0 id less than 10)
  const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
  };

  //set song
  const setSong = (arrayIndex) => {
    console.log("Song is set.")
    //this extracts all the variables from the object
    let { name, link, artist, image } = songsList[arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image;
    //display duration when metadata loads
    audio.onloadedmetadata = () => {
      maxDuration.innerText = timeFormatter(audio.duration);
    };
  };
  

  //play song
  const playAudio = () => {
    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
  };

  //pause song
  const pauseAudio = () => {
    audio.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
  };

  //repeat button
  repeatButton.addEventListener("click", () => {
    if (repeatButton.classList.contains("active")) {
      repeatButton.classList.remove("active");
      audio.loop = false;
      console.log("repeat off");
    } else {
      repeatButton.classList.add("active");
      audio.loop = true;
      console.log("repeat on");
    }
  });
  
  //Next song
  const nextSong = () => {
    //if loop is true then continue in normal order
    if (loop) {
      if (index == songsList.length - 1) {
        //If last song is being played
        index = 0;
      } else {
        index += 1;
      }
      setSong(index);
      playAudio();
    } else {
      //else find a random index and play that song
      let randIndex = Math.floor(Math.random() * songsList.length);
      console.log(randIndex);
      setSong(randIndex);
      playAudio();
    }
  };
  
  //previous song ( you can't go back to a randomly played song)
  const previousSong = () => {
    if (index > 0) {
      pauseAudio();
      index -= 1;
    } else {
      //if first song is being played
      index = songsList.length - 1;
    }
    setSong(index);
    playAudio();
  };
  //next song when current song ends
  audio.onended = () => {
    nextSong();
  };

  //Shuffle songs
  shuffleButton.addEventListener("click", () => {
    if (shuffleButton.classList.contains("active")) {
      shuffleButton.classList.remove("active");
      loop = true;
      console.log("shuffle off");
    } else {
      shuffleButton.classList.add("active");
      loop = false;
      console.log("shuffle on");
    }
  });

  //play button
  playButton.addEventListener("click", playAudio);
  //next button
  nextButton.addEventListener("click", nextSong);
  //pause button
  pauseButton.addEventListener("click", pauseAudio);
  //prev button
  prevButton.addEventListener("click", previousSong);

  //if user clicks on progress bar
  isTouchDevice();
  progressBar.addEventListener(events[deviceType].click, (event) => {
    //start of progressBar
    let coordStart = progressBar.getBoundingClientRect().left;
    //mouse click position
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
    //set width to progress
    currentProgress.style.width = progress * 100 + "%";
    //set time
    audio.currentTime = progress * audio.duration;
    //play
    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
  });

  //update progress every second
  setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width =
      (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
  });

  //update time
  audio.addEventListener("timeupdate", () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime);
  });

   //set song from the playlist
   const setSongForPlaylist = (arrayIndex) => {
    console.log("Song is set from playlist.")
    //this extracts all the variables from the object
    let { name, link, artist, image } = songsList[arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image;
    //display duration when metadata loads
    audio.onloadedmetadata = () => {
      maxDuration.innerText = timeFormatter(audio.duration);
    };
    playlistContainer.classList.add("hide");
    document.querySelector(".slider_container").classList.remove("hide");
    playAudio();
  };

  //Creates playlist
  const initializePlaylist = () => {
    for (let i in songsList) {
      playlistSongs.innerHTML += `<li class='playlistSong' onclick='setSongForPlaylist(${i})'>
              <div class="playlist-image-container">
                  <img src="${songsList[i].image}"/>
              </div>
              <div class="playlist-song-details">
                  <span id="playlist-song-name">
                      ${songsList[i].name}
                  </span>
                  <span id="playlist-song-artist-album">
                      ${songsList[i].artist}
                  </span>
              </div>
          </li>`;
    }
  };

  //display playlist
  playlistButton.addEventListener("click", () => {
    playlistContainer.classList.remove("hide");
    document.querySelector(".slider_container").classList.add("hide");
  });
  //hide playlist
  closeButton.addEventListener("click", () => {
    playlistContainer.classList.add("hide");
    document.querySelector(".slider_container").classList.remove("hide");
  });


  function setVolume(event) {
    var vol;
    volume_progressBar.value = event.target.value;
    // Set the volume according to the
    // percentage of the volume slider set
    if(isNaN(event.target.value)){
      console.log("value is not set.");
      vol = 0.1;
    }
    else{
      console.log(event.target.value);
      vol = event.target.value / 100;
    }
    
    audio.volume = parseFloat(vol);

    if(vol == 0){
      document.querySelector(".volume_down").innerHTML = `<i class='fa fa-volume-xmark'></i>`;
    }
    else{
      document.querySelector(".volume_down").innerHTML = `<i class='fa fa-volume-down'></i>`;
    }
  }


  window.onload = () => {
    console.log("Window is Loaded.");
    //initially first song
    index = 0;
    setSong(index);
    //create playlist
    initializePlaylist();
  };