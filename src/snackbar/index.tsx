import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/core/mixins/Themed';
import { customElement } from '@dojo/framework/core/decorators/customElement';
import { tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/snackbar.m.css';

export interface SnackbarProperties {
	open: boolean;
	message: string;
	actionsRenderer?: () => RenderResult;
	type?: 'success' | 'error';
	leading?: boolean;
	stacked?: boolean;
}

@theme(css)
@customElement<SnackbarProperties>({
	tag: 'dojo-snackbar',
	properties: ['actionsRenderer', 'leading', 'open', 'stacked'],
	attributes: ['message', 'type']
})
export class Snackbar extends ThemedMixin(WidgetBase)<SnackbarProperties> {
	protected render(): DNode {
		const { type, open, leading, stacked, message, actionsRenderer } = this.properties;

		return (
			<div
				key="root"
				classes={[
					css.root,
					open ? css.open : null,
					type ? css[type] : null,
					leading ? css.leading : null,
					stacked ? css.stacked : null
				]}
			>
				<div key="content" classes={css.content}>
					<div key="label" classes={css.label} role="status" aria-live="polite">
						{message}
					</div>
					{actionsRenderer && (
						<div key="actions" classes={css.actions}>
							{actionsRenderer()}
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Snackbar;
