const { ipcRenderer } = require('electron');

//Select directory button
var selectDirectoryButton = document.getElementById('directoryButton');
//Selected directory display element
var selectedDirectoryDiv = document.getElementById('selectedDirectory');
//Set dir to ''
let destinationDownloadFolder = '';
//Download button
const downloadButton = document.getElementById('downloadButton');

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