const locales = {
	'zh-CN': () => import('./zh-CN/DateInput')
};

const messages = {
	invalidProps: 'Min date cannot be greater than max date',
	invalidDate: 'Invalid date format',
	tooEarly: 'Date must be at after Min date',
	tooLate: 'Date must be before Max date'
};

export default { locales, messages };
