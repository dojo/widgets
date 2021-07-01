import { create, tsx } from '@dojo/framework/core/vdom';
import FileUploader from '@dojo/widgets/file-uploader';
import Example from '../../Example';

const factory = create();

export default factory(function Validated() {
	const accept = 'image/jpeg,image/png';
	const maxSize = 50000;

	function onValue() {
		// do something with files
	}

	return (
		<Example>
			<FileUploader multiple accept={accept} maxSize={maxSize} onValue={onValue} />
		</Example>
	);
});
