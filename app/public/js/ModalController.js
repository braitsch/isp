
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

	var status = null;

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
		drawISPList(isps); w1.modal('show');
	}
	
	var drawISPList = function(isps)
	{
	// build list of isps based on the user's location //
		$('#isp-selector').empty();
		$('#modal-home #isp-select').empty();
		for (var i=0; i < isps.length; i++) {
			$('#modal-home #isp-select').append("<option>"+isps[i]+"</option>");
			$('#isp-selector').append("<button class='btn'>"+isps[i]+"</button>");
		}
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
	}
	
	var onWelcome1Complete = function(e)
	{
		w1.modal('hide');
		status = $(e.target).attr('id') === 'service-ok' ? 1 : 0;
	// update status message //
		if (status == 1){
			w2.find('.modal-body p').html("Cool, glad to hear all is A-OK.<br>Who is your Internet Service Provider?");
		}	else{
			w2.find('.modal-body p').html("That sucks you're having problems.<br>Who is your Internet Service Provider?");
		}
		w2.modal('show');
	}
	
	var onWelcome2Complete = function()
	{
		if (w2.find('#check-status').hasClass('disabled') == false){
			$('#isp-selector button').each(function(n, o){
				if ($(o).hasClass('btn-success')) setStatusAndIsp($(o).text());
			});
			w2.modal('hide');
		}
	}
	
	var onIspAndStatusChange = function()
	{
		status = $('#modal-home #isp-status').val() == 'Online' ? 1 : 0;
		setStatusAndIsp($('#modal-home #isp-select').val());
	}

	var setStatusAndIsp = function(isp)
	{
		$('#modal-home #isp-select').val(isp);
		$('#modal-home #isp-status').val(status == 1 ? 'Online' : 'Offline');
		dispatch('onIspStatusChange', [status, isp]);
	}

	m1.find('button').click(onIspAndStatusChange);
	w1.find('button').click(onWelcome1Complete);
	w2.find('#check-status').click(onWelcome2Complete);

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
	var dispatch = function(e, a)
	{
		for (var i = _evts.length - 1; i >= 0; i--) if (_evts[i].event == e) _evts[i].func.apply(null, a);
	}
	
}