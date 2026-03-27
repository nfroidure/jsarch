import { program } from 'commander';
import { autoService, location } from 'knifecycle';
import { type PackageJSON } from './packageJSON.js';

export interface ProgramOptionsService {
  safe?: boolean;
  dryRun?: boolean;
  base: string;
  args: string[];
}

async function initProgramOptions({
  packageJSON,
}: {
  packageJSON: PackageJSON;
}): Promise<ProgramOptionsService> {
  program
    .version(packageJSON.version)
    .argument('[files...]', 'Files to process')
    .option('-b, --base [value]', 'Base for links')
    .parse(process.argv);

  return {
    args: program.args,
    ...program.opts(),
  };
}

export default location(autoService(initProgramOptions), import.meta.url);
