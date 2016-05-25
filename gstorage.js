/*
	chatJS Plugin System - GlobalStorage API

	Adds a system for storing data globally that implements the
	Storage interface

	By ShadowCX11, Trinitro21 - 2016
*/

window.globalStorage = {};

var getStorage = function(){
    var data = getChatJS()["globaldata"];
    data = data.replace(/^[\s\S]*?\/\/START\n([\s\S]+?)\/\/END[\s\S]*?/g, "$1");
    data = data.replace(/(^|\n)\/\//g, "\n");
    data = data.trim();
    alert(data);
};

var setStorage = function(obj){
};

Object.defineProperty(globalStorage, "length", {
	get: function(){
		return Object.keys(getStorage()).length;
	}
});

globalStorage.clear = function(){
	return setStorage({});
};
globalStorage.getItem = function(name){
	return getStorage()[name] || null;
};
globalStorage.key = function(index){
	return Object.keys(getStorage())[Number(index)] || null;
};
globalStorage.setItem = function(name, value){
	var g = getStorage();
	g[name] = value + "";
	return setStorage(g);
};
globalStorage.removeItem = function(name){
	var g = getStorage();
	delete g[name];
	return setStorage(g);
};
