import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/core/mixins/Themed';
import { tsx } from '@dojo/framework/core/vdom';
import Button, { ButtonProperties } from '../button/index';
import * as css from '../theme/raised-button.m.css';
import * as buttonCss from '../theme/button.m.css';
import { DNode, SupportedClassName } from '@dojo/framework/core/interfaces';

export interface RaisedButtonProperties extends ButtonProperties {}

function composeThemeClasses(
	baseCss: { [key: string]: SupportedClassName },
	variantCss: { [key: string]: SupportedClassName },
	getThemeClass: (classes: SupportedClassName) => SupportedClassName
) {
	const themedBaseClasses = Object.keys(baseCss).reduce((existing, key) => {
		(existing as any)[key] = getThemeClass((baseCss as any)[key]);
		return existing;
	}, {});

	const themedVariantClasses = Object.keys(variantCss).reduce((existing, key) => {
		(existing as any)[key] = getThemeClass((variantCss as any)[key]);
		return existing;
	}, {});

	return { ...themedBaseClasses, ...themedVariantClasses };
}

@theme(css)
@theme(buttonCss)
export class RaisedButton extends ThemedMixin(WidgetBase)<RaisedButtonProperties> {
	protected render(): DNode {
		const theme = {
			...this.properties.theme,
			'@dojo/widgets/button': composeThemeClasses(buttonCss, css, this.theme)
		};

		return (
			<Button {...this.properties} theme={theme}>
				{this.children}
			</Button>
		);
	}
}

export default RaisedButton;
