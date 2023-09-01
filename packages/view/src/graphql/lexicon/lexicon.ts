/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LexFindAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LexFindAllQuery = { __typename?: 'Query', lexFindAll: Array<{ __typename?: 'Lexicon', _id: string, name: string, schema: any }> };

export type LexiconSearchQueryVariables = Types.Exact<{
  lexicon: Types.Scalars['String']['input'];
  search: Types.Scalars['String']['input'];
}>;


export type LexiconSearchQuery = { __typename?: 'Query', lexiconSearch: Array<{ __typename?: 'LexiconEntry', key: string, primary: string, video: string, associates: Array<string>, fields: any }> };


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
export const LexiconSearchDocument = gql`
    query lexiconSearch($lexicon: String!, $search: String!) {
  lexiconSearch(lexicon: $lexicon, search: $search) {
    key
    primary
    video
    associates
    fields
  }
}
    `;

/**
 * __useLexiconSearchQuery__
 *
 * To run a query within a React component, call `useLexiconSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useLexiconSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLexiconSearchQuery({
 *   variables: {
 *      lexicon: // value for 'lexicon'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useLexiconSearchQuery(baseOptions: Apollo.QueryHookOptions<LexiconSearchQuery, LexiconSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LexiconSearchQuery, LexiconSearchQueryVariables>(LexiconSearchDocument, options);
      }
export function useLexiconSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LexiconSearchQuery, LexiconSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LexiconSearchQuery, LexiconSearchQueryVariables>(LexiconSearchDocument, options);
        }
export type LexiconSearchQueryHookResult = ReturnType<typeof useLexiconSearchQuery>;
export type LexiconSearchLazyQueryHookResult = ReturnType<typeof useLexiconSearchLazyQuery>;
export type LexiconSearchQueryResult = Apollo.QueryResult<LexiconSearchQuery, LexiconSearchQueryVariables>;