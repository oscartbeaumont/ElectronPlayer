// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs'),
  path = require('path'),
  widevine = require('electron-widevinecdm'),
  Store = require('electron-store');

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
    frame: store.get('options.pictureInPicture')
      ? false
      : !store.get('options.hideWindowFrame'),
    alwaysOnTop: store.get('options.alwaysOnTop'),
    toolbar: false,
    backgroundColor: '#00000000'
  });

  // Reset The Windows Size and Location
  let windowDetails = store.get('options.windowDetails');
  if (windowDetails) {
    let size = windowDetails.size;
    let position = windowDetails.position;

    mainWindow.setSize(size[0], size[1]);
    mainWindow.setPosition(position[0], position[1]);
  }

  // Configire Picture In Picture
  if (store.get('options.pictureInPicture') && process.platform === 'darwin') {
    app.dock.hide();
    mainWindow.setAlwaysOnTop(true, 'floating');
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setFullScreenable(false);
    app.dock.show();
  }

  // Load The Services From The Configuration (And Set The Default If Not Already Set)
  if (!store.get('services')) {
    store.set('version', app.getVersion());
    store.set('services', require('./default-services'));
    console.log('Initialised Services In The Config!');
  }

  // This provides a method for updating the configuration over time
  if (store.get('version') != app.getVersion()) {
    let options = {
      type: 'question',
      buttons: ['Yes', 'Defer'],
      defaultId: 0,
      title: 'Reset your ElectronPlayer configuration?',
      message:
        'Do you want to reset your ElectronPlayer config due to a breaking change in the latest update?',
      detail:
        'If you customized your config or options, these will be lost. Defering WILL cause CRASHING and BUGS but can be used to backup your config before resetting it using the options menu.',
      checkboxChecked: true
    };

    const response = dialog.showMessageBox(null, options);

    if (response == 0) {
      store.clear();
      app.relaunch();
      app.exit();
      console.log('Reset Configuration and Restarting Electron');
      return;
    } else {
      console.log(
        'All Hell is breaking loose! You should backup your config and reset it as fast as possible!'
      );
    }
  }
  global.services = store.get('services');

  // Create The Menubar
  Menu.setApplicationMenu(menu(store, mainWindow, app));

  // Load the UI or the Default Service
  let defaultService = store.get('options.defaultService'),
    lastOpenedPage = store.get('options.lastOpenedPage'),
    relaunchToPage = store.get('options.relaunchToPage');

  if (relaunchToPage !== undefined) {
    console.log('Relaunching Page ' + relaunchToPage);
    mainWindow.loadURL(relaunchToPage);
    store.delete('options.relaunchToPage');
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
    if (store.get('options.defaultService') == 'lastOpenedPage') {
      store.set('options.lastOpenedPage', mainWindow.webContents.getURL());
    }
    if (store.get('options.windowDetails')) {
      store.set('options.windowDetails', {
        position: mainWindow.getPosition(),
        size: mainWindow.getSize()
      });
    }
  });

  // Inject Header Script On Page Load If In Frameless Window
  mainWindow.webContents.on('dom-ready', () => {
    if (
      store.get('options.pictureInPicture') ||
      store.get('options.hideWindowFrame')
    ) {
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
ipcMain.on('open-url', (e, service) => {
  console.log('Changing URL To: ' + service.url);
  mainWindow.webContents.loadURL(service.url);
});

// Disable fullscreen when button pressed
ipcMain.on('exit-fullscreen', e => {
  if (store.get('options.pictureInPicture')) {
    store.delete('options.pictureInPicture');
  } else if (store.get('options.hideWindowFrame')) {
    store.delete('options.hideWindowFrame');
  }

  // Relaunch
  store.set('options.relaunchToPage', mainWindow.webContents.getURL());
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
