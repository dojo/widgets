const locales = {
	'zh-CN': () => import('./zh-CN/Calendar'),
	'zh-TW': () => import('./zh-TW/Calendar')
};

const messages = {
	chooseMonth: 'Choose Month',
	chooseYear: 'Choose Year',
	previousMonth: 'Previous Month',
	nextMonth: 'Next Month',
	previousYears: 'Earlier years',
	nextYears: 'Later years'
};

export default { locales, messages };
