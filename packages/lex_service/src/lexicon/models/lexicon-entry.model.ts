import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import GraphQLJSON from 'graphql-type-json';

@Schema()
@ObjectType({ description: 'Single entry within a whole lexicon ' })
@Directive('@key(fields: "key, lexicon")')
export class LexiconEntry {
  @Prop({ index: true, unique: true })
  @Field({ description: 'Unique user assigned identifier for the entry within the lexicon' })
  key: string;

  @Prop({ index: true })
  @Field({ description: 'Primary way to search for entries in the lexicon' })
  primary: string;

  @Prop()
  @Field(() => String, { description: 'Link to the video that represents the entry' })
  video: string;

  @Prop({ index: true })
  @Field(() => [String], { description: 'Keywords that are similar to search accross' })
  associates: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @Field(() => GraphQLJSON, { description: 'Fields stored on the entry' })
  fields: any;
}

export type LexiconEntryDocument = LexiconEntry & Document;
export const LexiconEntrySchema = SchemaFactory.createForClass(LexiconEntry);
LexiconEntrySchema.index({ primary: 'text' });
