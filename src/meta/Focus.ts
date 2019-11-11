import { Base } from '@dojo/framework/core/meta/Base';
import global from '@dojo/framework/shim/global';
import Set from '@dojo/framework/shim/Set';

export interface FocusResults {
	active: boolean;
	containsFocus: boolean;
}

const defaultResults = {
	active: false,
	containsFocus: false
};

export class Focus extends Base {
	private _nodeset = new Set<Element>();

	private _activeElement: Element | undefined;

	public get(key: string | number): FocusResults {
		const node = this.getNode(key);

		if (!node) {
			return { ...defaultResults };
		}

		this._nodeset.add(node);

		if (!this._activeElement) {
			this._activeElement = global.document.activeElement;
			this._createListener();
		}

		return {
			active: node === this._activeElement,
			containsFocus: !!this._activeElement && node.contains(this._activeElement)
		};
	}

	public set(key: string | number) {
		const node = this.getNode(key);
		node && (node as HTMLElement).focus();
	}

	private _onFocusChange = () => {
		if (
			(this._activeElement && this._nodeset.has(this._activeElement)) ||
			this._nodeset.has(global.document.activeElement) ||
			[...this._nodeset].some(
				(node) =>
					!!(
						node.contains(global.document.activeElement) ||
						(this._activeElement && node.contains(this._activeElement))
					)
			)
		) {
			this.invalidate();
		}

		this._activeElement = global.document.activeElement;
	};

	private _createListener() {
		global.document.addEventListener('focusin', this._onFocusChange);
		global.document.addEventListener('focusout', this._onFocusChange);
		this.own({
			destroy: () => {
				this._removeListener();
			}
		});
	}

	private _removeListener() {
		global.document.removeEventListener('focusin', this._onFocusChange);
		global.document.removeEventListener('focusout', this._onFocusChange);
	}
}

export default Focus;
