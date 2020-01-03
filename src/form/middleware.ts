import { create } from '@dojo/framework/core/vdom';
import cache from '@dojo/framework/core/middleware/cache';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export type Validity = true | { valid: false | undefined; message: string };
export type FormValue = Record<string, any>;

interface Callbacks<S> {
	onValue?: (values: Partial<S>) => void;
}

export interface FormMiddleware<S> {
	value: {
		(): Partial<S>;
		(values: S): S;
		(values: Partial<S>): Partial<S>;
	};
	submit: {
		(callback: (values: Partial<S>) => void): void;
		(callback: (values: S) => void, defaults: S): void;
	};
	onValue(callback: (values: Partial<S>) => void): void;
	disabled(disabled?: boolean): boolean;
	valid(): boolean;
	reset(): void;
	field<K extends keyof S>(name: K, required?: boolean): Field<S, K>;
}

export interface Field<S, K extends keyof S> {
	value: {
		(newValue: S[K]): S[K];
		(): S[K] | undefined;
	};
	valid(valid?: boolean, message?: string): Validity;
	required(required?: boolean): boolean;
	disabled(required?: boolean): boolean;
}

function compareValidity(a: Validity, b: Validity) {
	if (typeof a === 'boolean' && typeof b === 'boolean') {
		return true;
	}
	if (typeof a === 'boolean' || typeof b === 'boolean') {
		return false;
	}
	if (b.valid === undefined) {
		return false;
	}
	return a.message === b.message;
}

interface State<S> {
	required: Record<string, boolean>;
	values: Partial<S>;
	valid: Record<string, Validity>;
	disabled: Record<string, boolean>;
	formDisabled: boolean;
}

export const createFormMiddleware = <S extends FormValue = any>() => {
	const icache = createICacheMiddleware<State<S>>();
	const factory = create({ icache, cache });

	const formMiddleware = factory(function Form({
		middleware: { icache, cache }
	}): FormMiddleware<S> {
		return {
			value(values?: any): any {
				const currentValues = icache.getOrSet('values', {});
				if (values !== undefined) {
					icache.set('values', values);
					const newValues = { ...currentValues, ...values };
					const callbacks = cache.get<Callbacks<S>>('callbacks');
					callbacks && callbacks.onValue && callbacks.onValue(newValues);
					return newValues;
				}
				return currentValues;
			},
			submit<T = void>(callback: (values: any) => T, defaults?: S) {
				if (!this.valid()) {
					return;
				}
				if (defaults) {
					return callback({ ...defaults, ...this.value() } as S);
				}
				return callback(this.value());
			},
			onValue<T = void>(callback: (values: Partial<S>) => T) {
				cache.set('callbacks', { onValue: callback });
			},
			disabled(disabled?: boolean) {
				if (disabled !== undefined) {
					icache.set('formDisabled', disabled);
					return disabled;
				}
				return icache.getOrSet('formDisabled', false);
			},
			valid() {
				const values = icache.getOrSet('valid', {});
				const requiredValues = icache.getOrSet('required', {});
				return Object.keys({ ...values, ...requiredValues }).every((key) => {
					const valid = values[key];
					const value =
						typeof valid === 'boolean' || valid === undefined ? valid : valid.valid;
					return (value === undefined && !requiredValues[key]) || Boolean(value);
				});
			},
			reset() {
				icache.set('values', {});
				let valid: Record<string, Validity> = {};
				const values = icache.getOrSet('valid', {});
				Object.keys(values).map((key) => {
					valid[key] = { valid: undefined, message: '' };
				});
				icache.set('valid', valid);
				icache.set('required', {});
				icache.set('formDisabled', false);
				icache.set('disabled', {});
			},
			field(name: any, required = false): Field<S, any> {
				const requiredValues = icache.getOrSet('required', {});
				if (requiredValues[name] === undefined) {
					icache.set('required', {
						...requiredValues,
						[name]: required
					});
				}
				const values = icache.getOrSet('values', {}) as S;
				if (!values.hasOwnProperty(name)) {
					icache.set('values', {
						...values,
						[name]: undefined
					});
				}
				return {
					value: (newValue?: any): any => {
						const values = icache.getOrSet('values', {}) as S;
						if (newValue !== undefined && values[name] !== newValue) {
							icache.set('values', { ...values, [name]: newValue });
							const callbacks = cache.get<Callbacks<S>>('callbacks');
							callbacks &&
								callbacks.onValue &&
								callbacks.onValue({ [name]: newValue } as Partial<S>);
							return newValue;
						}

						return values[name];
					},
					valid: (valid?: boolean, message?: string): Validity => {
						let newValue = valid || {
							valid,
							message: message || ''
						};
						const values = icache.getOrSet('valid', {});
						if (!values.hasOwnProperty(name)) {
							icache.set('valid', {
								...values,
								[name]: newValue
							});
							return newValue;
						}
						if (valid !== undefined) {
							if (!compareValidity(newValue, values[name])) {
								icache.set('valid', {
									...values,
									[name]: newValue
								});
								return newValue;
							}
						}
						return values[name];
					},
					required: (required?: boolean) => {
						const values = icache.getOrSet('required', {});
						if (required !== undefined && values[name] !== required) {
							icache.set('required', {
								...values,
								[name]: required
							});
							return required;
						}
						return Boolean(values[name]);
					},
					disabled: (disabled?: boolean) => {
						const formValue = icache.getOrSet('formDisabled', false);
						const values = icache.getOrSet('disabled', {});
						if (disabled !== undefined && values[name] !== disabled) {
							icache.set('disabled', {
								...values,
								[name]: disabled
							});
							return formValue || disabled;
						}
						return formValue || Boolean(values[name]);
					}
				};
			}
		};
	});
	return formMiddleware;
};

export default createFormMiddleware;
