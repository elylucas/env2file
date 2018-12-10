import * as casing from 'case';
import * as dotenv from 'dotenv';
import { existsSync, writeFile } from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as prettier from 'prettier';

interface MakeEnvFileOptions {
  envFile?: string;
  file?: string;
  keyList?: string[];
  keyPrefix?: string;
  objectName?: string;
  skipCasing?: boolean;
  skipRename?: boolean;
}

export const env2file = async ({
  envFile = '.env',
  file = 'src/environment.ts',
  keyList = [],
  keyPrefix = '',
  objectName = 'environment',
  skipCasing = false,
  skipRename = false
}: MakeEnvFileOptions) => {
  const parsedEnvs = dotenv.config({
    path: path.resolve(process.cwd(), envFile)
  });
  const environmentDir = path.dirname(file);

  // if (!parsedEnvs.parsed) {
  //   console.error('Nothing to parse. Did you make a .env file?');
  //   process.exit(1);
  // }

  const envKeys = getKeys(keyPrefix, keyList);

  const environmentTemplate = `export const ${objectName} = {
${envKeys
    .map(key => {
      const keyToUse = skipRename ? key : key.replace(keyPrefix, '');
      return `'${skipCasing ? keyToUse : casing.camel(keyToUse)}': ${getValue(
        process.env[key]
      )},\n`;
    })
    .join('')}}
`;

  await createDirIfNeeded(environmentDir);

  const formattedCode = await formatCode(environmentTemplate);

  await writeEnvFileToDisk(file, formattedCode);
};

const getKeys = (keyPrefix: string, keyList: string[]) => {
  const objectKeys = Object.keys(process.env);
  if (keyList.length > 0) {
    return objectKeys.filter(key => {
      return keyList.includes(key);
    });
  }
  if (keyPrefix) {
    return objectKeys.filter(s => s.startsWith(keyPrefix));
  }
  return [];
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

const createDirIfNeeded = (dir: string) => {
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

const writeEnvFileToDisk = (path: string, code: string) => {
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
