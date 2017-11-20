function truncate(string, n){
   if (string.length > n)
      return string.substring(0,n)+'...';
   else
      return string;
};

$(document).ready(function() {
	$(".title").html(function(i, text) {
		if (text.length > 19)
	   		return jQuery.trim(text).substring(0, 19) + "...";
	});

	$(".synopsis").html(function(i, text) {
		var n = 60;
		if (text.length > n)
	   		return jQuery.trim(text).substring(0, n) + "...";
	});

	$(".genre").html(function(i, text) {
		var n = 60;
		if (text.length > n)
	   		return jQuery.trim(text).substring(0, n) + "...";
	});

});