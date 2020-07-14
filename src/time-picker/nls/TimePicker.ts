const locales = {
	zh: () => import('./zh-CN/TimePicker'),
	'zh-TW': () => import('./zh-TW/TimePicker')
};

const messages = {
	invalidProps: 'Min time cannot be greater than max time',
	invalidTime: 'Invalid time format',
	tooEarly: 'Time must be at after Min time',
	tooLate: 'Time must be before Max time'
};

export default { locales, messages };
