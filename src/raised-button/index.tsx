import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/core/mixins/Themed';
import { tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as css from '../theme/raised-button.m.css';
import { DNode } from '@dojo/framework/core/interfaces';

export interface RaisedButtonProperties extends ButtonProperties {}

@theme(css)
export class RaisedButton extends ThemedMixin(WidgetBase)<RaisedButtonProperties> {
	protected render(): DNode {
		return (
			<Button
				classes={{
					'@dojo/widgets/button': {
						root: this.theme([css.root]),
						disabled: this.theme([css.disabled])
					}
				}}
				{...this.properties}
			>
				{this.children}
			</Button>
		);
	}
}

export default RaisedButton;
