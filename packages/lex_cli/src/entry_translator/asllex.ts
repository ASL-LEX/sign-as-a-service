import { LexiconAddEntry } from '../graphql/graphql';
import { LexEntryTranslator } from './translator';

/**
 * Translate ASL-LEX data downloaded as a CSV from Knack into a series
 * of LexiconAddEntry object
 */
export class AslLexTranslator extends LexEntryTranslator {
  async translate(_filePath: string): Promise<LexiconAddEntry[]> {
    return [];
  }
}
