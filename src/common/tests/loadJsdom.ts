import * as jsdom from 'jsdom';
import global from '@dojo/framework/shim/global';

const doc = jsdom.jsdom(`
	<!DOCTYPE html>
	<html>
	<head></head>
	<body></body>
	<html>
`);

global.document = doc;
global.window = doc.defaultView;
global.Element = function() {};

console.log('Loaded JSDOM...');
