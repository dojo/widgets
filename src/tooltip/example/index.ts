import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w, v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';

import Tooltip, { Orientation } from '../Tooltip';

import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _showing: boolean;

	themeChange(event: TypedTargetEvent<HTMLInputElement>) {
		this._theme = event.target.checked ? dojoTheme : {};
		this.invalidate();
	}

	onShow() {
		this._showing = true;
		this.invalidate();
	}

	onHide() {
		this._showing = false;
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', [ 'Tooltip Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			w(Tooltip, {
				content: 'This is a tooltip.',
				orientation: Orientation.left,
				onRequestHide: this.onHide,
				onRequestShow: this.onShow,
				showing: this._showing,
				theme: this._theme
			}, [
				'Hover me!'
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
