import { isOutOfDateRange, monthInMin } from '../../date-utils';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

const fullDate = new Date(1979, 2, 20, 7, 33, 12);
const shortDate = new Date(2019, 11, 3);

registerSuite('Calendar date utils', {
	tests: {
		'monthInMin checks year/month against the first of the year'() {
			const janFirst2019 = new Date(2019, 0, 1);

			assert.isFalse(monthInMin(2018, 10, janFirst2019));
			assert.isFalse(monthInMin(2018, 11, janFirst2019));
			assert.isTrue(monthInMin(2019, 0, janFirst2019));
			assert.isTrue(monthInMin(2019, 1, janFirst2019));
		},
		'monthInMin checks year/month against the last day the year'() {
			const decThirtyFirst2018 = new Date(2018, 11, 31);

			assert.isFalse(monthInMin(2018, 9, decThirtyFirst2018));
			assert.isFalse(monthInMin(2018, 10, decThirtyFirst2018));
			assert.isTrue(monthInMin(2018, 11, decThirtyFirst2018));
			assert.isTrue(monthInMin(2019, 1, decThirtyFirst2018));
		},
		'monthInMin checks year/month against leap day'() {
			const febTwentyNine2020 = new Date(2020, 1, 29);

			assert.isFalse(monthInMin(2019, 11, febTwentyNine2020));
			assert.isFalse(monthInMin(2020, 0, febTwentyNine2020));
			assert.isTrue(monthInMin(2020, 1, febTwentyNine2020));
			assert.isTrue(monthInMin(2020, 2, febTwentyNine2020));
		},
		'monthInMin supports out of index months'() {
			const janFirst2019 = new Date(2019, 0, 1);

			assert.isFalse(monthInMin(2017, 14, janFirst2019));
			assert.isTrue(monthInMin(2018, 12, janFirst2019));
			assert.isFalse(monthInMin(2019, -1, janFirst2019));
			assert.isTrue(monthInMin(2020, -2, janFirst2019));
		},
		isOutOfDateRange: {
			'no range is always inside the range'() {
				assert.isFalse(isOutOfDateRange(fullDate));
				assert.isFalse(isOutOfDateRange(shortDate));
			},
			'dates on the minimum day are inside the range'() {
				const min = new Date(
					fullDate.getFullYear(),
					fullDate.getMonth(),
					fullDate.getDate(),
					23,
					59,
					59,
					999
				);
				assert.isFalse(isOutOfDateRange(fullDate, min));
			},
			'dates on the maximum day are inside the range'() {
				const max = new Date('2017-06-29T00:00:00');
				const dateObj = new Date('2017-06-29T23:59:59.999');
				assert.isFalse(isOutOfDateRange(dateObj, undefined, max));
			},
			'dates equal to minimum are inside the range'() {
				assert.isFalse(isOutOfDateRange(fullDate, fullDate));
			},
			'dates equal to maximum are inside the range'() {
				assert.isFalse(isOutOfDateRange(fullDate, undefined, fullDate));
			},
			'dates on the same day as the most narrow range are inside the range'() {
				const min = new Date(
					fullDate.getFullYear(),
					fullDate.getMonth(),
					fullDate.getDate(),
					23,
					59,
					59,
					999
				);
				const max = new Date(
					fullDate.getFullYear(),
					fullDate.getMonth(),
					fullDate.getDate(),
					0,
					0,
					0,
					0
				);
				assert.isFalse(isOutOfDateRange(fullDate, min, max));
			},
			'when min is present dates before are out of the range'() {
				const min = new Date(
					fullDate.getFullYear(),
					fullDate.getMonth(),
					fullDate.getDate() + 1
				);
				assert.isTrue(isOutOfDateRange(fullDate, min));
			},
			'when max is present dates after are out of the range'() {
				const max = new Date(
					fullDate.getFullYear(),
					fullDate.getMonth(),
					fullDate.getDate() - 1
				);
				assert.isTrue(isOutOfDateRange(fullDate, undefined, max));
			}
		}
	}
});
