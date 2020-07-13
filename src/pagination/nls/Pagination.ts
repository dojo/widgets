const locales = {
	'zh-CN': () => import('./zh-CN/Pagination'),
	'zh-TW': () => import('./zh-TW/Pagination')
};

const messages = {
	next: 'Next',
	previous: 'Previous'
};

export default { locales, messages };
