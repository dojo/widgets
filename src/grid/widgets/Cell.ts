import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import { Keys } from '../../common/util';
import TextInput from '../../text-input/index';
import Button from '../../button/index';
import Icon from '../../icon/index';

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

	private _onInput(value: string) {
		this._editingValue = value;
	}

	private _onKeyDown(key: number) {
		if (key === Keys.Enter) {
			this._onSave();
		}
		else if (key === Keys.Escape) {
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
			this._editing ? w(TextInput, {
				key: 'editInput',
				label: `Edit ${rawValue}`,
				labelHidden:  true,
				extraClasses: { input: this.theme(css.input) } as any,
				// focus: true,
				value: this._editingValue,
				onInput: this._onInput,
				onBlur: this._onBlur,
				onKeyDown: this._onKeyDown
			}) : this.renderContent(),
			editable && !this._editing ? w(Button, {
				key: 'editButton',
				aria: { describedby: this._idBase },
				focus: () => focusButton,
				type: 'button',
				extraClasses: { root: this.theme(css.edit) } as any,
				onClick: this._onEdit
			}, [
				w(Icon, { type: 'editIcon', altText: 'Edit' })
			]) : null
		]);
	}
}
