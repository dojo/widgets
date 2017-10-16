require('ts-node').register({
	'compilerOptions': {
		module: 'commonjs',
		target: 'es6'
	},
	intern: {
		version: 4
	}
});

module.exports = require('./support/grunt');
