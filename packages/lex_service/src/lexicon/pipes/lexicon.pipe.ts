import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';
import { Lexicon } from '../models/lexicon.model';
import { LexiconService } from '../services/lexicon.service';

@Injectable()
export class LexiconPipe implements PipeTransform<string, Promise<Lexicon>> {
  constructor(private readonly lexiconService: LexiconService) {}

  async transform(lexiconID: string): Promise<Lexicon> {
    const lexicon = await this.lexiconService.findById(lexiconID);
    if (!lexicon) {
      throw new BadRequestException(`Lexicon with ID ${lexiconID} does not exist`);
    }
    return lexicon;
  }
}
