
var GFX = function(data){

	//console.log(data);

	this.map = data.simulation.map;
	this.antlist = data.simulation.antlist;
	this.food = data.simulation.food;
	
	this.ctx = [data.ctx1, data.ctx2, data.ctx3];

	/*
		LADIES AND GENTLEMEN, THE MOST WASTEFUL DRAWING FUNCTION IN THE WORLD
		you won't find a more wasteful drawing function anywhere around here, guaranteed
	*/
	this.drawObstacles = function(){
		this.ctx[2].fillStyle = "green";
		for(var ii = 0; ii < this.map.dimX; ii++){
			for(var kk = 0; kk < this.map.dimY; kk++){
				if(this.map.get(ii, kk) == true){
					this.ctx[2].fillRect(ii, kk, 1, 1);	//wow what a waste this is...
				}
			}
		}
	}


	/*
	Some drawing stuff
	*/
	this.draw = function(){
		var list = this.antlist.getQueue();

		if(this.ctx[1] != null){
			this.ctx[1].fillStyle="rgba(255, 0, 0, 0.1)";
			for(var ii = 0; ii < list.length; ii++){
				if(!list[ii].foraging){
					this.ctx[1].fillRect(list[ii].location.x, list[ii].location.y, 3, 3);
				}
			}
		}

		if(this.ctx[0] != null){
			this.ctx[0].fillStyle="black";
			for(var ii = 0; ii < list.length; ii++){
				this.ctx[0].fillStyle = (list[ii].foraging) ? "black" : "blue";
				this.ctx[0].fillRect(list[ii].location.x, list[ii].location.y, 3, 3);
			}
		}
		this.ctx[0].fillStyle = "blue";
		//console.log(this.food);
		for(var kk = 0; kk < this.food.length; kk++){
			this.ctx[0].fillRect(this.food[kk].location.x, this.food[kk].location.y, this.food[kk].size, this.food[kk].size);
		}
	}
}
