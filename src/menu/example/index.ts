import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Menu from '../Menu';
import MenuItem from '../MenuItem';

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
				key: 'DojoMenu'
			}, [
				w(MenuItem, {
					key: 'DojoMenuLabel',
					tabIndex: -1
				}, [
					v('a', {
						href: 'http://dojo.io',
						target: '_blank'
					}, [ 'Dojo 2' ])
				]),

				w(Menu, {
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
						tabIndex: -1
					}, [
						v('a', {
							href: `https://github.com/dojo/${label}`,
							target: '_blank'
						}, [ label ])
					]);
				}))
			])
		]);
	}

	renderFileMenu() {
		function getKey(name: string) {
			return name.charAt(0).toLowerCase() + name.replace(/\s/g, '').slice(1);
		}

		return v('div', { style: 'float: left; margin-right: 50px;' }, [
			w(Menu, {
				key: 'ChromeFileMenu'
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
					const toggleSelected: () => void = this.toggleSelected.bind(this, key);
					return w(MenuItem, {
						key,
						disabled: name === 'Open Location...',
						onKeypress: (event: KeyboardEvent) => {
							const pressed = 'key' in event ? event.key : event.keyCode;
							if (pressed === 'Enter') {
								toggleSelected();
							}
						},
						onClick: toggleSelected,
						selected: <boolean> this.state[`${key}Selected`]
					}, [ name ]);
				}));
			}))
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
