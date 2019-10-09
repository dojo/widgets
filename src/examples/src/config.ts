import BasicTextInput from './widgets/text-input/Basic';
import TextInputWithLabel from './widgets/text-input/WithLabel';

import BasicButton from './widgets/button/Basic';

import BasicGrid from './widgets/grid/Basic';
import GridCustomFilterRenderer from './widgets/grid/CustomFilterRenderer';

export interface WidgetConfig {
	filename?: string;
	overview: {
		example: {
			module: any;
			filename: string;
		};
	};
	examples?: {
		module: any;
		filename: string;
	}[];
}

export interface Config {
	[index: string]: WidgetConfig;
}

export const config: Config = {
	'text-input': {
		filename: 'index',
		overview: {
			example: {
				module: BasicTextInput,
				filename: 'Basic'
			}
		},
		examples: [
			{
				module: TextInputWithLabel,
				filename: 'WithLabel'
			}
		]
	},
	button: {
		filename: 'index',
		overview: {
			example: {
				module: BasicButton,
				filename: 'Basic'
			}
		}
	},
	grid: {
		filename: 'index',
		overview: {
			example: {
				module: BasicGrid,
				filename: 'Basic'
			}
		},
		examples: [
			{
				module: GridCustomFilterRenderer,
				filename: 'CustomFilterRenderer'
			}
		]
	}
};

export function getWidgetFileNames(config: Config): { [index: string]: string } {
	return Object.keys(config).reduce((newConfig, widget) => {
		return { ...newConfig, [widget]: config[widget].filename };
	}, {});
}

export default config;
