
$(document).ready(function(){

	window.map = new Map('map_canvas');
	
	var loc = new LocationDetector(function(e, pos){
		if (e){
			console.log(e);
		}	else{
			window.map.addThisUser(pos);
			window.map.addSavedUsers(pos);
		}
	});
	
	// get database users from jade template ...

	
});