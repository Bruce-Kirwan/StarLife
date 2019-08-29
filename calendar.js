/*
/	Author: Bruce Kirwan
/	Web development Assignment A part 1
/	August 2019
/
/	This file contains the javascript for the calendar/scheduling function of 
/	my website on the Availability page (availability.html)
/
*/



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
var times = ["6.00am","6.30am","7.00am","7.30am","8.00am","8.30am","9.00am","9.30am","10.00am","10.30am","11.00am","11.30am","12 noon","12.30pm","1.00pm","1.30pm",
	"2.00pm","2.30pm","3.00pm","3.30pm","4.00pm","4.30pm","5.00pm","5.30pm","6.00pm","6.30pm","7.00pm","7.30pm","8.00pm","8.30pm","9.00pm","9.30pm","10.00pm","10.30pm"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var displayingDay = false;
var jsonPresent = false;
var jsonNotFound = false;
console.log('... site.js has loaded ...');

var removeCanvas = true;		// remove canvas when displaying schedule for one day
var narrowView = window.matchMedia("(max-width: 600px)")
if (narrowView.matches) 		// keep canvas for smaller widths
	removeCanvas = false;

var jsonData = null;

/*
/	function to copy data from file 'availability.json' on my github account, to the variable jsonData
*/
function fetchJsonDataFile() {		
	console.log("About to fetch JSON data file");
	$.ajax({
		url: 'https://raw.githubusercontent.com/Bruce-Kirwan/StarLife/master/availability.json',
		dataType: 'json',
		success: function( data ) {
			jsonData = data; 
			if (jsonData==null)
				jsonNotFound = true;
			else
				jsonPresent = true;
			console.log(jsonData);
			console.log('above is jsonData');
			var jsString = JSON.stringify(jsonData);
			console.log("jsString is:"+jsString);
			
			try {
				localStorage.setItem('StarLifeAvailability',jsString);			// store json availability string in local storage
			} catch (e) {
				console.log(e);											// output message to console if error
			}
			
			console.log('stored availability in StarLifeAvailability');
		},
		error: function( data ) {
			console.log("error getting availability.json");
			var jsString = "";
			try {
				jsString = localStorage.getItem('StarLifeAvailability');			// try to retrieve json availability data from local storage
			} catch (e) {
				console.log(e);	// output message to console if error
			}
			console.log("jsString is:"+jsString);
			jsonData = JSON.parse(jsString);
			console.log("tried to get item from localStorage");
			console.log(jsonData);
			if (jsonData=="") {
				jsonPresent = false;
				jsonNotFound = true;
			}
			else
				jsonPresent = true;
		}
	});
}

window.addEventListener('DOMContentLoaded', function (event) {
    console.log("DOM fully loaded and parsed");
	oneYearFromToday = oneYearFromToday.setYear(oneYearFromToday.getFullYear()+1);		// get date exactly one year from today
	document.getElementById("closebtn").style.display = "none";
	initialiseCalendar();
	fetchJsonDataFile();
    addMoreEvents();
});

function addMoreEvents() {
	document.getElementById("month").onclick = function(e) {
		e = e || event
		var target = e.target || e.srcElement
		// variable target has your clicked element
		if (target.nodeName == "TD") {
			console.log("selectYear is "+selectYear);
			console.log("selectMonth is "+selectMonth);
			console.log("target.innerHTML is "+target.innerHTML);
			var dayNum = parseInt(target.innerHTML, 10);
			displayDate = new Date(selectYear + "-" + twoDigit(selectMonth+1) + "-" + twoDigit(dayNum));
			console.log("****************   displayDate is " + displayDate);
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
	/*
	/	create a table of the schedule
	*/
	$("#day").empty();						// first clear any existing rows from day table
	
	if (removeCanvas)		// remove the canvas, unless we are in mobile view
		document.getElementById("canvas").style.display = "none";
	document.getElementById("color-fade").style.display = "none";
	document.getElementById("year").innerHTML = selectDay + " " + months[selectMonth];
	var createSchedule = document.getElementById("day");
	createSchedule.style.display = "block";
	var schedRow;
	if (jsonPresent) {
		for (var i = 0, len = times.length; i < len; i++) {
			schedRow = createSchedule.insertRow();
			schedRow.innerHTML="<th>" + times[i] + "</th><td>FREE</td>";
		}	
		displayingDay = true;
	} else {
		console.log("in exception coding...");
		schedRow = createSchedule.insertRow();
		if (jsonNotFound) 
			schedRow.innerHTML = "<td><h3>Unable to retrieve schedule of bookings for Star Life.</h3>-</td><td></td>";
		else {
			schedRow.innerHTML = "<td><h3>Schedule of bookings not loaded to this website yet.</h3> Please try again later.</td><td></td>";
		}
	}
	/*
	/   now, display button to return to the month
	*/
	document.getElementById("returnToMonth").innerHTML = "return to month";
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
	console.log("displayDate is " + displayDate);
	showBooked(displayDate);
	document.body.scrollTop = document.documentElement.scrollTop = 0;	// scroll to very top of page
}

function showBooked(inpDate) {
	console.log("input Date is " + inpDate);
	inpDate.setHours(12);			// make sure time is 12 noon so that next line won't decrement by one day
	console.log("input Date is " + inpDate);
	searchDate = inpDate.toISOString().substring(0,10);			// just get the first 10 characters (we do not need the time portion of the date)
	console.log("searchDate is "+searchDate);
	$.each(jsonData, function(key, value) {
        if (key == searchDate) {
			var time = 0;
			var count = 1;
			console.log('date is '+key);
			$.each(value, function(key, value) {
				$.each(value, function(key,value) {
					if (key=='time')
						time = value;
					else (key = 'halfHours')
						count = value;
				});
				console.log('time is '+time+', count is '+count);
				for (i=0; i<count; i++) {
					var x = document.getElementById("day").rows[time];
					x.style.backgroundColor = 'rgb(255,153,153)';
					//document.getElementById("day").rows[time].style.background-color = 'pink';		// change colour of row to pink
					//var x = document.getElementById("day").rows[time].cells;
					//x[0].innerHTML = "Booked";									// change text of cell to Booked
					x.cells[1].innerHTML = "Booked";								// change text from FREE to Booked
					time++;
				}
			});
		return false; // stops the loop
        }
	});
}

/*
/		function to convert integer month or day to text value for use in creating a new Date object
*/
function twoDigit(inpNum) {
	var textNum = "";					// variable containing the return value
	if (inpNum > 9)						// if two digit month....
		textNum += inpNum;				// simply return the text value of the month
	else
		textNum = "0" + inpNum;			//otherwise, add a 0 before the month
	return textNum;
}

function initialiseCalendar() { 
	console.log("in initialiseCalendar..............");
	console.log("today is "+today);
	console.log(today);
	console.log("selectDate is "+selectDate);
	console.log(selectDate);
	document.getElementById("canvas").style.display = "block";
	document.getElementById("color-fade").style.display = "block";
	selectMonth = selectDate.getMonth();
	console.log("selectDate.getMonth() is "+ selectMonth);
	selectYear = selectDate.getFullYear();
	console.log("selectDate.getFullYear() is "+ selectYear);
	var startDay = 1;						// default show from 1st of month
	if (selectDate < today) 
		selectDate = today;
	console.log("today is "+today);
	console.log(today);
	console.log("selectDate is "+selectDate);
	console.log(selectDate);
	selectDay = selectDate.getDate();
	console.log("selectDate.getDate() is "+ selectDay);
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
	var dateText = selectYear + "-" + twoDigit(selectMonth+1) + "-01";
	console.log("dateText is "+dateText);
    //firstOfMonth = new Date(selectYear+"-"+(selectMonth+1)+"-01");
	firstOfMonth = new Date("2019-08-01");
	console.log("firstOfMonth is "+ firstOfMonth);
	firstOfMonth=new Date(selectYear + "-" +  twoDigit(selectMonth+1) + "-01");	// get Date object for the first day of the current month
	console.log("firstOfMonth is "+ firstOfMonth)
	console.log(firstOfMonth);
	if (firstOfMonth < today) 				// if first of month is before current date (today)
		startDay = currentDay;				// then do not show days before current date (today)
	var firstDayOfMonth = firstOfMonth.getDay();
	var selectDay = firstOfMonth.getDate();
	console.log("selectDay is " + selectDay);
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
	
	selectDate = new Date(selectYear+"-"+twoDigit(selectMonth+1)+"-"+selectDay);
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



