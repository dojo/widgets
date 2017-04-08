import has from '@dojo/has/has';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import MenuBar from '../../MenuBar';
import * as css from '../../styles/menuBar.m.css';

registerSuite({
	name: 'MenuBar',

	beforeEach() {
		if (has('host-node')) {
			(<any> global).window = {
				addEventListener: sinon.spy(),
				removeEventListener: sinon.spy()
			};
			(<any> global).document = {
				body: { offsetWidth: 500 }
			};
		}
		else if (has('host-browser')) {
			sinon.spy(window, 'addEventListener');
			sinon.spy(window, 'removeEventListener');
		}
	},

	afterEach() {
		if (has('host-node')) {
			delete (<any> global).window;
			delete (<any> global).document;
		}
		else if (has('host-browser')) {
			(<any> window).addEventListener.restore();
			(<any> window).removeEventListener.restore();
		}
	},

	'Should construct menu bar with passed properties'() {
		const menuBar = new MenuBar();
		menuBar.setProperties({
			key: 'foo',
			breakpoint: 500,
			slidePaneButtonLabel: 'Open SlidePane',
			open: false
		});

		assert.strictEqual(menuBar.properties.key, 'foo');
		assert.strictEqual(menuBar.properties.breakpoint, 500);
		assert.strictEqual(menuBar.properties.slidePaneButtonLabel, 'Open SlidePane');
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
		basic: () => {
			const menuBar = new MenuBar();
			assert.isTrue((<any> window.addEventListener).calledWith('resize'));

			menuBar.destroy();
			assert.isTrue((<any> window.removeEventListener).calledWith('resize'));
		},

		'invalidates the widget'(this: any) {
			const dfd = this.async();
			const menuBar = new MenuBar();
			const listener: () => void = (<any> window.addEventListener).args[0][1];

			menuBar.setProperties({ breakpoint: 1000 });
			sinon.spy(menuBar, 'invalidate');
			listener();

			setTimeout(dfd.callback(() => {
				assert.isTrue((<any> menuBar).invalidate.called);
			}), 300);
		}
	},

	slidePane() {
		const menuBar = new MenuBar();
		const onRequestOpen = sinon.spy();
		menuBar.setProperties({
			breakpoint: Infinity,
			open: true,
			onRequestOpen,
			slidePaneButtonLabel: 'Button Label',
			slidePaneStyles: css
		});

		const vnode: any = menuBar.__render__();
		(<any> menuBar)._onSlidePaneClick();
		assert.isTrue(onRequestOpen.called);

		const button = vnode.children[0];
		assert.strictEqual(button.vnodeSelector, 'button');
		assert.strictEqual(button.text, 'Button Label');
		assert.isTrue(button.properties.classes[css.slidePaneButton]);
	}
});
