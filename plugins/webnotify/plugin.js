/*
	WebNotify Plugin
	I hope she made lotsa spaghetti!
	
	By ShadowCX11, 2016
*/

var ChatPrefs = loadAPI("chatprefs");
if(ChatPrefs == null){
	return warningMessage("ChatPrefs, a required API, did not load successfully.");
}

var prefs = new ChatPrefs("webnotify");
if(!prefs.exists("when") || !prefs.exists("altnames")){
	prefs.set("when", 0);
	prefs.set("altnames", []);
}

var when     = prefs.get("when"),
	altnames = prefs.get("altnames"),
	away     = false;

window.addEventListener("blur", function(){
	away = true;
});

window.addEventListener("focus", function(){
	away = false
});


var checkOkay = function(message){
	if(!away)
		return;
	switch(when){
		case 0:
			return false;
			break;
		case 1:
			return true;
			break;
		case 2:
			if(new RegExp(username, "gi").test(message))
				return true;
			for(var i = 0; i < altnames.length; i++){
				var n = new RegExp(altnames[i], "gi");
				if(n.test(message))
					return true;
			}
			return false;
			break;
		case 3:
			if(new RegExp("@" + username, "gi").test(message))
				return true;
			else
				return false;
		default:
			return false;
	}
	// Should never get here, unless someone's messing with my stuff...
	// So we fix it.
	when = 0;
	prefs.set("when", 0);
	return false;
};
var userIgnored = function(uid){
	return ignoreList.indexOf(uid) !== -1 ? true : false;
};
var notify = function(title, message, icon){
	var n = new Notification(title, {
		body: message,
		icon: icon
	});
	setTimeout(n.close.bind(n), 3000);
	return n;
};
var onmsg = function(msg){
	if(msg.type === "deleted" || userIgnored(msg.uid) || !checkOkay(msg.message))
		return
	var name = msg.username + msg.stars, message = msg.message, icon = baseUrl + "resources/webnotify/";
	switch(msg.type){
		case "system":
			icon += "system.png";
			name = "[System]";
			break;
		case "module":
			icon += msg.module + ".png";
			switch(msg.module){
				case "global":
				case "debug":
				case "statistics":
					name = "[Info]";
					break;
				case "fun":
					name = "[/me]";
					break;
				case "coin":
					name = "[Coins]";
					break;
				case "polls":
					name = "[Polls]";
					break;
				case "cgame":
					name = "[Collection Game]";
					break;
				case "miner":
					name = "[Miner]";
					break;
				default:
					name = "[Module \"" + msg.module + "\"]";
			}
			break;
		case "message":
			name = msg.username;
			icon = msg.avatar;
			break;
		case "warning":
			name = "[Warning]"
			icon += "warning.png";
			break;
		default:
			return;
	}
	return notify(name, message, icon);
};
var notifyAlias = function(a){
	var args = a.trim().split(" ");
	switch(args.length){
		case 2:
			switch(args[0]){
				case "add":
					if(altnames.indexOf(args[1]) !== -1)
						warningMessage("This alternate name has already been added!");
					else {
						altnames.push(args[1]);
						prefs.set("altnames", altnames);
						moduleMessage("Added alternate name " + args[1]);
					}
					break;
				case "remove":
				case "delete":
					if(altnames.indexOf(args[1]) === -1){
						warningMessage("This alternate name hasn't been added yet!");
					} else {
						altnames.splice(altnames.indexOf(args[1]), 1);
						prefs.set("altnames", altnames);
						moduleMessage("Removed alternate name " + args[1]);
					}
					break;
				default:
					warningMessage("Action \"" + arg[0] + "\" not recognized");
			}
			break;
		case 1:
			if(args[1] === "list"){
				moduleMessage("List of alternate names [" + altnames.length + "]:\n\n" + altnames.join("\n"));
			}
			break;
		default:
			warningMessage("Not enough arguments. Possible actions are: add [name], remove [name], delete [name], list");
	}
	return;
};
var notifyPrefs = function(arg){
	var arg = arg.trim();
	if(arg === ""){
		return warningMessage("No choice provided. Possibilities are: off, always, name, mention");
	}
	switch(arg){
		case "off":
			when = 0;
			systemMessage("Notifications turned off.");
			break;
		case "always":
			when = 1;
			systemMessage("Notifications will now be shown when the page is in the background and a message is recieved.");
			break;
		case "name":
			when = 2;
			systemMessage("Notifications will now be shown when the page is in the background and a message is recieved containing one of these names:\n" + [username].concat(altnames).join(", ") + ".");
			break;
		case "mention":
			when = 3;
			systemMessage("Notifications will now be shown when the page is in the background and a message is recieved containing @" + username + ".");
			break;
		default:
			warningMessage("Unknown option.");
			break;
	};
	prefs.set("when", when);
};

var init = function(){
	events.bind("message", onmsg);
	addCommand("notify", notifyPrefs, "Change when a notification is shown");
	addCommand("notifyalias", notifyAlias, "Add/remove an alias for /notify name");
};