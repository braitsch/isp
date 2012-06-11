
$(document).ready(function(){
	
	window.MapMaker = new function()
	{
		function drawMap(lat, lng) {

			var xy = new google.maps.LatLng(lat, lng);
			var map = new google.maps.Map(document.getElementById("map_canvas"), {
				zoom: 16,
				center: xy,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			var marker = new google.maps.Marker({
				position: xy,
				map: map,
				title: 'My location'
			});
		}

		function getUserLocation() { 
			if (!navigator.geolocation){
				alert('Your browser does not support geolocation :(');
			}	else{
				navigator.geolocation.getCurrentPosition(onPositionData, onPositionError);	
			}
		}

		function onPositionData(pos)
		{
			drawMap(pos.coords.latitude, pos.coords.longitude);
		}

		function onPositionError(e)
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
			console.log(msg);
		}
		getUserLocation();
	}
	
})