import { service, name, autoInject } from 'knifecycle';
import YError from 'yerror';
import path from 'path';
import { Type, finalize, visit } from 'ast-types';
const { def } = Type;
import { compareNotes } from './compareNotes';

// Temporary fix to make jsarch work
// on codebases parsed with espree
def('ExperimentalSpreadProperty')
  .bases('Node')
  .build('argument')
  .field('argument', def('Expression'));
def('ExperimentalRestProperty')
  .bases('Node')
  .build('argument')
  .field('argument', def('Expression'));
finalize();

export const DEFAULT_CONFIG = {
  gitProvider: 'github',
  parser: '@babel/parser',
  parserOptions: {
    attachComment: true,
    loc: true,
    range: true,
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
      globalReturn: false,
      impliedStrict: false,
      experimentalObjectRestSpread: true,
    },
  },
};

const ARCHITECTURE_NOTE_REGEXP = /^\s*Architecture Note #((?:\d+(?:\.(?=\d)|)){1,8}):\s+([^\r\n]*|$)/;
const SHEBANG_REGEXP = /#! (\/\w+)+ node/;
const EOL_REGEXP = /\n/g;
const JSARCH_PREFIX = `[//]: # ( )
[//]: # (This file is automatically generated by the \`jsarch\`)
[//]: # (module. Do not change it elsewhere, changes would)
[//]: # (be overriden.)
[//]: # ( )
`;

/* Architecture Note #1.3: Title level

By default, titles will be added like if the architecture
 notes were in a single separated file.

If you wish to add the architecture notes in a README.md file
 you will have to set the `titleLevel` option to as much `#`
 as necessar to fit the title hierarchy of you README file.
*/
const TITLE_LEVEL = '#';

/* Architecture Note #1.4: Base

By default, links to the architecture notes right in the code
 are supposed relative to the README.md file like you would
 find it in the GitHub homepage of you projects.

To override it, use the `base` option.

*/
const BASE = '.';

/* Architecture Note #1: jsArch service

JSArch is basically a service that exposes a function allowing
 to extract and output architecture notes from the code.

This service needs some other services. To be able to mock and
 interchange them, we use
 [Knifecycle](https://github.com/nfroidure/knifecycle) for its
 dependency injection and inversion of control feature.

![Dependencies Graph](./DEPENDENCIES.mmd.png)
*/
export default service(name('jsArch', autoInject(initJSArch)));

/**
 * Declare jsArch in the dependency injection system
 * @param {Object}   services
 * Services (provided by the dependency injector)
 * @param {Object}   services.CONFIG
 * The JSArch config
 * @param {Object}   services.EOL
 * The OS EOL chars
 * @param {Object}   services.glob
 * Globbing service
 * @param {Object}   services.fs
 * File system service
 * @param {Object}   services.parser
 * Parser service
 * @param {Object}   [services.log = noop]
 * Logging service
 * @returns {Promise<Function>}
 */
