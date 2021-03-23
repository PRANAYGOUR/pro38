var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bike, bike_running, bike_collided;
var ground, ground2, groundImage, bgImage;

var cloudsGroup, cloudImage;
var trappersGroup, trapper1, trapper2, trapper3, trapper4, trapper5, trapper6;
var backgroundImg;
var score=0;
var invisibleGround;
var gameOver, restart;
var bg = "bg.png";


function preload(){
  bike_running =   loadAnimation("bike2.png");
  bike_collided = loadAnimation("bike2.png");
  bgImage = loadImage("bg.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("clouds.png");
  
  trapper1 = loadImage("trapper2.png");
  trapper2 = loadImage("trapper2.png");
  trapper3 = loadImage("trapper2.png");
  trapper4 = loadImage("trapper2.png");
  trapper5 = loadImage("trapper2.png");
  trapper6 = loadImage("trapper2.png");
  invisibleGround = loadImage("ground2.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  arrowImage = loadImage("arrow.png");
  getBackgroundImg();
}

function setup() {
  createCanvas(displayWidth-5, displayHeight-5);


 //bg = createSprite(300,300,500,500);
 // bg.addImage("background", bgImage);
  //bg.scale = 3.7
  bike = createSprite(50,100,20,50);
 

  
  bike.addAnimation("running", bike_running);
  bike.addAnimation("collided", bike_collided);
  bike.scale = 0.2;
  
  ground = createSprite(800,500,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(700,300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,350);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  //score.visible = true;
    gameOver.visible = false;
  restart.visible = false;
  
invisibleGround = createSprite(300,300,600,5);

invisibleGround.visible = false;

  ground2 = createSprite(200,500,400,10);
  ground2.visible = false;
  
  cloudsGroup = new Group();
  trappersGroup = new Group();
  
  score = 0;

  arrowGroup = new Group();

}

function draw() {
 // bike.debug = true;
 if(backgroundImg)
 background(backgroundImg);
 
  fill(0);
  text("Score: "+ score, 900,50);
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && bike.y >= 159) {
      bike.velocityY = -12;
    }
  
    bike.velocityY = bike.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
 // release arrow when space key is pressed
 if (keyDown("UP_ARROW")) {
  createArrow();
  
}


    bike.collide(ground2);
    trappersGroup.bounceOff(invisibleGround)

    spawnClouds();
    spawntrappers();
  
    if(trappersGroup.isTouching(bike)){
        gameState = END;
    }


    if(arrowGroup.isTouching(trappersGroup)){
      trappersGroup.destroyEach();
      arrowGroup.destroyEach();
      score=score+1;
      
    }
     



  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    bike.velocityY = 0;
    trappersGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the bike animation
    bike.changeAnimation("collided",bike_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    trappersGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1000,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = bike.depth;
    bike.depth = bike.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawntrappers() {
  if(frameCount % 60 === 0) {
    var trapper = createSprite(1000,450,10,40);
    //trapper.debug = true;
    trapper.velocityX = -10;
  
    //trapper.velocityY = -6
    trapper.collide(invisibleGround);
    //generate random trappers
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: trapper.addImage(trapper1);
              break;
      case 2: trapper.addImage(trapper2);
              break;
      case 3: trapper.addImage(trapper3);
              break;
      case 4: trapper.addImage(trapper4);
              break;
      case 5: trapper.addImage(trapper5);
              break;
      case 6: trapper.addImage(trapper6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the trapper           
    trapper.scale = 0.1;
    trapper.lifetime = 300;
    //add each trapper to the group
    trappersGroup.add(trapper);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  trappersGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  bike.changeAnimation("running",bike_running);
  
 
  
  score = 0;
 
}

function createArrow() {
  var arrow= createSprite(50, 100, 60, 10);
  arrow.addImage(arrowImage);
 // arrow.debug = true
  arrow.x = 50;
  arrow.scale=0.1;
  arrow.y=bike.y;
  arrow.velocityX = 4;
  arrow.lifetime = 100;
  arrow.scale = 0.3;
 // return arrow;
  arrowGroup.add(arrow);
}

async function getBackgroundImg(){
  var response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  console.log(hour);
  if(hour>=06 && hour<19){
      bg = "bg.png";
  }
  else{
      bg = "bg2.jpg";
  }
  backgroundImg = loadImage(bg);
  console.log(backgroundImg);
}