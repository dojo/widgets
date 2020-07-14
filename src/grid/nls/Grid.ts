const locales = {
	zh: () => import('./zh-CN/Grid'),
	'zh-TW': () => import('./zh-TW/Grid')
};

const messages = {
	currentPage: 'Current Page, Page {page}',
	edit: 'Edit',
	editValue: 'Edit {value}',
	goToPage: 'Go to Page {page}',
	noResults: '0 Results',
	pageOfTotal: 'Page {page} of {totalPages}. Total rows {totalRows}',
	pageOfUnknownTotal: 'Page {page} of ?',
	pagination: 'Pagination Navigation',
	resultRange: '{from} – {to} of {total} Results',
	sortBy: 'Sort by {name}',
	filterBy: 'Filter by {name}'
};

export default { locales, messages };
