import { Args, Command, Flags } from '@oclif/core';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../../graphql/graphql';

export default class ClearLexiconEntries extends Command {
  static description = 'Remove all entries from a given lexicon';

  static flags = {
   backend: Flags.string({
      char: 'b',
      description: 'URL to the GraphQL endpoint to call against',
      required: false,
      default: 'http://localhost:3000/graphql'
    })
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
    const client = new GraphQLClient(flags.backend);
    const sdk = getSdk(client);

    // Make request to remove all lexicon entries
    await sdk.lexiconClearEntries({ lexicon: args.lexicon });
  }
}
