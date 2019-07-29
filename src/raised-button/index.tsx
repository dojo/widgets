import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/core/mixins/Themed';
import { tsx } from '@dojo/framework/core/vdom';
import { customElement } from '@dojo/framework/core/decorators/customElement';
import Button, { ButtonProperties } from '../button/index';
import * as css from '../theme/raised-button.m.css';
import { CustomElementChildType } from '@dojo/framework/core/registerCustomElement';
import { DNode } from '@dojo/framework/core/interfaces';
import { mergeClasses } from '../common/util';

export interface RaisedButtonProperties extends ButtonProperties {}

@theme(css)
@customElement<RaisedButtonProperties>({
	tag: 'dojo-raised-button',
	childType: CustomElementChildType.TEXT,
	properties: ['disabled', 'pressed', 'popup', 'theme', 'aria', 'extraClasses', 'classes'],
	attributes: ['widgetId', 'name', 'type', 'value'],
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
export class RaisedButton extends ThemedMixin(WidgetBase)<RaisedButtonProperties> {
	protected render(): DNode {
		return (
			<Button
				{...this.properties}
				classes={mergeClasses(
					{
						'@dojo/widgets/button': {
							root: this.theme([css.root]),
							disabled: this.theme([css.disabled])
						}
					},
					this.properties.classes
				)}
			>
				{this.children}
			</Button>
		);
	}
}

export default RaisedButton;
