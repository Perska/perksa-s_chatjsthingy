// IgnoreSync
// By ShadowCX11

addCommand("useglobal", function(){
	var l = JSON.parse(globalStorage.getItem("ignoreList_sync") || "null");
	if(l == null){
		warningMessage("Whoops, you haven't synced to Global Storage yet!");
		return;
	}
	writeStorage("ignoreList", ignoreList = l);
	systemMessage("Success!");
}, "Uses the synced ignore list from Global Storage");

addCommand("syncglobal", function(){
	globalStorage.setItem("ignoreList_sync". ignoreList);
	systemMessage("Success!");
}, "Syncs the ignore list on the current device to Global Storage");
