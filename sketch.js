var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/WashRoom.png");
bedroom=loadImage("images/BedRoom.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("FEED DRAGO");
  feed.position(500,15);
  feed.mousePressed(feedDog);

  addFood=createButton("ADD FOOD");
  addFood.position(400,15);
  addFood.mousePressed(addFoods);
}

function draw() {
  background ("yellow");

foodObj.display();
writeStock(foodS)

if(foodS==0){
dog.add.Image(happyDog);
milkBottle2.visible=false;
}
else{
  dog.addImage(sadDog);
  milkBottle2.visible=true;
}
if(gameState===1){
dog.addImage(happyDog);
dog.scale=0.175;
dog.y=250;
}
if(gameState===2){
dog.addImage(sadDog);
milkBottle2.visible=false;
dog.y=250;
}
var Bath=createButton("I want to take a bath");
Bath.position(580,125);
if(Bath.mousePressed(function(){
gameState=3;
database.ref('/').update({'gameState':gameState});
}));
if (gameState===3){
dog.addImage(washroom);
dog.scal=1;
milkBottle2.visible=false;
}


var Sleep=createButton("I am very sleepy")
Sleep.position(710,125);
if(Sleep.mousePressed(function(){
  gameSate=4;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState===4){
  dog.addImage(bedroom);
dog.scale=1;
milkBottle2.visible=false;
}


var Play=createButton("lets play!");
Play.position(500,160);
if(Play,mousePresed(function(){
gameState=5;
database.ref('/').update({'gameState':gameState});
}));
if(gameState===5){
dog.addImage(livingroom);
dog.scale=1;
milkBottle2.visible=false;
}

var PlayInGarden=createButton("Lets play in park")
PlayInGarden.position(585,160);
if(PlayInGarden.mousePressed(function(){
  gameSate=6;
  database.ref('/').update({'gameState':gameState});
}));
if(gameState===6){
  dog.y=175;
  dog.addImage(garden);
dog.scale=1;
milkBottle2.visible=false;
}

 var button=createButton("Feed the dog");
  button.position(680,90);
 if( button.mousePressed(function(){
foodS=foodS-1
dog.addImage(happyDog)
gamestate=1
database.ref('/').update({"gamestate":gamestate})
 }));
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
//function towrite stock in database
function writeStock(x){
  database.ref('/').update({
food:x
})

}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}