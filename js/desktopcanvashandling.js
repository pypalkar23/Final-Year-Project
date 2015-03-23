
function game_init()
{
    game_over=false;
	canvas_width=570;
    canvas_height=650;
    obstacle=null;
    obstacle2=null;
    obstacle3=null;
    spineboy=null;
    low_speed=1.2;
    speed=low_speed;
    scale_no=0.009;
    scorecount=0;
    count=1;
    count_increment=0.1;
    sx=0.009;
    sy=0.009;
	body=document.body;
	main=document.getElementById("main");
	while(main.firstChild)
		main.removeChild(main.firstChild);
    pixi_init();
}
	// create an array of assets to load
function pixi_init()
{
    var assetsToLoader = ["../data/skiboy.json","../data/Background.jpg","../data/BARREL.png","../data/PENGUIN.png",
    "../data/SNOWMAN.png","../data/TENT.png"];

    // create a new loader
    loader = new PIXI.AssetLoader(assetsToLoader);

    // use callback+
    loader.onComplete = onAssetsLoaded;

    //begin load
    loader.load();
    
    // create an new instance of a pixi stage
    stage = new PIXI.Stage(0xECECEC, true);

    // create a renderer instance
    renderer = new PIXI.autoDetectRenderer(canvas_width,canvas_height);

    // add render view to DOM
    document.getElementById("main").appendChild(renderer.view);
   
}

function onAssetsLoaded()
{
    // create a spine boy
    var Background=PIXI.Texture.fromImage("../data/Background.jpg");
    background=new PIXI.Sprite(Background);
    Barrel=PIXI.Texture.fromImage("../data/BARREL.png");
    Penguin=PIXI.Texture.fromImage("../data/PENGUIN.png");
    Snowman=PIXI.Texture.fromImage("../data/SNOWMAN.png");
    Tent=PIXI.Texture.fromImage("../data/TENT.png");
    
    var ScoreBackground=PIXI.Sprite.fromImage("../data/scorecard.png");
    var lifebackground=PIXI.Sprite.fromImage("../data/life.png");
    spineBoy = new PIXI.Spine("../data/skiboy.json");
    countingtext=new PIXI.Text("S:0",{ font:"35px RobotoDraft ", fill: "#FFFFFF", align: "center"});
    lifetext=new PIXI.Text("L:3",{ font:"35px RobotoDraft ", fill: "#FFFFFF", align: "center"});
    stage.addChildAt(background,0);
    // set the position

    //spineBoy.anchor.x=0.5;
    //spineBoy.anchor.y=1.0;
    spineBoy.position.x = canvas_width/2;
    spineBoy.position.y = canvas_height-50;

    ScoreBackground.anchor.x=ScoreBackground.anchor.y=lifebackground.anchor.x=lifebackground.anchor.y=0.5;
    countingtext.anchor.y=lifetext.anchor.y=0.5;
    countingtext.anchor.x= lifetext.anchor.x= 1;

    ScoreBackground.position.y=50;
    ScoreBackground.position.x=canvas_width-50;

    countingtext.position.x= canvas_width-10;
    countingtext.position.y= 55;

    lifebackground.position.y=100;
    lifebackground.position.x=canvas_width-37;

    lifetext.position.x= canvas_width-10;
    lifetext.position.y= 105;

    stage.addChild(ScoreBackground);
    stage.addChild(lifebackground);
    stage.addChild(countingtext);
    stage.addChild(lifetext);
    
    spineBoy.scale.x = spineBoy.scale.y = 0.4;
    stage.addChildAt(spineBoy,1);
    //generate_obstacles(1);
    requestAnimFrame( animate );  
}        

function animate() 
{
    if (game_over==false)
    {
    requestAnimFrame( animate );
    count+=count_increment;
    scorecount+=0.05;
    countingtext.setText("S:"+Math.round(scorecount));
    check_count(Math.round(count));
    if(obstacle!=null)
        move_obstacle1(); 
    if(obstacle2!=null)
        move_obstacle2();
    if(obstacle3!=null)
        move_obstacle3(); 
    renderer.render(stage);
    }
}


