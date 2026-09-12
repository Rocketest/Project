let keySequence = '';
let isRecording = true;

window.addEventListener('keydown', (e) => {
  // Alt+R toggles recording on/off
  if (e.altKey && e.code === 'KeyR') {
    isRecording = !isRecording;
    console.log(`Recording status: ${isRecording}`);
    return;
  }
  
  // Alt+S downloads the recorded session file
  if (e.altKey && e.code === 'KeyS') {
    downloadDataset();
    return;
  }

  if (isRecording && !e.repeat) {
    // Map Space to a literal space character
    if (e.code === 'Space') {
      keySequence += ' ';
    } 
    // Capture standard single-character keypresses
    else if (e.key.length === 1) {
      keySequence += e.key;
    }
  }
});

function downloadDataset() {
  const blob = new Blob([keySequence], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `log.txt`;
  a.click();
  URL.revokeObjectURL(url);
}