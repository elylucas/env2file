# env2file

Env2file is a build utility that reads environment variables at build time and outputs a file to include in your front end applications.

It will automatically output a plain JavaScript object with properties that match OS environment variables that start with a certain prefix (provided with the `-k` option).

For instance, if you have environment variables MYAPP_API, and MYAPP_NAME and run 

```bash
env2file -k MYAPP
```
It will output a file like so

```js
export const environment = {
  api: 'http://localhost:3000',
  name: 'bestAppEva'
};
```

Env2file will automatically strip the prefix out of the environment variable name and camelCase it.

You can also create a `.env` file and env2file will use [dotenv](https://www.npmjs.com/package/dotenv) to provide a set of defaults for your file.

With env2file, you can have a `.env` file like so:

```
MYAPP_PROD=false
MYAPP_NAME=bestAppEva
MYAPP_API=http://localhost:3000
MYAPP_LIMITS=39.44
MYAPP_OBJECT={"abc":123}
```

And when you run `env2file -k MYAPP` it will output a `environment.ts` file such as:

```js
export const environment = {
  prod: false,
  name: 'bestAppEva',
  api: 'http://localhost:3000',
  limits: 39.44,
  object: { abc: 123 }
};
```
env2file will automatically attempt to convert your values to proper JS types (booleans, numbers, objects, and strings).

If you provide OS environment variables to your build, dotenv will automatically replace the values in the `.env` file. This allows you to setup a local `.env` file for development, and have your build system override the values for specific environments (Testing/Staging/Prod).


## Install

```bash
npm install env2file
```

## Usage

env2file is a cli tool meant to be run before your build happens. If you wish to provide a set of default variables, create a `.env` file in the root of your directory.

Now, have your build system (usually via npm scripts, see below) run:

```bash
env2file -k MYAPP
```

Setup your environment variables to use a certain prefix (ex MYAPP_APP), and use the `-k` flag to provide that prefix. All the variables with that prefix will be read from the OS and env2file will create a file at 
`./src/environment.ts`. This file can then be imported into your project and used during runtime.


A common way to run env2file will be a pre build script, or as a hook in your front end framework's cli. For instance, if you have a npm build script, you can add a env2file script in your package.json file:

```js
"scripts": {
  "prebuild": "env2file -k MYAPP",
  "build": "ng build",
}
```

or, for example, an Ionic pre build hook:

```json
"scripts": {
  "ionic:serve:before": "env2file -k MYAPP",
  "ionic:build:before": "env2file -k MYAPP"
}
```

If your variables are not setup to use a certain prefix, then you can provide a comma delimited list of variable names using the`-l` flag:

```bash
env2file -l API,USER,VERSION
```

## CLI Options

#### -V or --version
Display current version of env2file

#### -k or --key-prefix
If you prefix your env var (IE: MYAPP_VAR), specify the prefix (MYAPP), and env2file will find all the OS environment variables that start with this prefix and output them into your file. Env2file will also strip it out the prefix from the name of the variable in the outputted environment object so your file feels more like JavaScript.

For instance, if your `.env` file looked like so:

```text
MYAPP_API=http://localhost.com:3000
```
running
```bash
env2file -k MY
```
will output a file like
```js
export const environment = {
  api: 'http://localhost.com:3000'
}
```

### -l or --list

Provide a list of OS environment variables to output in your file, instead of having env2file output variables that match the prefix provided with `-k`.

> Note, ether `-k` or `-l` are required. For security purposes, env2file needs to know which variables you want exported, so that other secrets that might be in the OS environemnt variables don't mistakingly get exported.

### -f or --file

Specifies the output file (defaults to ./src/environment.ts).

> Though env2file outputs a TypeScript file by default, there is no TS in it, so it can easy be renamed to a JS file using this option.

### -o or --objectName

Specifies the name of the environments object that is exported from the file (defaults to environment).

### -s or --skip-casing

Skips turning the names of the variables into camelCase.

### -r or --skip-rename

Skips stripping out the prefix (provided by `-k`) as the property name in your outputted file.

## Building
```bash
npm run build
```

Tests to come soon.
