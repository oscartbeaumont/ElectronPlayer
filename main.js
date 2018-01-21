const {app, BrowserWindow} = require('electron');
const widevine = require('electron-widevinecdm');
const path = require('path');
const url = require('url');

//app.commandLine.appendSwitch('widevine-cdm-path', './widevinecdmadapter.plugin')
//app.commandLine.appendSwitch('widevine-cdm-version', '1.4.8.866')
widevine.load(app);

let win;

//Set App Icon (IN Menu Bar And App Launcher And Auto Add Into System App Launcher

function createWindow () {
  win = new BrowserWindow({
    webPreferences: {
        plugins: true,
        sandbox: true,
        nodeIntegration: false,
      }
    });
  win.loadURL("https://netflix.com/browse");
  win.setMenu(null);
  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
