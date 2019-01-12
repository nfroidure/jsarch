/* Architecture Note #2: CLI

The JSArch CLI tool basically wraps the jsArch service
to make it usable from the CLI.

To see its options, run:
```
jsarch -h
```
*/
import Knifecycle, { constant, autoService } from 'knifecycle';
import initDebug from 'debug';
import fs from 'fs';
import os from 'os';
import path from 'path';
import glob from 'glob';
import program from 'commander';
import Promise from 'bluebird';
import packagerc from 'packagerc';

import initJSArch from './jsarch';

export default async function runJSArch() {
  try {
    const $ = await prepareJSArch();
    const { ENV, jsArch, program } = await $.run(['ENV', 'jsArch', 'program']);

    if (ENV.MERMAID_RUN) {
      const JSARCH_REG_EXP = /^jsArch$/;
      const CONFIG_REG_EXP = /^([A-Z0-9_]+)$/;
      const MERMAID_GRAPH_CONFIG = {
        classes: {
          jsarch: 'fill:#e7cdd2,stroke:#ebd4cb,stroke-width:1px;',
          config: 'fill:#d4cdcc,stroke:#ebd4cb,stroke-width:1px;',
          others: 'fill:#ebd4cb,stroke:#000,stroke-width:1px;',
        },
        styles: [
          {
            pattern: JSARCH_REG_EXP,
            className: 'jsarch',
          },
          {
            pattern: CONFIG_REG_EXP,
            className: 'config',
          },
          {
            pattern: /^(.+)$/,
            className: 'others',
          },
        ],
        shapes: [
          {
            pattern: JSARCH_REG_EXP,
            template: '$0(($0))',
          },
          {
            pattern: CONFIG_REG_EXP,
            template: '$0{$0}',
          },
        ],
      };
      process.stdout.write($.toMermaidGraph(MERMAID_GRAPH_CONFIG));
      process.exit(0);
    }
    const content = await jsArch({
      patterns: program.args,
      cwd: process.cwd(),
      base: program.base,
    });
    process.stdout.write(content);
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    process.exit(1);
  }
}

async function prepareJSArch($ = new Knifecycle()) {
  const debug = initDebug('jsarch');

  $.register(
    autoService(async function initProgram({ packageConf }) {
      return program
        .version(packageConf.version)
        .option('-b, --base [value]', 'Base for links')
        .parse(process.argv);
    }),
  );
  $.register(
    constant(
      'packageConf',
      require(path.join(__dirname, '..', 'package.json')),
    ),
  );
  $.register(constant('fs', Promise.promisifyAll(fs)));
  $.register(constant('EOL', os.EOL));
  $.register(constant('ENV', process.env));
  $.register(
    constant('CONFIG', packagerc('jsarch', { gitProvider: 'github' })),
  );
  $.register(constant('glob', Promise.promisify(glob)));
  $.register(
    constant('log', (type, ...args) => {
      if ('debug' === type || 'stack' === type) {
        debug(...args);
        return;
      }
      console[type](...args); // eslint-disable-line
    }),
  );
  $.register(initJSArch);

  return $;
}
