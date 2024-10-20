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