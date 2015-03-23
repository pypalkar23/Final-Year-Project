function createroomdom()
{
  document.addEventListener("click", function() {
    var
      el = document.documentElement
    , rfs =
           el.requestFullScreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
    ;
    rfs.call(el);
  });
  var main=document.getElementById("main");
  
  while(main.firstChild)
    main.removeChild(main.firstChild);

  var toolbarspan=document.createElement("span");
  toolbarspan.innerHTML="Join a Room";
  toolbarspan.setAttribute("class","middle intent");

  var toolbar=document.createElement("core-toolbar");
  toolbar.setAttribute("id","top-toolbar");
  toolbar.flex=true;
  toolbar.setAttribute("class","medium-tall");

  var toolbardiv=document.createElement("div");
  toolbardiv.id="header";

  toolbar.appendChild(toolbarspan);
  toolbardiv.appendChild(toolbar);

  var roomform=document.createElement("form");
  roomform.setAttribute("name","roomjoin");
  roomform.id="roomjoin";

  var roominput=document.createElement("paper-input-decorator");
  roominput.floatingLabel=true;
  roominput.setAttribute("label","Room number");
  
  var coreinput=document.createElement("input");
  coreinput.setAttribute("is","core-input");
  coreinput.setAttribute("type","number"); 
  coreinput.setAttribute("name","roominput"); 
  coreinput.setAttribute("maxlength",4);
  coreinput.setAttribute("size",4); 
  
  roominput.appendChild(coreinput);

  var joinbutton=document.createElement("paper-button");
  joinbutton.setAttribute("class","colored");
  joinbutton.setAttribute("role","button");
  joinbutton.setAttribute("raised","true");
  joinbutton.innerHTML="Join Room"; 
  joinbutton.setAttribute("onClick","checkRoom()");

  var error=document.createElement("P");
  error.id="error";

  roomform.appendChild(roominput);
  roomform.appendChild(error);
  roomform.appendChild(joinbutton);
  main.appendChild(toolbardiv);
  main.appendChild(roomform);
}

function checkRoom()
{
  roomno=document.forms["roomjoin"]["roominput"].value;
  if (roomno<1000 && roomno>9999)
    document.getElementById("error").innerHTML="Room no must be a 4 digit value";
  else
     var message={action:"joinroom"};
     sendMessage(message);
}


