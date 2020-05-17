import { autoService } from 'knifecycle';
import YError from 'yerror';
import { DEFAULT_CONFIG } from './jsarch';

export default autoService(initParser);

async function initParser({ CONFIG = DEFAULT_CONFIG }) {
  let parser;

  try {
    parser = require(CONFIG.parser);
  } catch (err) {
    throw YError.wrap(err, 'E_PARSER_LACK', CONFIG.parser);
  }

  return (content) => parser.parse(content, CONFIG.parserOptions);
}