function generate_obstacles(a)
{
    var selector=Math.floor(Math.random()*4);
    temp_obstacle=null;
    if(selector==0)
    {
        temp_obstacle=new PIXI.Sprite(Barrel);
        temp_obstacle.scale.x=temp_obstacle.scale.y=0.01;
    }
    if(selector==1)
    {
        temp_obstacle=new PIXI.Sprite(Penguin);
        temp_obstacle.scale.x=temp_obstacle.scale.y=0.01;
    }
    if(selector==2)
    {
        temp_obstacle=new PIXI.Sprite(Snowman);
        temp_obstacle.scale.x=temp_obstacle.scale.y=0.01;
    }
    if(selector==3)
    {
        temp_obstacle=new PIXI.Sprite(Tent);
        temp_obstacle.scale.x=temp_obstacle.scale.y=0.01;
    }

    temp_obstacle.anchor.x=temp_obstacle.anchor.y=0.5;
    
    temp_obstacle.position.y=canvas_height/2-50;
    temp_obstacle.position.x=canvas_width/2;
    if(a==1)
    {
     obstacle=temp_obstacle;
     stage.addChildAt(obstacle,1);
    }  

    if(a==2)
    {
     obstacle2=temp_obstacle;
     stage.addChildAt(obstacle2,1);
    }  

    if(a==3)
    {
     obstacle3=temp_obstacle;
     stage.addChildAt(obstacle3,1);
    }  
}

function check_count(a)
{
    if(a%33==0 && obstacle==null)
        generate_obstacles(1);
    else if(a%44==0 && obstacle2==null)
        generate_obstacles(2);
    else
    {
        if(a%23==0 && obstacle3==null)
        generate_obstacles(3);   
    }

    if (a%200==0 && low_speed<=2.2)
    {
        low_speed+=0.2;
        sx+=0.0005;
        sy+=0.0005;
        count_increment+=0.1;
    }
        
}


function move_obstacle1()
{
 if(obstacle.y<canvas_height+50) 
    {
     obstacle.y +=(speed+0.5);
     if(obstacle.scale.x<=0.7)
     {
      obstacle.scale.x += sx;
      obstacle.scale.y += sy; 
    }
     speed+=0.02;
    }

else
    {
    stage.removeChild(obstacle);
    //generate_obstacles(1);
    obstacle=null;
    speed=low_speed;
    }
}

function move_obstacle2()
{
 if(obstacle2.y<canvas_height+50) 
    {
    
     obstacle2.y += speed;
     obstacle2.x -= speed;
     if(obstacle2.scale.x<=0.7)
     {
        obstacle2.scale.x += sx;
        obstacle2.scale.y += sy;
    }
     speed+=0.06;
    }

else
    {
    stage.removeChild(obstacle2);
    //generate_obstacles(2);
    obstacle2=null;
    speed=low_speed;
    }
}


function move_obstacle3()
{
 if(obstacle3.y<canvas_height+50) 
    {
     obstacle3.y += speed;
     obstacle3.x += speed;
     if(obstacle3.scale.x<=0.7)
     {obstacle3.scale.x += sx;
     obstacle3.scale.y += sy;
    }
     speed+=0.06;
    }

else
    {
    stage.removeChild(obstacle3);
    //generate_obstacles(3);
    obstacle3=null;
    speed=low_speed;
    }
}

function play(data)
{
    if (typeof spineboy !=='undefined')
        {if(data== -1 && spineBoy.x > 50)
            {spineBoy.x -= 10;}
        else if(data == 1 && spineBoy.x < 520)
            {spineBoy.x  += 10;}
        else
            {spineBoy.x  += 0;}
    }
}

function playjump()
{
    spineBoy.state.setAnimationByName(0,"Jump", false);
}

