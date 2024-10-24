/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LexFindAllQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type LexFindAllQuery = { __typename?: 'Query', lexFindAll: Array<{ __typename?: 'Lexicon', _id: string, name: string, schema: any }> };

export type LexCreateMutationVariables = Types.Exact<{
  lexicon: Types.LexiconCreate;
}>;


export type LexCreateMutation = { __typename?: 'Mutation', lexiconCreate: { __typename?: 'Lexicon', _id: string, name: string, schema: any } };


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