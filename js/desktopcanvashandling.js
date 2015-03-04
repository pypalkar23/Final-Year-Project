function game_init()
{
	canvas_width=570;
	canvas_height=650;

	var main=document.getElementById("main");

	while(main.firstChild)
		main.removeChild(main.firstChild);

	label_reading=document.createElement("label");
	label_reading.id="accelerometer-reading";
	main.appendChild(label_reading);
	document.getElementById("accelerometer-reading").innerHTML="Accelerometer-reading";

	/*var Stage = new PIXI.Stage(0xececec);
	var Renderer = PIXI.autoDetectRenderer(canvas_width, canvas_height);

	main.appendChild(Renderer.view);
	Renderer.render(Stage);*/
}
