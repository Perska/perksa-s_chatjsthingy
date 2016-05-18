function _info(name) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", `${baseUrl}${name}/info.json`);
  xhr.addEventListener("load", function() {
    if(xhr.status == 404) {
      warningMessage("Plugin info not found!");
    } else {
      //we got it baby
      try {
        var json = JSON.parse(xhr.responseText);
      } catch(e) {
        warningMessage(`Parse error: ${e.message}`);
      }
      var message = `${json.name} (${name})
        ${json.description}
        *****
        
        Commands
        =====`;
    }
  });
  xhr.send();
}

commands.push({
  command: "plugininfo"
  callback: arg => {
    var params = quickParamParse(arg);
    switch(params.length) {
      case 0:
        warningMessage("Must pass a plugin name!");
        break;
      case 1:
        _info(params[0]);
        break;
      default:
        warningMessage("Too many args!");
        break;
    }
  },
  description: "Gets information about the named plugin.",
  module: "global"
});
