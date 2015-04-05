function game_init() {
  game_over = false;
  game_paused = false;
  canvas_width = 570;
  canvas_height = 650;
  obstacle = null;
  obstacle2 = null;
  obstacle3 = null;
  tree1 = null;
  tree2 = null;
  tree3 = null;
  tree4 = null;
  spineboy = null;
  low_speed = 1.2;
  speed = low_speed;
  scale_no = .009;
  scorecount = 0;
  image_added = false;
  count = 1;
  count_increment = .1;
  sx = .009;
  sy = .009;
  jump = false;
  body = document.body;
  main = document.getElementById("main");
  //clears the DOM
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  pixi_init();
}
function pixi_init() {
  //clears the DOM
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  var assetsToLoader = ["../data/skiboy.json", "../data/Background.jpg", "../data/BARREL.png", "../data/PENGUIN.png", "../data/SNOWMAN.png", "../data/TENT.png", "../data/TREE1.png"];
  loader = new PIXI.AssetLoader(assetsToLoader);
  stage = new PIXI.Stage(15527148, true);
  loading_text = new PIXI.Text("Loading", {font:"35px RobotoDraft ", fill:"#FFFFFF", align:"center"});
  loading_text.anchor.x = loading_text.anchor.y = .5;
  loading_text.position.x = canvas_width / 2;
  loading_text.position.y = canvas_height / 2;
  renderer = new PIXI.autoDetectRenderer(canvas_width, canvas_height);
  document.getElementById("main").appendChild(renderer.view);
  loader.addEventListener("onProgress", function(e) {
    stage.addChild(loading_text);
  });
  loader.onComplete = onAssetsLoaded;
  loader.load();
}
function onAssetsLoaded() {
  stage.removeChild(loading_text);
  var Background = PIXI.Texture.fromImage("../data/Background.jpg");
  background = new PIXI.Sprite(Background);
  Barrel = PIXI.Texture.fromImage("../data/BARREL.png");
  Penguin = PIXI.Texture.fromImage("../data/PENGUIN.png");
  Snowman = PIXI.Texture.fromImage("../data/SNOWMAN.png");
  Tent = PIXI.Texture.fromImage("../data/TENT.png");
  paused = PIXI.Texture.fromImage("../data/paused.png");
  
  paused_image = new PIXI.Sprite(paused);
  Tree = PIXI.Texture.fromImage("../data/TREE1.png");
  var ScoreBackground = PIXI.Sprite.fromImage("../data/scorecard.png");
  var lifebackground = PIXI.Sprite.fromImage("../data/life.png");
  
  spineBoy = new PIXI.Spine("../data/skiboy.json");
  
  countingtext = new PIXI.Text("S:0", {font:"35px RobotoDraft ", fill:"#FFFFFF", align:"center"});
  lifetext = new PIXI.Text("L:3", {font:"35px RobotoDraft ", fill:"#FFFFFF", align:"center"});
  paused_over_text = new PIXI.Text("", {font:"35px RobotoDraft ", fill:"#FFFFFF", align:"center"});
  
  stage.addChild(background);
  
  spineBoy.position.x = canvas_width / 2;
  spineBoy.position.y = canvas_height - 10;
  
  ScoreBackground.anchor.x = ScoreBackground.anchor.y = lifebackground.anchor.x = lifebackground.anchor.y = .5;
  
  countingtext.anchor.y = lifetext.anchor.y = .5;
  countingtext.anchor.x = lifetext.anchor.x = 1;
  
  paused_over_text.anchor.x = paused_over_text.anchor.y = .5;
  
  ScoreBackground.position.y = 50;
  ScoreBackground.position.x = canvas_width - 50;
  
  countingtext.position.x = canvas_width - 10;
  countingtext.position.y = 55;
  
  lifebackground.position.y = 100;
  lifebackground.position.x = canvas_width - 37;
  
  lifetext.position.x = canvas_width - 10;
  lifetext.position.y = 105;
  
  paused_over_text.position.x = canvas_width / 2;
  paused_over_text.position.y = canvas_height / 2;
  
  stage.addChild(ScoreBackground);
  stage.addChild(countingtext);
 
  spineBoy.scale.x = spineBoy.scale.y = .45;
  stage.addChild(spineBoy);
  
  generateTree(1);
  renderer.render(stage);
  animate();
}

