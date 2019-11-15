import BasicAccordionPane from './widgets/accordion-pane/Basic';
import Exclusive from './widgets/accordion-pane/Exclusive';
import BasicButton from './widgets/button/Basic';
import DisabledSubmit from './widgets/button/DisabledSubmit';
import ToggleButton from './widgets/button/ToggleButton';
import BasicCalendar from './widgets/calendar/Basic';
import FirstDayOfWeekCalendar from './widgets/calendar/CustomFirstWeekDay';
import LimitedRange from './widgets/calendar/LimitedRange';
import BasicCard from './widgets/card/Basic';
import BasicCheckboxGroup from './widgets/checkbox-group/Basic';
import CustomLabelCheckboxGroup from './widgets/checkbox-group/CustomLabel';
import CustomRendererCheckboxGroup from './widgets/checkbox-group/CustomRenderer';
import InitialValueCheckboxGroup from './widgets/checkbox-group/InitialValue';
import BasicCheckbox from './widgets/checkbox/Basic';
import BasicChip from './widgets/chip/Basic';
import ClickableChip from './widgets/chip/Clickable';
import ClickableClosableChip from './widgets/chip/ClickableClosable';
import ClosableChip from './widgets/chip/Closable';
import ClosableRendererChip from './widgets/chip/ClosableRenderer';
import DisabledChip from './widgets/chip/Disabled';
import IconChip from './widgets/chip/Icon';
import BasicCombobox from './widgets/combobox/Basic';
import BasicConstrainedInput from './widgets/constrained-input/Basic';
import Username from './widgets/constrained-input/Username';
import BasicDialog from './widgets/dialog/Basic';
import BasicEmailInput from './widgets/email-input/Basic';
import BasicGrid from './widgets/grid/Basic';
import CustomCellRenderer from './widgets/grid/CustomCellRenderer';
import GridCustomFilterRenderer from './widgets/grid/CustomFilterRenderer';
import CustomSortRenderer from './widgets/grid/CustomSortRenderer';
import EditableCells from './widgets/grid/EditableCells';
import Filtering from './widgets/grid/Filtering';
import Restful from './widgets/grid/Restful';
import Sorting from './widgets/grid/Sorting';
import AltTextIcon from './widgets/icon/AltText';
import BasicIcons from './widgets/icon/Basic';
import BasicLabel from './widgets/label/Basic';
import BasicListbox from './widgets/listbox/Basic';
import BasicNumberInput from './widgets/number-input/Basic';
import BasicOutlinedButton from './widgets/outlined-button/Basic';
import BasicProgress from './widgets/progress/Basic';
import BasicRadio from './widgets/radio/Basic';
import BasicRaisedButton from './widgets/raised-button/Basic';
import BasicRangeSlider from './widgets/range-slider/Basic';
import AdvancedOptions from './widgets/select/AdvancedOptions';
import BasicSelect from './widgets/select/Basic';
import NonNative from './widgets/select/NonNative';
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
import DisabledTextInput from './widgets/text-input/Disabled';
import HelperTextInput from './widgets/text-input/HelperText';
import HiddenLabelTextInput from './widgets/text-input/HiddenLabel';
import LeadingTrailingTextInput from './widgets/text-input/LeadingTrailing';
import ValidatedTextInput from './widgets/text-input/Validated';
import TextInputWithLabel from './widgets/text-input/WithLabel';
import TwelveHourTimePicker from './widgets/time-picker/12HourTime';
import BasicTimePicker from './widgets/time-picker/Basic';
import DisabledTimePicker from './widgets/time-picker/Disabled';
import DisabledMenuItemsTimePicker from './widgets/time-picker/DisabledMenuItems';
import FilteredOnInputTimePicker from './widgets/time-picker/FilteredOnInput';
import NativeTimePicker from './widgets/time-picker/Native';
import OpenOnFocusTimePicker from './widgets/time-picker/OpenOnFocus';
import RequiredTimePicker from './widgets/time-picker/Required';
import SelectBySecondTimePicker from './widgets/time-picker/SelectBySecond';
import BasicTitlePane from './widgets/title-pane/Basic';
import HeadingLevel from './widgets/title-pane/HeadingLevel';
import NonCloseable from './widgets/title-pane/NonCloseable';
import BasicToolbar from './widgets/toolbar/Basic';
import BasicTooltip from './widgets/tooltip/Basic';
import ClickTooltip from './widgets/tooltip/Click';
import FocusTooltip from './widgets/tooltip/Focus';

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
	'accordion-pane': {
		examples: [
			{
				filename: 'Exclusive',
				module: Exclusive
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicAccordionPane
			}
		}
	},
	button: {
		examples: [
			{
				filename: 'DisabledSubmit',
				module: DisabledSubmit,
				title: 'Disabled Submit Button'
			},
			{
				filename: 'ToggleButton',
				module: ToggleButton,
				title: 'Toggle Button'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicButton
			}
		}
	},
	calendar: {
		examples: [
			{
				filename: 'CustomFirstWeekDay',
				module: FirstDayOfWeekCalendar,
				title: 'Custom First Day of Week'
			},
			{
				description: 'Demonstrates limiting the selectable region of the calendar.',
				filename: 'LimitedRange',
				module: LimitedRange,
				title: 'Limited Date Range'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicCalendar
			}
		}
	},
	card: {
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicCard
			}
		}
	},
	checkbox: {
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicCheckbox
			}
		}
	},
	'checkbox-group': {
		examples: [
			{
				filename: 'InitialValue',
				module: InitialValueCheckboxGroup,
				title: 'Initial Value'
			},
			{
				filename: 'CustomLabel',
				module: CustomLabelCheckboxGroup,
				title: 'Custom Label'
			},
			{
				filename: 'CustomRenderer',
				module: CustomRendererCheckboxGroup,
				title: 'Custom Renderer'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicCheckboxGroup
			}
		}
	},
	chip: {
		examples: [
			{
				filename: 'Icon',
				module: IconChip,
				title: 'Icon'
			},
			{
				filename: 'Clickable',
				module: ClickableChip,
				title: 'Clickable'
			},
			{
				filename: 'Disabled',
				module: DisabledChip,
				title: 'Disabled'
			},
			{
				filename: 'Closable',
				module: ClosableChip,
				title: 'Closable'
			},
			{
				filename: 'ClosableRenderer',
				module: ClosableRendererChip,
				title: 'Closable Renderer'
			},
			{
				filename: 'ClickableClosable',
				module: ClickableClosableChip,
				title: 'Clickable and Closable'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicChip
			}
		}
	},
	combobox: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicCombobox
			}
		}
	},
	'constrained-input': {
		examples: [
			{
				filename: 'Username',
				module: Username,
				title: 'Username'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicConstrainedInput
			}
		}
	},
	dialog: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicDialog
			}
		}
	},
	'email-input': {
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicEmailInput
			}
		}
	},
	grid: {
		examples: [
			{
				filename: 'Sorting',
				module: Sorting,
				title: 'Grid with Sorting'
			},
			{
				filename: 'Filtering',
				module: Filtering,
				title: 'Grid with Filtered Columns'
			},
			{
				filename: 'CustomCellRenderer',
				module: CustomCellRenderer,
				title: 'Grid with Custom Cell Rendering'
			},
			{
				filename: 'CustomFilterRenderer',
				module: GridCustomFilterRenderer,
				title: 'Grid with Custom Filter Renderer'
			},
			{
				filename: 'CustomSortRenderer',
				module: CustomSortRenderer,
				title: 'Grid with Customized Sort Rendering'
			},
			{
				filename: 'Restful',
				module: Restful,
				title: 'Grid with Data Loaded from a Remote Resource (REST)'
			},
			{
				description: 'Demonstrates using the grid utilities to support editable cells',
				filename: 'EditableCells',
				module: EditableCells,
				title: 'Grid with Editable Cells'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicGrid
			}
		}
	},
	icon: {
		examples: [
			{
				filename: 'AltText',
				module: AltTextIcon,
				title: 'With alt text'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicIcons
			}
		}
	},
	label: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicLabel
			}
		}
	},
	listbox: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicListbox
			}
		}
	},
	'number-input': {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicNumberInput
			}
		}
	},
	'outlined-button': {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicOutlinedButton
			}
		}
	},
	progress: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicProgress
			}
		}
	},
	radio: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicRadio
			}
		}
	},
	'raised-button': {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicRaisedButton
			}
		}
	},
	'range-slider': {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicRangeSlider
			}
		}
	},
	select: {
		examples: [
			{
				filename: 'AdvancedOptions',
				module: AdvancedOptions,
				title: 'Advanced options'
			},
			{
				filename: 'NonNative',
				module: NonNative,
				title: 'Non Native'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicSelect
			}
		}
	},
	'slide-pane': {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicSlidePane
			}
		}
	},
	slider: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicSlider
			}
		}
	},
	snackbar: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicSnackbar
			}
		}
	},
	'split-pane': {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicSplitPane
			}
		}
	},
	'tab-controller': {
		examples: [
			{
				filename: 'Disabled',
				module: DisabledTabController,
				title: 'TabController with disabled tabs'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicTabController
			}
		}
	},
	'text-area': {
		examples: [
			{
				filename: 'Disabled',
				module: DisabledTextArea,
				title: 'Disabled'
			},
			{
				filename: 'HelperText',
				module: HelperTextTextArea,
				title: 'Helper text'
			},
			{
				filename: 'HiddenLabel',
				module: HiddenLabelTextArea,
				title: 'Hidden label'
			},
			{
				filename: 'ValidatedCustom',
				module: ValidatedCustomTextArea,
				title: 'Validated with custom validator'
			},
			{
				filename: 'ValidatedRequired',
				module: ValidatedRequiredTextArea,
				title: 'Validated required'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicTextArea
			}
		}
	},
	'text-input': {
		examples: [
			{
				filename: 'WithLabel',
				module: TextInputWithLabel,
				title: 'TextInput with Label'
			},
			{
				filename: 'HiddenLabel',
				module: HiddenLabelTextInput,
				title: 'TextInput with hidden label'
			},
			{
				filename: 'Disabled',
				module: DisabledTextInput,
				title: 'Disabled TextInput'
			},
			{
				filename: 'Validated',
				module: ValidatedTextInput,
				title: 'Validated TextInput'
			},
			{
				filename: 'HelperText',
				module: HelperTextInput,
				title: 'TextInput with helper text'
			},
			{
				filename: 'LeadingTrailing',
				module: LeadingTrailingTextInput,
				title: 'TextInput with leading and trailing'
			}
		],
		filename: 'index',
		overview: {
			example: {
				filename: 'Basic',
				module: BasicTextInput
			}
		}
	},
	'time-picker': {
		examples: [
			{
				filename: 'FilteredOnInput',
				module: FilteredOnInputTimePicker,
				title: 'Filtered on input'
			},
			{
				filename: 'OpensOnFocus',
				module: OpenOnFocusTimePicker,
				title: 'Opens on focus'
			},
			{
				filename: 'DisabledMenuItems',
				module: DisabledMenuItemsTimePicker,
				title: 'Disabled menu items'
			},
			{
				filename: 'Disabled',
				module: DisabledTimePicker,
				title: 'Disabled time picker'
			},
			{
				filename: 'SelectBySecond',
				module: SelectBySecondTimePicker,
				title: 'Select time by the second'
			},
			{
				filename: '12HourTime',
				module: TwelveHourTimePicker,
				title: '12 hour time'
			},
			{
				filename: 'Required',
				module: RequiredTimePicker,
				title: 'Required time picker'
			},
			{
				filename: 'Native',
				module: NativeTimePicker,
				title: 'Native time picker'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicTimePicker
			}
		}
	},
	'title-pane': {
		examples: [
			{
				filename: 'AriaHeadingLevel',
				module: HeadingLevel,
				title: 'Defined aria heading level'
			},
			{
				filename: 'NonCloseable',
				module: NonCloseable,
				title: 'Non closeable'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicTitlePane
			}
		}
	},
	toolbar: {
		overview: {
			example: {
				filename: 'Basic',
				module: BasicToolbar
			}
		}
	},
	tooltip: {
		examples: [
			{
				filename: 'Focus',
				module: FocusTooltip,
				title: 'Show on focus'
			},
			{
				filename: 'Click',
				module: ClickTooltip,
				title: 'Show on click'
			}
		],
		overview: {
			example: {
				filename: 'Basic',
				module: BasicTooltip
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
