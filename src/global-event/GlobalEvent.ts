import global from '@dojo/shim/global';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { shallow } from '@dojo/widget-core/diff';

export interface ListenerObject {
	[index: string]: (event?: any) => void;
}

export interface GlobalEventProperties extends Partial<RegisteredListeners> {
	window?: ListenerObject;
	document?: ListenerObject;
}

interface RegisteredListeners {
	window: ListenerObject;
	document: ListenerObject;
}

export class GlobalEvent extends WidgetBase<GlobalEventProperties> {

	private _listeners: RegisteredListeners = {
		window: {},
		document: {}
	};

	private _registerListeners(type: 'window' | 'document', previousListeners: RegisteredListeners, newListeners: RegisteredListeners) {
		const registeredListeners: ListenerObject = {};
		previousListeners[type] && Object.keys(previousListeners[type]).forEach((eventName) => {
			const newListener = newListeners[type][eventName];
			if (newListener === undefined) {
				global[type].removeEventListener(eventName, this._listeners[type][eventName]);
			}
			else if (previousListeners[type][eventName] !== newListener) {
				global[type].removeEventListener(eventName, this._listeners[type][eventName]);
				global[type].addEventListener(eventName, newListener);
				registeredListeners[eventName] = newListener;
			}
		});

		newListeners[type] && Object.keys(newListeners[type]).forEach((eventName) => {
			if (previousListeners[type] === undefined || previousListeners[type][eventName] === undefined) {
				global[type].addEventListener(eventName, newListeners[type][eventName]);
				registeredListeners[eventName] = newListeners[type][eventName];
			}
		});
		this._listeners[type] = registeredListeners;
	}

	private _removeAllRegisteredListeners(type: 'window' | 'document') {
		Object.keys(this._listeners[type]).forEach((eventName) => {
			global[type].removeEventListener(eventName, this._listeners[type][eventName]);
		});
	}

	@diffProperty('window', shallow)
	protected onWindowListenersChange(previousListeners: RegisteredListeners, newListeners: RegisteredListeners) {
		this._registerListeners('window', previousListeners, newListeners);
	}

	@diffProperty('document', shallow)
	protected onDocumentListenersChange(previousListeners: RegisteredListeners, newListeners: RegisteredListeners) {
		this._registerListeners('document', previousListeners, newListeners);
	}

	protected onDetach() {
		this._removeAllRegisteredListeners('window');
		this._removeAllRegisteredListeners('document');
	}

	protected render() {
		if (this.children.length > 0) {
			return this.children;
		}
		return null;
	}
}

export default GlobalEvent;
