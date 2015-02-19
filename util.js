
function XYArray(sizeX, sizeY, defaultV) {

	this.arr = [];
	this.dimX = sizeX;
	this.dimY = sizeY;

	for(var ii = 0; ii < this.dimX; ii++){
		this.arr.push([]);
		for(var kk = 0; kk < this.dimY; kk++){
			this.arr[ii][kk] = defaultV;
		}
	}

	this.boundsCheck = function(x,y){
		return (x >= 0 && x < this.dimX) && (y >= 0 && y < this.dimY);
	}


	this.get = function(x, y){
		if(this.boundsCheck(x,y)){
			//console.log(x,y);
			return this.arr[x][y];
		}else{
			return null;
		}
	}

	this.getCircular = function(x, y){
		var exe = (x+this.dimX)%this.dimX;
		var wye = (y+this.dimY)%this.dimY;
		if(this.boundsCheck(exe,wye)){
			return this.arr[exe][wye];
		}else{
			return null;
		}
	}

}
