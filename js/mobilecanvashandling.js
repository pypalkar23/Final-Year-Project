previous_value=0;
current_value=0;
move=0;
function game_init()
{ 

  //lockedAllowed=screen.lockOrientation("landscape-primary");
	var main=document.getElementById("main");

	while(main.firstChild)
		main.removeChild(main.firstChild);
  
  var button=document.createElement("paper-button");
  button.setAttribute("class","colored");
  button.setAttribute("role","button");
  button.setAttribute("raised","true");
  button.setAttribute("id","jumpbutton");
  button.onclick=sendjump;
  
  var button_text=document.createElement("label");
  button_text.id="button-text";
  button_text.innerHTML="Jump";

  button.appendChild(button_text);
  main.appendChild(button);

  if (window.DeviceOrientationEvent) {
  
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', orientationHandle,false);
} else {
  document.getElementById("main").innerHTML = "Not supported."
}
}

function orientationHandle(eventData) {
    // gamma is the left-to-right tilt in degrees, where right is positive
    //var tiltLR = eventData.gamma;

    // beta is the front-to-back tilt in degrees, where front is positive
    var tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    //var dir = eventData.alpha;

    // call our orientation event handler
    deviceOrientationHandler(tiltFB);
  }

function deviceOrientationHandler(tiltFB)
{
    current_value=Math.round(tiltFB);
    if(current_value<previous_value)
      move=-1;
    else if(current_value>previous_value)
      move=1;
    else
      move=0;
    msg=JSON.stringify(move);
    if(dataChannel.readyState=="open")
    dataChannel.send(msg);
    console.log(msg);
    previous_value=current_value;
}

function sendjump(){
  window.addEventListener('deviceorientation', null,false);
  msg=JSON.stringify(1000);
  if(dataChannel.readyState=="open")
  dataChannel.send(msg);
  console.log(1000);
  window.addEventListener('deviceorientation', orientationHandle,false);
 };

