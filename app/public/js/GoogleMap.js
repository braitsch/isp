
GoogleMap = function()
{
	var ispName = '';
	var uMarker = null;
	var aMarker = null;
	var markers = [];
	var searchCircle;
	var searchArea = 1; // 1 mile
	var timeFilter = 86400000; // 1 day
	var mapMoveTimeout;
		
// create the map & info window //
	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		zoom : 14,
		disableDefaultUI : mobile,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});
	var win = new InfoBox({
		content: document.getElementById('map_window'),
		disableAutoPan: false,
		maxWidth: 0,
		zIndex: null,
		closeBoxURL: '',
		closeBoxMargin: "10px",
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: true,
		pane: "floatPane",
		boxClass : 'map_window_solid',
		enableEventPropagation: false
	});
	var searchCircle = new google.maps.Circle({
		map: map,
		strokeColor: "#333333",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "#333333",
		fillOpacity: 0.25,
		radius: GoogleMap.calcMilesToMeters(searchArea / 2)
	});
	
	google.maps.event.addListener(win, 'click', function(e) { win.hide(); });
	google.maps.event.addListener(map, 'click', function(e) { win.hide(); });
	google.maps.event.addListener(searchCircle, 'click', function(e) { win.hide(); });

// test-markers //
	// google.maps.event.addListener(map, 'click', function(e) {
	// 	console.log(e.latLng.lat(), e.latLng.lng());
	// 	var coder = new google.maps.Geocoder();
	// 	var point = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
	// 	if (coder) {
	// 		coder.geocode({'latLng': point }, function (results, status) {
	// 			if (status == google.maps.GeocoderStatus.OK) {
	// 				if (results[0]) {
	// 					var a = results[0];
	// 					for (var i = a.address_components.length - 1; i >= 0; i--){
	// 						var n = a.address_components[i];
	// 						console.log(n['long_name'], n['types'][0])
	// //						if (n['types'][0] == 'administrative_area_level_1') _state = n['long_name'];
	// //						if (n['types'][0] == 'administrative_area_level_3') _city = n['long_name'];
	// //						if (n['types'][0] == 'administrative_area_level_2' && !_city) _city = n['long_name'];
	// 					};
	// 				} 
	// 			} 
	// 		});
	// 	}		
	// });

// create colored markers & a shadow //
	var drawMarker = function(v)
	{
	//	return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
			return new google.maps.MarkerImage('../img/markers/'+v+'.png',
			new google.maps.Size(21, 34),
			new google.maps.Point(0,0),
			new google.maps.Point(8, 34)
		);
	}
	var drawMarkerShadow = function(){
		return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
		new google.maps.Size(40, 37),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 37)
		);
	}
	var markerOnline = drawMarker('online');
	var markerOffline = drawMarker('offline');
	var markerShadow = drawMarkerShadow();

