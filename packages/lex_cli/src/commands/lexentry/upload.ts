import { Args, Command, Flags } from '@oclif/core';
import { GraphQLClient } from 'graphql-request';
import { AslLexTranslator } from '../../entry_translator/asllex';
import { getSdk } from '../../graphql/graphql';

export default class UploadLexiconEntries extends Command {
  static LEXICON_TYPES = {
    'asl-lex': AslLexTranslator
  };

  static description = 'Upload list of Lexicon entries from a file';

  static flags = {
    backend: Flags.string({
      char: 'b',
      description: 'URL to the GraphQL endpoint to call against',
      required: false,
      default: 'http://localhost:3000/graphql'
    }),
  };

  static args = {
    lexicon: Args.string({
      name: 'lexicon',
      required: true,
      description: 'ID of the Lexicon to upload against'
    }),
    entryFile: Args.file({
      name: 'entryFile',
      required: true,
      description: 'File containing the lexicon entries to upload'
    }),
    lexiconType: Args.string({
      name: 'lexiconType',
      required: true,
      description: 'The type of lexicon entry data, determines how to parse the provided file',
      options: Object.keys(this.LEXICON_TYPES)
    })
  };

  async run(): Promise<void> {
    const { flags, args } = await this.parse(UploadLexiconEntries);

    // Determine the correct translator and parse the provided file
    const Translator = UploadLexiconEntries.LEXICON_TYPES[args.lexiconType as keyof typeof UploadLexiconEntries.LEXICON_TYPES];
    const entries = await new Translator().translate(args.entryFile, args.lexicon);

    // Make GraphQL client
    const client = new GraphQLClient(flags.backend);
    const sdk = getSdk(client);

    // Make request to upload each entry
    for (const entry of entries) {
      await sdk.lexiconAddEntry({ entry });
    }

    console.log('success');
  }
}
