import { DNode } from '@dojo/framework/core/interfaces';
import drag, { Position } from '@dojo/framework/core/middleware/drag';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import { ThemeProperties } from '@dojo/framework/core/middleware/theme';

import theme from '../middleware/theme';
import * as css from '../theme/default/draggable-list.m.css';
import { uuid } from '@dojo/framework/core/util';
import GlobalEvent from '../global-event';

export function move<T = any>(items: T[], from: number, to: number): T[] {
	const result = [...items];
	const item = result[from];
	result.splice(from, 1);
	result.splice(to, 0, item);
	return result;
}

export interface DraggableListProperties extends ThemeProperties {
	/** Only allow items to be moved vertically on the y-axis */
	lockAxis?: boolean;
	/** Called when an item is moved to a new position */
	onMove: (from: number, to: number) => void;
}

export interface DraggableListChild {
	content: DNode;
	key: string;
}

interface DraggableListState {
	dragIndex?: number;
	itemHeight?: number;
	itemWidth?: number;
	keyRoot?: string;
	lastPosition?: Position;
	startPosition?: Position;
	visualIndex?: number;
}

const factory = create({
	dimensions,
	drag,
	icache: createICacheMiddleware<DraggableListState>(),
	theme
})
	.properties<DraggableListProperties>()
	.children<DraggableListChild[]>();

export const DraggableList = factory(function DraggableList({
	children,
	middleware: { dimensions, drag, icache, theme },
	properties
}) {
	const themeCss = theme.classes(css);
	const items = children();

	const { lockAxis, onMove } = properties();
	const keyRoot = icache.get('keyRoot');
	const lastPosition = icache.get('lastPosition');
	const visualIndex = icache.get('visualIndex');
	const renderIndex = visualIndex && Math.min(items.length - 1, Math.max(0, visualIndex));

	let dragIndex = icache.get('dragIndex');
	let itemHeight = icache.get('itemHeight');
	let itemWidth = icache.get('itemWidth');
	let startPosition = icache.get('startPosition');

	const buildKey = (key: string) => `${keyRoot}-${key}`;

	const renderItem = (item: DraggableListChild, index: number) => {
		const itemDrag = drag.get(buildKey(item.key));
		let currentPosition;
		let padTop = false;
		let padBottom = false;

		// If this is a new drag, cache the starting item position, index, and height
		if (itemDrag.start) {
			const x = itemDrag.start.client.x - itemDrag.start.offset.x;
			const y = itemDrag.start.client.y - itemDrag.start.offset.y;
			startPosition = icache.set('startPosition', { x, y });
			currentPosition = { x, y };
			dragIndex = icache.set('dragIndex', index);
			itemHeight = icache.set('itemHeight', dimensions.get(buildKey(item.key)).offset.height);
			itemWidth = icache.set('itemWidth', dimensions.get(buildKey(item.key)).size.width);
		}
		// If this is an existing drag, use the last known position
		else if (itemDrag.isDragging) {
			currentPosition = lastPosition;
		}

		// Add top padding to the item immediately following the item being dragged
		if (dragIndex !== undefined) {
			if (
				(renderIndex === undefined && index === dragIndex + 1) ||
				(renderIndex !== undefined && renderIndex < dragIndex && index === renderIndex) ||
				(renderIndex !== undefined && renderIndex >= dragIndex && index === renderIndex + 1)
			) {
				padTop = true;
			}
		}

		// Add bottom padding to the end of the list if necessary
		if (
			renderIndex !== undefined &&
			renderIndex === items.length - 1 &&
			index === renderIndex
		) {
			padBottom = true;
		}

		// If this item is not being dragged, return a static list item
		if (!itemDrag.isDragging || !startPosition || !currentPosition) {
			return (
				<li
					classes={[
						themeCss.item,
						padTop && themeCss.paddedItemTop,
						padBottom && themeCss.paddedItemBottom
					]}
					key={buildKey(item.key)}
					styles={{
						marginTop: padTop ? `${itemHeight}px` : undefined,
						marginBottom: padBottom ? `${itemHeight}px` : undefined
					}}
				>
					{item.content}
				</li>
			);
		}

		// Update and cache the last known position and the visual index
		currentPosition.x += itemDrag.delta.x;
		currentPosition.y += itemDrag.delta.y;
		icache.set('lastPosition', currentPosition);
		const offset = itemHeight
			? Math.round((startPosition.y - currentPosition.y) / -itemHeight)
			: 0;
		icache.set('visualIndex', index + offset);

		return (
			<li
				classes={[themeCss.item, themeCss.activeItem]}
				key={buildKey(item.key)}
				styles={{
					left: lockAxis ? undefined : `${currentPosition.x}px`,
					position: 'fixed',
					top: `${currentPosition.y}px`,
					width: `${itemWidth}px`,
					zIndex: '100'
				}}
			>
				{item.content}
			</li>
		);
	};

	const handleDragEnd = () => {
		if (dragIndex === undefined || renderIndex === undefined) {
			return;
		}
		onMove(dragIndex || 0, renderIndex || 0);
		icache.clear();
		icache.set('keyRoot', uuid());
	};

	return (
		<ul classes={[theme.variant(), themeCss.root]}>
			<GlobalEvent key="global" document={{ click: handleDragEnd }} />
			{items.map(renderItem)}
		</ul>
	);
});

export default DraggableList;
