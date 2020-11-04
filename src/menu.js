const { Menu, shell } = require('electron');
const prompt = require('electron-prompt');
const path = require('path');
const fs = require('fs');

module.exports = (store, services, mainWindow, app, defaultUserAgent) => {
  var servicesMenuItems = [];
  var defaultServiceMenuItems = [];
  var enabledServicesMenuItems = [];

  if (services !== undefined) {
    // Menu with all services that can be clicked for easy switching
    servicesMenuItems = services.map(service => ({
      label: service.name,
      visible: !service.hidden,
      click() {
        console.log('Changing URL To: ' + service.url);
        mainWindow.loadURL(service.url);
        mainWindow.send('run-loader', service);
      }
    }));

    // Menu for selecting default service (one which is opened on starting the app)
    defaultServiceMenuItems = services.map(service => ({
      label: service.name,
      type: 'checkbox',
      checked: store.get('options.defaultService')
          ? store.get('options.defaultService') == service.name
          : false,
      click(e) {
        e.menu.items.forEach(e => {
          if (!(e.label === service.name)) e.checked = false;
        });
        store.set('options.defaultService', service.name);
      }
    }));

    // Menu with all services that can be clicked for easy switching
    enabledServicesMenuItems = services.map(service => ({
      label: service.name,
      type: 'checkbox',
      checked: !service.hidden,
      click() {
        if(service._defaultService) {
          let currServices = store.get('services');
          currServices.push({
            name: service.name,
            hidden: !service.hidden
          });
          services = currServices;
          store.set('services', currServices);
        } else {
          let currServices = store.get('services');
          let currService = currServices.find(s => service.name == s.name);
          currService.hidden = service.hidden ? undefined : true
          services = currServices;
          store.set('services', currServices);
        }
      }
    }));
  }

  var actualLanguage = store.get('language') ? store.get('language') : "0";
  var languages = [
    {name: "English", position: "0", baseProperties: {
      firstMenu: {
        created: "Created By Oscar Beaumont",
        quit: "Quit ElectronPlayer",
        translated: "Translated (ptBr) by ToMattBan",
      },
      servicesMenu: {
        services: "Services",
        menu: "Menu",
        customUrl: "Custom Url",
      },
      settingsMenu: {
        settings: "Settings",
        alwaysTop: "Always On Top",
        framWindow: "Frameless Window *",
        remWindowDetail: "Remember Window Details",
        pip: "Picture In Picture (Mac Only) *",
        lang: "Laguage *",
        adblock: "Adblock *",
        fullscreen: "Start in Fullscreen",
        enServices: "Enabled Services",
        defServices: "Default Service",
        menu: "Menu",
        lastOpen: "Last Opened Page",
        editConfig: "Edit Config",
        resetAll: "Reset all settings *",
        restartApp: "* Means App Will Restart",
      },
      editMenu: {
        edit: "Edit",
        undo: "",
        redo: "",
        cur: "",
        copy: "",
        parte: "",
        pasteStyle: "",
        del: "",
        selAll: "",
      },
      devMenu: {
        dev: "Developer",
        reload: "Reload",
        devTools: "Toggle Developer Tools",
        resZoom: "",
        zoomIn: "",
        zoomOut: "",
        fullScreen: "",
      },
      helpMenu: {
        help: "Help",
        moreInfo: "More Information",
      }
    }}, 
    {name: "Português Brasil", position: "1", baseProperties: {
      firstMenu: {
        created: "Criado por Oscar Beaumont",
        quit: "Fechar ElectronPlayer",
        translated: "Traduzido (ptBr) por ToMattBan",
      },
      servicesMenu: {
        services: "Serviços",
        menu: "Menu",
        customUrl: "Url Personalizada",
      },
      settingsMenu: {
        settings: "Configurações",
        alwaysTop: "Sempre no Topo",
        framWindow: "Janela sem borda *",
        remWindowDetail: "Lembrar Detalhes da Janela",
        pip: "Picture In Picture (Apenas Mac) *",
        lang: "Idioma *",
        adblock: "Adblock *",
        fullscreen: "Iniciar em Tela Cheia",
        enServices: "Serviços Habilitados",
        defServices: "Serviço Padrão",
        menu: "Menu",
        lastOpen: "Última Página Aberta",
        editConfig: "Editar Configurações",
        resetAll: "Redefinir Todas as Configurações *",
        restartApp: "* Significa que o App Reiniciará",
      },
      editMenu: {
        edit: "Editar",
        undo: "",
        redo: "",
        cur: "",
        copy: "",
        parte: "",
        pasteStyle: "",
        del: "",
        selAll: "",
      },
      devMenu: {
        dev: "Developer",
        reload: "Reload",
        devTools: "Toggle Developer Tools",
        resZoom: "",
        zoomIn: "",
        zoomOut: "",
        fullScreen: "",
      },
      helpMenu: {
        help: "Ajuda",
        moreInfo: "Mais Informações",
      }
    }}
  ];
  var languagesChoice = [];

  languagesChoice = languages.map(language => ({
    label: language.name,
    type: 'radio',
    checked: language.position == actualLanguage ? true : false,
    click() {
      store.set('language', language.position);
      app.relaunch();
      app.exit();
    }
  }));

  return Menu.buildFromTemplate([
    {
      label: 'ElectronPlayer',
      submenu: [
        { label: 'ElectronPlayer (' + app.getVersion() + ')', enabled: false },
        { label: languages[actualLanguage].baseProperties.firstMenu.created, enabled: false },
        { label: languages[actualLanguage].baseProperties.firstMenu.translated, enabled: false },
        {
          label: languages[actualLanguage].baseProperties.firstMenu.quit,
          accelerator: 'Command+Q', // TODO: Non Mac Shortcut
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: languages[actualLanguage].baseProperties.servicesMenu.services,
      submenu: [
        {
          label: languages[actualLanguage].baseProperties.servicesMenu.menu,
          accelerator: 'CmdOrCtrl+H',
          click() {
            console.log('Change To The Menu');
            mainWindow.webContents.userAgent = defaultUserAgent;
            mainWindow.loadFile('src/ui/index.html');
          }
        },
        {
          label: languages[actualLanguage].baseProperties.servicesMenu.customUrl,
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
      label: languages[actualLanguage].baseProperties.settingsMenu.settings,
      submenu: [
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.alwaysTop,
          type: 'checkbox',
          click(e) {
            store.set('options.alwaysOnTop', e.checked);
            mainWindow.setAlwaysOnTop(e.checked);
          },
          checked: store.get('options.alwaysOnTop')
        },
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.framWindow,
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
          label: languages[actualLanguage].baseProperties.settingsMenu.remWindowDetail,
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
          label: languages[actualLanguage].baseProperties.settingsMenu.pip,
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
          label: languages[actualLanguage].baseProperties.settingsMenu.lang,
          submenu: languagesChoice
        },
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.adblock,
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
          label: languages[actualLanguage].baseProperties.settingsMenu.fullscreen,
          type: 'checkbox',
          click(e) {
            store.set('options.launchFullscreen', e.checked);
          },
          checked: store.get('options.launchFullscreen')
            ? store.get('options.launchFullscreen')
            : false
        },
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.enServices,
          submenu: enabledServicesMenuItems
        },
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.defServices,
          submenu: [
            {
              label: languages[actualLanguage].baseProperties.settingsMenu.menu,
              type: 'checkbox',
              click(e) {
                e.menu.items.forEach(e => {
                  if (!(e.label === languages[actualLanguage].baseProperties.settingsMenu.menu)) e.checked = false;
                });
                store.delete('options.defaultService');
              },
              checked: store.get('options.defaultService') === undefined
            },
            {
              label: languages[actualLanguage].baseProperties.settingsMenu.lastOpen,
              type: 'checkbox',
              click(e) {
                e.menu.items.forEach(e => {
                  if (!(e.label === languages[actualLanguage].baseProperties.settingsMenu.lastOpen)) e.checked = false;
                });
                store.set('options.defaultService', 'lastOpenedPage');
              },
              checked: store.get('options.defaultService') === 'lastOpenedPage'
            },
            { type: 'separator' }
          ].concat(defaultServiceMenuItems)
        },
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.editConfig,
          click() {
            store.openInEditor();
          }
        },
        {
          label: languages[actualLanguage].baseProperties.settingsMenu.resetAll,
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
        { label: languages[actualLanguage].baseProperties.settingsMenu.restartApp, enabled: false }
      ]
    },
    {
      label: languages[actualLanguage].baseProperties.editMenu.edit,
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
      label: languages[actualLanguage].baseProperties.devMenu.dev,
      submenu: [
        {
          label: languages[actualLanguage].baseProperties.devMenu.reload,
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: languages[actualLanguage].baseProperties.devMenu.devTools,
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
      label: languages[actualLanguage].baseProperties.helpMenu.help,
      submenu: [
        {
          label: languages[actualLanguage].baseProperties.helpMenu.moreInfo,
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
