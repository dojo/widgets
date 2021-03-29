const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { createSandbox, SinonSandbox } from 'sinon';

import { parseDate } from '../../date-utils';

describe('DateInput Date Utils', () => {
	let sandbox: SinonSandbox;

	beforeEach(() => {
		sandbox = createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('parseDate', () => {
		function stubFormatForLocale(locale: string) {
			const localeDateTimeFormat = Intl.DateTimeFormat(locale);
			const stub = sandbox.stub(Intl, 'DateTimeFormat');
			stub.returns({ format: (date: Date) => localeDateTimeFormat.format(date) });
			return stub;
		}

		it('handles empty input', () => {
			const value = undefined;
			const actual = parseDate(value);
			assert.isUndefined(actual);
		});

		it('can parse standard date format', () => {
			const actual = parseDate('2018-6-1');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
		});

		it('can parse US format', () => {
			const stub = stubFormatForLocale('en-US');
			const actual = parseDate('6/1/2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse non-US format', () => {
			const stub = stubFormatForLocale('fr-fr');
			stub.onCall(0).returns({ format: () => '3/4/2018' }); // forces "canary" date down non-US path

			const actual = parseDate('1/6/2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse period separated date format', () => {
			const stub = stubFormatForLocale('de-de');
			const actual = parseDate('1.6.2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse dash separated date format', () => {
			const stub = stubFormatForLocale('nl-nl');
			const actual = parseDate('1-6-2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse YYYY/MM/DD format', () => {
			const stub = stubFormatForLocale('zh-cn');
			const actual = parseDate('2018/6/1');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('handles invalid formats', () => {
			const actual = parseDate('not-a-date');
			assert.isUndefined(actual);
		});
	});
});