async function initJSArch({ CONFIG, EOL, glob, fs, parser, log = noop }) {
  return jsArch;

  /**
   * Compile an run a template
   * @param {Object}   options
   * Options (destructured)
   * @param {Object}   options.cwd
   * Current working directory
   * @param {Object}   options.patterns
   * Patterns to look files for (see node-glob)
   * @param {Object}   options.eol
   * End of line character (default to the OS one)
   * @param {Object}   options.titleLevel
   * The base title level of the output makdown document
   * @param {Object}   options.base
   * The base directory for the ARCHITECTURE.md references
   * @return {Promise<String>}
   * Computed architecture notes as a markdown file
   */
  async function jsArch({
    cwd,
    patterns,
    eol,
    titleLevel = TITLE_LEVEL,
    base = BASE,
  }) {
    eol = eol || EOL;
    const files = await _computePatterns({ glob, log }, cwd, patterns);
    const architectureNotes = _linearize(
      await Promise.all(
        files.map(_extractArchitectureNotes.bind(null, { parser, fs, log })),
      ),
    );

    const summary = architectureNotes
      .sort(compareNotes)
      .reduce((summary, architectureNote) => {
        const titleAnchor =
          architectureNote.num.replace('.', '') +
          '-' +
          architectureNote.title.toLowerCase().replace(/ /g, '-');

        const titleNums = architectureNote.num.split('.');

        let tabulation = '';
        for (let i = 0; i < titleNums.length; i++) {
          if (i > 0) {
            tabulation += '   ';
          }
        }

        return (
          summary +
          eol +
          tabulation +
          titleNums[titleNums.length - 1] +
          '. [' +
          architectureNote.title +
          ']' +
          '(#' +
          titleAnchor +
          ')'
        );
      }, '');

    const content = architectureNotes
      .sort(compareNotes)
      .reduce((content, architectureNote) => {
        let linesLink =
          '#L' +
          architectureNote.loc.start.line +
          '-L' +
          architectureNote.loc.end.line;
        if (CONFIG.gitProvider.toLowerCase() === 'bitbucket') {
          linesLink =
            '#' +
            path.basename(architectureNote.filePath) +
            '-' +
            architectureNote.loc.start.line +
            ':' +
            architectureNote.loc.end.line;
        }
        return (
          content +
          eol +
          eol +
          titleLevel +
          architectureNote.num
            .split('.')
            .map(() => '#')
            .join('') +
          ' ' +
          architectureNote.num +
          '. ' +
          architectureNote.title +
          eol +
          eol +
          architectureNote.content.replace(
            new RegExp(
              '([\r\n]+)[ \t]{' + architectureNote.loc.start.column + '}',
              'g',
            ),
            '$1',
          ) +
          eol +
          eol +
          '[See in context](' +
          base +
          '/' +
          path.relative(cwd, architectureNote.filePath) +
          linesLink +
          ')' +
          eol +
          eol
        );
      }, '');

    if (content && summary) {
      return (
        JSARCH_PREFIX.replace(EOL_REGEXP, eol) +
        titleLevel +
        ' Architecture Notes' +
        eol +
        eol +
        '## Summary' +
        eol +
        summary +
        eol +
        content
      );
    }
    return content;
  }
}

async function _computePatterns({ glob, log }, cwd, patterns) {
  return _linearize(
    await Promise.all(
      patterns.map(async (pattern) => {
        log('debug', 'Processing pattern:', pattern);
        try {
          const files = await glob(pattern, {
            cwd,
            dot: true,
            nodir: true,
            absolute: true,
          });

          log('debug', 'Pattern sucessfully resolved', pattern);
          log('debug', 'Files:', files);
          return files;
        } catch (err) {
          log('error', 'Pattern failure:', pattern);
          log('stack', 'Stack:', err.stack);
          throw YError.wrap(err, 'E_PATTERN_FAILURE', pattern);
        }
      }),
    ),
  );
}

/* Architecture Note #1.1: Extraction

We use AST parsing and visiting to retrieve well formed
architecture notes. It should be structured like that:
```js

/** Architecture Note #{order}: {title}

{body}
```
*/
async function _extractArchitectureNotes({ parser, fs, log }, filePath) {
  let content;

  log('debug', 'Reading file at', filePath);

  try {
    content = await fs.readFileAsync(filePath, 'utf-8');

    log('debug', 'File sucessfully read', filePath);

    if (SHEBANG_REGEXP.test(content)) {
      log('debug', 'Found a shebang, commenting it', filePath);
      content = '// Shebang commented by jsarch: ' + content;
    }
  } catch (err) {
    log('error', 'File read failure:', filePath);
    log('stack', 'Stack:', err.stack);
    throw YError.wrap(err, 'E_FILE_FAILURE', filePath);
  }

  try {
    const ast = parser(content);
    const architectureNotes = [];

    visit(ast, {
      visitComment: function (path) {
        const comment = path.value.value;
        const matches = ARCHITECTURE_NOTE_REGEXP.exec(comment);

        if (matches) {
          architectureNotes.push({
            num: matches[1],
            title: matches[2].trim(),
            content: comment.substr(matches[0].length).trim(),
            filePath: filePath,
            loc: path.value.loc,
          });
        }
        this.traverse(path);
      },
    });

    log('debug', 'File sucessfully processed', path);
    log(
      'debug',
      'Architecture notes found:',
      architectureNotes.map((a) => a.title),
    );

    return architectureNotes;
  } catch (err) {
    log('error', 'File parse failure:', filePath);
    log('stack', 'Stack:', err.stack);
    throw YError.wrap(err, 'E_FILE_PARSE_FAILURE', filePath);
  }
}

function _linearize(bulks) {
  return bulks.reduce((array, arrayBulk) => array.concat(arrayBulk), []);
}

function noop() {}
