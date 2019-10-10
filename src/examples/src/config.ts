import BasicAccordionPane from './widgets/accordion-pane/Basic';
import BasicButton from './widgets/button/Basic';
import BasicCalendar from './widgets/calendar/Basic';
import BasicCard from './widgets/card/Basic';
import BasicCheckbox from './widgets/checkbox/Basic';
import BasicCombobox from './widgets/combobox/Basic';
import BasicDialog from './widgets/dialog/Basic';
import BasicGrid from './widgets/grid/Basic';
import GridCustomFilterRenderer from './widgets/grid/CustomFilterRenderer';
import BasicLabel from './widgets/label/Basic';
import BasicListbox from './widgets/listbox/Basic';
import BasicOutlinedButton from './widgets/outlined-button/Basic';
import BasicProgress from './widgets/progress/Basic';
import BasicRadio from './widgets/radio/Basic';
import BasicRaisedButton from './widgets/raised-button/Basic';
import BasicRangeSlider from './widgets/range-slider/Basic';
import BasicSelect from './widgets/select/Basic';
import BasicSlidePane from './widgets/slide-pane/Basic';
import BasicSlider from './widgets/slider/Basic';
import BasicSnackbar from './widgets/snackbar/Basic';
import BasicSplitPane from './widgets/split-pane/Basic';
import BasicTabController from './widgets/tab-controller/Basic';
import DisabledTabController from './widgets/tab-controller/Disabled';
import BasicTextArea from './widgets/text-area/Basic';
import BasicTextInput from './widgets/text-input/Basic';
import TextInputWithLabel from './widgets/text-input/WithLabel';
import BasicTimePicker from './widgets/time-picker/Basic';
import BasicTitlePane from './widgets/title-pane/Basic';
import BasicToolbar from './widgets/toolbar/Basic';
import BasicTooltip from './widgets/tooltip/Basic';

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
	},
	combobox: {
		overview: {
			example: {
				module: BasicCombobox,
				filename: 'Basic'
			}
		}
	},
	dialog: {
		overview: {
			example: {
				module: BasicDialog,
				filename: 'Basic'
			}
		}
	},
	label: {
		overview: {
			example: {
				module: BasicLabel,
				filename: 'Basic'
			}
		}
	},
	listbox: {
		overview: {
			example: {
				module: BasicListbox,
				filename: 'Basic'
			}
		}
	},
	'outlined-button': {
		overview: {
			example: {
				module: BasicOutlinedButton,
				filename: 'Basic'
			}
		}
	},
	progress: {
		overview: {
			example: {
				module: BasicProgress,
				filename: 'Basic'
			}
		}
	},
	radio: {
		overview: {
			example: {
				module: BasicRadio,
				filename: 'Basic'
			}
		}
	},
	'raised-button': {
		overview: {
			example: {
				module: BasicRaisedButton,
				filename: 'Basic'
			}
		}
	},
	'range-slider': {
		overview: {
			example: {
				module: BasicRangeSlider,
				filename: 'Basic'
			}
		}
	},
	select: {
		overview: {
			example: {
				module: BasicSelect,
				filename: 'Basic'
			}
		}
	},
	'slide-pane': {
		overview: {
			example: {
				module: BasicSlidePane,
				filename: 'Basic'
			}
		}
	},
	slider: {
		overview: {
			example: {
				module: BasicSlider,
				filename: 'Basic'
			}
		}
	},
	snackbar: {
		overview: {
			example: {
				module: BasicSnackbar,
				filename: 'Basic'
			}
		}
	},
	'split-pane': {
		overview: {
			example: {
				module: BasicSplitPane,
				filename: 'Basic'
			}
		}
	},
	'text-area': {
		overview: {
			example: {
				module: BasicTextArea,
				filename: 'Basic'
			}
		}
	},
	'time-picker': {
		overview: {
			example: {
				module: BasicTimePicker,
				filename: 'Basic'
			}
		}
	},
	'title-pane': {
		overview: {
			example: {
				module: BasicTitlePane,
				filename: 'Basic'
			}
		}
	},
	toolbar: {
		overview: {
			example: {
				module: BasicToolbar,
				filename: 'Basic'
			}
		}
	},
	tooltip: {
		overview: {
			example: {
				module: BasicTooltip,
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
