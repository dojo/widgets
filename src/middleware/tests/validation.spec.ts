const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import validation from '../validation';
import { stub } from 'sinon';

const i18nStub = stub();

function createMiddleware() {
	const { callback } = validation();
	const middleware = callback({
		id: 'test',
		middleware: {
			i18n: {
				localize: () => ({
					format: i18nStub
				})
			}
		} as any,
		properties: () => ({}),
		children: () => []
	});

	return middleware;
}

describe('validation middleware', () => {
	beforeEach(() => {
		i18nStub.resetHistory();
		i18nStub.returns('invalid');
	});

	describe('length validation', () => {
		it('validates min length', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				length: {
					min: 2
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('1'), { valid: false, message: 'invalid' });
			assert.isUndefined(rules('12'));
		});

		it('validates max length', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				length: {
					max: 2
				}
			});

			assert.isUndefined(rules(''));
			assert.isUndefined(rules('1'));
			assert.isUndefined(rules('12'));
			assert.deepEqual(rules('123'), { valid: false, message: 'invalid' });
		});
	});

	describe('contains', () => {
		it('validates uppercase characters', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				contains: {
					uppercase: 2
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('abc'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('A'), { valid: false, message: 'invalid' });
			assert.isUndefined(rules('AB'));
		});

		it('validates numbers', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				contains: {
					numbers: 2
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('abc'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('1'), { valid: false, message: 'invalid' });
			assert.isUndefined(rules('12'));
		});

		it('validates special characters', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				contains: {
					specialCharacters: 2
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('abc'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('123'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('$'), { valid: false, message: 'invalid' });
			assert.isUndefined(rules('$!'));
		});

		it('validates multiple rules', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				contains: {
					uppercase: 1,
					numbers: 1,
					specialCharacters: 1
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('abc'), {
				valid: false,
				message: 'invalid'
			});
			assert.deepEqual(rules('Abc'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('1'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('$'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('$A'), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('2B'), { valid: false, message: 'invalid' });
			assert.isUndefined(rules('A1!'));
		});

		it('validates at least 1 of multiple rules', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				contains: {
					atLeast: 1,
					uppercase: 1,
					numbers: 1,
					specialCharacters: 1
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('abc'), {
				valid: false,
				message: 'invalid'
			});
			assert.isUndefined(rules('Abc'));
			assert.isUndefined(rules('1'));
			assert.isUndefined(rules('$'));
			assert.isUndefined(rules('$A'));
			assert.isUndefined(rules('2B'));
			assert.isUndefined(rules('A1!'));
		});

		it('validates at least 2 of multiple rules', () => {
			const middleware = createMiddleware();

			const rules = middleware({
				contains: {
					atLeast: 2,
					uppercase: 1,
					numbers: 1,
					specialCharacters: 1
				}
			});

			assert.deepEqual(rules(''), { valid: false, message: 'invalid' });
			assert.deepEqual(rules('abc'), {
				valid: false,
				message: 'invalid'
			});
			assert.deepEqual(rules('Abc'), { valid: false, message: 'invalid' });
			assert.isUndefined(rules('Ab1'));
		});
	});

	it('describes rules', () => {
		const middleware = createMiddleware();

		assert.deepEqual(
			middleware({
				length: {
					min: 2
				}
			}).describe(),
			['invalid']
		);

		assert.deepEqual(
			middleware({
				length: {
					min: 2,
					max: 2
				}
			}).describe(),
			['invalid', 'invalid']
		);

		assert.deepEqual(
			middleware({
				contains: {
					uppercase: 1,
					numbers: 1
				}
			}).describe(),
			['invalid']
		);

		assert.deepEqual(
			middleware({
				length: {
					min: 1
				},
				contains: {
					uppercase: 1,
					numbers: 1
				}
			}).describe(),
			['invalid', 'invalid']
		);
	});
});
