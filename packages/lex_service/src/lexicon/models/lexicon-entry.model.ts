import { ObjectType, Field } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType({ description: 'Single entry within a whole lexicon '})
export class LexiconEntry {
  @Prop()
  @Field(() => String, { description: 'Link to the video that represents the entry' })
  video: string;
}

export type LexiconEntryDocument = LexiconEntry & Document;
export const LexiconEntrySchema = SchemaFactory.createForClass(LexiconEntry);