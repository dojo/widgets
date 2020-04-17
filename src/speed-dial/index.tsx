import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import FloatingActionButton, { FabIcon } from '@dojo/widgets/floating-action-button';
import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/speed-dial.m.css';
import Icon from '../icon';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Avatar from '../avatar';
import Button from '../button';

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
							icon: [classes.openIcon]
						}
					}}
				/>
		  )
		: icon || <FabIcon type="plusIcon" />;
});

export interface SpeedDialAction {
	tooltip?: string;
	alwaysShowTooltip?: string;
	label: DNode;
	onAction(): void;
}

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
	/** Speed dial actions */
	actions: SpeedDialAction[];
}

interface SpeedDialIcache {
	initialOpen?: boolean;
	open?: boolean;
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
	const { initialOpen, direction = 'right', onOpen, onClose, actions } = properties();
	const classes = theme.classes(css);

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
			classes={[
				classes.root,
				direction === 'left' && classes.left,
				direction === 'right' && classes.right,
				direction === 'down' && classes.down,
				direction === 'up' && classes.up
			]}
		>
			<FloatingActionButton
				onClick={() => {
					if (open) {
						icache.set('open', false);
						onClose && onClose();
					} else {
						icache.set('open', false);
						onOpen && onOpen();
					}
				}}
			>
				{icon(open)}
			</FloatingActionButton>
			<div classes={[classes.actions, !open && classes.actionsClosed]}>
				{actions.map(({ tooltip, alwaysShowTooltip, label, onAction }) => {
					const avatar = (
						<div
							classes={}
							onclick={() => {
								onAction();
								icache.set('open', false);
								onClose && onClose();
							}}
						>
							<Avatar secondary={true}>{label}</Avatar>
						</div>
					);
				})}
			</div>
		</div>
	);
});

export default SpeedDial;
