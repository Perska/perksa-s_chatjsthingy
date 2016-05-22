/*
	chatJS Plugin System - chatJS Section Modification

	This supplies the functions required for modifying the chatJS

	By ShadowCX11 - 2016
*/

// We use splitIntoSections to split everything into... sections...
window.splitIntoSections = function(code){
	var sects = {};
	var i = 0;
	var t = code.split("\n");
	var sectionPos = {};
	sectionPos["preboot"]=0;
	t.forEach(function(l, ln){
		if(l.indexOf("// SECTION ") === 0){
			var s = /^\/\/ SECTION (.+?)$/.exec(l)[1].toLowerCase();
			sectionPos[s] = ln;
		}
	});
	Object.keys(sectionPos).forEach((sect) => {
		var start = sectionPos[sect] + (sect!="preboot");
		var end = t.length;
		for(var i = start; i < t.length; i++){
			var ln = t[i];
			if(ln.indexOf("// SECTION") === 0){
				end = i;
				break;
			}
		}
		sects[sect] = t.slice(start, end).join("\n").trim();
	});
	return sects;
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

// This converts an object of sections back into JS compatible with chatJS
window.generateFromSections = function(sects){
	var code = "";
	Object.keys(sects).forEach((sect) => {
		if(sect[0] === "-")
			return; // This is obviously a leftover from copying over the chatJS
		var sectCode = sects[sect];
		if(sect!="preboot"){code += "// SECTION ";
		code += sect.toUpperCase() + "\n";}
		code += sectCode.toString() + "\n\n";
	});
	return code;
};

// This parses a list of all the loadPlugin occurences in the LOADS section
window.parseLoads = function(sects){
	var lines = sects["loads"].split("\n");
	var list = [];
	lines.forEach((line) => {
		var re = /^\s*loadPlugin\(\s*\"(.+?)\"\s*\).+?$/;
		if(!re.test(line)){
			return;
		}
		list.push(re.exec(line)[1]);
	});
	return list;
};

// This regenerates the loadPlugin instances into the LOADS section
window.generateLoads = function(sects, plugins){
	var o = "// Put your loadPlugins here";
	plugins.forEach(function(name){
		o += "\nloadPlugin(\"" + name + "\");";
	});
	sects["loads"] = o;
	return sects;
};

// This returns the current chatJS, split into sections
window.getChatJS = function(){
	return splitIntoSections(syncRequest("/query/chatJS"));
};

// This regenerates the chatJS and uploads it
window.uploadChatJS = function(sects){
	var fd = new FormData;
	fd.append("chatJS", JSON.stringify(generateFromSections(sects)));
	return JSON.parse(syncRequest("/query/savesettings", fd)).result;
};
