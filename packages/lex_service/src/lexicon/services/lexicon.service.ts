import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Lexicon, LexiconDocument } from '../models/lexicon.model';
import { LexiconCreate } from '../dtos/lexicon.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LexiconService {
  constructor(@InjectModel(Lexicon.name) private readonly lexiconModel: Model<LexiconDocument>) {}

  create(lexiconInput: LexiconCreate): Promise<Lexicon> {
    return this.lexiconModel.create(lexiconInput);
  }

  findAll(): Promise<Lexicon[]> {
    return this.lexiconModel.find({});
  }
}
