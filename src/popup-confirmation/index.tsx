import { create, tsx } from '@dojo/framework/core/vdom';
import i18n from '@dojo/framework/core/middleware/i18n';
import { RenderResult } from '@dojo/framework/core/interfaces';

import theme from '../middleware/theme';
import TriggerPopup from '../trigger-popup';
import Button from '../button';
import { BasePopupProperties } from '../popup';

import * as buttonCss from '../theme/default/button.m.css';
import * as css from '../theme/default/popup-confirmation.m.css';
import bundle from './nls/PopupConfirmation';

export interface PopupConfirmationProperties extends BasePopupProperties {
	/* Callback when the dialog has been confirmed; dialog will be closed */
	onConfirm(): void;

	/* Callback when the dialog has been canceled; dialog will be closed */
	onCancel(): void;
}

export interface PopupConfirmationChildren {
	/* Callback for rendering the trigger content */
	trigger: (toggleOpen: () => void) => RenderResult;

	/* Content for confirmation dialog */
	content: RenderResult;
}

const factory = create({ theme, i18n })
	.properties<PopupConfirmationProperties>()
	.children<PopupConfirmationChildren>();

export default factory(function PopupConfirmation({
	middleware: { theme, i18n },
	properties,
	children
}) {
	const { onCancel, onConfirm, ...otherProperties } = properties();
	const [{ content, trigger }] = children();
	const classes = theme.classes(css);
	const { messages } = i18n.localize(bundle);

	return (
		<div classes={[classes.root, theme.variant()]}>
			<TriggerPopup classes={classes} theme={theme} key="trigger-popup" {...otherProperties}>
				{{
					trigger,
					content: (close, position) => (
						<div
							classes={[
								classes.popupContainer,
								position === 'above' ? classes.above : classes.below
							]}
						>
							<div classes={classes.popup}>
								<div classes={classes.popupContent}>{content}</div>
								<div classes={classes.popupControls}>
									<Button
										key="cancel-button"
										type="button"
										theme={theme.compose(
											buttonCss,
											css,
											'cancel'
										)}
										onClick={() => {
											close();
											onCancel && onCancel();
										}}
									>
										{messages.no}
									</Button>
									<Button
										key="confirm-button"
										type="button"
										theme={theme.compose(
											buttonCss,
											css,
											'confirm'
										)}
										onClick={() => {
											close();
											onConfirm && onConfirm();
										}}
									>
										{messages.yes}
									</Button>
								</div>
							</div>
						</div>
					)
				}}
			</TriggerPopup>
		</div>
	);
});
