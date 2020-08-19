const locales = {
	zh: () => import('./zh-CN/TabContainer'),
	'zh-TW': () => import('./zh-TW/TabContainer')
};

const messages = {
	close: 'close'
};

export default { locales, messages };
