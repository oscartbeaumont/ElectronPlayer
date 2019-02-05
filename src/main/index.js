'use strict';

import {app, BrowserWindow, Menu, MenuItem} from 'electron'
import widevine from 'electron-widevinecdm';

const settings = require('electron-settings');

//Load Widevine
widevine.load(app);

// The Main Window
let mainWindow;

const SETTING_CONTROLS = 'controls';
const SETTING_NO_CONTROLS = 'no-controls';
const SETTING_FLOAT = 'float';

function createMainWindow() {
  let config = {
    webPreferences: {
      plugins: true,
      sandbox: true,
      nodeIntegration: false,
    },
    alwaysOnTop: settings.get(SETTING_FLOAT, true),
    vibrancy: 'ultra-dark'
  };

  if (settings.get(SETTING_CONTROLS, true)) {
    config.frame = settings.get(SETTING_CONTROLS, true);
  } else if (settings.get(SETTING_NO_CONTROLS, true)) {
    config.frame = false
  } else {
    config.titleBarStyle = 'hiddenInset';
  }

  let window = new BrowserWindow(config);

  const ToggleFloat = new MenuItem({
    label: 'Float above everything',
    type: 'checkbox',
    click() {
      settings.set(SETTING_FLOAT, !settings.get(SETTING_FLOAT, true))
      window.setAlwaysOnTop(settings.get(SETTING_FLOAT, true))
      ToggleFloat.checked = settings.get(SETTING_FLOAT, true)
    },
    checked: settings.get(SETTING_FLOAT, true)
  });

  const ToggleTitleMenu = new MenuItem({
    label: 'Show window title bar',
    type: 'checkbox',
    click() {
      settings.set(SETTING_CONTROLS, !settings.get(SETTING_CONTROLS, true))
      settings.set(SETTING_NO_CONTROLS, false)
      ToggleFloat.checked = settings.get(SETTING_CONTROLS, true)
      mainWindow = null;
      app.quit();
      app.relaunch();
    },
    checked: settings.get(SETTING_CONTROLS, true)
  })

  const ToggleNoTitleMenu = new MenuItem({
    label: 'Show no window controls',
    type: 'checkbox',
    click() {
      settings.set(SETTING_NO_CONTROLS, !settings.get(SETTING_NO_CONTROLS, false))
      settings.set(SETTING_CONTROLS, false)
      ToggleFloat.checked = !settings.get(SETTING_NO_CONTROLS, false)
      mainWindow = null;
      app.quit()
      app.relaunch()
    },
    checked: settings.get(SETTING_NO_CONTROLS, false)
  })

  const template = [
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'},
        {role: 'quit'},
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'},
        ToggleFloat,
        ToggleTitleMenu,
        ToggleNoTitleMenu
      ]
    },
    {
      role: 'help',
      submenu: []
    }
  ];

  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)

  window.loadURL("https://netflix.com/browse");

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('did-finish-load', function () {
    console.log('Loading done')
    window.webContents.insertCSS('body { -webkit-app-region: drag !important; }')
  })

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
