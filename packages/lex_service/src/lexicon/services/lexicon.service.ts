import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Lexicon, LexiconDocument } from '../models/lexicon.model';
import { LexiconCreate, LexiconUpdate } from '../dtos/lexicon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LexiconEntryService } from './lexicon-entry.service';

@Injectable()
export class LexiconService {
  constructor(
    @InjectModel(Lexicon.name) private readonly lexiconModel: Model<LexiconDocument>,
    private readonly lexiconEntryService: LexiconEntryService
  ) {}

  async create(lexiconInput: LexiconCreate): Promise<Lexicon> {
    const lexicon = await this.lexiconModel.create(lexiconInput);

    // Create the cooresponding collection for the Lexicon entries
    await this.lexiconEntryService.createCollection(lexicon);

    return lexicon;
  }

  async update(lexiconData: LexiconUpdate): Promise<Lexicon | null> {
    const { _id, ...rest } = lexiconData;

    const updatedLexicon = await this.lexiconModel.findByIdAndUpdate(_id, rest, { new: true });

    return updatedLexicon;
  }

  findAll(): Promise<Lexicon[]> {
    return this.lexiconModel.find({});
  }

  findById(id: string): Promise<Lexicon | null> {
    return this.lexiconModel.findById(id);
  }
}
