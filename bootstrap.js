/*
	chatJS Plugin System - Bootstrap

	Copy this to your chatJS
	Do not remove anything that starts with // SECTION, those are used for
	updates and other features

	By ShadowCX11, slackerSnail - 2016
*/

// SECTION BOOT
var version = "2.0.0",
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
// Put your /loadplugin's here


// SECTION RESERVED
// This area is reserved for the future. Extra sections, perhaps
