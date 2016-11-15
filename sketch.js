// variable to hold a reference to our A-Frame world
var world;

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
		var x = random(-100, 100);
		var y = random(-100,100);
		var z = random(-100, 100);
		
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
							asset:t,
							clickFunction: function(theBox) {
								// update color
								theBox.setColor( random(255), random(255), random(255) );
								
								// move the user toward this box over a 2 second period
								// (time is expressed in milliseconds)
								world.slideToObject( theBox, 2000 );
							}
		});
		
		// add the box to the world
		world.add(b);
	}
	
	
	
	// create a bunch of boxes in the sky as well
	
	
	
		
		
}

// keep track of how much to change scale by
var scaleChange = 0.01;

function draw() {

	
}
