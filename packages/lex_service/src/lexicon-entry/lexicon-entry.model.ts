import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Single entry within a whole lexicon '})
export class LexiconEntry {
  @Field(() => String, { description: 'Link to the video that represents the entry' })
  video: string;
}
