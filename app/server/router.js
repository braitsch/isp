
module.exports = function(app) {

	app.get('/', function(req, res) {
		if (/mobile/i.test(req.headers['user-agent'])){
			res.render('mobile', { title: 'Comcast System Status', layout: 'layout.m.jade', ip:req.connection.remoteAddress});
		}	else{
			res.render('desktop', { title: 'Comcast System Status', layout: 'layout.d.jade', ip:req.connection.remoteAddress});
		}
	});
	
	app.get('*', function(req, res) {
		res.render('404', {  title: '404!' });
	});	
	
};