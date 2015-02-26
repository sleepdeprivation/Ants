


/*
	Generate ints, generate doubles
*/

function rng(min, max){
	return Math.floor(Math.random() * (max - min) + min);
}
function dRNG(min, max){
	return Math.random() * (max - min) + min;
}

/*
	Need an ordered pair
*/
function Point(x, y){
	this.x = x;
	this.y = y;
}


/*
	Food object we can place
*/
function Food(point){
	this.location = point;
	this.eaten = false;
	this.size = 20;
}


/*
	An ant object
	origin will be where it spawns, and also where it thinks its nest is
	Speed and orientation are self explanatory
	Ant will die when it's health reaches zero.
	There is a boolean to indicate whether the ant is in "foraging mode" or not
	There is a boolean to indicate whether the ant is holding food or not
*/
function Ant(origin, boundX, boundY){
	this.location = new Point(origin.x, origin.y);
	this.health = 1000;
	this.speed = 3;
	this.orientation = dRNG(0, 2*Math.PI);
	this.foraging = true;
	this.food = false;
	//console.log(this.orientation);
	
	/*
		Generate a random orientation...
	*/
	this.dO = function(){
		return dRNG(-Math.PI/16, Math.PI/16);
	}

	//did we hit an obstacle
	this.obstacle = false;
	
	/*
		The contents of this function change frequently
		Right now we're taking suggestions and changing our orientation based on it
		if we have not hit an obstacle
		
		This function essentially defines an ants behavior, so it's kind of hard to get right
	*/
	this.update = function(suggestion, map){
		//decide whether to take a suggestion
		if(suggestion != null && !this.obstacle){
			this.orientation = suggestion;
		}
		//the speed at which we're going
		var speed = rng(0, this.speed)
		//where we're going
		var tempX = this.location.x + (speed*Math.cos(this.orientation));
		var tempY = this.location.y + (speed*Math.sin(this.orientation));
		//nothing solid where we're going
		if(map.get(Math.floor(tempX), Math.floor(tempY)) == false){
			this.location.x = tempX;
			this.location.y = tempY;
			this.obstacle = false;
		}else{//we hit a wall, turn 90 degrees
			if(rng(0, 1) == 0){	//to the left
				this.orientation += Math.PI/2;
			}else{			//to the right
				this.orientation -= Math.PI/2;
			}
			this.obstacle = true;	//remember we hit a wall
		}

		this.health-= rng(0, 5);

		//add some wiggle to the angle (produces a meandering effect)
		if(suggestion == null){
			this.orientation += this.dO();
		}
	}
}

/*
	The ants lay down paths, and you can ask any one if it's close to you
	I think they should exert influence based on proximity in the future
	Health is worthless right now
	The way path managers come and go it might not be in the future tho
*/
function Path(x, y, o){
	this.location = new Point(x, y);
	this.orientation = o;
	this.r = 30;
	this.health = 15;
	
	//check a circular area of radius r, defined above
	this.inNeighborhood = function(x, y){
		if(	Math.pow(x-this.location.x, 2) + Math.pow(y-this.location.y, 2) < this.r ){
			this.health = 15;
			return true;
		}
		return false;
	}
}

/*
	Another failed attempt to efficiently work with scent trails
*/
function PathMap(x, div){
	this.list = [];
	this.x = x;
	this.div = div;

	var temp = [];
	for(var ii = 0; ii < Math.floor(x/div); ii++){
		this.list.push([]);
	}

	this.push = function(path){
		var index = Math.floor(path.location.x/this.div);
		this.list[index].push(path);
	}
	this.get = function(x){
		var index = Math.floor(x/this.div);
		return this.list[index];
	}
}

/*
	Put a solid object down somewhere
*/
function placeRect(map, startX, endX, startY, endY, value){
	for(var ii = startX; ii < endX; ii++){
		for(var kk = startY; kk < endX; kk++){
			map.arr[ii][kk] = true;
		}
	}
}

