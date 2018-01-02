// Richard Wen
// rrwen.dev@gmail.com

var fs = require('fs');

/**
 * Yargs command for managing config files.
 *
 * * {@link https://www.npmjs.com/package/yargs Yargs npm Package}
 * * {@link https://www.json.org/ JavaScript Object Notation (JSON)}
 *
 * @module config
 * @param {Object} [options={}] options for this function.
 * @param {string} options.file default path to JSON config file for yargs.
 *
 * * The command line argument `[file]` will take priority over `options.file` 
 *
 * @param {string} [options.command='config'] name of base `<config>` command.
 *
 * 1. **Original**: `config <task> [key] [value] [--file]`
 * 2. **options.command='newconfig':** `newconfig <task> [key] [value] [--file]`
 *
 * @param {Object} [options.defaults={}] default config object to be used.
 *
 *  * If `options.defaults` is undefined, the object `argv.config` will be used before defaulting to `{}` 
 *
 * @param {string} [options.describe='describe'] description for base `<config>` command.
 * @param {Object} [options.task={}] options for `<task>` commands.
 * @param {Object} [options.task.command='task'] name of `<task>` command.
 *
 * 1. **Original**: `config <task> [key] [value] [--file]`
 * 2. **options.task.command='newtask':** `config <newtask> [key] [value] [--file]`
 *
 * @param {string} [options.task.key='key'] name of optional `[key]` argument.
 *
 * 1. **Original**: `config <task> [key] [value] [--file]`
 * 2. **options.task.key='newkey':** `config <task> [newkey] [value] [--file]`
 *
 * @param {string} [options.task.value='value'] name of optional `[value]` argument.
 *
 * 1. **Original**: `config <task> [key] [value] [--file]`
 * 2. **options.task.value='newvalue':** `config <task> [key] [newvalue] [--file]`
 *
 * @param {string} [options.task.file='file'] name of optional `[--file]` argument.
 *
 * 1. **Original**: `config <task> [key] [value] [--file]`
 * 2. **options.task.file='newfile':** `config <task> [key] [value] [--newfile]`
 *
 * @param {Object} [options.task.reset='reset'] name of `<task`> command for `reset`.
 *
 * 1. **Original**: `config reset [--file]`
 * 2. **options.task.reset='newreset':** `config newreset [--file]`
 *
 * @param {Object} [options.task.clear='clear'] name of `<task`> command for `clear`.
 *
 * 1. **Original**: `config clear [--file]`
 * 2. **options.task.reset='newclear':** `config newclear [--file]`
 *
 * @param {Object} [options.task.view='view'] name of `<task`> command for `view`.
 *
 * 1. **Original**: `config view [--file]`
 * 2. **options.task.view='newview':** `config newview [--file]`
 *
 * @param {Object} [options.task.delete='delete'] name of `<task`> command for `delete`.
 *
 * 1. **Original**: `config delete [--file]`
 * 2. **options.task.delete='newdelete':** `config newdelete [key] [--file]`
 *
 * @param {Object} [options.task.set='set'] name of `<task`> command for `set`.
 *
 * 1. **Original**: `config set [--file]`
 * 2. **options.task.set='newset':** `config newset [key] [value] [--file]`
 *
 * @returns {Object} Yargs {@link https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module Command Module} with the following properties (`out` is the returned Object):
 *
 * * `out.command`: the command string in the form of `options.command <options.task.command> [options.task.key] [options.task.value] [--options.task.file]`
 * * `out.describe`: the description string for `out.command`
 * * `out.handler`: the function that manages the config file and returns an `argv` Object containing command line arguments
 *
 * @example
 * // *** DEFAULT ***
 *
 * var yargs = require('yargs');
 *
 * // (config) Load command with path to config JSON file
 * var config = require('yargs-command-config')({file: './path/to/config.json'});
 *
 * // (yargs) Add command to manage config file
 * var argv = yargs.command(config).argv;
 *
 * // *** CUSTOM ***
 *
 * var yargs = require('yargs');
 *
 * // (options_command) Setup command options
 * options = {};
 * options.command = 'config2';
 * options.defaults = {field: 'value'};
 * options.describe = 'Description';
 *
 * // (options_task) Setup task options
 * options.task = {};
 * options.task.command = 'task2';
 * options.task.key = 'key2';
 * options.task.value = 'value2';
 * options.task.file = 'file2';
 * options.task.reset = 'reset2';
 * options.task.clear = 'clear2';
 * options.task.view = 'view2';
 * options.task.delete = 'delete2';
 * options.task.set = 'set2';
 *
 * // (config) Load command with options
 * var config = require('yargs-command-config')(options);
 *
 * // (yargs) Add command to manage config file
 * var argv = yargs.command(config).argv;
 *
 */
