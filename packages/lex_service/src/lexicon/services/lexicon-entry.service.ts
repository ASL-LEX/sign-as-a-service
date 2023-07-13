import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LexiconEntry, LexiconEntryDocument } from '../models/lexicon-entry.model';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';
import {Lexicon} from '../models/lexicon.model';

@Injectable()
export class LexiconEntryService {
  constructor(@InjectModel(LexiconEntry.name) private readonly lexiconEntryModel: Model<LexiconEntryDocument>) {}

  create(lexiconAddEntry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.lexiconEntryModel.create(lexiconAddEntry);
  }

  searchByPrimary(lexicon: Lexicon, primary: string): Promise<LexiconEntry[]> {
    return this.lexiconEntryModel.find({ lexicon: lexicon._id, primary });
  }

  searchByKey(lexicon: Lexicon, key: string): Promise<LexiconEntry | null> {
    return this.lexiconEntryModel.findOne({ lexicon: lexicon._id, key });
  }
}
