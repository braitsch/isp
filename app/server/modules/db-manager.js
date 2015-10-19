
var MongoDB		= require('mongodb').Db;
var Server		= require('mongodb').Server;

var dbName = process.env.DB_NAME || 'isp';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;

var isps		= require('./isp-directory');
var markers		= require('./test-markers');

var DBM = {};
	DBM.db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
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
			DBM.markers.insert(newObj, function(e, o){
				if (!e){
					callback(newObj);
				}	else{
					console.log('** error inserting new user**');
				}
			});
		}	else{
			oldObj.isp		= newObj.isp;
			oldObj.status 	= newObj.status;
			oldObj.lat		= newObj.lat;
			oldObj.lng		= newObj.lng;
			oldObj.city		= newObj.city;
			oldObj.state	= newObj.state;
			oldObj.country	= newObj.country;
			oldObj.time	 	= newObj.time;
			DBM.markers.save(oldObj, function(e, o){
				if (!e){
					callback(oldObj);
				}	else{
					console.log('** error updating user**');
				}
			});
		}
	});
}

DBM.getIspsByCountry = function(country, callback)
{
	DBM.isps.findOne({country : country}, function(e, res) {
		if (res != null){
			callback(res);
		}	else{
			DBM.isps.findOne({country : 'default'}, function(e, res) { callback(res) });
		}
	});
}

DBM.getAllMarkers = function(callback)
{
	DBM.markers.find().sort({time : 1}).toArray( function(e, res) { callback(res) });
}

var analytics = [];
var analyticsIndex = 0;
var analyticsCallback = null;
DBM.getAnalytics = function(callback)
{
	analytics = [];
	analyticsIndex = 0;
	analyticsCallback = callback;
	DBM.getStatsOfIsp(isps[0].isps[0]);
}

DBM.onStatsReceived = function(obj)
{
	var k = isps[0].isps;
	analytics.push(obj);
	if (++analyticsIndex == k.length){
		analyticsCallback(analytics);
	}	else{
		DBM.getStatsOfIsp(k[analyticsIndex]);
	}
}

DBM.getStatsOfIsp = function(isp)
{
	DBM.markers.find({ isp : isp }, { status : 1 }).toArray( function(e, res) { 
		var ok = 0, no = 0;
		for (var i = res.length - 1; i >= 0; i--) res[i].status == 1 ? ok++ : no++;
		if (res.length == 0){
		//	ok = Math.ceil(Math.random()*10);
		//	no = Math.ceil(Math.random()*10);
		}
		DBM.onStatsReceived({isp:isp, online:ok, offline:no, total:ok + no});
	});
}

DBM.resetIsps = function(callback)
{
	DBM.isps.remove({}, function(){
		for (var i = isps.length - 1; i >= 0; i--) DBM.isps.insert(isps[i], function(e, o){ if (e) console.log('** error reseting isps**'); });
		callback();
	});
}

DBM.resetMarkers = function(callback)
{
	DBM.markers.remove({}, function(){
		for (var i = markers.length - 1; i >= 0; i--) DBM.markers.insert(markers[i], function(e, o){ if (e) console.log('** error reseting markers**'); });
		callback();
	});
}

DBM.clearZeros = function(callback)
{
	DBM.markers.remove({ ip : '0' }, callback);
}
