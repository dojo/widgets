import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { I18nMixin } from '@dojo/framework/widget-core/mixins/I18n';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import * as css from '../theme/helper-text.m.css';
import { v } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';

export interface HelperTextProperties {
	text?: string;
	valid?: boolean;
}

@theme(css)
export default class HelperText extends ThemedMixin(WidgetBase)<HelperTextProperties> {
	protected render(): VNode {
		const { text, valid } = this.properties;

		return v('div', {
			key: 'root',
			classes: this.theme([
				css.root,
				valid === true ? css.valid : null,
				valid === false ? css.invalid : null
			])
		}, [
			text && v('p', {
				key: 'text',
				classes: this.theme(css.text),
				'aria-hidden': 'true',
				title: text
			}, [text])
		]);
	}
}
