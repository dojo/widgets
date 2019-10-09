import * as path from 'path';
import { Project } from 'ts-morph';

interface ThemeInterface {
	[index: string]: string[];
}

export default function(config: { [index: string]: string }): ThemeInterface {
	const project = new Project({
		tsConfigFilePath: path.join(__dirname, '..', '..', '..', 'tsconfig.json')
	});
	return Object.keys(config).reduce((properties, widget) => {
		let sourceFile = project.getSourceFile(`./src/theme/${widget}.m.css.d.ts`);
		if (!sourceFile) {
			return properties;
		}
		return { ...properties, [widget]: [...sourceFile.getExportedDeclarations().keys()] };
	}, {});
}
