import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { tsx } from '@dojo/framework/widget-core/tsx';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import Button, { ButtonProperties } from '../button/index';
import * as css from '../theme/outlined-button.m.css';
import { CustomElementChildType } from '@dojo/framework/widget-core/registerCustomElement';
import { DNode } from '@dojo/framework/widget-core/interfaces';

export interface OutlinedButtonProperties extends ButtonProperties {}

@theme(css)
@customElement<OutlinedButtonProperties>({
	tag: 'dojo-outlined-button',
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
export class OutlinedButton extends ThemedMixin(WidgetBase)<OutlinedButtonProperties> {
	protected render(): DNode {
		return (
			<Button
				classes={{ '@dojo/widgets/button': { root: this.theme([css.root]) } }}
				{...this.properties}
			>
				{this.children}
			</Button>
		);
	}
}

export default OutlinedButton;
