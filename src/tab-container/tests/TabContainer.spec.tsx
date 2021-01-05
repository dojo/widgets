import { AriaAttributes } from '@dojo/framework/core/interfaces';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { tsx, v, w } from '@dojo/framework/core/vdom';

import { Keys } from '../../common/util';
import Icon from '../../icon';
import TabContainer from '../index';
import * as css from '../../theme/default/tab-container.m.css';
import {
	createHarness,
	compareId,
	compareWidgetId,
	isStringComparator,
	noop
} from '../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

const compareLabelledBy = { selector: '*', property: 'labelledBy', comparator: isStringComparator };
const compareControls = { selector: '*', property: 'controls', comparator: isStringComparator };
const harness = createHarness([compareId, compareWidgetId, compareControls, compareLabelledBy]);

const createMockKeydownEvent = (which: number) => {
	return {
		stopPropagation: sinon.spy(),
		preventDefault: sinon.spy(),
		which
	} as any;
};

const mockClickEvent = {
	stopPropagation: sinon.spy(),
	preventDefault: sinon.spy()
};

const baseTemplate = assertionTemplate(() => (
	<div
		key="root"
		aria-orientation={'horizontal'}
		classes={[undefined, null, css.root]}
		role="tablist"
	>
		<div key="buttons" classes={css.tabButtons} />
		<div key="tabs" classes={css.tabs} />
	</div>
));

const reverseOrientationTemplate = assertionTemplate(() => (
	<div
		key="root"
		aria-orientation={'vertical'}
		classes={[undefined, css.alignRight, css.root]}
		role="tablist"
	>
		<div key="tabs" classes={css.tabs} />
		<div key="buttons" classes={css.tabButtons} />
	</div>
));

const tabButtonProperties = {
	'aria-controls': 'test-tab-0',
	'aria-disabled': 'false' as AriaAttributes['aria-disabled'],
	'aria-selected': 'true' as AriaAttributes['aria-selected'],
	classes: [css.tabButton, css.activeTabButton, null, null],
	focus: noop,
	id: '',
	key: '0-tabbutton',
	onclick: noop,
	onkeydown: noop,
	role: 'tab',
	tabIndex: 0
};

