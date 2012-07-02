
$(document).ready(function(){

	var w1 =$('#welcome1');
	var w2 =$('#welcome2');
	
	var isps = ['Comcast', 'AT&T', 'Other'];
		
	function onIspSelection(e)
	{
		var isp = $(e.target).text();
		$('#isp-dropdown-label').text(isp);
	}
	
	function onHomeSelection()
	{
		console.log('home');
	}
	
	function onInfoSelection()
	{
		console.log('info');
	}
	
	function detectLocation()
	{
		var loc = new LocationDetector(function(e, a){
			if (e){
				console.log(e);
			}	else{
				var c, s;
				for (var i = a.address_components.length - 1; i >= 0; i--){
					var n = a.address_components[i];
					if (n['types'][0] == 'administrative_area_level_1') s = n['long_name'];
					if (n['types'][0] == 'administrative_area_level_3') c = n['long_name'];
					if (n['types'][0] == 'administrative_area_level_2' && !c) c = n['long_name'];
				};
				w1.find('.modal-body p').html(
					"It looks like you're in beautiful<br><span style='color:#27A3FA'>"+c +', '+ s+"</span><br>How's your Internet connection today?"
				)
				w1.modal('show');
			}
		});
	}
	
	function onW1Click(e)
	{
		var s = $(e.target).attr('id');
		w1.modal('hide');
		w2.modal('show');
		w2.find('.modal-body p').html(s);
	}

// global nav //
	$('#isp-dropdown ul').click(onIspSelection);
	$('#btn-home').click(onHomeSelection);
	$('#btn-info').click(onInfoSelection);
	
// modal window //
	w1.modal({ show : false, keyboard : false, backdrop : 'static' });
	w1.find('button').click(onW1Click);
	w2.modal({ show : false, keyboard : false, backdrop : 'static' });

//	detectLocation();

});