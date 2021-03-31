import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import FloatingActionButton from '../floating-action-button';
import * as fixedCss from './styles/speed-dial.m.css';
import * as css from '../theme/default/speed-dial.m.css';
import * as fabCss from '../theme/default/floating-action-button.m.css';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Icon, { IconType } from '../icon';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { isRenderResult } from '../common/util';

// Enum used to position the action label
export enum LabelOrientation {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

export interface ActionProperties {
	/* On click callback for the action */
	onClick(): void;
	/* Title text for the action */
	title?: string;
	/* Orientation for the label */
	labelOrientation?: LabelOrientation;
}

export interface ActionChildren {
	/** The icon for the action */
	icon?: RenderResult;
	/* Static label for the action */
	label?: RenderResult;
}

const actionFactory = create({ theme })
	.properties<ActionProperties>()
	.children<ActionChildren | [ActionChildren] | RenderResult | RenderResult[]>();

export const Action = actionFactory(({ properties, id, children, middleware: { theme } }) => {
	const {
		labelOrientation = LabelOrientation.left,
		onClick,
		title,
		variant,
		classes
	} = properties();
	const themedCss = theme.classes(css);
	const [labelChild] = children();
	const labelId = `${id}-label`;
	const { icon, label = undefined } = isRenderResult(labelChild)
		? { icon: labelChild }
		: labelChild;

	const fab = (
		<FloatingActionButton
			size="small"
			title={title}
			theme={theme.compose(
				fabCss,
				css,
				'action'
			)}
			onClick={onClick}
			classes={classes}
			variant={variant}
			aria={
				label
					? {
							describedby: labelId
					  }
					: undefined
			}
		>
			{icon}
		</FloatingActionButton>
	);

	if (label) {
		let orientationClass: string | undefined;
		switch (labelOrientation) {
			case LabelOrientation.top:
				orientationClass = themedCss.labelTop;
				break;
			case LabelOrientation.right:
				orientationClass = themedCss.labelRight;
				break;
			case LabelOrientation.bottom:
				orientationClass = themedCss.labelBottom;
				break;
			case LabelOrientation.left:
			default:
				orientationClass = themedCss.labelLeft;
				break;
		}

		return (
			<div classes={[themedCss.labelContainer, orientationClass]} key="labelRoot">
				<label classes={themedCss.label} id={labelId}>
					{label}
				</label>
				{fab}
			</div>
		);
	}

	return fab;
});

export type SpeedDialPositions =
	| 'bottom-right'
	| 'bottom-center'
	| 'bottom-left'
	| 'left-center'
	| 'right-center'
	| 'top-left'
	| 'top-center'
	| 'top-right';

export interface SpeedDialProperties {
	/**
	 * Speed dial direction. Defaults to "right" if position is not set.
	 * Defaults to up for bottom positions, down for top positions,
	 * right for left-center position, and left for right-center position.
	 */
	direction?: 'up' | 'left' | 'down' | 'right';
	/**
	 * Where to position the FAB. Displayed inline if not set.
	 * Position-direction combinations other than away from an adjacent edge are not supported.
	 */
	position?: SpeedDialPositions;
	/** Set an initial value for the open property */
	initialOpen?: boolean;
	/** Control the open property */
	open?: boolean;
	/** Callback when opening */
	onOpen?(): void;
	/** Callback when closed */
	onClose?(): void;
	/* transition delay for each action upon open, defaults to 30ms */
	delay?: number;
	/* The icon type, defaults to plusIcon */
	iconType?: IconType;
}

interface SpeedDialIcache {
	initialOpen?: boolean;
	open?: boolean;
}

const icache = createICacheMiddleware<SpeedDialIcache>();
const factory = create({ theme, icache }).properties<SpeedDialProperties>();

export const SpeedDial = factory(function SpeedDial({
	properties,
	children,
	middleware: { theme, icache }
}) {
	const {
		initialOpen,
		position,
		onOpen,
		onClose,
		theme: themeProp,
		classes,
		variant,
		delay = 30,
		iconType = 'plusIcon'
	} = properties();
	const themedCss = theme.classes(css);

	let { open, direction } = properties();

	if (open === undefined) {
		open = icache.get('open');
		const existingInitialOpen = icache.get('initialOpen');

		if (initialOpen !== existingInitialOpen) {
			icache.set('open', initialOpen);
			icache.set('initialOpen', initialOpen);
			open = initialOpen;
		}
	}
	let positionClass: string | undefined;
	switch (position) {
		case 'bottom-left':
			positionClass = themedCss.bottomLeft;
			direction = direction || 'up';
			break;
		case 'bottom-center':
			positionClass = themedCss.bottomCenter;
			direction = direction || 'up';
			break;
		case 'left-center':
			positionClass = themedCss.leftCenter;
			direction = direction || 'right';
			break;
		case 'right-center':
			positionClass = themedCss.rightCenter;
			direction = direction || 'left';
			break;
		case 'top-left':
			positionClass = themedCss.topLeft;
			direction = direction || 'down';
			break;
		case 'top-right':
			positionClass = themedCss.topRight;
			direction = direction || 'down';
			break;
		case 'top-center':
			positionClass = themedCss.topCenter;
			direction = direction || 'down';
			break;
		case 'bottom-right':
		default:
			positionClass = themedCss.bottomRight;
			direction = direction || 'up';
			break;
	}

	const actions = children();

	function toggleOpen() {
		const open = icache.get('open');
		if (!open) {
			icache.set('open', true);
			onOpen && onOpen();
		}
	}

	function toggleClose() {
		const open = icache.get('open');
		if (open) {
			icache.set('open', false);
			onClose && onClose();
		}
	}

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				fixedCss.root,
				direction === 'left' && themedCss.left,
				direction === 'right' && themedCss.right,
				direction === 'down' && themedCss.down,
				direction === 'up' && themedCss.up,
				positionClass
			]}
			onmouseleave={toggleClose}
		>
			<FloatingActionButton
				key="trigger"
				theme={theme.compose(
					fabCss,
					css,
					'trigger'
				)}
				onOver={toggleOpen}
				onClick={() => {
					const open = icache.get('open');
					if (open) {
						toggleClose();
					} else {
						toggleOpen();
					}
				}}
				classes={classes}
				variant={variant}
			>
				<Icon
					size="large"
					theme={themeProp}
					type={iconType}
					classes={classes}
					variant={variant}
				/>
			</FloatingActionButton>
			<div
				key="actions"
				classes={[themedCss.actions, open ? themedCss.open : undefined]}
				onpointerdown={toggleClose}
			>
				{actions.map((child, index) => {
					const delayMultiplyer = open ? index : actions.length - index - 1;
					const calculatedDelay = `${delayMultiplyer * delay}ms`;
					return (
						<div
							key={`action-wrapper-${index}`}
							styles={{ transitionDelay: calculatedDelay }}
							classes={[themedCss.action, themedCss.actionTransition]}
						>
							{child}
						</div>
					);
				})}
			</div>
		</div>
	);
});

export default SpeedDial;
