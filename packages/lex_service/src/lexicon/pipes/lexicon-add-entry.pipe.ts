import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import { LexiconService } from '../services/lexicon.service';
import { LexiconEntryService } from '../services/lexicon-entry.service';

@Injectable()
export class LexiconAddEntryPipe implements PipeTransform<LexiconAddEntry, Promise<LexiconAddEntry>> {
  constructor(
    private readonly lexiconService: LexiconService,
    private readonly lexiconEntryService: LexiconEntryService
  ) {}

  async transform(lexiconAddEntry: LexiconAddEntry): Promise<LexiconAddEntry> {
    // Ensure the lexicon provided exists
    const lexicon = await this.lexiconService.findById(lexiconAddEntry.lexicon);
    if (!lexicon) {
      throw new BadRequestException(`Lexicon with ID ${lexiconAddEntry.lexicon} does not exist`);
    }
    const lexiconEntry = await this.lexiconEntryService.searchByKey(lexicon, lexiconAddEntry.key);
    if (lexiconEntry) {
      throw new BadRequestException(`Lexicon entry with key ${lexiconAddEntry.key} already exists`);
    }

    this.lexiconEntryService.validateLexEntrySchema(lexicon, lexiconAddEntry.fields);

    return lexiconAddEntry;
  }
}
