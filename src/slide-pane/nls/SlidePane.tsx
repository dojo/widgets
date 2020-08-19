const locales = {
	zh: () => import('./zh-CN/SlidePane'),
	'zh-TW': () => import('./zh-TW/SlidePane')
};

const messages = {
	close: 'close'
};

export default { locales, messages };
