initiator=false;
isstarted=false;
user_id=document.getElementById("user-id").innerHTML;
token=document.getElementById("token").innerHTML;
console.log(token);

//configuration of servers
config={
			'iceServers':[
        					{
            					"url":"stun:numb.viagenie.ca",
            					"credential": "krutikamandarvarun",
            					"username": "beproject119"
       						},
        					{
        						"url":"stun:stun.l.google.com:19302"
        					}
        		 		]
		  };

//connection configuration
connection = { 
    'optional': 
        [{'DtlsSrtpKeyAgreement': true}] 
};

//constraints on Peer Connection
sdpConstraints = {'mandatory':
  {
    'OfferToReceiveAudio': false,
    'OfferToReceiveVideo': false
  }
};

function del_user()
{
  sendMessage(
    {
      msg:"delete",
      user:user_id
    });
}

//send Message To Server
function sendMessage(msg){
  var JSONmsg=JSON.stringify(msg);
  console.log("JSON msg sent "+JSONmsg);
  path="/message?u="+user_id+"&r="+roomno;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', path, true);
  xhr.send(JSONmsg);
}

//process signalling messages from server
function processSignalingMessage(message) {
    msg=JSON.parse(message.data);
    console.log(msg);
    if(msg=="room created")
      showRoomDom(roomno);

    if(msg.type==='offer')
      {
        console.log("offer received");
        if(!initiator && !isstarted)
        {
          isstarted=true;
          maybestart();
          console.log("maybestart called");
          peer.setRemoteDescription(new RTCSessionDescription(msg));
          console.log("Remote Description Set at Desktop side");
          doAnswer();
        }   
      }
    /**if(msg.type==='answer')
      {
        console.log("Answer received");
        if(initiator)
        peer.setRemoteDescription(new RTCSessionDescription(msg));
        console.log("Remote Description Set");    
      }*/
    
    else if (msg.type === 'candidate' && isstarted) {
    candidate = new RTCIceCandidate({sdpMLineIndex:msg.label,
                                         candidate:msg.candidate});
    peer.addIceCandidate(candidate);
  }
}

//gets fired when signalling channel opens
function onChannelOpened()
{
  console.log("channel opened");
}

//gets fired when message receives from signalling channel
function onChannelMessage(message)
{
  console.log("channel message arrived");
  processSignalingMessage(message);
}

//signalling channel error callback
function onChannelError()
{
  console.log("channel error");
}

//signalling channel closed callback
function onChannelClosed()
{
  console.log("channel closed");
}

function onIceCandidate(event)
{
  if (event.candidate) {
      sendMessage({type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate});
    } else {
      console.log("End of candidates.");
    }
}
//Create client to Server channel;
function openChannel()
{
channel=new goog.appengine.Channel(token);
console.log("Opening channel.");
  var handler = {
    'onopen': onChannelOpened,
    'onmessage': onChannelMessage,
    'onerror': onChannelError,
    'onclose': onChannelClosed
  };
  socket = channel.open(handler);
}

function processIce(iceCandidate){
  peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
}

dataChannelOptions = {
  ordered: false, // do not guarantee order
  maxRetransmitTime: 3000, // in milliseconds
};

function onDataChannel(event)
{
  dataChannel= event.channel;
  dataChannel.onerror = function (error) {
  console.log("Data Channel Error:", error);
};

dataChannel.onmessage = function (event) {
  console.log("Got Data Channel Message:", event.data);
};

dataChannel.onopen = function () {
  console.log("--Datachannel opened----");
};

dataChannel.onclose = function () {
  console.log("The Data Channel is Closed");
  closeconnections();
};

}

/*function createDataChannel()
{
  dataChannel =
  peer.createDataChannel("abcd", dataChannelOptions);

dataChannel.onerror = function (error) {
  console.log("Data Channel Error:", error);
};

dataChannel.onmessage = function (event) {
  console.log("Got Data Channel Message:", event.data);
};

dataChannel.onopen = function () {
  console.log("--Datachannel opened----");
};

dataChannel.onclose = function () {
  console.log("The Data Channel is Closed");
};
}*/

function maybestart()
{
    peer=new webkitRTCPeerConnection(config,connection);
    console.log("RTC created");
    peer.onicecandidate=onIceCandidate; 
    peer.ondatachannel=onDataChannel; 
      
}


function setLocalandSendMessage(description)
{

   peer.setLocalDescription(new RTCSessionDescription(description));
   sendMessage(description);
   console.log(description);
     
}

function doCall()
{
    console.log("Sending offer to peer.");
    peer.createOffer(setLocalandSendMessage,function(){console.log("error");},sdpConstraints);
}

function doAnswer()
{   
    console.log("Sending answer to peer.");
    peer.createAnswer(setLocalandSendMessage,function(){console.log("error");},sdpConstraints);
}

openChannel();

function send()
{
  dataChannel.send("Desktop to Mobile");
}

function createroomdom()
{
  var main=document.getElementById("main");
  while(main.firstChild)
  {
    main.removeChild(main.firstChild);
  }
  var body=document.getElementsByTagName("body")[0];
  
  var roomform=document.createElement("form");
  roomform.setAttribute("name","roominput");
  roomform.id="roomform";

  var roomno=document.createElement("input");
  roomno.setAttribute("type","number");
  roomno.setAttribute("name","roomno");
  roomno.setAttribute("placeholder","Room Number");
  roomno.setAttribute("required","true");
  roomno.setAttribute("readOnly","true");

  var genbutton=document.createElement("input");
  genbutton.setAttribute("type","button"); 
  genbutton.setAttribute("value","Generate");
  genbutton.setAttribute("name","generateroomno");
  genbutton.setAttribute("onClick","generateRoomNo()");
  genbutton.id="generateroombutton";

  var roombutton=document.createElement("input");
  roombutton.setAttribute("type","button");
  roombutton.setAttribute("value","Create");
  roombutton.setAttribute("name","createroom");
  roombutton.setAttribute("onClick","createRoom()");
  roombutton.id="submitroombutton";

  var error=document.createElement("P");
  var newLine=document.createElement("br");
  error.id="error";

  roomform.appendChild(roomno);
  roomform.appendChild(error);
  roomform.appendChild(genbutton);
  roomform.appendChild(roombutton);
  main.appendChild(roomform);
}

function generateRoomNo()
{
  var roomno=0;
  //generates 4 digit random no
  for(var i=0;i<4;i++)
    roomno+=Math.floor(Math.random()*9+1)*Math.pow(10,i);
  document.forms["roominput"]["roomno"].value=roomno;
}

function showRoomDom(message)
{
  var main=document.getElementById("main");
  while(main.firstChild)
  {
    main.removeChild(main.firstChild);
  }
  
  var roomno=document.createElement("p");
  roomno.id="textroomno";
  roomno.innerHTML=message;
  var gentext=document.createElement("p");
  gentext.id="roomnotext"
  gentext.innerHTML="Enter this no by visiting [[url]] on your mobile/tablet to start things";
  var backbutton=document.createElement("button");
  backbutton.innerHTML="generate another room";
  backbutton.setAttribute("onClick","createroomdom()");

  main.appendChild(roomno);
  main.appendChild(gentext);
  main.appendChild(backbutton);
}

function createRoom()
{
  roomno=document.forms["roominput"]["roomno"].value;
  
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

function closeconnections()
{
  console.log("all connections closed");
  peer.close();
  isstarted=false;
}