// public methods //

	this.onLocationData = function(lat, lng)
	{
		if (uMarker == null) {
			map.setCenter(new google.maps.LatLng(lat, lng));
		}	else{
			uMarker.setPosition(new google.maps.LatLng(lat, lng));
	//  redrawing on watchLocation change is cpu intesive //
	//  disabled unless we want to track the user's position across cities
	//  in which case, call on an interval and only if change value is significant 
		// drawMap();
	//  manually reset window position to get around bug on mobile safari //
			if (aMarker) win.setPosition(aMarker.getPosition());
		}
		searchCircle.setCenter(new google.maps.LatLng(lat, lng));
	}

	this.onUserUpdated = function(obj)
	{
		ispName = obj.isp;
		if (uMarker == null) {
			uMarker = drawGeoMarker(obj);
		}	else{
			uMarker.isp = obj.isp;
			uMarker.status = obj.status;
			uMarker.time = obj.time;
		}
		drawMap();
	}

	this.onIspMenuSet = function(isp)
	{
		ispName = isp;
		drawMap();
	}
	
	this.onTimeFilter = function(val)
	{
		switch(val){
			case 'Ten Minutes' 	: timeFilter = 600000; break;
			case 'One Hour' 	: timeFilter = 3600000; break;
			case 'One Day' 		: timeFilter = 86400000; break;
			case 'All Time' 	: timeFilter = Date.now(); break;
		}
		drawMap();
	}

	this.getMarkers = function()
	{
		var bnds = map.getBounds();
		var ne = bnds.getNorthEast();
		var sw = bnds.getSouthWest();
		(function( ne, sw){
		// first clear all markers from the map //
			while(markers.length){ markers[0].setMap(null); markers.splice(0, 1); }
			$.ajax({
				url: '/get-markers',
				type : "POST",
				data : {ne : ne, sw : sw},
				success: function(markers){ addMarkers(markers); },
				error: function(jqXHR){ console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText); }
			});
		})({ lat:ne.lat(), lng:ne.lng() }, { lat:sw.lat(), lng:sw.lng() });
	}
	
	var addMarkers = function(a)
	{
		for (var i = a.length - 1; i >= 0; i--) addMarker(a[i]);
	}
	
	var drawMap = function()
	{
		var n = Date.now() - timeFilter;
		for (var i = markers.length - 1; i >= 0; i--) {
			markers[i].inCircle = searchCircle.contains(markers[i].getPosition());
			if (ispName == 'All Providers'){
				markers[i].setVisible(markers[i].time >= n);
			}	else{
				markers[i].setVisible(markers[i].isp == ispName && markers[i].time >= n);
			}
		}
		win.hide(); tintSearchCircle();
	}
	
	var tintSearchCircle = function()
	{
		var a = [];
		for (var i = markers.length - 1; i >= 0; i--) if (markers[i].inCircle && markers[i].getVisible()) a.push(parseInt(markers[i].status));
		var n = 0;
		for (var i = a.length - 1; i >= 0; i--) n += a[i];
		if (uMarker.isp != ispName){
			n /= a.length;
		}	else{
			n += parseInt(uMarker.status);
			n /= a.length + 1;
		}
		var c = 'green';
		if (n < .3){
			var c = 'red';
		}	else if (n >= .3 && n <= .7){
			var c = 'yellow';
		}
		searchCircle.setOptions({ fillColor:c, strokeColor:c });
	}

	var addMarker = function(obj)
	{
		var m = new google.maps.Marker({
			map : map,
			isp : obj.isp,
			status : obj.status,
			time : obj.time,
			inCircle : obj.inCircle,
			icon : obj.status == 1 ? markerOnline : markerOffline,
			shadow : markerShadow,
			visible : false,
			position : new google.maps.LatLng(obj.lat, obj.lng)
		});
		markers.push(m);
		addMarkerClickHandler(m);
		return m;
	}

	var drawGeoMarker = function(obj)
	{
		var i = new google.maps.MarkerImage('img/markers/bluedot.png',
			null, // size
			null, // origin
			new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
			new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
		);
		var m = new google.maps.Marker({
			map: map,
			isp : obj.isp,
			status : obj.status,
			time : obj.time,
			inCircle : true,
			flat: true,
			icon: i,
			visible: true,
			optimized: false,
			title : 'geoMarker',
			position : new google.maps.LatLng(obj.lat, obj.lng)
		});
		addMarkerClickHandler(m);
		return m;
	}

	var addMarkerClickHandler = function(m)
	{
		google.maps.event.addListener(m, 'click', function(){
			aMarker = m;
			if (m.title == 'geoMarker'){
				var offset = new google.maps.Size(-94, -91);
			}	else{
				var offset = new google.maps.Size(-91.5, -109);
			}
			var status = "<span style='color:"+(m.status==1 ? 'green' : 'red')+"'>"+(m.status==1 ? 'Status Online' : 'Status Offline')+"</span>";
			$('#map_window #isp').html(m.isp + ' : '+status);
			$('#map_window #time').html('Updated : ' + moment(parseInt(m.time)).fromNow());
			win.setOptions({ pixelOffset : offset });
		//	win.setOptions({ boxClass : (m.special ? 'map_window_gradient': 'map_window_solid') });
			$('#map_window').show(); win.open(map, m); win.show();
		});
	}

	// var drawPoints = function(lat, lng)
	// {
	// 	addMarker(lat + GoogleMap.calcMilesToLatDegrees(searchArea/2), lng);
	// 	addMarker(lat - GoogleMap.calcMilesToLatDegrees(searchArea/2), lng);
	// 	addMarker(lat, lng - GoogleMap.calcMilesToLngDegrees(lat, searchArea/2));
	// 	addMarker(lat, lng + GoogleMap.calcMilesToLngDegrees(lat, searchArea/2));
	// }

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
