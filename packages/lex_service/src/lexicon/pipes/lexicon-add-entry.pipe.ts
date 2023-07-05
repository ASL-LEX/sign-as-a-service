import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import { LexiconService } from '../services/lexicon.service';
import Ajv from 'ajv';

@Injectable()
export class LexiconAddEntryPipe implements PipeTransform<LexiconAddEntry, Promise<LexiconAddEntry>> {
  constructor(private readonly lexiconService: LexiconService) {}

  async transform(lexiconAddEntry: LexiconAddEntry): Promise<LexiconAddEntry> {
    // Ensure the lexicon provided exists
    const lexicon = await this.lexiconService.findById(lexiconAddEntry.lexicon);
    if (!lexicon) {
      throw new BadRequestException(`Lexicon with ID ${lexiconAddEntry.lexicon} does not exist`);
    }

    // Validate the fields of the lexicon agains the provided schema
    const validate = new Ajv().compile(lexicon.schema);
    if (!validate(lexiconAddEntry.fields)) {
      let message =  'Fields of entry are invalid';
      if (validate.errors) {
        for (const error of validate.errors) {
          message += `\n${error.message}`;
        }
      }
      throw new BadRequestException(message);
    }

    return lexiconAddEntry;
  }
}
