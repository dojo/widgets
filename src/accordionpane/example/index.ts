import { Set } from '@dojo/shim/Set';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { from } from '@dojo/shim/array';

import AccordionPane from '../../accordionpane/AccordionPane';
import TitlePane from '../../titlepane/TitlePane';

export default class App extends WidgetBase<ThemedProperties> {
	private _exclusiveKey: string | undefined;
	private _openKeys = new Set<string>();

	render() {
		const { theme } = this.properties;

		return v('div', { styles: { maxWidth: '350px' } }, [
			v('h2', [ 'AccordionPane Examples' ]),
			v('div', { id: 'pane' }, [
				v('h3', [ 'Normal AccordionPane' ]),
				w(AccordionPane, {
					onRequestOpen: (key: string) => {
						this._openKeys.add(key);
						this.invalidate();
					},
					onRequestClose: (key: string) => {
						this._openKeys.delete(key);
						this.invalidate();
					},
					openKeys: from(this._openKeys),
					theme
				}, [
					w(TitlePane, {
						title: 'Pane 1',
						key: 'foo'
					}, [ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.' ]),
					w(TitlePane, {
						title: 'Pane 2',
						key: 'bar'
					}, [ 'Ut non lectus vitae eros hendrerit pellentesque. In rhoncus ut lectus id tempus. Cras eget mauris scelerisque, condimentum ante sed, vehicula tellus. Donec congue ligula felis, a porta felis aliquet nec. Nulla mi lorem, efficitur nec lectus vehicula, vehicula varius eros.' ])
				])
			]),
			v('div', { id: 'pane2' }, [
				v('h3', [ 'Exclusive AccordionPane' ]),
				w(AccordionPane, {
					onRequestOpen: (key: string) => {
						this._exclusiveKey = key;
						this.invalidate();
					},
					onRequestClose: (key: string) => {
						this._exclusiveKey = undefined;
						this.invalidate();
					},
					openKeys: this._exclusiveKey ? [ this._exclusiveKey ] : [],
					theme
				}, [
					w(TitlePane, {
						title: 'Pane 1',
						key: 'baz'
					}, [ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.' ]),
					w(TitlePane, {
						title: 'Pane 2',
						key: 'bax'
					}, [ 'Ut non lectus vitae eros hendrerit pellentesque. In rhoncus ut lectus id tempus. Cras eget mauris scelerisque, condimentum ante sed, vehicula tellus. Donec congue ligula felis, a porta felis aliquet nec. Nulla mi lorem, efficitur nec lectus vehicula, vehicula varius eros.' ])
				])
			])
		]);
	}
}
