import { InputType, OmitType, Field, PartialType } from '@nestjs/graphql';
import { LexiconEntry } from '../models/lexicon-entry.model';

@InputType()
export class LexiconAddEntry extends OmitType(LexiconEntry, [] as const, InputType) {
  @Field()
  lexicon: string;
}

@InputType()
export class LexiconUpdateEntry extends OmitType(PartialType(LexiconEntry), [] as const, InputType) {
  @Field()
  _id: string;

  @Field()
  lexicon: string;
}
