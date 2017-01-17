

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
	Maintain a list for quickly traversing all the paths available
	Keep a grid for quickly accessing a very specific path
*/
function PathManager(sizeX, sizeY){

	//this.MAXSIZE = 255;

	this.grid = new XYArray(sizeX, sizeY);

	this.list = [];

	//big giant grid of nullpointers
	for(var ii = 0; ii < this.grid.dimX; ii++){
		this.grid.arr[ii] = [];
		for(var kk = 0; kk < this.grid.dimY; kk++){
			this.grid.arr[ii].push(null);
		}
	}

	//add a path object to the list, and also to the grid in the right location
	this.add = function(x){
		this.list.push(x);
		this.grid.arr[Math.floor(x.location.x)][Math.floor(x.location.y)] = x.orientation;
	}
	
	this.get = function(x, y){
		return this.grid.get(Math.floor(x),Math.floor(y));
	}

}
