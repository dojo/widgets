import { create, tsx } from '@dojo/framework/core/vdom';
import { FileUploadInput } from '@dojo/widgets/file-upload-input';
import { Icon } from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

export default factory(function Labels() {
	return (
		<Example>
			<FileUploadInput>
				{{
					buttonLabel: (
						<div>
							<Icon type="linkIcon" /> Upload a file
						</div>
					),
					dndLabel: 'Drop a file here to upload'
				}}
			</FileUploadInput>
		</Example>
	);
});
