// Richard Wen
// rrwen.dev@gmail.com

// (packages) Package dependencies
var config = require('../index.js');
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
var testFile = './tests/log/test_' + json.version.split('.').join('_') + '.txt';
test.createStream().pipe(fs.createWriteStream(testFile));
test.createStream().pipe(process.stdout);

// (test) Run tests
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
	
	// (test_default_reset) Test default reset
	var defaultHandler = config().handler;
	actual = defaultHandler({_: ['config'], task: 'reset', file: './tests/out/config.json'});
	expected = {_: ['config'], task: 'reset', file: './tests/out/config.json'};
	t.deepEquals(actual, expected, '(A) config reset');
	
	// (test_default_reset) Test default clear
	var defaultHandler = config().handler;
	actual = defaultHandler({_: ['config'], task: 'clear', file: './tests/out/config.json', config: {option: 'value'}});
	expected = {_: ['config'], task: 'clear', file: './tests/out/config.json', config: {option: 'value'}};
	t.deepEquals(actual, expected, '(A) config clear');
	
	t.end();
});
