export default [
	{
		path: '/',
		outlet: 'landing',
		defaultRoute: true
	},
	{
		path: 'widget/{widget}',
		outlet: 'basic',
		children: [
			{
				path: '{example}?{active}',
				outlet: 'example'
			}
		]
	}
];
