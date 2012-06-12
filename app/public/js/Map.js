
var searchArea = 1; // 1 mile

Map = function(div)
{ 
	this.div = document.getElementById(div)
	this.map = new google.maps.Map(this.div, {
		zoom : 15,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});
	
	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') != -1 || ua.indexOf('Android') != -1 ) {
		this.div.style.width = '600px';
		this.div.style.height = '800px';
	} else {
		this.div.style.width = '100%';
		this.div.style.height = '100%';
	}
}

Map.prototype.addThisUser = function(pos)
{
	this.drawRectangle(pos.lat, pos.lng)
	this.drawCircle(pos.lat, pos.lng);
	this.addMarker(pos.lat, pos.lng);
	this.addMarker(pos.lat + Map.calcMilesToLatDegrees(searchArea/2), pos.lng);
	this.addMarker(pos.lat - Map.calcMilesToLatDegrees(searchArea/2), pos.lng);
	this.addMarker(pos.lat, pos.lng - Map.calcMilesToLngDegrees(pos.lat, searchArea/2));
	this.addMarker(pos.lat, pos.lng + Map.calcMilesToLngDegrees(pos.lat, searchArea/2));
	this.map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
}

Map.prototype.addSavedUsers = function(pos)
{

}

Map.prototype.addMarker = function(lat, lng)
{
	var mrkr = new google.maps.Marker({
		map : this.map,
		title : 'xyz',
		position : new google.maps.LatLng(lat, lng),
		animation : google.maps.Animation.DROP
	});
	google.maps.event.addListener(mrkr, 'click', function(e) {
		console.log('clicked');
	});	
}

Map.prototype.drawCircle = function(lat, lng)
{
	new google.maps.Circle({
		map: this.map,
		strokeColor: "#FF0000",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "#FF0000",
		fillOpacity: 0.35,
		radius: Map.calcMilesToMeters(searchArea / 2),
		center: new google.maps.LatLng(lat, lng)
	});
}

Map.prototype.drawRectangle = function(lat, lng)
{
	var sw = new google.maps.LatLng(lat - Map.calcMilesToLatDegrees(searchArea/2), lng - Map.calcMilesToLngDegrees(lat, searchArea/2));
	var ne = new google.maps.LatLng(lat + Map.calcMilesToLatDegrees(searchArea/2), lng + Map.calcMilesToLngDegrees(lat, searchArea/2));
	var rect = new google.maps.Rectangle({
		map: this.map,		
		strokeColor: "#FF0000",
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: "#FF0000",
		fillOpacity: 0.35,
		bounds: new google.maps.LatLngBounds(sw, ne)
	});	
}

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
	return d * (Math.PI/180)
}

	