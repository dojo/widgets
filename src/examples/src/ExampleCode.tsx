import { create, tsx } from '@dojo/framework/core/vdom';

interface ExampleCodeProperties {
	content: string;
}

const factory = create().properties<ExampleCodeProperties>();

export default factory(function ExampleCode({ properties }) {
	const { content } = properties();
	return (
		<div>
			<pre classes={['language-ts']}>
				<code classes={['language-ts']} innerHTML={content} />
			</pre>
		</div>
	);
});
