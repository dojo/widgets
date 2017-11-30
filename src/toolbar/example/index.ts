import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';

import Toolbar from '../Toolbar';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: TypedTargetEvent<HTMLInputElement>) {
		this._theme = event.target.checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', [ 'Toolbar Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('div', { id: 'fixed' }, [
				w(Toolbar, {
					collapseWidth: 700,
					fixed: true,
					theme: this._theme,
					title: 'Foobar'
				}, [
					v('a', { href: '/#home' }, [ 'Home' ]),
					v('a', { href: '/#about' }, [ 'About' ]),
					v('a', { href: '/#contact' }, [ 'Contact' ])
				])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
