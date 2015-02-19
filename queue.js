

/*
	Queue implementation circular array style
*/
function queue(maxSize){

	this.queue = [];
	this.maxSize = maxSize+1;

	this.currentSize = 0;

	this.index = 0;

	this.push = function(node){
		if(((this.currentSize+1)%this.maxSize) != 0){	//adding 1 would not put us over
			this.queue[this.index%this.maxSize] = node;
			//console.log(this.queue);
			this.index += 1;
			this.currentSize += 1;
			return true;
		}

		return false;

	}
	this.pop = function(){
		if(this.currentSize > 0){	//if the queue is empty then don't do anything
			this.currentSize = (this.currentSize-1);
			//shift by the max queue size cuz % operator does weird things with negative numbers
			return this.queue[( ( (this.index)-(this.currentSize+1) ) + this.maxSize)%this.maxSize];
		}
		return null;
	}

	this.peek = function(){
		if(this.currentSize > 0){	//if the queue is empty then don't do anything
			//shift by the max queue size cuz % operator does weird things with negative numbers
			return this.queue[( ( (this.index)-(this.currentSize) ) + this.maxSize)%this.maxSize];
		}
		return null;
	}
	this.getQueue = function(){
		var retval = [];
		for(var ii = 0; ii < this.currentSize; ii++){
			retval.push( this.queue[( ii + ( (this.index)-(this.currentSize) ) + this.maxSize)%this.maxSize]);
		}
		return retval;
	}
}



/*
	//queue test
		q = new queue(8);
		q.push(23);
		q.push(23);
		q.push(23);
		q.push(23);
		q.push(23);
		q.push(23);
		q.push(42);
		q.push(23);

		console.log(q.getQueue());

		console.log(q.pop());

		console.log(q.getQueue());

		console.log(q.pop());
		console.log(q.pop());

		console.log(q.getQueue());

		console.log(q.pop());
		console.log(q.pop());
		console.log(q.pop());
		console.log(q.pop());
		console.log(q.pop());
		console.log(q.pop());
		console.log(q.pop());

*/
