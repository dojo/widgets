import global from '@dojo/framework/shim/global';
import { create, diffProperty, tsx } from '@dojo/framework/core/vdom';

export interface ListenerObject {
	[index: string]: (event?: any) => void;
}

export interface GlobalEventProperties extends Partial<RegisteredListeners> {
	/** The global window object */
	window?: ListenerObject;
	/** The document for this context */
	document?: ListenerObject;
}

export interface RegisteredListeners {
	window: ListenerObject;
	document: ListenerObject;
}

const factory = create({ diffProperty }).properties<GlobalEventProperties>();

export const GlobalEvent = factory(function({
	children,
	properties,
	middleware: { diffProperty }
}) {
	const listeners: RegisteredListeners = {
		window: {},
		document: {}
	};

	const registerListeners = (
		type: 'window' | 'document',
		previousListeners: RegisteredListeners,
		newListeners: RegisteredListeners
	) => {
		const registeredListeners: ListenerObject = {};
		previousListeners[type] &&
			Object.keys(previousListeners[type]).forEach((eventName) => {
				const newListener = newListeners[type][eventName];
				if (newListener === undefined) {
					global[type].removeEventListener(eventName, listeners[type][eventName]);
				} else if (previousListeners[type][eventName] !== newListener) {
					global[type].removeEventListener(eventName, listeners[type][eventName]);
					global[type].addEventListener(eventName, newListener);
					registeredListeners[eventName] = newListener;
				} else {
					registeredListeners[eventName] = newListener;
				}
			});

		newListeners[type] &&
			Object.keys(newListeners[type]).forEach((eventName) => {
				if (
					previousListeners[type] === undefined ||
					previousListeners[type][eventName] === undefined
				) {
					global[type].addEventListener(eventName, newListeners[type][eventName]);
					registeredListeners[eventName] = newListeners[type][eventName];
				}
			});
		// console.log('registeredListeners', registeredListeners);
		listeners[type] = registeredListeners;
	};

	diffProperty('window', (previous: RegisteredListeners, next: RegisteredListeners) =>
		registerListeners('window', previous, next)
	);
	diffProperty('document', (previous: RegisteredListeners, next: RegisteredListeners) =>
		registerListeners('document', previous, next)
	);

	if (children().length > 0) {
		return children();
	}
	return null;
});

export default GlobalEvent;
