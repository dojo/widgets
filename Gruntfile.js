module.exports = function (grunt) {
	var staticExampleFiles = [ '*/example/**', '!*/example/**/*.js' ];

	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			staticExampleFiles: {
				expand: true,
				cwd: 'src',
				src: staticExampleFiles,
				dest: '<%= devDirectory %>'
			},
			devStyles: {
				expand: true,
				cwd: 'src',
				src: 'common/styles/widgets.css',
				dest: '<%= devDirectory %>'
			},
			distStyles: {
				expand: true,
				cwd: 'src',
				src: 'common/styles/widgets.css',
				dest: '<%= distDirectory %>'
			}
		}
	});

	grunt.registerTask('dev', grunt.config.get('devTasks').concat([
		'copy:staticExampleFiles',
		'postcss:modules-dev',
		'copy:devStyles'
	]));

	grunt.registerTask('dist', grunt.config.get('distTasks').concat([
		'postcss:modules-dist',
		'postcss:variables',
		'copy:distStyles'
	]));
};
