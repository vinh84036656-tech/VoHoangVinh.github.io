const aquarium = document.getElementById("aquarium");
const sceneBtn = document.getElementById("sceneBtn");
const pauseBtn = document.getElementById("pauseBtn");
const musicBtn = document.getElementById("musicBtn");

let scene = 1;
sceneBtn.addEventListener("click", () => {
  scene = scene % 3 + 1;
  aquarium.classList.remove("scene-one", "scene-two", "scene-three");
  aquarium.classList.add(`scene-${["one", "two", "three"][scene - 1]}`);
});

let paused = false;
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  aquarium.classList.toggle("paused", paused);
  pauseBtn.textContent = paused ? "▶ Tiếp tục" : "⏸ Tạm dừng";
});

// Tạo một giai điệu đơn giản bằng Web Audio, không cần tải tệp nhạc.
let audioContext = null;
let musicTimer = null;
let noteIndex = 0;
const notes = [392, 494, 587, 494, 440, 523, 659, 523];

function playNote() {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = notes[noteIndex % notes.length];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.45);
  noteIndex++;
}

musicBtn.addEventListener("click", async () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
    musicBtn.textContent = "♫ Bật nhạc";
  } else {
    await audioContext.resume();
    playNote();
    musicTimer = setInterval(playNote, 480);
    musicBtn.textContent = "♫ Tắt nhạc";
  }
});
