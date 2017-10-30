import * as config from './config';
import { initConfig } from 'grunt-dojo2';

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);
	initConfig(grunt, config);

	grunt.registerTask('dev', (grunt.config.get('devTasks') as string[]).concat([
		'copy:staticExampleFiles',
		'postcss:modules-dev',
		'copy:devStyles',
		'copy:devFonts'
	]));

	grunt.registerTask('dist', (grunt.config.get('distTasks') as string[]).concat([
		'postcss:modules-dist',
		'postcss:variables',
		'copy:distStyles',
		'copy:distFonts'
	]));
};
