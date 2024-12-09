/* Generated File DO NOT EDIT. */
/* tslint:disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

/** Represents an entier lexicon */
export type Lexicon = {
  __typename?: 'Lexicon';
  /** Unique identifier for the lexicon */
  _id: Scalars['ID']['output'];
  /** The name of the Lexicon */
  name: Scalars['String']['output'];
  /** Format each entry in the Lexicon is expected to follow */
  schema: Scalars['JSON']['output'];
};

export type LexiconAddEntry = {
  /** Keywords that are similar to search accross */
  associates: Array<Scalars['String']['input']>;
  /** Fields stored on the entry */
  fields: Scalars['JSON']['input'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
  /** Primary way to search for entries in the lexicon */
  primary: Scalars['String']['input'];
  /** Link to the video that represents the entry */
  video: Scalars['String']['input'];
};

export type LexiconCreate = {
  /** The name of the Lexicon */
  name: Scalars['String']['input'];
  /** Format each entry in the Lexicon is expected to follow */
  schema: Scalars['JSON']['input'];
};

/** Single entry within a whole lexicon  */
export type LexiconEntry = {
  __typename?: 'LexiconEntry';
  /** Keywords that are similar to search accross */
  associates: Array<Scalars['String']['output']>;
  /** Fields stored on the entry */
  fields: Scalars['JSON']['output'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key: Scalars['String']['output'];
  lexicon: Scalars['String']['output'];
  /** Primary way to search for entries in the lexicon */
  primary: Scalars['String']['output'];
  /** Link to the video that represents the entry */
  video: Scalars['String']['output'];
};

export type LexiconUpdateEntry = {
  /** Keywords that are similar to search accross */
  associates?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Fields stored on the entry */
  fields?: InputMaybe<Scalars['JSON']['input']>;
  findByKey: Scalars['String']['input'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key?: InputMaybe<Scalars['String']['input']>;
  lexicon: Scalars['String']['input'];
  /** Primary way to search for entries in the lexicon */
  primary?: InputMaybe<Scalars['String']['input']>;
  /** Link to the video that represents the entry */
  video?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  lexiconAddEntry: LexiconEntry;
  /** Remove all entries from a given lexicon */
  lexiconClearEntries: Scalars['Boolean']['output'];
  lexiconCreate: Lexicon;
  lexiconUpdateEntry: LexiconEntry;
};


export type MutationLexiconAddEntryArgs = {
  entry: LexiconAddEntry;
};


export type MutationLexiconClearEntriesArgs = {
  lexicon: Scalars['String']['input'];
};


export type MutationLexiconCreateArgs = {
  lexicon: LexiconCreate;
};


export type MutationLexiconUpdateEntryArgs = {
  lexiconEntry: LexiconUpdateEntry;
};

export type Query = {
  __typename?: 'Query';
  lexFindAll: Array<Lexicon>;
  lexiconByKey: LexiconEntry;
  lexiconSearch: Array<LexiconEntry>;
};


export type QueryLexiconByKeyArgs = {
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
};


export type QueryLexiconSearchArgs = {
  lexicon: Scalars['String']['input'];
  search: Scalars['String']['input'];
};
