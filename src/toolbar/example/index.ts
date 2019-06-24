import { w, v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

import Toolbar from '../../toolbar/index';

export default class App extends WidgetBase {
	render() {
		return v('div', [
			w(
				Toolbar,
				{
					collapseWidth: 700,
					heading: 'Foobar'
				},
				[
					v('a', { href: '/#home' }, ['Home']),
					v('a', { href: '/#about' }, ['About']),
					v('a', { href: '/#contact' }, ['Contact'])
				]
			),
			v('h2', ['Toolbar Examples'])
		]);
	}
}
