setTimeout(function(){
 String.prototype.quote = function(n) {
  var nn=this.split(">>")[n+1];
  return ">>"+nn.substring(0,nn.length-(n+1!=ooc.split(">>",-1).length-1));
 };
 var oocdef=true;
 var oocoptions=JSON.parse(globalStorage.getItem("ooc"));
 if(oocoptions==null){
  oocoptions={oocbot:true,oocname:"outofcon.txt",oocbuttons:false};
 }
 oocbot=oocoptions.oocbot;oocname=oocoptions.oocname;oocbuttons=oocoptions.oocbuttons;
 if(typeof ooc=="undefined"){oocdef=false;ooc="";}
 function oocbotfunc(param){
  var ind;
  var out;
  var len=ooc.split(">>",-1).length-1;
  if(param==" count"){
   out=len+" quotes";
  }else if(param.startsWith(" search ")){
   ind=-1;
   var exiting=false;
   var text=param.substring(" search ".length,param.length);
   var quote;
   do{
    ind++;
    if(ind>=len){
     exiting=true;
     out='"'+text+'" was not found';
    }else{
	 quote=ooc.quote(ind);
     if(new RegExp(text,"ig").test(quote)){
      exiting=true;
      out='"'+text+'" found at quote '+ind+"\n"+quote;
	 }
    }
   }while(!exiting);
  }else{
   if(/ [0-9]+/g.test(param)){
    ind=Number(param.substring(1,param.length));
    ind=(ind>=len?0:ind);
    ind=(ind<0?0:ind);
   }else{
    ind=Math.floor(Math.random()*len);
   }
    out=ooc.quote(ind);
   }
  return out;
 }
 addCommand(oocname,function(param){
  var messageJSON = { "type" : "module", "message" : oocbotfunc(param) };
  displayMessage(messageJSON);
 },"Calls the "+oocname+" bot locally");
 if(oocbuttons){
  window.addquoteapplier=function(messageElement){
   var userstuff=messageElement.querySelector("figure");
   if(userstuff!=null){
    var b=document.createElement("button");
    b.onclick=function(){addquote(this.parentNode.parentNode);};
    b.innerHTML="Add quote to "+oocname;
    userstuff.appendChild(b);
   }
  };
  [].slice.call(document.querySelectorAll("li")).forEach(function(i){addquoteapplier(i);});
  addMessageEvent(function(i){addquoteapplier(i);});
  window.addquote=function(mess){
   var n=mess.querySelector("figcaption").innerHTML+mess.querySelector("user-rank").innerHTML;
   var c="";
   [].slice.call(mess.querySelectorAll("p")).forEach(function(i){
    c+=(c.length>0?"\n":"")+i.innerHTML.replace(/<br(><\/br)?>/g,"\n").replace(/<\/?a[^>]*>/g,"");
   });
   updatejs(n,c);
  };
 }
 addCommand("addquote",function(param){
  var n=param.substring(1,param.length).split(" ")[0];
  var c=param.substring(n.length+2,param.length);
  updatejs(n,c);
 },"Adds a quote to the "+oocname+" bot");
 window.updatejs=function(n,c){
  var js=syncRequest("/query/chatJS");
  js+='\nooc'+(oocdef?'+="\\n':'="')+'>>'+n+'\\n\\\n'+c.replace(/"/g,'\\"').replace(/\n/g,"\\n\\\n")+'";';
  var data = new FormData;
  data.append("chatJS", JSON.stringify(js));
  syncRequest("/query/savesettings", data);
  ooc+=(oocdef?"\n":"")+">>"+n+"\n"+c;
  var messageJSON = { "type" : "module", "message" : "Quote "+(ooc.split(">>",-1).length-2)+" added!\n>>"+n+"\n"+c };
  displayMessage(messageJSON);
 };
 events.bind("message", function(msg){
  if(oocbot){
   if(msg.type=="module"){
    if(msg.module=="pm"){
     if(!msg.message.startsWith(document.querySelector("[data-username]").dataset.username)){
      var a=msg.message.indexOf(oocname);
      if(a>=0){
       var json = { 'type': 'message', 'text': "/pm "+msg.message.split(" ")[0]+" "+oocbotfunc(msg.message.substring(a+oocname.length,msg.message.length)), 'key': auth, 'tag': 'offtopic' };
       Socket.send(JSON.stringify(json));
      }
     }
    }
   }
  }
 });
 addCommand("ooc",function(param){
  if(param.startsWith(" bot ")){
   var set=-1;
   if(param.substring(5,param.length)=="on"){
    set=true;
   }else if(param.substring(5,param.length)=="off"){
    set=false;
   }else{
    systemMessage("Invalid option for bot\nOptions are: on, off");
   }
   if(set!=-1){
    oocbot=set;
    setoption();
    systemMessage(oocname+" bot is now "+(oocbot?"on":"off"));
   }
  }else if(param.startsWith(" name ")){
   if(param.length<=6){
    systemMessage("You must specify a name to rename the bot");
   }else{
    var oldname=oocname;
    oocname=param.substring(6,param.length);
    setoption();
    systemMessage("Bot name changed to "+oocname+"\nThe bot will respond to PMs correctly, but you must refresh for the local function to change from /"+oldname);
   }
  }else if(param.startsWith(" button ")){
   var set=-1;
   if(param.substring(8,param.length)=="on"){
    set=true;
   }else if(param.substring(8,param.length)=="off"){
    set=false;
   }else{
    systemMessage("Invalid option for button\nOptions are: on, off");
   }
   if(set!=-1){
    oocbuttons=set;
    setoption();
    systemMessage(oocname+" buttons are now "+(oocbuttons?"on":"off")+"\nThe changes will be applied when you refresh");
   }
  }else if(param.startsWith(" get ")){
   if(param.substring(5,param.length)=="bot"){systemMessage(oocname+" bot is "+(oocbot?"on":"off"));}
   else if(param.substring(5,param.length)=="name"){systemMessage("Bot name is "+oocname);}
   else if(param.substring(5,param.length)=="button"){systemMessage(oocname+" bot buttons are "+(oocbuttons?"on":"off"));}
   else{systemMessage("Invalid option for get\nOptions are: bot, name, button");}
  }else{
   systemMessage("A parameter must be specified\nOptions are:\n/ooc bot [on/off]\n/ooc name [string]\n/ooc button [on/off]\n/ooc get [bot/name/button]");
  }
 },"Sets or gets options for the "+oocname+" bot");
 function setoption(){
  globalStorage.setItem("ooc",JSON.stringify({oocbot:oocbot,oocname:oocname,oocbuttons:oocbuttons}));
 }
 systemMessage(oocname+" bot plugin has loaded");
},2000);
