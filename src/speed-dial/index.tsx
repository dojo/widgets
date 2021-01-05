import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import FloatingActionButton from '../floating-action-button';
import * as fixedCss from './styles/speed-dial.m.css';
import * as css from '../theme/default/speed-dial.m.css';
import * as fabCss from '../theme/default/floating-action-button.m.css';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Icon, { IconType } from '../icon';

export interface ActionProperties {
	/* On click callback for the action */
	onClick(): void;
	/* Title text for the action */
	title?: string;
}

const actionFactory = create({ theme }).properties<ActionProperties>();

export const Action = actionFactory(({ properties, children, middleware: { theme } }) => {
	const { onClick, title, variant, classes } = properties();

	const fab = (
		<FloatingActionButton
			size="small"
			title={title}
			theme={theme.compose(
				fabCss,
				css,
				'action'
			)}
			onClick={() => {
				onClick();
			}}
			classes={classes}
			variant={variant}
		>
			{children()}
		</FloatingActionButton>
	);

	return fab;
});

export interface SpeedDialProperties {
	/** Speed dial direction. Defaults to "right" */
	direction?: 'up' | 'left' | 'down' | 'right';
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
		direction = 'right',
		onOpen,
		onClose,
		theme: themeProp,
		classes,
		variant,
		delay = 30,
		iconType = 'plusIcon'
	} = properties();
	const themedCss = theme.classes(css);

	let { open } = properties();

	if (open === undefined) {
		open = icache.get('open');
		const existingInitialOpen = icache.get('initialOpen');

		if (initialOpen !== existingInitialOpen) {
			icache.set('open', initialOpen);
			icache.set('initialOpen', initialOpen);
			open = initialOpen;
		}
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
				direction === 'up' && themedCss.up
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
