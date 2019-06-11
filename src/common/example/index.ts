import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import renderer from '@dojo/framework/widget-core/vdom';
import Select from '../../select/index';
import { v, w } from '@dojo/framework/widget-core/d';
import { watch } from '@dojo/framework/widget-core/decorators/watch';
import Outlet from '@dojo/framework/routing/Outlet';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import Registry from '@dojo/framework/widget-core/Registry';
import Router from '@dojo/framework/routing/Router';

const modules = [
	{ value: '' },
	{ value: 'accordion-pane' },
	{ value: 'button' },
	{ value: 'outlined-button' },
	{ value: 'calendar' },
	{ value: 'card' },
	{ value: 'checkbox' },
	{ value: 'combobox' },
	{ value: 'dialog' },
	{ value: 'grid' },
	{ value: 'label' },
	{ value: 'listbox' },
	{ value: 'progress' },
	{ value: 'radio' },
	{ value: 'range-slider' },
	{ value: 'select' },
	{ value: 'slide-pane' },
	{ value: 'slider' },
	{ value: 'snackbar' },
	{ value: 'split-pane' },
	{ value: 'tab-controller' },
	{ value: 'text-area' },
	{ value: 'text-input' },
	{ value: 'time-picker' },
	{ value: 'title-pane' },
	{ value: 'toolbar' },
	{ value: 'tooltip' }
];

const registry = new Registry();
registerRouterInjector([{ path: '{module}', outlet: 'module' }], registry);

export default class App extends WidgetBase {
	@watch()
	private _module = '';

	private _onModuleChange(module: { value: string; label: string }) {
		const item = this.registry.getInjector<Router>('router')!;
		const router = item.injector();
		router.setPath(module.value);
	}

	private _renderItem = async () => {
		return import('src/' + this._module + '/example/index');
	};

	render() {
		return v('div', { id: 'module-select' }, [
			v('h2', ['Select a module to view']),
			w(Select, {
				onChange: this._onModuleChange,
				useNativeElement: true,
				label: 'Select a module to view',
				options: modules,
				value: this._module,
				getOptionValue: (module: any) => module
			}),
			w(Outlet, {
				id: 'module',
				renderer: (matchDetail: any) => {
					this._module = matchDetail.params.module;
					return w(
						{ label: this._module, registryItem: this._renderItem },
						{ key: this._module }
					);
				}
			})
		]);
	}
}

const r = renderer(() => w(App, {}));
r.mount({ registry });
