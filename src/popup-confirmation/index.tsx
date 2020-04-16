import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '../middleware/theme';
import TriggerPopup from '../trigger-popup';
import Button from '../button';

import * as buttonCss from '../theme/default/button.m.css';
import * as css from '../theme/default/popup-confirmation.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { BasePopupProperties } from '../popup';

export interface PopupConfirmationProperties extends BasePopupProperties {
	onConfirm?(): void;
	onCancel?(): void;
	cancelText?: string;
	confirmText?: string;
}

export interface PopupConfirmationChildren {
	content(): RenderResult;
	trigger: string | ((open: () => void) => RenderResult);
}

interface PopupConfirmationCache {}

const icache = createICacheMiddleware<PopupConfirmationCache>();
const factory = create({ theme, icache, i18n })
	.properties<PopupConfirmationProperties>()
	.children<PopupConfirmationChildren>();

export default factory(function PopupConfirmation({
	middleware: { theme, icache, i18n },
	properties,
	children
}) {
	const {
		cancelText = 'No',
		confirmText = 'Yes',
		onCancel,
		onConfirm,
		position = 'below',
		...otherProperties
	} = properties();
	const [{ content, trigger }] = children();
	const classes = theme.classes(css);

	return (
		<div classes={classes.root}>
			<TriggerPopup {...otherProperties} position={position}>
				{{
					trigger: (open) =>
						typeof trigger === 'string' ? (
							<Button onClick={() => open()}>{trigger}</Button>
						) : (
							trigger(open)
						),
					content: (close) => (
						<div
							classes={[
								classes.popupContainer,
								position === 'above' ? classes.above : classes.below
							]}
						>
							<div classes={classes.popup}>
								<div classes={classes.popupContent}>{content()}</div>
								<div classes={classes.popupControls}>
									<Button
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
										{cancelText}
									</Button>
									<Button
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
										{confirmText}
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
