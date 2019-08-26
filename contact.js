


      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
var x = document.getElementById("map");




window.addEventListener('DOMContentLoaded', function (event) {
    console.log("DOM fully loaded and parsed");
    addEvents2();
	getLocation();


});


function addEvents2() {
	console.log(" ------------  in addEvents2 for contact.js");
	$(".svg-images").hover(function(){console.log("hovering............");
		var x = this.getElementsByTagName("animateTransform");  
		x[0].beginElement();
	}, function(){});
}
/*
function showPosition(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=YOUR_KEY";

  document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}
*/

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
	document.getElementById("map-title").innerHTML = "The recommended route from your location to us, is below:";
	y = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m27!1m12!1m3!1d38079.00149741396!2d-6.295563540070553!3d53.38016607633322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m12!3e6!4m4!2s53.3492952%20%20-6.231559799999999!3m2!1d53.3492952!2d-6.231559799999999!4m5!1s0x48670dc475e5c117%3A0x7baa038425845b41!2sFinglas%20Training%20Centre%20CDETB%2C%20Poppintree%20Industrial%20Estate%20Jamestown%20Road%20Finglas%2C%20Dublin%2011%2C%20Ireland!3m2!1d53.398858999999995!2d-6.289505999999999!5e0!3m2!1sen!2suk!4v1566850380413!5m2!1sen!2suk\"  "
	+ "width=\"100%\"  height=\"500\"  frameborder=\"0\" style=\"border:0;\" allowfullscreen=\"\"></iframe>"
/*	
	"<iframe src=\"https://www.google.com/maps/embed?pb=!1m27!1m12!1m3!1d38079.00181039906!2d-6.295563540070605!3d53.3801657263332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m12!3e0!4m4!2s"
	+ position.coords.latitude + "%20%20" + position.coords.longitude +
	"!3m2!1d53.3492976!2d-6.2315442!4m5!1s0x48670dc475e5c117%3A0x7baa038425845b41!2sFinglas%20Training%20Centre%20CDETB%2C%20Poppintree%20Industrial%20Estate%20Jamestown%20Road%20Finglas%2C%20Ballymun"
	+ "%2C%20Dublin%2011%2C%20Ireland!3m2!1d53.398858999999995!2d-6.289505999999999!5e0!3m2!1sen!2suk!4v1566848060349!5m2!1sen!2suk\"width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0;\" allowfullscreen=\"\"></iframe>";
	*/
	console.log("y is "+y);
	document.getElementById("google-map").innerHTML = y;
}