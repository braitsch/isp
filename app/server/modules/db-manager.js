
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var dbName = 'isp';
var dbPort = 27017;
var dbHost = global.host;

var isps = require('./isps-by-city');
var markers = require('./test-markers');

var DBM = {};
	DBM.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
	DBM.db.open(function(e, d){
		if (e) {
			console.log(e);
		}	else{
			console.log('connected to database :: ' + dbName);
		}
	});
	DBM.isps = DBM.db.collection('isps');
	DBM.markers = DBM.db.collection('markers');

module.exports = DBM;

DBM.setUser = function(newObj, callback)
{
	DBM.markers.findOne({ip:newObj.ip}, function(e, oldObj){
		if (oldObj == null){
			DBM.markers.insert(newObj, callback(newObj));
		}	else{
			oldObj.isp		= newObj.isp;
			oldObj.status 	= newObj.status;
			oldObj.lat		= newObj.lat;
			oldObj.lng		= newObj.lng;
			oldObj.city		= newObj.city;
			oldObj.state	= newObj.state;
			oldObj.time	 	= Date.now()
			DBM.markers.save(oldObj); callback(oldObj);
		}
	});
}

DBM.getIspsByCity = function(city, callback)
{
	DBM.isps.findOne({city : city}, function(e, res) { callback(res) });
}

DBM.getAllMarkers = function(callback)
{
	DBM.markers.find().sort({time : 1}).toArray( function(e, res) { callback(res) });
}

DBM.resetIsps = function(callback)
{
	DBM.isps.remove();
	for (var i = isps.length - 1; i >= 0; i--) DBM.isps.insert(isps[i]);
	callback();
}

DBM.resetMarkers = function(callback)
{
	DBM.markers.remove();
	for (var i = markers.length - 1; i >= 0; i--) DBM.markers.insert(markers[i]);
	callback();
}
