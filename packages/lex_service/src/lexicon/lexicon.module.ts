import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lexicon, LexiconSchema } from './models/lexicon.model';
import { LexiconEntry, LexiconEntrySchema } from './models/lexicon-entry.model';
import { LexiconResolver } from './resolvers/lexicon.resolver';
import { LexiconService } from './services/lexicon.service';
import { LexiconCreatePipe } from './pipes/lexicon-create.pipe';
import { LexiconEntryResolver } from './resolvers/lexicon-entry.resolver';
import { LexiconEntryService } from './services/lexicon-entry.service';
import { LexiconPipe } from './pipes/lexicon.pipe';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lexicon.name, schema: LexiconSchema },
      { name: LexiconEntry.name, schema: LexiconEntrySchema }
    ]),
    AuthModule
  ],
  providers: [
    LexiconResolver,
    LexiconService,
    LexiconCreatePipe,
    LexiconEntryService,
    LexiconEntryResolver,
    LexiconPipe
  ]
})
export class LexiconModule {}
