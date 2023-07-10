import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Schema as JSONSchema } from 'ajv';

@Schema()
@ObjectType({ description: 'Represents an entier lexicon' })
@Directive('@key(fields: "_id")')
export class Lexicon {
  @Field(() => ID, { description: 'Unique identifier for the lexicon' })
  _id: string;

  @Prop()
  @Field(() => String, { description: 'The name of the Lexicon' })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @Field(() => GraphQLJSON, { description: 'Format each entry in the Lexicon is expected to follow' })
  schema: JSONSchema;
}

export type LexiconDocument = Lexicon & Document;
export const LexiconSchema = SchemaFactory.createForClass(Lexicon);
