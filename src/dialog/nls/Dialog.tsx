const locales = {
	zh: () => import('./zh-CN/Dialog'),
	'zh-TW': () => import('./zh-TW/Dialog')
};

const messages = {
	close: 'close'
};

export default { locales, messages };
