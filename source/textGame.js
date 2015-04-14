var Game;
var state;
var input;

function loadJSON(url) {
	console.log("Attempting to load " + url);
	$.ajax(url, { 
		error: function (xhr, status, err) {
			console.error("Could not load game");
			console.error(err);
		},
		success: function (data) {
			buildGame(data);
		},
	});	
}

function buildGame(json) {			
	if(!json) {
		console.error("Could not load game");
		return;
	}
	Game = json;

	if(Game.title) {
		document.getElementById('gameTitleField').innerText = Game.title;
	} else {
		console.warning("Game.title is not set");
		document.getElementById('gameTitleField').innerText = "Title not set";
	}
	
	//the "" element of the text of startState is displayed when on load
	if(Game.startState) {
		state = Game.startState;
		update("");
	} else {
		console.error("Game.startState not set");
	}
}

$(document).ready(function (e) {

	//These lines make the input box always set
	input = document.getElementById('gameTextInput');
	input.focus();

	input.onblur = function () {
	    setTimeout(function () {
	        input.focus();
	    });
	};
});

//Keyhandler which checks if the user has finished entering their command
$(document).keypress(function (e) {
	var key = e.which;
	//The key value for enter is 13
	if(key == 13) {
		scriptSubmit();
	}
});

function scriptSubmit() {
	var value = input.value;
	if (!value) return;
	input.value = "";
	update(value);
}

function setOutput(str) {
	console.log("Game: " + str);
	var currOutput = document.getElementById("gameTextOutputOld").innerText;
	if(currOutput != "") {
		currOutput += "\n" + document.getElementById("gameTextOutputNew").innerText;
	} else {
		currOutput = document.getElementById("gameTextOutputNew").innerText;
	}
	document.getElementById("gameTextOutputOld").innerText = currOutput;
	document.getElementById("gameTextOutputNew").innerText = str;
}

function update(value) {
	if(!Game) {
		console.error("Game not loaded");
		return;
	}

	if(Game.aliases[value]) {
		value = Game.aliases[value];
	}
	if(Game.states[state].accepted.indexOf(value) == -1) {
		if(Game.badCommand) {
			setOutput(Game.badCommand);
		} else {
			setOutput("Bad command");
			console.warning("Game.badCommand not set, defaulting to 'Bad Command'");
		}
		return;
	}
	if(Game.states[state].text[value]) {
		setOutput(Game.states[state].text[value]);
	}
	if(Game.states[state].edges[value]) {
		state = Game.states[state].edges[value];
		if(!Game.states[state]) {
			console.error("State not found: " + state);
		}
	}
}
