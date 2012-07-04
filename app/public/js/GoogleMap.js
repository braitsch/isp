
GoogleMap = function()
{
	var markers = [];
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

// public setters //
	
    Object.defineProperty(this, 'location', {set: function(obj) {
		addMarker(obj);
		drawCircle(obj.lat, obj.lng);
		map.setCenter(new google.maps.LatLng(obj.lat, obj.lng));
	}});

	var mapMoveTimeout;
	google.maps.event.addListener(map, 'bounds_changed', function() {
		if (mapMoveTimeout) clearTimeout(mapMoveTimeout);
		mapMoveTimeout = setTimeout(function(){
			var bnds = map.getBounds();
			var ne = bnds.getNorthEast();
			var sw = bnds.getSouthWest();
			getMarkersWithinBounds({ lat:ne.lat(), lng:ne.lng() }, { lat:sw.lat(), lng:sw.lng() })
		}, 100);
	});
	google.maps.event.addListener(map, 'click', function(e) { win.close(); });
	
	var getMarkersWithinBounds = function(ne, sw)
	{
	// first clear all markers from the map //
		while(markers.length){ markers[0].setMap(null); markers.splice(0, 1); }
		$.ajax({
			url: '/get-markers',
			type : "POST",
			data : {ne : ne, sw : sw},
			success: function(data){
	// attach markers that exist within the maps new boundaries //
				for (var i = data.length - 1; i >= 0; i--) addMarker(data[i]);
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	var addMarker = function(obj, isMe)
	{
		var m = new google.maps.Marker({
			map : map,
			isp : obj.isp,
			status : obj.status,
			time : obj.time,
			special : isMe,
			// animation : google.maps.Animation.DROP,
			// icon : './img/markers/'+icons.fail[i]+'.png',
			position : new google.maps.LatLng(obj.lat, obj.lng)
		});
		markers.push(m);
		google.maps.event.addListener(m, 'click', function(e) {
			var status = "<span style='color:"+(m.status==1 ? 'green' : 'red')+"'>"+(m.status==1 ? 'good' : 'bad')+"</span>";
			$('#map_window #isp').html(m.isp + ' : '+status);
			$('#map_window #time').html('last updated : ' + moment(parseInt(m.time)).fromNow());
			win.setOptions({ boxClass : (m.special ? 'map_window_yellow': 'map_window_dark') });
			win.open(map, m);
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
		var circ = new google.maps.Circle({
			map: map,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			radius: GoogleMap.calcMilesToMeters(searchArea / 2),
			center: new google.maps.LatLng(lat, lng)
		});
		google.maps.event.addListener(circ, 'click', function(e) { win.close(); });
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
