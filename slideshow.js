	
var currentImg;				// variable containing the image being currently displayed
var imgArray;				// array of all images in the slideshow

console.log('... slideshow.js has loaded ...');

window.addEventListener('DOMContentLoaded', function (event) {
    initSlideshow();
});

/*
/   function to kick off slideshow
*/
function initSlideshow() {
    currentImg = 0;
    imgArray = getChildrenById('slide-img');		// create an array of images in index.html div with id 'slide-img'
    fadeImage(currentImg);							// fade out first image and fade in seconds
    setInterval(function () { plusSlides(1); }, 2000);		// Change image every 2 seconds
}

/*
/	fade out image and fade in next image
*/
function fadeImage(x) {
    for (var i = 0; i < imgArray.length; i++) {
        imgArray[i].style.opacity = 0;
    }
    imgArray[x].style.opacity = 1;
}

/*
/	get next slide 
*/
function plusSlides(x) {
    currentImg = currentImg + x;			// get next image
    if (currentImg == imgArray.length) {	// if this is last image in array....
        currentImg = 0;						// start at first image again
    }
    else if (currentImg < 0) {				// if for some reason, array index is negative
        currentImg = imgArray.length - 1;	// set to last image
    }
    fadeImage(currentImg);					// fade image out and fade in next image
}


//This will return an array of all HTML elements of one parent element
function getChildrenById(x) {
    return document.getElementById(x).children;
}
