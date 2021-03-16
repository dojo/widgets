import theme from '../middleware/theme';
import { tsx, create } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties, ButtonChildren } from '../button/index';
import * as raisedButtonCss from '../theme/default/raised-button.m.css';
import * as buttonCss from '../theme/default/button.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface RaisedButtonProperties extends ButtonProperties {}
export interface RaisedButtonChildren extends ButtonChildren {}

const factory = create({ theme })
	.properties<RaisedButtonProperties>()
	.children<RaisedButtonChildren | RenderResult>();

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
