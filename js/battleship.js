function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
		console.log(msg);
	},
	displayHit: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

var model = {
	boardSize: 10,
	numShips: 20,
	shipsSunk: {
		player: 0,
		computer: 0
	},

/*	shipLength: {
		fourDecker: 4,
		threeDecker: 3,
		twoDecker: 2,
		singleDecker: 1
	},*/

	ships:  [{ shipLength: 4, side: "player", locations: ["6", "16", "26","36"], hits: ["", "", "", ""]},
			 { shipLength: 3, side: "player", locations: ["24", "34", "44"], hits: ["", "", ""] },
			 { shipLength: 3, side: "player", locations: ["0", "1", "2"], hits: ["", "", ""] },
			 { shipLength: 2, side: "player", locations: ["20", "21"], hits: ["", ""] },
			 { shipLength: 2, side: "player", locations: ["41", "42"], hits: ["", ""] },
			 { shipLength: 2, side: "player", locations: ["60", "61"], hits: ["", ""] },
			 { shipLength: 1, side: "player", locations: ["63"], hits: [""] },
			 { shipLength: 1, side: "player", locations: ["65"], hits: [""] },
			 { shipLength: 1, side: "player", locations: ["99"], hits: [""] },
			 { shipLength: 1, side: "player", locations: ["79"], hits: [""] },
			 { shipLength: 4, side: "computer", locations: ["100", "101", "102","103"], hits: ["", "", "", ""]},
			 { shipLength: 3, side: "computer", locations: ["106", "107", "108"], hits: ["", "", ""] },
			 { shipLength: 3, side: "computer", locations: ["130", "131", "132"], hits: ["", "", ""] },
			 { shipLength: 2, side: "computer", locations: ["124", "134"], hits: ["", ""] },
			 { shipLength: 2, side: "computer", locations: ["136", "137"], hits: ["", ""] },
			 { shipLength: 2, side: "computer", locations: ["163", "164"], hits: ["", ""] },
			 { shipLength: 1, side: "computer", locations: ["184"], hits: [""] },
			 { shipLength: 1, side: "computer", locations: ["186"], hits: [""] },
			 { shipLength: 1, side: "computer", locations: ["199"], hits: [""] },
			 { shipLength: 1, side: "computer", locations: ["190"], hits: [""] }
			 ],

	fire: function(guess) {
		if (guess==(-1)){
			return true;
		}
		for (var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			console.log(guess, ship.locations.indexOf(guess));
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!!!");
				if (this.isSunk(ship)){
					view.displayMessage("Oh, " + ship.side + "`s ship is dead!!!");
					this.shipsSunk[ship.side]++;
					if (this.shipsSunk[ship.side] == 10) {
						finishGame(ship.side);
					}
					if (ship.side == "player"){
						controller.injured = false;
					}
				} else {
					if (ship.side == "player"){
						controller.injured = true;
					}
				}
				return true;
			}

		}
		view.displayMiss(guess);
		view.displayMessage("Ha, ha! Missed me!!!");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < ship.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}
};



