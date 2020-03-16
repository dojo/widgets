import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import theme, { ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { RenderResult, VNodeProperties } from '@dojo/framework/core/interfaces';

import createFormMiddleware, { FormMiddleware, FormValue } from './middleware';
import * as css from '../theme/default/form.m.css';

const form = createFormMiddleware();

type Omit<T, E> = Pick<T, Exclude<keyof T, E>>;

interface BaseFormProperties extends ThemeProperties {
	/** The initial form value */
	initialValue?: FormValue;
	/** Callback called when a form value changes */
	onValue?(values: FormValue): void;
	/** The name property of the form */
	name?: string;

	onSubmit?: never;
	action?: never;
}

interface SubmitFormProperties extends Omit<BaseFormProperties, 'onSubmit'> {
	/** Callback for when the form is submitted with valid values */
	onSubmit(values: FormValue): void;
}

interface ActionFormProperties extends Omit<BaseFormProperties, 'action'> {
	/** Action url for the form on submit */
	action: string;
	/** method of submit, defaults to `post` */
	method?: 'post' | 'get';
}

export type FormProperties = BaseFormProperties | SubmitFormProperties | ActionFormProperties;

function valueEqual(a: FormValue, b: FormValue = {}) {
	return (
		Object.keys(a).length === Object.keys(b).length &&
		Object.keys(a).every((key) => a[key] === b[key])
	);
}

export type FormChildRenderer<S extends FormValue = any> = (
	properties: FormMiddleware<S>
) => RenderResult;

function isSubmitForm(properties: FormProperties): properties is SubmitFormProperties {
	return (properties as SubmitFormProperties).onSubmit !== undefined;
}

function isActionForm(properties: FormProperties): properties is ActionFormProperties {
	return (properties as ActionFormProperties).action !== undefined;
}

const factory = create({ form, theme, icache })
	.properties<FormProperties>()
	.children<FormChildRenderer>();

export default factory(function Form({
	properties,
	children,
	middleware: { form, theme, icache }
}) {
	const themedCss = theme.classes(css);
	const props = properties();

	let formProps: Partial<VNodeProperties> = {
		classes: themedCss.root,
		name: props.name
	};

	const { initialValue, onValue } = props;

	if (isSubmitForm(props)) {
		formProps = {
			...formProps,
			onsubmit: (event) => {
				event.preventDefault();
				form.submit((value) => props.onSubmit(value));
			}
		};
	} else if (isActionForm(props)) {
		const { action, method = 'post' } = props;
		formProps = {
			...formProps,
			action,
			method
		};
	}

	const [renderer] = children();

	onValue && form.onValue(onValue);

	if (initialValue !== undefined && !valueEqual(initialValue, icache.get('initial'))) {
		icache.set('initial', initialValue, false);
		form.value(initialValue);
	}

	return <form {...formProps}>{renderer(form)}</form>;
});
