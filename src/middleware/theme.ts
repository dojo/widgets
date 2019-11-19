import { create } from '@dojo/framework/core/vdom';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { ClassNames } from '@dojo/framework/core/mixins/Themed';

const factory = create({ coreTheme });

const theme = factory(function({ middleware: { coreTheme } }) {
	return {
		compose(baseCss: ClassNames, variantCss: ClassNames, prefix?: string) {
			let allVariantThemeClasses: ClassNames = coreTheme.classes(variantCss);
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
				const splitVariantThemeClasses = allVariantThemeClasses[className].split(' ');
				const hasMatch = splitVariantThemeClasses.some(
					(splitThemeClass) =>
						splitThemeClass ===
						variantCss[prefix ? prefixClassNameMap[className] : className]
				);

				if (!hasMatch) {
					sanitizedVariantThemeClasses[className] = allVariantThemeClasses[className];
				}
			}

			return {
				...coreTheme.classes(baseCss),
				...sanitizedVariantThemeClasses
			};
		},
		...coreTheme
	};
});

export default theme;
