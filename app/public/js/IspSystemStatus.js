
$(document).ready(function(){

// user specific variables //
	var isp, status;
	console.log('ip = '+ipAddress);

	var w1 = $('#modal-wel1');
	var w2 = $('#modal-wel2');
	var m1 = $('#modal-home');
	var m2 = $('#modal-info');
	
	var isps = ['Comcast', 'AT&T', 'Verizon', 'Other'];

	var map = new GoogleMap();
	var loc = new LocationDetector();
	loc.getLocation(onLocationDetected);
	
	function onLocationDetected(ok, e)
	{
		if (e){
			console.log(e);
		} else{
			w1.find('.modal-body p').html(
				"It looks like you're in beautiful<br><span style='color:#27A3FA'>"+loc.city +', '+ loc.state+"</span><br>How's your Internet connection today?"
			)
			w1.modal('show');
			w1.find('button').click(onW1Click);
			map.location = {lat : loc.lat, lng : loc.lng};
		}
	}

	function onIspSelection(e)
	{
		isp = $(e.target).text();
		$('#isp-dropdown-label').text(isp);
	}
	
	function onW1Click(e)
	{
		w1.modal('hide');
		status = $(e.target).attr('id') === 'service-ok' ? 1 : 0;
	// update status message //
		if (status == 1){
			w2.find('.modal-body p').html("Cool, glad to hear all is A-OK.<br>Who is your Internet Service Provider?");
		}	else{
			w2.find('.modal-body p').html("That sucks you're having problems.<br>Who is your Internet Service Provider?");
		}
	// build list of isp's based on location //
		$('#isp-selector').empty();
		$('#isp-dropdown ul').empty();
		for (var i=0; i < isps.length; i++)  {
			$('#isp-selector').append("<button class='btn'>"+isps[i]+"</button>");
			$('#isp-dropdown ul').append("<li><a href='#'>"+isps[i]+"</a></li>");
		};
		$('#isp-selector button').click(function(e){
			w2.find('#check-status').removeClass('disabled');
			w2.find('#check-status').click(function(){ w2.modal('hide'); $('#header').show() });
			var target = e.target; onIspSelection(e);
			$('#isp-selector button').each(function(n, o){
				if (o != target){
					$(o).attr('class', 'btn');
				} else{
					$(o).attr('class', 'btn btn-success');
				}
			})
		})
		w2.modal('show');
	}

// global nav //
	$('#isp-dropdown ul').click(onIspSelection);
	$('#btn-home').click(function(){ m1.modal('show'); });
	$('#btn-info').click(function(){ m2.modal('show'); });
	
// modal windows //
	w1.modal({ show : false, keyboard : false, backdrop : 'static' });
	w2.modal({ show : false, keyboard : false, backdrop : 'static' });
	m1.modal({ show : false, keyboard : true, backdrop : true });
	m2.modal({ show : false, keyboard : true, backdrop : true });

});