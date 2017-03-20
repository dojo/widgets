import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import ThemeableMixin, { theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import * as appCss from './styles/app.css';
import * as menuCss from './styles/menu.css';

const AppBase = StatefulMixin(ThemeableMixin(WidgetBase));

@theme(appCss)
export class App extends AppBase<WidgetProperties> {
	toggleDisabled(event: Event) {
		this.setState({ disabled: (<any> event.target).checked });
	}

	toggleEvent(event: Event) {
		this.setState({
			expandOnClick: !(<any> event.target).checked,
			packageMenuHidden: true
		});
	}

	toggleSelected(key: string) {
		const selectedKey = `${key}Selected`;
		this.setState({ [selectedKey]: !this.state[selectedKey] });
	}

	render() {
		return v('div', [
			v('form', { classes: this.classes(appCss.options) }, [
				v('div', [
					v('input', {
						id: 'toggleEvent',
						type: 'checkbox',
						onchange: this.toggleEvent
					}),
					v('label', {
						for: 'toggleEvent'
					}, [ 'Show on hover' ])
				]),

				v('div', [
					v('input', {
						id: 'toggleDisabled',
						type: 'checkbox',
						onchange: this.toggleDisabled
					}),
					v('label', {
						for: 'toggleDisabled'
					}, [ 'Disable packages menu' ])
				])
			]),

			v('div', {
				classes: this.classes(appCss.demos)
			}, [
				this.renderFileMenu(),
				this.renderDojoMenu()
			])
		]);
	}

	renderDojoMenu() {
		const packages = [
			'cli',
			'compose',
			'core',
			'has',
			'interfaces',
			'i18n',
			'loader',
			'routing',
			'shim',
			'stores',
			'streams',
			'widget-core',
			'widgets'
		];

		const {
			disabled,
			expandOnClick,
			packageMenuHidden
		} = this.state;

		return w(Menu, {
			key: 'DojoMenu',
			overrideClasses: menuCss
		}, [
			w(MenuItem, {
				key: 'DojoMenuLabel',
				label: 'Dojo 2',
				overrideClasses: menuCss,
				url: 'http://dojo.io',
				external: true
			}),

			w(Menu, {
				disabled: <boolean> disabled,
				expandOnClick: <boolean> expandOnClick,
				hidden: <boolean> packageMenuHidden,
				key: 'menu1-sub1',
				label: 'Dojo 2 Packages',
				nested: true,
				onRequestHide: () => {
					this.setState({ packageMenuHidden: true });
				},
				onRequestShow: () => {
					this.setState({ packageMenuHidden: false });
				},
				overrideClasses: menuCss
			}, packages.map((label, i) => {
				return w(MenuItem, {
					label,
					key: `menu1-sub1-item${i}`,
					overrideClasses: menuCss,
					url: `https://github.com/dojo/${label}`,
					external: true
				});
			}))
		]);
	}

	renderFileMenu() {
		function getKey(name: string) {
			return name.charAt(0).toLowerCase() + name.replace(/\s/g, '').slice(1);
		}

		return w(Menu, {
			key: 'ChromeFileMenu',
			overrideClasses: menuCss
		}, [
			[
				'New Tab',
				'New Window',
				'New Incognito Window',
				'Reopen Closed Tab',
				'Open File...',
				'Open Location...'
			],
			[
				'Close Window',
				'Close Tab',
				'Save Page As...'
			],
			[ 'Email Page Location' ],
			[ 'Print' ]
		].map(group => {
			return v('div', group.map(name => {
				const key = getKey(name);
				return w<any>(MenuItem, {
					key,
					label: name,
					overrideClasses: menuCss,
					disabled: name === 'Open Location...',
					onRequestSelect: this.toggleSelected.bind(this, key),
					selected: this.state[`${key}Selected`]
				});
			}));
		}));
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
