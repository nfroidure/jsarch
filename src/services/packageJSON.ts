import { constant, location } from 'knifecycle';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { type JSArchConfig } from './CONFIG.js';

export interface PackageJSON {
  version: string;
  jsarch: Partial<JSArchConfig>;
}

export default location(
  constant(
    'packageJSON',
    JSON.parse(
      readFileSync(join('.', 'package.json')).toString(),
    ) as PackageJSON,
  ),
  import.meta.url,
);
