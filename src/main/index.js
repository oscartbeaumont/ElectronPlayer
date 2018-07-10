'use strict'

import { app, BrowserWindow } from 'electron'
import widevine from 'electron-widevinecdm';
import * as path from 'path'
import { format as formatUrl } from 'url'

//Load Widevine
widevine.load(app);

// The Main Window
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
        plugins: true,
        sandbox: true,
        nodeIntegration: false,
      }
    });

    window.loadURL("https://netflix.com/browse");
    window.setMenu(null);

    window.on('closed', () => {
      mainWindow = null;
    });

  if (process.env.NODE_ENV !== 'production') {
    window.webContents.openDevTools();
  }

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
