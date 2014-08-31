//setup socket connection
var socket = io.connect();

$(document).ready(function() {
	if (typeof errorMsg === 'object' && Object.keys(errorMsg).length > 0) {
		var errorMsgs = '';
		for (var msg in errorMsg) {
			errorMsgs += errorMsg[msg] + '<br/>';
		}
		$('#error-msg').html(errorMsgs);
		$('#error').fadeIn('fast');
	}

	if (!username) {
		console.log('no username');
		var playerName = $('#playerName');
		playerName.show();
		playerName.focus();
		playerName.keypress(function (e) {
			if (e.which == 13 || e.keyCode == 13) {
				username = playerName.val();
				if (username.length > 0) {
					//clear error
					$('#error-msg').html();
	    			$('#error').slideUp('fast');

					playerName.empty();
					//join lobby as player
					if (!uniqueKey) {
						$.get( gameName + "/generateKey", function(data) {
							uniqueKey = data;
							window.history.pushState({}, document.title, window.location.href + '/lobby/' + uniqueKey); 
							socket.emit('login', {user: username, game: uniqueKey});
						});
					} else {
						socket.emit('login', {user: username, game: uniqueKey});
					}
				} else {
					//display error
					$('#error-msg').html('Your name needs to be longer than that!<br/> Use at least one character.');
	    			$('#error').slideDown('fast');
				}
			}
		}.bind(username));
	} else {
		//shouldn't happen until game data is stored in a cookie or session variable to allow reconnect
		console.log('good to go');
		var currentGame = new Game(gameName, username, playerNumber, uniqueKey, socket);
		console.log(currentGame.title);
		currentGame.setupSocketListeners();
		currentGame.waitForPlayers();
	}
	$('#newLobby').click(function() {
		$('#newLobby').fadeOut('fast');
		$('#lobbies').fadeOut('fast');
		$('.choice').slideUp('fast');
		$('#loginContainer').fadeIn('fast');
	});

	socket.on('loginSuccess', function(data) {
		var playerNumber = data.playerNumber;
		$('#error-msg').html();
	    $('#error').slideUp('fast');
		$('#loginContainer').hide();
		$('#gameTitle').switchClass('title', 'title-small', 500);

		var currentGame = new Game(gameName, username, playerNumber, uniqueKey, socket);
		console.log(currentGame.title);
		currentGame.setupSocketListeners();
		currentGame.waitForPlayers();
	});
	socket.on('loginError', function(data) {
	    if (data.error) {
	      $('#error-msg').html(data.error);
	    }
	    $('#error').fadeIn('fast');
	    $('#ready-button').fadeOut('fast');
	  });

});
