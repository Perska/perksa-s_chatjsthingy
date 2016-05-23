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
      var lname = json.name ? json.name : "No name given.";
      var desc = json.desc ? json.desc : "No description given.";
      var auth = json.author ? json.author : "None given.";
      
      if(auth instanceof Array) {
        let temp = "Authors: "
        auth.forEach((au, i, a) => {
          temp += au;
          if(i != a.length - 1) {temp += ", ";}
        });
        auth = temp;
      } else {
        auth = `Author: ${json.author}`;
      }
      
      var message = `${lname} (${name})\n${desc}\n${auth}\nLoaded? ${(name in window.loaded["Plugins"]) ? "Yes" : "No"}\n*****\n\nCommands\n=====\n`;
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
    names.forEach(plug => {
      message += `\n- ${plug}`;
    });
    moduleMessage(message);
  } else {
    moduleMessage("No plugins installed.");
  }
}

function _list() {
  
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
