const fs = require('fs');

const versionArg = process.argv.find((arg) => arg.indexOf('--release=') !== -1);

if (!versionArg) {
	throw new Error('Unable to release as could not as no release number specified');
}

const version = versionArg.split('=')[1];

if (!version) {
	throw new Error('Unable to release as could not as no release number specified');
}

const packageJson = require('../package.json');
packageJson.version = version;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8');