/*
	Runs the whole show
*/
function Simulation(sizeX, sizeY){

	//maximum 1000 ants
	this.antlist = new queue(1000);
	//this.pathlist = new PathMap(sizeX, 16);
	
	//the current scent trail manager -- we'll see how long it lasts
	this.pathman = new PathManager(sizeX, sizeY);

	//how big is the map
	this.dimension = new Point(sizeX, sizeY);
	
	//where will the ants be spawning
	this.origin = new Point(sizeX/2, sizeY/2);

	//this is the map
	this.map = new XYArray(sizeX, sizeY, false);
	
	//put a big solid object down
	placeRect(this.map, this.origin.x-80, this.origin.x-50, this.origin.y, this.origin.y+50);


	//another failed attempt at managing scent trails
	//this.accumulator = new accumulator(sizeX, sizeY);

	//make 1 ant to start
	this.init = function(){
		this.antlist.push(Ant(this.origin));
	}

	//generate an ant and return it
	this.makeAnt = function(where){
		return new Ant(this.origin, this.sizeX, this.sizeY);
	}

	/*
		Get a square of points with size 2*size centered at point where
		return all the points
	*/
	this.adjacencySquare = function(where, size){
		floored = new Point(Math.floor(where.x), Math.floor(where.y));
		retlist = [];
		//more fun than writing out retlist.push 6 times
		for(var ii = -size; ii <= size; ii++){
			for(var kk = -size; kk <= size; kk++){
				if(ii != 0 || kk !=0){
					retlist.push(new Point(floored.x + ii, floored.y + kk));
				}
			}
		}
		return retlist;
	}

	//return the nearest neighbors of point where
	this.adjacencyList = function(where){
		return this.adjacencySquare(where, 1);
	}

	//no food around
	this.food = [];

	/*
		generate an ant
		manage the food on map
		manage ant movements
		
	*/
	this.update = function(){
		if(rng(0, 2) == 1){
			this.antlist.push(this.makeAnt());
			//console.log("made");
			//console.log(this.antlist);
		}

		//food[0] is generated by this system, the rest of the food is left alone
		if(this.food.length == 0 || this.food[0].size <=5){
			this.food[0] = (new Food(new Point(
						rng(this.origin.x-200, this.origin.x+200),
						rng(this.origin.y-200, this.origin.y+200)
						)
					)
					);
		}
		
		//except if it's too small, then it disappears
		for(var ii = 0; ii < this.food.length; ii++){
			if(this.food[ii].size < 3){
				this.food[ii] = this.food[this.food.length-1];
				this.food.pop();
			}
		}

		//let the ants move
		var ant,loc,food;
		for(var ii = 0; ii < this.antlist.currentSize; ii++){
			ant = this.antlist.pop();
			loc = ant.location;
			if(ant == null){continue;}

			//antlist.currentSize*pathlist.length times:
			/*
			var pathlist = this.pathlist.get(loc.x);
			for(var kk = 0; kk < pathlist.length; kk++){
				if(pathlist[kk].inNeighborhood(loc.x, loc.y)){
					ant.orientation = pathlist[kk].orientation;
				}
			}
			*/
			//check if this ant can pick up any nearby food (if it's looking to do so)
			for(var kk = 0; kk < this.food.length; kk++){
				if(	ant.foraging					&&
					ant.location.x > this.food[kk].location.x	&&
					ant.location.x < this.food[kk].location.x+this.food[kk].size
					&&
				  	ant.location.y > this.food[kk].location.y	&&
					ant.location.y < this.food[kk].location.y+this.food[kk].size
				  ){
					this.food[kk].size--;
					this.food[kk].location.x++;
					this.food[kk].location.y++;
					ant.foraging = false;
					//ant.food +=1;
				}
			}

			//check if this ant is near the origin, if it is, switch it to foraging mode
			//(this way, ants that come back with food will turn around and do it again)
			if(	ant.location.x > this.origin.x-3 &&
				ant.location.x < this.origin.x+3
				&&
				ant.location.y > this.origin.y-3 &&
				ant.location.y < this.origin.y+3
			){
				ant.foraging = true;
			}

			//make a suggestion based on scent trails or food location
			var suggestion;
			if(ant.foraging){
				suggestion = this.pathman.get(loc.x, loc.y);
			}else{
				var dx = this.origin.x-ant.location.x;
				var dy = this.origin.y-ant.location.y;
				suggestion = Math.atan(dy/dx);
				if(dx < 0){
					suggestion += Math.PI;
				}
			}
			//let the ant move
			ant.update(suggestion, this.map);
			if(ant.foraging){
				//this.pathman.add(new Path(loc.x, loc.y, ant.orientation));
			}else{
				this.pathman.add(new Path(loc.x, loc.y, ant.orientation + Math.PI));
			}
			
			//this ant is dead... this should probably happen first?
			if(ant.health <= 0){
				if(! ant.foraging){	//drop the food
					food = new Food(new Point(ant.location.x, ant.location.y));
					food.size = 3;
					this.food.push(food);
				}
				//delete ant;	doesn't do what you think it does, apparently
				//ii++;
			}else{
				this.antlist.push(ant);
			}
		}
		
		//randomly destroy scent trails (1 in 8000 chance)
		var loc;
		for(var ii = 0; ii < this.pathman.list.length; ii++){
			loc = this.pathman.list[ii].location;
			if(rng(0, 8000) == 0){
				this.pathman.grid.arr[Math.floor(loc.x)][Math.floor(loc.y)] = null;
			}
		}


	}


	/*
		LADIES AND GENTLEMEN, THE MOST WASTEFUL DRAWING FUNCTION IN THE WORLD
		you won't find a more wasteful drawing function anywhere around here, guaranteed
	*/
	this.drawObstacles = function(ctx3){
		ctx3.fillStyle = "green";
		for(var ii = 0; ii < this.map.dimX; ii++){
			for(var kk = 0; kk < this.map.dimY; kk++){
				if(this.map.get(ii, kk) == true){
					ctx3.fillRect(ii, kk, 1, 1);	//wow what a waste this is...
				}
			}
		}
	}


	/*
	Some drawing stuff
	*/
	this.draw = function(ctx, ctx2){
		var list = this.antlist.getQueue();

		if(ctx2 != null){
			ctx2.fillStyle="rgba(255, 0, 0, 0.1)";
			for(var ii = 0; ii < list.length; ii++){
				if(!list[ii].foraging){
					ctx2.fillRect(list[ii].location.x, list[ii].location.y, 3, 3);
				}
			}
		}

		if(ctx != null){
			ctx.fillStyle="black";
			for(var ii = 0; ii < list.length; ii++){
				ctx.fillStyle = (list[ii].foraging) ? "black" : "blue";
				ctx.fillRect(list[ii].location.x, list[ii].location.y, 3, 3);
			}
		}
		ctx.fillStyle = "blue";
		//console.log(this.food);
		for(var kk = 0; kk < this.food.length; kk++){
			ctx.fillRect(this.food[kk].location.x, this.food[kk].location.y, this.food[kk].size, this.food[kk].size);
		}
	}
}
//////////////////////////garbage dump//////////////////////////




			//console.log(Number(list[ii].location.x));
			//console.log(Number(list[ii].location.y));		
			//ctx.fillStyle = "rgba("+rng(0, 255)+","+0+", "+rng(0, 255)+", 0.01)";
