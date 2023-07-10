import { ObjectType, Field } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import GraphQLJSON from 'graphql-type-json';

@Schema()
@ObjectType({ description: 'Single entry within a whole lexicon ' })
export class LexiconEntry {
  @Prop()
  @Field()
  lexicon: string;

  @Prop()
  @Field(() => String, { description: 'Link to the video that represents the entry' })
  video: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @Field(() => GraphQLJSON, { description: 'Fields stored on the entry' })
  fields: any;
}

export type LexiconEntryDocument = LexiconEntry & Document;
export const LexiconEntrySchema = SchemaFactory.createForClass(LexiconEntry);
