import { create, tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import theme from '../middleware/theme';

export interface ActionButtonProperties extends ButtonProperties {}

const factory = create({ theme }).properties<ActionButtonProperties>();

export const ActionButton = factory(function ActionButton({ properties, children }) {
	return (
		<Button {...properties()} variant="inherit">
			{children()}
		</Button>
	);
});

export default ActionButton;
