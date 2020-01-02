import { create, tsx } from '@dojo/framework/core/vdom';
import focus from '@dojo/framework/core/middleware/focus';
import { RenderResult } from '@dojo/framework/core/interfaces';
import Popup from '../popup';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import * as css from '../theme/default/context-popup.m.css';

export interface ContextPopupProperties {
	onClose?(): void;
	onOpen?(): void;
}

export interface ContextPopupChildren {
	contentWithContext: () => RenderResult;
	popupContent: (close: () => void, shouldFocus: () => boolean) => RenderResult;
}

interface ContextIcache {
	x: number;
	y: number;
	open: boolean;
}

const icache = createICacheMiddleware<ContextIcache>();

const factory = create({ icache, focus })
	.properties<ContextPopupProperties>()
	.children<ContextPopupChildren>();

const CursorWidth = 2;
const CursorHeight = 4;

export const ContextPopup = factory(function({
	properties,
	children,
	middleware: { icache, focus }
}) {
	const { onOpen, onClose } = properties();
	const x = icache.getOrSet('x', 0);
	const y = icache.getOrSet('y', 0);

	const { contentWithContext, popupContent } = children()[0];
	const close = () => {
		icache.set('open', false);
		onClose && onClose();
	};

	return (
		<virtual>
			<div
				classes={css.contentWithContext}
				key="contentWithContext"
				oncontextmenu={(event: MouseEvent) => {
					event.preventDefault();
					focus.focus();
					icache.set('x', event.pageX - CursorWidth);
					icache.set('y', event.pageY - CursorHeight);
					icache.set('open', true);
					onOpen && onOpen();
				}}
			>
				{contentWithContext()}
			</div>
			<Popup
				key="popup"
				x={x}
				yTop={y}
				yBottom={document.documentElement.scrollTop + document.documentElement.clientHeight}
				onClose={close}
				position="below"
				open={icache.get('open')}
			>
				{{
					content: () => <div>{popupContent(close, focus.shouldFocus)}</div>
				}}
			</Popup>
		</virtual>
	);
});

export default ContextPopup;
