const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
var nodeConsole = require('console');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const ipcRenderer = require('electron').ipcRenderer;

var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const webvtt = require('node-webvtt-youtube');

let destDownloadFolder = app.getPath("videos");
var downloadFolderDestElement = document.getElementById("downloadFolderDest");
setDownloadFolderDestElement(destDownloadFolder)

//Set download folder
function setDownloadFolderDestElement(text) {
  downloadFolderDestElement.innerText = text;
}

//Obtain url
function getUrlInput() {
  return urlInputElement.value;

}

//Downlaod video function
function downloadVideo(url) {
  if (url.includes("youtube.com/playlist?")) {
      setStatusElement(downloadingPlaylistMessage, false);

      playlist(url);
  } else {
      // update user GUI on status of download
      // reset captions status
      if (requestedVideo()) {
          setStatusElement(downloadingMessage, false);
          // setup download with youtube-dl
          var video = youtubedl(url,
          // Optional arguments passed to youtube-dl.
          // see here for options https://github.com/rg3/youtube-dl/blob/master/README.md
              ['--format=best'],
          // Additional options can be given for calling `child_process.execFile()`.
              {
              cwd: destDownloadFolder,
              maxBuffer: Infinity
          });

          // listener for video info, to get file name
          video.on('info', function (info) {

              var destFilePathName = path.join(destDownloadFolder, info._filename);

              // update GUI with info on the file being downloaded
              setInfoPanel(`title: ${
                  info.title
              } | filename: ${
                  info._filename
              } | size:${
                  info.size
              } | path:${destFilePathName}`);

              // TODO: sanilitse youtube file name so that it can be
              // save file locally
              var writeStream = fs.createWriteStream(destFilePathName);
              video.pipe(writeStream);
          });


          video.on('end', function () {
              console.info("done downloading video file");
              // TODO: replace with update Div symbol
              setStatusElement(finishedDownloadingMessage, true);
          });
      }
  }
}

//
function openFile(path) { // console.log("inside open file");
  var result = fs.readFileSync(path, 'utf8').toString('utf-8');
  // console.log("open file result", result);
  return result;
}

setDownloadDestBtnElement.onclick = function () {
  const newDir =  ipcRenderer.sendSync('selectDirectory');
  destDownloadFolder = newDir;
  setDownloadFolderDestElement(newDir)
}

try {
  require('electron-reloader')(module)
} catch (_) {}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
  });

  // and load the home.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'home.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  //Close top bar
  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// 

ipcMain.on('selectDirectory', async function(event, arg) {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  if(!result.canceled){
    event.returnValue = result.filePaths[0]
  }

});