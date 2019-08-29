/*
/	Author: Bruce Kirwan
/	Web development Assignment A part 1
/	August 2019
/
/	This file contains the javascript for larger screen displays (>600px width)
/	It displays a title canvas of a moving starfield (that accelerates upon page navigation)
/	and also a timer (in seconds) that works with web-worker file timeCounter.js
/	to display the time spent on the site in the footer of each webpage.
/
*/

MAX_DEPTH = 50; 
var canvas, ctx;
var stars = new Array(512);
var windowWidth = 1000;
var windowHeight=150;
var sizeFactor=1.0;			// this changes for mobile view

var w;
var currentTimer = 0;		// value of current timer count from the web-worker timer




console.log('... site.js has loaded ...');

window.addEventListener('DOMContentLoaded', function (event) {
    console.log("DOM fully loaded and parsed");
	document.getElementById("canvas").style.display = "block";
	document.getElementById("color-fade").style.display = "block";
	document.getElementById("closebtn").style.display = "none";
	var existingTimer = getUrlParameter('timer');
	console.log("    *******************           existingTimer is " + existingTimer);
	addEvents();
	console.log("XXXXXXXXXXXXXX");
	if (existingTimer == "")
		startWorker(0)
	else
		startWorker(existingTimer);
	
});



function addEvents() {
	console.log("UUUUUUUUUUUUUUUUU");
	console.log(" ------------  in addEvents");
	canvas = document.getElementById("starfield");
	if( canvas && canvas.getContext ) {
		console.log("in if statement");
        ctx = canvas.getContext("2d");
        initStars();
		var timing = 35;		// timing is the time (in millisecons) between star movement (greater timing, slower speed)
		var widerView = window.matchMedia("(min-width: 601px)")
		if (widerView.matches) {	// no starburst for smaller widths
			var decelerate=10;				// rate of deceleration of stars at beginning
			for (i=1; i<timing; i=i+decelerate)
			{
				if (decelerate>1)
					decelerate--;			// reduce the rate of deceleration
				for (j=1; j<(i*(10-decelerate)); j++)		// stay longer at the larger timings (so that deceleration is gradual)
				{
					setTimeout(loop, i);
				}
			}
		} else
			timing = 100;
        setInterval(loop,timing);
    }
	/*
	/	events below to call functions that pass a query string with the timer for
	/	total time spend on the site when navigating to an internal link
	*/
	console.log("11111111111");
    document.getElementById("hamburgerIcon").addEventListener('click', function () {openNav();});
	console.log("22222222222222");
	document.getElementById("home").addEventListener('click', function() {
		console.log("333333333333");
		addUrlParameter("index.html");
	});
	document.getElementById("services").addEventListener('click', function() {
		console.log("333333333333");
		console.log ("added eventListerner for services.html");
		addUrlParameter("services.html");
	});
	document.getElementById("availability").addEventListener('click', function() {
		console.log("333333333333");
		addUrlParameter("availability.html");
	});
	document.getElementById("contact").addEventListener('click', function() {
		console.log("333333333333");
		addUrlParameter("contact.html");
	});
	document.getElementById("about").addEventListener('click', function() {
		console.log("333333333333");
		addUrlParameter("about.html");
	});
	console.log("4444444444444");
}


/*
/	add query string to the internal navigation link before navigating to internal Star Life page
*/
function addUrlParameter(linkPage) {
	var queryStr = "?timer=" + currentTimer;					// set up query string to add to end of URL (in order to pass current value of timer)
	console.log("in addURLParameter, queryStr is "+queryStr+",  linkPage is  "+linkPage);
	if (currentTimer > 0)										// if timer is a positive number
		linkPage += queryStr;									// add the query string
	console.log("linkPage is "+linkPage);
	window.location.href = linkPage;							// navigate to internal webpage
};

/*
/	function to retrieve the timer value from any query string that may be passed in
*/
function getUrlParameter(name) {
	var regex = new RegExp('[?&]' + name + '=([^&#]*)');		// create regular expression to search for the input parameter,
																//	preceded by either ? or & and having = afterwards 
    var results = regex.exec(location.search);					// execute the search 
	return results === null ? '' : results[1];					// return the item one space after the result set
};

