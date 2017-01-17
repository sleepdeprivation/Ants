
var GFX = function(data){

	this.map = data.simulation.map;
	this.antlist = data.simulation.antlist;
	this.food = data.simulation.food;

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
