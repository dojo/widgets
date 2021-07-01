import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import { FileUploadInput } from '@dojo/widgets/file-upload-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Labelled({ middleware: { icache } }) {
	const selectedFiles: File[] = icache.getOrSet('selectedFiles', []);

	function onValue(files: File[]) {
		icache.set('selectedFiles', files);
	}

	return (
		<Example>
			<FileUploadInput accept="image/*" onValue={onValue}>
				{{
					label: 'Upload a profile image'
				}}
			</FileUploadInput>
			<div>Selected file: {selectedFiles.length ? selectedFiles[0].name : 'none'}</div>
		</Example>
	);
});
