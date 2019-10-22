import theme from '@dojo/framework/core/middleware/theme';
import { tsx, create } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as variantCss from '../theme/raised-button.m.css';
import * as buttonCss from '../theme/button.m.css';

export interface RaisedButtonProperties extends ButtonProperties {}

const factory = create({ theme }).properties<RaisedButtonProperties>();

export const RaisedButton = factory(function({ properties, children, middleware: { theme } }) {
	const props = properties();

	return (
		<Button
			{...props}
			theme={{
				...props.theme,
				'@dojo/widgets/button': {
					...theme.classes(buttonCss),
					...theme.classes(variantCss)
				}
			}}
		>
			{children()}
		</Button>
	);
});

export default RaisedButton;
