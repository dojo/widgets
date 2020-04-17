const { registerSuite } = intern.getInterface('object');

import { tsx } from '@dojo/framework/core/vdom';
import harness from '@dojo/framework/testing/harness/harness';

import * as baseCss from '../../../common/styles/base.m.css';
import * as css from '../../../theme/default/label.m.css';
import Label from '../../index';

registerSuite('Label', {
	tests: {
		simple() {
			const h = harness(() => <Label>baz</Label>);
			h.expect(() => (
				<label
					classes={[
						undefined,
						css.root,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null
					]}
					for="undefined"
					id="label-test"
				>
					baz
				</label>
			));
		},

		custom() {
			const h = harness(() => (
				<Label
					active={true}
					aria={{ describedBy: 'bar' }}
					forId="foo"
					disabled={true}
					focused={true}
					hidden={false}
					readOnly={true}
					required={true}
					valid={false}
					secondary={true}
					widgetId="foo-id"
				>
					baz
				</Label>
			));

			h.expect(() => (
				<label
					aria-describedby="bar"
					classes={[
						undefined,
						css.root,
						css.disabled,
						css.focused,
						null,
						css.invalid,
						css.readonly,
						css.required,
						css.secondary,
						css.active,
						null
					]}
					for="foo"
					id="foo-id"
				>
					baz
				</label>
			));
		},

		hidden() {
			const h = harness(() => <Label hidden={true}>baz</Label>);

			h.expect(() => (
				<label
					classes={[
						undefined,
						css.root,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						baseCss.visuallyHidden
					]}
					for="undefined"
					id="label-test"
				>
					baz
				</label>
			));
		}
	}
});
