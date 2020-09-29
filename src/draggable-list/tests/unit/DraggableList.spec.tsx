const { describe, it, afterEach, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { create, tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';
import DraggableList, { move } from '../../index';
import * as themeCss from '../../../theme/default/draggable-list.m.css';
import GlobalEvent from '../../../global-event';
import drag from '@dojo/framework/core/middleware/drag';
import { SinonStub, stub } from 'sinon';
import global from '@dojo/framework/shim/global';

const middlewareFactory = create();
let isDragging = false;
let start: {} | undefined = undefined;
let addEventListenerStub: SinonStub;

if (!global.document) {
	global.document = {
		addEventListener() {},
		removeEventListener() {}
	};
}

if (!global.window) {
	global.window = {
		addEventListener() {},
		removeEventListener() {}
	};
}

describe('DraggableList', () => {
	beforeEach(() => {
		addEventListenerStub = stub(global.document, 'addEventListener');
	});

	afterEach(() => {
		addEventListenerStub.restore();
		isDragging = false;
		start = undefined;
	});

	it('renders without error', () => {
		const baseAssertion = assertion(() => (
			<ul classes={[null, themeCss.root]}>
				<GlobalEvent key="global" document={{ click: () => {} }} />
				<li
					classes={[themeCss.item, false, false]}
					key="undefined-key"
					styles={{
						marginTop: undefined,
						marginBottom: undefined
					}}
				>
					content
				</li>
			</ul>
		));

		const r = renderer(() => (
			<DraggableList onMove={() => {}}>
				{[
					{
						content: 'content',
						key: 'key'
					}
				]}
			</DraggableList>
		));

		r.expect(baseAssertion);
	});

	it('moves an item', () => {
		const WrappedItem1 = wrap('li');
		const WrappedItem2 = wrap('li');
		const baseAssertion = assertion(() => (
			<ul classes={[null, themeCss.root]}>
				<GlobalEvent key="global" document={{ click: () => {} }} />
				<WrappedItem1
					classes={[themeCss.item, themeCss.activeItem]}
					key="undefined-key"
					styles={{
						left: '7px',
						position: 'fixed',
						top: '7px',
						width: '0px',
						zIndex: '100'
					}}
				>
					content
				</WrappedItem1>
				<WrappedItem2
					classes={[themeCss.item, themeCss.paddedItemTop, false]}
					key="undefined-key-2"
					styles={{
						marginTop: '0px',
						marginBottom: undefined
					}}
				>
					content-2
				</WrappedItem2>
				<li
					classes={[themeCss.item, false, false]}
					key="undefined-key-3"
					styles={{
						marginTop: undefined,
						marginBottom: undefined
					}}
				>
					content-3
				</li>
			</ul>
		));

		isDragging = true;
		start = {
			client: {
				x: 10,
				y: 10
			},
			offset: {
				x: 5,
				y: 5
			}
		};

		const r = renderer(
			() => (
				<DraggableList onMove={() => {}}>
					{[
						{
							content: 'content',
							key: 'key'
						},
						{
							content: 'content-2',
							key: 'key-2'
						},
						{
							content: 'content-3',
							key: 'key-3'
						}
					]}
				</DraggableList>
			),
			{
				middleware: [
					[
						drag,
						() =>
							middlewareFactory(() => ({
								get: (key: string) => {
									if (key === 'undefined-key') {
										return {
											isDragging,
											start,
											delta: {
												x: 2,
												y: 2
											}
										};
									}
									return {};
								}
							}))()
					]
				]
			}
		);

		r.expect(baseAssertion);

		isDragging = false;

		r.expect(
			baseAssertion.setProperties(WrappedItem1, {
				key: 'undefined-key',
				classes: [themeCss.item, false, false],
				styles: {
					marginTop: undefined,
					marginBottom: undefined
				}
			})
		);

		isDragging = true;
		start = undefined;

		r.expect(
			baseAssertion.setProperties(WrappedItem1, {
				classes: [themeCss.item, themeCss.activeItem],
				key: 'undefined-key',
				styles: {
					left: '9px',
					position: 'fixed',
					top: '9px',
					width: '0px',
					zIndex: '100'
				}
			})
		);
	});

	describe('move', () => {
		const test = [1, 2, 3, 4];
		assert.equal(move(test, 0, 2).join(), [2, 3, 1, 4].join());
	});
});
