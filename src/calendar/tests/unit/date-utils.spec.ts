const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { monthInMin } from '../../date-utils';

registerSuite('Calendar date utils', {
	tests: {
		'monthInMin checks year/month against the first of the year'() {
			const janFirst2019 = new Date('2019-01-01');

			assert.isFalse(monthInMin(2018, 10, janFirst2019));
			assert.isFalse(monthInMin(2018, 11, janFirst2019));
			assert.isTrue(monthInMin(2019, 0, janFirst2019));
			assert.isTrue(monthInMin(2019, 1, janFirst2019));
		},
		'monthInMin checks year/month against the last day the year'() {
			const decThirtyFirst2018 = new Date('2018-12-31');

			assert.isFalse(monthInMin(2018, 9, decThirtyFirst2018));
			assert.isFalse(monthInMin(2018, 10, decThirtyFirst2018));
			assert.isTrue(monthInMin(2018, 11, decThirtyFirst2018));
			assert.isTrue(monthInMin(2019, 1, decThirtyFirst2018));
		},
		'monthInMin checks year/month against leap day'() {
			const febTwentyNine2020 = new Date('2020-02-29');

			assert.isFalse(monthInMin(2019, 11, febTwentyNine2020));
			assert.isFalse(monthInMin(2020, 0, febTwentyNine2020));
			assert.isTrue(monthInMin(2020, 1, febTwentyNine2020));
			assert.isTrue(monthInMin(2020, 2, febTwentyNine2020));
		},
		'monthInMin supports out of index months'() {
			const janFirst2019 = new Date('2019-01-01');

			assert.isFalse(monthInMin(2017, 14, janFirst2019));
			assert.isTrue(monthInMin(2018, 12, janFirst2019));
			assert.isFalse(monthInMin(2019, -1, janFirst2019));
			assert.isTrue(monthInMin(2020, -2, janFirst2019));
		}
	}
});
