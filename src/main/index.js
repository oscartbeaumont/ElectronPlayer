'use strict';

import {app, BrowserWindow, Menu, MenuItem} from 'electron'
import widevine from 'electron-widevinecdm';
import settings from 'electron-settings';

import {
    SETTING_CONTROLS,
    SETTING_NO_CONTROLS,
    SETTING_FLOAT,
    SETTING_CURRENT_URL,
} from './constants';

import templateBuilder from './menu-item-template';

//Load Widevine
widevine.load(app);

// The Main Window
let mainWindow;

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

    const template = templateBuilder(window);

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    window.loadURL(settings.get(SETTING_CURRENT_URL, "https://netflix.com/browse"));

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('did-finish-load', function () {

        // This bit here is a bit of a hack to ensure we'll always be able to move the page even if the native website doesn't wan't us to.
        // language=JavaScript
        window.webContents.executeJavaScript(`
            const CONTAINER_ID = '__electron-controller__custom-thing';
            const findElement = () => {
                let element = document.getElementById(CONTAINER_ID);
                if (element === null) {
                    return null;
                }
                return element;
            };
            let thingToLoop = () => {
                let element = findElement();

                if (element === null) {
                    let container = document.createElement('div');
                    container.id = CONTAINER_ID;
                    document.body.prepend(container);
                    element = findElement();
                }

                element.style = 'position:fixed; top:0; left:0; right: 0; height: 2rem; z-index:99999999;-webkit-app-region: drag;cursor: -webkit-grab;'
            };
            // Initial run to trigger everything
            thingToLoop();
            setInterval(thingToLoop, 5000)
        `);
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
        app.exit(0);
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
