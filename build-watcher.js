const { exec } = require('child_process');
var chokidar = require('chokidar');
fs = require("fs");

var watcher = chokidar.watch('src/*/*', {
	ignored: /[\/\\]\./, persistent: true
  });

var log = console.log.bind(console);

let fsWait = false;
watcher.on('raw', function(event, path) {
	if (fsWait) return;
	fsWait = setTimeout(() => {
		fsWait = false;
	}, 100)
	if (!path.endsWith('m.css.d.ts')) {
		log(`Changes detected at ${path}`);
		exec("npm run clean && npm run build:test", (err, stdout) => {
			if (err) {
			  console.error(err)
			} else {
			 console.log(`Compiling Complete`);
			}
		  });
	}
})

