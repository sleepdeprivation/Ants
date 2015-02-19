
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
	

	//should never use this
	this.draw = function(ctx){
		for(var ii = 0; ii < this.grid.dimX; ii++){
			for(var kk = 0; kk < this.grid.dimY; kk++){
				ctx.fillStyle = "rgba(255, 0, 0, "+this.grid.arr[ii][kk]/255+")";
				ctx.fillRect(ii, kk, 3, 3);
			}
		}
	}

}
