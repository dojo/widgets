import { RenderResult } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties, ButtonChildren } from '../button/index';
import theme from '../middleware/theme';

export interface ActionButtonProperties extends ButtonProperties {}
export interface ActionButtonChildren extends ButtonChildren {}

const factory = create({ theme })
	.properties<ActionButtonProperties>()
	.children<ActionButtonChildren | [ActionButtonChildren] | RenderResult | RenderResult[]>();

export const ActionButton = factory(function ActionButton({ properties, children }) {
	return (
		<Button {...properties()} variant="inherit">
			{children()}
		</Button>
	);
});

export default ActionButton;
