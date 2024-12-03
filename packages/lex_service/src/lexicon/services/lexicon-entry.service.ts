import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { LexiconEntry, LexiconEntrySchema } from '../models/lexicon-entry.model';
import { LexiconAddEntry, LexiconUpdateEntry } from '../dtos/lexicon-entry.dto';
import { Lexicon } from '../models/lexicon.model';
import Ajv from 'ajv';

@Injectable()
export class LexiconEntryService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  create(lexiconAddEntry: LexiconAddEntry): Promise<LexiconEntry> {
    return this.getModel(lexiconAddEntry.lexicon).create(lexiconAddEntry);
  }

  searchByPrimary(lexicon: Lexicon, primary: string): Promise<LexiconEntry[]> {
    return this.getModel(lexicon).find({ $text: { $search: primary } });
  }

  searchByKey(lexicon: Lexicon, key: string): Promise<LexiconEntry | null> {
    return this.getModel(lexicon).findOne({ key });
  }

  async createCollection(lexicon: Lexicon): Promise<void> {
    const model = this.getModel(lexicon);
    await model.createCollection();
  }

  async clearEntries(lexicon: Lexicon): Promise<void> {
    await this.getModel(lexicon).deleteMany({});
  }

  validateLexEntrySchema(lexicon: Lexicon, fields: LexiconEntry['fields']): void {
    // Validate the fields of the lexicon against the provided schema
    const validate = new Ajv().compile(lexicon.schema);
    if (!validate(fields)) {
      let message = 'Fields of entry are invalid';
      if (validate.errors) {
        for (const error of validate.errors) {
          message += `\n${error.message}`;
        }
      }
      throw new BadRequestException(message);
    }
  }

  async deleteByKey(lexicon: Lexicon, key: string): Promise<boolean> {
    const result = await this.getModel(lexicon).deleteOne({ key });
    return result.deletedCount > 0;
  }

  async searchByAssociated(lexicon: Lexicon, search: string): Promise<LexiconEntry[]> {
    const regexPattern = new RegExp(`^${search}$`, 'i');

    return this.getModel(lexicon).find({
      associates: {
        $elemMatch: {
          $regex: regexPattern
        }
      }
    });
  }

  /**
   * Perform a search that will search first on the primary search term providing
   * those values first. Then search on associated terms which are alphabetized
   * based on the primary key.
   */
  async lexiconSearch(lexicon: Lexicon, search: string): Promise<LexiconEntry[]> {
    // Search by the primary search term
    const primarySearchResults = await this.searchByPrimary(lexicon, search);

    // Search on associate terms
    let associatesResults = await this.searchByAssociated(lexicon, search);
    associatesResults = associatesResults
      // Remove potential duplicates based on the unique keys
      .filter((entry) => !primarySearchResults.find((primaryEntry) => primaryEntry.key == entry.key))
      // Now filter the results based on the primary search term
      .sort((entryA, entryB) => {
        if (entryA.primary < entryB.primary) {
          return -1;
        }
        if (entryA.primary > entryA.primary) {
          return 1;
        }
        return 0;
      });

    return [...primarySearchResults, ...associatesResults];
  }

  async lexiconUpdateEntry({ findByKey, ...rest }: LexiconUpdateEntry, lexicon: Lexicon): Promise<LexiconEntry> {
    const updatedEntry = await this.getModel(lexicon).findOneAndUpdate(
      { key: findByKey },
      { $set: rest },
      { new: true, useFindAndModify: false }
    );
    if (!updatedEntry) throw new InternalServerErrorException('Error updating lexicon entry');
    return updatedEntry;
  }

  private getModel(lexicon: Lexicon | string): Model<LexiconEntry> {
    const lexiconID = typeof lexicon == 'string' ? lexicon : lexicon._id;
    return this.connection.model(LexiconEntry.name, LexiconEntrySchema, `lexiconentry_${lexiconID}`);
  }
}
