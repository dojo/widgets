import globExamples from './glob-examples.block';
import * as path from 'path';
import {
	Project
} from 'ts-morph';

export default function() {
	const examples = globExamples();
	const widgets = [...new Set<string>(examples.map((example) => example.split('/')[0]))];
	const project = new Project({
		tsConfigFilePath: path.join(__dirname, '..', '..', '..', 'tsconfig.json')
	});
	return widgets.reduce((properties, widget) => {
		let sourceFile = project.getSourceFile(`./src/theme/${widget}.m.css.d.ts`);
		if (!sourceFile) {
			return properties;
		}
		return { ...properties, [widget]: [ ...sourceFile.getExportedDeclarations().keys() ] };
	}, {});
}
