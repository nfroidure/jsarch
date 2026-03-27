import { glob, type GlobOptions } from 'glob';
import { constant, location } from 'knifecycle';

export type GlobService = (
  pattern: string | string[],
  options?: GlobOptions,
) => Promise<string[]>;

export default location(
  constant('glob', glob as unknown as GlobService),
  import.meta.url,
);
