// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs'),
  path = require('path'),
  widevine = require('electron-widevinecdm'),
  Store = require('electron-store');

// Static Varibles
const loaderScript = fs.readFileSync(
  path.join(__dirname, 'client-loader.js'),
  'utf8'
);
const headerScript = fs.readFileSync(
  path.join(__dirname, 'client-header.js'),
  'utf8'
);

// Create Global Varibles
let mainWindow; // Global Windows Object
const menu = require('./menu');
const store = new Store();
global.services = [];

//Load Widevine
widevine.load(app);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      plugins: true,
      preload: path.join(__dirname, 'client-preload.js')
    },

    // Window Styling
    transparent: true,
    vibrancy: 'ultra-dark',
    frame: store.get('pictureInPicture')
      ? false
      : !store.get('hideWindowFrame'),
    alwaysOnTop: store.get('alwaysOnTop'),
    toolbar: false,
    backgroundColor: '#00000000'
  });

  // Reset The Windows Size and Location
  let windowDetails = store.get('windowDetails');
  if (windowDetails) {
    let size = windowDetails.size;
    let position = windowDetails.position;

    mainWindow.setSize(size[0], size[1]);
    mainWindow.setPosition(position[0], position[1]);
  }

  // Configire Picture In Picture
  if (store.get('pictureInPicture') && process.platform === 'darwin') {
    app.dock.hide();
    mainWindow.setAlwaysOnTop(true, 'floating');
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setFullScreenable(false);
    app.dock.show();
  }

  // Load The Services From The Configuration (And Set The Default If Not Already Set)
  if (!store.get('services')) {
    store.set('services', require('./default-services'));
    console.log('Initialised Services In The Config!');
  }
  global.services = store.get('services');

  // Create The Menubar
  Menu.setApplicationMenu(menu(store, mainWindow, app, loaderScript));

  // Load the UI or the Default Service
  let defaultService = store.get('defaultService'),
    lastOpenedPage = store.get('lastOpenedPage'),
    relaunchToPage = store.get('relaunchToPage');

  if (relaunchToPage != undefined) {
    console.log('Relaunching Page ' + relaunchToPage);
    mainWindow.loadURL(relaunchToPage);
    store.delete('relaunchToPage');
  } else if (defaultService == 'lastOpenedPage' && lastOpenedPage) {
    console.log('Loading The Last Opened Page ' + lastOpenedPage);
    mainWindow.loadURL(lastOpenedPage);
  } else if (defaultService != undefined) {
    console.log('Loading The Default Service ' + defaultService.url);
    mainWindow.loadURL(defaultService.url);
  } else {
    console.log('Loading The Main Menu');
    mainWindow.loadFile('src/ui/index.html');
  }

  // Emitted when the window is closing
  mainWindow.on('close', e => {
    if (store.get('defaultService') == 'lastOpenedPage') {
      store.set('lastOpenedPage', mainWindow.webContents.getURL());
    }
    if (store.get('windowDetails')) {
      store.set('windowDetails', {
        position: mainWindow.getPosition(),
        size: mainWindow.getSize()
      });
    }
  });

  // Inject Header Script On Page Load If In Frameless Window
  mainWindow.webContents.on('dom-ready', () => {
    if (store.get('pictureInPicture') || store.get('hideWindowFrame')) {
      mainWindow.webContents.executeJavaScript(headerScript);
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// The timeout fixes the trasparent background on Linux ???? why
app.on('ready', () => setTimeout(createWindow, 500));

// Chnage the windows url when told to by the ui
ipcMain.on('open-url', (e, url) => {
  console.log('Changing URL To: ' + url);
  mainWindow.webContents.executeJavaScript(loaderScript, () => {
    mainWindow.webContents.loadURL(url);
  });
});

// Disable fullscreen when button pressed
ipcMain.on('exit-fullscreen', e => {
  if (store.get('pictureInPicture')) {
    store.delete('pictureInPicture');
  } else if (store.get('hideWindowFrame')) {
    store.delete('hideWindowFrame');
  }

  // Relaunch
  store.set('relaunchToPage', mainWindow.webContents.getURL());
  app.relaunch();
  app.exit();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
