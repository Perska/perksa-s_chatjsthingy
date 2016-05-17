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
	t.forEach(function(l, ln){
		if(l.indexOf("// SECTION ") === 0){
			var s = /^\/\/ SECTION (.+?)$/.exec(l)[1].toLowerCase();
			sectionPos[s] = ln;
		}
	});
	Object.keys(sectionPos).forEach((sect) => {
		var start = sectionPos[sect] + 1;
		var end = t.length;
		for(var i = start; i < t.length; i++){
			var ln = t[i];
			if(ln.indexOf("// SECTION") === 0){
				end = i - 1;
				break;
			}
		}
		sects[sect] = t.slice(start, end).join("\n");
	});
	moduleMessage(sects.boot);
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
	var code = syncRequest(baseUrl + "bootstrap.js").replace(/^(\/\*[\s\S]+?\*\/)[\s\S]+?$/, "$1") + "\n\n";
	Object.keys(sects).forEach((sect) => {
		if(sect === "insertAfter")
			return;
		var sectCode = sects[sect];
		code += "// SECTION ";
		code += sect.toUpperCase() + "\n";
		code += sectCode.toString() + "\n";
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
	var o = "// Put your loadPlugin's here";
	plugins.forEach(function(name){
		o += "\nloadPlugin(\"" + name + "\");";
	});
	sects["loads"] = o + "\n";
	return sects;
};