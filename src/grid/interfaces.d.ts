import { DNode } from '@dojo/framework/core/interfaces';

export interface FetcherMeta {
	total: number;
}

export interface FetcherResult<S = any> {
	data: S[];
	meta: FetcherMeta;
}

export interface SortOptions {
	columnId: string;
	direction: 'asc' | 'desc';
}

export interface FilterOptions {
	columnId: string;
	value: any;
}

export interface FetcherOptions {
	sort?: SortOptions;
	filter?: {
		[index: string]: string;
	};
}

export interface Fetcher<S = any> {
	(offset: number, size: number, options?: FetcherOptions): Promise<FetcherResult<S>>;
}

export interface Updater<S = any> {
	(item: S): void;
}

export interface ColumnConfig {
	id: string;
	title: string | (() => DNode);
	filterable?: boolean;
	sortable?: boolean;
	editable?: boolean;
	resizable?: boolean;
	renderer?: (props: any) => DNode;
}

export interface PageChangeCommandPayload {
	page: number;
	id: string;
}

export interface FetcherCommandPayload {
	fetcher: Fetcher;
	page: number;
	pageSize: number;
	id: string;
}

export type SelectionType = 'single' | 'multi';

export interface SelectionCommandPayload {
	id: string;
	index: number;
	type: SelectionType;
}

export interface SortCommandPayload {
	id: string;
	fetcher: Fetcher;
	columnId: string;
	direction: 'asc' | 'desc';
}

export interface FilterCommandPayload {
	id: string;
	fetcher: Fetcher;
	filterOptions: FilterOptions;
}

export interface UpdaterCommandPayload {
	updater: any;
	page: number;
	id: string;
	value: any;
	columnId: string;
	rowNumber: number;
}

export interface GridPages<S> {
	[index: string]: S[];
}

export interface GridEditedRow<S> {
	page: number;
	index: number;
	item: S;
}

export interface GridMeta<S> {
	page: number;
	total: number;
	pageSize: number;
	sort: SortOptions;
	filter: {
		[index: string]: string;
	};
	currentFilter: FilterOptions;
	isSorting: boolean;
	editedRow: GridEditedRow<S>;
	selection: number[];
	fetchedPages: number[];
}

export interface GridData<S> {
	pages: GridPages<S>;
}

export interface GridState<S = any> {
	[index: string]: {
		meta: GridMeta<S>;
		data: GridData<S>;
	};
}
