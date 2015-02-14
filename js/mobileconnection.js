initiator=true;
isstarted=false;
/*initiator=false;
isstarted=false;*/
user_id=document.getElementById("user-id").innerHTML;
token=document.getElementById("token").innerHTML;
console.log(token);


//configuration of stun servers
config={
      'iceServers':[
                  {
                      "url": 'stun:numb.viagenie.ca',
                      "credential": 'mandar25436605',
                      "username": 'mandypalkar@gmail.com'
                  },
                  {
                    "url":'stun:stun.l.google.com:19302'
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

//send Message To Server
function sendMessage(msg){
  msgstring={};
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
    if(msg=="room joined")
    {
      maybestart();
    }

    if(msg=="room not available")
    {
      createroomdom();
      document.getElementById("error").innerHTML="oops no one has created this room check your room number";
    }

    if(msg.type==='answer')
      {
        console.log("Answer received");
        if(initiator)
        peer.setRemoteDescription(new RTCSessionDescription(msg));
        console.log("Remote Description Set at mobile side");    
      }
    /*if(msg.type==='offer')
      {
        console.log("offer received");
        if(!initiator && !isstarted)
        {
          isstarted=true;
          maybestart();
          peer.setRemoteDescription(new RTCSessionDescription(msg));
          console.log("Remote Description Set at mobile side");
          doAnswer();
        }   
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


dataChannelOptions = {
  ordered: true, //order guaranteed
  maxRetransmitTime: 3000, // in milliseconds
};

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

function del_user()
{
  sendMessage(
    {
      msg:"delete",
      user:user_id
    });
}


function maybestart()
{
    peer=new webkitRTCPeerConnection(config,connection);
    console.log("RTC created");
    peer.onicecandidate=onIceCandidate; 
    createDataChannel(); 
    if(initiator && !isstarted)
    {
      isstarted=true;
      doCall();
    }   
}

function createDataChannel()
{

  console.log("data channel created");
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
  closeconnections();
};
}
//kicks of things
/*function maybestart()
{
    peer=new webkitRTCPeerConnection(config,connection);
    console.log("RTC created");
    peer.onicecandidate=onIceCandidate; 
    peer.ondatachannel=onDataChannel; 
    if(initiator && !isstarted)
    {
      isstarted=true;
    }
      
}*/

//set local description and send it to another peer
function setLocalandSendMessage(description)
{
   peer.setLocalDescription(new RTCSessionDescription(description));
   sendMessage(description);
   console.log(description);  
}

//creates offer and call another peer
function doCall()
{
    console.log("Sending offer to peer.");
    peer.createOffer(setLocalandSendMessage,function(){console.log("error while calling");},sdpConstraints);
}

//answer to the call by another peer
function doAnswer(msg)
{   
    console.log("Sending answer to peer.");
    peer.createAnswer(setLocalandSendMessage,function(){console.log("error while answering");},sdpConstraints);
}

/*function onDataChannel(event)
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
};

}*/
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


function createroomdom()
{
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
openChannel();

function send()
{
  dataChannel.send("Mobile to Desktop");
}

function closeconnections()
{
  console.log("all connections closed");
  peer.close();
  isstarted=false;
}
