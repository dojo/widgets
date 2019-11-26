import { create } from '@dojo/framework/core/vdom';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { ClassNames } from '@dojo/framework/core/mixins/Themed';

const factory = create({ coreTheme });
export const THEME_KEY = ' _key';

const theme = factory(function({ middleware: { coreTheme }, properties }) {
	return {
		compose(baseCss: ClassNames, variantCss: ClassNames, prefix?: string) {
			let allVariantThemeClasses: ClassNames = coreTheme.classes(variantCss);
			const allBaseThemeClasses: ClassNames = coreTheme.classes(baseCss);

			const { classes } = properties();
			const variantKey = variantCss[THEME_KEY];

			const sanitizedThemeClasses: ClassNames = allBaseThemeClasses;

			if (prefix) {
				allVariantThemeClasses = Object.keys(allVariantThemeClasses).reduce(
					(themeClasses, className) => {
						if (className.indexOf(prefix) === 0) {
							let newClassName = className.replace(prefix, '');
							newClassName =
								newClassName.charAt(0).toLowerCase() + newClassName.slice(1);

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
				const calculatedClassName = prefix
					? `${prefix}${className.charAt(0).toUpperCase() + className.slice(1)}`
					: className;
				let compare = variantCss[calculatedClassName];

				let variantClasses = '';
				if (classes && classes[variantKey] && classes[variantKey][calculatedClassName]) {
					variantClasses = classes[variantKey][calculatedClassName].join(' ');
				}

				if (variantClasses) {
					compare = `${compare} ${variantClasses}`;
				}

				// if the base is themed but variant is not, take the base theme
				// else, take the variant theme - which may be the base

				if (allVariantThemeClasses[className] !== compare) {
					sanitizedThemeClasses[className] = allVariantThemeClasses[className];
				}

				sanitizedThemeClasses[className] = `${
					sanitizedThemeClasses[className]
				} ${variantClasses}`.trim();
			}

			return sanitizedThemeClasses;
		},
		...coreTheme
	};
});

export default theme;
