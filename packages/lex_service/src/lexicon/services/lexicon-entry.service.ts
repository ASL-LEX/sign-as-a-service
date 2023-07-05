import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LexiconEntry, LexiconEntryDocument } from '../models/lexicon-entry.model';
import { LexiconAddEntry } from '../dtos/lexicon-entry.dto';

@Injectable()
export class LexiconEntryService {
  constructor(@InjectModel(LexiconEntry.name) private readonly lexiconEntryModel: Model<LexiconEntryDocument>) {}

  create(lexiconAddEntry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.lexiconEntryModel.create(lexiconAddEntry);
  }
}
