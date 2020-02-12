const { describe, it } = intern.getInterface('bdd');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Avatar from '../../index';
import Icon from '../../../icon';
import * as css from '../../../theme/default/avatar.m.css';

describe('Avatar', () => {
	const template = assertionTemplate(() => (
		<div key="root" classes={[css.root, css.medium, css.circle]}>
			D
		</div>
	));

	it('renders', () => {
		const h = harness(() => <Avatar>D</Avatar>);
		h.expect(template);
	});

	describe('variants', () => {
		it('renders circle', () => {
			const h = harness(() => <Avatar variant="circle">D</Avatar>);
			h.expect(template.setProperty('@root', 'classes', [css.root, css.medium, css.circle]));
		});

		it('renders square', () => {
			const h = harness(() => <Avatar variant="square">D</Avatar>);
			h.expect(template.setProperty('@root', 'classes', [css.root, css.medium, css.square]));
		});

		it('renders rounded', () => {
			const h = harness(() => <Avatar variant="rounded">D</Avatar>);
			h.expect(template.setProperty('@root', 'classes', [css.root, css.medium, css.rounded]));
		});
	});

	describe('sizes', () => {
		it('renders small', () => {
			const h = harness(() => <Avatar size="small">D</Avatar>);
			h.expect(template.setProperty('@root', 'classes', [css.root, css.small, css.circle]));
		});

		it('renders medium', () => {
			const h = harness(() => <Avatar size="medium">D</Avatar>);
			h.expect(template.setProperty('@root', 'classes', [css.root, css.medium, css.circle]));
		});

		it('renders large', () => {
			const h = harness(() => <Avatar size="large">D</Avatar>);
			h.expect(template.setProperty('@root', 'classes', [css.root, css.large, css.circle]));
		});
	});

	describe('children', () => {
		it('renders with an image', () => {
			const h = harness(() => <Avatar src="img.jpg" alt="test" />);
			h.expect(
				template.setChildren('@root', [
					<img alt="test" classes={css.image} src="img.jpg" />
				])
			);
		});

		it('renders with an icon', () => {
			const h = harness(() => (
				<Avatar>
					<Icon type="upIcon" />
				</Avatar>
			));
			h.expect(template.setChildren('@root', [<Icon type="upIcon" />]));
		});
	});
});
