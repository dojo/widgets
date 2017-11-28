import { DNode } from '@dojo/widget-core/interfaces';
import { theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';

import TextInput, { TextInputProperties } from '../textinput/TextInput';
import * as css from './styles/decoratedtextinput.m.css';

export interface DecoratedTextInputProperties extends TextInputProperties {
	addonAfter: DNode[];
	addonBefore: DNode[];
}

@theme(css)
export default class DecoratedTextInput extends TextInput<DecoratedTextInputProperties> {
	protected renderAddon(addon: DNode, before = false) {
		return v('span', {
			classes: this.theme([css.addon, before ? css.addonBefore : css.addonAfter])
		}, [ addon ]);
	}

	protected renderInputWrapper() {
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
