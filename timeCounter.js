/*
/	webworker javascript file to iterate the time spent on the website in the page footer
*/

var timer = 0;			// start timer at 0 seconds

/*
*	web-worker function to increment a timer every 1 second and display in page footer.
*/
function timedCount() {
	timer += 1;		// increment timer by one second
	/*
	/	function to accept time counted after navigation from previous internal Star Life webpage
	*/
	onmessage = function(e) {		
		var passedTime = parseInt(e.data, 10)		// the passed-in time from previous webpage is available via e.data
		i=passedTime;
	};
	//
	postMessage(i);						// post the time into the page footer 
	//
	setTimeout("timedCount()",1000);	// call itself every 1000 milliseconds (i.e. every 1 second)
}

timedCount();		// initial call of web-worker function