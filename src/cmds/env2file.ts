import * as casing from 'case';
import * as dotenv from 'dotenv';
import { existsSync, mkdirSync, writeFile } from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as prettier from 'prettier';

interface MakeEnvFileOptions {
  file?: string;
  keyPrefix?: string;
  objectName?: string;
  skipCasing?: boolean;
}

export const env2file = async ({
  file = 'src/environments.ts',
  keyPrefix = '',
  objectName = 'environment',
  skipCasing = false
}: MakeEnvFileOptions) => {
  const parsedEnvs = dotenv.config();
  const environmentDir = path.dirname(file);

  if (!parsedEnvs.parsed) {
    console.error('Nothing to parse. Did you make a .env file?');
    process.exit(1);
  }

  const envKeys = Object.keys(parsedEnvs.parsed!);

  const environmentTemplate = `export const ${objectName} = {
${envKeys
    .map(key => {
      const keyToUse = keyPrefix ? key.replace(keyPrefix, '') : key;
      return `'${skipCasing ? keyToUse : casing.camel(keyToUse)}': ${getValue(
        process.env[key]
      )},\n`;
    })
    .join('')}}
`;

  await verifyDirectory(environmentDir);

  const formattedCode = await formatCode(environmentTemplate);

  await writeEnvFile(file, formattedCode);
};

const getValue = (val: any) => {
  //handle numbers
  if (!isNaN(val)) {
    return val;
  }
  if (typeof val === 'string') {
    //handle booleans
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    //handle objects
    try {
      const object = JSON.parse(val);
      return JSON.stringify(object);
    } catch {}
  }
  //all else are strings
  return `'${val}'`;
};

const verifyDirectory = dir => {
  return new Promise((resolve, reject) => {
    if (existsSync(dir)) {
      resolve();
    } else {
      if (!existsSync(dir)) {
        mkdirp(dir, err => {
          if (err) reject(err);
          resolve();
        });
      }
    }
  });
};

const formatCode = (code: string) => {
  return prettier.resolveConfig(process.cwd()).then(options => {
    options = options || {};
    options.parser = 'babylon';
    return prettier.format(code, options);
  });
};

const writeEnvFile = (path: string, code: string) => {
  return new Promise((resolve, reject) => {
    writeFile(path, code, err => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`Environment file generated at ${path}`);
        resolve();
      }
    });
  });
};
