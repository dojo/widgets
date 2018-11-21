A reactive lightweight, customizable grid widget built with Dojo.

## Features

 * On-demand virtual rendering with supports for large data-sets
 * Backed by [`@dojo/framework/stores`](https://github.com/dojo/framework/tree/master/src/stores)
 * Editable cells
 * Filtering and Sorting by column
 * Custom cell renderers

## Requirements

The grid uses the `Resize` meta from `@dojo/framework/widget-core/meta/Resize` internally. For browsers that do not support the `ResizeObserver` API, currently [all except Chrome](https://caniuse.com/#feat=resizeobserver), a polyfill is required:

```shell
npm install resize-observer-polyfill@1.5.0 --save-exact
```

In your application's `main.ts`, the `resize-observer-polyfill` needs to be imported and added to the global if the `ResizeObserver` global does not already exist:

```ts
import ResizeObserver from 'resize-observer-polyfill';
import global from "@dojo/framework/shim/global";

if (!global.ResizeObserver) {
	global.ResizeObserver = ResizeObserver;
}
```

## Example Usage

```ts
import global from "@dojo/framework/shim/global";
import ResizeObserver from 'resize-observer-polyfill';
import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { createFetcher } from '@dojo/widgets/grid/utils';
import Grid from '@dojo/widgets/grid';

if (!global.ResizeObserver) {
	global.ResizeObserver = ResizeObserver;
}

const columnConfig = [
	{
		id: 'one',
		title: 'Column One',
		sortable: true,
		filterable: true
	},
	{
		id: 'two',
		title: 'Column Two'
	}
];

const gridData: any[] = [
	{ one: '0', two: '0' },
	{ one: '1', two: '1' },
	{ one: '2', two: '2' },
	{ one: '3', two: '3' },
	{ one: '4', two: '4' },
	{ one: '5', two: '5' },
	{ one: '6', two: '6' }
];

const r = renderer(() => w(Grid, { columnConfig, fetcher: createFetcher(gridData), height: 400 });
r.mount();
```

## Properties

### columnConfig

The column configuration defines how the grid will be built and what capabilities will be enabled per column.

```ts
export interface ColumnConfig {
	id: string;
	title: string | (() => DNode);
	filterable?: boolean;
	sortable?: boolean;
	editable?: boolean;
	renderer?: (props: any) => DNode;
}
```

 * `id` - The `id` of the column
 * `title` - The display title of the column, this can be a string or a custom renderer function that returns a `DNode`
 * `filterable` - Optional property that indicates if the column is filterable, defaults to `false`
 * `sortable` - Optional property that indicates if the column is sortable, defaults to `false`
 * `editable` - Optional property that indicates if the column is editable, defaults to `false`
 * `renderer` - Optional custom renderer function for the column cell, defaults to `undefined`

### fetcher

The fetcher is a function responsible for returning data to the grid for the requested offset and size.

```ts
(offset: number, size: number, options?: FetcherOptions): Promise<FetcherResult<S>>;
```

Additionally the fetcher will receive any additional options (`FetcherOptions`) as a third optional parameter.

```ts
export interface FetcherOptions {
	sort?: SortOptions;
	filter?: FilterOptions;
}
```

#### Sort Options

 * `columnId` - `id` from `columnConfig` of the column that sort has been requested for
 * `direction` - direction of the sort requested, either `asc` or `desc`

#### Filter Options

An object that is keyed by the column Id with the filter as the value

```ts
const filter = {
	columnId: 'filter-value
};
```

### multipleFilters

Indicates is the grid should supports filtering across multiple columns.

### height

The `height` property sets the overall height of the grid and allows the grid to calculate how many rows to render to the DOM.

### updater

The `updater` is an optional function responsible for performing updates made by `editable` columns.

```ts
(item: S): void;
```

The updated `item` is passed to the function, if an error occurs during the updater the changes will be reverted in the grid.

### store

Grid is backed by stores from `@dojo/framework/stores` and by default, dynamically creates a private store as required. However it is also possible to pass an existing store used by other areas of the application.

This option will often be used in combination with `id` that determines the root path location that all grid data will be stored.

### id

Optional `id` that specifies the root path that of the store that the grid data will be stored.
