import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lexicon, LexiconSchema } from './models/lexicon.model';
import { LexiconEntry, LexiconEntrySchema } from './models/lexicon-entry.model';
import { LexiconResolver } from './resolvers/lexicon.resolver';
import { LexiconService } from './services/lexicon.service';
import { LexiconCreatePipe } from './pipes/lexicon-create.pipe';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Lexicon.name, schema: LexiconSchema },
    { name: LexiconEntry.name, schema: LexiconEntrySchema }
  ])],
  providers: [LexiconResolver, LexiconService, LexiconCreatePipe]
})
export class LexiconModule {}
