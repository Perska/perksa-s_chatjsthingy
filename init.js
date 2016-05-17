/*
	chatJS Plugin System - Main System
	
	This initializes the plugin system, and adds the all important
	functions, like loadPlugin and loadAPI.

	By ShadowCX11, slackerSnail - 2016
*/

// We have an event handler here for message events and such
window.event = new MicroEvent;

// This is used to keep track of loaded plugins and APIs
window.loaded = {
	APIs: {},
	Plugins: {}
};

// This sends a module message (like a system message, but not centered)
window.moduleMessage = function(msg){
	displayMessage({
		"type": "module",
		"module": "chatjs",
		"message": msg
	});
};
// This is an all purpose sync request command. Returns the data

window.syncRequest = function(url, data){
	var x = new XMLHttpRequest;
	if(data == null){
		x.open("GET", url + "?t=" + new Date().getTime(), false);
		x.send();
	} else {
		x.open("POST", url + "?t=" + new Date().getTime(), false);
		x.send(data);
	}
	if(x.status === 200)
		return x.responseText;
	else
		return null;
};

// Here's the star of the show: loadPlugin.

window.loadPlugin = function(name){
	var name = name.trim();
	if(name == null)
		return;
	if(name in loaded["Plugins"]){
		if(this.command)
			warningMessage("Module \"" + name + "\" already loaded");
		return;
	}
	var info = syncRequest(baseUrl + "plugins/" + name + "/info.json");
	if(info == null){
		if(this.command != null)
			warningMessage("Plugin \"" + name + "\" does not exist!");
		return false;
	}
	var info = JSON.parse(info);
	var script = info.script || "init.js";
	var module = name;
	var data = syncRequest(baseUrl + "plugins/" + name + "/" + script);
	var extras = `function addCommand(name, func, desc){
		var mod = "${module}";
		var cmd = {
			"command": name,
			"callback": func,
			"description": desc || "",
			"module": mod
		};
		window.commands.push(cmd);
	};
	function loadAPI(name){
		var mod = "${module}";
		window.loadAPI(name, mod);
	};`;
	var code = `(function(){
	${data}
	if(typeof Socket != null)
		init();
	else
		window.addEventListener("load", init);
})();`;
	try {
		eval(extras + "\n" + code);
		loaded["Plugins"][name] = extras + "\n" + code;
		if(this.command)
			systemMessage("Plugin \"" + name + "\" loaded successfully!");
	} catch(e){
		if(this.command)
			warningMessage("Error while loading module \"" + name + "\": " + e.toString());
		console.error(e);
	}
};

// A useful function added this time is loadAPI. It loads resources from a
// script and returns them.

window.loadAPI = function(name, mn){
	var name = name.trim();
	if(name == null)
		return;
	if(name in window.loaded["APIs"]){
		try {
			return eval(window.loaded["APIs"][name]);
		} catch(e){
			return e;
		}
	}
	var url = baseUrl;
	if(name[0] === "@"){
		name = name.substr(1);
		url += "plugins/" + mn + "/" + name + ".js";
	} else {
		url += "apis/" + name + ".js";
	}
	var code = syncRequest(url);
	if(code == null)
		return null;
	code = `function loadAPI(name){
	var mod = "${mn}";
	loadAPI(name, mod);
};
(function(){
	${code}
	
})();`;
	try {
		return eval(code);
	} catch(e){
		return e;
	}
}

// Now, a simple addCommand function for internal use

var addCommand = function(name, func, desc, mod){
	var cmd = {
		command: name,
		callback: func,
		description: desc,
		module: mod || "global"
	};
	return commands.push(cmd);
}

addCommand("loadplugin", loadPlugin, "Loads a plugin from the system");

// A localhelp plugin is very useful

var localHelp = function(args){
	var mod = args.trim();
	var d = "";
	if(mod == null || mod === ""){
		d = "Which plugin would you like help with?\n\n";
		var modList = [];
		commands.forEach(function(cmd){
			var mod = cmd.module;
			if((mod + "").trim() === "")
				return;
			if(modList.indexOf(mod) === -1)
				modList.push(mod);
		});
		d += modList.join("\n");
		d += "\n\nRerun localhelp command with a plugin name to see commands for that plugin";
	} else {
		d = "Help for " + mod + " plugin:\n\n";
		var cmds = [];
		commands.forEach(function(cmd){
			var m = cmd.module;
			if(m === mod){
				var l = "/" + cmd.command + " => " + cmd.description;
				cmds.push(l);
			}
		});
		if(cmds.length === 0)
			d += "No commands found.";
		else
			d += cmds.join("\n");
	}
	moduleMessage(d);
};
addCommand("localhelp", localHelp, "Gives a list of commands");

setTimeout(() => {
	systemMessage("Init.js loaded successfully");
}, 5000);