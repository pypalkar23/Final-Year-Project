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
  //console.log("Got Data Channel Message:", event.data);
  document.getElementById("accelerometer-reading").innerHTML=event.data;
};

dataChannel.onopen = function () {
  console.log("--Datachannel opened----");
  changeinfo();
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
