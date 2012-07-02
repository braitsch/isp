
LocationDetector = function(callback)
{	

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
	
	var getGeoCodeData = function(pos)
	{
		var geocoder = new google.maps.Geocoder();
		var point = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
		if (geocoder) {
			geocoder.geocode({'latLng': point }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						callback(null, results[0])
					} else {
						callback('No results found');
					}
				} else {
					callback('Geocoder failed due to: ' + status);
				}
			});
		}
	}

	if (!navigator.geolocation){
		callback('Your browser does not support geolocation :(');
	}	else{
		navigator.geolocation.getCurrentPosition(getGeoCodeData, onPositionError);
	}
	
}