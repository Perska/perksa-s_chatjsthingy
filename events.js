/*
	chatJS Plugin System - Events System
	
	This controls the event system, which is a lot nicer then overriding
	displayMessage or sendMessage yourself

	By ShadowCX11 - 2016
*/

// First of all, define the event emitter
window.events = new MicroEvent;

// First, override displayMessage
var oldDispMess = displayMessage;
displayMessage = function(dat){
	events.trigger("message", dat);
	if(dat.type === "cancel"){
		return;
	}
	return oldDispMess(dat);
};

// Now, for sendMessage
var oldSendMess = sendMessage;
sendMessage = function(msg, cmd){
	var m = msg || messageInput.value;
	var d = {
		message: m,
		command: cmd
	}
	events.trigger("send", d);
	return oldSendMessage(d.message, d.command);
};