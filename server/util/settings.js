const os = require('os');
const path = require('path');

const settings = require('settings-store');
const config = require('config');

const storage = config.get('storage');
const settingsFile = config.get('settingsFile');

// The `settings-store` package seems to have issues with Mocha (or maybe
// Mockgoose), so here we have some wrapper functions that use the package
// when while running in prod or dev, and mock it during tests.
const testSettings = [];

const rootDir = config.util.getEnv('NODE_ENV') !== 'test'
  ? path.join(os.homedir(), storage.root)
  : path.join(os.tmpdir(), storage.root);

const load = () => {
  if (config.util.getEnv('NODE_ENV') !== 'test') {
    settings.init({
      electronApp: false,
      filename: path.join(rootDir, settingsFile),
    });

    // TODO: Check to make sure we have ownership/access for this directory
    // TODO: Make sure inputDir is Valid.
    if (!settings.value('inputDir')) {
      settings.setValue('inputDir', path.join(rootDir, storage.inputs));
    }
    if (!settings.value('cores')) {
      settings.setValue('cores', os.cpus().length);
    }
  } else {
    testSettings.cores = os.cpus().length;
    testSettings.inputDir = path.join(rootDir, storage.inputs);
  }
};

const value = key => (config.util.getEnv('NODE_ENV') !== 'test'
  ? settings.value(key)
  : testSettings[key]);

const setValue = (key, newValue) => {
  if (config.util.getEnv('NODE_ENV') !== 'test') {
    settings.setValue(key, newValue);
  } else {
    testSettings[key] = newValue;
  }
};

module.exports = {
  rootDir,
  load,
  value,
  setValue,
};
