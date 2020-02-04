import { RenderResult } from '@dojo/framework/core/interfaces';
import theme, { ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/snackbar.m.css';

export interface SnackbarProperties extends ThemeProperties {
	/** If the snackbar is displayed */
	open: boolean;
	/** Renders the message portion of the snackbar */
	messageRenderer: () => RenderResult;
	/** If provided, render actions that the user may select */
	actionsRenderer?: () => RenderResult;
	/** The type of snackbar message */
	type?: 'success' | 'error';
	/** If the snackbar contents should be justified at the start */
	leading?: boolean;
	/** If the snackbar content should be rendered as a column */
	stacked?: boolean;
}

const factory = create({ theme }).properties<SnackbarProperties>();

export const Snackbar = factory(function Snackbar({ middleware: { theme }, properties }) {
	const { type, open, leading, stacked, messageRenderer, actionsRenderer } = properties();
	const themeCss = theme.classes(css);
	return (
		<div
			key="root"
			classes={[
				themeCss.root,
				open ? themeCss.open : null,
				type ? themeCss[type] : null,
				leading ? themeCss.leading : null,
				stacked ? themeCss.stacked : null
			]}
		>
			<div key="content" classes={themeCss.content}>
				<div key="label" classes={themeCss.label} role="status" aria-live="polite">
					{messageRenderer()}
				</div>
				{actionsRenderer && (
					<div key="actions" classes={themeCss.actions}>
						{actionsRenderer()}
					</div>
				)}
			</div>
		</div>
	);
});

export default Snackbar;
