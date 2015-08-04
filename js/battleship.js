var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
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

view.displayMiss("000");
view.displayHit("034");
view.displayMiss("055");
view.displayHit("012");
view.displayMiss("025");
view.displayHit("026");