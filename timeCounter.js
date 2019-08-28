/*
/	Author: Bruce Kirwan
/	Web development Assignment A part 1
/	August 2019
/
/	This file contains the javascript for the webworker 
/	which iterate the time spent on the website.
/   It is called by 'site.js' (which then displays the passed time in the page footer)
/
*/

var timer = 0;			// start timer at 0 seconds
console.log(".........in timeCounter.js.............");

/*
*	web-worker function to increment a timer every 1 second and display in page footer.
*/
function timedCount() {
	timer += 1;		// increment timer by one second
	//
	setTimeout("timedCount()",1000);		// call function recursively every 1000 milliseconds (i.e. every 1 second)
	/*
	/	function to accept time counted after navigation from previous internal Star Life webpage
	*/
	onmessage = function(e) {		
		var passedTime = parseInt(e.data, 10)		// the passed-in time from previous webpage is available via e.data
		timer=passedTime;
	};
	//
	postMessage(timer);						// post the time into the page footer 
}

timedCount();		// initial call of web-worker function