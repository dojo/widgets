import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Menu, { Orientation, Role } from '../Menu';
import MenuBar, { MenuBarProperties } from '../MenuBar';
import MenuItem, { MenuItemType } from '../MenuItem';
import SubMenu, { MenuType, SubMenuProperties } from '../SubMenu';

const BREAKPOINT = 800;
const AppBase = StatefulMixin(WidgetBase);

export class App extends AppBase<WidgetProperties> {
	toggleAnimation(event: Event) {
		this.setState({ animate: !(<any> event.target).checked });
	}

	toggleDisabled(event: Event) {
		this.setState({
			cliMenuDisabled: (<any> event.target).checked,
			cliMenuHidden: true
		});
	}

	toggleEvent(event: Event) {
		this.setState({
			expandOnClick: !(<any> event.target).checked,
			cliMenuHidden: true
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
					}, [ 'Disable CLI menu' ])
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
				this.renderMenuBar(),
				this.renderFileMenu()
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
				orientation: this.state.isFileMenuHorizontal ? 'horizontal' : 'vertical' as Orientation,
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

	renderMenuBar() {
		return v('div', {
			style: 'margin-bottom: 50px;'
		}, [
			w(MenuBar, <MenuBarProperties> {
				breakpoint: BREAKPOINT,
				open: this.state.slidePaneOpen,
				onRequestClose: () => {
					this.setState({ slidePaneOpen: false });
				},
				onRequestOpen: () => {
					this.setState({ slidePaneOpen: true });
				},
				slidePaneButtonLabel: 'Show Menu'
			}, [ this._getPackageMenu() ])
		]);
	}

	private _getCliPackageMenu() {
		const items = [
			'cli',
			'cli-build',
			'cli-create-app',
			'cli-test-intern'
		].map((label, i) => {
			return w(MenuItem, {
				key: `menu1-sub1-item${i}`,
				tag: 'a',
				properties: {
					href: `https://github.com/dojo/${label}`,
					target: '_blank'
				}
			}, [ label ]);
		});

		const { cliMenuDisabled = false, cliMenuHidden = true, expandOnClick = true } = this.state;

		return w(SubMenu, <SubMenuProperties> {
			disabled: cliMenuDisabled,
			expandOnClick,
			hidden: cliMenuHidden,
			label: 'cli',
			onRequestHide: () => {
				this.setState({ cliMenuHidden: true });
			},
			onRequestShow: () => {
				this.setState({ cliMenuHidden: false });
			},
			parentOrientation: document.body.offsetWidth >= BREAKPOINT ? 'horizontal' : 'vertical' as Orientation,
			type: document.body.offsetWidth >= BREAKPOINT ? 'dropdown' : 'inline' as MenuType
		}, items);
	}

	private _getPackageMenu() {
		const children = [ this._getCliPackageMenu() ]
			.concat([
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
			].map((label, i) => {
				return w(MenuItem, {
					key: `menu1-sub1-item${i + 1}`,
					tag: 'a',
					properties: {
						href: `https://github.com/dojo/${label}`,
						target: '_blank'
					}
				}, [ label ]);
			}));

		return w(Menu, {
			key: 'DojoMenu',
			orientation: document.body.offsetWidth >= BREAKPOINT ? 'horizontal' : 'vertical' as Orientation,
			role: <Role> 'menubar'
		}, children);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
