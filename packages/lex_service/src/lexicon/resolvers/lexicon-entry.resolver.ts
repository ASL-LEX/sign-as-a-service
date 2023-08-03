import { Resolver, Mutation, Args, Query, ResolveReference } from '@nestjs/graphql';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import { LexiconEntry } from '../models/lexicon-entry.model';
import { LexiconAddEntryPipe } from '../pipes/lexicon-add-entry.pipe';
import { LexiconPipe } from '../pipes/lexicon.pipe';
import { LexiconEntryService } from '../services/lexicon-entry.service';
import { Lexicon } from '../models/lexicon.model';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => LexiconEntry)
export class LexiconEntryResolver {
  constructor(private readonly lexiconEntryService: LexiconEntryService, private readonly lexiconPipe: LexiconPipe) {}

  @Mutation(() => LexiconEntry)
  lexiconAddEntry(@Args('entry', LexiconAddEntryPipe) entry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.lexiconEntryService.create(entry);
  }

  @Query(() => [LexiconEntry])
  async lexiconSearch(
    @Args('lexicon', { type: () => String }, LexiconPipe) lexicon: Lexicon,
    @Args('search') search: string
  ): Promise<LexiconEntry[]> {
    return this.lexiconEntryService.lexiconSearch(lexicon, search);
  }

  @Query(() => LexiconEntry)
  async lexiconByKey(
    @Args('lexicon', { type: () => String }, LexiconPipe) lexicon: Lexicon,
    @Args('key') key: string
  ): Promise<LexiconEntry | null> {
    return this.lexiconEntryService.searchByKey(lexicon, key);
  }

  @Mutation(() => Boolean, { description: 'Remove all entries from a given lexicon' })
  async lexiconClearEntries(@Args('lexicon', { type: () => String }, LexiconPipe) lexicon: Lexicon): Promise<boolean> {
    await this.lexiconEntryService.clearEntries(lexicon);
    return true;
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; key: string; lexicon: string }): Promise<LexiconEntry> {
    try {
      // Get the lexicon
      const lexicon = await this.lexiconPipe.transform(reference.lexicon);

      // Find the lexicon entry
      const result = await this.lexiconEntryService.searchByKey(lexicon, reference.key);
      if (result) {
        return result;
      }
    } catch (e: any) {}
    throw new BadRequestException(
      `Could not find lexicon entry with key ${reference.key} on lexicon ${reference.lexicon}`
    );
  }
}
