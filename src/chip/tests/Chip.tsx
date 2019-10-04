const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Chip from '../index';
import * as css from '../../theme/chip.m.css';
import Icon from '../../icon/index';

describe('Chip', () => {
	const label = 'Chip label';
	const template = assertionTemplate(() => (
		<div classes={[css.root]}>
			<span classes={css.label}>{label}</span>
		</div>
	));

	it('should render with a label', () => {
		const h = harness(() => <Chip label={label} />);

		h.expect(template);
	});

	it('should render with an icon', () => {
		const h = harness(() => <Chip label={label} icon="plusIcon" />);

		h.expect(template.prepend(':root', () => [<Icon type="plusIcon" />]));
	});
});
