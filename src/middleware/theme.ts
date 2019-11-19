import { create } from '@dojo/framework/core/vdom';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { ClassNames } from '@dojo/framework/core/mixins/Themed';

const factory = create({ coreTheme });
export const THEME_KEY = ' _key';

const theme = factory(function({ middleware: { coreTheme }, properties }) {
	return {
		compose(baseCss: ClassNames, variantCss: ClassNames, prefix?: string) {
			let allVariantThemeClasses: ClassNames = coreTheme.classes(variantCss);
			const { classes } = properties();
			const variantKey = variantCss[THEME_KEY];

			const sanitizedVariantThemeClasses: ClassNames = {};

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

			const variantClassesMap: ClassNames = {};

			for (let className in allVariantThemeClasses) {
				const calculatedClassName = prefix
					? `${prefix}${className.charAt(0).toUpperCase() + className.slice(1)}`
					: className;
				let compare = variantCss[calculatedClassName];
				const variantClasses =
					classes && classes[variantKey] && classes[variantKey][calculatedClassName];

				if (variantClasses && variantClasses.length) {
					compare = `${compare} ${variantClasses.join(' ')}`;
					variantClassesMap[className] = variantClasses.join(' ');
				}

				if (allVariantThemeClasses[className] !== compare) {
					sanitizedVariantThemeClasses[className] = allVariantThemeClasses[className];
				}
			}

			const returnTheme = {
				...coreTheme.classes(baseCss),
				...sanitizedVariantThemeClasses
			};

			for (let className in variantClassesMap) {
				returnTheme[className] += ` ${variantClassesMap[className]}`;
			}

			return returnTheme;
		},
		...coreTheme
	};
});

export default theme;
