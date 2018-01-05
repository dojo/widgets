import { LocaleLoaders, Bundle } from '@dojo/i18n/i18n';

const locales: LocaleLoaders<typeof messages> = {};

const messages = {
	chooseMonth: 'Choose Month',
	chooseYear: 'Choose Year',
	previousMonth: 'Previous Month',
	nextMonth: 'Next Month',
	previousYears: 'Earlier years',
	nextYears: 'Later years'
};

const bundle: Bundle<typeof messages> = { locales, messages };

export default bundle;
