const { Menu, shell } = require('electron');
const path = require('path');

module.exports = (store, mainWindow, app) => {
  var servicesMenuItems = [];
  var defaultServiceMenuItems = [];
  var services = store.get('services');

  if (services !== undefined) {
    for (var i = 0; i < services.length; i++) {
      let service = services[i];
      servicesMenuItems.push({
        label: service.name,
        click() {
          console.log('Changing URL To: ' + service.url);
          mainWindow.webContents.loadURL(service.url);
          mainWindow.webContents.send('run-loader', service);
        }
      });
      defaultServiceMenuItems.push({
        label: service.name,
        type: 'checkbox',
        click(e) {
          e.menu.items.forEach(e => {
            if (e.label === service.name) e.checked = false;
          });
          store.set('options.defaultService', service);
        },
        checked: store.get('options.defaultService')
          ? store.get('options.defaultService').name === service.name
          : false
      });
    }
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
            mainWindow.loadFile('src/ui/index.html');
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
            relaunch(store, mainWindow, app);
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
            relaunch(store, mainWindow, app);
          },
          checked: store.get('options.pictureInPicture')
            ? store.get('options.pictureInPicture')
            : false,
          visible: process.platform === 'darwin'
        },
        {
          label: 'Default Service',
          submenu: [
            {
              label: 'Menu',
              type: 'checkbox',
              click(e) {
                e.menu.items.forEach(e => {
                  if (e.label === 'Menu') e.checked = false;
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
                  if (e.label === 'Last Opened Page') e.checked = false;
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
            shell.openItem(path.join(app.getPath('userData'), 'config.json'));
          }
        },
        {
          label: 'Reset all settings *',
          click() {
            store.clear();
            relaunch(store, mainWindow, app);
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
            require('electron').shell.openExternal(
              'http://github.com/oscartbeaumont/ElectronPlayer'
            );
          }
        }
      ]
    }
  ]);
};

function relaunch(store, mainWindow, app) {
  store.set('options.relaunchToPage', mainWindow.webContents.getURL());
  app.relaunch();
  app.exit();
}
