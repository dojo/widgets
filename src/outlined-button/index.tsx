import theme from '../middleware/theme';
import { tsx, create } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties, ButtonChildren } from '../button/index';
import * as outlinedButtonCss from '../theme/default/outlined-button.m.css';
import * as buttonCss from '../theme/default/button.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface OutlinedButtonProperties extends ButtonProperties {}
export interface OutlinedButtonChildren extends ButtonChildren {}

const factory = create({ theme })
	.properties<OutlinedButtonProperties>()
	.children<OutlinedButtonChildren | RenderResult>();

export const OutlinedButton = factory(function OutlinedButton({
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
				outlinedButtonCss
			)}
		>
			{children()}
		</Button>
	);
});

export default OutlinedButton;
