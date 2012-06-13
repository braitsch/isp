
$(document).ready(function(){

	console.log('ip = '+ipAddress);

	if (!window.map) var map = new Map();

	var loc = new LocationDetector(function(e, pos){
		if (e){
			console.log(e);
		}	else{
			map.setUser(pos);
	//		Map.addSavedUsers(pos);
		}
	});
	
	// get database users from jade template ...
	
});