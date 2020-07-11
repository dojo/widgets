const locales = {
	'zh-CN': () => import('./zh-CN/Select')
};

const messages = {
	requiredMessage: 'Please select a value.'
};

export default { locales, messages };
