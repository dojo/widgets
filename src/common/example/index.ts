import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Select from '../../select/Select';
import { v, w } from '@dojo/widget-core/d';
import { Registry } from '@dojo/widget-core/Registry';
import dojoTheme from '../../themes/dojo/theme';

import accordionpane from './../../accordionpane/example/index';
import button from './../../button/example/index';
import calendar from './../../calendar/example/index';
import checkbox from './../../checkbox/example/index';
import combobox from './../../combobox/example/index';
import dialog from './../../dialog/example/index';
import label from './../../label/example/index';
import listbox from './../../listbox/example/index';
import radio from './../../radio/example/index';
import select from './../../select/example/index';
import slidepane from './../../slidepane/example/index';
import slider from './../../slider/example/index';
import splitpane from './../../splitpane/example/index';
import tabcontroller from './../../tabcontroller/example/index';
import textarea from './../../textarea/example/index';
import textinput from './../../textinput/example/index';
import timepicker from './../../timepicker/example/index';
import titlepane from './../../titlepane/example/index';
import tooltip from './../../tooltip/example/index';

const registry = new Registry();

const modules = [
	'accordionpane',
	'button',
	'calendar',
	'checkbox',
	'combobox',
	'dialog',
	'label',
	'listbox',
	'radio',
	'select',
	'slidepane',
	'slider',
	'splitpane',
	'tabcontroller',
	'textarea',
	'textinput',
	'timepicker',
	'titlepane',
	'tooltip'
];

registry.define('accordionpane', accordionpane);
registry.define('button', button);
registry.define('calendar', calendar);
registry.define('checkbox', checkbox);
registry.define('combobox', combobox);
registry.define('dialog', dialog);
registry.define('label', label);
registry.define('listbox', listbox);
registry.define('radio', radio);
registry.define('select', select);
registry.define('slidepane', slidepane);
registry.define('slider', slider);
registry.define('splitpane', splitpane);
registry.define('tabcontroller', tabcontroller);
registry.define('textarea', textarea);
registry.define('textinput', textinput);
registry.define('timepicker', timepicker);
registry.define('titlepane', titlepane);
registry.define('tooltip', tooltip);

export class App extends WidgetBase {
	private _module: string;
	private _theme = {};

	onModuleChange(module: any) {
		this._module = module;
		this.invalidate();
	}

	themeChange(event: any) {
		this._theme = event.target.checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', {
				innerHTML: 'Select a module to view'
			}),
			w(Select, {
				onChange: this.onModuleChange,
				useNativeElement: true,
				options: modules,
				getOptionValue: (module: any) => module,
				getOptionLabel: (module: any) => module
			}),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					styles: {
						'margin-top': '20px'
					},
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			this._module ? w<any>(this._module, { theme: this._theme }) : null
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append();
