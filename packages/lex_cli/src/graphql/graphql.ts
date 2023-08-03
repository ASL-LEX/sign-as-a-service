/* Generated File DO NOT EDIT. */
/* tslint:disable */
import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
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

export type Mutation = {
  __typename?: 'Mutation';
  lexiconAddEntry: LexiconEntry;
  /** Remove all entries from a given lexicon */
  lexiconClearEntries: Scalars['Boolean']['output'];
  lexiconCreate: Lexicon;
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
  primary: Scalars['String']['input'];
};

export type LexiconCreateMutationVariables = Exact<{
  lexicon: LexiconCreate;
}>;

export type LexiconCreateMutation = {
  __typename?: 'Mutation';
  lexiconCreate: { __typename?: 'Lexicon'; _id: string; name: string; schema: any };
};

export type LexiconAddEntryMutationVariables = Exact<{
  entry: LexiconAddEntry;
}>;

export type LexiconAddEntryMutation = {
  __typename?: 'Mutation';
  lexiconAddEntry: {
    __typename?: 'LexiconEntry';
    key: string;
    primary: string;
    lexicon: string;
    video: string;
    fields: any;
  };
};

export type LexiconClearEntriesMutationVariables = Exact<{
  lexicon: Scalars['String']['input'];
}>;

export type LexiconClearEntriesMutation = { __typename?: 'Mutation'; lexiconClearEntries: boolean };

export const LexiconCreateDocument = gql`
  mutation lexiconCreate($lexicon: LexiconCreate!) {
    lexiconCreate(lexicon: $lexicon) {
      _id
      name
      schema
    }
  }
`;
export const LexiconAddEntryDocument = gql`
  mutation lexiconAddEntry($entry: LexiconAddEntry!) {
    lexiconAddEntry(entry: $entry) {
      key
      primary
      lexicon
      video
      fields
    }
  }
`;
export const LexiconClearEntriesDocument = gql`
  mutation lexiconClearEntries($lexicon: String!) {
    lexiconClearEntries(lexicon: $lexicon)
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    lexiconCreate(
      variables: LexiconCreateMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<LexiconCreateMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LexiconCreateMutation>(LexiconCreateDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'lexiconCreate',
        'mutation'
      );
    },
    lexiconAddEntry(
      variables: LexiconAddEntryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<LexiconAddEntryMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LexiconAddEntryMutation>(LexiconAddEntryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'lexiconAddEntry',
        'mutation'
      );
    },
    lexiconClearEntries(
      variables: LexiconClearEntriesMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<LexiconClearEntriesMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LexiconClearEntriesMutation>(LexiconClearEntriesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        'lexiconClearEntries',
        'mutation'
      );
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
