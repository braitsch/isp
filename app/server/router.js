
var DB = require('./modules/db-manager');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', { title: 'Internet Service Provider System Status', mobile : /mobile/i.test(req.headers['user-agent']) });
	});

	app.post('/user', function(req, res){
		DB.setUser({
			ip	: req.connection.remoteAddress,
			isp : req.param('isp'),
			status : req.param('status'),
			lat : req.param('lat'),
			lng : req.param('lng'),
			time : Date.now()
		}, function(e){
			if (e) res.send('ok', 200);
		});
	})
	
	app.post('/get-markers', function(req, res){
		var ne = req.param('ne');
		var sw = req.param('sw');
		DB.getAllUsers( function(users){
			for (var i = users.length - 1; i >= 0; i--) users[i].user = users[i].ip == req.connection.remoteAddress;
			res.send(users, 200);
		})
	});

	app.get('/print', function(req, res){
		DB.getAllUsers( function(users){
			res.render('print', { title : 'db-dump', users : users } );
		})
	});

	app.get('/reset', function(req, res){
		DB.delAllUsers( function(){
			res.redirect('/print');
		});
	});
	
	app.get('*', function(req, res){
		res.render('404', {  title: '404!' });
	});

};