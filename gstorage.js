/*
	chatJS Plugin System - GlobalStorage API

	Adds a system for storing data globally that implements the
	Storage interface

	By ShadowCX11, Trinitro21 - 2016
*/

window.globalStorage = {};

var getStorage = function(){
	var data = getChatJS()["globaldata"];
	var d = /^[\s\S]*?\/\/START([\s\S]+)\n\/\/END/i.exec(data)[1].replace(/\n\/\//g, "\n");
	console.log(d);
	return JSON.parse(d.trim());
};

var setStorage = function(obj){
	var d = JSON.stringify(obj, null, "\t").replace(/\n/g, "\n//");
	var chatJS = getChatJS();
	chatJS["globaldata"] = "//START\n" + d + "\n//END";
	return uploadChatJS(chatJS);
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
	g[name] = value;
	return setStorage(g);
};
globalStorage.removeItem = function(name){
	var g = getStorage();
	delete g[name];
	return setStorage(g);
};
