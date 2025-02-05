import { LexiconAddEntry } from '../graphql/graphql';
import { LexEntryTranslator } from './translator';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

/**
 * Translate ASL-LEX data downloaded as a CSV from Knack into a series
 * of LexiconAddEntry object
 */
export class SemasignTranslator extends LexEntryTranslator {
  async translate(filePath: string, lexicon: string): Promise<LexiconAddEntry[]> {
    const stream = createReadStream(filePath);

    const lexAddEntries: LexiconAddEntry[] = [];

    const parser = stream.pipe(csv({ separator: ';' }));
    for await (const row of parser) {
      const primary = row['Gloss1'].replace('-', ' ').toLowerCase();
      // Associated words are based on the SignBank English translations
      const translations = row['Gloss2plus'].split(',').map((raw: string) => raw.trim().toLowerCase());

      const lexAddEntry: LexiconAddEntry = {
        key: row['Index'],
        primary: primary,
        lexicon: lexicon,
        video: `https://signlab2.s3.amazonaws.com/semasign-sample/${row['Filename']}`,
        associates: translations,
        fields: {
          english: 'empty'
        }
      };

      lexAddEntries.push(lexAddEntry);
    }

    return lexAddEntries;
  }
}
