import path from "path";

const HIDDEN_FOLDER_NAME = '.netflix';
const USER_CONFIG_DIRECTORY_PATH = path.join(require('os').homedir(), HIDDEN_FOLDER_NAME);
const USER_CONFIG_FILE_NAME = 'config.js';
const USER_CONFIG_FILE_PATH = path.join(USER_CONFIG_DIRECTORY_PATH, USER_CONFIG_FILE_NAME);
const SETTING_CONTROLS = 'controls';
const SETTING_NO_CONTROLS = 'no-controls';
const SETTING_FLOAT = 'float';
const SETTING_CURRENT_URL = 'current-url';

export {
    SETTING_CONTROLS,
    SETTING_NO_CONTROLS,
    SETTING_FLOAT,
    SETTING_CURRENT_URL,
    HIDDEN_FOLDER_NAME,
    USER_CONFIG_DIRECTORY_PATH,
    USER_CONFIG_FILE_NAME,
    USER_CONFIG_FILE_PATH,
}

