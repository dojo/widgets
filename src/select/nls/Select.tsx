const locales = {
	zh: () => import('./zh-CN/Select'),
	'zh-TW': () => import('./zh-TW/Select')
};

const messages = {
	requiredMessage: 'Please select a value.'
};

export default { locales, messages };
