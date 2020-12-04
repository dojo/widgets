import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/snackbar.m.css';
import * as fixedCss from './styles/snackbar.m.css';

export interface SnackbarProperties {
	/** If the snackbar is displayed */
	open: boolean;
	/** The type of snackbar message */
	type?: 'success' | 'error';
	/** If the snackbar contents should be justified at the start */
	leading?: boolean;
	/** If the snackbar content should be rendered as a column */
	stacked?: boolean;
}

export interface SnackbarChildren {
	/** Renders the message portion of the snackbar */
	message: RenderResult;
	/** If provided, render actions that the user may select */
	actions?: RenderResult;
}

const factory = create({ theme })
	.properties<SnackbarProperties>()
	.children<SnackbarChildren>();

export const Snackbar = factory(function Snackbar({ middleware: { theme }, properties, children }) {
	const { type, open, leading, stacked } = properties();
	const { message, actions } = children()[0];
	const themeCss = theme.classes(css);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themeCss.root,
				fixedCss.root,
				open ? themeCss.open : null,
				type ? themeCss[type] : null,
				leading ? themeCss.leading : null,
				stacked ? themeCss.stacked : null
			]}
		>
			<div key="content" classes={themeCss.content}>
				<div key="label" classes={themeCss.label} role="status" aria-live="polite">
					{message}
				</div>
				{actions && (
					<div key="actions" classes={themeCss.actions}>
						{actions}
					</div>
				)}
			</div>
		</div>
	);
});

export default Snackbar;
