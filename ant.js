
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

