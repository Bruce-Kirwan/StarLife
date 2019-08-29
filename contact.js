/*
/	Author: Bruce Kirwan
/	Web development Assignment A part 1
/	August 2019
/
/	This file contains the javascript for the contact webpage (contact.html)
/	It contains SVG images with animation and location services
/   The location services consists of a google embedded map which shows 
/	how to get from your detected location to Finglas ETB.
/
*/



window.addEventListener('DOMContentLoaded', function (event) {
    console.log("DOM fully loaded and parsed");
    addMoreEvents();
	/*
	/	do not show images if small screen
	*/
	var smallView = window.matchMedia("(max-width: 199px)")
	if (smallView.matches) {	//
		document.getElementById("first-image").style.display="none";
		document.getElementById("second-image").style.display="none";
		document.getElementById("third-image").style.display="none";
	}
	/*
	/	detect location and show route to Finglas ETB on the google map
	*/
	getLocation();


});

/*
/	add the event to animate the SVG images upon mouse over (hover)
*/
function addMoreEvents() {
	$(".svg-images").hover(function(){console.log("hovering............");
		var x = this.getElementsByTagName("animateTransform");  
		try {
			x[0].beginElement();			// initiate animation
		} catch (e) {
			console.log(e);	// output message to console if error
		}
	}, function(){});
}

      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
/*
/	function to get the location of the user (if they provide consent)
*/
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/*
/	function to display a google map showing how to travel from the user's location
/	to Finglas ETB.
*/
function showPosition(position) {
	document.getElementById("map-title").innerHTML = "The recommended route from your location to us, is below:";
	y = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m27!1m12!1m3!1d38079.00149741396!2d-6.295563540070553!3d53.38016607633322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m12!3e6!4m4!2s"
	+position.coords.latitude+position.coords.longitude+"!3m2!1d"+position.coords.latitude+"!2d"+position.coords.longitude+
	"!4m5!1s0x48670dc475e5c117%3A0x7baa038425845b41!2sFinglas%20Training%20Centre%20CDETB%2C%20Poppintree%20Industrial%20Estate%20Jamestown%20Road%20Finglas%2C%20Dublin%2011%2C%20Ireland!3m2!1d"
	+ position.coords.latitude +"!2d-"+ position.coords.longitude +"!5e0!3m2!1sen!2suk!4v1566850380413!5m2!1sen!2suk\"  "
	+ "width=\"100%\"  height=\"500\"  frameborder=\"0\" style=\"border:0;\" allowfullscreen=\"\"></iframe>"
	document.getElementById("google-map").innerHTML = y;
}