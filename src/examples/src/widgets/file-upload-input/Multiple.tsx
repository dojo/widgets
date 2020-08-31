import { create, tsx } from '@dojo/framework/core/vdom';
import { FileUploadInput } from '@dojo/widgets/file-upload-input';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Multiple({ middleware: { icache } }) {
	const selectedFiles: File[] = icache.getOrSet('selectedFiles', []);

	function onValue(files: File[]) {
		icache.set('selectedFiles', files);
	}

	return (
		<Example>
			<FileUploadInput onValue={onValue} multiple />
			{selectedFiles.length > 0 && (
				<ul>
					{selectedFiles.map(function(file) {
						return (
							<li key={file.name}>
								{file.name}: {file.size}
							</li>
						);
					})}
				</ul>
			)}
		</Example>
	);
});
