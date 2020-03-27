import { create } from '@dojo/framework/core/vdom';
import coreTheme, {
	ThemeProperties as CoreThemeProperties
} from '@dojo/framework/core/middleware/theme';
import { ClassNames, Theme } from '@dojo/framework/core/mixins/Themed';
import { ThemeWithVariant } from '@dojo/framework/core/interfaces';

const factory = create({ coreTheme });
export const THEME_KEY = ' _key';

function uppercaseFirstChar(value: string) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function lowercaseFirstChar(value: string) {
	return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

export interface ThemeProperties extends CoreThemeProperties {}

export const theme = factory(function({ middleware: { coreTheme }, properties }) {
	return {
		compose: <T extends ClassNames, B extends ClassNames>(
			baseCss: B,
			css: T,
			prefix?: string
		): Theme | ThemeWithVariant => {
			const theme = properties().theme || coreTheme.get();
			const baseKey = baseCss[THEME_KEY];
			const variantKey = css[THEME_KEY];
			const virtualCss = Object.keys(baseCss).reduce(
				(virtualCss, key) => {
					if (key === THEME_KEY) {
						return virtualCss;
					}
					if (prefix && !virtualCss[`${prefix}${uppercaseFirstChar(key)}`]) {
						virtualCss[`${prefix}${uppercaseFirstChar(key)}`] = ' ';
					}
					if (!css[key]) {
						virtualCss[key] = ' ';
					}
					return virtualCss;
				},
				{ [THEME_KEY]: variantKey } as ClassNames
			);
			const virtualTheme = coreTheme.classes(virtualCss);
			const variantTheme = coreTheme.classes(css);
			let baseTheme = coreTheme.classes(baseCss);
			if (prefix) {
				const prefixedCss = Object.keys({ ...virtualTheme, ...variantTheme }).reduce(
					(prefixCss, key) => {
						if (key.indexOf(prefix) === 0 && key !== prefix) {
							const classKey = lowercaseFirstChar(key.replace(prefix, ''));
							if (
								!variantTheme[key] &&
								virtualTheme[key] &&
								virtualTheme[key].trim()
							) {
								prefixCss[classKey] = `${baseTheme[classKey]} ${virtualTheme[
									key
								].trim()}`;
							}
							if (variantTheme[key]) {
								prefixCss[classKey] = variantTheme[key];
							}
						}
						return prefixCss;
					},
					{} as ClassNames
				);
				baseTheme = { ...baseTheme, ...prefixedCss };
				return {
					...theme,
					[baseKey]: baseTheme
				};
			}

			const constructedTheme = Object.keys(baseTheme).reduce(
				(theme, key) => {
					if (key === THEME_KEY) {
						return theme;
					}
					const variantComposesClass = variantTheme[key] && variantTheme[key].trim();
					if (variantTheme[key]) {
						theme[key] = variantComposesClass;
					} else if (virtualTheme[key] && virtualTheme[key].trim()) {
						theme[key] = `${theme[key]} ${virtualTheme[key].trim()}`;
					}
					return theme;
				},
				{ ...baseTheme } as ClassNames
			);
			return {
				...theme,
				[baseKey]: constructedTheme
			};
		},
		...coreTheme
	};
});

export default theme;
