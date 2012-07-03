
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var dbName = 'isp';
var dbPort = 27017;
var dbHost = global.host;

var DBM = {};
	DBM.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
	DBM.db.open(function(e, d){
		if (e) {
			console.log(e);
		}	else{
			console.log('connected to database :: ' + dbName);
		}
	});
	DBM.users = DBM.db.collection('users');

module.exports = DBM;

DBM.setUser = function(newObj, callback)
{
	console.log(newObj.lat, newObj.lng)
	DBM.users.findOne({ip:newObj.ip}, function(e, oldObj){
		if (oldObj == null){
			DBM.users.insert(newObj, callback(newObj));
		}	else{
			oldObj.isp		= newObj.isp;
			oldObj.status 	= newObj.status;
			oldObj.lat		= newObj.lat;
			oldObj.lng		= newObj.lng;
			oldObj.time	 	= Date.now()
			DBM.users.save(oldObj); callback(oldObj);
		}
	});
}

DBM.getAllUsers = function(callback)
{
	DBM.users.find().toArray( function(e, res) { callback(e, res) });
}

DBM.delAllUsers = function(callback)
{
	DBM.users.remove(); callback();
}