/*
/	function to initiate the worker process, if allowed by the browser and if not already started
*/
function startWorker(inpTime) {
	if (typeof(Worker) !== "undefined") {						// if the browser supports web-workers
	//
		var workerCreated = false;								// assume no worker got created
		if (typeof(w) == "undefined") {							// test if any worker was already created
			//
			try {
				w = new Worker("timeCounter.js");				// create web-worker in file timeCounter.js
				workerCreated = true;							// indicate web-worker was created
			} catch(e) {										// if error creating web-worker
				console.log("Error creating new worker");
				console.log(e);									// output error message
				workerCreated = false;							// indicate worker was not created
			}
		}
		if (workerCreated)  {									// if worker created sucessfully
			w.onmessage = function(event) {						// message received from timeCounter.js web-worker
				currentTimer = event.data;						// save the time in global variable 
																// (needed in query string if navigating to an internal link)
				document.getElementById("timeOnSite").innerHTML = event.data;		// update field in the footer with the time
			}
			if (inpTime > 0)									// if a positive number from query string after navigating from other internal apge
				w.postMessage(inpTime);							// post the number from query string to the web-worker 
																// (so web worker does not start from 0)
		}
		//
	} else {													// output error message if browser does not support web-Workers
		document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
	}
}

function openNav() {
    console.log("Open Nav Clicked");
	setTimeout(function(){document.getElementById("closebtn").style.display = "block";}, 100);		// show close button after waiting 0.5 seconds
    document.getElementById("main-nav").style.width = "100%";


	//	document.getElementById("closebtn").style.vertical-align = "top";
	
}

