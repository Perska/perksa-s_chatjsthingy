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
	for(var sect in sectionPos){
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
	}
	delete sects.insertAfter;
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
	var code = syncRequest(baseUrl + "bootstrap.js").replace(/^(\/\*[\s\S]+?\*\/)[\s\S]+?$/, "\1") + "\n";
	for(var sect in sects){
		systemMessage(sect);
		if(sect.toLowerCase() === "insertafter"){
			return;
		}
		var sectCode = sects[sect];
		code += "// SECTION " + sect.toUpperCase() + "\n" + sectCode + "\n";
	}
	return code;
};