import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Represents an entier lexicon' })
export class Lexicon {
  @Field(() => ID, { description: 'Unique identifier for the lexicon' })
  _id: string;

  @Field(() => String, { description: 'The name of the Lexicon' })
  name: string;
}
