const { registerSuite } = intern.getInterface('object');

import { w, tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness';

import Tooltip, { Orientation } from '../../index';
import * as css from '../../../theme/default/tooltip.m.css';
import * as fixedCss from '../../styles/tooltip.m.css';

registerSuite('Tooltip', {
	tests: {
		'should construct Tooltip'() {
			const h = harness(() => <Tooltip content="" />);
			h.expect(() => (
				<div classes={[css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
					<div key="target" />
				</div>
			));
		},

		'should render content if open'() {
			const h = harness(() => <Tooltip content="foobar" open />);

			h.expect(() => (
				<div classes={[css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
					<div key="target">
						<div key="content" classes={[css.content, fixedCss.contentFixed]}>
							foobar
						</div>
					</div>
				</div>
			));
		},

		'should render correct orientation'() {
			const h = harness(() => (
				<Tooltip orientation={Orientation.bottom} content={'foobar'} />
			));

			h.expect(() => (
				<div classes={[css.bottom, fixedCss.rootFixed, fixedCss.bottomFixed]}>
					<div key="target" />
				</div>
			));
		},

		'should render aria properties'() {
			const h = harness(() => <Tooltip content="bar" open aria={{ describedBy: 'foo' }} />);

			h.expect(() => (
				<div classes={[css.right, fixedCss.rootFixed, fixedCss.rightFixed]}>
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
