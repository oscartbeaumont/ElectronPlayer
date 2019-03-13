import fs from 'fs';
import {
    USER_CONFIG_DIRECTORY_PATH,
    USER_CONFIG_FILE_PATH
} from './constants';

if (!fs.existsSync(USER_CONFIG_FILE_PATH)) {
    try {
        fs.mkdirSync(USER_CONFIG_DIRECTORY_PATH);
    } catch (e) {
        // This would be what happens when the file already exists... We don't care...
    }

    fs.writeFileSync(USER_CONFIG_FILE_PATH, fs.readFileSync(__dirname + '/default-config.js', 'UTF-8'));
}
export default () => eval(fs.readFileSync(USER_CONFIG_FILE_PATH, 'UTF-8'));