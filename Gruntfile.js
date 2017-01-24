module.exports = function (grunt) {
	require('grunt-dojo2').initConfig(grunt, {
		/* any custom configuration goes here */
	});

	grunt.registerTask('dist', grunt.config.get('distTasks').concat([
		'postcss:modules',
		'postcss:variables'
	]));
};
