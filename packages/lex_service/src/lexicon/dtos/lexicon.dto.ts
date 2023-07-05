import { InputType, OmitType } from '@nestjs/graphql';
import { Lexicon } from '../models/lexicon.model';

@InputType()
export class LexiconCreate extends OmitType(Lexicon, ['_id'] as const, InputType) {}
