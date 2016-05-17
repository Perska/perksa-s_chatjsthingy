/*
	chatJS Plugin System - Bootstrap Updater
	
	Updates the bootstrap.js automatically, without much user intervention
	
	By ShadowCX11 - 2016
*/

// This is the URL to the version file
var versionFile = baseUrl + "VERSION";

// This is the /update command. Pretty basic.
var updateCmd = function(){
	// First, download the bootstrap
	var bootstrap = splitIntoSections(syncRequest(baseUrl + "bootstrap.js"))["boot"];
	
	// Now, we download the user's chatJS, split it into sections,
	// and replace the boot section with the bootstrap
	var chatJS = splitIntoSections(syncRequest("/query/chatJS"));
	chatJS["boot"] = bootstrap;
	
	// Finally, save the new chatJS
	var data = new FormData;
	data.append("chatJS", JSON.stringify(generateFromSections(chatJS)));
	syncRequest("/query/savesettings", data);
	moduleMessage("Update successful! Refresh to complete the update.");
};

// This warns about an update
var updateWarn = function(cur, lat){
	warningMessage("There is an update to the chatJS plugin system bootstrap.\nTo update, either copy the contents of <a href=\"" + baseUrl + "bootstrap.js\">bootstrap.js</a> to your chatJS or run /update (which does the update for you, keeping the important stuff intact).\n\nCurrent version: " + ver + "\nLatest version: " + lat);
	commands.push({
		command: "update",
		callback: updateCmd,
		description: "Updates the chatJS plugin system bootstrap",
		module: "global"
	});
};

// Here's the logic for checking if there's an update
var latest = syncRequest(versionFile);

var ver = version.split(".");
var lat =  latest.split(".");

var verMajor = parseInt(ver[0]);
var verMinor = parseInt(ver[1]);
var verPatch = parseInt(ver[2]);

var latMajor = parseInt(lat[0]);
var latMinor = parseInt(lat[1]);
var verPatch = parseInt(lat[2]);

if(verMajor < latMajor){
	updateWarn(version, latest);
} else if(verMajor === latMajor){
	if(verMinor < latMinor){
		updateWarn(version, latest);
	} else if(verMinor === latMinor){
		if(verPatch < latPatch){
			updateWarn(version, latest);
		}
	}
}