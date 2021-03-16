import { create, tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as floatingActionButtonCss from '../theme/default/floating-action-button.m.css';
import * as buttonCss from '../theme/default/button.m.css';
import theme from '../middleware/theme';

export interface FloatingActionButtonProperties extends ButtonProperties {
	/** Sets size of the button to small, normal, or extended. Defaults to normal */
	size?: 'small' | 'normal' | 'extended';
	/** Fixed position for button */
	position?: FloatingActionButtonPositions;
}
export type FloatingActionButtonPositions =
	| 'bottom-right'
	| 'bottom-center'
	| 'bottom-left'
	| 'left-center'
	| 'right-center'
	| 'top-left'
	| 'top-center'
	| 'top-right';

const factory = create({ theme }).properties<FloatingActionButtonProperties>();

export const FloatingActionButton = factory(function FloatingActionButton({
	properties,
	children,
	middleware: { theme }
}) {
	const { size = 'normal', position, ...props } = properties();
	const classes = theme.classes(floatingActionButtonCss);

	let positionClass: string | undefined;
	switch (position) {
		case 'bottom-left':
			positionClass = classes.bottomLeft;
			break;
		case 'bottom-right':
			positionClass = classes.bottomRight;
			break;
		case 'bottom-center':
			positionClass = classes.bottomCenter;
			break;
		case 'left-center':
			positionClass = classes.leftCenter;
			break;
		case 'right-center':
			positionClass = classes.rightCenter;
			break;
		case 'top-left':
			positionClass = classes.topLeft;
			break;
		case 'top-right':
			positionClass = classes.topRight;
			break;
		case 'top-center':
			positionClass = classes.topCenter;
			break;
	}

	return (
		<Button
			{...props}
			theme={theme.compose(
				buttonCss,
				floatingActionButtonCss
			)}
			classes={{
				'@dojo/widgets/button': {
					root: [
						size === 'extended' && classes.extended,
						size === 'small' && classes.small,
						positionClass
					]
				}
			}}
		>
			{{
				label: (
					<virtual>
						<span aria="hidden" classes={classes.effect} />
						{children()}
					</virtual>
				)
			}}
		</Button>
	);
});

export default FloatingActionButton;
