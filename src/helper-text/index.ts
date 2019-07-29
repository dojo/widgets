import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { theme, ThemedMixin } from '@dojo/framework/core/mixins/Themed';
import * as css from '../theme/helper-text.m.css';
import { v } from '@dojo/framework/core/vdom';
import { VNode } from '@dojo/framework/core/interfaces';

export interface HelperTextProperties {
	text?: string;
	valid?: boolean;
}

@theme(css)
export default class HelperText extends ThemedMixin(WidgetBase)<HelperTextProperties> {
	protected render(): VNode {
		const { text, valid } = this.properties;

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme([
					css.root,
					valid === true ? css.valid : null,
					valid === false ? css.invalid : null
				])
			},
			[
				text &&
					v(
						'p',
						{
							key: 'text',
							classes: this.theme(css.text),
							'aria-hidden': 'true',
							title: text
						},
						[text]
					)
			]
		);
	}
}
