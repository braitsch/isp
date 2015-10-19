
/**
 * Node.js Internet System Status
 * Author :: Stephen Braitsch
 * URL : http://kitchen.braitsch.io/internet-service-provider-health-monitor/
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', './app/server/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app/public'));

require('./app/server/routes')(app);

http.listen(app.get('port'), function()
{
	console.log('Express server listening on port', app.get('port'));
});
