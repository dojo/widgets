import bundle from './validation.nls';
import { create } from '@dojo/framework/core/vdom';
import i18n from '@dojo/framework/core/middleware/i18n';

const upperCaseRegEx = /[A-Z]/;
const numbersRegEx = /\d/;

interface LengthMin {
	min: number;
	max?: number;
}

interface LengthMax {
	min?: number;
	max: number;
}

interface ContainsUppercase {
	uppercase: number;
	numbers?: number;
	specialCharacters?: number;
}

interface ContainsNumbers {
	uppercase?: number;
	numbers: number;
	specialCharacters?: number;
}

interface ContainsSpecialCharacters {
	uppercase?: number;
	numbers?: number;
	specialCharacters: number;
}

type ContainsRules =
	| ContainsUppercase
	| ContainsNumbers
	| ContainsSpecialCharacters
	| (ContainsUppercase & ContainsNumbers & ContainsSpecialCharacters);

interface LengthRule {
	length: LengthMin | LengthMax | (LengthMin & LengthMax);
}

interface ContainsRule {
	contains: ({ atLeast?: number }) & ContainsRules;
}

export type ValidationRules = RequireAtLeastOne<LengthRule & ContainsRule>;

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{ [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

/* OWASP Special Characters: https://www.owasp.org/index.php/Password_special_characters */
const specialCharactersRegEx = new RegExp(
	[
		' ',
		'!',
		'"',
		'#',
		'\\$',
		'%',
		'&',
		"'",
		'\\(',
		'\\)',
		'\\*',
		'\\+',
		',',
		'-',
		'\\.',
		'/',
		':',
		';',
		'<',
		'=',
		'>',
		'\\?',
		'@',
		'\\[',
		'\\\\',
		'\\]',
		'\\^',
		'_',
		'`',
		'{',
		'\\|',
		'}',
		'~'
	].join('|')
);

type ValidationType<T> = {
	[P in keyof T]: {
		validate: (
			rules: NonNullable<T[P]>,
			value: string
		) => { valid?: boolean; message?: string } | void;
		describe: (rules: NonNullable<T[P]>) => string[];
	}
};

const validationFactory = create({ i18n });
const validation = validationFactory(function validation({ middleware: { i18n } }) {
	const { format } = i18n.localize(bundle);

	function formatList(atLeast: number | undefined, list: string[]) {
		const fixedList = [...list];

		if (list.length > 1) {
			if (atLeast) {
				fixedList[fixedList.length - 1] = format('or', {
					rule: fixedList[fixedList.length - 1]
				});
			} else {
				fixedList[fixedList.length - 1] = format('and', {
					rule: fixedList[fixedList.length - 1]
				});
			}
		}

		if (fixedList.length === 1 && !atLeast) {
			return format('mustContain', { rules: fixedList[0] });
		}

		return format('mustContain', {
			rules: format(atLeast ? 'atLeastOf' : 'allOf', {
				count: atLeast,
				rules: fixedList.join(', ')
			})
		});
	}

	const validators: ValidationType<Required<ValidationRules>> = {
		length: {
			validate: ({ min, max }, value) => {
				if (min !== undefined) {
					if (value.length < min) {
						return {
							valid: false,
							message: format('minimumLength', { length: min })
						};
					}
				}

				if (max !== undefined) {
					if (value.length > max) {
						return {
							valid: false,
							message: format('maximumLength', { length: max })
						};
					}
				}
			},
			describe: ({ min, max }) => {
				const limits: string[] = [];

				if (min !== undefined) {
					limits.push(format('minimumLength', { length: min }));
				}

				if (max !== undefined) {
					limits.push(format('maximumLength', { length: max }));
				}

				return limits;
			}
		},
		contains: {
			validate: ({ atLeast, uppercase = 0, numbers = 0, specialCharacters = 0 }, value) => {
				const failures: string[] = [];
				let uppercaseTotal = 0;
				let numberTotal = 0;
				let specialTotal = 0;
				let containsAtLeast = atLeast || 0;
				let successes = 0;

				if (atLeast === undefined) {
					containsAtLeast =
						(uppercase ? 1 : 0) + (numbers ? 1 : 0) + (specialCharacters ? 1 : 0);
				}

				for (let i = 0; i < value.length; i++) {
					const c = value.charAt(i);

					uppercaseTotal += uppercase && upperCaseRegEx.test(c) ? 1 : 0;
					numberTotal += numbers && numbersRegEx.test(c) ? 1 : 0;
					specialTotal += specialCharacters && specialCharactersRegEx.test(value) ? 1 : 0;
				}

				if (uppercaseTotal < uppercase) {
					failures.push(
						format('uppercase', {
							count: uppercase
						})
					);
				} else if (uppercase) {
					successes++;
				}

				if (numberTotal < numbers) {
					failures.push(
						format('numbers', {
							count: numbers
						})
					);
				} else if (numbers) {
					successes++;
				}

				if (specialTotal < specialCharacters) {
					failures.push(
						format('specialCharacters', {
							count: specialCharacters
						})
					);
				} else if (specialCharacters) {
					successes++;
				}

				if (successes < containsAtLeast) {
					return {
						valid: false,
						message: formatList(
							atLeast ? containsAtLeast - successes : undefined,
							failures
						)
					};
				}
			},
			describe: ({ atLeast, uppercase, numbers, specialCharacters }) => {
				let types: string[] = [];

				if (uppercase) {
					types.push(
						format('uppercase', {
							count: uppercase
						})
					);
				}

				if (numbers) {
					types.push(
						format('numbers', {
							count: numbers
						})
					);
				}

				if (specialCharacters) {
					types.push(
						format('specialCharacters', {
							count: specialCharacters
						})
					);
				}

				return [formatList(atLeast, types)];
			}
		}
	};

	return (rules: ValidationRules) => {
		function validator(value: string) {
			const failedResults = (Object.keys(rules) as (keyof ValidationRules)[])
				.map(
					(rule) =>
						validators[rule] && validators[rule].validate(rules[rule] as any, value)
				)
				.filter((result) => result && !result.valid);

			if (failedResults.length) {
				return {
					valid: false,
					message: failedResults.map((result) => (result ? result.message : '')).join(' ')
				};
			}
		}
		validator.describe = () =>
			(Object.keys(rules) as (keyof ValidationRules)[]).reduce(
				(prev, rule) => [...prev, ...validators[rule].describe(rules[rule] as any)],
				[] as string[]
			);

		return validator;
	};
});

export default validation;
