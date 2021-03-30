const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { parseDate } from '../../date-utils';

describe('DateInput Date Utils', () => {
	describe('parseDate', () => {
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
			const stub = sinon.stub(Intl, 'DateTimeFormat');
			stub.onFirstCall().returns({ format: () => '4/3/2018' }); // forces "canary" date to match "en-us"
			const actual = parseDate('6/1/2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse non-US format', () => {
			const stub = sinon.stub(Intl, 'DateTimeFormat');
			stub.onFirstCall().returns({ format: () => '03/04/2018' }); // forces "canary" date to match "fr-fr"

			const actual = parseDate('01/06/2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse period separated date format', () => {
			const stub = sinon.stub(Intl, 'DateTimeFormat');
			stub.onFirstCall().returns({ format: () => '3.4.2018' }); // forces "canary" date to match "de-de"
			const actual = parseDate('1.6.2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse dash separated date format', () => {
			const stub = sinon.stub(Intl, 'DateTimeFormat');
			stub.onFirstCall().returns({ format: () => '3-4-2018' }); // forces "canary" date to match "nl-nl"
			const actual = parseDate('1-6-2018');
			assert.equal(actual && actual.getTime(), new Date(2018, 5, 1).getTime());
			stub.restore();
		});

		it('can parse YYYY/MM/DD format', () => {
			const stub = sinon.stub(Intl, 'DateTimeFormat');
			stub.onFirstCall().returns({ format: () => '2018/4/3' }); // forces "canary" date to match "zh-cn"
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
