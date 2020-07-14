const locales = {
	zh: () => import('./zh-CN/DateInput'),
	'zh-TW': () => import('./zh-TW/DateInput')
};

const messages = {
	invalidProps: 'Min date cannot be greater than max date',
	invalidDate: 'Invalid date format',
	tooEarly: 'Date must be at after Min date',
	tooLate: 'Date must be before Max date'
};

export default { locales, messages };
