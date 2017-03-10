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
.then(({ log, jsArch }) => {
  if(process.env.MERMAID_RUN) {
    const JSARCH_REG_EXP = /^jsArch$/;
    const CONFIG_REG_EXP = /^([A-Z0-9_]+)$/;
    const MERMAID_GRAPH_CONFIG = {
      classes: {
        jsarch: 'fill:#e7cdd2,stroke:#ebd4cb,stroke-width:1px;',
        config: 'fill:#d4cdcc,stroke:#ebd4cb,stroke-width:1px;',
        others: 'fill:#ebd4cb,stroke:#000,stroke-width:1px;',
      },
      styles: [{
        pattern: JSARCH_REG_EXP,
        className: 'jsarch',
      }, {
        pattern: CONFIG_REG_EXP,
        className: 'config',
      }, {
        pattern: /^(.+)$/,
        className: 'others',
      }],
      shapes: [{
        pattern: JSARCH_REG_EXP,
        template: '$0(($0))',
      }, {
        pattern: CONFIG_REG_EXP,
        template: '$0{$0}',
      }],
    };
    process.stdout.write($.toMermaidGraph(MERMAID_GRAPH_CONFIG));
    process.exit(0);
  }
  return jsArch({ patterns: program.args, cwd: process.cwd(), base: program.base })
  .then((content) => {
    process.stdout.write(content);
  });
})
.catch((err) => {
  console.error(err); // eslint-disable-line
  process.exit(1);
});
