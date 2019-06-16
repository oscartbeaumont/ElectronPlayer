const fs = require('fs');
const path = require('path');

const { WIDEVINECDM_VERSION } = require('./constants');
const asarUnpackedPath = path.join(
  process.resourcesPath,
  'app.asar.unpacked',
  'node_modules',
  'electron-widevinecdm',
  'widevine'
);

const normalPath = path.join(__dirname, '..', 'widevine');

// load adds the Widevine plugin to the Electron app
module.exports.load = app => {
  if (fs.existsSync(asarUnpackedPath)) {
    app.commandLine.appendSwitch('widevine-cdm-path', asarUnpackedPath);
  } else {
    app.commandLine.appendSwitch('widevine-cdm-path', normalPath);
  }

  app.commandLine.appendSwitch('widevine-cdm-version', WIDEVINECDM_VERSION);
};
