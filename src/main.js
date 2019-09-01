// Modules to control application life and create native browser window
const fs = require('fs'),
  path = require('path'),
  { app, BrowserWindow, session, Menu, ipcMain } = require('electron'),
  Store = require('electron-store'),
  {
    ElectronBlocker,
    fullLists,
    Request
  } = require('@cliqz/adblocker-electron'),
  fetch = require('node-fetch');

const headerScript = fs.readFileSync(
  path.join(__dirname, 'client-header.js'),
  'utf8'
);

// Create Global Varibles
let mainWindow; // Global Windows Object
const menu = require('./menu');
const store = new Store();

//Load Widevine Only On Mac - Castlab Electron is used for all other platforms
if (process.platform == 'darwin') {
  require('electron-widevinecdm').load(app);
}

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 890,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: false, // Must be disabled for preload script. I am not aware of a workaround but this *shouldn't* effect security
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

  // Connect Adblocker To Window if Enabled
  if (store.get('options.adblock')) {
    const engine = await ElectronBlocker.fromLists(fetch, fullLists);
    engine.enableBlockingInSession(session.defaultSession);
  }

  // Reset The Windows Size and Location
  let windowDetails = store.get('options.windowDetails');
  let relaunchWindowDetails = store.get('relaunch.windowDetails');
  if (relaunchWindowDetails) {
    mainWindow.setSize(
      relaunchWindowDetails.size[0],
      relaunchWindowDetails.size[1]
    );
    mainWindow.setPosition(
      relaunchWindowDetails.position[0],
      relaunchWindowDetails.position[1]
    );
    store.delete('relaunch.windowDetails');
  } else if (windowDetails) {
    mainWindow.setSize(windowDetails.size[0], windowDetails.size[1]);
    mainWindow.setPosition(
      windowDetails.position[0],
      windowDetails.position[1]
    );
  }

  // Configire Picture In Picture
  if (store.get('options.pictureInPicture') && process.platform === 'darwin') {
    app.dock.hide();
    mainWindow.setAlwaysOnTop(true, 'floating');
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setFullScreenable(false);
    app.dock.show();
  }

  // Detect and update version
  if (!store.get('version')) {
    store.set('version', app.getVersion());
    store.set('services', []);
    console.log('Initialised Config!');
  }

  // Load the services and merge the users and default services
  let userServices = store.get('services') || [];
  global.services = userServices;

  require('./default-services').forEach(dservice => {
    let service = userServices.find(service => service.name == dservice.name);
    if (service) {
      global.services[userServices.indexOf(service)] = {
        name: service.name ? service.name : dservice.name,
        logo: service.logo ? service.logo : dservice.logo,
        url: service.url ? service.url : dservice.url,
        color: service.color ? service.color : dservice.color,
        style: service.style ? service.style : dservice.style,
        permissions: service.permissions
          ? service.permissions
          : dservice.permissions,
        hidden: service.hidden ? service.hidden : dservice.hidden
      };
    } else {
      global.services.push(dservice);
    }
  });

  // Create The Menubar
  Menu.setApplicationMenu(menu(store, global.services, mainWindow, app));

  // Load the UI or the Default Service
  let defaultService = store.get('options.defaultService'),
    lastOpenedPage = store.get('options.lastOpenedPage'),
    relaunchToPage = store.get('relaunch.toPage');

  if (relaunchToPage !== undefined) {
    console.log('Relaunching Page ' + relaunchToPage);
    mainWindow.loadURL(relaunchToPage);
    store.delete('relaunch.toPage');
  } else if (defaultService == 'lastOpenedPage' && lastOpenedPage) {
    console.log('Loading The Last Opened Page ' + lastOpenedPage);
    mainWindow.loadURL(lastOpenedPage);
  } else if (defaultService != undefined) {
    defaultService = global.services.find(
      service => service.name == defaultService
    );
    if (defaultService.url) {
      console.log('Loading The Default Service ' + defaultService.url);
      mainWindow.loadURL(defaultService.url);
    } else {
      console.log(
        "Error Default Service Doesn't Have A URL Set. Falling back to the menu."
      );
      mainWindow.loadFile('src/ui/index.html');
    }
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
      if (mainWindow) {
        store.set('options.windowDetails', {
          position: mainWindow.getPosition(),
          size: mainWindow.getSize()
        });
      } else {
        console.error(
          'Error window was not defined while trying to save windowDetails'
        );
        return;
      }
    }
  });

  // Inject Header Script On Page Load If In Frameless Window
  mainWindow.webContents.on('dom-ready', broswerWindowDomReady);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Emitted when website requests permissions - Electron default allows any permission this restricts websites
  mainWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      let websiteOrigin = new URL(webContents.getURL()).origin;
      let service = global.services.find(
        service => new URL(service.url).origin == websiteOrigin
      );

      if (
        service &&
        service.permissions &&
        service.permissions.includes(permission)
      ) {
        console.log(
          `Allowed Requested Browser Permission '${permission}' For Site '${websiteOrigin}'`
        );
        return callback(true);
      }

      console.log(
        `Rejected Requested Browser Permission '${permission}' For Site '${websiteOrigin}'`
      );
      return callback(false);
    }
  );
}

// This method is called when the broswer window's dom is ready
// it is used to inject the header if pictureInPicture mode and
// hideWindowFrame are enabled.
function broswerWindowDomReady() {
  if (
    store.get('options.pictureInPicture') ||
    store.get('options.hideWindowFrame')
  ) {
    // TODO: This is a temp fix and a propper fix should be developed
    if (mainWindow != null) {
      mainWindow.webContents.executeJavaScript(headerScript);
    }
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// The timeout fixes the trasparent background on Linux ???? why
app.on('ready', () => setTimeout(createWindow, 500));

// This is a custom event that is used to relaunch the application.
// It destroys and recreates the broswer window. This is used to apply
// settings that Electron doesn't allow to be changed on an active
// broswer window.
app.on('relaunch', () => {
  console.log('Relaunching The Application!');

  // Store details to remeber when relaunched
  if (mainWindow.webContents.getURL() != '') {
    store.set('relaunch.toPage', mainWindow.webContents.getURL());
  }
  store.set('relaunch.windowDetails', {
    position: mainWindow.getPosition(),
    size: mainWindow.getSize()
  });

  // Destory The BroswerWindow
  mainWindow.webContents.removeListener('dom-ready', broswerWindowDomReady);
  mainWindow.close();
  mainWindow = undefined;

  // Create a New BroswerWindow
  createWindow();
});

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
  app.emit('relaunch');
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

/* Restrict Electrons APIs In Renderer Process For Security */

function rejectEvent(event) {
  event.preventDefault();
}

const allowedGlobals = new Set(['services']);
app.on('remote-get-global', (event, webContents, globalName) => {
  if (!allowedGlobals.has(globalName)) {
    event.preventDefault();
  }
});
app.on('remote-require', rejectEvent);
app.on('remote-get-builtin', rejectEvent);
app.on('remote-get-current-window', rejectEvent);
app.on('remote-get-current-web-contents', rejectEvent);
app.on('remote-get-guest-web-contents', rejectEvent);
