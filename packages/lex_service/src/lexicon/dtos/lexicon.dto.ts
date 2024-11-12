import { InputType, OmitType, Field, PartialType } from '@nestjs/graphql';
import { Lexicon } from '../models/lexicon.model';

@InputType()
export class LexiconCreate extends OmitType(Lexicon, ['_id'] as const, InputType) {}

@InputType()
export class LexiconUpdate extends OmitType(PartialType(Lexicon), [] as const, InputType) {
  @Field()
  _id: string;
}
