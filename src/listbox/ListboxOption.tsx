import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

import * as css from '../theme/default/listbox.m.css';

export interface ListboxOptionProperties extends ThemedProperties {
	active?: boolean;
	css?: (string | null)[];
	disabled?: boolean;
	id: string;
	index: number;
	label: DNode;
	option: any;
	selected?: boolean;
	onClick?(option: any, index: number, key?: string | number): void;
}

@theme(css)
export class ListboxOption extends ThemedMixin(WidgetBase)<ListboxOptionProperties> {
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		const { index, key, option, onClick } = this.properties;
		onClick && onClick(option, index, key);
	}

	protected render(): DNode {
		const { css = [], disabled = false, id, label, selected = false } = this.properties;

		return v(
			'div',
			{
				'aria-disabled': disabled ? 'true' : null,
				'aria-selected': disabled ? null : String(selected),
				classes: this.theme(css),
				id,
				role: 'option',
				onmousedown: this._onClick
			},
			[label]
		);
	}
}

export default ListboxOption;
