function createroomdom()
{

  var main=document.getElementById("main");
  while(main.firstChild)
  {
    //clears the main division before appending anything
    main.removeChild(main.firstChild);
  }
  var body=document.body;
  
  //createform
  var roomform=document.createElement("form");
  roomform.setAttribute("name","roominput");
  roomform.id="roomform";

  //paper-toolbar
  var toolbar=document.createElement("core-toolbar");
  toolbar.setAttribute("id","top-toolbar");
  toolbar.setAttribute("class","medium-tall");
    
  /*var toolbarbutton=document.createElement("core-icon-button");
  toolbarbutton.setAttribute("icon","arrow-back");
  //toolbarbutton.setAttribute("on-tap","");*/
  
  //text inside paper toolbar
  var toolbarspan=document.createElement("span");
  toolbarspan.innerHTML="Create a Room";
  toolbarspan.setAttribute("class","middle intent");
  

  var toolbardiv=document.createElement("div");
  toolbardiv.id="header";

  var bodydiv=document.createElement("div");
  bodydiv.id="bodydiv";


  //toolbar.appendChild(toolbarbutton);
  toolbar.appendChild(toolbarspan);
  toolbardiv.appendChild(toolbar);

  var inputdecorator=document.createElement("paper-input-decorator");
  inputdecorator.setAttribute("label","Room number");
  inputdecorator.floatingLabel=true;

  //input field
  //disabled,shows a 4-digit random number 
  var roomno=document.createElement("input");
  roomno.setAttribute("is","core-input");
  roomno.setAttribute("type","number");
  roomno.setAttribute("name","roomno");
  roomno.setAttribute("readOnly","true");
  roomno.setAttribute("required","true");
  roomno.setAttribute("id","roomno");

  //button to generate 4 digit random number
  var genbutton=document.createElement("paper-button");
  genbutton.setAttribute("class","colored"); 
  genbutton.setAttribute("role","button");
  genbutton.setAttribute("raised","true");
  genbutton.setAttribute("name","generateroomno");
  genbutton.setAttribute("onClick","generateRoomNo()");
  genbutton.id="generateroombutton";
  genbutton.innerHTML="Generate Room";

  //button to create a room on server.
  var roombutton=document.createElement("paper-button");
  roombutton.setAttribute("class","colored");
  roombutton.setAttribute("role","button");
  roombutton.setAttribute("raised","true");
  roombutton.setAttribute("name","createroom");
  roombutton.setAttribute("onClick","createRoom()");
  roombutton.id="submitroombutton";
  roombutton.innerHTML="Create Room";

  //space for error
  var error=document.createElement("P");
  var newLine=document.createElement("br");
  error.id="error";
  inputdecorator.appendChild(roomno);
  roomform.appendChild(inputdecorator);
  roomform.appendChild(genbutton);
  roomform.appendChild(roombutton);
  bodydiv.appendChild(roomform);
  roomform.appendChild(error);
  main.appendChild(toolbardiv);
  main.appendChild(bodydiv);
}

function generateRoomNo()
{
  //generates 4 digit random number
  var roomno=0;
  document.getElementById("roomno").focus();
  //generates 4 digit random no
  for(var i=0;i<4;i++)
    roomno+=Math.floor(Math.random()*9+1)*Math.pow(10,i);
  document.getElementById("roomno").value=roomno;
  document.getElementById("error").style.display="none";
}

function showRoomDom(message)
{

  var main=document.getElementById("main");
  while(main.firstChild)
  {
    main.removeChild(main.firstChild);
  }
  
  var toolbarspan=document.createElement("span");
  toolbarspan.innerHTML="Join a Room";
  toolbarspan.setAttribute("class","middle intent");
  
  var toolbar=document.createElement("core-toolbar");
  toolbar.setAttribute("id","top-toolbar");
  toolbar.setAttribute("class","medium-tall");
  
  var toolbardiv=document.createElement("div");
  toolbardiv.id="header";

  toolbar.appendChild(toolbarspan);
  toolbardiv.appendChild(toolbar);

  var bodydiv=document.createElement("div");
  bodydiv.id="bodydiv";

  
  var roomno=document.createElement("p");
  roomno.id="textroomno";
  roomno.innerHTML=message;
 
  var gentext=document.createElement("p");
  gentext.id="roomnotext"
  gentext.innerHTML="Enter this number on the mobile device's textbox and click on the \"Join Room\" button";

  
  var roombutton=document.createElement("paper-button");
  roombutton.setAttribute("class","colored");
  roombutton.setAttribute("role","button");
  roombutton.setAttribute("raised","true");
  roombutton.setAttribute("name","createroom");
  roombutton.setAttribute("onClick","createroomdom()");
  roombutton.id="backbutton";
  roombutton.innerHTML="Create another Room";
  
  var spinnerdiv=document.createElement("div");
  spinnerdiv.id="spinner-div";

  var spinnertext=document.createElement("p");
  spinnertext.id="spinnertext";
  spinnertext.innerHTML="Waiting for other peer to connect";

  var spinner=document.createElement("paper-spinner");
  spinner.id="spinner";
  spinner.active=true;

  spinnerdiv.appendChild(spinnertext);
  spinnerdiv.appendChild(spinner)

  main.appendChild(toolbardiv);
  bodydiv.appendChild(roomno);
  bodydiv.appendChild(gentext);
  bodydiv.appendChild(spinnerdiv);
  bodydiv.appendChild(roombutton);
  main.appendChild(bodydiv);
}

function createRoom()
{
  roomno=document.getElementById("roomno").value;
  
  if(roomno.length===0)
  {
    document.getElementById("error").innerHTML="Please generate a room number first";
  }
  else
  {
    var msg={action:"createroom"};
    JSON.stringify(msg);
    sendMessage(msg);//replace this with send message
    
  }
}

function changeinfo()
{
  var spinnerdiv=document.getElementById("spinner-div");
  var spinnertext=document.getElementById("spinnertext");
  spinnertext.innerHTML="Connected";
  spinnertext.style.color="green";
  var spinner=document.getElementById("spinner");

  var playbutton=document.createElement("paper-button");
  playbutton.setAttribute("class","colored");
  playbutton.setAttribute("role","button");
  playbutton.setAttribute("raised","true");
  playbutton.setAttribute("name","playbutton");
  playbutton.setAttribute("id","playbutton");
  playbutton.setAttribute("onClick","load_script()");
  playbutton.id="playbutton";
  playbutton.innerHTML="Let's Play";

  spinnerdiv.replaceChild(playbutton,spinner);


}

function load_script()
{
  game_init();
}