import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode } from '@dojo/framework/core/interfaces';
import { uuid } from '@dojo/framework/core/util';
import { Keys } from '../common/util';
import TextInput from '../text-input/index';
import Button from '../button/index';
import Icon from '../icon/index';

import bundle from './nls/Grid';
import * as fixedCss from './styles/cell.m.css';
import * as css from '../theme/default/grid-cell.m.css';

export interface CellProperties extends FocusProperties {
	/** The display value (or widget) of the cell */
	value: string | DNode;
	/** If the cell's value may be updated */
	editable?: boolean;
	/** The underlying string value of the cell (used by the editor) */
	rawValue: string;
	/** Called when the Cell's value is saved by the editor */
	updater: (value: any) => void;
	/** The width (in pixels) */
	width?: number;
}

@theme(css)
export default class Cell extends I18nMixin(ThemedMixin(FocusMixin(WidgetBase)))<CellProperties> {
	private _editing = false;
	private _editingValue = '';
	private _focusKey!: string;
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
	};

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
		} else if (key === Keys.Escape) {
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
		return v(
			'div',
			{
				key: 'content',
				id: this._idBase,
				ondblclick: this._onEdit
			},
			[value]
		);
	}

	protected render(): DNode {
		let { editable, rawValue, theme, classes, width } = this.properties;
		const { format, messages } = this.localizeBundle(bundle);

		const passedInputClasses = (classes && classes['@dojo/widgets/text-input']) || {};
		const passedButtonClasses = (classes && classes['@dojo/widgets/button']) || {};

		return v(
			'div',
			{
				role: 'cell',
				styles: width
					? {
							flex: `0 1 ${width}px`
					  }
					: {},
				classes: [this.theme(css.root), fixedCss.rootFixed]
			},
			[
				this._editing
					? w(
							TextInput,
							{
								key: 'input',
								theme,
								classes: {
									...classes,
									'@dojo/widgets/text-input': {
										input: [this.theme(css.input)],
										...passedInputClasses
									}
								},
								labelHidden: true,
								focus: this._focusKey === 'input' ? this.shouldFocus : () => false,
								initialValue: this._editingValue,
								onValue: this._onInput,
								onBlur: this._onBlur,
								onKeyDown: this._onKeyDown
							},
							[{ label: format('editValue', { value: rawValue }) }]
					  )
					: this.renderContent(),
				editable && !this._editing
					? w(
							Button,
							{
								key: 'button',
								theme,
								classes: {
									...classes,
									'@dojo/widgets/button': {
										root: [this.theme(css.edit)],
										...passedButtonClasses
									}
								},
								aria: { describedby: this._idBase },
								focus: this._focusKey === 'button' ? this.shouldFocus : () => false,
								type: 'button',
								onClick: this._onEdit
							},
							[w(Icon, { type: 'editIcon', altText: messages.edit, classes, theme })]
					  )
					: null
			]
		);
	}
}
