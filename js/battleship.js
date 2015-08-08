
//Battleship game. 
// You can find more information in readme.txt

//this is view block (using mvc terms), responsible for displaying messages , hits and miss 
var view = {
	// displayMessage takes msg string to display it on a screen
	displayMessage: function (msg) {
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},
	//displayHit and displayMiss takes location - string of numbers (for example "201"), 
	//and marks cell on the boars (stylize table td)
	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		if (model.gameOver){
			return false;
		}
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

//this is model block (using mvc terms), responsible for storing information about game
var model = {
	boardSize: 10,
	playerShipCells: [],
	computerShipCells: [],
	numShips: {
		player: 10,
		computer: 10
	},
	//counter ship that sunk
	shipsSunk: {
		player: 0,
		computer: 0
	},
	gameOver: false,
	foundShips: [],

	//ships objects stores two objects: a player and a computer, this objects store information about ships
	//shipLengh - how many cell takes the ship
	// side - player side
	// locations  stores an array of string of numbers (["222", "223", "224"]), these numbers - coordinates ship location
	// through them you can access the table (td id-s)
	//hits - stores array of two values: "" and "hit", hit indexes apropriate to location indexes.  hit elements reflect ship damage

	ships: { player: [{ shipLength: 4, side: "player", locations: [0, 0, 0,0], hits: ["", "", "", ""]},
			 		  { shipLength: 3, side: "player", locations: [0, 0, 0], hits: ["", "", ""] },
			 		  { shipLength: 3, side: "player", locations: [0, 0, 0], hits: ["", "", ""] },
			 		  { shipLength: 2, side: "player", locations: [0, 0], hits: ["", ""] },
			 		  { shipLength: 2, side: "player", locations: [0, 0], hits: ["", ""] },
			 		  { shipLength: 2, side: "player", locations: [0, 0], hits: ["", ""] },
			 		  { shipLength: 1, side: "player", locations: [0], hits: [""] },
			 		  { shipLength: 1, side: "player", locations: [0], hits: [""] },
					  { shipLength: 1, side: "player", locations: [0], hits: [""] },
			 		  { shipLength: 1, side: "player", locations: [0], hits: [""] }],
			computer: [
			 { shipLength: 4, side: "computer", locations: [0, 0, 0,0], hits: ["", "", "", ""]},
			 { shipLength: 3, side: "computer", locations: [0, 0, 0], hits: ["", "", ""] },
			 { shipLength: 3, side: "computer", locations: [0, 0, 0], hits: ["", "", ""] },
			 { shipLength: 2, side: "computer", locations: [0, 0], hits: ["", ""] },
			 { shipLength: 2, side: "computer", locations: [0, 0], hits: ["", ""] },
			 { shipLength: 2, side: "computer", locations: [0, 0], hits: ["", ""] },
			 { shipLength: 1, side: "computer", locations: [0], hits: [""] },
			 { shipLength: 1, side: "computer", locations: [0], hits: [""] },
			 { shipLength: 1, side: "computer", locations: [0], hits: [""] },
			 { shipLength: 1, side: "computer", locations: [0], hits: [""] }
			 ]
			},

	//
	//this function, takes guess - possible ship location coordinates, target - ship for attacking
	//guess - string. ex.: "244" target - string, takes two values: "computer" and "playes" 
	fire: function(guess, target) {
		if (guess==(-1)){
			return true;
		}
		for (var i = 0; i < this.numShips[target]; i++){ //looking for all enemys ships 
			var ship = this.ships[target][i];
			var index = ship.locations.indexOf(guess);
			 // check match guess (fire coordinates) with coordinates of the ship
			if (index >= 0) {
				ship.hits[index] = "hit"; 
				view.displayHit(guess);
				view.displayMessage("HIT!!!");
				if (this.isSunk(ship)){//check if the ship is sunk
					view.displayMessage("You sunk my battleship");
					this.shipsSunk[ship.side]++; 
					if (this.shipsSunk[ship.side] == 10) {
						finishGame(ship.side);   //end of the game occurs when all ships dead
						console.log(ship.side);
					}
					if (ship.side == "player"){ // if ship is sunk then take off "injured" mark (for AI)
						controller.injured = false;
						model.foundShips = model.foundShips.concat(controller.injuredHits);
						model.foundShips.push(guess);
					}
				} else {
					if (ship.side == "player"){ // if ship is damaged, but not destroyed, then we put "injured" mark 
						controller.injured = true; // for assumption of ship location
					}
				}
				return true;
			}

		}
		view.displayMiss(guess);
		view.displayMessage("You Missed ");
		return false;
	},
	//cheks if ship is sunk
	isSunk: function(ship) {
		for (var i = 0; i < ship.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	//generate random ship coordinates , takes arg. shipSide - string "player" or "computer" 
	//to generate for appropriate player
	generateShipLocations: function(shipsSide) {
		var locations;
		var sideLocations = [];
		var sideCells = [];
		for (var i = 0; i < this.numShips[shipsSide]; i++) {
			do {
				locations = this.generateShip(i, shipsSide);
			} while (this.collision(locations, shipsSide));
			this.ships[shipsSide][i].locations = locations;
			sideLocations.push(locations);
		};

		for (i = 0; i < sideLocations.length; i++)
			for (j = 0; j < sideLocations[i].length; j++)
				sideCells.push(sideLocations[i][j]);

		if (shipsSide == "player") {

			for (var i = 0; i < sideCells.length; i++) {
				playerCell = document.getElementById(sideCells[i]);
				playerCell.className = "visible";
				this.playerShipCells.push(playerCell);
			};

		} else {
			for (var i = 0; i < sideCells.length; i++) {
				computerCell = document.getElementById(sideCells[i]);
				this.computerShipCells.push(computerCell);
			}
		}
	},
	//generates location for the ship
	//shipIndex - index of the ship in ships object
	//shipSide - "player" or "computer"
	//return new ship coordinates
	generateShip: function(shipIndex, shipsSide) {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.ships[shipsSide][shipIndex].shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.ships[shipsSide][shipIndex].shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var hundreds = (shipsSide=="computer") ? "1" : "2";
		var newShipLocations = [];
		for (var i = 0; i < this.ships[shipsSide][shipIndex].shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push( hundreds + row + "" + (col + i));
			} else {
				newShipLocations.push(hundreds + (row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	//check that ships did not encounter
	//locations - string of coordinates for new ship
	collision: function(locations, shipsSide) {
		for (var i = 0; i < this.numShips[shipsSide]; i++) {
			var ship = this.ships[shipsSide][i];
			for (var j = 0; j < locations.length; j++) {

				if ((ship.locations.indexOf(locations[j]) >= 0) || (ship.locations.indexOf("" + (Number(locations[j]) + 1)) >= 0) || 
					(ship.locations.indexOf((locations[j] - 1) + "") >= 0) || (ship.locations.indexOf("" + (Number(locations[j]) + 10)) >= 0) || 
					(ship.locations.indexOf((locations[j] - 10) + "") >= 0) || (ship.locations.indexOf("" + (Number(locations[j]) + 9)) >= 0 ) || 
					(ship.locations.indexOf((locations[j] - 9) + "") >= 0 ) || (ship.locations.indexOf("" + (Number(locations[j]) + 11)) >= 0 ) || 
					(ship.locations.indexOf((locations[j] - 11) + "") >= 0 )) {
					return true;
				}
			}
		}
		return false;
	}
};


var controller = {
		playerShots: [],
		computerShots: [],
		direction: -1,
		choosenDirection: -1,
		injured: false,
		injuredHits: [],
		expectLocation: {
			direction1: [],
			direction2: []
		},

		// playerGuess has event  listener onclick (click by player on the board cell) 
	playerGuess:  function () {
		gameElements.playerName.className = "whos-turn";
		gameElements.woprName.className = "";
		var userTdElements = [];
		for(var i=100; i < 200; i++){
			document.getElementById(i).onclick =  function(eventObj){
				var currentPlayerShot =  eventObj.target.id;
				if (model.gameOver){
					return false;
				}
				if (controller.playerShots.indexOf(currentPlayerShot) >= 0) {
						view.displayMessage("You alredy shot there!");
						return false;
				}

				if (!gameElements.playerName.className){
					view.displayMessage("It's not your turn!!!!")
					return false;
				}

				controller.playerShots.push(currentPlayerShot);
				var playerHit = model.fire(currentPlayerShot, "computer");
				if (!playerHit){
					gameElements.playerName.className = "";
					gameElements.woprName.className = "whos-turn";
					window.setTimeout(controller.computerGuess, 500);
				}
			}
		} 
	},

	//this is the most difficult part of programm, this is AI
	//it remembers if the ship is injured and makes decisions where to fire
	computerGuess: function(){
		var switcher = 0;
		var getLocation = function() {
			var shot;
			do {
				if (controller.injured && controller.direction != 1){
					shot = controller.expectLocation.direction1[Math.floor(Math.random() * controller.expectLocation.direction1.length)];
					if ((controller.computerShots.indexOf(controller.expectLocation.direction1[0]) >= 0) &&
									((controller.expectLocation.direction1[1])? (controller.computerShots.indexOf(controller.expectLocation.direction1[1]) >= 0) : 1)) {
						if (controller.choosenDirection==0){
							return -1;
						} else {
							controller.direction=1;
						}
					} else {
						controller.direction=0;
					}
				} else if (controller.injured && controller.direction==1){
					shot = controller.expectLocation.direction2[Math.floor(Math.random() * controller.expectLocation.direction2.length)];
					if ((controller.computerShots.indexOf(controller.expectLocation.direction2[0]) >= 0) &&
									((controller.expectLocation.direction2[1])? (controller.computerShots.indexOf(controller.expectLocation.direction2[1]) >= 0) : 1)) {
						if (controller.choosenDirection==1){
							return -1;
						} 
					}
				} else {
					shot = Math.floor(Math.random() * 100 + 200);
				}
				if((model.foundShips.indexOf(shot + 1 + "")>=0) || 
					(model.foundShips.indexOf(shot - 1 + "")>=0) || (model.foundShips.indexOf(shot + 10 + "")>=0) || 
					(model.foundShips.indexOf(shot-10 + "")>=0) || (model.foundShips.indexOf(shot + 9 + "")>=0) || 
					(model.foundShips.indexOf(shot-9 + "")>=0) || (model.foundShips.indexOf(shot + 11 + "")>=0) || 
					(model.foundShips.indexOf(shot - 11 + "")>=0)){
					controller.computerShots.push(shot);
					continue;
				}
			} while ((controller.computerShots.indexOf(shot) >= 0));
			controller.computerShots.push(shot); 
			return shot + "";
		};

		while (model.fire(hit = getLocation(), "player")) {
			if (model.gameOver){
				return false;
			}
			if (hit == (-1)){
				hit = controller.injuredHits[switcher++];
			}
			controller.choosenDirection = controller.direction;
			if (controller.injured) {
				controller.injuredHits.push(hit);
				hit = Number(hit);
				if (hit%10 == 0) {
					controller.expectLocation.direction1 = [hit + 1];
				} else if (hit%10==9) {
					controller.expectLocation.direction1 = [hit-1];
				} else {
					controller.expectLocation.direction1 = [hit + 1, hit-1];
				}
				if (hit - 210 < 0){
					controller.expectLocation.direction2 = [hit + 10]
				} else if (hit >= 290) {
					controller.expectLocation.direction2 = [hit-10]
				} else {
					controller.expectLocation.direction2 = [hit-10, hit + 10]
				}

			} else {
				switcher=0;
				controller.injuredHits = [];
				controller.choosenDirection = -1;
				controller.direction = -1;
				controller.expectLocation = {
					direction1: [],
					direction2: []
				}
			};
		}
		controller.playerGuess();

	}

}
//this object stores most using DOM elements
var gameElements = {
	 resetButton: document.getElementById("reset"),
	 startGameDiv: document.getElementById("start-game"),
	 initGameDiv: document.getElementById("init"),
	 battlefield: document.getElementById("battlefield"),
	 finishGameDiv: document.getElementById("finish-game"),
	 playerName: document.getElementById("player-name"),
	 inputName: document.getElementById("css-input"),
	 woprName: document.getElementById("wopr"),
	 fineDiv: document.getElementById("fine"),
	 fineSound: new Audio("sounds/fine.wav"),
	 excelentSound: new Audio("sounds/excelent.wav"),
	 askingSound: new Audio("sounds/playgame.wav")
}

//Entering point of the game with some dialog modal divs,
//button listeners and input field for entering players name
function startGame () {
	gameElements.askingSound.play();
	model.gameOver = false;
	model.generateShipLocations("computer");
	model.generateShipLocations("player");
	document.getElementById("yes").onclick = function () {
		gameElements.excelentSound.play();
		gameElements.startGameDiv.className = gameElements.startGameDiv.className + " display-none";
		gameElements.initGameDiv.className = "message";
	}
	document.getElementById("no").onclick = function () {
		gameElements.fineSound.play();
		gameElements.startGameDiv.className = gameElements.startGameDiv.className + " display-none";
		gameElements.fineDiv.className = "message";
	}
	gameElements.inputName.onkeypress = function(e){
		if (e.keyCode===13){
			gameElements.playerName.innerHTML = "<h2>"+gameElements.inputName.value+"</h2>";
			gameElements.initGameDiv.className = gameElements.initGameDiv.className + " display-none";
			gameElements.battlefield.className = "";
			controller.playerGuess();
		}
	};
}
//end point of the game
//shows open fields and reset button and 
//says to you, who you are )))
function finishGame(looser) {
	console.log(looser);
	model.gameOver = true;
	if (looser == "computer"){
		view.displayMessage("You win!");
	} else {
		view.displayMessage("You loose!");
	}
	for (var i = 100 ; i < 300; i++) {
	 document.getElementById(i + "").className="";

	}

	for (var i = 0; i < model.playerShipCells.length; i++){
		model.playerShipCells[i].className = "visible";
	};

	for (var i = 0; i < model.computerShipCells.length; i++){
		model.computerShipCells[i].className = "visible";
	};
	gameElements.resetButton.style.display = "block";

	gameElements.resetButton.onclick = function() {
			window.location.reload();
		}
}


window.onload = startGame;
