// variable to hold a reference to our A-Frame world
var world;
var universe = '#'
function setup() {
	// no canvas needed
	noCanvas();
	
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');
	
	// now that we have a world we can add elements to it using a series of wrapper classes
	// these classes are discussed in greater detail on the A-Frame P5 documentation site
	// http://cs.nyu.edu/~kapp/courses/cs0380fall2016/aframep5.php
	
	// what textures can we choose from?
	var textures = ['iron', 'gold', 'stone'];

	// create lots of boxes
	for (var i = 0; i < 350; i++) {

		// pick a location
		var x = random(-random(2000), random(2000));
		var y = random(-random(2000),random(2000));
		var z = random(-random(2000), random(2000));
		
		// pick a random texture
		var t = textures[ int(random(textures.length)) ];
		
		// create a box here
		// note the inclusion of a 'clickFunction' property - this function will be invoked
		// every time this box is clicked on.  note that the function accepts a single argument
		// -- this is a reference to the box that was clicked (essentially the entity itself)
		var b = new Sphere({
							x:x,
							y:y,
							z:z,
							radius: 3.5,
						// 	red: random(255), green: random(255), blue: random(255),
							clickFunction: function(theBox) {
								// update color
							
								
								// move the user toward this box over a 2 second period
								// (time is expressed in milliseconds)
								world.slideToObject( theBox, 2000 );
							}
		});
		
		// add the box to the world
		world.add(b);
	}
	
		
}

// keep track of how much to change scale by
var scaleChange = 0.01;

function draw() {
  if (mouseIsPressed || touchIsDown) {
		world.moveUserForward(1);
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
