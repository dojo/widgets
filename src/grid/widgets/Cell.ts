import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { FocusMixin, FocusProperties } from '@dojo/framework/widget-core/mixins/Focus';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import { Keys } from '../../common/util';
import TextInput from '../../text-input/index';
import Button from '../../button/index';
import Icon from '../../icon/index';

import * as fixedCss from '../styles/cell.m.css';
import * as css from '../../theme/grid-cell.m.css';

export interface CellProperties extends FocusProperties {
	value: string | DNode;
	editable?: boolean;
	rawValue: string;
	updater: (value: any) => void;
}

@theme(css)
export default class Cell extends ThemedMixin(FocusMixin(WidgetBase))<CellProperties> {
	private _editing = false;
	private _editingValue = '';
	private _focusKey: string;
	private _idBase = uuid();

	private _callFocus(key: string) {
		this._focusKey = key;
		this.focus();
	}

	private _onEdit = () => {
		const { editable } = this.properties;
		if (editable) {
			this._editing = true;
			this._callFocus('input');
			this._editingValue = this.properties.rawValue;
			this.invalidate();
		}
	}

	private _onBlur() {
		if (this._editing) {
			this._onSave();
		}
	}

	private _onInput(value: string) {
		this._editingValue = value;
	}

	private _onKeyDown(key: number) {
		if (key === Keys.Enter) {
			this._onSave();
			this._callFocus('button');
		}
		else if (key === Keys.Escape) {
			this._editing = false;
			this._callFocus('button');
			this.invalidate();
		}
	}

	private _onSave() {
		this._editing = false;
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

		return v('div', { role: 'cell', classes: [this.theme(css.root), fixedCss.rootFixed] }, [
			this._editing ? w(TextInput, {
				key: 'input',
				label: `Edit ${rawValue}`,
				labelHidden:  true,
				extraClasses: { input: this.theme(css.input) } as any,
				focus: this._focusKey === 'input' ? this.shouldFocus : () => false,
				value: this._editingValue,
				onInput: this._onInput,
				onBlur: this._onBlur,
				onKeyDown: this._onKeyDown
			}) : this.renderContent(),
			editable && !this._editing ? w(Button, {
				key: 'button',
				aria: { describedby: this._idBase },
				focus: this._focusKey === 'button' ? this.shouldFocus : () => false,
				type: 'button',
				extraClasses: { root: this.theme(css.edit) } as any,
				onClick: this._onEdit
			}, [
				w(Icon, { type: 'editIcon', altText: 'Edit' })
			]) : null
		]);
	}
}