var controller = {
		playerShots: [],
		computerShots: [],
		direction: -1,
		choosenDirection: -1,
		injured: false,
		injuredHits: [],
		// switcher: 0,
		// hit: -1,
		expectLocation: {
			direction1: [],
			direction2: []
		},

	playerGuess:  function () {
		gameElements.playerName.className = "whos-turn";
		gameElements.woprName.className = "";
		var userTdElements = [];
		for(var i=100; i < 200; i++){
			document.getElementById(i).onclick =  function(eventObj){
				var currentPlayerShot =  eventObj.target.id;

				if (controller.playerShots.indexOf(currentPlayerShot) >= 0) {
						view.displayMessage("You alredy shot there!");
						return false;
				}

				if (!gameElements.playerName.className){
					view.displayMessage("It's not your turn!!!!")
					return false;
				}

				controller.playerShots.push(currentPlayerShot);
				var playerHit = model.fire(currentPlayerShot);
				if (!playerHit){
					gameElements.playerName.className = "";
					gameElements.woprName.className = "whos-turn";
					window.setTimeout(controller.computerGuess, 500);
				}
				// if (hit && model.shipsSunk.computer === model.numShips/2) {
				// 	view.displayMessage("You sank all my battleships, in " + 
				// 		controller.guesses.player + " gueses");
				// }
			}
		} 
	},
	computerGuess: function(){
		var switcher = 0;
		var getLocation = function() {
			var shot;
			do {
				console.log("in getLocation controller.injured - "+ controller.injured + "controller.direction - " + controller.direction);
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
						console.log("controller.direction=0;");
						controller.direction=0;
					}
					// console.log(shot, controller.direction);
				} else if (controller.injured && controller.direction==1){
					shot = controller.expectLocation.direction2[Math.floor(Math.random() * controller.expectLocation.direction2.length)];
					console.log(" controller.expectLocation.direction2 " +  controller.expectLocation.direction2);
					if ((controller.computerShots.indexOf(controller.expectLocation.direction2[0]) >= 0) &&
									((controller.expectLocation.direction2[1])? (controller.computerShots.indexOf(controller.expectLocation.direction2[1]) >= 0) : 1)) {
						console.log("if (controller.computerShots.indexOf((controller.expectLocation.direction2 ");
						if (controller.choosenDirection==1){
							return -1;
						} 
					}
				} else {
					shot = Math.floor(Math.random() * 100);
				}
			} while (controller.computerShots.indexOf(shot) >= 0);
			controller.computerShots.push(shot);
			return shot + "";

		};


		
		while (model.fire(hit = getLocation())) {

			console.log("controller.injured " + controller.injured);
			if (hit == (-1)){
				hit = controller.injuredHits[switcher++];
			}
			controller.choosenDirection = controller.direction;
			if (controller.injured) {
				controller.injuredHits.push(hit);
				hit = Number(hit);
				if (((hit%10 == 0) && (hit-10 >= 0)) || hit==0 || hit == 90){
					controller.expectLocation.direction1 = [hit + 1];
				} else if ((hit%10==9) || hit == 09) {
					controller.expectLocation.direction1 = [hit-1];
				} else {
					controller.expectLocation.direction1 = [hit + 1, hit-1];
				}

				if (hit - 10 < 0){
					controller.expectLocation.direction2 = [hit + 10]
				} else if (hit/10 >= 9) {
					controller.expectLocation.direction2 = [hit-10]
				} else {
					controller.expectLocation.direction2 = [hit-10, hit + 10]
				}

				console.log(controller.expectLocation, controller.direction);
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
		console.log(controller.expectLocation, controller.direction);
		}
		console.log(controller.expectLocation, controller.direction);
		controller.playerGuess();

	}

	// processGuess: function (guess) {

	// }

}

gameElements = {
	 startGameDiv: document.getElementById("start-game"),
	 initGameDiv: document.getElementById("init"),
	 battlefield: document.getElementById("battlefield"),
	 finishGameDiv: document.getElementById("finish-game"),
	 playerName: document.getElementById("player-name"),
	 inputName: document.getElementById("css-input"),
	 woprName: document.getElementById("wopr"),
	 snd: new Audio("sounds/playgame.wav")
}

function startGame () {
//		gameElements.startGameDiv.className = "message";
	gameElements.snd.play();
	document.getElementById("yes").onclick = function () {
		gameElements.startGameDiv.className = gameElements.startGameDiv.className + " display-none";
		gameElements.initGameDiv.className = "message";
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

function finishGame(looser) {
	endMessage = document.createElement("h1");
	var okButton = document.getElementById("ok");
	gameElements.battlefield.className = gameElements.battlefield.className + " display-none";	
	gameElements.finishGameDiv.className = "message";
	if (looser == "computer"){
		endMessage.innerHTML = "YOU WIN!"	
	} else {
		endMessage.innerHTML = "YOU LOOSE!"	

	};
	gameElements.finishGameDiv.insertBefore(endMessage, okButton);	
	okButton.onclick = function () {
		window.location.reload();
	};
	
}

window.onload = startGame;
// window.onload = controller.playerGuess;

/*model.fire("06");
model.fire("16");
model.fire("26");
model.fire("36");


model.fire("24");
model.fire("44");
model.fire("34");

model.fire("99");
model.fire("89");

*/


// view.displayMiss("000");
// view.displayHit("034");
// view.displayMiss("055");
// view.displayHit("012");
// view.displayMiss("025");
// view.displayHit("026");
// view.displayMessage("Tap tap, is this thing on?");