/*
		suggestion = Math.floor(((suggestion/(Math.PI/4)) - Math.PI/8 )%8);	//sort it into one of 8 bins
		console.log(suggestion);
		var dx = 0;
		var dy = 0;
		switch(suggestion){
			case 0:
				dx--;
				dy--;
				break;
			case 1:
				dy--;
				break;
			case 2:
				dx++;
				dy--;
				break;
			case 3:
				dx--;
				break;
			case 4:
				break;
			case 5:
				dx--;
				dy++;
				break;
			case 6:
				dy++;
				break;
			case 7:
				dx++;
				dy++;
				break;

		}*/
/*
	this.getWeight = function(alpha, delta){
		//alpha * 
	}


	this.getTurnBias = function(where, D){


		var x = Math.floor(where.x);
		var y = Math.floor(where.y);
		//get an array from the canvas-accumulator
		var imgd = this.ctx.getImageData(x, y-D, D, D*2);
		var pix = imgd.data;


		var maxD = Math.sqrt(2)*D;
		var curD;
		var dx;
		var dy;
		var arc;

		var bias = 0;
		var index;

		for (var ii = x; ii < x+D; ii++){
			for(var kk = y; kk < y+D; kk++){

				dx = (ii-x);
				dy = (kk-y);

				arc = Math.atan(dy/dx);


				if(arc < 0 && dy < 0){
					//bias left
					bias -= .1;
				}else if(arc > 0 && dx > 0){
					//bias right
					bias += .1;
				}
				continue;
/*
				curD = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				if(curD > maxD){
					curD = 0;
				}else{
					curD = maxD-curD;
				}
				index = ((ii-x) + (kk-y) * imgd.width) * 4;

				//console.log(pix[3]);
				bias += pix[index+3]*curD;
				//alpha
			}
		}
		//console.log(bias);
		return bias;
	}
*/
