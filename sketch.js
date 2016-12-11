/**
 * Space VR Explorer 
 * Maz & Radhika 
 * 
 * 
 * /

/* TODO: 
 * 
 * Alien enemy (UFO)****
 * When the plane is created, the planet is still on the map (splice the planets array to remove it, and when user leaves plane, put the planet back in)
 * Removing a planet when an enemy gets it
 * Warp speed special effects via cylinder
 * Deceleration
 * (If we have time) add landing prompt, sun/stars, find wrap around
 * Start/ending/Game Over screens
 * Add plane to user camera for counter (semi-transparent)
 * 
 */

// variable to hold a reference to our A-Frame world
var world;
var acceleration = 0.01;
var velocity = 0;
var landOnPlanet = false;
var closeEnough = false;

//var universe = '#';
var planets = [];
var rings = [];
var ship;
var ufo;

var gameState = 0;
var onPlanet = false;
var currentPlanet;

var currentPosition;

var amountOfForms = 0;
var playerForms = 0;

var lifeForms = [];
var rocketSound;
var collected; 


var warpCylinder, warpContainer;

function preload(){
  rocketSound = loadSound('sfx/rocket.mp3');
  bgm = loadSound('music/moon.mp3');
  collected = loadSound('sfx/win.wav');
}

function setup() {
	// no canvas needed
	noCanvas();
	
	
  //questionContainer.addChild(landPlane);
   
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');
	
	 // create a container to hold our warp system
  warpContainer = new Container3D({});

  // create a cylinder inside of the warp container
  warpCylinder = new Cone({
    x: 0,
    y: 0,
    z: 0,
    height: 10,
    radiusBottom: 1,
    radiusTop: 0.5,
    rotationX: 90,
    openEnded: true,
    side: 'double',
    asset: 'stars',
    opacity: 0
  });
  warpContainer.addChild(warpCylinder);
  world.add(warpContainer);
	
	var player = world.getUserPosition();
	
	var landPlane = new Plane({
    x: player.x,
    y: player.y,
    z: -100,
    width: 50,
    height:50,
    asset: 'land'
    //rotationX:-90
  })
	
	//world.camera.holder.appendChild(landPlane.tag);

	world.setFlying(true);

	for (var i = 0; i < 200; i++) {
		// pick a location
		var x = random(-random(2000), random(2000));
		var y = random(-random(2000),random(2000));
		var z = random(-random(2000), random(2000));
		
		//make sure a planet isn't generate right next to the user 
    while((x < 100 && x > -100) || (y < 100 && y > -100) || (z < 100 && z > -100)){
      x = random(-random(2000), random(2000));
      y = random(-random(2000),random(2000));
      z = random(-random(2000), random(2000));  
    }
		
		var r = random(255);
		var g = random(255);
		var b = random(255);

		var container = new Container3D({x:x, y:y, z:z});
		var planet = new Planet(x,y,z,r,g,b);

  	// add the container to the world
  	world.add(planet.container);
  
    	planets.push(planet);
    		// add the box to the world
    		//world.add(b);
    	}
  
    ship = new Ship();
    ufo = new Enemy(player.x, player.y, player.z - 500);
    
}



function draw() {
  checkScore();
  if(gameState == 0){
    mainGame();
  }
  else{
    
  }
  

}


function Star(x,y,z,r,g,b){
  this.x =x;
  this.y = y;
  this.z=z;
  this.r=random(255);
  this.g=random(255);
  this.b=random(255);
  
  this.xOffset = random(1000);
	this.zOffset = random(2000, 3000);
	
	this.lifeSpan = random(200,300);
  
  this.body = new Sphere({
    x:this.x,
    y:this.y,
    z:this.z,
    red: this.r,
    green: this.g,
    blue: this.b,
    radius:30,
    metalness:0.25
  });
  
  world.add(this.body);
  
  
  
}

function Ship(){
  this.acceleration = 0.01;
  this.velocity = 0;
  this.pos = world.getUserPosition();
  
  this.x = this.pos.x;
  this.y = this.pos.y;
  this.z = this.pos.z;
  
  this.move = function(){
    if(!onPlanet){
      if (mouseIsPressed || touchIsDown) {
      if(this.velocity < 1){
        playSound(rocketSound);
        this.velocity += this.acceleration;
      }
      
		//var pos = world.getUserPosition();
		//world.setUserPosition(pos.x,pos.y+1,pos.z)
	  }
	  world.moveUserForward(this.velocity);
      
    }
    else{
      if(mouseIsPressed || touchIsDown){
        world.moveUserForward(1);
      }
    }
    
  }
  
  
}

