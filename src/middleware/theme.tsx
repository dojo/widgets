import { create } from '@dojo/framework/core/vdom';
import coreTheme, {
	ThemeProperties as CoreThemeProperties
} from '@dojo/framework/core/middleware/theme';
import { ThemeWithVariant, ClassNames, Theme } from '@dojo/framework/core/interfaces';
import { isThemeInjectorPayloadWithVariant } from '@dojo/framework/core/ThemeInjector';

const factory = create({ coreTheme }).properties<{ variant?: 'default' | 'inherit' }>();
export const THEME_KEY = ' _key';

function uppercaseFirstChar(value: string) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function lowercaseFirstChar(value: string) {
	return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function isThemeWithVariant(theme: any): theme is ThemeWithVariant {
	return theme && theme.hasOwnProperty('variant');
}

export interface ThemeProperties extends CoreThemeProperties {}

export const theme = factory(function({ middleware: { coreTheme }, properties }) {
	const { variant: coreVariant, get, set, classes } = coreTheme;
	function getTheme() {
		const { theme } = properties();
		if (theme) {
			return theme;
		}

		const themePayload = coreTheme.get();
		if (isThemeInjectorPayloadWithVariant(themePayload)) {
			return { theme: themePayload.theme, variant: themePayload.variant };
		} else if (themePayload) {
			return themePayload.theme;
		}
	}

	return {
		compose: <T extends ClassNames, B extends ClassNames>(
			baseCss: B,
			css: T,
			prefix?: string
		): Theme | ThemeWithVariant => {
			const theme = getTheme();
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
							const variantClass =
								typeof variantTheme[key] === 'string' && variantTheme[key].trim();
							const virtualClass =
								typeof virtualTheme[key] === 'string' && virtualTheme[key].trim();
							if (!variantClass && virtualClass) {
								prefixCss[classKey] = `${baseTheme[classKey]} ${virtualClass}`;
							}
							if (variantClass) {
								prefixCss[classKey] = variantTheme[key];
							}
						}
						return prefixCss;
					},
					{} as ClassNames
				);
				baseTheme = { ...baseTheme, ...prefixedCss };

				if (isThemeWithVariant(theme)) {
					return {
						theme: {
							theme: {
								...theme.theme.theme,
								[baseKey]: baseTheme
							},
							variants: theme.theme.variants
						},
						variant: theme.variant
					};
				}

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
					const variantComposesClass =
						typeof variantTheme[key] === 'string' && variantTheme[key].trim();
					const virtualClass =
						typeof virtualTheme[key] === 'string' && virtualTheme[key].trim();
					if (variantComposesClass) {
						theme[key] = variantComposesClass;
					} else if (virtualClass) {
						theme[key] = `${theme[key]} ${virtualClass}`;
					}
					return theme;
				},
				{ ...baseTheme } as ClassNames
			);

			if (isThemeWithVariant(theme)) {
				return {
					theme: {
						theme: {
							...theme.theme.theme,
							[baseKey]: constructedTheme
						},
						variants: theme.theme.variants
					},
					variant: theme.variant
				};
			}

			return {
				...theme,
				[baseKey]: constructedTheme
			};
		},
		variant: () => {
			return properties().variant === 'inherit' ? undefined : coreVariant();
		},
		get,
		set,
		classes
	};
});

export default theme;
