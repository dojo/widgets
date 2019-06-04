import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import renderer from '@dojo/framework/core/vdom';
import Select from '../../select/index';
import { v, w } from '@dojo/framework/core/vdom';
import { watch } from '@dojo/framework/core/decorators/watch';
import Outlet from '@dojo/framework/routing/Outlet';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import Registry from '@dojo/framework/core/Registry';
import Router from '@dojo/framework/routing/Router';
import dojoTheme from '../../../node_modules/@dojo/themes/dojo/index';
import { registerThemeInjector } from '@dojo/framework/widget-core/mixins/Themed';
import Radio from '../../radio/index';

const modules = [
	'',
	'accordion-pane',
	'button',
	'outlined-button',
	'calendar',
	'card',
	'checkbox',
	'combobox',
	'dialog',
	'grid',
	'label',
	'listbox',
	'progress',
	'radio',
	'raised-button',
	'range-slider',
	'select',
	'slide-pane',
	'slider',
	'snackbar',
	'split-pane',
	'tab-controller',
	'text-area',
	'text-input',
	'time-picker',
	'title-pane',
	'toolbar',
	'tooltip'
];

interface ThemeOption {
	value: any;
	label: string;
}

let themes: ThemeOption[] = [
	{ label: 'none', value: undefined },
	{ label: 'dojo', value: dojoTheme }
];

const registry = new Registry();
registerRouterInjector([{ path: '{module}', outlet: 'module' }], registry);
const themeInjector = registerThemeInjector(undefined, registry);

export default class App extends WidgetBase {
	@watch()
	private _module = '';

	@watch()
	private _theme = themes[0].label;

	private _onModuleChange(module: string) {
		const item = this.registry.getInjector<Router>('router')!;
		const router = item.injector();
		router.setPath(module);
	}

	private _renderItem = async () => {
		return import('src/' + this._module + '/example/index');
	};

	private _onThemeChange(label: string) {
		const [theme] = themes.filter((theme: ThemeOption) => theme.label === label);
		if (theme) {
			themeInjector.set(theme.value);
			this._theme = theme.label;
		}
	}

	render() {
		return v('div', [
			v('fieldset', [
				v('legend', {}, ['Select Theme']),
				v(
					'div',
					themes.map((theme, index) => {
						return w(Radio, {
							key: theme.label.concat(index.toString()),
							checked: this._theme === theme.label,
							value: theme.label,
							label: theme.label,
							onChange: this._onThemeChange
						});
					})
				)
			]),
			v('div', { id: 'module-select' }, [
				v('h2', ['Select a module to view']),
				w(Select, {
					onChange: this._onModuleChange,
					useNativeElement: true,
					label: 'Select a module to view',
					options: modules,
					value: this._module,
					getOptionValue: (module: any) => module,
					getOptionLabel: (module: any) => module
				}),
				w(Outlet, {
					id: 'module',
					renderer: (matchDetail: any) => {
						if (this._module !== matchDetail.params.module) {
							this._module = matchDetail.params.module;
						}
						return w(
							{ label: this._module, registryItem: this._renderItem },
							{ key: this._module }
						);
					}
				})
			])
		]);
	}
}

const r = renderer(() => w(App, {}));
r.mount({ registry });
