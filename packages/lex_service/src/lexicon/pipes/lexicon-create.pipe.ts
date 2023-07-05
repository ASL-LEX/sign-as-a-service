import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LexiconCreate } from '../dtos/lexicon.dto';
import Ajv from 'ajv';

@Injectable()
export class LexiconCreatePipe implements PipeTransform<LexiconCreate, LexiconCreate> {
  transform(lexicon: LexiconCreate): LexiconCreate {
    // Ensure that the provided JSON schema is valid
    try {
      const ajv = new Ajv();
      ajv.compile(lexicon.schema);
    } catch(e: any) {
      console.log(e);
      throw new BadRequestException(`Invalid JSON schema provided:\n${e}`);
    }

    return lexicon;
  }
}
