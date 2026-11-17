// popup.js
// Author: jazziNardis
/*
░█░█░█░█░█▀▀░█▀█
░█▄█░█▀█░█▀▀░█░█
░▀░▀░▀░▀░▀▀▀░▀░▀
░▀█▀░█░█░█▀▀
░░█░░█▀█░█▀▀
░░▀░░▀░▀░▀▀▀
░▀█▀░█▄█░█▀█░█▀█░█▀▀░▀█▀░█▀▀░█▀▄
░░█░░█░█░█▀▀░█░█░▀▀█░░█░░█▀▀░█▀▄
░▀▀▀░▀░▀░▀░░░▀▀▀░▀▀▀░░▀░░▀▀▀░▀░▀
░▀█▀░█▀▀
░░█░░▀▀█
░▀▀▀░▀▀▀
░█▀▀░█░█░█▀▀
░▀▀█░█░█░▀▀█
░▀▀▀░▀▀▀░▀▀▀
*/
// Dynamic sounds, volume control and sound testing.

const api = globalThis.browser ?? globalThis.chrome;

window.onload = async () => {
  const toggle = document.getElementById('toggle');
  const arrowLeft = document.getElementById('arrow-left');
  const arrowRight = document.getElementById('arrow-right');
  const audioName = document.getElementById('audio-name');
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volume-value');
  const testButton = document.getElementById('test-sound');

  let sounds = [];
  let testAudio = null;

  // "amogus.mp3" -> "amogus"
  const displayName = file => file.replace(/\.[^.]+$/, '');

  try {
    const response = await fetch(api.runtime.getURL('sounds/sounds.json'));
    if (!response.ok) throw new Error('Could not load sounds.json');
    sounds = await response.json();
    if (!Array.isArray(sounds) || sounds.length === 0) throw new Error('No sounds found');
  } catch (error) {
    console.error('Sound loading error:', error);
    sounds = [];
    audioName.textContent = 'No sounds';
  }

  async function getSelectedSound() {
    const { selectedSound } = await api.storage.local.get('selectedSound');
    return selectedSound ?? 0;
  }

  async function updateSoundDisplay() {
    if (sounds.length === 0) return;
    const index = await getSelectedSound();
    const validIndex = ((index % sounds.length) + sounds.length) % sounds.length;
    if (validIndex !== index) {
      await api.storage.local.set({ selectedSound: validIndex });
    }
    audioName.textContent = ' ' + displayName(sounds[validIndex]) + ' ';
  }

  async function changeSound(direction) {
    if (sounds.length === 0) return;
    const current = await getSelectedSound();
    const next = (current + direction + sounds.length) % sounds.length;
    await api.storage.local.set({ selectedSound: next });
    await updateSoundDisplay();
  }

  function renderToggle(state) {
    toggle.textContent = state ? 'On' : 'Off';
    toggle.style.color = state ? 'green' : 'red';
  }

  const { isOn = true } = await api.storage.local.get('isOn');
  renderToggle(isOn);

  toggle.addEventListener('click', async () => {
    const { isOn: current = true } = await api.storage.local.get('isOn');
    const newState = !current;
    await api.storage.local.set({ isOn: newState });
    renderToggle(newState);
  });

  // The arrows are <a href="#">, so prevent the default navigation.
  arrowLeft.addEventListener('click', e => { e.preventDefault(); changeSound(-1); });
  arrowRight.addEventListener('click', e => { e.preventDefault(); changeSound(1); });
  await updateSoundDisplay();

  const { volume: storedVolume = 20 } = await api.storage.local.get('volume');
  volumeSlider.value = storedVolume;
  volumeValue.textContent = storedVolume + '%';

  volumeSlider.addEventListener('input', async () => {
    const volume = Number(volumeSlider.value);
    volumeValue.textContent = volume + '%';
    await api.storage.local.set({ volume });
  });

  testButton.addEventListener('click', async () => {
    if (sounds.length === 0) return;
    const index = await getSelectedSound();
    const { volume = 20 } = await api.storage.local.get('volume');

    if (testAudio) {
      testAudio.pause();
      testAudio.currentTime = 0;
    }
    testAudio = new Audio(api.runtime.getURL('sounds/' + sounds[index]));
    testAudio.volume = volume / 100;
    testAudio.play().catch(error => console.error('Sound playback error:', error));
  });
};
