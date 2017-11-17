import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Label from '../../label/Label';

export default class App extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', [
			v('h1', {}, ['Label Examples']),
			v('h3', {}, ['Label assigned as string without extra options']),
			v('div', { id: 'example-1'}, [
				w(Label, {
					label: 'Type something'
				}, [
					v('input', {
						type: 'text',
						placeholder: '...'
					})
				])
			]),
			v('h3', {}, ['Hidden label after the input']),
			v('div', { id: 'example-2'}, [
				w(Label, {
					label: {
						content: 'Can\'t read me!',
						hidden: true,
						before: false
					}
				}, [
					v('input', {
						type: 'text',
						placeholder: 'Type something'
					})
				])
			])
		]);
	}
}
