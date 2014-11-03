'use strict';

var http    = require('http');
var chalk   = require('chalk');
var _app    = null;
var _server = null;


function _listen() {
	var ip   = _app.config.get('server.ip')
	var port = _app.config.get('server.port');
	var env  = _app.config.get('server.env');

	_server.listen(port, ip, function(err) {
		if (err) {
			return console.trace(err);
		}

		console.log(
			chalk.white('\n✔ Express server:'),
			chalk.blue('http://' + ip + ':' + port),
			chalk.white('in'),
			chalk.magenta(env),
			chalk.white('mode.')
		);

	})

	.on('error', function (err) {
		console.error('✗ Error: ' + err);
		// TODO: do something with the error
	});

}

function getServer() {
	return _server;
}

function init(app) {
	_app = app;
	_app.servers.http = exports;
	_server = http.Server(_app.servers.express.getServer());
	_listen();
}

// Public API
module.exports.getServer = getServer;
module.exports.init      = init;
