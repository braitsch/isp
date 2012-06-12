
LocationDetector = function(callback)
{	
	var onPositionData = function(pos)
	{
		callback(null, {lat:pos.coords.latitude, lng:pos.coords.longitude});
	}

	var onPositionError = function(e)
	{
		var msg;
		switch(e.code) {
		case e.PERMISSION_DENIED:
			msg = "Permission was denied";			break;
		case e.POSITION_UNAVAILABLE:
			msg = "Location data not available";	break;
		case e.TIMEOUT:
			msg = "Location request timeout";		break;
		case e.UNKNOWN_ERROR:
			msg = "An unspecified error occurred";	break;
		default:
			msg = "An unspecified error occurred";	break;
		}
		callback(msg);
	}	

	if (!navigator.geolocation){
		callback('Your browser does not support geolocation :(');
	}	else{
		navigator.geolocation.getCurrentPosition(onPositionData, onPositionError);
	}
	
}