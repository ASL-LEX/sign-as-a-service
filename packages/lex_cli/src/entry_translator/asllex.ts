import { LexiconAddEntry } from '../graphql/graphql';
import { LexEntryTranslator } from './translator';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';

/**
 * Translate ASL-LEX data downloaded as a CSV from Knack into a series
 * of LexiconAddEntry object
 */
export class AslLexTranslator extends LexEntryTranslator {
  async translate(filePath: string, lexicon: string): Promise<LexiconAddEntry[]> {
    const stream = createReadStream(filePath);

    const lexAddEntries: LexiconAddEntry[] = [];

    const parser = stream.pipe(csv());
    for await (const row of parser) {
      // Primary cannot contain underscores
      const primary = row['EntryID'].replace('_', ' ');

      // Associated words are based on the SignBank English translations
      const translations = row['SignBankEnglishTranslations'].split(',').map((raw: string) => raw.trim());

      const lexAddEntry: LexiconAddEntry = {
        key: row['Code'],
        primary: primary,
        video: `https://signlab2.s3.amazonaws.com/videos/${row['Code']}.webm`,
        associates: translations,
        fields: {
          english: row['NondominantTranslation']
        }
      };

      lexAddEntries.push(lexAddEntry);
    }

    return lexAddEntries;
  }
}
