import { Args, Command } from '@oclif/core';
import { GraphQLClient } from 'graphql-request';
import { readFileSync } from 'fs';
import { getSdk } from '../../graphql/graphql';
import { sharedFlags } from '../../shared';

export default class CreateLexicon extends Command {
  static description = 'Create a new Lexicon';

  static flags = {
    ...sharedFlags
  };

  static args = {
    lexicon: Args.file({
      name: 'lexicon',
      required: true,
      description: 'The file containing the Lexicon definition',
      parse: (input) => Promise.resolve(readFileSync(input).toString()),
      exists: true
    })
  };

  async run(): Promise<void> {
    const { flags, args } = await this.parse(CreateLexicon);

    // Make the GraphQL client
    const client = new GraphQLClient(flags.backend, {
      headers: {
        authorization: `Bearer: ${flags.auth}`
      }
    });
    const sdk = getSdk(client);

    // Make request for new Lexicon
    const response = await sdk.lexiconCreate({ lexicon: JSON.parse(args.lexicon) });
    console.log(response);
  }
}
