import BasicAccordionPane from './widgets/accordion-pane/Basic';
import BasicButton from './widgets/button/Basic';
import BasicCalendar from './widgets/calendar/Basic';
import BasicCard from './widgets/card/Basic';
import BasicCheckbox from './widgets/checkbox/Basic';
import BasicCombobox from './widgets/combobox/Basic';
import BasicDialog from './widgets/dialog/Basic';
import BasicGrid from './widgets/grid/Basic';
import GridCustomFilterRenderer from './widgets/grid/CustomFilterRenderer';
import CustomCellRenderer from './widgets/grid/CustomCellRenderer';
import Filtering from './widgets/grid/Filtering';
import Sorting from './widgets/grid/Sorting';
import EditableCells from './widgets/grid/EditableCells';
import CustomSortRenderer from './widgets/grid/CustomSortRenderer';
import RestfulGrid from './widgets/grid/Restful';
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
import DisabledTextInput from './widgets/text-input/Disabled';
import HiddenLabelTextInput from './widgets/text-input/HiddenLabel';
import ValidatedTextInput from './widgets/text-input/Validated';
import HelperTextInput from './widgets/text-input/HelperText';
import LeadingTrailingTextInput from './widgets/text-input/LeadingTrailing';
import BasicTimePicker from './widgets/time-picker/Basic';
import BasicTitlePane from './widgets/title-pane/Basic';
import BasicToolbar from './widgets/toolbar/Basic';
import BasicTooltip from './widgets/tooltip/Basic';
import BasicCheckboxGroup from './widgets/checkbox-group/Basic';
import InitialValueCheckboxGroup from './widgets/checkbox-group/InitialValue';
import CustomLabelCheckboxGroup from './widgets/checkbox-group/CustomLabel';
import CustomRendererCheckboxGroup from './widgets/checkbox-group/CustomRenderer';

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
			},
			{
				title: 'TextInput with hidden label',
				module: HiddenLabelTextInput,
				filename: 'HiddenLabel'
			},
			{
				title: 'Disabled TextInput',
				module: DisabledTextInput,
				filename: 'Disabled'
			},
			{
				title: 'Validated TextInput',
				module: ValidatedTextInput,
				filename: 'Validated'
			},
			{
				title: 'TextInput with helper text',
				module: HelperTextInput,
				filename: 'HelperText'
			},
			{
				title: 'TextInput with leading and trailing',
				module: LeadingTrailingTextInput,
				filename: 'LeadingTrailing'
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
				title: 'Grid with Sorting',
				module: Sorting,
				filename: 'Sorting'
			},
			{
				title: 'Grid with Filtered Columns',
				module: Filtering,
				filename: 'Filtering'
			},
			{
				title: 'Grid with Custom Cell Rendering',
				module: CustomCellRenderer,
				filename: 'CustomCellRenderer'
			},
			{
				title: 'Grid with Custom Filter Renderer',
				module: GridCustomFilterRenderer,
				filename: 'CustomFilterRenderer'
			},
			{
				title: 'Grid with Customized Sort Rendering',
				module: CustomSortRenderer,
				filename: 'CustomSortRenderer'
			},
			{
				title: 'Grid with Data Loaded from a Remote Resource (REST)',
				module: RestfulGrid,
				filename: 'RestfulGrid'
			},
			{
				title: 'Grid with Editable Cells',
				description: 'Demonstrates using the grid utilities to support editable cells',
				module: EditableCells,
				filename: 'EditableCells'
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
	'checkbox-group': {
		filename: 'index',
		overview: {
			example: {
				module: BasicCheckboxGroup,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'Initial Value',
				module: InitialValueCheckboxGroup,
				filename: 'InitialValue'
			},
			{
				title: 'Custom Label',
				module: CustomLabelCheckboxGroup,
				filename: 'CustomLabel'
			},
			{
				title: 'Custom Renderer',
				module: CustomRendererCheckboxGroup,
				filename: 'CustomRenderer'
			}
		]
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
		return { ...newConfig, [widget]: config[widget].filename || 'index' };
	}, {});
}

export default config;
