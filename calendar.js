
MAX_DEPTH = 50; 
var canvas, ctx;
var stars = new Array(512);
var windowWidth = 1000;
var windowHeight=150;
var sizeFactor=1.0;			// this changes for mobile view
var today = new Date();
var currentWeekDay = today.getDay();
var currentDay = today.getDate();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var selectDate = new Date(today);
var selectWeekDay = currentWeekDay;
var selectDay = currentDay;
var selectMonth = currentMonth;
var selectYear = currentYear;
var displayDate = new Date(today);
var firstOfMonth = new Date(today);
var oneYearFromToday = new Date(today);
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var displayingDay = false;
console.log('... site.js has loaded ...');

var removeCanvas = true;		// remove canvas when displaying schedule for one day
var narrowView = window.matchMedia("(max-width: 600px)")
if (narrowView.matches) 		// keep canvas for smaller widths
	removeCanvas = false;

/*
$.ajax({
  // The 'type' property sets the HTTP method.
  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
  type: 'GET',

  // The URL to make the request to.
  url: 'https://github.com/Bruce-Kirwan/StarLife/blob/master/availability.json',

  // The 'contentType' property sets the 'Content-Type' header.
  // The JQuery default for this property is
  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
  // a preflight. If you set this value to anything other than
  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
  // you will trigger a preflight request.
  contentType: 'text/plain',

  xhrFields: {
    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
    // This can be used to set the 'withCredentials' property.
    // Set the value to 'true' if you'd like to pass cookies to the server.
    // If this is enabled, your server must respond with the header
    // 'Access-Control-Allow-Credentials: true'.
    withCredentials: false
  },

  headers: {
    // Set any custom headers here.
    // If you set any non-simple headers, your server must include these
    // headers in the 'Access-Control-Allow-Headers' response header.
  },

  success: function() {
    // Here's where you handle a successful response.
  },

  error: function() {
    // Here's where you handle an error response.
    // Note that if the error was due to a CORS issue,
    // this function will still fire, but there won't be any additional
    // information about the error.
  }
});
*/
$.ajax({
  method: 'GET',
  url: 'http://crossorigin.me/https://github.com/Bruce-Kirwan/StarLife/blob/master/availability.jsonp',
  dataType: 'jsonp', //change the datatype to 'jsonp' works in most cases
  success: (res) => {
	  console.log("success !!!!!!!!!!!!!!!!!!!!!! ");
   console.log(res);
  }
})

function fetchJsonDataFile() {
	console.log("About to fetch JSON data file");
	  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("wrapper").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "https://github.com/Bruce-Kirwan/StarLife/blob/master/availability.json", true);
  xhttp.send();
}

function populateAvailability(data) {
		console.log("populating availability");
		console.log("data is "+ data);
}

window.addEventListener('DOMContentLoaded', function (event) {
    console.log("DOM fully loaded and parsed");
	oneYearFromToday = oneYearFromToday.setYear(oneYearFromToday.getFullYear()+1);		// get date exactly one year from today
	document.getElementById("closebtn").style.display = "none";
	initialiseCalendar();
	//fetchJsonDataFile();
    addEvents();
});

function addEvents() {
	console.log(" ------------  in addEvents");
	canvas = document.getElementById("starfield");
	if( canvas && canvas.getContext ) {
        ctx = canvas.getContext("2d");
        initStars();
		var timing = 35;		// timing is the time (in millisecons) between star movement (greater timing, slower speed)
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
        setInterval(loop,timing);
    }
    document.getElementById("hamburgerIcon").addEventListener('click', function () {openNav();});
	
	document.getElementById("month").onclick = function(e) {
		e = e || event
		var target = e.target || e.srcElement
		// variable target has your clicked element
		if (target.nodeName == "TD") {
			displayDate = new Date(selectYear + "-" + (selectMonth+1) + "-" + target.innerHTML);
			initialiseDay();
		}
	}
	document.getElementById("next").onclick = function() {
		if (displayingDay)  {
			displayDate.setDate(displayDate.getDate() + 1);	
			if (displayDate.getDate()==1) {		// if have moved into next month,
				selectDate = displayDate;
				initialiseCalendar();			// also update the month calendar
			}				
			initialiseDay();					
		} else  {
			var x = firstOfMonth.getMonth();
			selectDate = new Date(firstOfMonth.setMonth(firstOfMonth.getMonth()+1));
			x = selectDate.getMonth();
			initialiseCalendar();
		}
	}
	document.getElementById("previous").onclick = function() {
		if (displayingDay)  {
			if (displayDate.getDate()==1) {		// if moving back to previous month,
				displayDate.setDate(displayDate.getDate() - 1);	
				selectDate = displayDate;
				initialiseCalendar();			// also update the month calendar
			} else {
				displayDate.setDate(displayDate.getDate() - 1);	
			}
			initialiseDay();

		} else  {
			var x = firstOfMonth.getMonth();
			selectDate = new Date(firstOfMonth.setMonth(firstOfMonth.getMonth()-1));
			initialiseCalendar();
		}
	}
	document.getElementById("returnToMonth").onclick = function() {
		document.getElementById("day").style.display = "none";
		document.getElementById("returnToMonth").innerHTML = "";
		document.getElementById("canvas").style.display = "block";
		document.getElementById("color-fade").style.display = "block";
		document.getElementById("year").innerHTML = months[selectMonth] + " " + selectYear;
		displayingDay = false;
	}	
}

