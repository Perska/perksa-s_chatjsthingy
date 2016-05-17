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
	return sects;
};