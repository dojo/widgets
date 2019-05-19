import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { DNode, RenderResult } from '@dojo/framework/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { tsx } from '@dojo/framework/widget-core/tsx';
import * as css from '../theme/snackbar.m.css';

export interface SnackbarProperties {
	open: boolean;
	message: string;
	actionsRenderer?: () => RenderResult;
	type?: 'success' | 'error';
}

@theme(css)
@customElement<SnackbarProperties>({
	tag: 'dojo-snackbar',
	properties: ['open', 'actionsRenderer'],
	attributes: ['message', 'type']
})
export class Snackbar extends ThemedMixin(WidgetBase)<SnackbarProperties> {
	protected render(): DNode {
		const { type, open, message, actionsRenderer } = this.properties;
		const classes = [css.root];

		if (open) {
			classes.push(css.open);
		}

		if (type) {
			classes.push(css[type]);
		}

		return (
			<div key="root" classes={classes}>
				<div key="content" classes={css.content}>
					<div key="label" classes={css.label} role="status" aria-live="polite">
						{message}
					</div>
					<div key="actions" classes={css.actions}>
						{actionsRenderer && actionsRenderer()}
					</div>
				</div>
			</div>
		);
	}
}

export default Snackbar;
