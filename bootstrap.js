/*
	chatJS Plugin System - Bootstrap

	Copy this to your chatJS
	Do not remove anything that starts with // SECTION, those are used for
	updates and other features

	By ShadowCX11, slackerSnail - 2016
*/

// SECTION BOOT
// Recommended not to put arbitary code here, as it'll be wiped during
// a bootstrap update
var version = "2.1.0",
	baseUrl = "http://sbs-chatjs.github.io/",
	x = new XMLHttpRequest;

x.open("GET", baseUrl + "required.json?t=" + new Date().getTime(), false);
x.send();
var required = JSON.parse(x.responseText);
required.forEach(function(name){
	var x = new XMLHttpRequest;
	x.open("GET", baseUrl + name + "?t=" + new Date().getTime(), false);
	x.send();
	eval(x.responseText);
});

// SECTION LOADS
// Put your loadPlugin statements here
// Don't put any other sorts of code here

// SECTION GLOBALDATA
// This section stores the data added via ChatPrefs, which is stored as JSON.
// Not a good idea to put actual code here...
/*START
{}
END*/

// SECTION -RESERVED
// This section is obsolete, as the new sectioning system makes everything easier