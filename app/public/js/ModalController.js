
ModalController = function()
{
	var m1 = $('#modal-home');
	var m2 = $('#modal-info');
	var w1 = $('#modal-wel1');
	var w2 = $('#modal-wel2');

	m1.modal({ show : false, keyboard : true, backdrop : true });
	m2.modal({ show : false, keyboard : true, backdrop : true });
	w1.modal({ show : false, keyboard : false, backdrop : 'static' });
	w2.modal({ show : false, keyboard : false, backdrop : 'static' });
	
	this.showHome = function()
	{
		m1.modal('show');
	}
	
	this.showInfo = function()
	{
		m2.modal('show');
	}
	
	this.setLocation = function(city, state, isps)
	{
		w1.find('.modal-body p').html(
			"It looks like you're in beautiful<br><span style='color:#27A3FA'>"+city +', '+ state+"</span><br>How's your Internet connection today?"
		);
		drawISPList(isps);
		w1.modal('show');
		w1.find('button').click(onWelcome1Complete);
	}
	
	var drawISPList = function(isps)
	{
	// build list of isps based on the user's location //
		$('#isp-selector').empty();
		for (var i=0; i < isps.length; i++) $('#isp-selector').append("<button class='btn'>"+isps[i]+"</button>");
		$('#isp-selector button').click(function(e){
			w2.find('#check-status').removeClass('disabled');
			$('#isp-selector button').each(function(n, o){
				if (o != e.target){
					$(o).attr('class', 'btn');
				} else{
					$(o).attr('class', 'btn btn-success');
				}
			});
		})
		w2.find('#check-status').click(onWelcome2Complete);
	}
	
	var onWelcome1Complete = function(e)
	{
		w1.modal('hide');
		var status = $(e.target).attr('id') === 'service-ok' ? 1 : 0;
	// update status message //
		if (status == 1){
			w2.find('.modal-body p').html("Cool, glad to hear all is A-OK.<br>Who is your Internet Service Provider?");
		}	else{
			w2.find('.modal-body p').html("That sucks you're having problems.<br>Who is your Internet Service Provider?");
		}
		dispatch('onStatusSelected', status);
		w2.modal('show');
	}
	
	var onWelcome2Complete = function()
	{
		if (w2.find('#check-status').hasClass('disabled') == false){
			$('#isp-selector button').each(function(n, o){
				if ($(o).hasClass('btn-success')) dispatch('onIspSelected', $(o).text());
			});
			w2.modal('hide');
		}
	}

	var _evts = []; // event listeners //
	this.addListener = function(e, f)
	{
		for (var i = _evts.length - 1; i >= 0; i--) if (_evts[i].event == e && _evts[i].func == f) return;
		_evts.push({event:e, func:f});
	}
	this.removeListener = function(e, f)
	{
		for (var i = _evts.length - 1; i >= 0; i--) if (_evts[i].event == e && _evts[i].func == f) _evts.splice(i, 1);
	}
	var dispatch = function(e, args)
	{
		for (var i = _evts.length - 1; i >= 0; i--) if (_evts[i].event == e) _evts[i].func.apply(null, [args]);
	}
	
}