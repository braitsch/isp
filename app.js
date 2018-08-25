
/**
 	Node.js Internet System Status
 	Author :: Stephen Braitsch
 	http://braitsch.io/project/isp-health-monitor
 */

var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var server = require('http').createServer(app);

app.locals.pretty = true;
app.locals.moment = require('moment');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', './app/server/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app/public'));

require('./app/server/routes')(app);

server.listen(app.get('port'), function(){
	console.log('Express app listening at http://%s:%s', server.address().address, server.address().port);
});