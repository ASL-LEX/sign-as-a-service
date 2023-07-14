import { Args, Command, Flags } from '@oclif/core';
import { GraphQLClient, request } from 'graphql-request';
import { readFileSync } from 'fs';
import { getSdk } from '../../graphql/graphql';

export default class CreateLexicon extends Command {
  static description = 'Create a new Lexicon';

  static flags = {
    backend: Flags.string({
      char: 'b',
      description: 'URL to the GraphQL endpoint to call against',
      required: false,
      default: 'http://localhost:3000/graphql'
    })
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

    console.log(args);

    const client = new GraphQLClient(flags.backend);
    const sdk = getSdk(client);

    const response = await sdk.lexiconCreate({ lexicon: JSON.parse(args.lexicon) });
    console.log(response);
  }
}
