import { name, autoService, location } from 'knifecycle';
import { YError } from 'yerror';
import fs, { type WriteFileOptions } from 'node:fs';
import { type LogService } from 'common-services';
import { type ProgramOptionsService } from './programOptions.js';

export interface FSService {
  readFileAsync: (path: string) => Promise<Buffer>;
  accessAsync: (path: string, mode?: number) => Promise<void>;
  readdirAsync: (path: string) => Promise<string[]>;
  unlinkAsync: (path: string) => Promise<void>;
  writeFileAsync: (
    path: string,
    data: Buffer,
    options?: WriteFileOptions,
  ) => Promise<void>;
  constants: typeof fs.constants;
}

async function initFS({
  programOptions,
  log,
}: {
  programOptions: ProgramOptionsService;
  log: LogService;
}): Promise<FSService> {
  return {
    readFileAsync: fs.promises.readFile,
    accessAsync: fs.promises.access,
    readdirAsync: fs.promises.readdir,
    unlinkAsync: async (path) => {
      if (programOptions.dryRun) {
        log('warning', '⌫ - Delete a file:', path);
        return;
      }
      if (programOptions.safe) {
        throw new YError('E_UNEXPECTED_CHANGES', [path]);
      }
      await fs.promises.unlink(path);
    },
    writeFileAsync: async (path: string, data: Buffer) => {
      if (programOptions.dryRun) {
        log('warning', '💾 - Modify a file:', path);
        return;
      }
      if (programOptions.safe) {
        throw new YError('E_UNEXPECTED_CHANGES', [path]);
      }
      await fs.promises.writeFile(path, data);
    },
    constants: fs.constants,
  };
}

export default location(name('fs', autoService(initFS)), import.meta.url);
