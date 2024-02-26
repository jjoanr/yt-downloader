const { app, BrowserWindow, ipcMain, dialog } = require('electron');

try {
  require('electron-reloader')(module)
} catch (_) {}

const createWindow = () => {
  win = new BrowserWindow({
    width: 640,
    height: 440,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })
  //Debug
  //win.webContents.openDevTools()
  win.loadFile('index.html')

  //Close top bar
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      event.sender.send('selected-directory', result.filePaths[0]);
    }
  }).catch(err => {
    console.log('Error selecting directory', err);
  });
});


ipcMain.on('download-complete', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  dialog.showMessageBox(window, {
    type: 'info',
    buttons: ['Close'],
    message: 'Download completed!'
  }).then(result => {
    if (result.response === 1) {
      shell.openPath(destinationDownloadFolder);
    }
  });
});
