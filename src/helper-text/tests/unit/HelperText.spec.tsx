const { registerSuite } = intern.getInterface('object');

import assertationTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import * as css from '../../../theme/default/helper-text.m.css';
import HelperText from '../../index';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx } from '@dojo/framework/core/vdom';

const baseTemplate = assertationTemplate(() => {
	return <div key="root" classes={[undefined, css.root, null, null]} />;
});

const textTemplate = baseTemplate.setChildren('@root', [
	<p key="text" classes={css.text} aria-hidden="true" title="test">
		test
	</p>
]);

registerSuite('HelperText', {
	tests: {
		'without text'() {
			const h = harness(() => (
				<HelperText variant={undefined} classes={undefined} theme={undefined} />
			));
			h.expect(baseTemplate);
		},
		'with text'() {
			const h = harness(() => (
				<HelperText variant={undefined} classes={undefined} theme={undefined} text="test" />
			));
			h.expect(textTemplate);
		},
		valid() {
			const validTemplate = textTemplate.setProperty('@root', 'classes', [
				undefined,
				css.root,
				css.valid,
				null
			]);
			const h = harness(() => (
				<HelperText
					variant={undefined}
					classes={undefined}
					theme={undefined}
					text="test"
					valid={true}
				/>
			));
			h.expect(validTemplate);
		},
		invalid() {
			const invalidTemplate = textTemplate.setProperty('@root', 'classes', [
				undefined,
				css.root,
				null,
				css.invalid
			]);
			const h = harness(() => (
				<HelperText
					variant={undefined}
					classes={undefined}
					theme={undefined}
					text="test"
					valid={false}
				/>
			));
			h.expect(invalidTemplate);
		}
	}
});
