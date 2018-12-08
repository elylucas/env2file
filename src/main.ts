import { env2file } from './cmds/env2file';
import * as commander from 'commander';

export const main = () => {
  const program = commander
    .version('0.0.2')
    .option(
      '-k, --key-prefix <keyPrefix>',
      'The prefix of you env vars, which will be stripped from the final variable names'
    )
    .option(
      '-f, --file <file>',
      'The output file of your environments (defaults to "./src/environments.ts"'
    )
    .option(
      '-o, --object-name <objectName>',
      'The name of the environments object, (defaults to "environment")'
    )
    .option(
      '-s, --skip-casing',
      'skips env2file from pascal casing your environment variables'
    )
    .parse(process.argv);

  const { keyPrefix, file, objectName, skipCasing } = program;

  env2file({ file, keyPrefix, objectName, skipCasing });

};
