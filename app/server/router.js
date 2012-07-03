
var DB = require('./modules/db-manager');

module.exports = function(app) {

	app.get('/', function(req, res) {
	//	if (/mobile/i.test(req.headers['user-agent'])) //
		res.render('index', { title: 'Internet Service Provider System Status' });
	});

	app.post('/user', function(req, res){
		DB.setUser({
			ip	: req.connection.remoteAddress,
			isp : req.param('isp'),
			status : req.param('status'),
			city : req.param('city'),
			state : req.param('state'),
			time : Date.now()
		}, function(e){
			if (e) res.send('ok', 200);
		});
	})

	app.get('/print', function(req, res) {
		DB.getAllUsers( function(e, users){
			res.render('print', { title : 'db-dump', users : users } );
		})
	});

	app.get('/reset', function(req, res) {
		DB.delAllUsers( function(){
			res.redirect('/print');
		});
	});
	
	app.get('*', function(req, res) {
		res.render('404', {  title: '404!' });
	});

};