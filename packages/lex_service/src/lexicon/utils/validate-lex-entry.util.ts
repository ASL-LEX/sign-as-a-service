import { LexiconEntry } from '../models/lexicon-entry.model';
import { Lexicon } from '../models/lexicon.model';
import Ajv from 'ajv';
import { BadRequestException } from '@nestjs/common';

export function validateLexEntrySchema<T extends Partial<LexiconEntry>>(lexicon: Lexicon, lexiconEntry: T) {
  // Validate the fields of the lexicon against the provided schema
  const validate = new Ajv().compile(lexicon.schema);
  if (!validate(lexiconEntry.fields)) {
    let message = 'Fields of entry are invalid';
    if (validate.errors) {
      for (const error of validate.errors) {
        message += `\n${error.message}`;
      }
    }
    throw new BadRequestException(message);
  }
}
