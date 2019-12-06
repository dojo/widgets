import { create, tsx } from '@dojo/framework/core/vdom';
import cache from '@dojo/framework/core/middleware/cache';
import theme from '@dojo/framework/core/middleware/theme';
import { RenderResult } from '@dojo/framework/core/interfaces';

import createFormMiddleware, { FormMiddleware, FormValue } from './middleware';
import * as css from '../theme/form.m.css';

const form = createFormMiddleware();

interface FormProperties {
	/** The initial form value */
	initialValue?: FormValue;
	/** Callback for when the form is submitted with valid values */
	onSubmit(values: FormValue): void;
	/** Callback called when a form value changes */
	onValue?(values: FormValue): void;
}

function valueEqual(a: FormValue, b: FormValue = {}) {
	return (
		Object.keys(a).length === Object.keys(b).length &&
		Object.keys(a).every((key) => a[key] === b[key])
	);
}

export type FormChildRenderer<S extends FormValue = any> = (
	properties: FormMiddleware<S>
) => RenderResult;

const factory = create({ form, theme, cache })
	.properties<FormProperties>()
	.children<FormChildRenderer>();

export default factory(function Form({ properties, children, middleware: { form, theme, cache } }) {
	const themedCss = theme.classes(css);
	const { initialValue, onSubmit, onValue } = properties();
	const [renderer] = children();

	onValue && form.onValue(onValue);

	if (initialValue !== undefined && !valueEqual(initialValue, cache.get('initial'))) {
		cache.set('initial', initialValue);
		form.value(initialValue);
	}

	return (
		<form
			classes={themedCss.root}
			onsubmit={(event) => {
				event.preventDefault();
				form.submit((value) => onSubmit(value));
			}}
		>
			{renderer(form)}
		</form>
	);
});