registerSuite('TabContainer', {
	tests: {
		'renders with aria'() {
			const tabs = [{ name: 'test' }];
			const h = harness(() => (
				<TabContainer tabs={tabs} aria={{ describedBy: 'foo', orientation: 'overridden' }}>
					<div>tab</div>
				</TabContainer>
			));

			const ariaRenderTemplate = baseTemplate
				.setProperty('@root', 'aria-describedby', 'foo')
				.setChildren('@buttons', () => [
					<div {...tabButtonProperties}>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							test
							<span classes={[css.indicator, css.indicatorActive]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>
				])
				.setChildren('@tabs', () => [
					<div classes={css.tab} hidden={false}>
						<div>tab</div>
					</div>
				]);

			h.expect(ariaRenderTemplate);
		},

		'renders with custom orientation'() {
			const tabs = [{ name: 'test' }];
			const h = harness(() => (
				<TabContainer tabs={tabs} alignButtons="right">
					<div>tab</div>
				</TabContainer>
			));

			const orientationTemplate = reverseOrientationTemplate
				.setChildren('@buttons', () => [
					<div {...tabButtonProperties}>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							test
							<span classes={[css.indicator, css.indicatorActive]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>
				])
				.setChildren('@tabs', () => [
					<div classes={css.tab} hidden={false}>
						<div>tab</div>
					</div>
				]);

			h.expect(orientationTemplate);
		},

		'renders with two children'() {
			const tabs = [{ name: 'tab0' }, { name: 'tab1' }];

			const h = harness(() =>
				w(
					TabContainer,
					{
						tabs: tabs
					},
					[v('div', {}, ['tab0']), v('div', {}, ['tab1'])]
				)
			);

			const twoChildTemplate = baseTemplate
				.setChildren('@buttons', () => [
					<div {...tabButtonProperties}>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							tab0
							<span classes={[css.indicator, css.indicatorActive]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>,
					<div
						{...tabButtonProperties}
						classes={[css.tabButton, null, null, null]}
						aria-selected="false"
						aria-controls="test-tab-1"
						tabIndex={-1}
						key="1-tabbutton"
					>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							tab1
							<span classes={[css.indicator, false]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>
				])
				.setChildren('@tabs', () => [
					<div classes={css.tab} hidden={false}>
						<div>tab0</div>
					</div>,
					<div classes={undefined} hidden={true}>
						<div>tab1</div>
					</div>
				]);

			h.expect(twoChildTemplate);
		},

		'Clicking tab should change the active tab'() {
			const tabs = [{ name: 'tab0' }, { name: 'tab1' }];

			const onActiveIndexStub = sinon.stub();

			const h = harness(() => (
				<TabContainer initialActiveIndex={0} onActiveIndex={onActiveIndexStub} tabs={tabs}>
					<div>tab0</div>
					<div>tab1</div>
				</TabContainer>
			));

			const secondActiveTemplate = baseTemplate
				.setChildren('@buttons', () => [
					<div
						{...tabButtonProperties}
						aria-selected="false"
						classes={[css.tabButton, null, null, null]}
						tabIndex={-1}
					>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							tab0
							<span classes={[css.indicator, false]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>,
					<div {...tabButtonProperties} aria-controls="test-tab-1" key="1-tabbutton">
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							tab1
							<span classes={[css.indicator, css.indicatorActive]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>
				])
				.setChildren('@tabs', () => [
					<div classes={undefined} hidden={true}>
						<div>tab0</div>
					</div>,
					<div classes={css.tab} hidden={false}>
						<div>tab1</div>
					</div>
				]);

			h.trigger('@1-tabbutton', 'onclick');
			h.expect(secondActiveTemplate);
			assert.isTrue(onActiveIndexStub.calledOnceWith(1));
		},

		'Clicking close calls `onClose` callback and sets index to 0'() {
			const tabs = [{ name: 'tab0' }, { name: 'tab1', closeable: true }];

			const onCloseStub = sinon.stub();
			const onActiveIndexStub = sinon.stub();

			const h = harness(() => (
				<TabContainer onClose={onCloseStub} onActiveIndex={onActiveIndexStub} tabs={tabs}>
					<div>tab0</div>
					<div>tab1</div>
				</TabContainer>
			));

			h.expect(
				baseTemplate
					.setChildren('@buttons', () => [
						<div
							{...tabButtonProperties}
							classes={[css.tabButton, css.activeTabButton, null, null]}
						>
							<span key="tabButtonContent" classes={css.tabButtonContent}>
								tab0
								<span classes={[css.indicator, css.indicatorActive]}>
									<span classes={css.indicatorContent} />
								</span>
							</span>
						</div>,
						<div
							{...tabButtonProperties}
							aria-controls="test-tab-1"
							key="1-tabbutton"
							aria-selected="false"
							classes={[css.tabButton, null, css.closeable, null]}
							tabIndex={-1}
						>
							<span key="tabButtonContent" classes={css.tabButtonContent}>
								tab1
								<button
									disabled={undefined}
									tabIndex={-1}
									classes={css.close}
									key="1-tabbutton-close"
									type="button"
									onclick={noop}
								>
									<Icon
										type="closeIcon"
										altText="close"
										size="small"
										theme={undefined}
										variant={undefined}
										classes={undefined}
									/>
								</button>
								<span classes={[css.indicator, false]}>
									<span classes={css.indicatorContent} />
								</span>
							</span>
						</div>
					])
					.setChildren('@tabs', () => [
						<div classes={css.tab} hidden={false}>
							<div>tab0</div>
						</div>,
						<div classes={undefined} hidden={true}>
							<div>tab1</div>
						</div>
					])
			);

			h.trigger('@1-tabbutton-close', 'onclick', mockClickEvent);
			assert.isTrue(onCloseStub.calledOnceWith(1));
			assert.isTrue(onActiveIndexStub.calledOnceWith(0));
		},

		'keyboard navigation including wrapping'() {
			const tabs = [{ name: 'tab0', closeable: true }, { name: 'tab1' }, { name: 'tab2' }];

			const onActiveIndexStub = sinon.stub();
			const onCloseStub = sinon.stub();

			const h = harness(() => (
				<TabContainer
					initialActiveIndex={0}
					onActiveIndex={onActiveIndexStub}
					onClose={onCloseStub}
					tabs={tabs}
				>
					<div>tab0</div>
					<div>tab1</div>
					<div>tab2</div>
				</TabContainer>
			));

			onActiveIndexStub.resetHistory();
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			assert.isTrue(onActiveIndexStub.calledWith(1));

			onActiveIndexStub.resetHistory();
			h.trigger('@1-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Left));
			assert.isTrue(onActiveIndexStub.calledWith(0));

			onActiveIndexStub.resetHistory();
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Left));
			assert.isTrue(onActiveIndexStub.calledWith(2));

			onActiveIndexStub.resetHistory();
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			assert.isTrue(onActiveIndexStub.calledWith(0));

			onActiveIndexStub.resetHistory();
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.End));
			assert.isTrue(onActiveIndexStub.calledWith(2));

			onActiveIndexStub.resetHistory();
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Home));
			assert.isTrue(onActiveIndexStub.calledWith(0));

			onActiveIndexStub.resetHistory();
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Escape));
			assert.isTrue(onCloseStub.calledWith(0));
		},

		'does not display disabled tabs'() {
			const tabs = [{ name: 'tab0' }, { name: 'tab1', disabled: true }];

			const onActiveIndexStub = sinon.stub();

			const h = harness(() => (
				<TabContainer initialActiveIndex={0} onActiveIndex={onActiveIndexStub} tabs={tabs}>
					<div>tab0</div>
					<div>tab1</div>
				</TabContainer>
			));

			const disabledTemplate = baseTemplate
				.setChildren('@buttons', () => [
					<div {...tabButtonProperties}>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							tab0
							<span classes={[css.indicator, css.indicatorActive]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>,
					<div
						{...tabButtonProperties}
						aria-disabled="true"
						aria-controls="test-tab-1"
						key="1-tabbutton"
						aria-selected="false"
						classes={[css.tabButton, null, null, css.disabledTabButton]}
						tabIndex={-1}
					>
						<span key="tabButtonContent" classes={css.tabButtonContent}>
							tab1
							<span classes={[css.indicator, false]}>
								<span classes={css.indicatorContent} />
							</span>
						</span>
					</div>
				])
				.setChildren('@tabs', () => [
					<div classes={css.tab} hidden={false}>
						<div>tab0</div>
					</div>,
					<div classes={undefined} hidden={true}>
						<div>tab1</div>
					</div>
				]);

			h.trigger('@1-tabbutton', 'onclick');
			h.expect(disabledTemplate);
			assert.isTrue(onActiveIndexStub.notCalled);
		}
	}
});
