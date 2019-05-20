import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { tsx } from '@dojo/framework/widget-core/tsx';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import Button, { ButtonProperties } from '../button/index';
import * as css from '../theme/raised-button.m.css';
import { CustomElementChildType } from '@dojo/framework/widget-core/registerCustomElement';
import { DNode } from '@dojo/framework/widget-core/interfaces';

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
				classes={{ '@dojo/widgets/button': { root: this.theme([css.root]) } }}
				{...this.properties}
			>
				{this.children}
			</Button>
		);
	}
}

export default RaisedButton;
