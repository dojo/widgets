import global from '@dojo/shim/global';
import WidgetBase from '@dojo/widget-core/WidgetBase';

export interface GlobalEventProperties {
	[index: string]: (() => void) | string;
}

interface RegisteredListeners {
	event: string;
	listenerFunction: () => void;
}

export class GlobalEvent extends WidgetBase<GlobalEventProperties> {

	private _documentListeners: RegisteredListeners[] = [];

	protected onAttach() {
		Object.keys(this.properties).forEach((key) => {
			const listenerFunction = this.properties[key];
			if (typeof listenerFunction === 'function') {
				this._documentListeners.push({ event: key, listenerFunction });
				global.document.addEventListener(key, this.properties[key]);
			}
		});
	}

	protected onDetach() {
		this._documentListeners.forEach(({ event, listenerFunction}) => {
			global.document.removeEventListener(event, listenerFunction);
		});
	}

	protected render() {
		return null;
	}
}

export default GlobalEvent;
