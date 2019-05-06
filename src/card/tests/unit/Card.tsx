const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/widget-core/tsx';
import Card from '../../index';
import Button from '../../../button/index';
import * as css from '../../../theme/card.m.css';

describe('Card', () => {
	const template = assertionTemplate(() => <div key="root" classes={[css.root]} />);

	it('renders', () => {
		const h = harness(() => <Card />);
		h.expect(template);
	});

	it('renders children', () => {
		const h = harness(() => <Card>Hello, World</Card>);
		const childrenTemplate = template.setChildren('@root', ['Hello, World']);
		h.expect(childrenTemplate);
	});

	it('renders actions and children', () => {
		const h = harness(() => (
			<Card actionsRenderer={() => <Button>test</Button>}>Hello, World</Card>
		));
		const childrenTemplate = template.setChildren('@root', [
			'Hello, World',
			<div classes={css.actions}>
				<Button>test</Button>
			</div>
		]);
		h.expect(childrenTemplate);
	});
});
