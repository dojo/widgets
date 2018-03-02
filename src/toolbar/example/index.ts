import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';

import Toolbar from '../../toolbar/index';

export class App extends WidgetBase<WidgetProperties> {
	onAttach() {
		const style = document.createElement('style');
		document.head.appendChild(style);
		const sheet = style.sheet as CSSStyleSheet;
		sheet.insertRule('#module-select { position: absolute; left: 0; top: 200px; } ');
	}

	render() {
		return v('div', [
			w(Toolbar, {
				collapseWidth: 700,
				fixed: true,
				heading: 'Foobar'
			}, [
				v('a', { href: '/#home' }, [ 'Home' ]),
				v('a', { href: '/#about' }, [ 'About' ]),
				v('a', { href: '/#contact' }, [ 'Contact' ])
			]),
			v('h2', [ 'Toolbar Examples' ])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
