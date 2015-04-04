function game_init()
{
    game_over=false;
    game_paused=false;
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
    image_added=false;
    count=1;
    count_increment=0.1;
    sx=0.009;
    sy=0.009;
    jump=false;
	body=document.body;
	main=document.getElementById("main");
	while(main.firstChild)
        main.removeChild(main.firstChild);
    pixi_init();
}
	
function pixi_init()
{
    while(main.firstChild)
        main.removeChild(main.firstChild);

    // create an array of assets to load
    var assetsToLoader = ["../data/skiboy.json","../data/Background.jpg","../data/BARREL.png","../data/PENGUIN.png",
    "../data/SNOWMAN.png","../data/TENT.png","../data/TREE.png"];

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
    paused=PIXI.Texture.fromImage("../data/paused.png");
    paused_image=new PIXI.Sprite(paused);
    Tree=PIXI.Texture.fromImage("../data/TREE.png");
    tree1=tree2=tree3=tree4=null;
    /*tree1=new PIXI.Sprite(Tree);
    tree2=new PIXI.Sprite(Tree);
    tree3=new PIXI.Sprite(Tree);
    tree4=new PIXI.Sprite(Tree);*/
    
    var ScoreBackground=PIXI.Sprite.fromImage("../data/scorecard.png");
    var lifebackground=PIXI.Sprite.fromImage("../data/life.png");
    spineBoy = new PIXI.Spine("../data/skiboy.json");
    countingtext=new PIXI.Text("S:0",{ font:"35px RobotoDraft ", fill: "#FFFFFF", align: "center"});
    lifetext=new PIXI.Text("L:3",{ font:"35px RobotoDraft ", fill: "#FFFFFF", align: "center"});
    paused_over_text=new PIXI.Text("",{font:"35px RobotoDraft ", fill: "#FFFFFF", align: "center"});
    stage.addChild(background);

    /*tree1.anchor.x=tree2.anchor.x=tree3.anchor.x=tree4.anchor.x=0.5;
    tree1.anchor.y=tree2.anchor.y=tree3.anchor.y=tree4.anchor.y=1.0;

    tree1.scale.x=tree2.scale.x=0.2;
    tree1.scale.y=tree2.scale.y=0.2;

    tree3.scale.x=tree4.scale.x=0.4;
    tree3.scale.y=tree4.scale.y=0.4;

    tree1.position.x=200;
    tree1.position.y=360;

    tree2.position.x=370;
    tree2.position.y=360;

    tree3.position.x=80;
    tree3.position.y=450;

    tree4.position.x=480;
    tree4.position.y=450;*/


   /* stage.addChildAt(tree1,1);
    stage.addChildAt(tree2,1);
    stage.addChildAt(tree3,1);
    stage.addChildAt(tree4,1);*/

    // set the position

    //spineBoy.anchor.x=0.5;
    //spineBoy.anchor.y=1.0;
    spineBoy.position.x = canvas_width/2;
    spineBoy.position.y = canvas_height-10;

    ScoreBackground.anchor.x=ScoreBackground.anchor.y=lifebackground.anchor.x=lifebackground.anchor.y=0.5;
    
    countingtext.anchor.y=lifetext.anchor.y=0.5;
    countingtext.anchor.x= lifetext.anchor.x= 1;
    
    paused_over_text.anchor.x=paused_over_text.anchor.y=0.5;

    ScoreBackground.position.y=50;
    ScoreBackground.position.x=canvas_width-50;

    countingtext.position.x= canvas_width-10;
    countingtext.position.y= 55;

    lifebackground.position.y=100;
    lifebackground.position.x=canvas_width-37;

    lifetext.position.x= canvas_width-10;
    lifetext.position.y= 105;

    paused_over_text.position.x=canvas_width/2;
    paused_over_text.position.y=canvas_height/2;

    stage.addChild(ScoreBackground);
    //stage.addChild(lifebackground);
    stage.addChild(countingtext);
    //stage.addChild(lifetext);
    
    spineBoy.scale.x = spineBoy.scale.y = 0.45;
    stage.addChild(spineBoy);
    //generate_obstacles(1);
    renderer.render(stage);
    animate();
}        

