var init = function(){
	systemMessage("Yay!");
};
addCommand("test", msg => {alert(msg);}, "Does stuff");