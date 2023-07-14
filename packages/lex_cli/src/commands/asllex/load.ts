import { Command } from '@oclif/core';

export default class AslLexLoad extends Command {
  static description = 'Load ASL-LEX';

  async run(): Promise<void> {
    this.log('Hello World');
  }
}
