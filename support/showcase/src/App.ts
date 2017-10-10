import { deepAssign } from '@dojo/core/lang';
import { DNode, WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';
import { Set } from '@dojo/shim/Set';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import dojoTheme from '@dojo/widgets/themes/dojo/theme';
import Task from '@dojo/core/async/Task';

import { OptionData } from '@dojo/widgets/select/SelectOption';
import AccordionPane from '@dojo/widgets/titlepane/TitlePane';
import Button from '@dojo/widgets/button/Button';
import Checkbox, { Mode } from '@dojo/widgets/checkbox/Checkbox';
import ComboBox from '@dojo/widgets/combobox/ComboBox';
import Dialog from '@dojo/widgets/dialog/Dialog';
import Radio from '@dojo/widgets/radio/Radio';
import Select from '@dojo/widgets/select/Select';
import SlidePane, { Align } from '@dojo/widgets/slidepane/SlidePane';
import Slider from '@dojo/widgets/slider/Slider';
import SplitPane, { Direction } from '@dojo/widgets/splitpane/SplitPane';
import Tab from '@dojo/widgets/tabcontroller/Tab';
import TabController from '@dojo/widgets/tabcontroller/TabController';
import Textarea from '@dojo/widgets/textarea/Textarea';
import TextInput from '@dojo/widgets/textinput/TextInput';
import TimePicker, { TimeUnits } from '@dojo/widgets/timepicker/TimePicker';
import TitlePane from '@dojo/widgets/titlepane/TitlePane';

import { dataLarge, dataSmall} from './data';
import * as css from './styles/app.m.css';

interface State {
	accordionPanes: string[];
	activeTabIndex: number;
	buttonPressed: boolean;
	checkboxBasic: boolean;
	checkboxToggle: boolean;
	closedTabKeys: string[];
	comboboxResults: { value: string; }[];
	comboboxValue: string;
	dialogOpen: boolean;
	loadingTab: boolean;
	multiselectValue: string;
	nestedSizeA: number | undefined;
	nestedSizeB: number | undefined;
	radioValue: string;
	selectValue: string;
	slidepaneOpen: boolean;
	sliderValue: number | undefined;
	textareaValue: string;
	textinputValue: string;
	timepickerOptions: TimeUnits[];
	timepickerValue: string;
	titlepaneOpen: boolean;
}

export const AppBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class App extends AppBase<WidgetProperties> {
	private _tabRefresh: Task<any>;
	private _openKeys = new Set<string>();
	private _state: State = {
		accordionPanes: [],
		activeTabIndex: 0,
		buttonPressed: false,
		checkboxBasic: false,
		checkboxToggle: false,
		closedTabKeys: [],
		comboboxResults: [],
		comboboxValue: '',
		dialogOpen: false,
		loadingTab: false,
		multiselectValue: '',
		nestedSizeA: undefined,
		nestedSizeB: undefined,
		radioValue: 'first',
		selectValue: '',
		slidepaneOpen: false,
		sliderValue: undefined,
		textareaValue: '',
		textinputValue: '',
		timepickerOptions: [],
		timepickerValue: '',
		titlepaneOpen: false
	};

	private refreshTabData() {
		return new Task((resolve, reject) => {
			setTimeout(resolve, 1500);
		});
	}

	private setState(state: Partial<State>) {
		this._state = deepAssign(this._state, state);
		this.invalidate();
	}

	protected render(): DNode | DNode[] {
		const {
			activeTabIndex,
			buttonPressed,
			checkboxBasic,
			checkboxToggle,
			closedTabKeys,
			comboboxResults,
			comboboxValue,
			dialogOpen,
			loadingTab,
			multiselectValue,
			nestedSizeA,
			nestedSizeB,
			radioValue,
			selectValue,
			slidepaneOpen,
			sliderValue,
			textareaValue,
			textinputValue,
			timepickerOptions,
			timepickerValue,
			titlepaneOpen
		} = this._state;

		return v('div', { classes: this.classes(css.content) }, [
			v('h1', [ 'Form components' ]),
			v('div', { classes: this.classes(css.component) }, [
				w(Button, {
					key: 'basic-button',
					theme: dojoTheme
				}, [ 'Basic' ])
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Button, {
					key: 'popup-button',
					theme: dojoTheme,
					popup: { expanded: false, id: 'fakeId' }
				}, [ 'Popup' ]),
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Button, {
					key: 'pressed-button',
					theme: dojoTheme,
					pressed: buttonPressed,
					onClick: () => {
						this.setState({ buttonPressed: !buttonPressed })
					}
				}, [ 'Toggle' ])
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Checkbox, {
					key: 'cb1',
					checked: checkboxBasic,
					label: 'Basic checkbox',
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ checkboxBasic: event.target.checked })
					},
					theme: dojoTheme
				}),
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Checkbox, {
					key: 'cb2',
					checked: checkboxToggle,
					label: 'Toggle checkbox',
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ checkboxToggle: event.target.checked })
					},
					theme: dojoTheme,
					mode: Mode.toggle
				})
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Radio, {
					key: 'r1',
					checked: radioValue === 'first',
					value: 'first',
					label: 'First option',
					name: 'sample-radios',
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ radioValue: event.target.value });
					},
					theme: dojoTheme
				}),
				w(Radio, {
					key: 'r2',
					checked: radioValue === 'second',
					value: 'second',
					label: 'Second option',
					name: 'sample-radios',
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ radioValue: event.target.value });
					},
					theme: dojoTheme
				}),
				w(Radio, {
					key: 'r3',
					checked: radioValue === 'third',
					value: 'third',
					label: 'Third option',
					name: 'sample-radios',
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ radioValue: event.target.value });
					},
					theme: dojoTheme
				})
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(TextInput, {
					placeholder: 'TextInput',
					value: textinputValue,
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ textinputValue: event.target.value });
					},
					theme: dojoTheme
				}),
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(ComboBox, {
					clearable: true,
					onChange: (value: string) => this.setState({ comboboxValue: value }),
					getResultLabel: (result: any) => result.value,
					onRequestResults: (value: string) => {
						const results = dataLarge.filter(item => {
							const match = item.value.toLowerCase().match(new RegExp('^' + value.toLowerCase()));
							return Boolean(match && match.length > 0);
						});

						this.setState({ comboboxResults: results });
					},
					openOnFocus: true,
					results: comboboxResults,
					value: comboboxValue,
					inputProperties: {
						placeholder: 'ComboBox'
					},
					theme: dojoTheme
				})
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(TimePicker, {
					inputProperties: {
						placeholder: 'TimePicker'
					},
					onChange: (value: string) => {
						this.setState({ timepickerValue: value });
					},
					onRequestOptions: (value: string, options: TimeUnits[]) => {
						this.setState({ timepickerOptions: options });
					},
					openOnFocus: true,
					options: timepickerOptions,
					step: 1800,
					theme: dojoTheme,
					value: timepickerValue
				}),
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Select, {
					key: 'select',
					options: dataSmall,
					value: selectValue,
					theme: dojoTheme,
					onChange: (option: OptionData) => {
						this.setState({ selectValue: option.value });
					}
				})
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Select, {
					key: 'multiselect',
					options: dataSmall,
					value: multiselectValue,
					multiple: true,
					theme: dojoTheme,
					onChange: (option: OptionData) => {
						this.setState({ multiselectValue: option.value });
					}
				})
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Slider, {
					value: sliderValue,
					outputIsTooltip: true,
					onInput: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ sliderValue: parseFloat(event.target.value) });
					},
					theme: dojoTheme
				})
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(Textarea, {
					columns: 40,
					rows: 5,
					placeholder: 'Hello, World',
					value: textareaValue,
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this.setState({ textareaValue: event.target.value });
					},
					theme: dojoTheme
				}),
			]),
			v('h1', [ 'Layout components' ]),
			v('div', { classes: this.classes(css.component) }, [
				w(Dialog, {
					title: 'Dialog',
					open: dialogOpen,
					underlay: true,
					closeable: true,
					onRequestClose: () => {
						this.setState({ dialogOpen: false })
					},
					theme: dojoTheme
				}, [
					`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Quisque id purus ipsum. Aenean ac purus purus.
					Nam sollicitudin varius augue, sed lacinia felis tempor in.`
				]),
				w(Button, {
					key: 'dialog-button',
					theme: dojoTheme,
					onClick: () => this.setState({ dialogOpen: true })
				}, [ 'Open Dialog' ])
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(SlidePane, {
					align: Align.right,
					onRequestClose: () => {
						this.setState({ slidepaneOpen: false })
					},
					open: slidepaneOpen,
					theme: dojoTheme,
					title: 'SlidePane',
					underlay: true
				}, [
					`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Quisque id purus ipsum. Aenean ac purus purus.
					Nam sollicitudin varius augue, sed lacinia felis tempor in.`
				]),
				w(Button, {
					key: 'slidepane-button',
					theme: dojoTheme,
					onClick: () => this.setState({ slidepaneOpen: true })
				}, [ 'Open SlidePane' ])
			]),
			v('div', { classes: this.classes(css.component) }, [
				v('div', {
					classes: this.classes(css.splitContainer)
				}, [
					w(SplitPane, {
						direction: Direction.row,
						onResize: (size: number) => {
							this.setState({ nestedSizeA: size });
						},
						size: nestedSizeA,
						theme: dojoTheme,
						trailing: w(SplitPane, {
							direction: Direction.column,
							onResize: (size: number) => {
								this.setState({ nestedSizeB: size });
							},
							size: nestedSizeB,
							theme: dojoTheme
						})
					})
				])
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(TitlePane, {
					open: titlepaneOpen,
					theme: dojoTheme,
					title: 'TitlePane',
					onRequestClose: () => {
						this.setState({ titlepaneOpen: false })
					},
					onRequestOpen: () => {
						this.setState({ titlepaneOpen: true })
					}
				}, [
					v('div', [
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue, sed lacinia felis tempor in. <br> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue, sed lacinia felis tempor in.'
					])
				])
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(AccordionPane, {
					theme: dojoTheme,
					onRequestClose: (key: string) => {
						this._openKeys.delete(key);
						this.setState({ accordionPanes: [...Array.from(this._openKeys)] });
					},
					onRequestOpen: (key: string) => {
						this._openKeys.add(key);
						this.setState({ accordionPanes: [...Array.from(this._openKeys)] });
					}
				}, [
					w(TitlePane, {
						title: 'Pane 1',
						key: 'foo'
					}, [ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.' ]),
					w(TitlePane, {
						title: 'Pane 2',
						key: 'bar'
					}, [ 'Ut non lectus vitae eros hendrerit pellentesque. In rhoncus ut lectus id tempus. Cras eget mauris scelerisque, condimentum ante sed, vehicula tellus. Donec congue ligula felis, a porta felis aliquet nec. Nulla mi lorem, efficitur nec lectus vehicula, vehicula varius eros.' ])
				])
			]),
			v('div', { classes: this.classes(css.component) }, [
				w(TabController, {
					theme: dojoTheme,
					activeIndex: activeTabIndex,
					onRequestTabClose: (index: number, key: string) => {
						this.setState({ closedTabKeys: [...closedTabKeys, key] });
					},
					onRequestTabChange: (index: number, key: string) => {
						this._tabRefresh && this._tabRefresh.cancel();
						if (key === 'async') {
							this.setState({
								activeTabIndex: 2,
								loadingTab: true
							});
							this._tabRefresh = this.refreshTabData().then(() => {
								this.setState({ loadingTab: false });
							});
						}
						else {
							this.setState({ activeTabIndex: index });
						}
					}
				}, [
					w(Tab, {
						theme: dojoTheme,
						key: 'default',
						label: 'Default'
					}, [
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in ex pharetra, iaculis turpis eget, tincidunt lorem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
					]),
					w(Tab, {
						theme: dojoTheme,
						disabled: true,
						key: 'disabled',
						label: 'Disabled'
					}, [
						'Sed nibh est, sollicitudin consectetur porta finibus, condimentum gravida purus. Phasellus varius fringilla erat, a dignissim nunc iaculis et. Curabitur eu neque erat. Integer id lacus nulla. Phasellus ut sem eget enim interdum interdum ac ac orci.'
					]),
					w(Tab, {
						theme: dojoTheme,
						key: 'async',
						label: 'Async'
					}, [
						loadingTab ? 'Loading...' : 'Curabitur id elit a tellus consequat maximus in non lorem. Donec sagittis porta aliquam. Nulla facilisi. Quisque sed mauris justo. Donec eu fringilla urna. Aenean vulputate ipsum imperdiet orci ornare tempor.'
					]),
					!includes(closedTabKeys, 'closeable') ? w(Tab, {
						theme: dojoTheme,
						closeable: true,
						key: 'closeable',
						label: 'Closeable'
					}, [
						'Nullam congue, massa in egestas sagittis, diam neque rutrum tellus, nec egestas metus tellus vel odio. Vivamus tincidunt quam nisl, sit amet venenatis purus bibendum eget. Phasellus fringilla ex vitae odio hendrerit, non volutpat orci rhoncus.'
					]) : null,
					w(Tab, {
						theme: dojoTheme,
						key: 'foo',
						label: 'Foobar'
					}, [
						'Sed nibh est, sollicitudin consectetur porta finibus, condimentum gravida purus. Phasellus varius fringilla erat, a dignissim nunc iaculis et. Curabitur eu neque erat. Integer id lacus nulla. Phasellus ut sem eget enim interdum interdum ac ac orci.'
					])
				])
			])
		]);
	}
}
