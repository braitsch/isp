
GoogleMap = function()
{
	var markers = [];
	var searchCircle;
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
				var markersInCircle = [];
				for (var i = data.length - 1; i >= 0; i--) {
		// attach markers that exist within the maps new boundaries //
					addMarker(data[i]);
		// detect which markers are within the search area so we can draw an average status value //
					if (searchCircle.contains(new google.maps.LatLng(data[i].lat, data[i].lng))) markersInCircle.push(data[i]);
				}
				var avgStatus = 0;
				for (var i = markersInCircle.length - 1; i >= 0; i--) avgStatus += parseInt(markersInCircle[i].status);
				avgStatus /= markersInCircle.length;
				if (avgStatus < .3){
					var color = 'red';
				}	else if (avgStatus >= .3 && avgStatus <= .7){
					var color = 'yellow';
				}	else if (avgStatus > .7){
					var color = 'green';
				}
				searchCircle.setOptions({ fillColor:color, strokeColor:color });
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	var drawMarker = function(color)
	{
		return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
			new google.maps.Size(21, 34),
			new google.maps.Point(0,0),
			new google.maps.Point(10, 34)
		);
	}
	var drawMarkerShadow = function(){
		return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
		new google.maps.Size(40, 37),
			new google.maps.Point(0, 0),
			new google.maps.Point(12, 35)
		);
	}

	var markerRed = drawMarker('B03120');
	var markerGreen = drawMarker('24B020');
	var markerShadow = drawMarkerShadow();

	var addMarker = function(obj)
	{
		var m = new google.maps.Marker({
			map : map,
			isp : obj.isp,
			status : obj.status,
			time : obj.time,
			icon : obj.status == 1 ? markerGreen : markerRed,
			shadow : markerShadow,
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
		searchCircle = new google.maps.Circle({
			map: map,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.25,
			radius: GoogleMap.calcMilesToMeters(searchArea / 2),
			center: new google.maps.LatLng(lat, lng)
		});
		google.maps.event.addListener(searchCircle, 'click', function(e) { win.close(); });
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

	google.maps.Circle.prototype.contains = function(latLng) {
	  return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
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
