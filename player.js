// player.js
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
// Start of the code.


// Initializing the audio files, one of them will be played later.
var audioFiles = [
  chrome.runtime.getURL('/files/amogus.mp3'),
  chrome.runtime.getURL('/files/bad-to-the-bone-riff.mp3'),
  chrome.runtime.getURL('/files/falling-metal-pipe.mp3')
]

// Waits until a message is received from background.js
// in order to play the sound effect and does so only if isOn is true.
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.amogus) {
      chrome.storage.local.get('isOn', result => {
        if (result.isOn) {
          chrome.storage.local.get('audioFile', outcome => {
              new Audio(audioFiles[outcome.audioFile]).play().catch(error = {});
          });
        }
      })
    }
    sendResponse();
  }
);

// Periodically sends a message to background.js to avoid turning it inactive.
const wakeUp = () => setTimeout(
  () => {
    // This avoids "Extension context invalidated" error.
    if (chrome.runtime.id == undefined) {
      return;
    }
    chrome.runtime.sendMessage('ping');
    wakeUp();
  }, 1000);
wakeUp();
