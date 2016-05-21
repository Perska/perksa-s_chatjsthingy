/*
	Chat Preferences API
	By ShadowCX11, 2016
*/

var ChatPreferences = function(namespace, global){
	if(namespace.indexOf("-") !== -1)
		throw new Error("Namespaces cannot contain \"-\"")
	// Global is a planned feature for storing preferences in the chatJS.
	// For now, however, it's just good ol' LocalStorage
	this._namespace = "chatjs_" + (namespace || "global").trim() + "";
	this._store = (global ? globalStorage : localStorage);
};
ChatPreferences.prototype.set = function(name, val){
	return this._store.setItem(this._namespace + "-" + name, JSON.stringify(val));
};
ChatPreferences.prototype.get = function(name){
	return JSON.parse(this._store.getItem(this._namespace + "-" + name) || "null");
};
ChatPreferences.prototype.list = function(){
	var list = [];
	for(var i = 0; i < this._store.length; i++){
		var name = this._store.key(i);
		if(name.indexOf(this._namespace + "-") === 0)
			list.push(name.replace(this._namespace + "-", ""));
	};
	return list || null;
};
ChatPreferences.prototype.exists = function(name){
	return this._store.getItem(this._namespace + "-" + name) != null ? true : false;
};

return ChatPreferences;