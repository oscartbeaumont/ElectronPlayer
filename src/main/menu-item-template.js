import {app, MenuItem} from "electron";
import settings from "electron-settings";
import userConfig from './load-user-config';

import {SETTING_CONTROLS, SETTING_NO_CONTROLS, SETTING_FLOAT, SETTING_CURRENT_URL, USER_CONFIG_FILE_PATH} from './constants';
import {shell} from 'electron';

const config = userConfig();

export default (window) => {
    const restartApp = () => {
        app.relaunch();
        app.exit(0);
    };

    const ToggleFloat = new MenuItem({
        label: 'Float above everything',
        type: 'checkbox',
        click() {
            settings.set(SETTING_FLOAT, !settings.get(SETTING_FLOAT, true));
            window.setAlwaysOnTop(settings.get(SETTING_FLOAT, true));
            ToggleFloat.checked = settings.get(SETTING_FLOAT, true)
        },
        checked: settings.get(SETTING_FLOAT, true)
    });

    const ToggleTitleMenu = new MenuItem({
        label: 'Show window title bar',
        type: 'checkbox',
        click() {
            settings.set(SETTING_CONTROLS, !settings.get(SETTING_CONTROLS, true));
            settings.set(SETTING_NO_CONTROLS, false);
            ToggleTitleMenu.checked = settings.get(SETTING_CONTROLS, true);
            restartApp();
        },
        checked: settings.get(SETTING_CONTROLS, true)
    });

    const ToggleNoTitleMenu = new MenuItem({
        label: 'Show no window controls',
        type: 'checkbox',
        click() {
            settings.set(SETTING_NO_CONTROLS, !settings.get(SETTING_NO_CONTROLS, false));
            settings.set(SETTING_CONTROLS, false);
            ToggleNoTitleMenu.checked = !settings.get(SETTING_NO_CONTROLS, false);
            restartApp();
        },
        checked: settings.get(SETTING_NO_CONTROLS, false)
    });

    const WebsiteChangeMenu = new MenuItem({
        label: 'Visit website',
        type: 'submenu',
        submenu: config.map(item => new MenuItem({
            label: item.label,
            click() {
                settings.set(SETTING_CURRENT_URL, item.url);
                window.loadURL(settings.get(SETTING_CURRENT_URL))
            }
        })),
    });

    const OpenWebsiteConfig = new MenuItem({
        label: 'Open website config',
        type: 'normal',
        click() {
            shell.openItem(USER_CONFIG_FILE_PATH);
        }
    });

    const customMenuItemsUnderWindow = [
        ToggleFloat,
        ToggleTitleMenu,
        ToggleNoTitleMenu,
        WebsiteChangeMenu,
        OpenWebsiteConfig
    ];

    return [
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                },
                {
                    role: 'forcereload'
                },
                {
                    role: 'toggledevtools'
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
                },
                {
                    role: 'quit'
                },
            ]
        },

        {
            label: 'Edit',
            submenu: [
                {
                    role: 'selectAll'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
            ]
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                },
            ].concat(customMenuItemsUnderWindow)
        }
    ];
};