module.exports = function(options) {
	options = options || {};
	
	// (default_task) Default task options
	options.task = options.task || {};
	options.task.command = options.task.command || 'task' ;
	options.task.key = options.task.key || 'key';
	options.task.value = options.task.value || 'value';
	options.task.file = options.task.file || 'file';
	options.task.reset = options.task.reset || 'reset';
	options.task.clear = options.task.clear || 'clear';
	options.task.view = options.task.view || 'view';
	options.task.delete = options.task.delete || 'delete';
	options.task.set = options.task.set || 'set';
	
	// (default) Default options
	options.command = options.command || 'config';
	options.describe = options.describe || 
		'manage default config' +
		'\n\n<' + options.task.command + '> is one of:' +
		'\n\n* ' + options.task.set +
		'\n* ' + options.task.delete +
		'\n* ' + options.task.view +
		'\n* ' + options.task.clear +
		'\n* ' + options.task.reset +
		'\n\nSet option to value' +
		'\n> ' +  options.task.set + ' [' + options.task.key + '] [' + options.task.value + ']' +
		'\n\nRemove default option' +
		'\n> ' + options.task.delete + ' [' + options.task.key + ']' +
		'\n\nView default options' +
		'\n> ' + options.task.view +
		'\n\nClear default options' +
		'\n> ' + options.task.clear +
		'\n\nReset default options' +
		'\n> ' + options.task.reset +
		'\n\nManage other config file' +
		'\n> ' +  options.task.set + ' [' + options.task.key + '] [' + options.task.value + ']' + ' --' + options.task.file + ' other.json' +
		'\n> ' + options.task.delete + ' [' + options.task.key + ']' +  ' --' + options.task.file + ' other.json' +
		'\n> ' + options.task.view + ' --' + options.task.file + ' other.json' +
		'\n> ' + options.task.clear + ' --' + options.task.file + ' other.json' +
		'\n> ' + options.task.reset + ' --' + options.task.file + ' other.json';
		
	// (command_module) Create yargs command module
	var out = {};
	out.command = options.command + ' <' + options.task.command + '> [' + options.task.key + '] [' + options.task.value + '] [--' + options.task.file +  ']';
	out.describe = options.describe;
	out.handler = function(argv) {
		var task = argv[options.task.command];
		var file = argv[options.task.file] || options.file;
		var defaults =  options.defaults || argv.config || {};
		
		// (json_read) Read json file or create if not exists
		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, JSON.stringify(defaults));
		}
		var json = JSON.parse(fs.readFileSync(file));
		
		// (json_reset) Reset json file to defaults
		if (task == options.task.reset) {
			json = defaults;
			fs.writeFileSync(file, JSON.stringify(json));
			console.log('Reset defaults');
		}
		
		// (json_clear) Clear json file
		if (task == options.task.clear) {
			json = {};
			fs.writeFileSync(file, JSON.stringify(json));
			console.log('Empty defaults');
		}
		
		// (json_view) View defaults
		if (task == options.task.view) {
			console.log(JSON.stringify(json, null, 2));
		}
		
		// (json_delete) Delete key from json file
		if (task == options.task.delete) {
			delete json[argv[options.task.key]];
			delete argv[argv[options.task.key]];
			fs.writeFileSync(file, JSON.stringify(json));
			console.log('Delete default', argv[options.task.key]);
		}
		
		// (json_set) Set key to value for json file
		if (task == options.task.set) {
			json[argv[options.task.key]] = argv[options.task.value];
			fs.writeFileSync(file, JSON.stringify(json));
			console.log('Set default', argv[options.task.key], 'to', argv[options.task.value]);
		}
		
		// (argv_return) Update argv with json
		Object.assign(argv, json);
		return argv;
	};
	return(out);
};

