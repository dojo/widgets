# @dojo/widgets/global-event/GlobalEvent widget

Dojo 2's `GlobalEvent` enables events to be registered on `document` and `window` reactively.

## Features

- Can be used as a wrapping widget and will return children on render or used within a widgets returned DNode structure and returns `null` from `render`.
- Reactively adds and removes global events listeners based on the `window` and `document` properties.

## Example Usage

```ts
// Wrapping DNodes as children
w(GlobalEvent, {
	window: { keydown: () => {} },
	document: { focus: () => {} }
}, [
	// Add widget's DNodes
]);

// Used in the DNode tree
v('div', { key: 'root' }, [
	w(GlobalEvent, { window: click: () => {} }),
	w(Button, { /* button options */ })
]);
```
