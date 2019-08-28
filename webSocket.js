/*
/	Bruce Kirwan
/	Web development Assignment A part 1
/	August 2019
/
/	This file contains the javascript for the Web Socket functionality.
/	It also contains a function for the accordion (which expands to reveal more detail on a subject.
/
*/
var wsLink = "wss://echo.websocket.org/";
var output;



console.log('... webSocket.js has loaded ...');

/*
/	function called when DOM content loaded (images and videos may still be
/	in the process of being loaded
*/
window.addEventListener('DOMContentLoaded', function (event) {
    console.log("DOM fully loaded and parsed");
	addMoreEvents();
});

/*
/	Event listeners
*/

function addMoreEvents() {
	accordion();						// add accordion events	
	document.getElementById("socketTest").addEventListener("click", function () {
		init();							// intiiate echo test if "socketTest" button clicked
	});
}

/*
/	accordion function to expand selected item in menu (to give further information).
*/
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
				if (this.id == "wsTest") {			// scroll down to Web Socket test, if this accordion button was clicked
					window.location.href = "#webSocketTest";
				}
				else if (this.id == "hdBtn")		// scroll down to helpdesk description if button clicked
					window.location.href = "#hd";
            }
        });
    }
}

/*
/	point to output of echo test and initiate echo test
*/
function init()
{
	output = document.getElementById("output");
	testWebSocket();
}

/*
/	conduct echo test
*/
function testWebSocket()
{
	websocket = new WebSocket(wsLink);						// link to websocket.org for echo test
	websocket.onopen = function(evt) { onOpen(evt) };		//	on open, send message
	websocket.onclose = function(evt) { onClose(evt) };		// on close, indicate socket closed
	websocket.onmessage = function(evt) { onMessage(evt) };	// display response on receiving message
	websocket.onerror = function(evt) { onError(evt) };		// display error message if error
}

/*
/	function to pick up message from textbox and send to websocket.org
*/
function onOpen(evt)
{
	writeToScreen("CONNECTED");
	var msg = document.getElementById("messageField").innerHTML;
	doSend(msg);
}

/*
/	function to display message on websocket close
*/
function onClose(evt)
{
	writeToScreen("DISCONNECTED");
}

/*
/	function to show response to message received and close websocket
*/
function onMessage(evt)
{
	writeToScreen('<span style="color: green;">RESPONSE: ' + evt.data+'</span>');
	websocket.close();
}

/*
/	function to display error message
*/
function onError(evt)
{
	writeToScreen('<span style="color: red;">ERROR: </span> ' + evt.data);
}

/*
/	function to send websocket message
*/
function doSend(message)
{
	writeToScreen("SENT: " + message);
	websocket.send(message);
}


/*
/	function to output message received below the button
*/
function writeToScreen(message)
{
	var div = document.createElement("div");
	div.style.wordWrap = "break-word";
	div.innerHTML = message;
	output.appendChild(div);
}


  