import { create, tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as floatingActionButtonCss from '../theme/default/floating-action-button.m.css';
import * as buttonCss from '../theme/default/button.m.css';
import theme from '../middleware/theme';
import IconBase, { IconProperties } from '../icon';

export interface FloatingActionButtonProperties extends ButtonProperties {
	/* puts button into extended mode */
	extended?: boolean;
}

const iconFactory = create({ theme }).properties<IconProperties>();

export const Icon = iconFactory(function FabIcon({ properties, middleware: { theme } }) {
	const classes = theme.classes(floatingActionButtonCss);

	return (
		<IconBase
			{...properties()}
			classes={{
				'@dojo/widgets/icon': {
					icon: [classes.icon]
				}
			}}
		/>
	);
});

const factory = create({ theme }).properties<FloatingActionButtonProperties>();

export const FloatingActionButton = factory(function FloatingActionButton({
	properties,
	children,
	middleware: { theme }
}) {
	const { extended, ...props } = properties();
	const classes = theme.classes(floatingActionButtonCss);

	return (
		<Button
			{...props}
			theme={theme.compose(
				buttonCss,
				floatingActionButtonCss
			)}
			classes={{
				'@dojo/widgets/button': {
					root: [extended && classes.extended]
				}
			}}
		>
			<span aria="hidden" classes={classes.effect} />
			{children()}
		</Button>
	);
});

export default FloatingActionButton;