function animate() {
  if (game_over == false && game_paused == false) {
    if (image_added == true) {
      stage.removeChild(paused_image);
      stage.removeChild(paused_over_text);
      image_added = false;
      game_paused = false;
    }
    count += count_increment;
    scorecount += .05;
    countingtext.setText("S:" + Math.round(scorecount));
    check_count(Math.round(count));
    
    if (obstacle != null) {
      move_obstacle1();
      detectcollision(obstacle, spineBoy);
    }
    if (obstacle2 != null) {
      move_obstacle2();
      detectcollision(obstacle2, spineBoy);
    }
    if (obstacle3 != null) {
      move_obstacle3();
      detectcollision(obstacle3, spineBoy);
    }
    if (tree1 != null) {
      movetree1();
    }
    if (tree2 != null) {
      movetree2();
    }
    if (tree3 != null) {
      movetree3();
    }
    if (tree4 != null) {
      movetree4();
    }
    requestAnimFrame(animate);
  } else {
    if (image_added == false && game_paused == true) {
      stage.addChild(paused_image);
      paused_over_text.setText("Game is paused press \n Play/Pause button to resume");
      stage.addChild(paused_over_text);
      image_added = true;
    }
    if (image_added == false && game_over == true) {
      remove_obstacles();
      stage.removeChild(spineBoy);
      stage.addChild(paused_image);
      paused_over_text.setText("Game Over \n score : " + Math.round(scorecount) + "\n press Play/Pause button to \nplay again");
      stage.addChild(paused_over_text);
      image_added = true;
    }
    requestAnimFrame(animate);
  }
  renderer.render(stage);
}


function check_count(a) {
  if (a % 33 == 0 && obstacle == null) {
    generate_obstacles(1);
  } else {
    if (a % 44 == 0 && obstacle2 == null) {
      generate_obstacles(2);
    } else {
      if (a % 23 == 0 && obstacle3 == null) {
        generate_obstacles(3);
      }
    }
  }
  if (a % 200 == 0 && low_speed <= 3) {
    low_speed += .2;
    sx += 5E-4;
    sy += 5E-4;
    count_increment += .1;
  }
}


function generate_obstacles(a) {
  var selector = Math.floor(Math.random() * 4);
  temp_obstacle = null;
  if (selector == 0) {
    temp_obstacle = new PIXI.Sprite(Barrel);
    temp_obstacle.scale.x = temp_obstacle.scale.y = .01;
  }
  if (selector == 1) {
    temp_obstacle = new PIXI.Sprite(Penguin);
    temp_obstacle.scale.x = temp_obstacle.scale.y = .05;
  }
  if (selector == 2) {
    temp_obstacle = new PIXI.Sprite(Snowman);
    temp_obstacle.scale.x = temp_obstacle.scale.y = .01;
  }
  if (selector == 3) {
    temp_obstacle = new PIXI.Sprite(Tent);
    temp_obstacle.scale.x = temp_obstacle.scale.y = .01;
  }
  temp_obstacle.anchor.x = temp_obstacle.anchor.y = .5;
  temp_obstacle.position.y = canvas_height / 2 - 50;
  temp_obstacle.position.x = canvas_width / 2;
  if (a == 1) {
    obstacle = temp_obstacle;
    stage.addChildAt(obstacle, 1);
  }
  if (a == 2) {
    obstacle2 = temp_obstacle;
    stage.addChildAt(obstacle2, 1);
  }
  if (a == 3) {
    obstacle3 = temp_obstacle;
    stage.addChildAt(obstacle3, 1);
  }
}


function generateTree(a) {
  temp_tree = new PIXI.Sprite(Tree);
  temp_tree.scale.x = temp_tree.scale.y = .01;
  temp_tree.anchor.x = temp_tree.anchor.y = .5;
  temp_tree.position.y = canvas_height / 3 + 50;
  if (a == 1) {
    tree1 = temp_tree;
    tree1.position.x = canvas_width / 2;
    stage.addChildAt(tree1, 1);
    console.log("tree1 added");
  } else {
    if (a == 2) {
      tree2 = temp_tree;
      tree2.position.x = canvas_width / 2;
      stage.addChildAt(tree2, 1);
    } else {
      if (a == 3) {
        tree3 = temp_tree;
        tree3.position.x = canvas_width / 2;
        stage.addChildAt(tree3, 1);
        console.log("tree3 added");
      } else {
        if (a == 4) {
          tree4 = temp_tree;
          tree4.position.x = canvas_width / 2;
          stage.addChildAt(tree4, 1);
        } else {
          if (a == 5) {
            tree5 = temp_tree;
            tree5.position.x = canvas_width / 2;
            stage.addChildAt(tree5, 1);
            console.log("tree5 added");
          } else {
            if (a == 6) {
              tree6 = temp_tree;
              tree6.position.x = canvas_width / 2;
              stage.addChildAt(tree6, 1);
            } else {
              if (a == 7) {
                tree7 = temp_tree;
                tree7.position.x = canvas_width / 2;
                stage.addChildAt(tree7, 1);
              } else {
                if (a == 8) {
                  tree8 = temp_tree;
                  tree8.position.x = canvas_width / 2;
                  stage.addChildAt(tree8, 1);
                }
              }
            }
          }
        }
      }
    }
  }
}

