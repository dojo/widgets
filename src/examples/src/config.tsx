import dojoTheme from '@dojo/widgets/theme/dojo';
import materialTheme from '@dojo/widgets/theme/material';

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
import DisabledCheckbox from './widgets/checkbox/Disabled';
import ReadonlyCheckbox from './widgets/checkbox/Readonly';
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
import Paginated from './widgets/grid/Paginated';
import ColumnResize from './widgets/grid/ColumnResize';
import Restful from './widgets/grid/Restful';
import Sorting from './widgets/grid/Sorting';
import AltTextIcon from './widgets/icon/AltText';
import BasicIcons from './widgets/icon/Basic';
import BasicLabel from './widgets/label/Basic';
import BasicListbox from './widgets/listbox/Basic';
import BasicMenu from './widgets/menu/Basic';
import ControlledMenu from './widgets/menu/Controlled';
import ItemRenderer from './widgets/menu/ItemRenderer';
import ListBox from './widgets/menu/ListBox';
import BasicNumberInput from './widgets/number-input/Basic';
import BasicOutlinedButton from './widgets/outlined-button/Basic';
import OutlinedDisabledSubmit from './widgets/outlined-button/DisabledSubmit';
import OutlinedToggleButton from './widgets/outlined-button/ToggleButton';
import BasicPassword from './widgets/password-input/Basic';
import BasicPopup from './widgets/popup/Basic';
import BasicProgress from './widgets/progress/Basic';
import BasicRadio from './widgets/radio/Basic';
import BasicRaisedButton from './widgets/raised-button/Basic';
import RaisedDisabledSubmit from './widgets/raised-button/DisabledSubmit';
import RaisedToggleButton from './widgets/raised-button/ToggleButton';
import BasicRangeSlider from './widgets/range-slider/Basic';
import BasicSelect from './widgets/select/Basic';
import BasicSlidePane from './widgets/slide-pane/Basic';
import BasicSlider from './widgets/slider/Basic';
import BasicSnackbar from './widgets/snackbar/Basic';
import ErrorSnackbar from './widgets/snackbar/Error';
import LeadingSnackbar from './widgets/snackbar/Leading';
import StackedSnackbar from './widgets/snackbar/Stacked';
import SuccessSnackbar from './widgets/snackbar/Success';
import BasicSplitPane from './widgets/split-pane/Basic';
import BasicTabController from './widgets/tab-controller/Basic';
import DisabledTabController from './widgets/tab-controller/Disabled';
import CloseableTabController from './widgets/tab-controller/Closeable';
import ButtonAlignmentTabController from './widgets/tab-controller/ButtonAlignment';
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
import HeadingCollapsedToolbar from './widgets/toolbar/HeadingCollapsed';
import BasicTooltip from './widgets/tooltip/Basic';
import ClickTooltip from './widgets/tooltip/Click';
import FocusTooltip from './widgets/tooltip/Focus';
import MenuPopup from './widgets/popup/MenuPopup';
import SetWidth from './widgets/popup/SetWidth';
import Underlay from './widgets/popup/Underlay';
import UnderlayDialog from './widgets/dialog/UnderlayDialog';
import ModalDialog from './widgets/dialog/ModalDialog';
import CloseableDialog from './widgets/dialog/CloseableDialog';

`!has('docs')`;
import testsContext from './tests';

const tests = typeof testsContext !== 'undefined' ? testsContext : { keys: () => [] };

export const config = {
	name: '@dojo/widgets',
	home: 'src/examples/README.md',
	themes: [
		{ label: 'dojo', theme: dojoTheme },
		{ label: 'material', theme: materialTheme },
		{ label: 'default', theme: {} }
	],
	tests,
	readmePath: (widget: string) => `src/${widget}/README.md`,
	widgetPath: (widget: string, filename: string) => `src/${widget}/${filename || 'index'}.tsx`,
	examplePath: (widget: string, filename: string) =>
		`src/examples/src/widgets/${widget}/${filename || 'index'}.tsx`,
	codesandboxPath: (widget: string, filename: string) => {
		return `https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widget}%2F${filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widget}%2F${filename}.tsx`;
	},
	widgets: {
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
			},
			examples: [
				{ title: 'Disabled', module: DisabledCheckbox, filename: 'Disabled' },
				{ title: 'Readonly', module: ReadonlyCheckbox, filename: 'Readonly' }
			]
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
			examples: [
				{
					filename: 'UnderlayDialog',
					module: UnderlayDialog,
					title: 'Dialog with and Underlay'
				},
				{
					filename: 'ModalDialog',
					module: ModalDialog,
					title: 'Modal Dialog'
				},
				{
					filename: 'CloseableDialog',
					module: CloseableDialog,
					title: 'Dialog with Configurable Closeability'
				}
			],
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
					filename: 'ColumnResize',
					module: ColumnResize,
					title: 'Grid with resizable columns'
				},
				{
					filename: 'Paginated',
					module: Paginated,
					title: 'Grid with traditional pagination'
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
		menu: {
			examples: [
				{
					description:
						'In this example, an activeIndex and onActiveIndexChange property are passed into the Menu allowing for thr active menu item to be controlled.',
					filename: 'Controlled',
					module: ControlledMenu,
					title: 'Controlled Active Index'
				},
				{
					filename: 'ItemRenderer',
					module: ItemRenderer,
					title: 'Item Renderer'
				},
				{
					description:
						'This example shows the menu used as a Listbox. This allows for a selection to be made and persisted. Useful for user selections and within selects / typeahead etc.',
					filename: 'ListBox',
					module: ListBox,
					title: 'List Box'
				}
			],
			overview: {
				example: {
					filename: 'Basic',
					module: BasicMenu
				}
			}
		},
		'password-input': {
			overview: {
				example: {
					filename: 'Basic',
					module: BasicPassword
				}
			}
		},
		popup: {
			overview: {
				example: {
					filename: 'Basic',
					module: BasicPopup
				}
			},
			examples: [
				{ title: 'Underlay', filename: 'Underlay', module: Underlay },
				{ title: 'Set Width', filename: 'SetWidth', module: SetWidth },
				{ title: 'Menu Popup', filename: 'MenuPopup', module: MenuPopup }
			]
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
			examples: [
				{
					filename: 'DisabledSubmit',
					module: OutlinedDisabledSubmit,
					title: 'Disabled Submit Button'
				},
				{
					filename: 'ToggleButton',
					module: OutlinedToggleButton,
					title: 'Toggle Button'
				}
			],
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
			examples: [
				{
					filename: 'DisabledSubmit',
					module: RaisedDisabledSubmit,
					title: 'Disabled Submit Button'
				},
				{
					filename: 'ToggleButton',
					module: RaisedToggleButton,
					title: 'Toggle Button'
				}
			],
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
			},
			examples: [
				{ filename: 'Error', module: ErrorSnackbar, title: 'Error Snackbar' },
				{ filename: 'Success', module: SuccessSnackbar, title: 'Success Snackbar' },
				{ filename: 'Stacked', module: StackedSnackbar, title: 'Stacked Snackbar' },
				{ filename: 'Leading', module: LeadingSnackbar, title: 'Leading Snackbar' }
			]
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
				},
				{
					filename: 'ButtonAlignment',
					module: ButtonAlignmentTabController,
					title: 'TabController with adjustable button alignment'
				},
				{
					filename: 'Closeable',
					module: CloseableTabController,
					title: 'TabController with closeable tab'
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
			},
			examples: [
				{
					title: 'Collapsed with heading',
					module: HeadingCollapsedToolbar,
					filename: 'HeadingCollapsed'
				}
			]
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
	}
};
export default config;
