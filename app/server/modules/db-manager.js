
const isps = require('./isp-directory');
const markers = require('./test-markers');
const MongoClient = require('mongodb').MongoClient;

const dbName = process.env.DB_NAME || 'isp';
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017;

var DBM = {};
MongoClient.connect('mongodb://' + dbHost + ':' + dbPort, {useNewUrlParser: true}, function(e, client) {
	if (e){
		console.log(e);
	}	else{
		DBM.db = client.db(dbName);
		DBM.isps = DBM.db.collection('isps');
		DBM.markers = DBM.db.collection('markers');
		console.log('mongo :: connected to database :: "'+dbName+'"');
	}
});

module.exports = DBM;

DBM.setUser = function(newObj, callback)
{
	DBM.markers.findOne({ip:newObj.ip}, function(e, oldObj){
		if (oldObj == null){
			DBM.markers.insertOne(newObj, function(e, o){
				if (!e){
					callback(newObj);
				}	else{
					console.log('** error inserting new user**');
				}
			});
		}	else{
			DBM.markers.replaceOne(oldObj, newObj, function(e, o){
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
	DBM.isps.deleteMany({}, function(){
		DBM.isps.insertMany(isps, function(e, o){ if (e) console.log('** error reseting isps**'); });
		callback();
	});
}

DBM.resetMarkers = function(callback)
{
	DBM.markers.deleteMany({}, function(){
		DBM.markers.insertMany(markers, function(e, o){ if (e) console.log('** error reseting markers**'); });
		callback();
	});
}

DBM.clearZeros = function(callback)
{
	DBM.markers.deleteMany({ ip : '0' }, callback);
}
