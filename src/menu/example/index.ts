import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Menu, { Orientation, Role } from '../Menu';
import MenuItem, { MenuItemType } from '../MenuItem';
import SubMenu from '../SubMenu';

const AppBase = StatefulMixin(WidgetBase);

export class App extends AppBase<WidgetProperties> {
	toggleAnimation(event: Event) {
		this.setState({ animate: !(<any> event.target).checked });
	}

	toggleDisabled(event: Event) {
		this.setState({
			disabled: (<any> event.target).checked,
			packageMenuHidden: true
		});
	}

	toggleEvent(event: Event) {
		this.setState({
			expandOnClick: !(<any> event.target).checked,
			packageMenuHidden: true
		});
	}

	toggleOrientation(event: Event) {
		this.setState({ isFileMenuHorizontal: (<any> event.target).checked });
	}

	toggleSelected(key: string) {
		const selectedKey = `${key}Selected`;
		this.setState({ [selectedKey]: !this.state[selectedKey] });
	}

	render() {
		return v('div', [
			v('form', { style: 'margin-bottom: 1.5em' }, [
				v('span', [
					v('input', {
						id: 'toggleEvent',
						type: 'checkbox',
						onchange: this.toggleEvent
					}),
					v('label', {
						for: 'toggleEvent'
					}, [ 'Show on hover' ])
				]),

				v('span', [
					v('input', {
						id: 'toggleDisabled',
						type: 'checkbox',
						onchange: this.toggleDisabled
					}),
					v('label', {
						for: 'toggleDisabled'
					}, [ 'Disable packages menu' ])
				]),

				v('span', [
					v('input', {
						id: 'toggleAnimation',
						type: 'checkbox',
						onchange: this.toggleAnimation
					}),
					v('label', {
						for: 'toggleAnimation'
					}, [ 'Disable package menu animation' ])
				]),

				v('span', [
					v('input', {
						id: 'toggleOrientation',
						type: 'checkbox',
						onchange: this.toggleOrientation
					}),
					v('label', {
						for: 'toggleOrientation'
					}, [ 'Render file menu horizontally' ])
				])
			]),

			v('div', [
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
			animate = true,
			disabled,
			expandOnClick,
			packageMenuHidden
		} = this.state;

		return v('div', { style: 'float: left;' }, [
			w(Menu, {
				key: 'DojoMenu',
				orientation: <Orientation> 'vertical',
				role: <Role> 'menubar'
			}, [
				w(MenuItem, {
					key: 'DojoMenuLabel',
					tag: 'a',
					properties: {
						href: 'http://dojo.io',
						target: '_blank'
					}
				}, [ 'Dojo 2' ]),

				w(SubMenu, {
					animate: <boolean> animate,
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
					}
				}, packages.map((label, i) => {
					return w(MenuItem, {
						key: `menu1-sub1-item${i}`,
						tag: 'a',
						properties: {
							href: `https://github.com/dojo/${label}`,
							target: '_blank'
						}
					}, [ label ]);
				}))
			])
		]);
	}

	renderFileMenu() {
		function getKey(name: string) {
			return name.charAt(0).toLowerCase() + name.replace(/\s/g, '').slice(1);
		}

		return v('div', { style: 'float: left; margin: 0 50px 50px 0;' }, [
			w(Menu, {
				key: 'ChromeFileMenu',
				orientation: this.state['isFileMenuHorizontal'] ? 'horizontal' : 'vertical' as Orientation,
				role: <Role> 'menubar'
			}, [
				'New Tab',
				'New Window',
				'New Incognito Window',
				'Reopen Closed Tab',
				'Open File...',
				'Open Location...',
				'Close Window',
				'Close Tab',
				'Save Page As...',
				'Email Page Location',
				'Print'
			].map((name, i) => {
				const key = getKey(name);
				const toggleSelected: () => void = this.toggleSelected.bind(this, key);
				return w(MenuItem, {
					key,
					disabled: name === 'Open Location...',
					onKeyDown: (event: KeyboardEvent) => {
						if (event.keyCode === 13) {
							toggleSelected();
						}
					},
					onClick: toggleSelected,
					selected: <boolean> this.state[`${key}Selected`],
					type: <MenuItemType> 'checkbox'
				}, [ name ]);
			}))
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
