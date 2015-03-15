
function game_init()
{
	canvas_width=570;
	canvas_height=650;
	body=document.body;
	main=document.getElementById("main");
	while(main.firstChild)
		main.removeChild(main.firstChild);
    pixi_init();
}
	/*label_reading=document.createElement("label");
	label_reading.id="accelerometer-reading";
	main.appendChild(label_reading);
	document.getElementById("accelerometer-reading").innerHTML="Accelerometer-reading";

	/*var Stage = new PIXI.Stage(0xececec);
	var Renderer = PIXI.autoDetectRenderer(canvas_width, canvas_height);

	main.appendChild(Renderer.view);
	Renderer.render(Stage);*/


	// create an array of assets to load
function pixi_init()
{
    var assetsToLoader = ["../data/skiboy.json"];

    // create a new loader
    loader = new PIXI.AssetLoader(assetsToLoader);

    // use callback
    loader.onComplete = onAssetsLoaded;

    //begin load
    loader.load();

    // create an new instance of a pixi stage
    stage = new PIXI.Stage(0xECECEC, true);

    // create a renderer instance
    renderer = new PIXI.autoDetectRenderer(canvas_width,canvas_height);

    // add render view to DOM
    main.appendChild(renderer.view);
   
}

function onAssetsLoaded()
{
    // create a spine boy
    spineBoy = new PIXI.Spine("../data/skiboy.json");

    // set the position
    spineBoy.position.x = canvas_width/2;
    spineBoy.position.y = canvas_height-50;

    spineBoy.scale.x = spineBoy.scale.y = 0.5;
    stage.addChild(spineBoy);
    state=play;
    requestAnimFrame( animate );
    stage.click = function()
    {
        spineBoy.state.setAnimationByName(0, "Jump", false);
    }
}        

function animate() 
{
    requestAnimFrame( animate );
    renderer.render(stage);
}

function play(data)
{
    if(data== -1 && spineBoy.x > 50)
        {spineBoy.x -= 10;}
    else if(data == 1 && spineBoy.x < 520)
        {spineBoy.x  += 10;}
    else
        {spineBoy.x  += 0;}
}

function playjump()
{
    spineBoy.state.setAnimationByName(0,"Jump", false);
}
