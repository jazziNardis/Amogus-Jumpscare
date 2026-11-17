// background.js
// Author: jazziNardis
/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀
⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀
⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀
⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀
⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀
⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀
⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/

//
// Firefox event page. A random one-shot alarm (30 s to 16 min) wakes the page,
// which plays the selected sound directly (the background page has a DOM, so
// no content script or tab is needed) and schedules the next alarm.

const api = globalThis.browser ?? globalThis.chrome;

const ALARM_NAME = 'playSound';
const MIN_DELAY_MS = 30 * 1000;
const MAX_DELAY_MS = 16 * 60 * 1000;

// Randomly generates an integer between two set numbers.
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function scheduleNext() {
  const delay = random(MIN_DELAY_MS, MAX_DELAY_MS);
  const when = Date.now() + delay;

  api.alarms.create(ALARM_NAME, { when });

  console.log(
    'Next sound scheduled for ' + new Date(when).toLocaleTimeString() +
    ' (in ' + Math.round(delay / 1000) + ' s)'
  );
}

async function ensureAlarm() {
  const existing = await api.alarms.get(ALARM_NAME);
  if (!existing) scheduleNext();
}

// Kept in a variable so the audio is not garbage collected mid-playback.
let currentAudio = null;

async function playSound() {
  const { isOn = true, selectedSound = 0, volume = 20 } =
    await api.storage.local.get(['isOn', 'selectedSound', 'volume']);
  if (!isOn) return;

  let sounds;
  try {
    const response = await fetch(api.runtime.getURL('sounds/sounds.json'));
    sounds = await response.json();
  } catch (error) {
    console.error('Could not load sounds.json:', error);
    return;
  }
  if (!Array.isArray(sounds) || sounds.length === 0) return;

  const file = sounds[selectedSound] ?? sounds[0];

  currentAudio = new Audio(api.runtime.getURL('sounds/' + file));
  currentAudio.volume = Math.min(1, Math.max(0, volume / 100));
  try {
    await currentAudio.play();
    console.log('Playing sound:', file);
  } catch (error) {
    console.error('Could not play sound:', error);
  }
}

// Listeners must be registered synchronously at top level so the event page
// can be woken by them.
api.runtime.onInstalled.addListener(async () => {
  const stored = await api.storage.local.get(['isOn', 'selectedSound', 'volume']);
  const defaults = {};
  if (stored.isOn === undefined) defaults.isOn = true;
  if (stored.selectedSound === undefined) defaults.selectedSound = 0;
  if (stored.volume === undefined) defaults.volume = 20;
  if (Object.keys(defaults).length) await api.storage.local.set(defaults);

  scheduleNext();
});

api.runtime.onStartup.addListener(ensureAlarm);

api.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== ALARM_NAME) return;
  scheduleNext();
  await playSound();
});
