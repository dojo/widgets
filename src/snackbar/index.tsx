import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/core/mixins/Themed';
import { tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/snackbar.m.css';

export interface SnackbarProperties {
	open: boolean;
	messageRenderer: () => RenderResult;
	actionsRenderer?: () => RenderResult;
	type?: 'success' | 'error';
	leading?: boolean;
	stacked?: boolean;
}

@theme(css)
export class Snackbar extends ThemedMixin(WidgetBase)<SnackbarProperties> {
	protected render(): DNode {
		const { type, open, leading, stacked, messageRenderer, actionsRenderer } = this.properties;

		return (
			<div
				key="root"
				classes={this.theme([
					css.root,
					open ? css.open : null,
					type ? css[type] : null,
					leading ? css.leading : null,
					stacked ? css.stacked : null
				])}
			>
				<div key="content" classes={this.theme(css.content)}>
					<div
						key="label"
						classes={this.theme(css.label)}
						role="status"
						aria-live="polite"
					>
						{messageRenderer()}
					</div>
					{actionsRenderer && (
						<div key="actions" classes={this.theme(css.actions)}>
							{actionsRenderer()}
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Snackbar;
