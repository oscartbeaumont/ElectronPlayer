const { Menu, shell } = require('electron');
const prompt = require('electron-prompt');
const path = require('path');
const fs = require('fs');

module.exports = (store, services, mainWindow, app, defaultUserAgent) => {
  var servicesMenuItems = [];
  var defaultServiceMenuItems = [];

  if (services !== undefined) {
    services.forEach(service => {
      // add service to the default service selection menu items array
      defaultServiceMenuItems.push({
        label: service.name,
        type: 'checkbox',
        click(e) {
          e.menu.items.forEach(e => {
            if (!(e.label === service.name)) e.checked = false;
          });
          store.set('options.defaultService', service.name);
        },
        checked: store.get('options.defaultService')
          ? store.get('options.defaultService') == service.name
          : false
      });

      // skip if service is hidden
      if (service.hidden) {
        return;
      }

      // add service to the menu items array
      servicesMenuItems.push({
        label: service.name,
        click() {
          console.log('Changing URL To: ' + service.url);
          mainWindow.loadURL(service.url);
          mainWindow.send('run-loader', service);
        }
      });
    });
  }

  return Menu.buildFromTemplate([
    {
      label: 'ElectronPlayer',
      submenu: [
        { label: 'ElectronPlayer (' + app.getVersion() + ')', enabled: false },
        { label: 'Created By Oscar Beaumont', enabled: false },
        {
          label: 'Quit ElectronPlayer',
          accelerator: 'Command+Q', // TODO: Non Mac Shortcut
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Services',
      submenu: [
        {
          label: 'Menu',
          accelerator: 'CmdOrCtrl+H',
          click() {
            console.log('Change To The Menu');
            mainWindow.webContents.userAgent = defaultUserAgent;
            mainWindow.loadFile('src/ui/index.html');
            
          }
        },
        {
          label: 'Custom Url',
          accelerator: 'CmdOrCtrl+O',
          click() {
            prompt({
              title: 'Open Custom URL',
              label: 'URL:',
              inputAttrs: {
                  type: 'url',
                  placeholder: 'http://example.org'
              },
              alwaysOnTop: true
          })
          .then(inputtedURL => {
            if (inputtedURL != null) {
              if(inputtedURL == '') {
                inputtedURL = 'http://example.org';
              }

              console.log('Opening Custom URL: ' + inputtedURL);
              mainWindow.loadURL(inputtedURL);
            }
          })
          .catch(console.error);
          }
        }
      ].concat(servicesMenuItems)
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Always On Top',
          type: 'checkbox',
          click(e) {
            store.set('options.alwaysOnTop', e.checked);
            mainWindow.setAlwaysOnTop(e.checked);
          },
          checked: store.get('options.alwaysOnTop')
        },
        {
          label: 'Frameless Window *',
          type: 'checkbox',
          click(e) {
            store.set('options.hideWindowFrame', e.checked);
            app.emit('relaunch');
          },
          checked: store.get('options.hideWindowFrame')
            ? store.get('options.hideWindowFrame')
            : false
        },
        {
          label: 'Remember Window Details',
          type: 'checkbox',
          click(e) {
            if (store.get('options.windowDetails')) {
              store.delete('options.windowDetails');
            } else {
              store.set('options.windowDetails', {});
            }
          },
          checked: !!store.get('options.windowDetails')
        },
        {
          label: 'Picture In Picture (Mac Only) *',
          type: 'checkbox',
          click(e) {
            store.set('options.pictureInPicture', e.checked);
            app.emit('relaunch');
          },
          checked: store.get('options.pictureInPicture')
            ? store.get('options.pictureInPicture')
            : false,
          visible: process.platform === 'darwin'
        },
        {
          label: 'Adblock *',
          type: 'checkbox',
          click(e) {
            store.set('options.adblock', e.checked);

            // Store details to remeber when relaunched
            if (mainWindow.getURL() != '') {
              store.set('relaunch.toPage', mainWindow.getURL());
            }
            store.set('relaunch.windowDetails', {
              position: mainWindow.getPosition(),
              size: mainWindow.getSize()
            });

            // Restart the app
            app.relaunch();
            app.quit();
          },
          checked: store.get('options.adblock')
            ? store.get('options.adblock')
            : false
        },
        {
          label: 'Start in Fullscreen',
          type: 'checkbox',
          click(e) {
            store.set('options.launchFullscreen', e.checked);
          },
          checked: store.get('options.launchFullscreen')
            ? store.get('options.launchFullscreen')
            : false
        },
        {
          label: 'Default Service',
          submenu: [
            {
              label: 'Menu',
              type: 'checkbox',
              click(e) {
                e.menu.items.forEach(e => {
                  if (!(e.label === 'Menu')) e.checked = false;
                });
                store.delete('options.defaultService');
              },
              checked: store.get('options.defaultService') === undefined
            },
            {
              label: 'Last Opened Page',
              type: 'checkbox',
              click(e) {
                e.menu.items.forEach(e => {
                  if (!(e.label === 'Last Opened Page')) e.checked = false;
                });
                store.set('options.defaultService', 'lastOpenedPage');
              },
              checked: store.get('options.defaultService') === 'lastOpenedPage'
            }
          ].concat(defaultServiceMenuItems)
        },
        {
          label: 'Edit Config',
          click() {
            store.openInEditor();
          }
        },
        {
          label: 'Reset all settings *',
          click() {
            // Reset Config
            store.clear();

            // Clear Engine Cache
            let engineCachePath = path.join(
              app.getPath('userData'),
              'adblock-engine-cache.txt'
            );
            fs.unlinkSync(engineCachePath);

            // Restart the app
            app.relaunch();
            app.quit();
          }
        },
        { label: '* Means App Will Restart', enabled: false }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'Developer',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator:
            process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'More Information',
          click() {
            shell.openExternal(
              'http://github.com/oscartbeaumont/ElectronPlayer'
            );
          }
        }
      ]
    }
  ]);
};
