import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import Popup, { PopupProperties } from '../popup';
import * as fixedCss from './trigger-popup.m.css';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export interface TriggerPopupProperties
	extends Pick<
		PopupProperties,
		Exclude<keyof PopupProperties, 'x' | 'yTop' | 'yBottom' | 'onClose' | 'open'>
	> {
	/** If the popup wrapper should match the trigger width (defaults to true) */
	matchWidth?: boolean;
	onClose?(): void;
	onOpen?(): void;
}

export interface TriggerPopupChildren {
	trigger: (toggleOpen: () => void) => RenderResult;
	content: (close: () => void) => RenderResult;
}

interface TriggerPopupICache {
	open: boolean;
}

const icache = createICacheMiddleware<TriggerPopupICache>();

const factory = create({ dimensions, icache })
	.properties<TriggerPopupProperties>()
	.children<TriggerPopupChildren>();

export const TriggerPopup = factory(function({
	properties,
	children,
	middleware: { dimensions, icache }
}) {
	const { matchWidth = true, onOpen, ...otherProperties } = properties();

	const { position: triggerPosition, size: triggerSize } = dimensions.get('trigger');
	const triggerTop = triggerPosition.top + document.documentElement.scrollTop;
	const triggerBottom = triggerTop + triggerSize.height;

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
		<virtual>
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
				x={triggerPosition.left}
				yTop={triggerBottom}
				yBottom={triggerTop}
				onClose={close}
				open={icache.get('open')}
			>
				{{
					content: () => (
						<div key="trigger-wrapper" styles={wrapperStyles}>
							{content(close)}
						</div>
					)
				}}
			</Popup>
		</virtual>
	);
});

export default TriggerPopup;
