import { create, tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '@dojo/widgets/raised-button';
import Button from '@dojo/widgets/button';
import * as buttonCss from './ButtonTheme.m.css';
import * as raisedButtonCss from './RaisedButtonTheme.m.css';

const factory = create();

export default factory(function Basic() {
	const theme = {
		'@dojo/widgets/button': buttonCss,
		'@dojo/widgets/raised-button': raisedButtonCss
	};

	return (
		<virtual>
			<Button disabled theme={theme}>
				Normal Buton
			</Button>
			<RaisedButton disabled theme={theme}>
				Raised Button
			</RaisedButton>
		</virtual>
	);
});
