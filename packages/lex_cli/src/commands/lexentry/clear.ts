import { Args, Command } from '@oclif/core';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../../graphql/graphql';
import { sharedFlags } from '../../shared';

export default class ClearLexiconEntries extends Command {
  static description = 'Remove all entries from a given lexicon';

  static flags = {
    ...sharedFlags
  };

  static args = {
    lexicon: Args.string({
      name: 'lexicon',
      required: true,
      description: 'The ID of the Lexicon to clear entries from'
    })
  };

  async run(): Promise<void> {
    const { flags, args } = await this.parse(ClearLexiconEntries);

    // Make the GraphQL client
    const client = new GraphQLClient(flags.backend, {
      headers: {
        authorization: `Bearer: ${flags.auth}`
      }
    });
    const sdk = getSdk(client);

    // Make request to remove all lexicon entries
    await sdk.lexiconClearEntries({ lexicon: args.lexicon });
  }
}
