/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LexFindAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LexFindAllQuery = { __typename?: 'Query', lexFindAll: Array<{ __typename?: 'Lexicon', _id: string, name: string, schema: any }> };

export type GetAllLexEntriesQueryVariables = Types.Exact<{
  lexicon: Types.Scalars['String']['input'];
}>;


export type GetAllLexEntriesQuery = { __typename?: 'Query', lexiconAllEntries: Array<{ __typename?: 'LexiconEntry', key: string, primary: string, video: string, associates: Array<string>, fields: any }> };

export type LexCreateMutationVariables = Types.Exact<{
  lexicon: Types.LexiconCreate;
}>;


export type LexCreateMutation = { __typename?: 'Mutation', lexiconCreate: { __typename?: 'Lexicon', _id: string, name: string, schema: any } };

export type LexUpdateEntryMutationVariables = Types.Exact<{
  lexEntry: Types.LexiconUpdateEntry;
}>;


export type LexUpdateEntryMutation = { __typename?: 'Mutation', lexiconUpdateEntry: { __typename?: 'LexiconEntry', key: string, primary: string, video: string, associates: Array<string>, fields: any } };

export type LexCreateEntryMutationVariables = Types.Exact<{
  lexEntry: Types.LexiconAddEntry;
}>;


export type LexCreateEntryMutation = { __typename?: 'Mutation', lexiconAddEntry: { __typename?: 'LexiconEntry', key: string, primary: string, video: string, associates: Array<string>, fields: any } };

export type LexDeleteEntryMutationVariables = Types.Exact<{
  lexicon: Types.Scalars['String']['input'];
  key: Types.Scalars['String']['input'];
}>;


export type LexDeleteEntryMutation = { __typename?: 'Mutation', lexiconDeleteEntry: boolean };


export const LexFindAllDocument = gql`
    query lexFindAll {
  lexFindAll {
    _id
    name
    schema
  }
}
    `;

/**
 * __useLexFindAllQuery__
 *
 * To run a query within a React component, call `useLexFindAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useLexFindAllQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLexFindAllQuery({
 *   variables: {
 *   },
 * });
 */
export function useLexFindAllQuery(baseOptions?: Apollo.QueryHookOptions<LexFindAllQuery, LexFindAllQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LexFindAllQuery, LexFindAllQueryVariables>(LexFindAllDocument, options);
      }
export function useLexFindAllLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LexFindAllQuery, LexFindAllQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LexFindAllQuery, LexFindAllQueryVariables>(LexFindAllDocument, options);
        }
export type LexFindAllQueryHookResult = ReturnType<typeof useLexFindAllQuery>;
export type LexFindAllLazyQueryHookResult = ReturnType<typeof useLexFindAllLazyQuery>;
export type LexFindAllQueryResult = Apollo.QueryResult<LexFindAllQuery, LexFindAllQueryVariables>;
export const GetAllLexEntriesDocument = gql`
    query getAllLexEntries($lexicon: String!) {
  lexiconAllEntries(lexicon: $lexicon) {
    key
    primary
    video
    associates
    fields
  }
}
    `;

/**
 * __useGetAllLexEntriesQuery__
 *
 * To run a query within a React component, call `useGetAllLexEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllLexEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllLexEntriesQuery({
 *   variables: {
 *      lexicon: // value for 'lexicon'
 *   },
 * });
 */
export function useGetAllLexEntriesQuery(baseOptions: Apollo.QueryHookOptions<GetAllLexEntriesQuery, GetAllLexEntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllLexEntriesQuery, GetAllLexEntriesQueryVariables>(GetAllLexEntriesDocument, options);
      }
export function useGetAllLexEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllLexEntriesQuery, GetAllLexEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllLexEntriesQuery, GetAllLexEntriesQueryVariables>(GetAllLexEntriesDocument, options);
        }
export type GetAllLexEntriesQueryHookResult = ReturnType<typeof useGetAllLexEntriesQuery>;
export type GetAllLexEntriesLazyQueryHookResult = ReturnType<typeof useGetAllLexEntriesLazyQuery>;
export type GetAllLexEntriesQueryResult = Apollo.QueryResult<GetAllLexEntriesQuery, GetAllLexEntriesQueryVariables>;
export const LexCreateDocument = gql`
    mutation lexCreate($lexicon: LexiconCreate!) {
  lexiconCreate(lexicon: $lexicon) {
    _id
    name
    schema
  }
}
    `;
export type LexCreateMutationFn = Apollo.MutationFunction<LexCreateMutation, LexCreateMutationVariables>;

/**
 * __useLexCreateMutation__
 *
 * To run a mutation, you first call `useLexCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLexCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lexCreateMutation, { data, loading, error }] = useLexCreateMutation({
 *   variables: {
 *      lexicon: // value for 'lexicon'
 *   },
 * });
 */
