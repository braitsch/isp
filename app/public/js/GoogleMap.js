
GoogleMap = function()
{
	var searchArea = 1; // 1 mile
	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		zoom : 14,
		disableDefaultUI : true,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});
	var win = new InfoBox({
		content: document.getElementById('map_window'),
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(-95, -110),
		zIndex: null,
		closeBoxMargin: "10px",
		closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
	});
	
	// var timeout;
	// google.maps.event.addListener(map, 'bounds_changed', function() {
	// 	if (timeout) clearTimeout(timeout);
	// 	timeout = setTimeout(function(){
	// 		var bnds = map.getBounds()
	// 		var ne = bnds.getNorthEast();
	// 		var sw = bnds.getSouthWest();
	// 		console.log('ne = ', ne.lat(), ne.lng());
	// 		console.log('sw = ', sw.lat(), sw.lng());
	// 	}, 100);
	// });
	
	// google.maps.event.addListener(map, 'click', function(e) {
	// 	addMarker(e.latLng.lat(), e.latLng.lng());
	// });	

// public methods //
	
    Object.defineProperty(this, 'location', {set: function(point) {
		addMarker(point.lat, point.lng);
	//	drawPoints(point.lat, point.lng);
		drawCircle(point.lat, point.lng);
	//	drawBounds(point.lat, point.lng);
		map.setCenter(new google.maps.LatLng(point.lat, point.lng));
	}});
	
	var clickCount = 0;
	var addMarker = function(lat, lng)
	{
		var mrkr = new google.maps.Marker({
			map : map,
			title : 'xyz',
			// icon : './img/markers/'+icons.fail[i]+'.png',
			position : new google.maps.LatLng(lat, lng),
			animation : google.maps.Animation.DROP
		});
		google.maps.event.addListener(mrkr, 'click', function(e) {
			clickCount++;
			var color = clickCount%2==0 ? 'map_window_yellow': 'map_window_dark';
			win.setOptions({ boxClass : color });
			win.open(map, mrkr);
		});
	}
	
	var drawPoints = function(lat, lng)
	{
		addMarker(lat + GoogleMap.calcMilesToLatDegrees(searchArea/2), lng);
		addMarker(lat - GoogleMap.calcMilesToLatDegrees(searchArea/2), lng);
		addMarker(lat, lng - GoogleMap.calcMilesToLngDegrees(lat, searchArea/2));
		addMarker(lat, lng + GoogleMap.calcMilesToLngDegrees(lat, searchArea/2));
	}

	var drawCircle = function(lat, lng)
	{
		new google.maps.Circle({
			map: map,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			radius: GoogleMap.calcMilesToMeters(searchArea / 2),
			center: new google.maps.LatLng(lat, lng)
		});
	}

	var drawBounds = function(lat, lng)
	{
		var sw = new google.maps.LatLng(lat - GoogleMap.calcMilesToLatDegrees(searchArea/2), lng - GoogleMap.calcMilesToLngDegrees(lat, searchArea/2));
		var ne = new google.maps.LatLng(lat + GoogleMap.calcMilesToLatDegrees(searchArea/2), lng + GoogleMap.calcMilesToLngDegrees(lat, searchArea/2));
		var rect = new google.maps.Rectangle({
			map: map,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			bounds: new google.maps.LatLngBounds(sw, ne)
		});
	}

}

// static methods //

GoogleMap.calcMilesToMeters = function(m)
{
	return m * 1609.344;
}
GoogleMap.calcMilesToLatDegrees = function(m)
{
	return m / 69;
}
GoogleMap.calcMilesToLngDegrees = function(lat, m)
{
	return m / (69 * Math.cos(GoogleMap.degreesToRadians(lat)));
}
GoogleMap.degreesToRadians = function(d)
{
	return d * (Math.PI / 180);
}
