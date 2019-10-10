import BasicTextInput from './widgets/text-input/Basic';
import TextInputWithLabel from './widgets/text-input/WithLabel';
import BasicButton from './widgets/button/Basic';
import BasicGrid from './widgets/grid/Basic';
import GridCustomFilterRenderer from './widgets/grid/CustomFilterRenderer';
import BasicTabController from './widgets/tab-controller/Basic';
import DisabledTabController from './widgets/tab-controller/Disabled';
import BasicAccordionPane from './widgets/accordion-pane/Basic';
import BasicCard from './widgets/card/Basic';
import BasicCalendar from './widgets/calendar/Basic';
import BasicCheckbox from './widgets/checkbox/Basic';

export interface ExampleConfig {
	title?: string;
	description?: string;
	module: any;
	filename: string;
}

export interface WidgetConfig {
	filename?: string;
	overview: {
		example: ExampleConfig;
	};
	examples?: ExampleConfig[];
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
				title: 'TextInput with Label',
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
				title: 'Grid with Custom Filter Renderer',
				module: GridCustomFilterRenderer,
				filename: 'CustomFilterRenderer'
			}
		]
	},
	'tab-controller': {
		filename: 'index',
		overview: {
			example: {
				module: BasicTabController,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'TabController with disabled tabs',
				module: DisabledTabController,
				filename: 'Disabled'
			}
		]
	},
	'accordion-pane': {
		filename: 'index',
		overview: {
			example: {
				module: BasicAccordionPane,
				filename: 'Basic'
			}
		}
	},
	card: {
		filename: 'index',
		overview: {
			example: {
				module: BasicCard,
				filename: 'Basic'
			}
		}
	},
	calendar: {
		filename: 'index',
		overview: {
			example: {
				module: BasicCalendar,
				filename: 'Basic'
			}
		}
	},
	checkbox: {
		filename: 'index',
		overview: {
			example: {
				module: BasicCheckbox,
				filename: 'Basic'
			}
		}
	}
};

export function getWidgetFileNames(config: Config): { [index: string]: string } {
	return Object.keys(config).reduce((newConfig, widget) => {
		return { ...newConfig, [widget]: config[widget].filename };
	}, {});
}

export default config;
