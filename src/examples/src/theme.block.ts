import * as postcss from 'postcss';
import * as fs from 'fs';
import * as path from 'canonical-path';
import { Project } from 'ts-morph';

interface ThemeInterface {
	[index: string]: { [index: string]: string };
}

export default function(config: { [index: string]: string }): ThemeInterface {
	const project = new Project({
		tsConfigFilePath: path.join(__dirname, '..', '..', '..', 'tsconfig.json')
	});
	return Object.keys(config).reduce((properties, widgetName) => {
		const classHash = {} as any;
		let comment = '';
		const filename = config[widgetName] || 'index';
		let sourceFile = project.getSourceFile(`./src/${widgetName}/${filename}.ts`);
		if (!sourceFile) {
			sourceFile = project.getSourceFile(`./src/${widgetName}/${filename}.tsx`);
		}
		if (sourceFile) {
			const imports = sourceFile!.getImportDeclarations();
			imports.forEach((importDeclaration) => {
				const moduleSpecifierValue = importDeclaration.getModuleSpecifierValue();
				const match = moduleSpecifierValue.match(/.*\/theme\/(.*\.m\.css)$/);
				if (match) {
					const cssFilename = match[1];
					const root = postcss.parse(fs.readFileSync(`./src/theme/${cssFilename}`));
					root.walk((node) => {
						if (node.type === 'comment') {
							comment = node.text;
						} else if (node.type === 'rule' && node.selector.match(/^\./)) {
							const selector = /^\.[a-zA-Z0-9]*/.exec(node.selector);
							if (selector && !classHash[selector[0]]) {
								classHash[selector[0]] = comment;
							}
							comment = '';
						} else {
							comment = '';
						}
					});
				}
			});
		}
		return { ...properties, [widgetName]: classHash };
	}, {});
}