export function useLexCreateMutation(baseOptions?: Apollo.MutationHookOptions<LexCreateMutation, LexCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LexCreateMutation, LexCreateMutationVariables>(LexCreateDocument, options);
      }
export type LexCreateMutationHookResult = ReturnType<typeof useLexCreateMutation>;
export type LexCreateMutationResult = Apollo.MutationResult<LexCreateMutation>;
export type LexCreateMutationOptions = Apollo.BaseMutationOptions<LexCreateMutation, LexCreateMutationVariables>;
export const LexUpdateEntryDocument = gql`
    mutation lexUpdateEntry($lexEntry: LexiconUpdateEntry!) {
  lexiconUpdateEntry(lexiconEntry: $lexEntry) {
    key
    primary
    video
    associates
    fields
  }
}
    `;
export type LexUpdateEntryMutationFn = Apollo.MutationFunction<LexUpdateEntryMutation, LexUpdateEntryMutationVariables>;

/**
 * __useLexUpdateEntryMutation__
 *
 * To run a mutation, you first call `useLexUpdateEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLexUpdateEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lexUpdateEntryMutation, { data, loading, error }] = useLexUpdateEntryMutation({
 *   variables: {
 *      lexEntry: // value for 'lexEntry'
 *   },
 * });
 */
export function useLexUpdateEntryMutation(baseOptions?: Apollo.MutationHookOptions<LexUpdateEntryMutation, LexUpdateEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LexUpdateEntryMutation, LexUpdateEntryMutationVariables>(LexUpdateEntryDocument, options);
      }
export type LexUpdateEntryMutationHookResult = ReturnType<typeof useLexUpdateEntryMutation>;
export type LexUpdateEntryMutationResult = Apollo.MutationResult<LexUpdateEntryMutation>;
export type LexUpdateEntryMutationOptions = Apollo.BaseMutationOptions<LexUpdateEntryMutation, LexUpdateEntryMutationVariables>;
export const LexCreateEntryDocument = gql`
    mutation lexCreateEntry($lexEntry: LexiconAddEntry!) {
  lexiconAddEntry(entry: $lexEntry) {
    key
    primary
    video
    associates
    fields
  }
}
    `;
export type LexCreateEntryMutationFn = Apollo.MutationFunction<LexCreateEntryMutation, LexCreateEntryMutationVariables>;

/**
 * __useLexCreateEntryMutation__
 *
 * To run a mutation, you first call `useLexCreateEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLexCreateEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lexCreateEntryMutation, { data, loading, error }] = useLexCreateEntryMutation({
 *   variables: {
 *      lexEntry: // value for 'lexEntry'
 *   },
 * });
 */
export function useLexCreateEntryMutation(baseOptions?: Apollo.MutationHookOptions<LexCreateEntryMutation, LexCreateEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LexCreateEntryMutation, LexCreateEntryMutationVariables>(LexCreateEntryDocument, options);
      }
export type LexCreateEntryMutationHookResult = ReturnType<typeof useLexCreateEntryMutation>;
export type LexCreateEntryMutationResult = Apollo.MutationResult<LexCreateEntryMutation>;
export type LexCreateEntryMutationOptions = Apollo.BaseMutationOptions<LexCreateEntryMutation, LexCreateEntryMutationVariables>;
export const LexDeleteEntryDocument = gql`
    mutation lexDeleteEntry($lexicon: String!, $key: String!) {
  lexiconDeleteEntry(lexicon: $lexicon, key: $key)
}
    `;
export type LexDeleteEntryMutationFn = Apollo.MutationFunction<LexDeleteEntryMutation, LexDeleteEntryMutationVariables>;

/**
 * __useLexDeleteEntryMutation__
 *
 * To run a mutation, you first call `useLexDeleteEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLexDeleteEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lexDeleteEntryMutation, { data, loading, error }] = useLexDeleteEntryMutation({
 *   variables: {
 *      lexicon: // value for 'lexicon'
 *      key: // value for 'key'
 *   },
 * });
 */
export function useLexDeleteEntryMutation(baseOptions?: Apollo.MutationHookOptions<LexDeleteEntryMutation, LexDeleteEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LexDeleteEntryMutation, LexDeleteEntryMutationVariables>(LexDeleteEntryDocument, options);
      }
export type LexDeleteEntryMutationHookResult = ReturnType<typeof useLexDeleteEntryMutation>;
export type LexDeleteEntryMutationResult = Apollo.MutationResult<LexDeleteEntryMutation>;
export type LexDeleteEntryMutationOptions = Apollo.BaseMutationOptions<LexDeleteEntryMutation, LexDeleteEntryMutationVariables>;