
$(document).ready(function(){

// user specific variables //
	var ip, isp, loc, status;

	var w1 =$('#welcome1');
	var w2 =$('#welcome2');
	
	var isps = ['Comcast', 'AT&T', 'Verizon', 'Other'];
		
	function onIspSelection(e)
	{
		isp = $(e.target).text();
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
		status = $(e.target).attr('id') === 'service-ok' ? 1 : 0;
		w1.modal('hide');
	// build isp list based on location //
		$('#isp-selector').empty();
		$('#isp-dropdown ul').empty();
		for (var i=0; i < isps.length; i++)  {
			$('#isp-selector').append("<button class='btn'>"+isps[i]+"</button>");
			$('#isp-dropdown ul').append("<li><a href='#'>"+isps[i]+"</a></li>");
		};
		$('#isp-selector button').click(function(e){
			var target = e.target; onIspSelection(e);
			$('#isp-selector button').each(function(n, o){
				if (o != target){
					$(o).attr('class', 'btn');
				}	else{
					$(o).attr('class', 'btn btn-success');
				}
			})
		})
		w2.modal('show');
	}

// global nav //
	$('#isp-dropdown ul').click(onIspSelection);
	$('#btn-home').click(onHomeSelection);
	$('#btn-info').click(onInfoSelection);
	
// modal window //
	w1.modal({ show : false, keyboard : false, backdrop : 'static' });
	w1.find('button').click(onW1Click);
	w2.modal({ show : false, keyboard : false, backdrop : 'static' });
	w2.find('#check-status').click(function(){ w2.modal('hide'); });

	detectLocation();

});