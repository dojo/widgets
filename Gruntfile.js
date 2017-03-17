module.exports = function (grunt) {
	var staticTestFiles = '*/tests/**/*.{html,css,json,xml,js,txt}';
	var staticExampleFiles = [ '*/example/**', '!*/example/**/*.js' ];

	require('grunt-dojo2').initConfig(grunt, {
		copy: {
			staticTestFiles: {
				expand: true,
				cwd: 'src',
				src: [ staticTestFiles ],
				dest: '<%= devDirectory %>'
			},
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
		},
		intern: {
			options: {
				runType: 'runner',
				config: '<%= devDirectory %>/common/tests/intern',
				reporters: [ 'Runner' ]
			},
			browserstack: {},
			saucelabs: {
				options: {
					config: '<%= devDirectory %>/common/tests/intern-saucelabs'
				}
			},
			remote: {},
			local: {
				options: {
					config: '<%= devDirectory %>/common/tests/intern-local',
				}
			}
		},
		typedoc: {
			options: {
				ignoreCompilerErrors: true // Remove this once compile errors are resolved
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
