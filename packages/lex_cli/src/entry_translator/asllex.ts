import { LexiconAddEntry } from '../graphql/graphql';
import { LexEntryTranslator } from './translator';
import { createReadStream } from 'fs'
import * as csv from 'csv-parser';


/**
 * Translate ASL-LEX data downloaded as a CSV from Knack into a series
 * of LexiconAddEntry object
 */
export class AslLexTranslator extends LexEntryTranslator {
  async translate(filePath: string, lexicon: string): Promise<LexiconAddEntry[]> {
    const stream = createReadStream(filePath)

    const lexAddEntries: LexiconAddEntry[] = [];

    const parser = stream.pipe(csv());
    for await (const row of parser) {
      const lexAddEntry: LexiconAddEntry = {
        key: row['Code'],
        lexicon: lexicon,
        primary: row['EntryID'],
        video: 'placeholder',
        fields: {
          english: row['NondominantTranslation']
        }
      };

      lexAddEntries.push(lexAddEntry);
    }

    return lexAddEntries;
  }
}
