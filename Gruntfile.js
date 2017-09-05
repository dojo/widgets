require('ts-node').register({
	'compilerOptions': {
		module: 'commonjs',
		target: 'es6'
	}
});

module.exports = require('./support/grunt');
