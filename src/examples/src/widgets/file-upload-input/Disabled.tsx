import { create, tsx } from '@dojo/framework/core/vdom';
import { FileUploadInput } from '@dojo/widgets/file-upload-input';
import Example from '../../Example';

const factory = create();

export default factory(function Disabled() {
	return (
		<Example>
			<FileUploadInput disabled />
		</Example>
	);
});
