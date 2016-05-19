/*
	chatJS Plugin System - Main System
	
	This initializes the plugin system, and adds the all important
	functions, like loadPlugin and loadAPI.

	By ShadowCX11, slackerSnail - 2016
*/

// This is used to keep track of loaded plugins and APIs
window.loaded = {
	APIs: {},
	Plugins: {}
};

// Move commands to window...
window.commands = commands;

// This sends a module message (like a system message, but not centered)
window.moduleMessage = function(msg){
	displayMessage({
		"type": "module",
		"module": "chatjs",
		"message": msg
	});
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
	var chatJS = splitIntoSections(syncRequest("/query/chatJS"));
	var pluginList = parseLoads(chatJS);
	var ninList = false;
	if(pluginList.indexOf(name) === -1)
		ninList = true;
	
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
	var init = function(){};
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
		if(ninList){
			pluginList.push(name);
			var data = new FormData;
			data.append("chatJS", JSON.stringify(generateFromSections(generateLoads(chatJS, pluginList))));
			syncRequest("/query/savesettings", data);
		}
	} catch(e){
		if(this.command)
			warningMessage("Error while loading module \"" + name + "\": " + e.toString());
		console.error(e);
	}
};

// This is a new addition: unloadPlugin. This removes the commands
// added by a plugin
window.unloadPlugin = function(name){
	var name = name.trim();
	if(name === "")
		return;
	if(!(name in loaded["Plugins"])){
		if(this.command)
			warningMessage("Plugin \"" + name + "\" not loaded.");
		return;
	}
	var chatJS = splitIntoSections(syncRequest("/query/chatJS"));
	var pluginList = parseLoads(chatJS);
	if(pluginList.indexOf(name) !== -1){
		pluginList.splice(pluginList.indexOf(name), 1);
		var data = new FormData;
		data.append("chatJS", JSON.stringify(generateFromSections(generateLoads(chatJS, pluginList))));
		syncRequest("/query/savesettings", data);
	}
	for(var i = 0; i < commands.length; i++){
		var cmd = commands[i];
		if(cmd.module === name){
			commands.splice(i--, 1)
		};
	}
	delete window.loaded["Plugins"][name];
	if(this.command)
		systemMessage("Module \"" + name + "\" successfully unloaded!");
};

// A useful function added this time is loadAPI. It loads resources from a
// script and returns them.
window.loadAPI = function(name, mn){
	var name = name.trim();
	if(name == null || name === "")
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
	if(code == null || code === "")
		return null;
	cd = `function loadAPI(name){
	var mod = "${mn}";
	loadAPI(name, mod);
};
(function(){
	${code}
	
})();
	alert("hi")`;
	try {
		var ret = eval(cd);
		window.loaded["APIs"][name] = cd;
		return ret;
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
addCommand("unloadplugin", unloadPlugin, "Unloads a plugin");

// A localhelp plugin is very useful
var localHelp = function(args){
	var mod = args.trim();
	var d = "";
	if(mod == null || mod === ""){
		d = "Which plugin would you like help with?\n\n";
		var modList = [];
		commands.forEach(function(cmd){
			if(cmd.module == null)
				return;
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