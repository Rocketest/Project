let keySequence = '';
let isRecording = false;

// Restore sequence and status from extension storage on load
chrome.storage.local.get(['keySequence', 'isRecording'], (data) => {
  if (data.keySequence !== undefined) keySequence = data.keySequence;
  if (data.isRecording !== undefined) isRecording = data.isRecording;
  console.log(`[Logger Initialized] Recording: ${isRecording}, Current Length: ${keySequence.length}`);
});

window.addEventListener('keydown', (e) => {
  // Alt+R: Toggle recording status
  if (e.altKey && e.code === 'KeyR') {
    isRecording = !isRecording;
    chrome.storage.local.set({ isRecording });
    console.log(`Recording status: ${isRecording}`);
    return;
  }

  // Alt+C: Manually clear sequence buffer
  if (e.altKey && e.code === 'KeyC') {
    keySequence = '';
    chrome.storage.local.set({ keySequence: '' });
    console.log('Logged key sequence cleared.');
    return;
  }
  
  // Alt+S: Download recorded session file
  if (e.altKey && e.code === 'KeyS') {
    downloadDataset();
    return;
  }

  if (isRecording && !e.repeat) {
    let charToAdd = '';
    if (e.code === 'Space') {
      charToAdd = ' ';
    } else if (e.key.length === 1) {
      charToAdd = e.key;
    }

    if (charToAdd) {
      keySequence += charToAdd;
      chrome.storage.local.set({ keySequence });
    }
  }
});

function downloadDataset() {
  chrome.storage.local.get(['keySequence'], (data) => {
    const textToSave = data.keySequence || keySequence;
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
