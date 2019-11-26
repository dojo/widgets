import theme from '../middleware/theme';
import { tsx, create } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as outlinedButtonCss from '../theme/outlined-button.m.css';
import * as buttonCss from '../theme/button.m.css';

export interface OutlinedButtonProperties extends ButtonProperties {}

const factory = create({ theme }).properties<OutlinedButtonProperties>();

export const OutlinedButton = factory(function OutlinedButton({
	properties,
	children,
	middleware: { theme }
}) {
	const props = properties();

	return (
		<Button
			{...props}
			theme={{
				...props.theme,
				'@dojo/widgets/button': theme.compose(
					buttonCss,
					outlinedButtonCss
				)
			}}
		>
			{children()}
		</Button>
	);
});

export default OutlinedButton;
