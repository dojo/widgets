import global from '@dojo/framework/shim/global';
import { create, destroy, diffProperty } from '@dojo/framework/core/vdom';
import { shallow } from '@dojo/framework/core/diff';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

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
	middleware: { destroy, diffProperty, icache }
}) {
	const registerListeners = (
		type: 'window' | 'document',
		previousListeners: RegisteredListeners,
		newListeners: RegisteredListeners
	) => {
		const currentListeners = icache.get('listeners') || {
			window: {},
			document: {}
		};
		const registeredListeners: ListenerObject = {};
		previousListeners[type] &&
			Object.keys(previousListeners[type]).forEach((eventName) => {
				const newListener = newListeners[type][eventName];
				if (newListener === undefined) {
					global[type].removeEventListener(eventName, currentListeners[type][eventName]);
				} else if (previousListeners[type][eventName] !== newListener) {
					global[type].removeEventListener(eventName, currentListeners[type][eventName]);
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
		currentListeners[type] = registeredListeners;

		icache.set('listeners', currentListeners);
	};

	diffProperty('window', (previous: RegisteredListeners, next: RegisteredListeners) => {
		const { changed } = shallow(previous, next);
		changed && registerListeners('window', previous, next);
	});
	diffProperty('document', (previous: RegisteredListeners, next: RegisteredListeners) => {
		const { changed } = shallow(previous, next);
		changed && registerListeners('document', previous, next);
	});

	const removeAllRegisteredListeners = (type: 'window' | 'document') => {
		const currentListeners = icache.get('listeners') || {
			window: {},
			document: {}
		};
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
