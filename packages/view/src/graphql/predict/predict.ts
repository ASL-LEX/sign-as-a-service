/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PredictQueryVariables = Types.Exact<{
  lexicon: Types.Scalars['String']['input'];
  file: Types.Scalars['String']['input'];
}>;


export type PredictQuery = { __typename?: 'Query', predict: Array<{ __typename?: 'RecognitionResult', entry: { __typename?: 'LexiconEntry', key: string, primary: string, video: string, lexicon: string, associates: Array<string>, fields: any } }> };


export const PredictDocument = gql`
    query predict($lexicon: String!, $file: String!) {
  predict(lexicon: $lexicon, file: $file) {
    entry {
      key
      primary
      video
      lexicon
      associates
      fields
    }
  }
}
    `;

/**
 * __usePredictQuery__
 *
 * To run a query within a React component, call `usePredictQuery` and pass it any options that fit your needs.
 * When your component renders, `usePredictQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePredictQuery({
 *   variables: {
 *      lexicon: // value for 'lexicon'
 *      file: // value for 'file'
 *   },
 * });
 */
export function usePredictQuery(baseOptions: Apollo.QueryHookOptions<PredictQuery, PredictQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PredictQuery, PredictQueryVariables>(PredictDocument, options);
      }
export function usePredictLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PredictQuery, PredictQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PredictQuery, PredictQueryVariables>(PredictDocument, options);
        }
export type PredictQueryHookResult = ReturnType<typeof usePredictQuery>;
export type PredictLazyQueryHookResult = ReturnType<typeof usePredictLazyQuery>;
export type PredictQueryResult = Apollo.QueryResult<PredictQuery, PredictQueryVariables>;