import { DNode, Widget, WidgetProperties, WidgetFactory, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { includes } from '@dojo/shim/array';

import css from './styles/dialog';
import * as animations from '../../styles/animations';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';

export interface DialogProperties extends WidgetProperties {
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	modal?: boolean;
	open?: boolean;
	title?: string;
	underlay?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
};

export type Dialog = Widget<DialogProperties> & Themeable & {
	onCloseClick?(): void;
	onUnderlayClick?(): void;
};

export interface DialogFactory extends WidgetFactory<Dialog, DialogProperties> { };

function onPropertiesChanged(instance: Dialog, { open = false, onOpen = null }: DialogProperties, changedPropertyKeys: string[]) {
	const openChanged = includes(changedPropertyKeys, 'open');

	if (openChanged && open && onOpen) {
		onOpen();
	}
}

const createDialog: DialogFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,

		onCloseClick(this: Dialog) {
			const { closeable = true } = this.properties;
			closeable && this.properties.onRequestClose && this.properties.onRequestClose();
		},

		onUnderlayClick(this: Dialog) {
			!this.properties.modal && this.onCloseClick && this.onCloseClick();
		},

		render(this: Dialog): DNode {
			let key = 0;

			const {
				closeable = true,
				enterAnimation = animations.fadeIn,
				exitAnimation = animations.fadeOut,
				title = '',
				open = false,
				underlay
			} = this.properties;

			const {
				main,
				underlay: underlayClass,
				close,
				title: titleClass,
				content
			} = css.classes;

			const outerNode: DNode =
			v('div', {
				'data-underlay': underlay ? 'true' : 'false',
				'data-open': open ? 'true' : 'false'
			}, [
				v('div', {
					key: key++,
					classes: this.classes(underlayClass).get(),
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
					onclick: this.onUnderlayClick
				}),
				v('div', {
					key: key++,
					classes: this.classes(main).get(),
					enterAnimation: enterAnimation,
					exitAnimation: exitAnimation
				}, [
					v('div', { classes: this.classes(titleClass).get() }, [
						title,
						closeable ? v('div', {
							classes: this.classes(close).get(),
							innerHTML: '✕',
							onclick: this.onCloseClick
						}) : null
					]),
					v('div', { classes: this.classes(content).get() }, this.children)
				])
			]);

			return open ? outerNode : null;
		}
	},
	initialize(instance: any) {
		instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<Dialog, DialogProperties>) => {
			onPropertiesChanged(instance, evt.properties, evt.changedPropertyKeys);
		}));
		onPropertiesChanged(instance, instance.properties, [ 'open' ]);
	}
});

export default createDialog;
