import { tsx } from '@dojo/framework/core/vdom';
const { it, describe } = intern.getInterface('bdd');
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';

import { Action, LabelOrientation } from '../../index';
import { noop } from '../../../common/tests/support/test-helpers';
import Icon from '../../../icon';
import FloatingActionButton from '../../../floating-action-button';
import * as fabCss from '../../../theme/default/floating-action-button.m.css';
import * as css from '../../../theme/default/speed-dial.m.css';

const { ' _key': fabKey, ...fabTheme } = fabCss as any;

describe('Action', () => {
	const WrappedLabelRoot = wrap('div');
	const WrappedFAB = wrap(FloatingActionButton);

	const renderFab = (label?: string) => (
		<WrappedFAB
			size="small"
			title="title"
			theme={{
				'@dojo/widgets/floating-action-button': {
					0: css.action0,
					1: css.action1,
					2: css.action2,
					3: css.action3,
					4: css.action4,
					s: css.actions,
					transition: css.actionTransition,
					...fabTheme
				}
			}}
			classes={undefined}
			onClick={noop}
			aria={
				label
					? {
							describedby: `test-${label}`
					  }
					: undefined
			}
			variant={undefined}
		>
			<Icon type="editIcon" />
		</WrappedFAB>
	);

	const fabAssertion = assertion(() => renderFab());

	const labelAssertion = assertion(() => (
		<WrappedLabelRoot classes={[css.labelContainer, css.labelLeft]} key="labelRoot">
			<label classes={css.label} id="test-label">
				label
			</label>
			{renderFab('label')}
		</WrappedLabelRoot>
	));

	it('renders', () => {
		const r = renderer(() => (
			<Action onClick={noop} title="title">
				<Icon type="editIcon" />
			</Action>
		));
		r.expect(fabAssertion);
	});

	it('renders with label', () => {
		const r = renderer(() => (
			<Action onClick={noop} title="title">
				{{
					icon: <Icon type="editIcon" />,
					label: 'label'
				}}
			</Action>
		));
		r.expect(labelAssertion);
	});

	it('renders with top-positioned label', () => {
		const r = renderer(() => (
			<Action onClick={noop} title="title" labelOrientation={LabelOrientation.top}>
				{{
					icon: <Icon type="editIcon" />,
					label: 'label'
				}}
			</Action>
		));
		r.expect(
			labelAssertion.setProperty(WrappedLabelRoot, 'classes', [
				css.labelContainer,
				css.labelTop
			])
		);
	});

	it('renders with right-positioned label', () => {
		const r = renderer(() => (
			<Action onClick={noop} title="title" labelOrientation={LabelOrientation.right}>
				{{
					icon: <Icon type="editIcon" />,
					label: 'label'
				}}
			</Action>
		));
		r.expect(
			labelAssertion.setProperty(WrappedLabelRoot, 'classes', [
				css.labelContainer,
				css.labelRight
			])
		);
	});

	it('renders with bottom-positioned label', () => {
		const r = renderer(() => (
			<Action onClick={noop} title="title" labelOrientation={LabelOrientation.bottom}>
				{{
					icon: <Icon type="editIcon" />,
					label: 'label'
				}}
			</Action>
		));
		r.expect(
			labelAssertion.setProperty(WrappedLabelRoot, 'classes', [
				css.labelContainer,
				css.labelBottom
			])
		);
	});
});
