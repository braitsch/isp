
/**
 * Node.js Comcast System Status
 * Author :: Stephen Braitsch
 */

var exp = require('express');
var app = exp.createServer();

app.root = __dirname;

require('./app/config')(app, exp);
require('./app/server/router')(app);

app.listen(8080, function(){
 	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});