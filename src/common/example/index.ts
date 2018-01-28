import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Select from '../../select/Select';
import { v, w } from '@dojo/widget-core/d';

const modules = [
	'accordionpane',
	'button',
	'calendar',
	'checkbox',
	'combobox',
	'dialog',
	'label',
	'listbox',
	'progress',
	'radio',
	'select',
	'slidepane',
	'slider',
	'splitpane',
	'tabcontroller',
	'textarea',
	'textinput',
	'enhancedtextinput',
	'timepicker',
	'titlepane',
	'toolbar',
	'tooltip'
];

export class App extends WidgetBase<WidgetProperties> {
	onModuleChange(module: any) {
		window.location.search = `?module=${module}`;
	}

	render() {
		return v('div', { id: 'module-select' }, [
			v('h2', {
				innerHTML: 'Select a module to view'
			}),
			w(Select, {
				onChange: this.onModuleChange,
				useNativeElement: true,
				label: 'Select a module to view',
				options: modules,
				getOptionValue: (module: any) => module,
				getOptionLabel: (module: any) => module
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