function Alien(xPos,yPos,zPos,modelName){
  this.x = xPos;
  this.y = yPos;
  this.z = zPos;
  this.visited = false;
  
  this.xOffset = random(1000);
	this.zOffset = random(2000, 3000);
  
  this.modelName = modelName;
  
  this.model = new DAE({asset:this.modelName, x:this.x, y:this.y,z:this.z});
  
  world.add(this.model);
  lifeForms.push(this);
  
  this.interact = function(){
    var player = world.getUserPosition();
    var distance = dist(player.x,player.y,player.z,this.x,this.y,this.z);
    if(distance <10 && !this.visited){
      this.visited = true;
      amountOfForms++;
      world.remove(this.model);
      collected.play();
      console.log("got");
      
    }
  }
  
  
  this.displayForm = function(){
      world.add(this.model)
      lifeForms.push(this)
    
  }
  
  //TODO: Get movement working by Perlin Noise here
  this.move = function(){
    
    var xMovement = map( noise(this.xOffset), 0, 1, -0.005, 0.005);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.005, 0.005);
		
		this.xOffset += 0.01;
		this.zOffset += 0.01;
		console.log(this.model.z)
		
		this.model.nudge(xMovement,this.y,zMovement);
    
  }
}

//Enemy class
function Enemy(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  this.moving = false;
  this.prevX = random(-2,2);
  this.prevY = random(-2,2);
  this.prevZ = random(-2,2);
  
  this.speciesCollected = 0;
  
  this.model = new DAE({asset:"model4", x:this.x, y:this.y,z:this.z});
  world.add(this.model);

  this.move = function(planet){
    this.model.nudge(this.prevX, this.prevY, this.prevZ);
    var randomX = random(-1.5, 1.5);
    var randomY = random(-1.5, 1.5);
    var randomZ = random(-1.5, 1.5);
    
    //go in the same direction 
    if(randomX < 0 && this.prevX > 0 || randomX > 0 && this.prevX < 0){
      randomX = -randomX;
    }
    if(randomY < 0 && this.prevY > 0 || randomY > 0 && this.prevY < 0){
      randomY = -randomY;
    }
    if(randomZ < 0 && this.prevZ > 0 || randomZ > 0 && this.prevZ < 0){
      randomZ = -randomZ;
    }
    this.prevX = randomX;
    this.prevY = randomY;
    this.prevZ = randomZ; 
    for(var i = 0; i < planets.length; i++){
      var planet = planets[i];
      if(dist(this.model.x, this.model.y, this.model.z, planet.body.x, planet.body.y, planet.body.z) < 100){
        console.log("Alien is near planet!");
        this.collect(planet);
      }
    }

  }
  this.collect = function(planet){
    this.speciesCollected++;
    console.log("Alien got a planet!");
    console.log("removing ring");
    if(planet.ring){   
      var index = rings.indexOf(planet.ring);
      //rings = rings.splice(index, 1);
      //planet.container.removeChild(this.ring);
    }
    console.log("removing container");
    //world.remove(planet.container);
    var index = planets.indexOf(planet);
    //planets = planets.splice(index, 1);
    this.prevX = random(-2,2);
    this.prevY = random(-2,2);
    this.prevZ = random(-2,2);
  }
}


