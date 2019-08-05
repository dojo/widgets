var chokidar = require('chokidar');
const { exec } = require('child_process');
fs = require("fs");
const http = require('http');
const handler = require('serve-handler');

var watcher = chokidar.watch('src/*/*', {
	ignored: /[\/\\]\./, persistent: true
  });

var watchIgnore = 'm.css.d.ts';

var log = console.log.bind(console);

// Start development server
var server = http.createServer((request, response) => {
	return handler(request, response);
  });
server.listen(5000, () => {
	log('Server started, view examples at http://localhost:5000/dist/dev/src/common/example/')
})


// Start watching files
let fsWait = false;
watcher.on('raw', function(event, path) {
	if (fsWait) return;
	fsWait = setTimeout(() => {
		fsWait = false;
	}, 100)
	if (!path.endsWith(watchIgnore)) {
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

