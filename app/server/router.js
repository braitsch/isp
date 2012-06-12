
module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', { title: 'Comcast System Status', ip:req.connection.remoteAddress});
	});
	
	app.get('*', function(req, res) {
		res.render('404', {  title: '404!' });
	});	
	
};