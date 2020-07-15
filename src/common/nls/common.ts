const locales = {
	zh: () => import('./zh-CN/common'),
	'zh-TW': () => import('./zh-TW/common')
};

const messages = {
	clear: 'clear',
	close: 'close',
	open: 'open'
};

export default { locales, messages };
