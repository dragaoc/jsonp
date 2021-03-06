// hook for mocha to allow assets to be imported, as an approximation of raw-loader
// https://dev.to/valeriavg/how-to-use-custom-files-as-modules-in-nodejs-51lp

import Module from 'module';
import fs from 'fs';

const resolveTextFile = function (module, path) {
  const content = fs.readFileSync(path).toString();
  module.exports = content;
};

Module._extensions['.html'] = resolveTextFile;
Module._extensions['.css'] = resolveTextFile;
Module._extensions['.svg'] = resolveTextFile;