function initialiseDay() {
	selectYear = displayDate.getFullYear();
	selectMonth = displayDate.getMonth();
	selectDay = displayDate.getDate();;
	if (removeCanvas)		// remove the canvas, unless we are in mobile view
		document.getElementById("canvas").style.display = "none";
	document.getElementById("color-fade").style.display = "none";
	document.getElementById("day").style.display = "block";
	document.getElementById("year").innerHTML = selectDay + " " + months[selectMonth];
	document.getElementById("returnToMonth").innerHTML = "return to month";
	displayingDay = true;
	/*
	/   do not show previous button, if the month is before the current month
	*/
	if (displayDate <= today) {
		document.getElementById("previous").style.display = "none";
	} else {
		document.getElementById("previous").style.display = "block";
	}
	/*
	/   do not show next button, if after one year into the future
	*/
	if (displayDate >= oneYearFromToday) {
		document.getElementById("next").style.display = "none";
	} else {
		document.getElementById("next").style.display = "block";
	}
}

function initialiseCalendar() { 
	document.getElementById("canvas").style.display = "block";
	document.getElementById("color-fade").style.display = "block";
	selectMonth = selectDate.getMonth();
	selectYear = selectDate.getFullYear();
	var startDay = 1;						// default show from 1st of month
	if (selectDate < today) 
		selectDate = today;
	selectDay = selectDate.getDate();
	document.getElementById("year").innerHTML = months[selectMonth] + " " + selectYear;
	/*
	/   do not show previous button, if the month is before the current month
	*/
	if ((selectDate.getYear() <= today.getYear())&&(selectDate.getMonth() <= today.getMonth())) {
		document.getElementById("previous").style.display = "none";
	} else {
		document.getElementById("previous").style.display = "block";
	}
	/*
	/   do not show next button, if the month is after one year into the future
	*/
	if ((selectDate.getYear() > today.getYear())&&(selectMonth >= today.getMonth())) {
		document.getElementById("next").style.display = "none";
	} else {
		document.getElementById("next").style.display = "block";
	}
	// get the first day of the month, so know what day of the week to start adding day of month numbers
    firstOfMonth = new Date(selectYear+"-"+(selectMonth+1)+"-01");
	if (firstOfMonth < today) 				// if first of month is before current date (today)
		startDay = currentDay;				// then do not show days before current date (today)
	var firstDayOfMonth = firstOfMonth.getDay();
	var selectDay = firstOfMonth.getDate();
	// create the table of days of month
	var tbl = document.getElementById("month");
	tbl.innerHTML = "";		// body of the calendar
	/*
	// create and add the header for the days of the week
	*/
	var row = document.createElement("tr");
	for (var i=0; i < 7; i++) {
		var cell = document.createElement("th");
		var cellText = document.createTextNode(days[i]);
		cell.appendChild(cellText);
        row.appendChild(cell);
	}
	tbl.appendChild(row);
	/*
	/   next, write out the first row of days of the month
	*/
	row = document.createElement("tr");
	var day;
	for (var i=0;i<firstDayOfMonth; i++) {
		cell = document.createElement("th");
		row.appendChild(cell);
	}
	for (var i=firstDayOfMonth; i < 7; i++) {
		if (selectDay < startDay) {
			cell = document.createElement("th");
			cell.style.color = "rgb(0,0,153)";
		} else {
			cell = document.createElement("td");
		}		
		cellText = document.createTextNode(selectDay);
		cell.appendChild(cellText);
        row.appendChild(cell);
		selectDay++;
	}
	tbl.appendChild(row);
	/*
	/   then write out the next 3 rows of days of the month
	*/
	for (var i = 0; i < 3; i++) {
		row = document.createElement("tr");
		//   create each cell in table of month dates
		for (var j=0; j<7; j++) {
			if (selectDay < startDay) {
				cell = document.createElement("th");
				cell.style.color = "rgb(0,0,153)";
			} else {
				cell = document.createElement("td");
			}
			cellText = document.createTextNode(selectDay);
			cell.appendChild(cellText);
			row.appendChild(cell);
			selectDay++;
		}
		tbl.appendChild(row);
	}
	
	selectDate = new Date(selectYear+"-"+(selectMonth+1)+"-"+selectDay);
	row = document.createElement("tr");
	//   create each cell in table of month days
	for (var j=0; j<7; j++) {
		day = selectDate.getDate();
		cellText = document.createTextNode(day);		
		if ( (day < 7) ||  (day < startDay) )  {
			cell = document.createElement("th");
			cell.style.color = "rgb(0,0,153)";
		} else {
			cell = document.createElement("td");
		}
		cell.appendChild(cellText);
		row.appendChild(cell);
		selectDate.setDate(selectDate.getDate() + 1);
	}
	//  add the new row to the table
	tbl.appendChild(row);
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

function accordion() {

    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}


//This will return an array of all HTML elements of one parent element
function getChildrenById(x) {
    return document.getElementById(x).children;
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
		}
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
   }


