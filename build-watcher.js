var chokidar = require('chokidar');
const { exec } = require('child_process');
fs = require('fs');
const http = require('http');
const handler = require('serve-handler');

var watchIgnore = /.*\.m\.css\.d\.ts$/;

var watcher = chokidar.watch('src/*/*', {
	persistent: true
  });

// Start development server
var server = http.createServer((request, response) => {
	return handler(request, response);
  });
server.listen(5000, () => {
	console.log('Server started, view examples at http://localhost:5000/dist/dev/src/common/example/')
})

// Start watching files
watcher.on('raw', function(event, path) {
	if (!watchIgnore.test(path)) {
		console.log(`Changes detected at ${path}`);
		exec('npm run clean && npm run build:test', (err, stdout) => {
			if (err) {
			  console.error(err)
			} else {
			 console.log('Rebuild complete');
			}
		  });
	}
})

