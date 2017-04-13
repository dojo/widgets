import has from '@dojo/has/has';
import { v } from '@dojo/widget-core/d';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import MenuBar from '../../MenuBar';
import * as css from '../../styles/menuBar.m.css';
import * as util from '../../../common/util';

let mockSubscription: { unsubscribe: any };

registerSuite({
	name: 'MenuBar',

	beforeEach() {
		if (has('host-node')) {
			(<any> global).document = {
				body: { offsetWidth: 500 }
			};
		}

		mockSubscription = { unsubscribe: sinon.spy() };
		sinon.stub(util, 'observeViewport').returns(mockSubscription);
	},

	afterEach() {
		if (has('host-node')) {
			delete (<any> global).document;
		}

		(<any> util.observeViewport).restore();
	},

	'Should construct menu bar with passed properties'() {
		const menuBar = new MenuBar();
		menuBar.setProperties({
			key: 'foo',
			breakpoint: 500,
			open: false,
			slidePaneTrigger: 'Open SlidePane'
		});

		assert.strictEqual(menuBar.properties.key, 'foo');
		assert.strictEqual(menuBar.properties.breakpoint, 500);
		assert.strictEqual(menuBar.properties.slidePaneTrigger, 'Open SlidePane');
		assert.isFalse(menuBar.properties.open);
	},

	breakpoint: {
		'display slide pane beneath breakpoint'() {
			const menuBar = new MenuBar();
			menuBar.setProperties({ breakpoint: Infinity });
			const vnode: any = menuBar.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'div');
			assert.isTrue(vnode.properties.classes[css.slidePane]);
			assert.lengthOf(vnode.children, 2);
		},

		'display menu beyond breakpoint'() {
			const menuBar = new MenuBar();
			menuBar.setProperties({ breakpoint: 0 });
			const vnode: any = menuBar.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'header');
			assert.notOk(vnode.properties.classes[css.slidePane]);
			assert.lengthOf(vnode.children, 0);
		},

		'display menu without a breakpoint'() {
			const menuBar = new MenuBar();
			const vnode: any = menuBar.__render__();

			assert.strictEqual(vnode.vnodeSelector, 'header');
			assert.notOk(vnode.properties.classes[css.slidePane]);
			assert.lengthOf(vnode.children, 0);
		}
	},

	'observes window resizes': {
		'invalidates when vw increases beyond breakpoint'(this: any) {
			const dfd = this.async();
			const menuBar = new MenuBar();
			const observer = (<any> util.observeViewport).args[0][0];

			menuBar.setProperties({ breakpoint: 800 });
			sinon.spy(menuBar, 'invalidate');
			observer.next(900);

			setTimeout(dfd.callback(() => {
				assert.isTrue((<any> menuBar).invalidate.called);
			}), 300);
		},

		'invalidates when vw decreases beneath breakpoint'(this: any) {
			const dfd = this.async();
			const menuBar = new MenuBar();
			const observer = (<any> util.observeViewport).args[0][0];

			menuBar.setProperties({ breakpoint: 400 });
			sinon.spy(menuBar, 'invalidate');
			observer.next(300);

			setTimeout(dfd.callback(() => {
				assert.isTrue((<any> menuBar).invalidate.called);
			}), 300);
		},

		'does not invalidate when the viewport width does not cross the breakpoint'(this: any) {
			const dfd = this.async();
			const menuBar = new MenuBar();
			const observer = (<any> util.observeViewport).args[0][0];

			menuBar.setProperties({ breakpoint: 800 });
			sinon.spy(menuBar, 'invalidate');
			observer.next(500);

			setTimeout(dfd.callback(() => {
				assert.isFalse((<any> menuBar).invalidate.called);
			}), 300);
		},

		'stops observing on destroy'() {
			const menuBar = new MenuBar();
			menuBar.destroy();

			assert.isTrue(mockSubscription.unsubscribe.called);
		}
	},

	onRequestOpen() {
		const menuBar = new MenuBar();
		const onRequestOpen = sinon.spy();
		menuBar.setProperties({
			breakpoint: Infinity,
			onRequestOpen
		});

		(<any> menuBar)._onSlidePaneClick();
		assert.isTrue(onRequestOpen.called);
	},

	slidePaneTrigger: {
		'defaults to a <button>'() {
			const menuBar = new MenuBar();
			menuBar.setProperties({ breakpoint: Infinity });
			const vnode: any = menuBar.__render__();
			const button = vnode.children[0];

			assert.strictEqual(button.vnodeSelector, 'button');
			assert.notOk(button.text);
			assert.isTrue(button.properties.classes[css.slidePaneButton]);
		},

		'string value'() {
			const menuBar = new MenuBar();
			menuBar.setProperties({
				breakpoint: Infinity,
				slidePaneTrigger: 'Button Label'
			});

			const vnode: any = menuBar.__render__();
			const button = vnode.children[0];
			assert.strictEqual(button.vnodeSelector, 'button');
			assert.strictEqual(button.text, 'Button Label');
			assert.isTrue(button.properties.classes[css.slidePaneButton]);
		},

		'function value'() {
			const menuBar = new MenuBar();
			const slidePaneTrigger = sinon.stub().returns(v('a', [ 'Button label' ]));
			const onRequestOpen = sinon.spy();
			menuBar.setProperties({
				breakpoint: Infinity,
				onRequestOpen,
				slidePaneTrigger
			});

			const vnode: any = menuBar.__render__();
			const button = vnode.children[0];
			assert.strictEqual(button.vnodeSelector, 'a');
			assert.strictEqual(button.text, 'Button label');

			const onClick = slidePaneTrigger.args[0][0];
			onClick();
			assert.isTrue(onRequestOpen.called, 'slidePaneTrigger should be passed the onClick listener');
		}
	}
});
