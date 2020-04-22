import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import FloatingActionButton, { Icon as FabIcon } from '../floating-action-button';
import { RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/speed-dial.m.css';
import * as fabCss from '../theme/default/floating-action-button.m.css';
import Icon from '../icon';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Tooltip, { Orientation } from '../tooltip';

export interface SpeedDialIconProperties {
	open?: boolean;
}

export interface SpeedDialIconChildren {
	icon?: RenderResult;
	openIcon?: RenderResult;
}

const iconFactory = create({ theme })
	.properties<SpeedDialIconProperties>()
	.children<SpeedDialIconChildren | undefined>();

export const SpeedDialIcon = iconFactory(function SpeedDialIcon({
	properties,
	children,
	middleware: { theme }
}) {
	const classes = theme.classes(css);
	const [{ icon, openIcon } = { icon: undefined, openIcon: undefined }] = children();
	const { open } = properties();

	return open
		? openIcon || (
				<Icon
					type="plusIcon"
					classes={{
						'@dojo/widgets/icon': {
							icon: [classes.iconOpen]
						}
					}}
				/>
		  )
		: icon || <FabIcon type="plusIcon" />;
});

export interface SpeedDialActionProperties {
	/** Optionally control tooltip open state */
	tooltipOpen?: boolean;
	/** Optionally specify Tooltip orientation. */
	tooltipOrientation?: Orientation;
	onAction(): void;
}

export interface SpeedDialActionChildren {
	icon: RenderResult;
	tooltip?: RenderResult;
}

interface SpeedDialActionIcache {
	open?: boolean;
}
const actionFactoryIcache = createICacheMiddleware<SpeedDialActionIcache>();
const actionFactory = create({ theme, icache: actionFactoryIcache })
	.properties<SpeedDialActionProperties>()
	.children<SpeedDialActionChildren>();

export const SpeedDialAction = actionFactory(
	({ properties, children, middleware: { theme, icache } }) => {
		const { tooltipOpen = icache.get('open'), tooltipOrientation, onAction } = properties();
		const [{ icon, tooltip }] = children();

		const fab = (
			<FloatingActionButton
				key="button"
				size="small"
				theme={theme.compose(
					fabCss,
					css,
					'action'
				)}
				onOver={() => {
					icache.set('open', true);
				}}
				onOut={() => {
					icache.set('open', false);
				}}
				onClick={() => {
					onAction();
				}}
			>
				{icon}
			</FloatingActionButton>
		);

		if (tooltip) {
			return (
				<Tooltip open={tooltipOpen} orientation={tooltipOrientation}>
					{{
						trigger: fab,
						content: tooltip
					}}
				</Tooltip>
			);
		}

		return fab;
	}
);

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
}

interface SpeedDialIcache {
	initialOpen?: boolean;
	open?: boolean;
	over?: boolean;
	close?: boolean;
	actionCount: number;
}

interface SpeedDialChildren {
	/** The trigger button icon renderer. Defaults to a SpeedDialIcon */
	triggerIcon?(open?: boolean): RenderResult;
	/** The action elements renderer */
	actions(onClose: () => void, direction: 'up' | 'left' | 'down' | 'right'): RenderResult[];
}

const icache = createICacheMiddleware<SpeedDialIcache>();
const factory = create({ theme, icache })
	.properties<SpeedDialProperties>()
	.children<SpeedDialChildren>();

export const SpeedDial = factory(function SpeedDial({
	properties,
	children,
	middleware: { theme, icache }
}) {
	const { initialOpen, direction = 'right', onOpen, onClose } = properties();
	const classes = theme.classes(css);
	const delays = [
		classes.action4,
		classes.action3,
		classes.action2,
		classes.action1,
		classes.action0
	];

	let { open } = properties();

	const firstRender = icache.get('open') === undefined;
	if (open === undefined) {
		open = icache.get('open');
		const existingInitialOpen = icache.get('initialOpen');

		if (initialOpen !== existingInitialOpen) {
			icache.set('open', initialOpen);
			icache.set('initialOpen', initialOpen);
			open = initialOpen;
		}
	}

	const [
		{ triggerIcon = (open?: boolean) => <SpeedDialIcon open={open} />, actions }
	] = children();
	const renderedActions = actions(() => {
		onClose && onClose();
	}, direction);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				classes.root,
				direction === 'left' && classes.left,
				direction === 'right' && classes.right,
				direction === 'down' && classes.down,
				direction === 'up' && classes.up
			]}
			onpointerleave={() => {
				icache.set('open', false);
				onClose && onClose();
				icache.set('over', false);
			}}
		>
			<FloatingActionButton
				key="trigger"
				theme={theme.compose(
					fabCss,
					css,
					'toggle'
				)}
				onOver={() => {
					if (!icache.get('over')) {
						if (open) {
							icache.set('close', true);
						} else {
							icache.set('open', true);
							onOpen && onOpen();
						}
						icache.set('over', true);
					}
				}}
				onClick={() => {
					if (!icache.get('over')) {
						const close = icache.get('close');
						if (close) {
							icache.set('close', false);
						} else {
							icache.set('open', !close);
							onOpen && onOpen();
						}
					}
				}}
			>
				{triggerIcon(open)}
			</FloatingActionButton>
			<div key="actions" classes={[classes.actions, !open && classes.actionsClosed]}>
				{renderedActions.map((action, index) => {
					let actionDelayClass = undefined;

					if (!firstRender && open) {
						actionDelayClass = delays[Math.min(index - 1, delays.length - 1)];
					}

					if (!firstRender && !open) {
						const reverseIndex = renderedActions.length - index - 1;
						actionDelayClass = delays[Math.min(reverseIndex - 1, delays.length - 1)];
					}

					return (
						<div
							key={`action-${index}`}
							classes={[
								classes.action,
								!firstRender && classes.actionTransition,
								!open && classes.closed,
								actionDelayClass
							]}
						>
							{action}
						</div>
					);
				})}
			</div>
		</div>
	);
});

export default SpeedDial;
