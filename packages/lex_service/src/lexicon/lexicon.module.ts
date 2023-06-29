import { Module } from '@nestjs/common';
import { LexiconResolver } from './lexicon.resolver';

@Module({
  providers: [LexiconResolver]
})
export class LexiconModule {}
