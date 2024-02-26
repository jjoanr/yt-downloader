document.addEventListener('DOMContentLoaded', (event) => {
  const { ipcRenderer, shell } = require('electron');
  const ytdl = require('ytdl-core');
  const fs = require('fs');
  const path = require('path');

  //URL field
  var urlInput = document.querySelector('.url-form');

  //Error message
  var errorMessage = document.getElementById('error');
  errorMessage.innerText = '';

  //radio inputs
  var radioInputs = document.querySelectorAll('.radio-inputs input');

  //Select directory button
  var selectDirectoryButton = document.getElementById('directoryButton');
  //Selected directory display element
  var selectedDirectoryDiv = document.getElementById('selectedDirectory');
  //Set dir to ''
  let destinationDownloadFolder = '';

  //Download button
  const downloadButton = document.getElementById('downloadButton');

  // Event listener for the download button
  downloadButton.onclick = function () {
    var url = urlInput.value;
    var format = 'mp4'; // default to video

    // Check which radio button is selected
    radioInputs.forEach(input => {
      if (input.checked && input.nextElementSibling.innerText === 'Audio (mp3)') {
        format = 'mp3';
      }
    });

    if (url !== '' && destinationDownloadFolder !== '') {
      var timestamp = new Date().getTime();
      var filename = 'download_' + timestamp + '.' + format;
      var output = path.resolve(destinationDownloadFolder, filename);

      var video = ytdl(url, { 
        quality: 'highest', 
        filter: format => format.container === 'mp4' && format.hasAudio === true && format.hasVideo === true 
      });

      video.pipe(fs.createWriteStream(output));

      video.on('end', function() {
        console.log('Download completed!');
        ipcRenderer.send('download-complete');
      });
    } else {
      errorMessage.innerText = 'Please enter a valid URL and select a download directory';
    }
  };

  //Event listener for the select directory button, opens a directory selector.
  selectDirectoryButton.onclick = function () {
    console.log('Selecting directory');
    ipcRenderer.send('open-file-dialog');
  }

  ipcRenderer.on('selected-directory', (event, path) => {
    destinationDownloadFolder = path;
    selectedDirectoryDiv.innerText = path;
    console.log('Selected directory', path);
  });
});