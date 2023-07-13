import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import { LexiconEntry } from '../models/lexicon-entry.model';
import { LexiconAddEntryPipe } from '../pipes/lexicon-add-entry.pipe';
import { LexiconPipe } from '../pipes/lexicon.pipe';
import { LexiconEntryService } from '../services/lexicon-entry.service';
import { Lexicon } from '../models/lexicon.model';

@Resolver()
export class LexiconEntryResolver {
  constructor(private readonly lexiconEntryService: LexiconEntryService) {}

  @Mutation(() => LexiconEntry)
  lexiconAddEntry(@Args('entry', LexiconAddEntryPipe) entry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.lexiconEntryService.create(entry);
  }

  @Query(() => [LexiconEntry])
  async lexiconSearch(@Args('lexicon', { type: () => String }, LexiconPipe) lexicon: Lexicon, @Args('primary') primary: string): Promise<LexiconEntry[]> {
    return this.lexiconEntryService.searchByPrimary(lexicon, primary);
  }

  @Query(() => LexiconEntry)
  async lexiconByKey(@Args('lexicon', { type: () => String }, LexiconPipe) lexicon: Lexicon, @Args('key') key: string): Promise<LexiconEntry | null> {
    return this.lexiconEntryService.searchByKey(lexicon, key);
  }
}
