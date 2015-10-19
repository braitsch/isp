
var exec	= require('child_process').exec;
var DB		= require('./modules/db-manager');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', { title: 'Internet Service Provider System Status', mobile : /mobile/i.test(req.headers['user-agent']) });
	});

	app.post('/user', function(req, res){
		DB.setUser({
			ip	: req.connection.remoteAddress,
			isp : req.body['isp'],
			status : req.body['status'],
			lat : req.body['lat'],
			lng : req.body['lng'],
			city : req.body['city'],
			state : req.body['state'],
			country : req.body['country'],
			time : Date.now()
		}, function(o){
			if (o) res.status(200).send(o);
		});
	})
	
	app.post('/get-markers', function(req, res){
		var ne = req.body['ne'];
		var sw = req.body['sw'];
		DB.getAllMarkers(function(markers){
			var a = [];
			for (var i = markers.length - 1; i >= 0; i--) {
				if (markers[i].ip != req.connection.remoteAddress) a.push(markers[i]);
			}
			res.status(200).send(a);
		})
	});

	app.post('/get-isps', function(req, res){
		DB.getIspsByCountry(req.body['country'], function(loc){
			res.status(200).send(loc.isps);
		})
	});
	
	app.get('/reset-isps', function(req, res){
		DB.resetIsps(function(isps){
			res.status(200).send('ok');
		})
	});

	app.get('/reset-markers', function(req, res){
		DB.resetMarkers(function(){
			res.redirect('/print');
		});
	});
	
	app.get('/data', function(req, res){
		DB.getAnalytics(function(isps){
			res.render('data', { title : 'ISP Uptime Stats', data : isps } );
		})
	});
	
	app.get('/clear', function(req, res){
		DB.clearZeros(function(a, b){
			res.redirect('/print');
		});
	});
	
	app.get('/print', function(req, res){
		DB.getAllMarkers(function(markers){
			res.render('print', { title : 'db-dump', users : markers } );
		})
	});
	
	/* DATABASE BACKUP & RESTORE */
	
	app.get('/backup', function(req, res){
		console.log('** backing up database **');
		exec('mongodump -d isp -o ./root/db-backups/', function(e, stdout, stderr) {
			if (e) {
				console.log(stderr);
				res.status(400).send(e);
			}	else{
				console.log(stdout);
				res.redirect('/');
			}
		});
	});
	
	app.get('/restore', function(req, res){
		console.log('** restoring database **');
		exec('mongorestore --db isp --drop ./root/db-backups/isp/', function(e, stdout, stderr) {
			if (e) {
				console.log(stderr);
				res.status(400).send(e);
			}	else{
				console.log(stdout);
				res.redirect('/');
			}
		});
	});
	
	app.get('*', function(req, res){
		res.render('404', {  title: '404!' });
	});

};