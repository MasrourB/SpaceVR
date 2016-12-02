/**
 * Space VR Explorer 
 * Maz & Radhika 
 * 
 * 
 * /

/* TODO: 
 * Prompting user if they want to 'land' on a planet (should be implemented in the promptUser function)
 * Loading 'alien' DAE model when you land on a planet. I guess if you get close enough to the alien you leave the planet 
 * Border recognition for leaving a planet - when the user exits the plane, the plane should revert back to a planet. 
 * Equirectangular image wraparound
 * 
 */

// variable to hold a reference to our A-Frame world
var world;
var acceleration = 0.01;
var velocity = 0;

var universe = '#';
var planets = [];
var ship;

var gameState = 0;

function setup() {
	// no canvas needed
	createCanvas(1000,1000);

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	world.setFlying(true);

	for (var i = 0; i < 50; i++) {
		// pick a location
		var x = random(-random(2000), random(2000));
		var y = random(-random(2000),random(2000));
		var z = random(-random(2000), random(2000));
		
		var r = random(255);
		var g = random(255);
		var b = random(255);

		var container = new Container3D({x:x, y:y, z:z});
		var planet = new Planet(x,y,z,r,g,b);

  	// add the container to the world
  	world.add(planet.container);
  
  	var b = new Sphere({
  							x:x,
  							y:y,
  							z:z,
  							radius: 20,
  							
  							red: r, green: g, blue: b,
  						/*
  							clickFunction: function(theBox) {
  								// update color
  
  
  								// move the user toward this box over a 2 second period
  								// (time is expressed in milliseconds)
  								world.slideToObject( theBox, 2000 );
  							}
  							*/
  		});
  
      if(i <15){
        var myDAE = new DAE({asset:'model1', x:x+20, y:y+20,z:z+20});
    	  planet.addLife('model1');
      }
    	planet.addObj(b);
    	planets.push(planet);
    		// add the box to the world
    		//world.add(b);
    	}
  
    ship = new Ship();
}



function draw() {
  ship.move();
  //ship.interact(planets);
	for(var i = 0; i<planets.length;i++){
	 planets[i].calculateDistance();
	}
	// step 1: get the user's position
	// this is an object with three properties (x, y and z)
	var pos = world.getUserPosition();

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




function Ship(){
  this.acceleration = 0.01;
  this.velocity = 0;
  this.pos = world.getUserPosition();
  
  this.x = this.pos.x;
  this.y = this.pos.y;
  this.z = this.pos.z;
  
  this.move = function(){
    if (mouseIsPressed || touchIsDown) {
      if(this.velocity < 3){
        this.velocity += this.acceleration;
      }
      
		//var pos = world.getUserPosition();
		//world.setUserPosition(pos.x,pos.y+1,pos.z)
	  }
	  world.moveUserForward(this.velocity);
  }
  
  
}

function Planet(xPos,yPos,zPos,r,g,b){
  this.x = xPos;
  this.y = yPos;
  this.z = zPos;
  this.inhabitants = [];
  this.containsLife = false;
  this.onPlanet = false; 
  
  this.r = r;
  this.g = g;
  this.b = b;
  
  this.radius = random(0,30)
  
  this.world;
  
  this.container = new Container3D({x:this.x, y:this.y, z:this.z});
  
  this.body = new Sphere({
    x:this.x,
    y:this.y,
    z:this.z,
    radius:this.radius
  });
  
  this.addObj = function(obj){
    this.container.addChild(obj);
  }
  
  this.addLife = function(modelName){
    var myDAE = new DAE({asset:modelName, x:xPos+30, y:yPos+30,z:zPos+30});
    this.inhabitants.push(myDAE);
		this.container.addChild(myDAE);
		this.containsLife = true; 
    
  }
  
  this.generateWorld = function(){
    //this.world = new World('VRScene');
    console.log("SETTING UP WORLD");
    world.setFlying(false);
    var g = new Plane({
						x:this.x, y:this.y, z:this.z, 
						width:this.radius*40, height:this.radius*40,
						red:this.r,green:this.g,blue:this.b,
						//asset:'rock',
						repeatX: 100,
						repeatY: 100,
						rotationX:-90
					   });
    world.add(g);

}
 
  //Code to check if the user is close enough to enter a planet 
  this.calculateDistance = function(){
    var pos = world.getUserPosition();
    var distance = dist(this.x,this.y,this.z,pos.x,pos.y,pos.z)
    
    this.distance = distance;
    
    if(this.distance < 200 && world.getFlying()){
      if(this.containsLife){
        console.log("NEAR PLANET");
        ship.velocity = 0;
        promptUser();
        this.generateWorld();
      }
    }
    
  }
  
  this.spin = function(){
    this.inhabitants[0].spinY(1);
  }
}


//prompt the user and ask them if they want to 'land' on the planet or not 
//right now, they land whether or not they want to 
function promptUser(){
  console.log("prompting user");
  textSize(20);
  text("Land?", 500,500);
  
}

