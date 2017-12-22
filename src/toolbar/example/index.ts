import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';

import Toolbar from '../Toolbar';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	onAttach() {
		const style = document.createElement('style');
		document.head.appendChild(style);
		const sheet = style.sheet as CSSStyleSheet;
		sheet.insertRule('#module-select { position: absolute; left: 0; top: 200px; } ');
	}

	// prettier-ignore
	render() {
		return w(Toolbar, {
			actions: [
				v('a', { href: '/#home' }, [ 'Home' ]),
				v('a', { href: '/#about' }, [ 'About' ]),
				v('a', { href: '/#contact' }, [ 'Contact' ])
			],
			collapseWidth: 700,
			fixed: true,
			theme: this._theme,
			title: 'Foobar'
		}, [
			v('h2', [ 'Toolbar Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