function movetree1() {
  if (tree1.position.y > 400 && tree3 == null) {
    generateTree(3);
    generateTree(4);
  }
  if (tree1.y < canvas_height - 250) {
    tree1.y += speed - 1.6;
    tree1.x -= speed + 5;
    if (tree1.scale.x <= .5) {
      tree1.scale.x += sx;
      tree1.scale.y += sy;
    }
    speed += .02;
  } else {
    stage.removeChild(tree1);
    tree1 = null;
    speed = low_speed;
  }
}
function movetree3() {
  if (tree3.position.y > 400 && tree1 == null) {
    generateTree(1);
    generateTree(2);
  }
  if (tree3.y < canvas_height - 250) {
    tree3.y += speed - 1.6;
    tree3.x -= speed + 5;
    if (tree3.scale.x <= .5) {
      tree3.scale.x += sx;
      tree3.scale.y += sy;
    }
    speed += .02;
  } else {
    stage.removeChild(tree3);
    tree3 = null;
    speed = low_speed;
  }
}
function movetree2() {
  if (tree2.y < canvas_height - 250) {
    tree2.y += speed - 1.6;
    tree2.x += speed + 5;
    if (tree2.scale.x <= .5) {
      tree2.scale.x += sx;
      tree2.scale.y += sy;
    }
    speed += .02;
  } else {
    stage.removeChild(tree2);
    tree2 = null;
    speed = low_speed;
  }
}
function movetree4() {
  if (tree4.y < canvas_height - 250) {
    tree4.y += speed - 1.6;
    tree4.x += speed + 5;
    if (tree4.scale.x <= .5) {
      tree4.scale.x += sx;
      tree4.scale.y += sy;
    }
    speed += .02;
  } else {
    stage.removeChild(tree4);
    tree4 = null;
    speed = low_speed;
  }
}
function move_obstacle1() {
  if (obstacle.y < canvas_height + 20) {
    obstacle.y += speed + 1.2;
    if (obstacle.scale.x <= .55) {
      obstacle.scale.x += sx + .002;
      obstacle.scale.y += sy + .002;
    }
    speed += .02;
  } else {
    stage.removeChild(obstacle);
    obstacle = null;
    speed = low_speed;
  }
}
function move_obstacle2() {
  if (obstacle2.y < canvas_height + 50) {
    obstacle2.y += speed + .2;
    obstacle2.x -= speed - 1.1;
    if (obstacle2.scale.x <= .55) {
      obstacle2.scale.x += sx;
      obstacle2.scale.y += sy;
    }
    speed += .06;
  } else {
    stage.removeChild(obstacle2);
    obstacle2 = null;
    speed = low_speed;
  }
}
function move_obstacle3() {
  if (obstacle3.y < canvas_height + 50) {
    obstacle3.y += speed + .2;
    obstacle3.x += speed - 1;
    if (obstacle3.scale.x <= .55) {
      obstacle3.scale.x += sx;
      obstacle3.scale.y += sy;
    }
    speed += .06;
  } else {
    stage.removeChild(obstacle3);
    obstacle3 = null;
    speed = low_speed;
  }
}
function play(data) {
  if (typeof spineBoy !== "undefined") {
    if (data == -1 && spineBoy.x > 50) {
      spineBoy.x -= 15;
    } else {
      if (data == 1 && spineBoy.x < 520) {
        spineBoy.x += 15;
      } else {
        spineBoy.x += 0;
      }
    }
  }
}
function playjump() {
  spineBoy.state.setAnimationByName(0, "Jump", false);
  jump = false;
}
function change_state() {
  if (game_paused == false) {
    game_paused = true;
  } else {
    game_paused = false;
  }
  if (game_over == true) {
    scorecount = 0;
    count = 0;
    low_speed = 1.2;
    speed = low_speed;
    sx = sy = .009;
    spineBoy.position.x = canvas_width / 2;
    spineBoy.position.y = canvas_height - 10;
    stage.addChild(spineBoy);
    game_over = false;
    game_paused = false;
  }
}
function detectcollision(a, b) {
  if (a != null && b != null) {
    if (b.y > canvas_height / 2 && a.position.y > b.position.y - 40 && a.position.y <= b.position.y - 20 && jump == false) {
      var xdist = Math.abs(a.position.x - b.position.x);
      if (xdist < a.width / 2 || xdist < b.width / 2) {
        var ydist = Math.abs(a.position.y - b.position.y);
        if (b.position.y > canvas_height / 2 && ydist < a.height / 2 || ydist < b.height / 2) {
          console.log("collide");
          dataChannel.send(JSON.stringify(5000));
          game_over = true;
        }
      }
    }
  }
}
function remove_obstacles() {
  if (obstacle != null) {
    stage.removeChild(obstacle);
    obstacle = null;
  }
  if (obstacle2 != null) {
    stage.removeChild(obstacle2);
    obstacle2 = null;
  }
  if (obstacle3 != null) {
    stage.removeChild(obstacle3);
    obstacle3 = null;
  }
  return;
}
;