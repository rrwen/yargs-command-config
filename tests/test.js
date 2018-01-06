// Richard Wen
// rrwen.dev@gmail.com

// (packages) Package dependencies
var fs = require('fs');
var moment = require('moment');
var test = require('tape');
var yargs = require('yargs');

// (test_info) Get package metadata
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var testedPackages = [];
for (var k in json.dependencies) {
	testedPackages.push(k + ' (' + json.dependencies[k] + ')');
}
var devPackages = [];
for (var k in json.devDependencies) {
	devPackages.push(k + ' (' + json.devDependencies[k] + ')');
}

// (test_log) Pipe tests to file and output
if (!fs.existsSync('./tests/log')){
	fs.mkdirSync('./tests/log');
}
if (!fs.existsSync('./tests/out')){
	fs.mkdirSync('./tests/out');
}
var testFile = './tests/log/test_' + json.version.split('.').join('_') + '.txt';
test.createStream().pipe(fs.createWriteStream(testFile));
test.createStream().pipe(process.stdout);

// (test) Run tests
console.log = function(){};
test('Tests for ' + json.name + ' (' + json.version + ')', t => {
	t.comment('Node.js (' + process.version + ')');
	t.comment('Description: ' + json.description);
	t.comment('Date: ' + moment().format('YYYY-MM-DD hh:mm:ss'));
	t.comment('Dependencies: ' + testedPackages.join(', '));
	t.comment('Developer: ' + devPackages.join(', '));
	
	// (test_variables) Test variables used for all tests
	var actual, expected;
	
	// (test_default) Tests on default options
	t.comment('(A) tests on default options');
	var config = require('../index.js');
	var defaultHandler = config().handler;
	
	// (test_default_clear) Test default clear command
	actual = defaultHandler({_: ['config'], task: 'clear', config: './tests/out/config.json', key: {option: 'value'}});
	expected = {_: ['config'], task: 'clear', config: './tests/out/config.json', key: {option: 'value'}};
	t.deepEquals(actual, expected, '(A) config clear');
	
	// (test_default_reset) Test default reset command
	actual = defaultHandler({_: ['config'], task: 'reset', config: './tests/out/config.json'});
	expected = {_: ['config'], task: 'reset', config: './tests/out/config.json'};
	t.deepEquals(actual, expected, '(A) config reset');
	
	// (test_default_view) Test default view command
	actual = defaultHandler({_: ['config'], config: './tests/out/config.json', task: 'view'});
	expected = {_: ['config'], config: './tests/out/config.json', task: 'view'};
	t.deepEquals(actual, expected, '(A) config view');
	
	// (test_default_set) Test default set command
	actual = defaultHandler({_: ['config'], task: 'set', config: './tests/out/config.json', key: 'field', value: 'value'});
	expected = {_: ['config'], task: 'set', config: './tests/out/config.json', key: 'field', value: 'value', field: 'value'};
	t.deepEquals(actual, expected, '(A) config set');
	
	// (test_default_delete) Test default delete command
	actual = defaultHandler({_: ['config'], task: 'delete', config: './tests/out/config.json', key: 'field'});
	expected = {_: ['config'], task: 'delete', config: './tests/out/config.json', key: 'field'};
	t.deepEquals(actual, expected, '(A) config delete');
	
	// (test_custom) Tests on custom options
	t.comment('(B) tests on custom options');
	config = require('../index.js')({
		file: './tests/out/config2.json',
		command: 'config2',
		defaults: {field: 'value'},
		describe: 'Description',
		task: {
			command: 'task2',
			key: 'key2',
			value: 'value2',
			config: 'config2',
			reset: 'reset2',
			clear: 'clear2',
			view: 'view2',
			delete: 'delete2',
			set: 'set2'
		}
	});
	var customHandler = config.handler;
	
	// (test_custom_clear) Test custom clear command
	actual = customHandler({_: ['config2'], task2: 'clear2', config: {option: 'value'}});
	expected = {_: ['config2'], task2: 'clear2', config: {option: 'value'}};
	t.deepEquals(actual, expected, '(B) config2 clear2');
	
	// (test_custom_reset) Test custom reset command
	actual = customHandler({_: ['config2'], task2: 'reset2'});
	expected = {_: ['config2'], task2: 'reset2', field: 'value'};
	t.deepEquals(actual, expected, '(B) config2 reset2');
	
	// (test_custom_view) Test custom view command
	actual = customHandler({_: ['config2'], config2: './tests/out/config2.json', task2: 'view2'});
	expected = {_: ['config2'], config2: './tests/out/config2.json', task2: 'view2', field: 'value'};
	t.deepEquals(actual, expected, '(B) config2 view2');
	
	// (test_custom_set) Test custom set command
	actual = customHandler({_: ['config2'], task2: 'set2', key2: 'field', value2: 'value2'});
	expected = {_: ['config2'], task2: 'set2', key2: 'field', value2: 'value2', field: 'value2'};
	t.deepEquals(actual, expected, '(B) config2 set2');
	
	// (test_custom_delete) Test custom delete command
	actual = customHandler({_: ['config2'], task2: 'delete2', key2: 'field'});
	expected = {_: ['config2'], task2: 'delete2', key2: 'field'};
	t.deepEquals(actual, expected, '(B) config2 delete2');
	
	// (test_end) End tests and cleanup files
	fs.unlinkSync('./tests/out/config.json');
	fs.unlinkSync('./tests/out/config2.json');
	t.end();
});
