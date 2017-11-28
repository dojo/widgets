import calendarBundle from '../../nls/Calendar';
import commonBundle from '../../../common/nls/common';

export const DEFAULT_LABELS = {
	chooseMonth: calendarBundle.messages.chooseMonth,
	chooseYear: calendarBundle.messages.chooseYear,
	previousMonth: calendarBundle.messages.previousMonth,
	nextMonth: calendarBundle.messages.nextMonth
};

export const DEFAULT_WEEKDAYS = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ]
	.map((weekday) => {
		return {
			short: (<any> commonBundle.messages)[weekday.slice(0, 3) + 'Short'],
			long: (<any> commonBundle.messages)[weekday]
		};
	});

export const DEFAULT_MONTHS = [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]
	.map((month) => {
		return {
			short: (<any> commonBundle.messages)[month.slice(0, 3) + 'Short'],
			long: (<any> commonBundle.messages)[month]
		};
	});
