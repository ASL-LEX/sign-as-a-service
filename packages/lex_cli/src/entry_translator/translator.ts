import { LexiconAddEntry } from '../graphql/graphql';

/**
 * Defines how to take a file in some initial format and convert to a list
 * of new LexiconEntry objects
 */
export abstract class LexEntryTranslator {
  abstract translate(filePath: string): Promise<LexiconAddEntry[]>;
}
