import { DNode } from '@dojo/widget-core/interfaces';
import { theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';

import { TextInputBase, TextInputProperties } from '../text-input/index';
import * as css from '../theme/enhanced-text-input.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

export interface EnhancedTextInputProperties extends TextInputProperties {
	addonAfter?: DNode[];
	addonBefore?: DNode[];
}

@theme(css)
@customElement<EnhancedTextInputProperties>({
	tag: 'dojo-enhanced-text-input',
	properties: [
		'theme',
		'aria',
		'extraClasses',
		'addonAfter',
		'addonBefore',
		'aria',
		'shouldFocus',
		'disabled',
		'invalid',
		'readOnly'
	],
	attributes: [ 'widgetId', 'label', 'placeholder', 'controls', 'type', 'minLength', 'maxLength', 'value', 'name' ],
	events: [
		'onBlur',
		'onChange',
		'onClick',
		'onFocus',
		'onInput',
		'onKeyDown',
		'onKeyPress',
		'onKeyUp',
		'onMouseDown',
		'onMouseUp',
		'onTouchCancel',
		'onTouchEnd',
		'onTouchStart'
	]
})
export default class EnhancedTextInput extends TextInputBase<EnhancedTextInputProperties> {
	protected renderAddon(addon: DNode, before = false): DNode {
		return v('span', {
			classes: this.theme([css.addon, before ? css.addonBefore : css.addonAfter])
		}, [ addon ]);
	}

	protected renderInputWrapper(): DNode {
		let {
			addonAfter = [],
			addonBefore = []
		} = this.properties;

		return v('div', { classes: this.theme(css.inputWrapper) }, [
			...addonBefore.map((addon: DNode) => this.renderAddon(addon, true)),
			this.renderInput(),
			...addonAfter.map((addon: DNode) => this.renderAddon(addon))
		]);
	}
}
