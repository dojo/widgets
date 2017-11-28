import { assign } from '@dojo/core/lang';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme } from '@dojo/widget-core/mixins/Themed';
import uuid from '@dojo/core/uuid';
import { v } from '@dojo/widget-core/d';

import TextInput, { TextInputProperties } from '../textinput/TextInput';
import * as css from './styles/decoratedtextinput.m.css';

export interface DecoratedTextInputProperties extends TextInputProperties {
	addonAfter: DNode[];
	addonBefore: DNode[];
}

@theme(css)
export default class DecoratedTextInput extends TextInput<DecoratedTextInputProperties> {
	protected renderAddon(addon: DNode) {
		return v('span', {
			classes: this.theme(css.addon)
		}, [ addon ])
	}

	protected renderInputWrapper() {
		let {
			addonAfter = [],
			addonBefore = [],
			label
		} = this.properties;

		return v('div', { classes: this.theme(css.inputWrapper) }, [
			...addonBefore.map((addon: DNode) => this.renderAddon(addon)),
			this.renderInput(),
			...addonAfter.map((addon: DNode) => this.renderAddon(addon))
		]);
	}
}
