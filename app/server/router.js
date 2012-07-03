
module.exports = function(app) {

	app.get('/', function(req, res) {
	//	if (/mobile/i.test(req.headers['user-agent'])) //
		res.render('index', { title: 'Internet Service Provider System Status', ip:req.connection.remoteAddress});
	});

	app.get('*', function(req, res) {
		res.render('404', {  title: '404!' });
	});

};