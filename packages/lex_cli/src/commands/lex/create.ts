import { Command } from '@oclif/core';

export default class CreateLexicon extends Command {
  static description = 'Create a new Lexicon';

  async run(): Promise<void> {
    this.log('New lexicon created');
  }
}
