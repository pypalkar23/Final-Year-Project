function game_init()
{
	canvas_width=570;
	canvas_height=650;

	var main=document.getElementById("main");

	while(main.firstChild)
		main.removeChild(main.firstChild);
	if (window.DeviceOrientationEvent) {
  
  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
    // gamma is the left-to-right tilt in degrees, where right is positive
    //var tiltLR = eventData.gamma;

    // beta is the front-to-back tilt in degrees, where front is positive
    var tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    //var dir = eventData.alpha;

    // call our orientation event handler
    deviceOrientationHandler(tiltFB);
  }, false);
} else {
  document.getElementById("main").innerHTML = "Not supported."
}


	/*var Stage = new PIXI.Stage(0xececec);
	var Renderer = PIXI.autoDetectRenderer(canvas_width, canvas_height);

	main.appendChild(Renderer.view);
	Renderer.render(Stage);*/
}

function deviceOrientationHandler(tiltFB)
{
   while(main.firstChild)
    main.removeChild(main.firstChild);
   msg=JSON.stringify(Math.round(tiltFB));
   dataChannel.send(msg);
   console.log(tiltFB);
}
