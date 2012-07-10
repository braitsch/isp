
$(document).ready(function(){

// from the database based on location ...
	var isps = ['Comcast', 'AT&T', 'Verizon', 'Other'];
	var initialized = false;

	var loc = new LocationDetector();
	var map = new GoogleMap();
	var mdl = new ModalController();
	
	loc.getLocation(onLocationData);
	
	mdl.addListener('onIspStatusChange', function(status, isp){
		onIspSelected(isp);
		writeToDatabase({ isp : isp, status : status, lat : loc.lat, lng : loc.lng });
		$('#header').show();
	});
	
	function onIspSelected(isp)
	{
		$('#isp-dropdown-label').text(isp);
	}
	
	function onLocationData(ok, e)
	{
		if (e){
			console.log('onLocationData :: '+e);
		} else{
			map.onLocationData( loc.lat, loc.lng );
			if (initialized == false) {
				initialized = true;
				drawISPList();
				map.getMarkers();
				mdl.setLocation(loc.city, loc.state, isps);
			}
		}
	}

	function drawISPList()
	{
		$('#isp-dropdown ul').empty();
		for (var i=0; i < isps.length; i++) $('#isp-dropdown ul').append("<li><a href='#'>"+isps[i]+"</a></li>");
	}

	function writeToDatabase(obj)
	{
		$.ajax({
			url: '/user',
			type : "POST",
			data : obj,
			success: function(obj){
				map.onUserUpdated(obj);
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

// global nav //
	$('#btn-home').click(function(){ mdl.showHome(); });
	$('#btn-info').click(function(){ mdl.showInfo(); });
	$('#isp-dropdown ul').click(function(e){  var isp = $(e.target).text(); onIspSelected(isp); map.onIspMenuSet(isp); });

});