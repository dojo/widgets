import { createProcess, createCommandFactory, Process } from '@dojo/framework/stores/process';
import { replace, remove } from '@dojo/framework/stores/state/operations';
import {
	FetcherResult,
	GridState,
	FetcherCommandPayload,
	PageChangeCommandPayload,
	SortCommandPayload,
	FilterCommandPayload,
	UpdaterCommandPayload,
	FetcherOptions
} from './interfaces';

const commandFactory = createCommandFactory<GridState>();

const pageChangeCommand = commandFactory<PageChangeCommandPayload>(({ path, get, payload: { id, page } }) => {
	const currentPage = get(path(id, 'meta', 'page'));
	if (page !== currentPage) {
		return [replace(path(id, 'meta', 'page'), page)];
	}
	return [];
});

const preFetcherCommand = commandFactory<PageChangeCommandPayload>(({ path, get, payload: { id, page } }) => {
	const fetchedPages = get(path(id, 'meta', 'fetchedPages')) || [];
	if (fetchedPages.indexOf(page) === -1) {
		return [replace(path(id, 'meta', 'fetchedPages'), [...fetchedPages, page])];
	}
	throw Error('The page has already been requested');
});

const fetcherCommand = commandFactory<FetcherCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, page, pageSize } }) => {
		let result: FetcherResult;
		const isSorting = get(path(id, 'meta', 'isSorting'));
		if (!isSorting) {
			const sortOptions = get(path(id, 'meta', 'sort'));
			const filterOptions = get(path(id, 'meta', 'filter'));
			try {
				result = await fetcher(page, pageSize, { sort: sortOptions, filter: filterOptions });
			} catch (error) {
				return [remove(path(id, 'data', 'pages', `page-${page}`))];
			}
			return [
				replace(path(id, 'data', 'pages', `page-${page}`), result.data),
				replace(path(id, 'meta', 'total'), result.meta.total),
				replace(path(id, 'meta', 'pageSize'), pageSize)
			];
		} else {
			throw Error('The grid is being sorted or filtered');
		}
	}
);

const preSortCommand = commandFactory<SortCommandPayload>(({ at, path, get, payload: { id, columnId, direction } }) => {
	const page = get(path(id, 'meta', 'page'));
	return [
		remove(path(id, 'data', 'pages')),
		replace(path(id, 'meta', 'fetchedPages'), page === 1 ? [1] : [page, page - 1]),
		replace(path(id, 'meta', 'sort', 'columnId'), columnId),
		replace(path(id, 'meta', 'sort', 'direction'), direction),
		replace(path(id, 'meta', 'isSorting'), true)
	];
});

const preFilterCommand = commandFactory<FilterCommandPayload>(({ at, path, get, payload: { id, filterOptions, multipleFilters } }) => {
	const existingFilters = get(path(id, 'meta', 'filter'));
	return [
		remove(path(id, 'data', 'pages')),
		replace(path(id, 'meta', 'fetchedPages'), [1]),
		replace(path(id, 'meta', 'filter', filterOptions.columnId ), filterOptions.value),
		replace(path(id, 'meta', 'currentFilter'), filterOptions),
		replace(path(id, 'meta', 'page'), 1),
		replace(path(id, 'meta', 'isSorting'), true)
	];
});

const sortCommand = commandFactory<SortCommandPayload>(async ({ at, path, get, payload }) => {
	const { id, fetcher, columnId, direction } = payload;
	const page = get(path(id, 'meta', 'page'));
	if (page === 1) {
		return sortForFirstPage({ at, get, path, payload });
	}
	const pageSize = get(path(id, 'meta', 'pageSize'));
	const filterOptions = get(path(id, 'meta', 'filter'));
	let result: FetcherResult[];
	try {
		const options = {
			sort: { columnId, direction },
			filter: filterOptions
		};
		const previousPage = fetcher(page - 1, pageSize, options);
		const currentPage = fetcher(page, pageSize, options);
		result = await Promise.all([previousPage, currentPage]);
	} catch (err) {
		return [];
	}

	return [
		replace(path(id, 'data', 'pages', `page-${page - 1}`), result[0].data),
		replace(path(id, 'data', 'pages', `page-${page}`), result[1].data),
		replace(path(id, 'meta', 'sort', 'columnId'), columnId),
		replace(path(id, 'meta', 'sort', 'direction'), direction),
		replace(path(id, 'meta', 'total'), result[1].meta.total),
		replace(path(id, 'meta', 'page'), page),
		replace(path(id, 'meta', 'isSorting'), false)
	];
});

