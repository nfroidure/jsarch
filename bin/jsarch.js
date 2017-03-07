#! /usr/bin/env node

/* Architecture Note #2: CLI

The JSArch CLI tool basically wraps the jsArch service
to make it usable from the CLI.

To see its options, run:
```
jsarch -h
```
*/

'use strict';

const Knifecycle = require('knifecycle').default;
const debug = require('debug')('jsarch');
const fs = require('fs');
const os = require('os');
const path = require('path');
const glob = require('glob');
const program = require('commander');
const Promise = require('bluebird');

const initJSArch = require('../src/jsarch');
const packageConf = require(path.join(__dirname, '..', 'package.json'));

const $ = new Knifecycle();

$.constant('fs', Promise.promisifyAll(fs));
$.constant('EOL', os.EOL);
$.constant('glob', Promise.promisify(glob));
$.constant('log', (type, ...args) => {
  if('debug' === type || 'stack' === type) {
    debug(...args);
    return;
  }
  console[type](...args); // eslint-disable-line
});
initJSArch($);

program
  .version(packageConf.version)
  .option('-b, --base', 'Base for links')
  .parse(process.argv);

$.run([
  'log', 'jsArch',
])
.then(({ log, jsArch }) =>
  jsArch({ patterns: program.args, cwd: process.cwd(), base: program.base })
  .then((content) => {
    process.stdout.write(content);
  })
)
.catch((err) => {
  console.error(err); // eslint-disable-line
  process.exit(1);
});
