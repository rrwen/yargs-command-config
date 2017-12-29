// Richard Wen
// rrwen.dev@gmail.com

var fs = require('fs');

/**
 * Description.
 *
 * @module config
 * @param {Object} [options={}] parameter description.
 * @param {string} file JSON file path
 * @returns {Object} return description.
 *
 * @example
 * var config = require('yargs-json');
 */
module.exports = function(options) {
	options = options || {};
	file = options.file;
	
	// (default_task) Default task options
	options.task = options.task || {};
	options.task.command = options.task.command || 'task' ;
	options.task.reset = options.task.reset || 'reset';
	options.task.clear = options.task.clear || 'clear';
	options.task.view = options.task.view || 'view';
	options.task.delete = options.task.delete || 'delete';
	options.task.set = options.task.set || 'set';
	
	// (default) Default options
	options.command = options.command || 'config';
	options.option = options.option || 'option';
	options.value = options.value || 'value';
	options.defaults = options.defaults || {};
	options.describe = options.describe || 
		'manage default options' +
		'\n\n<' + options.task.command + '> is one of:' +
		'\n\n* ' + options.task.set +
		'\n* ' + options.task.delete +
		'\n* ' + options.task.view +
		'\n* ' + options.task.clear +
		'\n* ' + options.task.reset +
		'\n\nSet option to value' +
		'\n> ' +  options.task.set + ' [' + options.option + '] [' + options.value + ']' +
		'\n\nRemove default option' +
		'\n> ' + options.task.delete + ' [' + options.option + ']' +
		'\n\nView default options' +
		'\n> ' + options.task.view +
		'\n\nClear default options' +
		'\n> ' + options.task.clear +
		'\n\nReset default options' +
		'\n> ' + options.task.reset;
	
	// (command_module) Create yargs command module
	var out = {};
	out.command = options.command + ' <' + options.task.command + '> [' + options.option + '] [' + options.value + ']';
	out.describe = options.describe;
	out.handler = function(argv) {
		var task = argv.task;
		
		// (json_read) Read json file or create if not exists
		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, JSON.stringify(options.defaults));
		}
		var json = require(file);
		
		// (json_reset) Reset json file to defaults
		if (task == options.task.reset) {
			fs.writeFileSync(file, JSON.stringify(options.defaults));
			json = options.defaults;
			console.log('Reset defaults');
		}
		
		// (json_clear) Clear json file
		if (task == options.task.clear) {
			fs.writeFileSync(file, '{}');
			json = {};
			console.log('Empty defaults');
		}
		
		// (json_view) View defaults
		if (task == options.task.view) {
			console.log(JSON.stringify(json, null, 2));
		}
		
		// (json_delete) Delete key from json file
		if (task == options.task.delete) {
			delete json[argv.option];
			fs.writeFileSync(file, JSON.stringify(json));
			console.log('Delete default', argv.option);
		}
		
		// (json_set) Set key to value for json file
		if (task == options.task.set) {
			json[argv.option] = argv.value;
			fs.writeFileSync(file, JSON.stringify(json));
			console.log('Set default', argv.option, 'to', argv.value);
		}
		
		// (argv_return) Update argv with json
		Object.assign(argv, json);
		return argv;
	};
	return(out);
};

