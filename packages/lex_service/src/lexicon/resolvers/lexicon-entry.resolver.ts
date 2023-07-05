import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import { LexiconEntry } from '../models/lexicon-entry.model';
import { LexiconAddEntryPipe } from '../pipes/lexicon-add-entry.pipe';
import { LexiconEntryService } from '../services/lexicon-entry.service';

@Resolver()
export class LexiconEntryResolver {

  constructor(private readonly lexiconEntryService: LexiconEntryService) {}

  @Mutation(() => LexiconEntry)
  lexiconAddEntry(@Args('entry', LexiconAddEntryPipe) entry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.lexiconEntryService.create(entry);
  }
}
