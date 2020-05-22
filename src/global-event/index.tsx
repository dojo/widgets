import global from '@dojo/framework/shim/global';
import { create, destroy, diffProperty } from '@dojo/framework/core/vdom';
import { shallow } from '@dojo/framework/core/diff';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export interface ListenerObject {
	[index: string]: (event?: any) => void;
}

export interface GlobalEventProperties {
	/** The global window object */
	window?: ListenerObject;
	/** The document for this context */
	document?: ListenerObject;
}

export interface RegisteredListeners {
	window: ListenerObject;
	document: ListenerObject;
}

interface GlobalEventICache {
	listeners: RegisteredListeners;
}

const factory = create({
	destroy,
	diffProperty,
	icache: createICacheMiddleware<GlobalEventICache>()
}).properties<GlobalEventProperties>();

export const GlobalEvent = factory(function({
	children,
	properties,
	middleware: { destroy, diffProperty, icache }
}) {
	const registerListeners = (
		type: 'window' | 'document',
		previousListeners: ListenerObject | undefined,
		newListeners: ListenerObject | undefined
	) => {
		const currentListeners = icache.getOrSet('listeners', {
			window: {},
			document: {}
		});
		const registeredListeners: ListenerObject = {};

		previousListeners &&
			Object.keys(previousListeners).forEach((eventName) => {
				const newListener = newListeners ? newListeners[eventName] : undefined;
				if (newListener === undefined) {
					global[type].removeEventListener(eventName, currentListeners[type][eventName]);
				} else if (previousListeners[eventName] !== newListener) {
					global[type].removeEventListener(eventName, currentListeners[type][eventName]);
					global[type].addEventListener(eventName, newListener);
					registeredListeners[eventName] = newListener;
				} else {
					registeredListeners[eventName] = newListener;
				}
			});

		newListeners &&
			Object.keys(newListeners).forEach((eventName) => {
				if (previousListeners === undefined || previousListeners[eventName] === undefined) {
					global[type].addEventListener(eventName, newListeners[eventName]);
					registeredListeners[eventName] = newListeners[eventName];
				}
			});
		currentListeners[type] = registeredListeners;

		icache.set('listeners', currentListeners);
	};

	diffProperty('window', properties, (previous, next) => {
		const { changed } = shallow(previous.window, next.window);
		changed && registerListeners('window', previous.window, next.window);
	});
	diffProperty('document', properties, (previous, next) => {
		const { changed } = shallow(previous.document, next.document);
		changed && registerListeners('document', previous.document, next.document);
	});

	const removeAllRegisteredListeners = (type: 'window' | 'document') => {
		const currentListeners = icache.getOrSet('listeners', {
			window: {},
			document: {}
		});
		Object.keys(currentListeners[type]).forEach((eventName) => {
			global[type].removeEventListener(eventName, currentListeners[type][eventName]);
		});
	};

	destroy(() => {
		removeAllRegisteredListeners('window');
		removeAllRegisteredListeners('document');
	});

	if (children().length > 0) {
		return children();
	}
	return null;
});

export default GlobalEvent;
