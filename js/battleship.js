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
			 { shipLength: 3, side: "player", locations: ["00", "01", "02"], hits: ["", "", ""] },
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
		playerShots: 0,
		computerShots: [],




	playerGuess:  function () {
		var userTdElements = [];
		for(var i=100; i < 200; i++){
			document.getElementById(i).onclick =  function(eventObj){
				controller.playerShots++;
				var hit = model.fire(eventObj.target.id);
				if (!hit){
					controller.computerGuess();
				}
				// if (hit && model.shipsSunk.computer === model.numShips/2) {
				// 	view.displayMessage("You sank all my battleships, in " + 
				// 		controller.guesses.player + " gueses");
				// }
			}
		} 
	},
	computerGuess: function(){

		var getLocation = function() {
			do {
				var shot = Math.floor(Math.random() * 100);
			} while (controller.computerShots.indexOf(shot) >= 0);
			controller.computerShots.push(shot);
			return shot + "";

		};

		while (model.fire(getLocation())) {};

		controller.playerGuess();

	}

	// processGuess: function (guess) {

	// }

}


window.onload = controller.playerGuess;

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