A reactive lightweight, customizable grid widget built with Dojo.

## Features

 * On-demand virtual rendering with supports for large data-sets
 * Backed by [`@dojo/framework/stores`](https://github.com/dojo/framework/tree/master/src/stores)
 * Editable cells
 * Filtering and Sorting by column
 * Custom cell renderers

## Example Usage

```ts
import global from "@dojo/framework/shim/global";
import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { createFetcher } from '@dojo/widgets/grid/utils';
import Grid from '@dojo/widgets/grid';

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

### `columnConfig`

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

### `fetcher`

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
	columnId: 'filter-value'
};
```

### `height`

The `height` property sets the overall height of the grid and allows the grid to calculate how many rows to render to the DOM.

### `updater`

The `updater` is an optional function responsible for performing updates made by `editable` columns.

```ts
(item: S): void;
```

The updated `item` is passed to the function, if an error occurs during the updater the changes will be reverted in the grid.

### `store`

Grid is backed by stores from `@dojo/framework/stores` and by default, dynamically creates a private store as required. However it is also possible to pass an existing store used by other areas of the application.

This option will often be used in combination with `id` that determines the root path location that all grid data will be stored.

### `id`

Optional `id` that specifies the root path that of the store that the grid data will be stored.

### `CustomRenderers`

Exposes an advanced set of options that enable you to customize the rendering of various sections of the grid.

#### `sortRenderer`

The sort renderer receives the column configuration, the sort order and a function to perform the sort action. This can be used to override the default sort button.

```ts
interface SortRenderer {
	(column: ColumnConfig, direction: 'asc' | 'desc' | undefined, sorter: () => void): DNode;
}
```

Example:

```ts
function sortRenderer(column: ColumnConfig, direction: 'asc' | 'desc' | undefined, sorter: () => void) {
	return v('button', { onclick: sorter }, [ `sort - ${direction || 'unsorted'}` ]);
}
```

## Helpers

A collection of helpers are available in the `@dojo/widgets/grid/utils` module that can be used to create custom `fetcher` and `updater` from a known data set.

#### `createFetcher`

Creates a fetch from an array of data that can be used to load the grid.

```ts
import { createFetcher } from '@dojo/widgets/grid/utils';

const data = [];
const fetcher = createFetcher(data);

// Example usage
render() {
	return w(Grid, { fetcher: fetcher });
}
```

#### `createUpdater`

Creates an updater from an array of data that can be used to edit data in the grid.

```ts
import { createUpdater } from '@dojo/widgets/grid/utils';

const data = [];
const updater = createUpdater(data);

// Example usage
render() {
	return w(Grid, { updater: updater });
}
```

## Theming

The grid can be customized by creating a custom theme, each of the grid widgets can be themed:

#### @dojo/widgets/grid/widgets/Grid

Theme Key: `@dojo/widgets/grid`

Classes:

* `root`
* `header`
* `filterGroup`

#### @dojo/widgets/grid/widgets/Body

Theme Key: `@dojo/widgets/grid-body`

Classes:

* `root`

#### @dojo/widgets/grid/widgets/Header

Theme Key: `@dojo/widgets/grid-header`

Classes:

* `root`
* `cell`
* `sortable`
* `sorted`
* `desc`
* `asc`
* `sort`
* `filter`

Other used `@dojo/widgets`:

* [@dojo/widgets/text-input](../text-input/README.md)
* [@dojo/widgets/icon](../icon/README.md)

#### @dojo/widgets/grid/widgets/Footer

Theme Key: `@dojo/widgets/grid-footer`

Classes:

* `root`

#### @dojo/widgets/grid/widgets/PlaceholderRow

Theme Key: `@dojo/widgets/grid-placeholder-row`

Classes:

* `root`
* `loading`
* `spin`

#### @dojo/widgets/grid/widgets/Row

Theme Key: `@dojo/widgets/grid-row`

Classes:

* `root`

#### @dojo/widgets/grid/widgets/Cell

Theme Key: `@dojo/widgets/grid-cell`

Classes:

* `root`
* `input`
* `edit`

Other used `@dojo/widgets`:

* [@dojo/widgets/text-input](../text-input/README.md)
* [@dojo/widgets/button](../button/README.md)
* [@dojo/widgets/icon](../icon/README.md)
