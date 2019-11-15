import BasicAccordionPane from './widgets/accordion-pane/Basic';
import BasicButton from './widgets/button/Basic';
import BasicCalendar from './widgets/calendar/Basic';
import FirstDayOfWeekCalendar from './widgets/calendar/CustomFirstWeekDay';
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
import Restful from './widgets/grid/Restful';
import BasicIcons from './widgets/icon/Basic';
import AltTextIcon from './widgets/icon/AltText';
import BasicLabel from './widgets/label/Basic';
import BasicListbox from './widgets/listbox/Basic';
import BasicNumberInput from './widgets/number-input/Basic';
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
import DisabledTextArea from './widgets/text-area/Disabled';
import HelperTextTextArea from './widgets/text-area/HelperText';
import HiddenLabelTextArea from './widgets/text-area/HiddenLabel';
import ValidatedCustomTextArea from './widgets/text-area/ValidatedCustom';
import ValidatedRequiredTextArea from './widgets/text-area/ValidatedRequired';
import BasicTextInput from './widgets/text-input/Basic';
import TextInputWithLabel from './widgets/text-input/WithLabel';
import DisabledTextInput from './widgets/text-input/Disabled';
import HiddenLabelTextInput from './widgets/text-input/HiddenLabel';
import ValidatedTextInput from './widgets/text-input/Validated';
import HelperTextInput from './widgets/text-input/HelperText';
import LeadingTrailingTextInput from './widgets/text-input/LeadingTrailing';
import BasicTimePicker from './widgets/time-picker/Basic';
import FilteredOnInputTimePicker from '@dojo/widgets/examples/src/widgets/time-picker/FilteredOnInput';
import OpenOnFocusTimePicker from './widgets/time-picker/OpenOnFocus';
import DisabledMenuItemsTimePicker from './widgets/time-picker/DisabledMenuItems';
import DisabledTimePicker from './widgets/time-picker/Disabled';
import SelectBySecondTimePicker from './widgets/time-picker/SelectBySecond';
import TwelveHourTimePicker from './widgets/time-picker/12HourTime';
import RequiredTimePicker from './widgets/time-picker/Required';
import NativeTimePicker from './widgets/time-picker/Native';
import BasicTitlePane from './widgets/title-pane/Basic';
import BasicToolbar from './widgets/toolbar/Basic';
import BasicTooltip from './widgets/tooltip/Basic';
import FocusTooltip from './widgets/tooltip/Focus';
import ClickTooltip from './widgets/tooltip/Click';
import BasicCheckboxGroup from './widgets/checkbox-group/Basic';
import InitialValueCheckboxGroup from './widgets/checkbox-group/InitialValue';
import CustomLabelCheckboxGroup from './widgets/checkbox-group/CustomLabel';
import CustomRendererCheckboxGroup from './widgets/checkbox-group/CustomRenderer';
import BasicChip from './widgets/chip/Basic';
import IconChip from './widgets/chip/Icon';
import ClickableChip from './widgets/chip/Clickable';
import DisabledChip from './widgets/chip/Disabled';
import ClosableChip from './widgets/chip/Closable';
import ClickableClosableChip from './widgets/chip/ClickableClosable';
import ClosableRendererChip from './widgets/chip/ClosableRenderer';
import HeadingLevel from './widgets/title-pane/HeadingLevel';
import NonCloseable from './widgets/title-pane/NonCloseable';
import AdvancedOptions from './widgets/select/AdvancedOptions';
import NonNative from './widgets/select/NonNative';
import Exclusive from './widgets/accordion-pane/Exclusive';
import DisabledSubmit from './widgets/button/DisabledSubmit';
import ToggleButton from './widgets/button/ToggleButton';
import LimitedRange from './widgets/calendar/LimitedRange';
import BasicConstrainedInput from './widgets/constrained-input/Basic';
import Username from './widgets/constrained-input/Username';

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
		},
		examples: [
			{
				title: 'Disabled Submit Button',
				module: DisabledSubmit,
				filename: 'DisabledSubmit'
			},
			{
				title: 'Toggle Button',
				module: ToggleButton,
				filename: 'ToggleButton'
			}
		]
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
				module: Restful,
				filename: 'Restful'
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
		},
		examples: [
			{
				module: Exclusive,
				filename: 'Exclusive'
			}
		]
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
		},
		examples: [
			{
				title: 'Custom First Day of Week',
				module: FirstDayOfWeekCalendar,
				filename: 'CustomFirstWeekDay'
			},
			{
				title: 'Limited Date Range',
				module: LimitedRange,
				filename: 'LimitedRange',
				description: 'Demonstrates limiting the selectable region of the calendar.'
			}
		]
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
	chip: {
		filename: 'index',
		overview: {
			example: {
				module: BasicChip,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'Icon',
				module: IconChip,
				filename: 'Icon'
			},
			{
				title: 'Clickable',
				module: ClickableChip,
				filename: 'Clickable'
			},
			{
				title: 'Disabled',
				module: DisabledChip,
				filename: 'Disabled'
			},
			{
				title: 'Closable',
				module: ClosableChip,
				filename: 'Closable'
			},
			{
				title: 'Closable Renderer',
				module: ClosableRendererChip,
				filename: 'ClosableRenderer'
			},
			{
				title: 'Clickable and Closable',
				module: ClickableClosableChip,
				filename: 'ClickableClosable'
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
	icon: {
		overview: {
			example: {
				module: BasicIcons,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'With alt text',
				module: AltTextIcon,
				filename: 'AltText'
			}
		]
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
	'number-input': {
		overview: {
			example: {
				module: BasicNumberInput,
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
		},
		examples: [
			{ title: 'Advanced options', module: AdvancedOptions, filename: 'AdvancedOptions' },
			{ title: 'Non Native', module: NonNative, filename: 'NonNative' }
		]
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
		},
		examples: [
			{
				title: 'Disabled',
				module: DisabledTextArea,
				filename: 'Disabled'
			},
			{
				title: 'Helper text',
				module: HelperTextTextArea,
				filename: 'HelperText'
			},
			{
				title: 'Hidden label',
				module: HiddenLabelTextArea,
				filename: 'HiddenLabel'
			},
			{
				title: 'Validated with custom validator',
				module: ValidatedCustomTextArea,
				filename: 'ValidatedCustom'
			},
			{
				title: 'Validated required',
				module: ValidatedRequiredTextArea,
				filename: 'ValidatedRequired'
			}
		]
	},
	'time-picker': {
		overview: {
			example: {
				module: BasicTimePicker,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'Filtered on input',
				module: FilteredOnInputTimePicker,
				filename: 'FilteredOnInput'
			},
			{
				title: 'Opens on focus',
				module: OpenOnFocusTimePicker,
				filename: 'OpensOnFocus'
			},
			{
				title: 'Disabled menu items',
				module: DisabledMenuItemsTimePicker,
				filename: 'DisabledMenuItems'
			},
			{
				title: 'Disabled time picker',
				module: DisabledTimePicker,
				filename: 'Disabled'
			},
			{
				title: 'Select time by the second',
				module: SelectBySecondTimePicker,
				filename: 'SelectBySecond'
			},
			{
				title: '12 hour time',
				module: TwelveHourTimePicker,
				filename: '12HourTime'
			},
			{
				title: 'Required time picker',
				module: RequiredTimePicker,
				filename: 'Required'
			},
			{
				title: 'Native time picker',
				module: NativeTimePicker,
				filename: 'Native'
			}
		]
	},
	'title-pane': {
		overview: {
			example: {
				module: BasicTitlePane,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'Defined aria heading level',
				module: HeadingLevel,
				filename: 'AriaHeadingLevel'
			},
			{
				title: 'Non closeable',
				module: NonCloseable,
				filename: 'NonCloseable'
			}
		]
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
		},
		examples: [
			{
				title: 'Show on focus',
				module: FocusTooltip,
				filename: 'Focus'
			},
			{
				title: 'Show on click',
				module: ClickTooltip,
				filename: 'Click'
			}
		]
	},
	'constrained-input': {
		overview: {
			example: {
				module: BasicConstrainedInput,
				filename: 'Basic'
			}
		},
		examples: [
			{
				title: 'Username',
				module: Username,
				filename: 'Username'
			}
		]
	}
};

export function getWidgetFileNames(config: Config): { [index: string]: string } {
	return Object.keys(config).reduce((newConfig, widget) => {
		return { ...newConfig, [widget]: config[widget].filename || 'index' };
	}, {});
}

export default config;
