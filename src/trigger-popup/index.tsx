import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import Popup, { PopupPosition, BasePopupProperties } from '../popup';
import * as fixedCss from './trigger-popup.m.css';
import theme from '../middleware/theme';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export interface TriggerPopupProperties extends BasePopupProperties {
	/** If the popup wrapper should match the trigger width (defaults to true) */
	matchWidth?: boolean;
	/** Callback when the menu is opened  */
	onOpen?(): void;
	/** Position of popup that is triggered  */
	position?: PopupPosition;
}

export interface TriggerPopupChildren {
	trigger: (toggleOpen: () => void) => RenderResult;
	content: (close: () => void, position: PopupPosition) => RenderResult;
}

interface TriggerPopupICache {
	open: boolean;
}

const icache = createICacheMiddleware<TriggerPopupICache>();

const factory = create({ dimensions, icache, theme })
	.properties<TriggerPopupProperties>()
	.children<TriggerPopupChildren>();

export const TriggerPopup = factory(function TriggerPopup({
	properties,
	children,
	middleware: { dimensions, icache, theme }
}) {
	const { matchWidth = true, onOpen, classes, ...otherProperties } = properties();

	const { position: triggerPosition, size: triggerSize } = dimensions.get('trigger');
	const triggerTop = triggerPosition.top + document.documentElement.scrollTop;
	const triggerBottom = triggerTop + triggerSize.height;

	const themedCss = theme.classes(fixedCss);

	const wrapperStyles = {
		width: matchWidth ? `${triggerSize.width}px` : 'auto'
	};

	const { trigger, content } = children()[0];
	const close = () => {
		const { onClose } = properties();
		icache.set('open', false);
		onClose && onClose();
	};

	return (
		<virtual classes={[themedCss.root]}>
			<span key="trigger" classes={fixedCss.trigger}>
				{trigger(() => {
					const { onOpen } = properties();
					icache.set('open', !icache.get('open'));
					onOpen && onOpen();
				})}
			</span>
			<Popup
				key="popup"
				{...otherProperties}
				classes={classes}
				yTop={triggerBottom}
				yBottom={triggerTop}
				xLeft={triggerPosition.left}
				xRight={triggerPosition.right}
				onClose={close}
				open={icache.get('open')}
			>
				{(position) => (
					<div key="trigger-wrapper" styles={wrapperStyles}>
						{content(close, position)}
					</div>
				)}
			</Popup>
		</virtual>
	);
});

export default TriggerPopup;
