import * as path from 'path';
import { Project, InterfaceDeclaration, MethodSignature, PropertySignature } from 'ts-morph';

function getPropertyInterfaceName(value: string) {
	const result = value.replace(/-([a-z])/g, function(g) {
		return g[1].toUpperCase();
	});
	return `${result.charAt(0).toUpperCase() + result.slice(1)}Properties`;
}

export interface PropertyInterface {
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

function getWidgetProperties(propsInterface: InterfaceDeclaration): PropertyInterface[] {
	let properties: any[] = [];
	const baseInterfaces = propsInterface.getBaseDeclarations() as InterfaceDeclaration[];

	for (let i = 0; i < baseInterfaces.length; i++) {
		properties = [...properties, ...getWidgetProperties(baseInterfaces[i])];
	}
	const propNodes = [...propsInterface.getProperties(), ...propsInterface.getMethods()];
	for (let i = 0; i < propNodes.length; i++) {
		properties.push(format(propNodes[i]));
	}
	return properties;
}

export default function(config: { [index: string]: string }) {
	const project = new Project({
		tsConfigFilePath: path.join(__dirname, '..', '..', '..', 'tsconfig.json')
	});

	return Object.keys(config).reduce((props, widgetName): {
		[index: string]: PropertyInterface[];
	} => {
		const filename = config[widgetName] || 'index';
		let sourceFile = project.getSourceFile(`./src/${widgetName}/${filename}.ts`);
		if (!sourceFile) {
			sourceFile = project.getSourceFile(`./src/${widgetName}/${filename}.tsx`);
		}
		if (!sourceFile) {
			return props;
		}
		const propsInterface = sourceFile.getInterface(getPropertyInterfaceName(widgetName));
		if (!propsInterface) {
			console.warn(
				`could not find interface for ${widgetName} ${getPropertyInterfaceName(widgetName)}`
			);
			return props;
		}
		let properties = getWidgetProperties(propsInterface);
		properties.sort((a, b) => {
			if (a.optional && !b.optional) {
				return 1;
			}
			if (!a.optional && b.optional) {
				return -1;
			}
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
		return { ...props, [widgetName]: properties };
	}, {});
}
