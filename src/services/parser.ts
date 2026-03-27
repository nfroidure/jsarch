import { autoService, location } from 'knifecycle';
import { YError } from 'yerror';
import { type parse } from '@babel/parser';
import { type JSArchConfig } from './CONFIG.js';
import { type ImporterService } from 'common-services';

export type Parser = (content: string) => ReturnType<typeof parse>;

async function initParser({
  CONFIG,
  importer,
}: {
  CONFIG: JSArchConfig;
  importer: ImporterService<{ default: { parse: typeof parse } }>;
}): Promise<Parser> {
  let parser: typeof parse;

  try {
    parser = (await importer(CONFIG.parser || '@babel/parser')).default
      .parse as typeof parse;
  } catch (err) {
    throw YError.wrap(err as Error, 'E_PARSER_LACK', [CONFIG.parser]);
  }

  return (content) => parser(content, CONFIG.parserOptions);
}

export default location(autoService(initParser), import.meta.url);
