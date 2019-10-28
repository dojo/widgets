import { create } from '@dojo/framework/core/vdom';
import coreTheme from '@dojo/framework/core/middleware/theme';
import { ClassNames } from '@dojo/framework/core/mixins/Themed';

const factory = create({ coreTheme });

const theme = factory(function({ middleware: { coreTheme } }) {
	return {
		compose(baseCss: ClassNames, variantCss: ClassNames) {
			const allVariantThemeClasses: ClassNames = coreTheme.classes(variantCss);
			const sanitizedVariantThemeClasses: ClassNames = {};

			for (let className in allVariantThemeClasses) {
				if (allVariantThemeClasses[className] !== variantCss[className]) {
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
