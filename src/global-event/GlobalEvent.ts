import global from '@dojo/shim/global';
import WidgetBase from '@dojo/widget-core/WidgetBase';

export interface GlobalEventProperties {
	type: 'window' | 'document';
	[index: string]: ((event?: any) => void) | string;
}

interface RegisteredListeners {
	event: string;
	listenerFunction: (event: any) => void;
}

export class GlobalEvent extends WidgetBase<GlobalEventProperties> {

	private _listeners: RegisteredListeners[] = [];

	protected onAttach() {
		const { type, ...listeners } = this.properties;
		Object.keys(listeners).forEach((key) => {
			const listenerFunction = this.properties[key];
			if (typeof listenerFunction === 'function') {
				this._listeners.push({ event: key, listenerFunction });
				global[type].addEventListener(key, this.properties[key]);
			}
		});
	}

	protected onDetach() {
		const { type } = this.properties;
		this._listeners.forEach(({ event, listenerFunction}) => {
			global[type].removeEventListener(event, listenerFunction);
		});
	}

	protected render() {
		if (this.children.length > 0) {
			return this.children;
		}
		return null;
	}
}

export default GlobalEvent;
