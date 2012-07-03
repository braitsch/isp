
$(document).ready(function(){

// from the database based on location ...
	var isps = ['Comcast', 'AT&T', 'Verizon', 'Other'];

// user generated variables //
	var isp, status;

	var loc = new LocationDetector();
	var map = new GoogleMap();
	var mdl = new ModalController();
	
	loc.getLocation(onLocationDetected);
	
	mdl.addListener('onIspSelected', function(el){
		onIspSelection(el);
		writeToDatabase();
		$('#header').show();
	});
	mdl.addListener('onStatusSelected', function(e){ status = e; });
	
	function onLocationDetected(ok, e)
	{
		if (e){
			console.log(e);
		} else{
			drawISPList();
			mdl.setLocation(loc.city, loc.state, isps);
			map.location = {lat : loc.lat, lng : loc.lng};
		}
	}
	
	function drawISPList()
	{
		$('#isp-dropdown ul').empty();
		for (var i=0; i < isps.length; i++) $('#isp-dropdown ul').append("<li><a href='#'>"+isps[i]+"</a></li>");
	}

	function onIspSelection(el)
	{
		isp = $(el).text();
		$('#isp-dropdown-label').text(isp);
	}
	
	function writeToDatabase()
	{
		$.ajax({
			url: '/user',
			type : "POST",
			data : { isp : isp, status : status, city : loc.city, state : loc.state },
			success: function(data){
				console.log('ok');
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

// global nav //
	$('#btn-home').click(function(){ mdl.showHome(); });
	$('#btn-info').click(function(){ mdl.showInfo(); });
	$('#isp-dropdown ul').click(function(e){ onIspSelection(e.target); });

});