function animate() 
{
    if (game_over==false && game_paused==false)
    {
    if(image_added==true)
    {
        stage.removeChild(paused_image);
        stage.removeChild(paused_over_text);
        image_added=false;
        game_paused=false;
    }
    count+=count_increment;
    scorecount+=0.05;
    countingtext.setText("S:"+Math.round(scorecount));
    check_count(Math.round(count));
    if(obstacle!=null)
        {
            move_obstacle1();
            detectcollision(obstacle,spineBoy);
        }

    if(obstacle2!=null)
        {
            move_obstacle2();
            detectcollision(obstacle2,spineBoy);
        }
    if(obstacle3!=null)
        {
            move_obstacle3();
            detectcollision(obstacle3,spineBoy);
        }
    requestAnimFrame( animate );
    }
    else{
        if(image_added==false && game_paused==true)
            {
                stage.addChild(paused_image);
                paused_over_text.setText("Game is paused press \n Play/Pause button to resume");
                stage.addChild(paused_over_text);
                image_added=true;
            }
        if(image_added==false && game_over==true)
            {
                remove_obstacles();
                stage.removeChild(spineBoy);
                stage.addChild(paused_image);
                paused_over_text.setText("Game Over \n score : "+Math.round(scorecount)+"\n press Play/Pause button to \nplay again");
                stage.addChild(paused_over_text);
                image_added=true; 

            }
        requestAnimFrame( animate );
        }
    renderer.render(stage);
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

    /*if(a%20==0 && tree1==null)
    {
        generateTree(1);
        generateTree(2);
    }

    if(a%35==0 && tree3==null)
    {
        generateTree(3);
        generateTree(4);
    }*/

    if (a%200==0 && low_speed<=3.0)
    {
        low_speed+=0.2;
        sx+=0.0005;
        sy+=0.0005;
        count_increment+=0.1;
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
        temp_obstacle.scale.x=temp_obstacle.scale.y=0.05;
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

function generateTree(var a)
{
    temp_tree = new PIXI.Sprite(TREE);
    temp_tree.scale=0.02;
    temp_tree.position.x=canvas_width/2;
    if(a==1)
    {
        tree1=temp_tree;
        tree1.position.y=canvas_width/2-10;
    }
    if(a==2)
    {
        tree2=temp_tree;
        tree2.position.y=canvas_width/2+10;
    }
    if(a==3)
    {
        tree3=temp_tree;
        tree3.position.y=canvas_width/2-10;
    }
    if(a==4)
    {
        tree4=temp_tree;
        tree4.position.y=canvas_width/2+10;
    }

}





function move_obstacle1()
{
 if(obstacle.y<canvas_height+20) 
    {
     obstacle.y +=(speed+1);

     if(obstacle.scale.x<=0.65)
     {
      obstacle.scale.x += (sx+0.002);
      obstacle.scale.y += (sy+0.002); 
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
     obstacle2.x -= (speed-1.1);
     if(obstacle2.scale.x<=0.65)
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
     obstacle3.x += (speed-1.0);
     if(obstacle3.scale.x<=0.65)
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
    if (typeof spineBoy !=='undefined')
        {if(data== -1 && spineBoy.x > 50)
            {spineBoy.x -= 15;}
        else if(data == 1 && spineBoy.x < 520)
            {spineBoy.x  += 15;}
        else
            {spineBoy.x  += 0;}
    }
}

function playjump()
{
    spineBoy.state.setAnimationByName(0,"Jump", false);
    /*setTimeout(function(){
        jump=true;
    },700);*/
    
    jump=false;
}

function change_state()
{
    if (game_paused==false)
        game_paused=true;
    else
        game_paused=false;
    if(game_over==true)
        { 
         scorecount=0;
         count=0;
         low_speed=1.2;
         speed=low_speed;
         sx=sy=0.009; 
         spineBoy.position.x = canvas_width/2;
         spineBoy.position.y =  canvas_height-10;
         stage.addChild(spineBoy);    
         game_over=false;
         game_paused=false;
        }
} 



function detectcollision(a,b)
{ 
   if(a!=null && b!=null)
    {
        if(
           b.y>(canvas_height/2) &&
           a.position.y>(b.position.y-40) && 
           a.position.y<=(b.position.y-20) && 
           jump==false
         )
        {
            var xdist = Math.abs(a.position.x - b.position.x);

            if( xdist < (a.width/2) || xdist < (b.width/2) )
            {
                var ydist = Math.abs(a.position.y - b.position.y);
        
                if(b.position.y>(canvas_height/2) && ydist < (a.height/2) || ydist < (b.height/2))
                {
                    console.log("collide");
                    dataChannel.send(JSON.stringify(5000));
                    game_over=true;// HIT CODE!!

                }
            }
        }   
    }
}

function remove_obstacles()
{
    if (obstacle != null)
        {
         stage.removeChild(obstacle);
         obstacle=null;
        }

    if (obstacle2 != null)
        {
            stage.removeChild(obstacle2);
            obstacle2=null;
        }
    if (obstacle3 != null)
        {
          stage.removeChild(obstacle3);
          obstacle3 =null;
         } 
    return;
}

