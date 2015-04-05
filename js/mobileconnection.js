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

//sends Message To Server
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

//called when signalling channel opens
function onChannelOpened()
{
  console.log("channel opened");
  
}

//called when message receives from signalling channel
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

//datachannelconfigurations
dataChannelOptions = {
  ordered: true, //order guaranteed
  maxRetransmitTime: 3000 // in milliseconds
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

//deletes room from the server
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
  if(!window.webkitRTCPeerConnection)
  {
    document.body.innerHTML="Please use Chrome 30 or later";
  }
  else
  {
    peer=new window.webkitRTCPeerConnection(config,connection);
    console.log("RTC created");
    peer.onicecandidate=onIceCandidate; 
    createDataChannel(); 
    if(initiator && !isstarted)
    {
      isstarted=true;
      doCall();
    } 
  }  
}

//creates data channel and sets its handler to it
function createDataChannel()
{
  console.log("data channel created");
  dataChannel =  peer.createDataChannel("abcd", dataChannelOptions);

dataChannel.onerror = function (error) {
  console.log("Data Channel Error:", error);
};

dataChannel.onmessage = function (event) {
  //console.log("Got Data Channel Message:", event.data);
  if(event.data==5000)
    navigator.vibrate(200);
};

dataChannel.onopen = function () {
  console.log("----Datachannel opened----");
  game_init();
};

dataChannel.onclose = function () {
  console.log("The Data Channel is Closed");
  closeconnections();
};
}


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

//opens google signalling channel
openChannel();


//close all the connections
function closeconnections()
{
  console.log("all connections closed");
  dataChannel.close();
  peer.close();
  isstarted=false;
  message={action:"remove room"};
  sendMessage(message);
  console.log("remove msg sent");
}