import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { uuid } from '@dojo/framework/core/util';

import * as fixedCss from '../styles/cell.m.css';
import * as css from '../../theme/grid-cell.m.css';

export interface CellProperties {
	value: string | DNode;
	editable?: boolean;
	rawValue: string;
	updater: (value: any) => void;
}

@theme(css)
export default class Cell extends ThemedMixin(WidgetBase)<CellProperties> {
	private _callButtonFocus = false;
	private _editing = false;
	private _editingValue = '';
	private _idBase = uuid();

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
			this._onSave();
		}
	}

	private _onInput(event: KeyboardEvent) {
		const target = event.target as HTMLInputElement;
		this._editingValue = target.value;
	}

	private _onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			this._onSave();
		}
		else if (event.key === 'Escape') {
			this._editing = false;
			this._callButtonFocus = true;
			this.invalidate();
		}
	}

	private _onSave() {
		this._editing = false;
		this._callButtonFocus = true;
		this.properties.updater(this._editingValue);
		this.invalidate();
	}

	protected renderContent(): DNode {
		const { value } = this.properties;
		return v('div', {
			key: 'content',
			id: this._idBase,
			ondblclick: this._onEdit
		}, [ value ]);
	}

	protected render(): DNode {
		let { editable, rawValue, value } = this.properties;
		const focusButton = this._callButtonFocus;
		this._callButtonFocus = false;

		return v('div', { role: 'cell', classes: [this.theme(css.root), fixedCss.rootFixed] }, [
			this._editing ? v('input', {
				key: 'editInput',
				'aria-label': `Edit ${rawValue}`,
				classes: this.theme(css.input),
				focus: true,
				value: this._editingValue,
				oninput: this._onInput,
				onblur: this._onBlur,
				onkeydown: this._onKeyDown
			}) : this.renderContent(),
			editable && !this._editing ? v('button', {
				key: 'editButton',
				focus: focusButton,
				type: 'button',
				'aria-describedby': this._idBase,
				classes: this.theme(css.edit),
				onclick: this._onEdit
			}, [ 'Edit' ]) : null
		]);
	}
}
