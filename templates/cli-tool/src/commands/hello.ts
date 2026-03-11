import { Command, Args, Flags } from '@oclif/core';

export default class HelloCommand extends Command {
  static description = 'Say hello';

  static examples = [
    `$ {{BIN_NAME}} hello`,
    `$ {{BIN_NAME}} hello World`,
    `$ {{BIN_NAME}} hello World --verbose`,
  ];

  static args = {
    name: Args.string({
      description: 'Name to greet',
      required: false,
      default: 'World',
    }),
  };

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'Verbose output',
      required: false,
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(HelloCommand);

    if (flags.verbose) {
      this.log('Running in verbose mode');
    }

    this.log(`Hello, ${args.name}!`);
  }
}
