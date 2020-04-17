const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness/harness';

import TabContent from '../../TabContent';
import * as css from '../../../theme/default/tab-controller.m.css';

registerSuite('TabContent', {
	tests: {
		'default render'() {
			const h = harness(() => <TabContent>tab content</TabContent>);
			h.expect(() => (
				<div classes={[undefined, undefined]} hidden={true}>
					tab content
				</div>
			));
		},

		'renders active'() {
			const h = harness(() => <TabContent active={true}>tab content</TabContent>);
			h.expect(() => (
				<div classes={[undefined, css.tab]} hidden={false}>
					tab content
				</div>
			));
		},

		'renders closed'() {
			const h = harness(() => <TabContent closed={true}>tab content</TabContent>);
			h.expect(() => null);
		}
	}
});
