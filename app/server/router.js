
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
			city : req.param('city'),
			state : req.param('state'),
			time : Date.now()
		}, function(o){
			if (o) res.send(o, 200);
		});
	})
	
	app.post('/get-markers', function(req, res){
		var ne = req.param('ne');
		var sw = req.param('sw');
		DB.getAllMarkers(function(markers){
			var a = [];
			for (var i = markers.length - 1; i >= 0; i--) {
				if (markers[i].ip != req.connection.remoteAddress) a.push(markers[i]);
			}
			res.send(a, 200);
		})
	});

	app.post('/get-isps', function(req, res){
		DB.getIspsByState(req.param('state'), function(loc){
			res.send(loc.isps, 200);
		})
	});
	
	app.get('/reset-locations', function(req, res){
		DB.resetIsps(function(isps){
			res.send('ok', 200);
		})
	});

	app.get('/print-markers', function(req, res){
		DB.getAllMarkers(function(markers){
			res.render('print', { title : 'db-dump', users : markers } );
		})
	});

	app.get('/reset-markers', function(req, res){
		DB.resetMarkers(function(){
			res.redirect('/print-markers');
		});
	});
	
	app.get('*', function(req, res){
		res.render('404', {  title: '404!' });
	});

};