# env2file

env2file is a build utility that reads environment variables at build time and outputs a file to include in your front end applications.

Utilizes [dotenv](https://www.npmjs.com/package/dotenv) to provide a list and a set of defaults for your file.

With env2file, you can have a `.env` file like so:

```
MYAPP_PROD=false
MYAPP_NAME=bestAppEva
MYAPP_API=http://localhost:3000
MYAPP_LIMITS=39.44
MYAPP_OBJECT={"abc":123, "stuff": [{"name": "ely"}]}
```

And when you run `npx env2file -k MYAPP` have it output a `environment.ts` file such as:

```js
export const environment = {
  prod: false,
  name: 'bestAppEva',
  api: 'http://localhost:3000',
  limits: 39.44,
  object: { abc: 123, stuff: [{ name: 'ely' }] }
};
```
env2file will automatically attempt to convert your values to proper JS types (booleans, numbers, objects, and strings)

If you provide OS Environment Variables to your build, DotEnv will automatically replace the values in the `.env` file. This allows you to setup a local `.env` file for development, and have your build system override the values for specific environments (Testing/Staging/Prod).


## Install

```bash
npm install env2file
```

## Usage

env2file is a cli tool meant to be run before your build happens. It will read a `.env` file (located in the root of you project), replace any variables with those found in the current environment, and output a `./src/environment.ts` file. This file can then be imported into your project and used during runtime.

Only variables defined in the `.env` file will be output into the `environment.ts` file.

A common way to run env2file will be a pre build script, or as a hook in your front end framework's cli. For instance, if you have a npm build script, you can add a env2file script in your package.json file:

```js
"scripts": {
  "prebuild": "env2file",
  "build": "ng build",
}
```

or, for example, an Ionic pre build hook:

```json
"scripts": {
  "ionic:serve:before": "env2file",
  "ionic:build:before": "env2file"
}
```

## CLI Options

#### -V or --version
Display current version of env2file

#### -k or --key-prefix
If you prefix your env var (IE: MYAPP_VAR), specify the prefix (MYAPP), and env2file will strip it out from the name of the variable in the outputted environment object.

For instance, if your `.env` file looked like so:

```text
MYAPP_API=http://localhost.com:3000
```
running
```bash
npx env2file -k MY
```
will output a file like
```js
export const environment = {
  api: 'http://localhost.com:3000'
}
```

### -f or --file

Specifies the output file (defaults to ./src/environment.ts).

Though env2file outputs a TypeScript file, there is no TS in it, so it can easy be renamed to a JS file using this option.

### -o or --objectName

Specifies the name of the environments object that is exported from the file (defaults to environment).

### -s or --skip-casing

Skips turning the names of the variables into camelCase.
