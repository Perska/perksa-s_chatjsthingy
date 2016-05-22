var e=[];
function save(){
 globalStorage.setItem("cemote",JSON.stringify(e));
}
e=JSON.parse(globalStorage.getItem("cemote"));
if(e==null){
 e=[];save();
}
[].slice.call(document.querySelectorAll("li")).forEach(function(i){emotereplace(i);});
events.bind("message", function(msg){
 e.forEach(function(n){
  msg.message=msg.message.replace(new RegExp("\\("+n.str+"\\)","g"),'<img style="height:2.2rem;" src="'+n.url+'"/>');
 });
});
function emotereplace(i){
 [].slice.call(i.querySelectorAll("p")).forEach(function(i){
  e.forEach(function(n){
   i.innerHTML=i.innerHTML.replace(new RegExp("\\("+n.str+"\\)","g"),'<img class="emote" src="'+n.url+'"/>');
  });
 });
}
addCommand("cemote",function(param){
 if(param.startsWith(" add ")){
  if(param.length<=5){systemMessage("You must specify a parameter for add in the format\n/cemote add [string]");}
  else{
   var n=param.substring(5,param.length).split(" ")[0];
   var c=param.substring(n.length+6,param.length);
   var flag=false;
   for(var i=0;i<e.length;i++){
    if(e[i].str==n){flag=true;systemMessage("("+param.substring(8,param.length)+") already exists!");break;}
   }
   if(!false){
    e.push({str:n,url:c});
    save();
    systemMessage("("+n+") added! Refresh for the changes to take effect on existing posts");
   }
  }
 }else if(param.startsWith(" remove ")){
  if(param.length<=8){systemMessage("You must specify a parameter for remove in the format\n/cemote remove [string]");}
  else{
   var flag=false;
   for(var i=0;i<e.length;i++){
    if(e[i].str==param.substring(8,param.length)){flag=true;e.splice(i,1);save();systemMessage("("+param.substring(8,param.length)+") removed! Refresh for the changes to take effect on existing posts");break;}
   }
   if(!flag){systemMessage("("+param.substring(8,param.length)+") doesn't exist and therefore couldn't be removed");}
  }
 }else{
  systemMessage("Options are:\n/cemote add [string] [url]\n/cemote remove [string]");
 }
},"Manages custom emotes");
