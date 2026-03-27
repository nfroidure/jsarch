import { autoService, location, name } from 'knifecycle';
import { type PackageJSON } from './packageJSON.js';
import { deepExtend } from '../utils/utils.js';
import { type ParserOptions } from '@babel/parser';
import rc from 'rc';

export interface JSArchConfig {
  gitProvider: 'github' | 'bitbucket';
  parser: string;
  parserOptions: ParserOptions;
}

export const DEFAULT_CONFIG: JSArchConfig = {
  gitProvider: 'github',
  parser: '@babel/parser',
  parserOptions: {
    attachComment: true,
    sourceType: 'module',
    loc: true,
    range: true,
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: false,
      globalReturn: false,
      impliedStrict: false,
      experimentalObjectRestSpread: true,
    },
  } as ParserOptions,
};

async function initConfig({
  packageJSON,
}: {
  packageJSON: PackageJSON;
}): Promise<JSArchConfig> {
  const baseConfig = deepExtend(
    {},
    packageJSON.jsarch || {},
    DEFAULT_CONFIG,
  ) as JSArchConfig;

  return rc('jsarch', baseConfig);
}

export default location(
  name('CONFIG', autoService(initConfig)),
  import.meta.url,
);
