# yargs-command-config

Richard Wen  
rrwen.dev@gmail.com  

* [Documentation](https://rrwen.github.io/yargs-command-config)

Yargs command for managing config files

[![npm version](https://badge.fury.io/js/yargs-command-config.svg)](https://badge.fury.io/js/yargs-command-config)
[![Build Status](https://travis-ci.org/rrwen/yargs-command-config.svg?branch=master)](https://travis-ci.org/rrwen/yargs-command-config)
[![Coverage Status](https://coveralls.io/repos/github/rrwen/yargs-command-config/badge.svg?branch=master)](https://coveralls.io/github/rrwen/yargs-command-config?branch=master)
[![npm](https://img.shields.io/npm/dt/yargs-command-config.svg)](https://www.npmjs.com/package/yargs-command-config)
[![GitHub license](https://img.shields.io/github/license/rrwen/yargs-command-config.svg)](https://github.com/rrwen/yargs-command-config/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/rrwen/yargs-command-config.svg?style=social)](https://twitter.com/intent/tweet?text=Yargs%20command%20for%20managing%20config%20files:%20https%3A%2F%2Fgithub.com%2Frrwen%2Fyargs-command-config%20%23nodejs%20%23npm)

## Install

1. Install [Node.js](https://nodejs.org/en/) 
2. Install [yargs](https://www.npmjs.com/package/yargs) and [yargs-command-config](https://www.npmjs.com/package/yargs-command-config) via `npm `

```
npm install --save yargs yargs-command-config
```

For the latest developer version, see [Developer Install](#developer-install).

## Usage

Create a file named `bin.js` with the following contents:

```javascript
var yargs = require('yargs');

// (config) Load command with path to config JSON file
// Replace './path/to/config.json' with your config JSON file
var config = require('yargs-command-config')({file: './path/to/config.json'});

// (yargs) Add command to manage config file
var argv = yargs.command(config).argv;
```

Display help options for `bin.js` using [node](https://nodejs.org/api/cli.html):

```
node bin.js config help
```

The following will be displayed:

```
bin config <task> [key] [value] [--file]

manage default config

<task> is one of:

* set
* delete
* view
* clear
* reset

Set option to value
> set [key] [value]

Remove default option
> delete [key]

View default options
> view

Clear default options
> clear

Reset default options
> reset

Manage other config file
> set [key] [value] --file other.json
> delete [key] --file other.json
> view --file other.json
> clear --file other.json
> reset --file other.json

Options:
	--help	Show help	[boolean]
```

Default config files are managed with the commands below:

```
node bin.js config view
node bin.js config clear
node bin.js config reset
node bin.js config set key value
node bin.js config delete key
```

Other config files are managed by passing a path in the option `--file`:

```
node bin.js config view --file config.json
node bin.js config clear --file config.json
node bin.js config reset --file config.json
node bin.js config set key value --file config.json
node bin.js config delete key --file config.json
```

See [Documentation](https://rrwen.github.io/yargs-command-config) for more details.

## Contributions

### Report Contributions

Reports for issues and suggestions can be made using the [issue submission](https://github.com/rrwen/yargs-command-config/issues) interface.

When possible, ensure that your submission is:

* **Descriptive**: has informative title, explanations, and screenshots
* **Specific**: has details of environment (such as operating system and hardware) and software used
* **Reproducible**: has steps, code, and examples to reproduce the issue

### Code Contributions

Code contributions are submitted via [pull requests](https://help.github.com/articles/about-pull-requests/):

1. Ensure that you pass the [Tests](#tests)
2. Create a new [pull request](https://github.com/rrwen/yargs-command-config/pulls)
3. Provide an explanation of the changes

A template of the code contribution explanation is provided below:

```
## Purpose

The purpose can mention goals that include fixes to bugs, addition of features, and other improvements, etc.

## Description

The description is a short summary of the changes made such as improved speeds or features, and implementation details.

## Changes

The changes are a list of general edits made to the files and their respective components.
* `file_path1`:
	* `function_module_etc`: changed loop to map
	* `function_module_etc`: changed variable value
* `file_path2`:
	* `function_module_etc`: changed loop to map
	* `function_module_etc`: changed variable value

## Notes

The notes provide any additional text that do not fit into the above sections.
```

For more information, see [Developer Install](#developer-install) and [Implementation](#implementation).

## Developer Notes

### Developer Install

Install the latest developer version with `npm` from github:

```
npm install git+https://github.com/rrwen/yargs-command-config
```
  
Install from `git` cloned source:

1. Ensure [git](https://git-scm.com/) is installed
2. Clone into current path
3. Install via `npm`

```
git clone https://github.com/rrwen/yargs-command-config
cd yargs-command-config
npm install
```

### Tests

1. Clone into current path `git clone https://github.com/rrwen/yargs-command-config`
2. Enter into folder `cd yargs-command-config`
3. Ensure [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies) are installed and available
4. Run tests
5. Results are saved to [tests/log](tests/log) with each file corresponding to a version tested

```
npm install
npm test
```

### Documentation

Use [documentationjs](https://www.npmjs.com/package/documentation) to generate html documentation in the `docs` folder:

```
npm run docs
```

See [JSDoc style](http://usejsdoc.org/) for formatting syntax.

### Upload to Github

1. Ensure [git](https://git-scm.com/) is installed
2. Inside the `yargs-command-config` folder, add all files and commit changes
3. Push to github

```
git add .
git commit -a -m "Generic update"
git push
```

### Upload to npm

1. Update the version in `package.json`
2. Run tests and check for OK status
3. Generate documentation
4. Login to npm
5. Publish to npm

```
npm test
npm run docs
npm login
npm publish
```

### Implementation

The module [yargs-command-config](https://www.npmjs.com/package/yargs-command-config) uses the following npm packages for its implementation:

npm | Package
--- | ---
[yargs](https://www.npmjs.com/package/yargs) | Base command line argument parser
[fs](https://nodejs.org/api/fs.html) | Read and write [JSON](https://www.json.org/) config files

```
 yargs   <-- Parse command line arguments
    |
   fs   <-- JSON config files
```
