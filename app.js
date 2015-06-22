// Variables
var currentPlayer = 1;
var fieldElementIds = ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3"];
var won = false;

// Clickhandler
var clickField = function (element, row, field) {
	if (element.innerHTML == document.getElementById("-").innerHTML && !won) {

		// Set Field (seems faster to the user)
		if (currentPlayer == 1) {
			setFieldData(row+"-"+field, "x");
		} else if (currentPlayer == 2) {
			setFieldData(row+"-"+field, "o");
		}

		// calculate FieldIndex
		var fieldIndex = (row-1)*3 + field - 1;

		// send Data to Server
		$.ajax({ url: "ttt.cgi?setField="+fieldIndex});

		// reload
		getData();
	}
};

// Restart - clickhandler
var clickRestart = function () {
	// Clear Fields (seems faster to the user)
	for (var i = 0; i < fieldElementIds.length; i++) {
		setFieldData(fieldElementIds[i], "-");
	};

	// send Data to Server
	$.ajax({ url: "ttt.cgi?restart=true"});
};

// set fieldData
var setFieldData = function (elementId, data) {
	// getElement
	var element = document.getElementById(elementId);

	// Display
	element.innerHTML = document.getElementById(data).innerHTML;

	// set className (used for reset & testing)
	element.className = "field";

	if (data != "-") {
		// Remove pointer
		element.style.cursor = "default";
	} else {
		if (!won) {
			// reset Cursor to pointer
			element.style.cursor = "pointer";
		} else {
			// Remove pointer
			element.style.cursor = "default";
		}
	}
};

// check GameStatus // Win / Tie 
var checkGameStatus = function (data) {
	won = false;

	// check if someone won
	for (var i = 0; i < 3; i++) {
		// horizontal lines
		if (data[0+(i*3)] != "-" && data[1+(i*3)] != "-" && data[2+(i*3)] != "-") {
			if (data[0+(i*3)] == data[1+(i*3)] && data[1+(i*3)] == data[2+(i*3)]) {
				// Set win class for visual
				document.getElementById(fieldElementIds[0+(i*3)]).className += " win";
				document.getElementById(fieldElementIds[1+(i*3)]).className += " win";
				document.getElementById(fieldElementIds[2+(i*3)]).className += " win";

				// set won variable
				won = true;

				// Set MessageBox
				setMessageBox("won", data[0+(i*3)]);
			}
		}
		// vertical lines
		if (data[0+i] != "-" && data[3+i] != "-" && data[6+i] != "-") {
			if (data[0+i] == data[3+i] && data[3+i] == data[6+i]) {
				// Set win class for visual
				document.getElementById(fieldElementIds[0+i]).className += " win";
				document.getElementById(fieldElementIds[3+i]).className += " win";
				document.getElementById(fieldElementIds[6+i]).className += " win";

				// set won variable
				won = true;

				// Set MessageBox
				setMessageBox("won", data[0+i]);
			}
		}
	}

	// diagonal 1
	if (data[0] != "-" && data[4] != "-" && data[8] != "-") {
		if (data[0] == data[4] && data[4] == data[8]) {
			// Set win class for visual
			document.getElementById(fieldElementIds[0]).className += " win";
			document.getElementById(fieldElementIds[4]).className += " win";
			document.getElementById(fieldElementIds[8]).className += " win";

			// set won variable
				won = true;

			// Set MessageBox
			setMessageBox("won", data[0]);
		}
	}
	
	// diagonal 2
	if (data[2] != "-" && data[4] != "-" && data[6] != "-") {
		if (data[2] == data[4] && data[4] == data[6]) {
			// Set win class for visual
			document.getElementById(fieldElementIds[2]).className += " win";
			document.getElementById(fieldElementIds[4]).className += " win";
			document.getElementById(fieldElementIds[6]).className += " win";

			// set won variable
				won = true;

			// Set MessageBox
			setMessageBox("won", data[2]);
		}
	}

	// check if tie
	if (!won) {
		for (var j = 0; j < 9; j++) {
			if (data[j] == "-") {
				setMessageBox("active", "-");
				break;
			} else {
				if (j == 8) {
					setMessageBox("tie", "-");
				}
			}
		}
	}
};

// set MessageBox
var setMessageBox = function (type, data) {
	// Rlement: MessageBox
	var messageBox = document.getElementById("messageBox");
	// Element: restart
	var restart = document.getElementById("restart");

	// Win Message
	if (type == "won") {
		if (data == "x") {
			// Show message
			messageBox.innerHTML = "Player 1 - wins!";
		} else {
			// Show message
			messageBox.innerHTML = "Player 2 - wins!";
		}
		// start Animation
		restart.className = "animate";
	}

	// Tie message
	if (type == "tie") {
		// Show message
		messageBox.innerHTML = "Tie!";
		// start Animation
		restart.className = "animate";
	}

	// Active message
	if (type == "active") {
		// Show message
		messageBox.innerHTML = "Game active";
		// stop Animation
		restart.className = "";
	}
};

// getData
var getData = function () {
	// Ajax request
    $.ajax({ url: "gamefile.txt", success: function(data){
    	// split string in array
        data = data.split(";");

        // Process fieldData
        for (var i = 0; i < 9; i++) {
        	data[i] = data[i].toLowerCase();
        	setFieldData(fieldElementIds[i], data[i]);
        }

        // Set current player
        if (data[9] == 1 || data[9] == 2) {
        	currentPlayer = data[9];
        	document.getElementById("currentPlayer").innerHTML = data[9];
        }

        // check Win Status
        checkGameStatus(data);

    }, cache: false});
};

// First start
getData();

// start polling
setInterval(getData, 1000);
