const { describe, it } = intern.getInterface('bdd');

import { tsx } from '@dojo/framework/core/vdom';
import { renderer, assertion, wrap } from '@dojo/framework/testing/renderer';

import ActionButton from '../../index';
import Button from '../../../button/index';

const WrappedButton = wrap(Button);

const baseTemplate = assertion(() => {
	return <WrappedButton variant="inherit" />;
});

describe('ActionButton', () => {
	it('render', () => {
		const r = renderer(() => <ActionButton />);
		r.expect(baseTemplate);
	});

	it('passes all properties through', () => {
		const r = renderer(() => <ActionButton onClick={() => {}} type="submit" />);
		r.expect(
			baseTemplate.setProperties(WrappedButton, {
				onClick: () => {},
				type: 'submit',
				variant: 'inherit'
			})
		);
	});
});
