import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import FloatingActionButton, { Icon as FabIcon } from '../floating-action-button';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/speed-dial.m.css';
import * as fabCss from '../theme/default/floating-action-button.m.css';
import * as tooltipCss from '../theme/default/tooltip.m.css';
import Icon from '../icon';
import Tooltip, { Orientation } from '../tooltip';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

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

export interface SpeedDialAction {
	tooltip?: string;
	alwaysShowTooltip?: boolean;
	label: DNode;
	onAction(): void;
}

export interface SpeedDialProperties {
	/** Speed dial direction. Defaults to "right" */
	direction?: 'up' | 'left' | 'down' | 'right';
	/** Orientation of tooltips. Defaults to "left" */
	tooltipOrientation?: Orientation;
	/** Set an initial value for the open property */
	initialOpen?: boolean;
	/** Control the open property */
	open?: boolean;
	/** Callback when opening */
	onOpen?(): void;
	/** Callback when closed */
	onClose?(): void;
	/** Speed dial actions */
	actions: SpeedDialAction[];
}

interface SpeedDialIcache {
	initialOpen?: boolean;
	open?: boolean;
	tooltip?: number;
}

interface SpeedDialChildren {
	(open?: boolean): RenderResult;
}

const icache = createICacheMiddleware<SpeedDialIcache>();
const factory = create({ theme, icache })
	.properties<SpeedDialProperties>()
	.children<SpeedDialChildren | undefined>();

export const SpeedDial = factory(function SpeedDial({
	properties,
	children,
	middleware: { theme, icache }
}) {
	const {
		initialOpen,
		tooltipOrientation = Orientation.left,
		direction = 'right',
		onOpen,
		onClose,
		actions
	} = properties();
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
	const [icon = (open?: boolean) => <SpeedDialIcon open={open} />] = children();
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
					icache.set('open', true);
					onOpen && onOpen();
				}}
			>
				{icon(open)}
			</FloatingActionButton>
			<div key="actions" classes={[classes.actions, !open && classes.actionsClosed]}>
				{actions.map(({ tooltip, alwaysShowTooltip, label, onAction }, index) => {
					const tooltipIndex = icache.get('tooltip');
					let actionDelayClass = undefined;

					if (!firstRender && open) {
						actionDelayClass = delays[Math.min(index - 1, delays.length - 1)];
					}

					if (!firstRender && !open) {
						const reverseIndex = actions.length - index - 1;
						actionDelayClass = delays[Math.min(reverseIndex - 1, delays.length - 1)];
					}

					const avatar = (
						<FloatingActionButton
							key={`fab-${index}`}
							onOut={() => {
								if (tooltip && !alwaysShowTooltip) {
									if (icache.get('tooltip') === index) {
										icache.delete('tooltip');
									}
								}
							}}
							onOver={() => {
								if (tooltip && !alwaysShowTooltip) {
									icache.set('tooltip', index);
								}
							}}
							theme={theme.compose(
								fabCss,
								css,
								'action'
							)}
							classes={{
								'@dojo/widgets/floating-action-button': {
									root: [
										classes.action,
										!firstRender && classes.actionTransition,
										!open && classes.actionClosed,
										actionDelayClass
									]
								}
							}}
							size="small"
							onClick={() => {
								onAction();
								icache.set('open', false);
								onClose && onClose();
							}}
						>
							{label}
						</FloatingActionButton>
					);

					if (tooltip) {
						return (
							<Tooltip
								orientation={tooltipOrientation}
								open={alwaysShowTooltip || tooltipIndex === index}
								theme={theme.compose(
									tooltipCss,
									css,
									'tooltip'
								)}
								classes={{
									'@dojo/widgets/tooltip': {
										content: [
											classes.staticTooltip,
											!firstRender && classes.actionTransition,
											!open && classes.staticTooltipClosed,
											actionDelayClass
										]
									}
								}}
							>
								{{ content: tooltip, trigger: avatar }}
							</Tooltip>
						);
					}
					return avatar;
				})}
			</div>
		</div>
	);
});

export default SpeedDial;