function Planet(xPos,yPos,zPos,r,g,b){
  this.x = xPos;
  this.y = yPos;
  this.z = zPos;
  this.inhabitants = [];
  this.containsLife = false;
  this.onPlanet = false; 
  this.plane; 
  this.visited = false;
  this.toLand = false;
  
  this.r = r;
  this.g = g;
  this.b = b;
  
  this.radius = random(70,120);
  this.size = random(50,80);
  
  var num = int(random(0,2));
  if(num == 0){
    this.material = "rock";
  }
  else if(num == 1){
    this.material = "stone";
  }
  
  this.container = new Container3D({x:this.x, y:this.y, z:this.z});
  
  var ringProb = int(random(0,100));
  
  /*
  Rings for planets, should they spin or not?
  */
  if(ringProb > 90){
    
    this.ring = new Ring({
    x:this.x,
    y:this.y,
    z:this.z,
    red:255,
    green:255,
    blue:255,
    opacity:0.3,
    rotationX:45,
    //rotationY:45,
    radiusInner:this.radius+10,
    radiusOuter:this.radius+20
  })
  this.container.addChild(this.ring);
  // world.add(this.ring)
  rings.push(this.ring);
    
  }
  
  
  
  
  this.body = new Sphere({
    x:this.x,
    y:this.y,
    z:this.z,
    red:this.r,
    green:this.g,
    blue:this.b,
    asset:this.material,
    metalness:0.5,
    rotationY:45,
    rotationX:45,
    repeatX:10,
    repeatY:10,
    toLand : false,
    radius:this.radius,
    clickFunction : function(e){
      
      warp(e)
      
    }
  });
  this.container.addChild(this.body);
  world.add(this.container);
  
  this.addObj = function(obj){
    this.container.addChild(obj);
  }
  
  this.addLife = function(modelName){
    var myDAE = new DAE({asset:modelName, x:xPos+30, y:yPos+30,z:zPos+30});
    this.inhabitants.push(myDAE);
		this.container.addChild(myDAE);
		this.containsLife = true; 
    
  }
  
  this.displayLife = function(){
    //for(i = 0; i < this.inhabitants.length; i++){
      var xPos = random(-40,40);
      var zPos = random(-40,40);
      var num = int(random(0,4));
      var name = "";
      if(num == 0){
        name = "model1"
      }
      else if(num ==1 ){
        name = "model2";
      }
      else if(num == 2){
        name = "model3";
      }
      else if(num == 3){
        name = "model3";
      }
      
      var myDAE = new Alien(this.x+xPos,this.y+2,this.z+zPos,name);
      //var myDAE = new DAE({asset:'model1', x:this.x, y:this.y+2,z:this.z+10});
      //myDAE.displayForm()
      //lifeForms.push(myDAE)
    //}
  }
  
  this.generateWorld = function(){
    stopSound(rocketSound);
    //this.world = new World('VRScene');
    console.log("SETTING UP WORLD");
    onPlanet = true;
    this.visited = true;
    this.onPlanet = true; 
    world.setFlying(false);
    this.plane = new Plane({
						x:this.x, y:this.y, z:this.z, 
						width:200, height:200,
						red:this.r,green:this.g,blue:this.b,
						asset:this.material,
						repeatX: 100,
						repeatY: 100,
						rotationX:-90
					   });
					   
		this.displayLife();
		//remove the planet and its ring from the world so it doesn't show up when you're on the plane 
		if(this.ring){   
      var index = rings.indexOf(this.ring);
       rings = rings.splice(index, 1);
       this.container.removeChild(this.ring);
    }
     console.log("removing container");
     world.remove(this.container);
    world.add(this.plane);
    
    this.atmosphere = new Sphere({
      x:this.x, y:this.y, z:this.z,
      red:0,
      green:0,
      blue:129,
      radius:this.radius*20,
      opacity:0.6,
      asset:'planetSky',
      roughness:0.7
    })
    world.add(this.atmosphere);
    
    var pos = world.getUserPosition();
    world.setUserPosition(this.plane.x,this.plane.y+3,this.plane.z)
}
  this.removeWorld = function(plane){
    this.onPlanet = false;
    world.setFlying(true);
    onPlanet = false;
    world.remove(this.plane);
    world.remove(this.atmosphere);
    console.log("removing ring");
    if(this.ring){   
      var index = rings.indexOf(this.ring);
      //rings = rings.splice(index, 1);
      //this.container.removeChild(this.ring);
    }
    console.log("removing container");
    //world.remove(this.container);
    var index = planets.indexOf(this);
    //this.visible = false;
    //planets = planets.splice(index, 1);
    //world.setUserPosition(0,0,0) //dirty fix to fix the special effect
    //world.setUserPosition(this.x,this.y,this.z)
  }
 
  //Code to check if the user is close enough to enter a planet 
  this.calculateDistance = function(){
    var pos = world.getUserPosition();
    var distance = dist(this.x,this.y,this.z,pos.x,pos.y,pos.z)
    
    this.distance = distance;
    
    if(this.body.toLand && world.getFlying() && !this.visited){
      //if(this.containsLife){
        //console.log("NEAR PLANET");
        //ship.velocity = 0;
        //promptUser(this);
        currentPlanet = this;
        //world.setUserPosition(this.x,this.y+2,this.z) //Teleports user to the planet currently
       // warp(this.body);
       this.generateWorld();
         //TODO: move this into the 'land' graphic's click function. 
      //}
    }else if(onPlanet && this.onPlanet && this.distance > 100){ //remove plane when the user moves away from it 
      console.log("off planet");  
      this.removeWorld(this.plane);
    }
    
  }
  
  this.spin = function(num){
    this.body.spinY(num);
    this.body.spinX(num);
    if(this.ring){
      //this.ring.spinY(num);
    this.ring.spinY(num);
      
    }
    
  }
}


