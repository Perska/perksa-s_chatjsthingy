/*
	Chat Preferences API
	By ShadowCX11, 2016
*/

var ChatPreferences = function(namespace, global){
	// Global is a planned feature for storing preferences in the chatJS.
	// For now, however, it's just good ol' LocalStorage
	this._namespace = "chatjs_" + (namespace || "main") + "";
	
};
ChatPreferences.prototype.set = function(name, val){
	return localStorage.setItem(this._namespace + "-" + name, JSON.stringify(val));
};
ChatPreferences.prototype.get = function(name){
	return localStorage.getItem(this._namespace + "-" + name);
};
ChatPreferences.prototype.list = function(){
	var list = [];
	for(var i = 0; i < localStorage.length; i++){
		var name = localStorage.key(i);
		if(name.indexOf(this._namespace + "-") === 0)
			list.push(name.replace(this._namespace + "-", "");
	};
	return list || null;
};
return ChatPreferences;