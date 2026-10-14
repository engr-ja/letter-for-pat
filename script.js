// PERSONALIZE THESE SETTINGS
const CONFIG = {
  recipient: "Hi Pat na Maligalig,",
  signature: "Jade",
  songTitle: "Moreeee memorriesssss"
};

const cover = document.getElementById("cover");
const letterScreen = document.getElementById("letterScreen");
const endingScreen = document.getElementById("endingScreen");
const openButton = document.getElementById("openButton");
const playButton = document.getElementById("playButton");
const readAgain = document.getElementById("readAgain");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const musicStatus = document.getElementById("musicStatus");

document.getElementById("salutation").textContent = CONFIG.recipient;
document.getElementById("signature").textContent = CONFIG.signature;
document.getElementById("songTitle").textContent = CONFIG.songTitle;

function showScreen(screen) {
  [cover, letterScreen, endingScreen].forEach(item => item.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

openButton.addEventListener("click", async () => {
  showScreen(letterScreen);
  // Browsers allow playback more reliably after the recipient taps the envelope.
  try {
    await audio.play();
    updatePlayButton(true);
  } catch (error) {
    musicStatus.textContent = "Tap play to start your song";
    updatePlayButton(false);
  }
});

function updatePlayButton(playing) {
  playButton.textContent = playing ? "Ⅱ" : "▶";
  playButton.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  if (playing) musicStatus.textContent = "Samaaaaa mo kooooo ahhh!";
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      updatePlayButton(true);
    } catch (error) {
      musicStatus.textContent = "Couldn't play the song. Check the MP3 file.";
    }
  } else {
    audio.pause();
    updatePlayButton(false);
    musicStatus.textContent = "Paused";
  }
});

audio.addEventListener("play", () => updatePlayButton(true));
audio.addEventListener("pause", () => updatePlayButton(false));
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});
audio.addEventListener("ended", () => {
  updatePlayButton(false);
  musicStatus.textContent = "A song to go with these words";
});
audio.addEventListener("error", () => {
  musicStatus.textContent = "Add your-song.mp3 to the website folder";
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// Optional: after the reader scrolls to the bottom, they can use this closing message.
// You can add a "Continue" button later if you want a more guided experience.
readAgain.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  showScreen(cover);
});
