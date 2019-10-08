import globExamples from './glob-examples.block';
import * as path from 'path';
import {
	Project,
	InterfaceDeclaration,
	OptionalKind,
	PropertySignatureStructure,
	MethodSignatureStructure,
	MethodSignature,
	PropertySignature
} from 'ts-morph';

function getPropertyInterfaceName(value: string) {
	var result = value.replace(/-([a-z])/g, function(g) {
		return g[1].toUpperCase();
	});
	return `${result.charAt(0).toUpperCase() + result.slice(1)}Properties`;
}

interface PropertyInterface {
	name: string;
	type: string;
	optional: boolean;
	description?: string;
}

function format(prop: MethodSignature | PropertySignature): PropertyInterface {
	return {
		name: prop.getName(),
		type: prop.getType().getText(prop),
		optional: prop.hasQuestionToken() || false,
		description: prop.getJsDocs()[0] && prop.getJsDocs()[0].getComment()
	};
}

function a(propsInterface: InterfaceDeclaration) {
	let properties: any[] = [];
	const baseInterfaces = propsInterface.getBaseDeclarations();

	for (let i = 0; i < baseInterfaces.length; i++) {
		properties = [...properties, ...a(baseInterfaces[i] as any)];
	}
	const propNodes = [...propsInterface.getProperties(), ...propsInterface.getMethods()];
	for (let i = 0; i < propNodes.length; i++) {
		properties.push(format(propNodes[i]));
	}
	return properties;
}

export default function(config: any) {
	const examples = globExamples();
	const widgets = [...new Set<string>(examples.map((example) => example.split('/')[0]))];
	const project = new Project({
		tsConfigFilePath: path.join(__dirname, '..', '..', '..', 'tsconfig.json')
	});
	return widgets.reduce((properties, widget) => {
		console.warn(widget);
		const filename = config[widget].filename || 'index';
		let sourceFile = project.getSourceFile(`./src/${widget}/${filename}.ts`);
		if (!sourceFile) {
			sourceFile = project.getSourceFile(`./src/${widget}/${filename}.tsx`);
		}
		if (!sourceFile) {
			return properties;
		}
		const propsInterface = sourceFile.getInterface(getPropertyInterfaceName(widget));
		return { ...properties, [widget]: a(propsInterface) };
	}, {});
}
