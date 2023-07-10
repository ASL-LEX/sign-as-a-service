import { InputType, OmitType } from '@nestjs/graphql';
import { LexiconEntry } from '../models/lexicon-entry.model';

@InputType()
export class LexiconAddEntry extends OmitType(LexiconEntry, [] as const, InputType) {}
