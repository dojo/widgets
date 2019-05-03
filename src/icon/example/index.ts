import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import Icon from '../index';

export default class App extends WidgetBase {
	render() {
		return v('div', [
			v('h2', {
				innerHTML: 'Icon Examples'
			}),
			v('div', {}, [w(Icon, { type: 'downIcon' })]),
			v('div', {}, [w(Icon, { type: 'leftIcon', altText: 'alt text' })]),
			v('div', {}, [w(Icon, { type: 'rightIcon' })]),
			v('div', {}, [w(Icon, { type: 'closeIcon' })]),
			v('div', {}, [w(Icon, { type: 'plusIcon' })]),
			v('div', {}, [w(Icon, { type: 'minusIcon' })]),
			v('div', {}, [w(Icon, { type: 'checkIcon' })]),
			v('div', {}, [w(Icon, { type: 'upIcon' })]),
			v('div', {}, [w(Icon, { type: 'upAltIcon' })]),
			v('div', {}, [w(Icon, { type: 'downAltIcon' })]),
			v('div', {}, [w(Icon, { type: 'searchIcon' })]),
			v('div', {}, [w(Icon, { type: 'barsIcon' })]),
			v('div', {}, [w(Icon, { type: 'settingsIcon' })]),
			v('div', {}, [w(Icon, { type: 'alertIcon' })]),
			v('div', {}, [w(Icon, { type: 'helpIcon' })]),
			v('div', {}, [w(Icon, { type: 'infoIcon' })]),
			v('div', {}, [w(Icon, { type: 'phoneIcon' })]),
			v('div', {}, [w(Icon, { type: 'editIcon' })]),
			v('div', {}, [w(Icon, { type: 'dateIcon' })]),
			v('div', {}, [w(Icon, { type: 'linkIcon' })]),
			v('div', {}, [w(Icon, { type: 'locationIcon' })]),
			v('div', {}, [w(Icon, { type: 'secureIcon' })]),
			v('div', {}, [w(Icon, { type: 'mailIcon' })])
		]);
	}
}
