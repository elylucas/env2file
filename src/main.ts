import { env2file } from './cmds/env2file';
import * as commander from 'commander';

export const main = () => {
  const program = commander
    .version('1.0.1')
    .option(
      '-k, --key-prefix <keyPrefix>',
      'The prefix of your env vars that will be read from the environment.'
    )
    .option(
      '-l, --list <keyList>',
      'Specify a comma delimited list of keys to read from the environment'
    )
    .option(
      '-f, --file <file>',
      'The output file of your environments (defaults to "./src/environments.ts"'
    )
    .option(
      '-e, --env-file <envFile>',
      'Specify a different environment file to use (defaults to .env)'
    )
    .option(
      '-o, --object-name <objectName>',
      'The name of the environments object, (defaults to "environment")'
    )
    .option(
      '-c, --skip-casing',
      'skips env2file from cameCasing your environment variables'
    )
    .option(
      '-r, --skip-rename',
      'skips stripping out your key prefix from the final environment name'
    )
    .parse(process.argv);

  const { envFile, keyPrefix, list, file, objectName, skipCasing, skipRename } = program;

  if(!keyPrefix && !list) {
    console.error('Either --key-prefix (-k) or --list (-l) is required');
    process.exit(1);
  }

  const keyList = list ? (list as string).split(',').map(s => s.trim()) : [];

  env2file({ envFile, file, keyList, keyPrefix, objectName, skipCasing, skipRename });

};
