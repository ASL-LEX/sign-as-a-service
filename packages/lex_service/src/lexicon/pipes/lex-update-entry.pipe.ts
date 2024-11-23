import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LexiconUpdateEntry } from '../dtos/lexicon-entry.dto';
import { LexiconService } from '../services/lexicon.service';
import { LexiconEntryService } from '../services/lexicon-entry.service';

@Injectable()
export class LexiconUpdateEntryPipe implements PipeTransform<LexiconUpdateEntry, Promise<LexiconUpdateEntry>> {
  constructor(
    private readonly lexiconService: LexiconService,
    private readonly lexiconEntryService: LexiconEntryService
  ) {}

  async transform(lexiconUpdateEntry: LexiconUpdateEntry): Promise<LexiconUpdateEntry> {
    const { findByKey, lexicon: lexiconId, key, fields } = lexiconUpdateEntry;
    const lexicon = await this.lexiconService.findById(lexiconId);
    if (!lexicon) throw new BadRequestException(`Lexicon with ID ${lexiconId} does not exist`);

    const existingEntry = await this.lexiconEntryService.searchByKey(lexicon, findByKey);
    if (!existingEntry) throw new BadRequestException(`Lexicon entry with key ${findByKey} not found`);

    if (key && key !== findByKey) {
      const entry = await this.lexiconEntryService.searchByKey(lexicon, key);
      if (entry) {
        throw new BadRequestException(`Lexicon entry with key ${key} already exists`);
      }
    }
    if (fields) this.lexiconEntryService.validateLexEntrySchema(lexicon, fields);
    return lexiconUpdateEntry;
  }
}
