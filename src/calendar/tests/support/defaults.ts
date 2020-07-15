import bundle from '../../nls/Calendar';

export const DEFAULT_LABELS = {
	chooseMonth: bundle.messages.chooseMonth,
	chooseYear: bundle.messages.chooseYear,
	previousMonth: bundle.messages.previousMonth,
	nextMonth: bundle.messages.nextMonth,
	previousYears: bundle.messages.previousYears,
	nextYears: bundle.messages.nextYears
};

export const DEFAULT_WEEKDAYS = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
].map((weekday) => {
	return {
		short: (<any>bundle.messages)[weekday.slice(0, 3) + 'Short'],
		long: (<any>bundle.messages)[weekday]
	};
});

export const DEFAULT_MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
].map((month) => {
	return {
		short: (<any>bundle.messages)[month.slice(0, 3) + 'Short'],
		long: (<any>bundle.messages)[month]
	};
});
