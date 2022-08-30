import { autoService } from 'knifecycle';
import { YError } from 'yerror';
import { DEFAULT_CONFIG } from './jsarch.js';
import type { JSArchConfig } from './jsarch.js';
import type { parse } from '@babel/parser';

export default autoService(initParser);

export type Parser = (content: string) => ReturnType<typeof parse>;

async function initParser({
  CONFIG = DEFAULT_CONFIG,
}: {
  CONFIG: Partial<JSArchConfig>;
}): Promise<Parser> {
  let parser: typeof parse;

  try {
    parser = (await import(CONFIG.parser || '@babel/parser')).default
      .parse as typeof parse;
  } catch (err) {
    throw YError.wrap(err as Error, 'E_PARSER_LACK', CONFIG.parser);
  }

  return (content) => parser(content, CONFIG.parserOptions);
}
