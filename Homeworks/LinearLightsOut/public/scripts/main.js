var rhit = rhit || {};
rhit.PageController = class {
	constructor() {
		//enable the onclick listeners
		this.game = new rhit.LightsOutGame();
		
		const squares = document.querySelectorAll(".square");
		for(const square of squares){
			square.onclick = (event) => {
				const buttonIndex = parseInt(square.dataset.buttonIndex);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
			}
		}
		document.querySelector("#newGameButton").onclick = (event) => {
			this.game = new rhit.LightsOutGame();
			this.updateView();
		}
		this.updateView();
	
	}

	updateView() {
		const squares = document.querySelectorAll(".square");
		squares.forEach((square, index) => {
			square.innerHTML = this.game.getMarkAtIndex(index);
			
			if(square.innerHTML == 1){
				square.style.backgroundColor = "Orange";
			}else{
				square.style.backgroundColor = "Black";
			}
		});
		document.querySelector("#gameStateText").innerHTML = this.game.state;
		
	}
};


rhit.LightsOutGame = class {

    static NUM_BUTTONS = 7;

    static LIGHT_STATE = {
        ON: "1",
        OFF: "0",
    }
 
    constructor() {
        this.buttonValues = [];
		this.state = "Make the buttons Match";
		for(let k = 0; k<7; k++){


			if(Math.floor(Math.random()*2) == 0){
				this.buttonValues[k] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			}else{
				this.buttonValues.push(rhit.LightsOutGame.LIGHT_STATE.ON);
			}
		}
        this.numPresses = 0;
		this.gameOver = false;
	}
	pressedButtonAtIndex(buttonIndex) {
		console.log(buttonIndex);
		
		if(this.gameOver == false){
			if(buttonIndex == 0){
				this.numPresses++;
				// console.log(this.numPresses);
	
				if(this.buttonValues[buttonIndex+1] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex+1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
				}else{
					this.buttonValues[buttonIndex+1] = rhit.LightsOutGame.LIGHT_STATE.ON;
	
				}
	
				if(this.buttonValues[buttonIndex] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex] = rhit.LightsOutGame.LIGHT_STATE.OFF;
				}else{
					this.buttonValues[buttonIndex] = rhit.LightsOutGame.LIGHT_STATE.ON;
	
				}
			}
	
			if(buttonIndex == 6){
				this.numPresses++;
				// console.log(this.numPresses);
	
				if(this.buttonValues[buttonIndex-1] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex-1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
				}else{
					this.buttonValues[buttonIndex-1] = rhit.LightsOutGame.LIGHT_STATE.ON;
	
				}
	
				if(this.buttonValues[buttonIndex] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex] = rhit.LightsOutGame.LIGHT_STATE.OFF;
				}else{
					this.buttonValues[buttonIndex] = rhit.LightsOutGame.LIGHT_STATE.ON;
	
				}
			}
	
			if(buttonIndex > 0 && buttonIndex < 6){
				this.numPresses++;
				// console.log(this.numPresses);
				if(this.buttonValues[buttonIndex-1] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex-1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
					
				}else{
					this.buttonValues[buttonIndex-1] = rhit.LightsOutGame.LIGHT_STATE.ON;
				}
				
				if(this.buttonValues[buttonIndex] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex] = rhit.LightsOutGame.LIGHT_STATE.OFF;
				}else{
					this.buttonValues[buttonIndex] = rhit.LightsOutGame.LIGHT_STATE.ON;
				}
	
				if(this.buttonValues[buttonIndex+1] == rhit.LightsOutGame.LIGHT_STATE.ON){
					this.buttonValues[buttonIndex+1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
				}else{
					this.buttonValues[buttonIndex+1] = rhit.LightsOutGame.LIGHT_STATE.ON;
				}
			}
		}
		
		this._checkForGameOver();
		
	}
	

	_checkForGameOver(){


		const finish = [];
		finish.push(this.buttonValues[0]+this.buttonValues[1]+this.buttonValues[2]+this.buttonValues[3]+this.buttonValues[4]+this.buttonValues[5]+this.buttonValues[6]);


		
		for(const finished of finish){
			if(finished == "1111111" || finished == "0000000"){
				this.state = "You Won in "+this.numPresses+" !";
				this.gameOver = true;
			}else{
				this.state = "You have taken "+this.numPresses+" moves so far!";

			}

	}	
	}

	getMarkAtIndex(buttonIndex){
		return this.buttonValues[buttonIndex];
	}
	
	getState(){
		return this.state;
	}



};

rhit.main = function () {
	console.log("Ready");
	new rhit.PageController(); 


	// $(".square").click((event) => {

	// 	// const dataColor = $(event.target).data("color");

	// 	rhit.updateColor("Red");

	// });
};

rhit.main();
