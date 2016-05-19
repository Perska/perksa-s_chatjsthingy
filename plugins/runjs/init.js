// runjs command plugin
// By ShadowCX11

addCommand("runjs", function(args){
	var c = args.trim();
	if(c.length === 0){
		c = prompt("Code to run?") || "";
	}
	try {
		eval(c);
	} catch(e){
		warningMessage(e.toString() + "\n" + e.stack);
	}
})