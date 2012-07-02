
var icons = {
	ok : [],
	fail : ['mummy', 'zombie'] 
}

Map = function()
{
	var pos = { lat : 0, lng : 0 };
	var searchArea = 1; // 1 mile
	var div = document.getElementById('map_canvas')
	var map = new google.maps.Map(div, {
		zoom : 14,
		disableDefaultUI : true,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});
	
	google.maps.event.addListener(map, 'click', function(e) {
		addMarker(e.latLng.lat(), e.latLng.lng());
	});	

	
// public methods //
	
	this.setUser = function(obj)
	{
		pos = obj;
		drawPoints();
	//	drawCircle();
	//	drawBounds();
		addMarker(pos.lat, pos.lng);
		map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
	}
	
	this.addUser = function(a)
	{

	}
	
	var clickCount = 0;
	var addMarker = function(lat, lng)
	{
		var i = Math.floor(Math.random()*icons.fail.length);
		var mrkr = new google.maps.Marker({
			map : map,
			title : 'xyz',
			icon : './img/markers/'+icons.fail[i]+'.png',
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
	
	var drawPoints = function()
	{
		addMarker(pos.lat + Map.calcMilesToLatDegrees(searchArea/2), pos.lng);
		addMarker(pos.lat - Map.calcMilesToLatDegrees(searchArea/2), pos.lng);
		addMarker(pos.lat, pos.lng - Map.calcMilesToLngDegrees(pos.lat, searchArea/2));
		addMarker(pos.lat, pos.lng + Map.calcMilesToLngDegrees(pos.lat, searchArea/2));	
	}

	var drawCircle = function()
	{
		new google.maps.Circle({
			map: map,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			radius: Map.calcMilesToMeters(searchArea / 2),
			center: new google.maps.LatLng(pos.lat, pos.lng)
		});
	}

	var drawBounds = function()
	{
		var sw = new google.maps.LatLng(pos.lat - Map.calcMilesToLatDegrees(searchArea/2), pos.lng - Map.calcMilesToLngDegrees(pos.lat, searchArea/2));
		var ne = new google.maps.LatLng(pos.lat + Map.calcMilesToLatDegrees(searchArea/2), pos.lng + Map.calcMilesToLngDegrees(pos.lat, searchArea/2));
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

}

// static methods //

Map.calcMilesToMeters = function(m)
{
	return m * 1609.344;
}
Map.calcMilesToLatDegrees = function(m)
{
	return m / 69;
}
Map.calcMilesToLngDegrees = function(lat, m)
{
	return m / (69 * Math.cos(Map.degreesToRadians(lat)));
}
Map.degreesToRadians = function(d)
{
	return d * (Math.PI / 180);
}
