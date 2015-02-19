

function PathManager(sizeX, sizeY){

	//this.MAXSIZE = 255;

	this.grid = new XYArray(sizeX, sizeY);

	for(var ii = 0; ii < this.grid.dimX; ii++){
		this.grid.arr[ii] = [];
		for(var kk = 0; kk < this.grid.dimY; kk++){
			this.grid.arr[ii].push(null);
		}
	}
	
	

	this.draw = function(ctx){
		for(var ii = 0; ii < this.grid.dimX; ii++){
			for(var kk = 0; kk < this.grid.dimY; kk++){
				ctx.fillStyle = "rgba(255, 0, 0, "+this.grid.arr[ii][kk]/255+")";
				ctx.fillRect(ii, kk, 3, 3);
			}
		}
	}

}
