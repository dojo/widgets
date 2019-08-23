import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/core/mixins/Themed';
import { tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as css from '../theme/outlined-button.m.css';
import { DNode } from '@dojo/framework/core/interfaces';

export interface OutlinedButtonProperties extends ButtonProperties {}

@theme(css)
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
