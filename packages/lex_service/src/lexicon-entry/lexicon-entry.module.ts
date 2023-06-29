import { Module } from '@nestjs/common';
import { LexiconEntryResolver } from './lexicon-entry.resolver';

@Module({
  providers: [LexiconEntryResolver]
})
export class LexiconEntryModule {}
