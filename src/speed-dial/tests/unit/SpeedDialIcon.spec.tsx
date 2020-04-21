const { it, describe } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness/harness';
import * as css from '../../../theme/default/speed-dial.m.css';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import { SpeedDialIcon } from '../../index';
import { Icon as FabIcon } from '../../../floating-action-button';
import Icon from '../../../icon';
import { compareTheme } from '../../../common/tests/support/test-helpers';

describe('SpeedDialIcon', () => {
	it('renders', () => {
		const h = harness(() => <SpeedDialIcon />, [compareTheme]);
		h.expect(assertionTemplate(() => <FabIcon type="plusIcon" />));
	});

	it('renders with a custom icon', () => {
		const h = harness(
			() => <SpeedDialIcon>{{ icon: <Icon type="clockIcon" /> }}</SpeedDialIcon>,
			[compareTheme]
		);
		h.expect(assertionTemplate(() => <Icon type="clockIcon" />));
	});

	it('renders open', () => {
		const h = harness(() => <SpeedDialIcon open />, [compareTheme]);
		h.expect(
			assertionTemplate(() => (
				<Icon
					type="plusIcon"
					classes={{
						'@dojo/widgets/icon': { icon: [css.iconOpen] }
					}}
				/>
			))
		);
	});

	it('renders open with a custom icon', () => {
		const h = harness(
			() => <SpeedDialIcon open>{{ openIcon: <Icon type="clockIcon" /> }}</SpeedDialIcon>,
			[compareTheme]
		);
		h.expect(assertionTemplate(() => <Icon type="clockIcon" />));
	});
});
