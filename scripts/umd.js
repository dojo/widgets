const glob = require('glob');
const fs = require('fs');

function wrapper(content) {
	return `(function (root, factory) {
if (typeof define === 'function' && define.amd) {
	define([], function () { return (factory()); });
} else if (typeof module === 'object' && module.exports) {
	module.exports = factory();
}
}(this, function () {
	return ${content};
}));`;
};

const files = glob.sync('dist/dev/src/**/*.m.css.js');

files.forEach((file) => {
	const content = require(`../${file}`);
	fs.writeFileSync(file, wrapper(JSON.stringify(content)), 'utf8');
});
