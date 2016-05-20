/*
 * Plugin Info
 * by slackerSnail
 * Funcs for plugin information.
 */

function _info(name) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", `${baseUrl}plugins/${name}/info.json?t=${(new Date).getTime()}`);
  xhr.addEventListener("load", () => {
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
        Author: ${json.author}
        Loaded? ${(name in window.loaded["Plugins"]) ? "Yes" : "No"}
        *****
        
        Commands
        =====
        `;
      if(json.commands) {
        json.commands.forEach(cmd => {
          cmd.command = (cmd.command.charAt(0) !== "/") ? `/${cmd.command}` : cmd.command;
          message += `${cmd.command}
          ${cmd.description}
          -----
          `;
        });
      } else {
        message += "This plugin has no commands."
      }
      moduleMessage(message);
    }
  });
  xhr.send();
}


function _listInstalled() {
  const names = Object.keys(window.loaded["Plugins"]).sort();
  if(names.length) {
    let message = "Plugins currently installed:";
    for(let plug of names) {
      message += `\n- ${plug}`;
    }
    moduleMessage(message);
  } else {
    moduleMessage("No plugins installed.");
  }
}


commands.push({
  command: "plugininfo",
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


commands.push({
  command: "myplugins",
  callback: arg => {
    var params = quickParamParse(arg);
    switch(params.length) {
      case 0:
        _listInstalled();
        break;
      default:
        warningMessage("Doesn't accept args!");
        break;
    }
  },
  description: "Lists the plugins you have installed.",
  module: "global"
});
