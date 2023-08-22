import { Flags } from '@oclif/core';

export const sharedFlags = {
  backend: Flags.string({
    char: 'b',
    description: 'URL to the GraphQL endpoint to call against',
    required: false,
    default: 'http://localhost:3001/graphql'
  }),
  auth: Flags.string({
    char: 'a',
    description: 'Authentication token',
    required: true
  })
};
