const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness/harness';

import Tooltip, { Orientation } from '../../index';
import Button from '../../../button/index';
import * as css from '../../../theme/default/tooltip.m.css';
import * as fixedCss from '../../styles/tooltip.m.css';

registerSuite('Tooltip', {
	tests: {
		'should construct Tooltip'() {
			const h = harness(() => <Tooltip>{{ content: '' }}</Tooltip>);
			h.expect(() => (
				<div classes={[undefined, css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
					<div key="target" />
				</div>
			));
		},

		'should render content if open'() {
			const h = harness(() => <Tooltip open>{{ content: 'foobar' }}</Tooltip>);

			h.expect(() => (
				<div classes={[undefined, css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
					<div key="target">
						<div key="content" classes={[css.content, fixedCss.contentFixed]}>
							foobar
						</div>
					</div>
				</div>
			));
		},

		'should render trigger'() {
			const h = harness(() => (
				<Tooltip open>
					{{ trigger: <Button>Give me a tooltip</Button>, content: 'foobar' }}
				</Tooltip>
			));

			h.expect(() => (
				<div classes={[undefined, css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
					<div key="target">
						<Button>Give me a tooltip</Button>
						<div key="content" classes={[css.content, fixedCss.contentFixed]}>
							foobar
						</div>
					</div>
				</div>
			));
		},

		'should render correct orientation'() {
			const h = harness(() => (
				<Tooltip orientation={Orientation.bottom}>{{ content: 'foobar' }}</Tooltip>
			));

			h.expect(() => (
				<div classes={[undefined, css.bottom, fixedCss.rootFixed, fixedCss.bottomFixed]}>
					<div key="target" />
				</div>
			));
		},

		'should render aria properties'() {
			const h = harness(() => (
				<Tooltip open aria={{ describedBy: 'foo' }}>
					{{ content: 'bar' }}
				</Tooltip>
			));

			h.expect(() => (
				<div classes={[undefined, css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
					<div key="target">
						<div
							key="content"
							aria-describedby="foo"
							classes={[css.content, fixedCss.contentFixed]}
						>
							bar
						</div>
					</div>
				</div>
			));
		}
	}
});
