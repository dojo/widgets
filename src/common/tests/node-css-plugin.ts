intern.registerPlugin('node-css', () => {
	require.extensions['.css'] = (module: any, filename: string) => {
		require.extensions['.js'](module, `${filename}.js`);
	};
});
