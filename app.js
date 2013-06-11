
/**
 * Node.js Internet System Status
 * Author :: Stephen Braitsch
 * URL : http://www.quietless.com/kitchen/internet-service-provider-health-monitor/
 */

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

global.host = 'localhost';

app.configure(function(){
	app.set('port', 8080);
	app.set('views', __dirname + '/app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.locals.moment = require('moment');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
	app.use(express.static(__dirname + '/app/public'));
});

require('./app/server/router')(app);

server.listen(app.get('port'), function(){
	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});