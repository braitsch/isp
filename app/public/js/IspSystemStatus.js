
$(document).ready(function(){

// from the database based on location ...
	var isps = ['Comcast', 'AT&T', 'Verizon', 'Other'];

// user specific variables //
	var isp, status;
	console.log('ip = '+ipAddress);

	var loc = new LocationDetector();
	var map = new GoogleMap();
	var mdl = new ModalController();
	
	mdl.addListener('onIspChanged', function(e){
		onIspSelection(e);
	});
	mdl.addListener('onStatusChanged', function(e){
		status = e;
		console.log('status = ' + status);
	});
	
	loc.getLocation(onLocationDetected);
	
	function onLocationDetected(ok, e)
	{
		if (e){
			console.log(e);
		} else{
			drawISPList();
			mdl.showLocation(loc.city, loc.state, isps);
			map.location = {lat : loc.lat, lng : loc.lng};
		}
	}
	
	function drawISPList()
	{
		$('#isp-dropdown ul').empty();
		for (var i=0; i < isps.length; i++) $('#isp-dropdown ul').append("<li><a href='#'>"+isps[i]+"</a></li>");
	}

	function onIspSelection(e)
	{
		isp = $(e.target).text();
		$('#isp-dropdown-label').text(isp);
	}

// global nav //
	$('#isp-dropdown ul').click(onIspSelection);
	$('#btn-home').click(function(){ mdl.showHome(); });
	$('#btn-info').click(function(){ mdl.showInfo(); });


});