const sortForFirstPage = commandFactory<SortCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, columnId, direction } }) => {
		const pageSize = get(path(id, 'meta', 'pageSize'));
		const filterOptions = get(path(id, 'meta', 'filter'));
		let result: FetcherResult;
		try {
			result = await fetcher(1, pageSize, {
				sort: { columnId, direction },
				filter: filterOptions
			});
		} catch (err) {
			return [];
		}
		return [
			replace(path(id, 'data', 'pages', 'page-1'), result.data),
			replace(path(id, 'meta', 'sort', 'columnId'), columnId),
			replace(path(id, 'meta', 'sort', 'direction'), direction),
			replace(path(id, 'meta', 'total'), result.meta.total),
			replace(path(id, 'meta', 'page'), 1),
			replace(path(id, 'meta', 'isSorting'), false)
		];
	}
);

const filterCommand = commandFactory<FilterCommandPayload>(
	async ({ at, path, get, payload: { id, fetcher, filterOptions } }) => {
		const pageSize = get(path(id, 'meta', 'pageSize'));
		const sortOptions = get(path(id, 'meta', 'sort'));
		const currentFilters = get(path(id, 'meta', 'filter'));
		let result: FetcherResult;
		let options: FetcherOptions = { sort: sortOptions, filter: currentFilters };
		try {
			result = await fetcher(1, pageSize, options);
		} catch (err) {
			return [];
		}

		const filters = get(path(id, 'meta', 'filter'));
		if (filterOptions !== get(path(id, 'meta', 'currentFilter'))) {
			throw new Error();
		}
		return [
			remove(path(id, 'data', 'pages')),
			replace(path(id, 'data', 'pages', 'page-1'), result.data),
			replace(path(id, 'meta', 'total'), result.meta.total),
			replace(path(id, 'meta', 'isSorting'), false)
		];
	}
);

const preUpdateCommand = commandFactory<UpdaterCommandPayload>(
	({ at, path, get, payload: { id, updater, columnId, value, page, rowNumber } }) => {
		const item = get(at(path(id, 'data', 'pages', `page-${page}`), rowNumber));
		const updatedItem = { ...item, [columnId]: value };

		return [
			replace(at(path(id, 'data', 'pages', `page-${page}`), rowNumber), updatedItem),
			replace(path(id, 'meta', 'editedRow', 'page'), page),
			replace(path(id, 'meta', 'editedRow', 'index'), rowNumber),
			replace(path(id, 'meta', 'editedRow', 'item'), { ...item })
		];
	}
);

const updaterCommand = commandFactory<UpdaterCommandPayload>(
	async ({ at, path, get, payload: { id, updater, columnId, value, page, rowNumber } }) => {
		const item = get(at(path(id, 'data', 'pages', `page-${page}`), rowNumber));
		try {
			await updater(item);
		} catch (err) {
			const previousItem = get(path(id, 'meta', 'editedRow', 'item'));
			return [replace(at(path(id, 'data', 'pages', `page-${page}`), rowNumber), previousItem)];
		}

		return [replace(path(id, 'meta', 'editedRow'), undefined)];
	}
);

export const updaterProcess: Process<GridState, UpdaterCommandPayload> = createProcess('grid-update', [
	preUpdateCommand,
	updaterCommand
]);
export const fetcherProcess: Process<GridState, FetcherCommandPayload> = createProcess('grid-fetch', [
	preFetcherCommand,
	fetcherCommand
]);
export const filterProcess: Process<GridState, FilterCommandPayload> = createProcess('grid-filter', [
	preFilterCommand,
	filterCommand
]);
export const sortProcess: Process<GridState, SortCommandPayload> = createProcess('grid-sort', [
	preSortCommand,
	sortCommand
]);
export const pageChangeProcess: Process<GridState, PageChangeCommandPayload> = createProcess('grid-page-change', [
	pageChangeCommand
]);
