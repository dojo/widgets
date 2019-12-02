import { create } from '@dojo/framework/core/vdom';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { ClassNames, Theme } from '@dojo/framework/core/mixins/Themed';

const factory = create({ coreTheme });
export const THEME_KEY = ' _key';

const theme = factory(function({ middleware: { coreTheme }, properties }) {
	return {
		compose: <T extends ClassNames, B extends ClassNames>(
			baseCss: B,
			css: T,
			prefix?: string
		): Theme => {
			const variantTheme = coreTheme.classes(css);
			const baseKey = baseCss[THEME_KEY];
			const variantKey = css[THEME_KEY];
			const extraClasses = Object.keys(baseCss).filter(
				(key) => Object.keys(css).indexOf(key) === -1
			);
			let baseTheme = coreTheme.classes(baseCss);
			if (prefix) {
				const prefixedCss = Object.keys(variantTheme).reduce(
					(prefixCss, key) => {
						if (key.indexOf(prefix) === 0) {
							const classKey =
								key
									.replace(prefix, '')
									.charAt(0)
									.toLowerCase() + key.replace(prefix, '').slice(1);
							prefixCss[classKey] = variantTheme[key];
						}
						return prefixCss;
					},
					{} as ClassNames
				);
				baseTheme = { ...baseTheme, ...prefixedCss };
			}
			let variantComposes: any = {};
			if (extraClasses) {
				const virtualCss = extraClasses.reduce(
					(css, key) => {
						css[key] = ' ';
						return css;
					},
					{ THEME_KEY: variantKey } as any
				);
				variantComposes = coreTheme.classes(virtualCss);
			}
			const constructedTheme = Object.keys(baseTheme).reduce(
				(theme, key) => {
					if (key === THEME_KEY) {
						return theme;
					}
					const variantComposesClass =
						variantComposes[key] && variantComposes[key].trim();
					if (variantComposesClass) {
						theme[key] =
							theme[key] && !variantTheme[key]
								? `${theme[key]} ${variantComposesClass}`
								: variantComposesClass;
					} else if (variantTheme[key]) {
						theme[key] = variantTheme[key];
					}
					return theme;
				},
				{ ...baseTheme } as ClassNames
			);
			const theme = properties().theme || coreTheme.get();
			return {
				...theme,
				[baseKey]: constructedTheme
			};
		},
		...coreTheme
	};
});

export default theme;
