import globExamples from './glob-examples.block';
import * as fs from 'fs';
import * as path from 'path';
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['tsx']);

export default function() {
	const examples = globExamples();
	return examples.reduce((content, widget) => {
		const code = fs.readFileSync(path.join(__dirname, 'widgets', widget), 'utf8');
		content = { ...content, [widget]: Prism.highlight(code, Prism.languages.tsx, 'tsx') };
		return content;
	}, {});
}
