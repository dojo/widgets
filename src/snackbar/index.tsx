import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { tsx } from '@dojo/framework/widget-core/tsx';
import I18nMixin from '@dojo/framework/widget-core/mixins/I18n';
import Button from '../button/index';
import * as css from '../theme/snackbar.m.css';

export type SnackbarType = 'success' | 'error';

export interface SnackbarProperties {
	open: boolean;
	message: string;
	actions?: DNode | DNode[];
	type?: SnackbarType;
}

export class Snackbar extends I18nMixin(WidgetBase)<SnackbarProperties> {
	protected render() {
		const { type, open, message, actions = null } = this.properties;
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
						{actions}
					</div>
				</div>
			</div>
		);
	}
}

export default Snackbar;
