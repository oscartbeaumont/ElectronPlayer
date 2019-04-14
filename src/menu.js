const { Menu, shell } = require("electron");
const path = require("path");

module.exports = (store, mainWindow, app, loaderScript) => {
  var servicesMenuItems = [];
  var defaultServiceMenuItems = [];
  var services = store.get("services");

  for (var i = 0; i < services.length; i++) {
    let service = services[i];
    servicesMenuItems.push({
      label: service.name,
      click() {
        console.log("Changing URL To: " + service.url);
        mainWindow.webContents.executeJavaScript(loaderScript, () => {
          mainWindow.webContents.loadURL(service.url);
        });
      }
    });
    defaultServiceMenuItems.push({
      label: service.name,
      type: "checkbox",
      click(e) {
        e.menu.items.forEach(e => {
          e.label == service.name ? null : (e.checked = false);
        });
        store.set("defaultService", service);
      },
      checked: store.get("defaultService")
        ? store.get("defaultService").name == service.name
        : false
    });
  }

  return Menu.buildFromTemplate([
    {
      label: "ElectronPlayer",
      submenu: [
        { label: "ElectronPlayer (" + app.getVersion() + ")", enabled: false },
        { label: "Created By Oscar Beaumont", enabled: false },
        {
          label: "Quit ElectronPlayer",
          accelerator: "Command+Q", // TODO: Non Mac Shortcut
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Services",
      submenu: [
        {
          label: "Menu",
          accelerator: "CmdOrCtrl+H",
          click() {
            console.log("Change To The Menu");
            mainWindow.webContents.executeJavaScript(loaderScript, () => {
              mainWindow.loadFile("src/ui/index.html");
            });
          }
        }
      ].concat(servicesMenuItems)
    },
    {
      label: "Settings",
      submenu: [
        {
          label: "Always On Top",
          type: "checkbox",
          click(e) {
            store.set("alwaysOnTop", e.checked);
            mainWindow.setAlwaysOnTop(e.checked);
          },
          checked: store.get("alwaysOnTop")
        },
        {
          label: "Frameless Window *",
          type: "checkbox",
          click(e) {
            store.set("hideWindowFrame", e.checked);
            relaunch(store, mainWindow, app);
          },
          checked: store.get("hideWindowFrame")
            ? store.get("hideWindowFrame")
            : false
        },
        {
          label: "Remember Window Details",
          type: "checkbox",
          click(e) {
            if (store.get("windowDetails")) {
              store.delete("windowDetails");
            } else {
              store.set("windowDetails", {});
            }
          },
          checked: store.get("windowDetails") ? true : false
        },
        {
          label: "Picture In Picture (Mac Only) *",
          type: "checkbox",
          click(e) {
            store.set("pictureInPicture", e.checked);
            relaunch(store, mainWindow, app);
          },
          checked: store.get("pictureInPicture")
            ? store.get("pictureInPicture")
            : false,
          visible: process.platform === "darwin"
        },
        {
          label: "Default Service",
          submenu: [
            {
              label: "Menu",
              type: "checkbox",
              click(e) {
                e.menu.items.forEach(e => {
                  e.label == "Menu" ? null : (e.checked = false);
                });
                store.delete("defaultService");
              },
              checked: store.get("defaultService") === undefined
            },
            {
              label: "Last Opened Page",
              type: "checkbox",
              click(e) {
                e.menu.items.forEach(e => {
                  e.label == "Last Opened Page" ? null : (e.checked = false);
                });
                store.set("defaultService", "lastOpenedPage");
              },
              checked: store.get("defaultService") === "lastOpenedPage"
            }
          ].concat(defaultServiceMenuItems)
        },
        {
          label: "Edit Config",
          click() {
            shell.openItem(path.join(app.getPath("userData"), "config.json"));
          }
        },
        {
          label: "Reset all settings *",
          click() {
            store.clear();
            relaunch(store, mainWindow, app);
          }
        },
        { label: "* Means App Will Restart", enabled: false }
      ]
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: "Toggle Developer Tools",
          accelerator:
            process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          click(item, focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
        {
          type: "separator"
        },
        {
          role: "resetzoom"
        },
        {
          role: "zoomin"
        },
        {
          role: "zoomout"
        },
        {
          type: "separator"
        },
        {
          role: "togglefullscreen"
        }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "More Information",
          click() {
            require("electron").shell.openExternal(
              "http://github.com/oscartbeaumont/ElectronPlayer"
            );
          }
        }
      ]
    }
  ]);
};

function relaunch(store, mainWindow, app) {
  store.set("relaunchToPage", mainWindow.webContents.getURL());
  app.relaunch();
  app.exit();
}