//prompt the user and ask them if they want to 'land' on the planet or not 
//right now, they land whether or not they want to 
function promptUser(planet){
  ship.velocity =0;
  var player = world.getUserPosition();
	
	landPlane = new Plane({
    x: player.x,
    y: player.y,
    z: -100,
    width: 50,
    height:50,
    asset: 'land',
    land: false,
    clickFunction: function(e){
      landOnPlanet = true;
    }
    //rotationX:-90
  })
	
	world.camera.holder.appendChild(landPlane.tag);

  
}

function playSound(song){
  if(song.isPlaying()){
    //song.stop();
  }
  else{
    song.play();
  }
}

function stopSound(song){
  if(song.isPlaying()){
    song.stop();
  }
  
}

function mainGame(){
  
  if(amountOfForms == 3){
    gameState++;
  }
  
  playSound(bgm);
  ship.move();
  ufo.move();
  //ship.interact(planets);
	for(var i = 0; i<planets.length;i++){
  	 planets[i].calculateDistance();
	 if(planets[i]){
   	 planets[i].spin(1);
	 }

	}
	var pos = world.getUserPosition();
	currentPosition = pos;
	
	if(onPlanet){
	  for(var i =0; i< lifeForms.length;i++){
	    //lifeForms[i].move();
	    lifeForms[i].interact();
	    lifeForms[i].model.spinY(1);
	  }
	  
	}

	// now evaluate
	if (pos.x > 5000) {
		world.setUserPosition(-5000, pos.y, pos.z);
	}
	else if (pos.x < -5000) {
		world.setUserPosition(5000, pos.y, pos.z);
	}
	if (pos.z > 5000) {
		world.setUserPosition(pos.x, pos.y, -5000);
	}
	else if (pos.z < -5000) {
		world.setUserPosition(pos.x, pos.y, 5000);
	}

  
}
  
  
/*
Function to reset the game
*/
function checkScore(){
  var player = world.getUserPosition();

  if(amountOfForms == 3 || playerForms == 3){
     console.log("resetting");
  currentPlanet.removeWorld();
    amountOfForms = 0;
    playerForms = 0;
    world.setUserPosition(0,0,0);
    var landPlane = new Plane({
    x: player.x,
    y: player.y,
    z: player.z-100,
    width: 50,
    height:50,
    asset: 'land'
    //rotationX:-90
  })
	
	world.camera.holder.appendChild(landPlane.tag);
	
	
  }
}
  
  
function warp(thisBox){
  ship.velocity = 0;
          // get the user's position
        var up = world.getUserPosition();

        // get this box's position
        var ap = thisBox.getPosition();

        // compute the difference between the two and arrange the warp container
        // to sit exactly between the user and the clicked box
        var xDiff = abs(up.x - ap.x);

        if (ap.x < up.x) {
          warpContainer.setX(ap.x + 0.5 * xDiff);
        } else {
          warpContainer.setX(ap.x - 0.5 * xDiff);
        }

        var yDiff = abs(up.y - ap.y);
        if (ap.y < up.y) {
          warpContainer.setY(ap.y + 0.5 * yDiff);
        } else {
          warpContainer.setY(ap.y - 0.5 * yDiff);
        }

        var zDiff = abs(up.z - ap.z);
        if (ap.z < up.z) {
          warpContainer.setZ(ap.z + 0.5 * zDiff);
        } else {
          warpContainer.setZ(ap.z - 0.5 * zDiff);
        }


        // force the warp container to face the clicked box (this will rotate it accordingly)
        warpContainer.tag.object3D.lookAt(thisBox.tag.object3D.position);
        

        // compute the distance between the user and the clicked box
        var d = dist(ap.x, ap.y, ap.z, up.x, up.y, up.z);
        console.log(d)

        // compute how big the warp cylinder needs to be to form a full "tunnel" between
        // the user and the clicked box
        var newScale = d / 10;
        warpCylinder.setScaleY(newScale);

        // make the warp cylinder invisible 
        warpCylinder.setOpacity(0);

        // compute how long it will take to get to the box
        var timeToWarp = map(d, 0, 1500, 0, 2000);
        var startWarpTime = millis();

        // now start a slide event
        world.slideToObject(thisBox, timeToWarp, function() {

            // first half of the journey - the warp cylinder should fade in
            if (millis() < startWarpTime + timeToWarp * 0.8) {
              warpCylinder.setOpacity(warpCylinder.getOpacity() + 0.02);
            }
            // second half of the jourly - the cylinder should fade out
            else {
              warpCylinder.setOpacity(warpCylinder.getOpacity() - 0.0005);
            }
          },

          // when the user arrives at the destination
          function() {
            //onPlanet = true;
            
        //thisBox.toLand = true;
            warpCylinder.setOpacity(0);
            console.log("DONE");
          }

        );


  
}
