import { RenderResult, VNodeProperties } from '@dojo/framework/core/interfaces';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/default/form.m.css';
import createFormMiddleware, { FormMiddleware, FormValue } from './middleware';

const form = createFormMiddleware();

type Omit<T, E> = Pick<T, Exclude<keyof T, E>>;

interface BaseFormProperties {
	/** The initial form value */
	initialValue?: FormValue;
	/** Controlled form value component */
	value?: FormValue;
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
		classes: [theme.variant(), themedCss.root],
		name: props.name
	};

	const { initialValue, value, onValue } = props;

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

	if (value) {
		form.value(value);
	} else if (initialValue !== undefined && !valueEqual(initialValue, icache.get('initial'))) {
		icache.set('initial', initialValue, false);
		form.value(initialValue);
	}

	return <form {...formProps}>{renderer(form)}</form>;
});

export interface FormGroupProperties {
	/** Render this grouping in a vertical column */
	column?: boolean;
}

const formGroupFactory = create({ theme })
	.properties<FormGroupProperties>()
	.children();

export const FormGroup = formGroupFactory(function FormRow({
	properties,
	children,
	middleware: { theme }
}) {
	const { column } = properties();
	const themedCss = theme.classes(css);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.groupRoot,
				!column && themedCss.row,
				column && themedCss.column
			]}
		>
			{children()}
		</div>
	);
});

const formFieldFactory = create({ theme });

export const FormField = formFieldFactory(function FormField({ children, middleware: { theme } }) {
	const themedCss = theme.classes(css);

	return (
		<div key="root" classes={[theme.variant(), themedCss.fieldRoot]}>
			{children()}
		</div>
	);
});
