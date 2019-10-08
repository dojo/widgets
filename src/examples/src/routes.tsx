export default [
	{
		path: 'widget/{widget}',
		outlet: 'basic',
		children: [
			{
				path: '{example}',
				outlet: 'example'
			}
		]
	}
];
