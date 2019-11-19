import { create } from '@dojo/framework/core/vdom';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { ClassNames, Theme } from '@dojo/framework/core/mixins/Themed';
import cache from '@dojo/framework/core/middleware/cache';
import injector from '@dojo/framework/core/middleware/injector';
import { Injector } from '@dojo/framework/core/Injector';

const factory = create({ coreTheme, cache, injector });
export const THEME_KEY = ' _key';
export const INJECTED_THEME_KEY = '__theme_injector';

const theme = factory(function({ middleware: { coreTheme, cache, injector }, properties }) {
	let themeKeys = new Set();

	function getThemedCssWithoutClasses(css: ClassNames) {
		let theme = cache.get(css);
		if (theme) {
			return theme;
		}
		const { [THEME_KEY]: key, ...classes } = css;
		themeKeys.add(key);
		theme = classes;
		let { theme: currentTheme } = properties();
		if (!currentTheme) {
			const injectedTheme = injector.get<Injector<Theme>>(INJECTED_THEME_KEY);
			currentTheme = injectedTheme ? injectedTheme.get() : undefined;
		}
		if (currentTheme && currentTheme[key]) {
			theme = { ...theme, ...currentTheme[key] };
		}
		cache.set(css, theme);
		return theme;
	}

	return {
		compose(baseCss: ClassNames, variantCss: ClassNames, prefix?: string) {
			let allVariantThemeClasses: ClassNames = getThemedCssWithoutClasses(variantCss);
			const sanitizedVariantThemeClasses: ClassNames = {};
			const prefixClassNameMap: { [key: string]: string } = {};

			if (prefix) {
				allVariantThemeClasses = Object.keys(allVariantThemeClasses).reduce(
					(themeClasses, className) => {
						if (className.indexOf(prefix) === 0) {
							let newClassName = className.replace(prefix, '');
							newClassName =
								newClassName.charAt(0).toLowerCase() + newClassName.slice(1);
							prefixClassNameMap[newClassName] = className;

							return {
								...themeClasses,
								[newClassName]: allVariantThemeClasses[className]
							};
						} else {
							return themeClasses;
						}
					},
					{}
				);
			}

			for (let className in allVariantThemeClasses) {
				if (allVariantThemeClasses[className] !== variantCss[className]) {
					sanitizedVariantThemeClasses[className] = allVariantThemeClasses[className];
				}
			}

			return {
				...getThemedCssWithoutClasses(baseCss),
				...sanitizedVariantThemeClasses
			};
		},
		...coreTheme
	};
});

export default theme;
