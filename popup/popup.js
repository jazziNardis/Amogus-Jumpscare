// popup.js
// Author: jazziNardis

// This is called only when the DOM is fully loaded, so that the button is
// loaded as well.
// As soon as the popup is opened, the color and the text of the toggle and the
// text of the "Choose another audio" button are changed according to the current
// settings.

window.onload = () => {
  let toggle = document.getElementById('toggle');
  let audioFileBtn = document.getElementById('audio-file');
  let arrowLeft = document.getElementById('arrow-left');
  let arrowRight = document.getElementById('arrow-right');
  const audioNames = [
    'amogus',
    'bad to the bone riff',
    'falling metal pipe'
  ];
  const audioNumber = audioNames.length - 1;

  chrome.storage.local.get('isOn', result => {
    if (result.isOn) {
      toggle.innerHTML = 'On';
      toggle.style.color = 'green';
    } else if (!result.isOn) {
      toggle.innerHTML = 'Off';
      toggle.style.color = 'red';
    }
  })
  chrome.storage.local.get('audioFile', result => {
    document.getElementById('audio-name').innerHTML = audioNames[result.audioFile];
  })

  // Every time the button is pressed, updates the color and the text of the
  // button itself as well as the value of isOn.
  toggle.addEventListener('click', () => {
    chrome.storage.local.get('isOn', result => {
      if (!result.isOn) {
        chrome.storage.local.set({'isOn': true});
        toggle.innerHTML = 'On';
        toggle.style.color = 'green';
      } else if (result.isOn) {
        chrome.storage.local.set({'isOn': false});
        toggle.innerHTML = 'Off';
        toggle.style.color = 'red';
      }
    })
  })

  // Every time one of the two arrows is pressed, updates the text in the middle
  // as well as the value of audioFile
  arrowLeft.addEventListener('click', () => {
    chrome.storage.local.get('audioFile', result => {
      if (result.audioFile == 0) {
        chrome.storage.local.set({'audioFile': audioNumber});
      } else {
        chrome.storage.local.set({'audioFile': result.audioFile - 1});
      }
      chrome.storage.local.get('audioFile', result => {
        document.getElementById('audio-name').innerHTML = audioNames[result.audioFile];
      })
    })
  })
  arrowRight.addEventListener('click', () => {
    chrome.storage.local.get('audioFile', result => {
      if (result.audioFile == audioNumber) {
        chrome.storage.local.set({'audioFile': 0});
      } else {
        chrome.storage.local.set({'audioFile': result.audioFile + 1});
      }
      chrome.storage.local.get('audioFile', result => {
        document.getElementById('audio-name').innerHTML = audioNames[result.audioFile];
      })
    })
  })
}
