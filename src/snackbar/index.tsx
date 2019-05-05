import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import I18nMixin from '@dojo/framework/widget-core/mixins/I18n';
import Button from '../button/index';
import * as css from '../theme/snackbar.m.css';
import bundle from './nls/Snackbar';

export interface SnackbarProperties {
	success?: boolean;
	open: boolean;
	title: string;
	onDismiss?: () => void;
}

export class Snackbar extends I18nMixin(WidgetBase)<SnackbarProperties> {
	private _onDismiss() {
		const { onDismiss } = this.properties;
		onDismiss && onDismiss();
	}

	protected render() {
		const { messages } = this.localizeBundle(bundle);
		const { success, open, title } = this.properties;
		const classes = [css.root];

		if (open) {
			classes.push(css.open);
		}

		if (success === true) {
			classes.push(css.success);
		} else if (success === false) {
			classes.push(css.error);
		}

		return (
			<div key="root" classes={classes}>
				<div key="content" classes={css.content}>
					<div key="label" classes={css.label} role="status" aria-live="polite">
						{title}
					</div>
					<div key="actions" classes={css.actions}>
						<Button
							name="snackbar-dismiss"
							key="dismiss"
							onClick={() => this._onDismiss()}
						>
							{messages.dismiss}
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default Snackbar;
