import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as css from './styles/listbox.m.css';

export interface ListboxOptionProperties extends ThemeableProperties {
	active?: boolean;
	classes?: (string | null)[];
	disabled?: boolean;
	id: string;
	index: number;
	label: DNode;
	option: any;
	selected?: boolean;
	onClick?(option: any, index: number, key?: string | number): void;
}

const ListboxOptionBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ListboxOption extends ListboxOptionBase<ListboxOptionProperties> {
	private _onClick(event: MouseEvent) {
		const { index, key, option, onClick } = this.properties;
		onClick && onClick(option, index, key);
	}

	protected render() {
		const {
			classes = [],
			disabled = false,
			id,
			label,
			selected = false
		} = this.properties;

		return v('div', {
			'aria-disabled': disabled ? 'true' : null,
			'aria-selected': disabled ? null : String(selected),
			classes: this.classes(...classes),
			id,
			role: 'option',
			onclick: this._onClick
		}, [ label ]);
	}
}