function closeNav() {
    console.log("Close Nav Clicked");
    document.getElementById("main-nav").style.width = "0%";
		document.getElementById("closebtn").style.display = "none";
}


  /* Returns a random number in the range [minVal,maxVal] */
    function randomRange(minVal,maxVal) {
      return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
    }
 
    function initStars() {
		console.log(" ------------------------ in initStars");
		/*
		/   Change the canvas width to be the same as screen width
		*/
		console.log("********** window.innerWidth is "+window.innerWidth);
		windowWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
		var mobileView = window.matchMedia("(max-width: 600px)")
		if (mobileView.matches) {	// mobile view size
			sizeFactor = 0.9;
		}
		canvas.width = windowWidth*sizeFactor;
					console.log("********** windowWidth is "+windowWidth);
			console.log("********** canvas.width is "+canvas.width);	

		/*
		/   Change the canvas height to be 20% of the screen height
		*/
		windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		console.log('height is '+windowHeight);
		canvas.height=(windowHeight*sizeFactor)/5;
		/*
		/   Create the intial stars
		*/
      for( var i = 0; i < stars.length; i++ ) {
        stars[i] = {
          x: randomRange(-canvas.width/4, canvas.width/4),
          y: randomRange(-canvas.height/4,canvas.height/4),
          z: randomRange(1,MAX_DEPTH)
         }
      }

    }
 
    function loop() {
		/*
		// declare varibles for colouring the canvas (background, stars, text)
		// these are websafe colours
		*/
		sizeFactor=1.0;
		var textSize = 1.0;
			var colorBlack = "rgb(0,0,0)";
			var colorMidnight = "rgb(0,0,51)";
			var colorLightBlue = "rgb(0,0,255)";
			var colorWhite = "rgb(255,255,255)";
		var mobileView = window.matchMedia("(max-width: 600px)")
		if (mobileView.matches) {	// mobile view colours
			colorBlack = "rgb(240,248,255)";
			colorMidnight = "rgb(240,248,255)";
			colorLightBlue = "rgb(0,0,255)";
			colorWhite = "rgb(204,204,255)";
			sizeFactor = 0.9;
			textSize = canvas.width/600.0;		// change text size so it fits
		}/*
		else {	// desktop view
			var colorBlack = "rgb(0,0,0)";
			var colorMidnight = "rgb(0,0,51)";
			var colorLightBlue = "rgb(0,0,255)";
			var colorWhite = "rgb(255,255,255)";
		}*/
		/*
		//  first check if the dimensions of the window have changed
		*/
		if ((windowWidth != window.innerWidth) && (window.innerWidth > 0))
		{
			windowWidth=window.innerWidth;
			canvas.width=(windowWidth*sizeFactor);
		}
		if ((windowHeight != window.innerHeight) && (window.innerHeight > 0)){
			windowHeight=window.innerHeight;
			canvas.height=(windowHeight*sizeFactor)/5;
			if (canvas.height < 70)		// have a minimum canvas height
				canvas.height = 70;		
		}
		/*
		// declare varibles to help with placing of text and stars
		*/
		var halfWidth  = canvas.width/2;
		var halfHeight = canvas.height / 2;
		var dimRatio = canvas.width/canvas.height;
	  	/*
		/  make the backcolor black, but fade to dark blue (midnight) at bottom
		*/
	  var fill_gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
	  fill_gradient.addColorStop(0, colorBlack);
	  fill_gradient.addColorStop(1, colorMidnight);
	  ctx.fillStyle = fill_gradient;
      ctx.fillRect(0,0,canvas.width,canvas.height);
	   
      for( var i = 0; i < stars.length; i++ ) {
        stars[i].z -= 0.2;			//  reduce the depth for this star
		/*
		/  if the star is too big, replace with a new star, at a random position on the canvas,
		/  the star should be at maximum depth (i.e. smallest size)
		*/
        if( stars[i].z <= 0 ) {
          stars[i].x = randomRange(-halfWidth/2, halfWidth/2);
          stars[i].y = randomRange(-halfHeight/2,halfHeight/2);
          stars[i].z = MAX_DEPTH;
        }
		/*
		/  move the star from its current position at a speed that increases with reducing depth (or increasing size)
		*/
        var k  = 128.0/stars[i].z;
        var px = stars[i].x * k + halfWidth;
        var py = stars[i].y * k + halfHeight;
		/*
		/  check that the position of the current star is within the canvas
		/  if so, then draw the star
		*/
        if( px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height ) {
			var size = (1.0 - stars[i].z / MAX_DEPTH) * 10;
			var pxc = px + (size/2)		// x co-ordinate of the centre of radial gradient of star
			var pyc = py + (size/2)		// y co-ordinate of the center of radial gradent of star
			var starGradient = ctx.createRadialGradient(pxc, pyc, 0, pxc, pyc, size/2);	// create a radial gradient, so that the star is a circle
			starGradient.addColorStop(1, colorBlack);	// outer edge of square is black (same color as sky)
			if (Math.random()<0.1)				// give star a blue tinge 10% of time for "twinkling" effect
				starGradient.addColorStop(0,colorLightBlue);
			else
				starGradient.addColorStop(0, colorWhite);	// star is white most of the time

			// Fill with gradient
			ctx.fillStyle = starGradient;	// apply the gradient to the star square
			ctx.fillRect(px,py,size,size);	// colour the star within its square so that it is circular
        }
      }
	  	  /*
	  /    draw the heading text.
	  */
		var fontSize = parseInt(canvas.height * textSize/(2.75 * sizeFactor));
		ctx.font= fontSize + "px Georgia, serif";
		ctx.textAlign = "center";
		//var textGradient = ctx.createRadialGradient(halfWidth, canvas.height/1.65, 0, halfWidth, canvas.height/1.65, canvas.height);
		//textGradient.addColorStop(0,"white");
		//textGradient.addColorStop(1,colorLightBlue);
		var text_gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		text_gradient.addColorStop(0,colorLightBlue);
		text_gradient.addColorStop(1,colorWhite);
		ctx.fillStyle = text_gradient;
		ctx.fillText("Star Life Technologies", halfWidth, canvas.height/1.65); 
		//document.getElementById("main-content-3").innerHTML = " width is " + canvas.width +"<br> sizeFactor is "+ sizeFactor + "<br> textSize is "+ textSize + "<br> height is " + canvas.height;
    }




//This will return an array of all HTML elements of one parent element
function getChildrenById(x) {
    return document.getElementById(x).children;
}


