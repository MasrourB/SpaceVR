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
 * Get movement of lifeforms working 
 * 
 * 
 */

// variable to hold a reference to our A-Frame world
var world;
var acceleration = 0.01;
var velocity = 0;
var landPlane;

var universe = '#';
var planets = [];
var rings = [];
var ship;

var gameState = 0;
var onPlanet = false;
var currentPlanet;

var currentPosition;

var amountOfForms = 0;

var lifeForms = [];

function setup() {
	// no canvas needed
	noCanvas();
	
	
  //questionContainer.addChild(landPlane);
   
	

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');
	
	var player = world.getUserPosition();
	
	var landPlane = new Plane({
    x: player.x,
    y: player.y,
    z: -100,
    width: 50,
    height:50,
    asset: 'land',
    land: false,
    clickFunction: function(e){
      e.land = true;
    }
    //rotationX:-90
  })
	
	//world.camera.holder.appendChild(landPlane.tag);

	world.setFlying(true);

	for (var i = 0; i < 100; i++) {
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
  
      if(i <40){
        //var myDAE = new DAE({asset:'model1', x:x+20, y:y+20,z:z+20});
    	  //planet.addLife('model1');
      }
      if(i <20){
        //var star = new Star(x/2,y/2,z/2,r,g,b);
        //world.add(star.body);
      }
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
	 planets[i].spin(1);
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
    metalness:0.25,    brightness:90
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
      world.remove(this.model)
      console.log("got")
      
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
  
  this.radius = random(30,70);
  this.size = random(50,80);
  
  var num = int(random(0,2));
  if(num == 0){
    this.material = "rock"
  }
  else if(num == 1){
    this.material = "stone"
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
  world.add(this.ring)
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
    repeatX:3,
    repeatY:3,
    toLand : false,
    radius:this.radius,
    clickFunction : function(e){
      
      e.toLand = true;
      console.log(e.toLand)
      
    }
  });
  this.container.addChild(this.body);
  
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
        name = "model3"
      }
      else if(num == 3){
        name == "model3";
      }
      
      var myDAE = new Alien(this.x+xPos,this.y+2,this.z+zPos,name)
      //var myDAE = new DAE({asset:'model1', x:this.x, y:this.y+2,z:this.z+10});
      //myDAE.displayForm()
      //lifeForms.push(myDAE)
    //}
  }
  
  this.generateWorld = function(){
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
    world.add(this.plane);
}
  this.removeWorld = function(plane){
    this.onPlanet = false;
    world.setFlying(true);
    onPlanet = false;
    world.remove(this.plane);
  }
 
  //Code to check if the user is close enough to enter a planet 
  this.calculateDistance = function(){
    var pos = world.getUserPosition();
    var distance = dist(this.x,this.y,this.z,pos.x,pos.y,pos.z)
    
    this.distance = distance;
    
    if(this.body.toLand && world.getFlying() && !this.visited){
      //if(this.containsLife){
        console.log("NEAR PLANET");
        ship.velocity = 0;
        //promptUser(this);
        onPlanet = true;
        currentPlanet = this;
        world.setUserPosition(this.x,this.y+3,this.z) //Teleports user to the planet currently
        this.generateWorld(); //TODO: move this into the 'land' graphic's click function. 
      //}
    }else if(this.onPlanet && this.distance > 100){ //remove plane when the user moves away from it 
    console.log("off planet")
      this.removeWorld(this.plane);
    }
    
  }
  
  this.spin = function(num){
    this.body.spinY(num);
    this.body.spinX(num);
    if(this.ring){
      //this.ring.spinY(num);
    this.ring.spinX(num);
      
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
      e.land = true;
    }
    //rotationX:-90
  })
	
	world.camera.holder.appendChild(landPlane.tag);

  
}

