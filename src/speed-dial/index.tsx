import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import FloatingActionButton, { FabIcon } from '@dojo/widgets/floating-action-button';
import { RenderResult } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/speed-dial.m.css';

export interface SpeedDialIconProperties {
	open?: boolean;
}

export interface SpeedDialIconChildren {
	icon?: RenderResult;
	openIcon?: RenderResult;
}

const iconFactory = create({ theme }).properties<SpeedDialIconProperties>().children<SpeedDialIconChildren | undefined>();

export const SpeedDialIcon = iconFactory(function SpeedDialIcon({ properties, children, middleware: { theme } }) {
	const [{ icon, openIcon } = { icon: undefined, openIcon: undefined }] = children();
	const { open } = properties();

	return open ? ( openIcon || <FabIcon type="plusIcon" classes={}
		: ( icon || <FabIcon type="plusIcon"/> )
	)
});

export interface SpeedDialProperties {
}

const factory = create({ theme }).properties<SpeedDialProperties>();

export const SpeedDial = factory(function SpeedDial({ properties, middleware: { theme }}) {
	const x = properties();
	return (
		<div/>
	);
});

export default SpeedDial;
