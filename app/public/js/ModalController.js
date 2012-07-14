
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

	var selectIsp 	 = m1.find('#isp-select');
	var selectStatus = m1.find('#isp-status');
	var selectFilter = m1.find('#time-filter');

	var _isp, _status, _isps, _filter = selectFilter.val();

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
		_isps = isps;
		w1.find('.modal-body p').html(
			"It looks like you're in beautiful<br><span style='color:#27A3FA'>"+city +', '+ state+"</span><br>How's your Internet connection today?"
		);
		drawISPList(); w1.modal('show');
	}
	
	var drawISPList = function()
	{
	// build list of isps based on the user's location //
		$('#modal-wel2 select').empty();
		for (var i=0; i < _isps.length; i++) $('#modal-wel2 select').append("<option>"+_isps[i]+"</option>");
		$('#modal-wel2 .modal-body').append("<input type='text'></input>");
	}
	
	var onWelcome1Complete = function(e)
	{
		w1.modal('hide');
		_status = $(e.target).attr('id') === 'service-ok' ? 1 : 0;
	// update status message //
		if (_status == 1){
			$('#modal-wel2 #p1').html("Cool, glad to hear all is A-OK.<br>Who is your Internet Service Provider?");
		}	else{
			$('#modal-wel2 #p1').html("That sucks you're having problems.<br>Who is your Internet Service Provider?");
		}
		w2.modal('show');
	}
	
	var onWelcome2Complete = function()
	{
		w2.modal('hide');
		_isp = $('#modal-wel2 select').val();
		var val = $('#modal-wel2 input').val();
		val = capitalize(val.replace(/\W/ig, ''));
		if (val) { _isp = val; _isps.push(_isp); }
		dispatchStatusAndIsp();
		setModalSettingsWindow();
	}
	
	var setModalSettingsWindow = function()
	{
		for (var i=0; i < _isps.length; i++) selectIsp.append("<option>"+_isps[i]+"</option>");
		selectIsp.val(_isp);
		selectStatus.val(_status == 1 ? 'Online' : 'Offline');
	}
	
	var capitalize = function(s)
	{
		return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	var onSettingsChange = function()
	{
		var ispChanged, statusChanged;
		if (selectIsp.val() != _isp){
			ispChanged = true;
			_isp = selectIsp.val();
		}
		var statusVal = selectStatus.val() == 'Online' ? 1 : 0;
		if (statusVal != _status){
			statusChanged = true;
			_status = statusVal;
		}
		if (selectFilter.val() != _filter){
			_filter = selectFilter.val();
			dispatchFilterChange();
		}
		if (ispChanged || statusChanged) dispatchStatusAndIsp();
	}

	var dispatchStatusAndIsp = function()
	{
		dispatch('onIspStatusChange', [_status, _isp, _isps]);
	}
	
	var dispatchFilterChange = function()
	{
		dispatch('onTimeFilterChange', [_filter]);
	}

	m1.find('button').click(onSettingsChange);
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