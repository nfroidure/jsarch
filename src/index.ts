/* Architecture Note #2: CLI

The JSArch CLI tool basically wraps the jsArch service
to make it usable from the CLI.

To see its options, run:
```
jsarch -h
```
*/
import { Knifecycle, constant } from 'knifecycle';
import initDebug from 'debug';
import initParser from './services/parser.js';
import { EOL } from 'node:os';
import { env, exit, stdout, cwd } from 'node:process';
import initProgramOptions, {
  ProgramOptionsService,
} from './services/programOptions.js';
import { initProjectDir } from 'application-services';
import initJSArch from './services/jsarch.js';
import initConfig from './services/CONFIG.js';
import initFS from './services/fs.js';
import initGlob from './services/glob.js';
import { type JSArchService } from './services/jsarch.js';
import initPackageJSON from './services/packageJSON.js';
import { initLog, initImporter } from 'common-services';

export default async function runJSArch() {
  try {
    const $ = await prepareJSArch();
    const { ENV, jsArch, programOptions } = await $.run<{
      ENV: typeof env;
      jsArch: JSArchService;
      programOptions: ProgramOptionsService;
    }>(['ENV', 'jsArch', 'programOptions']);

    if (ENV.MERMAID_RUN) {
      const JSARCH_REG_EXP = /^jsArch$/;
      const CONFIG_REG_EXP = /^([A-Z0-9_]+)$/;
      const MERMAID_GRAPH_CONFIG = {
        classes: {
          jsarch: 'fill:#e7cdd2,stroke:#ebd4cb,stroke-width:1px,color:#000;',
          config: 'fill:#d4cdcc,stroke:#ebd4cb,stroke-width:1px,color:#000;',
          others: 'fill:#ebd4cb,stroke:#000,stroke-width:1px,color:#000;',
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
      stdout.write($.toMermaidGraph(MERMAID_GRAPH_CONFIG));
      exit(0);
    }
    const content = await jsArch({
      patterns: programOptions.args,
      cwd: cwd(),
      base: programOptions.base,
    });
    stdout.write(content);
  } catch (err) {
    console.error(err);
    exit(1);
  }
}

async function prepareJSArch($ = new Knifecycle()) {
  $.register(constant('EOL', EOL));
  $.register(constant('ENV', env));
  $.register(initProgramOptions);
  $.register(initParser);
  $.register(initPackageJSON);
  $.register(initProjectDir);
  $.register(initImporter);
  $.register(initConfig);
  $.register(initGlob);
  $.register(initFS);
  $.register(initLog);
  $.register(initJSArch);
  $.register(
    constant('logger', {
      output: console.info.bind(console),
      error: console.error.bind(console),
      debug: initDebug('jsarch'),
    }),
  );

  return $;
}
