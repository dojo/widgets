import theme from '../middleware/theme';
import { tsx, create } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as raisedButtonCss from '../theme/default/raised-button.m.css';
import * as buttonCss from '../theme/default/button.m.css';

export interface RaisedButtonProperties extends ButtonProperties {}

const factory = create({ theme }).properties<RaisedButtonProperties>();

export const RaisedButton = factory(function RaisedButton({
	properties,
	children,
	middleware: { theme }
}) {
	const props = properties();

	return (
		<Button
			{...props}
			theme={theme.compose(
				buttonCss,
				raisedButtonCss
			)}
		>
			{children()}
		</Button>
	);
});

export default RaisedButton;
