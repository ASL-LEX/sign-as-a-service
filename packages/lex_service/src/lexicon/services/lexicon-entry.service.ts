import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { LexiconEntry, LexiconEntrySchema } from '../models/lexicon-entry.model';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import { Lexicon } from '../models/lexicon.model';

@Injectable()
export class LexiconEntryService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  create(lexiconAddEntry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.getModel(lexiconAddEntry.lexicon).create(lexiconAddEntry);
  }

  searchByPrimary(lexicon: Lexicon, primary: string): Promise<LexiconEntry[]> {
    return this.getModel(lexicon).find({ primary });
  }

  searchByKey(lexicon: Lexicon, key: string): Promise<LexiconEntry | null> {
    return this.getModel(lexicon).findOne({ key });
  }

  async createCollection(lexicon: Lexicon): Promise<void> {
    const model = this.getModel(lexicon);
    await model.createCollection();
  }

  private getModel(lexicon: Lexicon | string): Model<LexiconEntry> {
    const lexiconID = typeof lexicon == 'string' ? lexicon : lexicon._id;
    return this.connection.model(LexiconEntry.name, LexiconEntrySchema, `lexiconentry_${lexiconID}`);
  }
}
