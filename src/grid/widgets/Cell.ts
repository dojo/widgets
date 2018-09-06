import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { DNode } from '@dojo/framework/widget-core/interfaces';

import * as css from './styles/Cell.m.css';

export interface CellProperties {
	value: string | DNode;
	editable?: boolean;
	rawValue: string;
	updater: (value: any) => void;
}

@theme(css)
export default class Cell extends ThemedMixin(WidgetBase)<CellProperties> {
	private _editing = false;
	private _editingValue = '';

	private _onEdit = () => {
		const { editable } = this.properties;
		if (editable) {
			this._editing = true;
			this._editingValue = this.properties.rawValue;
			this.invalidate();
		}
	}

	private _onBlur() {
		if (this._editing) {
			this._editing = false;
			this.properties.updater(this._editingValue);
			this.invalidate();
		}
	}

	private _onInput(event: KeyboardEvent) {
		const target = event.target as HTMLInputElement;
		this._editingValue = target.value;
		this.invalidate();
	}

	private _onKeyup(event: KeyboardEvent) {
		if (event.key === 'Enter' && this._editing) {
			this._editing = false;
			this.properties.updater(this._editingValue);
			this.invalidate();
		}
	}

	protected render(): DNode {
		let { value } = this.properties;
		if (this._editing) {
			return v('input', {
				key: 'editing',
				classes: [css.root, css.input],
				focus: true,
				value: this._editingValue,
				oninput: this._onInput,
				onblur: this._onBlur,
				onkeyup: this._onKeyup
			});
		}

		return v('div', { key: 'cell', classes: css.root, role: 'cell', ondblclick: this._onEdit }, [value]);
	}
}
