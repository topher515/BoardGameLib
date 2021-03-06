
var GameBoard = function(options) {
	this.options = {
		 game: null
		,element: null
	};

	this.options = $.extend(this.options, options);
	for (var key in this.options) {
		this[key] = this.options[key];
	}
	this.options = undefined;
	delete this.options;
};
GameBoard.prototype = {
	timeout: {},

	/* Board Definition and Set-Up */
	tileClasses: '<style>\
					  .grain {fill:yellow; background-color:yellow; fill:url(#grainPattern) !important;}\
					  .sheep {fill:rgb(142,233,138) !important; background-color:rgb(142,233,138); fill:url(#sheepPattern) !important;}\
					  .wood {fill:green !important; background-color:green; fill:url(#woodPattern) !important;}\
					  .ore {fill:gray !important; background-color:gray; fill:url(#orePattern) !important;}\
					  .brick {fill:rgb(255, 143, 68) !important; background-color:rgb(255, 143, 68); fill:url(#brickPattern) !important;}\
					  .water {fill:blue !important; background-color:blue; fill:url(#waterPattern);}\
					  .desert {fill:rgb(247,252,194) !important; background-color:yellow; fill:url(#desertPattern) !important;}\
					</style>',

	gameboard: '\
		<svg width="80%" height="80%" viewBox="0 0 576 686.892119797275" xmlns="http://www.w3.org/2000/svg" version="1.1"> \
			<defs xmlns="http://www.w3.org/2000/svg"> \
				<pattern id="desertPattern" patternUnits="objectBoundingBox" width="1" height="1">\
					<image xlink:href="/images/games/Catan/desert.jpg" x="0" y="0" width="150" height="150"/>\
				</pattern>\
				<pattern id="grainPattern" patternUnits="objectBoundingBox" width="1" height="1">\
					<image xlink:href="/images/games/Catan/grain.jpg" x="0" y="0" width="325" height="325"/>\
				</pattern>\
				<pattern id="orePattern" patternUnits="objectBoundingBox" width="1" height="1">\
					<image xlink:href="/images/games/Catan/ore.jpg" x="0" y="0" width="150" height="150"/>\
				</pattern>\
				<pattern id="woodPattern" patternUnits="objectBoundingBox" width="1" height="1">\
					<image xlink:href="/images/games/Catan/wood.jpg" x="0" y="0" width="300" height="300"/>\
				</pattern>\
				<pattern id="sheepPattern" patternUnits="objectBoundingBox" width="1" height="1">\
					<image xlink:href="/images/games/Catan/sheep.jpg" x="0" y="0" width="150" height="150"/>\
				</pattern>\
				<pattern id="brickPattern" patternUnits="objectBoundingBox" width="1" height="1">\
					<image xlink:href="/images/games/Catan/brick.jpg" x="0" y="0" width="200" height="200"/>\
				</pattern>\
			</defs>\
			<desc>Hex grid</desc>\
			<g id="hexes">\
				<polygon id="h0" class="tile" style="fill:none;" points="144,62.3538290724796 108.000000074612,124.707658101882 36.0000001492249,124.707658231114 0,62.3538293309447 35.9999997015502,1.72310052448665e-07 107.999999626938,-2.15387579771686e-07"/>\
				<polygon id="h1" value="11" class="tile wood" style="fill:none;" points="144,187.061487217439 108.000000074612,249.415316246841 36.0000001492249,249.415316376073 0,187.061487475904 35.9999997015502,124.707658317269 107.999999626938,124.707657929572"/>\
				<polygon id="h2" value="4" class="tile brick" style="fill:none;" points="144,311.769145362398 108.000000074612,374.1229743918 36.0000001492249,374.122974521033 0,311.769145620863 35.9999997015502,249.415316462228 107.999999626938,249.415316074531"/>\
				<polygon id="h3" value="7" class="tile desert" style="fill:none;" points="144,436.476803507357 108.000000074612,498.830632536759 36.0000001492249,498.830632665992 0,436.476803765822 35.9999997015502,374.122974607188 107.999999626938,374.12297421949"/>\
				<polygon id="h4" class="tile" style="fill:none;" points="144,561.184461652316 108.000000074612,623.538290681718 36.0000001492249,623.538290810951 0,561.184461910781 35.9999997015502,498.830632752147 107.999999626938,498.830632364449"/>\
				<polygon id="h5" value="12" class="tile sheep" style="fill:none;" points="252,124.707658144959 216.000000074612,187.061487174361 144.000000149225,187.061487303594 108,124.707658403424 143.99999970155,62.3538292447896 215.999999626938,62.353828857092"/>\
				<polygon id="h6" value="6" class="tile ore" style="fill:none;" points="252,249.415316289918 216.000000074612,311.76914531932 144.000000149225,311.769145448553 108,249.415316548383 143.99999970155,187.061487389749 215.999999626938,187.061487002051"/>\
				<polygon id="h7" value="3" class="tile wood" style="fill:none;" points="252,374.122974434877 216.000000074612,436.476803464279 144.000000149225,436.476803593512 108,374.122974693343 143.99999970155,311.769145534708 215.999999626938,311.76914514701"/>\
				<polygon id="h8" value="8" class="tile brick" style="fill:none;" points="252,498.830632579837 216.000000074612,561.184461609239 144.000000149225,561.184461738471 108,498.830632838302 143.99999970155,436.476803679667 215.999999626938,436.476803291969"/>\
				<polygon id="h9" class="tile" style="fill:none;" points="252,623.538290724796 216.000000074612,685.892119754198 144.000000149225,685.89211988343 108,623.538290983261 143.99999970155,561.184461824626 215.999999626938,561.184461436929"/>\
				<polygon id="h10" value="9" class="tile grain" style="fill:none;" points="360,62.3538290724796 324.000000074612,124.707658101882 252.000000149225,124.707658231114 216,62.3538293309447 251.99999970155,1.72310052448665e-07 323.999999626938,-2.15387579771686e-07"/>\
				<polygon id="h11" value="5" class="tile brick" style="fill:none;" points="360,187.061487217439 324.000000074612,249.415316246841 252.000000149225,249.415316376073 216,187.061487475904 251.99999970155,124.707658317269 323.999999626938,124.707657929572"/>\
				<polygon id="h12" value="11" class="tile grain" style="fill:none;" points="360,311.769145362398 324.000000074612,374.1229743918 252.000000149225,374.122974521033 216,311.769145620863 251.99999970155,249.415316462228 323.999999626938,249.415316074531"/>\
				<polygon id="h13" value="10" class="tile sheep" style="fill:none;" points="360,436.476803507357 324.000000074612,498.830632536759 252.000000149225,498.830632665992 216,436.476803765822 251.99999970155,374.122974607188 323.999999626938,374.12297421949"/>\
				<polygon id="h14" value="5" class="tile ore" style="fill:none;" points="360,561.184461652316 324.000000074612,623.538290681718 252.000000149225,623.538290810951 216,561.184461910781 251.99999970155,498.830632752147 323.999999626938,498.830632364449"/>\
				<polygon id="h15" value="10" class="tile sheep" style="fill:none;" points="468,124.707658144959 432.000000074612,187.061487174361 360.000000149225,187.061487303594 324,124.707658403424 359.99999970155,62.3538292447896 431.999999626938,62.353828857092"/>\
				<polygon id="h16" value="4" class="tile wood" style="fill:none;" points="468,249.415316289918 432.000000074612,311.76914531932 360.000000149225,311.769145448553 324,249.415316548383 359.99999970155,187.061487389749 431.999999626938,187.061487002051"/>\
				<polygon id="h17" value="9" class="tile sheep" style="fill:none;" points="468,374.122974434877 432.000000074612,436.476803464279 360.000000149225,436.476803593512 324,374.122974693343 359.99999970155,311.769145534708 431.999999626938,311.76914514701"/>\
				<polygon id="h18" value="2" class="tile grain" style="fill:none;" points="468,498.830632579837 432.000000074612,561.184461609239 360.000000149225,561.184461738471 324,498.830632838302 359.99999970155,436.476803679667 431.999999626938,436.476803291969"/>\
				<polygon id="h19" class="tile" style="fill:none;" points="468,623.538290724796 432.000000074612,685.892119754198 360.000000149225,685.89211988343 324,623.538290983261 359.99999970155,561.184461824626 431.999999626938,561.184461436929"/>\
				<polygon id="h20" class="tile" style="fill:none;" points="576,62.3538290724796 540.000000074612,124.707658101882 468.000000149225,124.707658231114 432,62.3538293309447 467.99999970155,1.72310052448665e-07 539.999999626938,-2.15387579771686e-07"/>\
				<polygon id="h21" value="8" class="tile grain" style="fill:none;" points="576,187.061487217439 540.000000074612,249.415316246841 468.000000149225,249.415316376073 432,187.061487475904 467.99999970155,124.707658317269 539.999999626938,124.707657929572"/>\
				<polygon id="h22" value="3" class="tile ore" style="fill:none;" points="576,311.769145362398 540.000000074612,374.1229743918 468.000000149225,374.122974521033 432,311.769145620863 467.99999970155,249.415316462228 539.999999626938,249.415316074531"/>\
				<polygon id="h23" value="6" class="tile wood" style="fill:none;" points="576,436.476803507357 540.000000074612,498.830632536759 468.000000149225,498.830632665992 432,436.476803765822 467.99999970155,374.122974607188 539.999999626938,374.12297421949"/>\
				<polygon id="h24" class="tile" style="fill:none;" points="576,561.184461652316 540.000000074612,623.538290681718 468.000000149225,623.538290810951 432,561.184461910781 467.99999970155,498.830632752147 539.999999626938,498.830632364449"/>\
			</g>\
			<g id="edges">\
			</g>\
			<g id="vertices">\
			</g>\
			<g id="tiles">\
			</g>\
		</svg>',

	randomBoard: true,
	hiddenTiles: ['h0', 'h4', 'h9', 'h19', 'h20', 'h24'],
	tileLimits: {
		 'grain': 4
		,'ore': 3
		,'sheep': 4
		,'wood': 4
		,'brick': 3
		,'desert': 1
	},
	tileValues: {
		 2: 1
		,3: 2
		,4: 2
		,5: 2
		,6: 2
		,8: 2
		,9: 2
		,10: 2
		,11: 2
		,12: 1
	},
	
	actions: {
		 placeSettlement: function(board, vid, player) {
		 	Util.log('place settlement: ' + vid + '; ' + player);
			if($('#' + vid).attr('class') == 'vertex unassigned') {
				$('#' + vid).attr('class','vertex ' + 'player' + player);
				$('#vertices .unassigned').css('display','none');
				$('#' + vid).show();
			}
		}
		,placeRoad: function(board, eid, player) {
			Util.log('place road: ' + eid + '; ' + player);
			if($('#' + eid).attr('class') == 'edge unassigned') {
				$('#' + eid).attr('class','edge '+ 'player' + player)
				$('#edges .unassigned').css('display','none');
				$('#' + eid).show();
			}
		}
		,placeCity: function(board, vid, player) {
			Util.log('place city: ' + vid + '; ' + player);
			if($('#' + vid).attr('class') == 'vertex player' + player) {
				$('#' + vid).hide();
				$('#c' + vid).show();
				$('#c' + vid).attr('class', 'city ' + $('#' + vid).attr('class'));
				$('#vertices .unassigned').css('display','none');
			}
		}
		,syncBoard: function(board, el, player, args) {
			if (board.game.playerNumber !== player) {
				Util.log('Syncing game board tiles');
				var tileList = args.tiles;
				var numberList = args.values;

				$('#hexes > polygon').each(function() {
					var hexId = $(this).attr('id');
					if (board.hiddenTiles.indexOf(hexId) < 0) {
						var tileClass = tileList.pop();
						$(this).attr('class',  tileClass + ' tile');
						if (tileClass !== 'desert') {
							$(this).attr('value', numberList.pop());
						} else {
							$(this).attr('value', 7);
						}
					}
				});
				board.renderTiles();
				//rebind events
				board.setupListeners();
				board.renderActions();
				board.renderControls();
				if (board.game.playerNumber !== board.game.activePlayer) {
					board.disableBuildControls();
				}
			}
		}
		,updatePlayerResources: function(board, el, player, args) {
			if (typeof args.players[board.game.playerNumber] !== 'undefined') {
				Util.log('Discard ' + args.players[board.game.playerNumber] + ' cards');
			}
		}
		,updateDeck: function(board, el, player, args) {
			board.game.decks[args.deckType] = args.deck;
			Util.log('Updating deck to match player ' + player);
		}
		,showRoll: function(board, el, player, args) {
			if (!$('#dice').length) {
				board.element.append('<input type="button" id="dice" />');
			}
			if (player !== board.game.playerNumber) {
				$('#dice').val(args.value);
				$('#dice').fadeIn('fast');
				if (board.timeout['dice']) {
					clearTimeout(board.timeout['dice']);
				}
				board.timeout['dice'] = setTimeout(function() {
					$('#dice').fadeOut('slow');
				}, 3000);
				board.produceResources(args.value);
			}
		}
		,endTurn: function(board, el, player, args) {
			Util.log('endTurn: next player ' + player);
			board.game.activePlayer = player;
			board.game.state = args.state;
			board.interval = args.interval;
			$('.player' + board.game.activePlayer).addClass('player-turn');
			if (board.game.playerNumber === player) {
				board.startPlayerTurn();
			} else {
				//disable build controls
				board.disableBuildControls();
				if ($('#dice')) {
					$('#dice').fadeOut('fast');
				}
				$('.player' + board.game.playerNumber).removeClass('player-turn');
			}
			if (typeof args !== 'undefined' && typeof args.lastPlayer !== 'undefined') {
				$('.player' + args.lastPlayer).removeClass('player-turn');
			}
			$('.player' + player).addClass('player-turn');
		}
	},

	render: function() {
		this.renderBoard(this.randomBoard);
		this.renderActions();
		this.setupListeners();
		this.renderControls();
	},

	renderBoard: function(isRandom) {
		$(this.element).html(this.tileClasses + this.gameboard);

		if (isRandom && this.game.activePlayer === this.game.playerNumber) {
			//shuffle tiles
			var tileList = [];
			for (var tile in this.tileLimits) {
				for (var i = 0; i < this.tileLimits[tile]; i++) {
					tileList.push(tile);
				}
			}
			tileList = Util.shuffle(tileList);

			//shuffle numbers
			var numberList = [];
			for (var number in this.tileValues) {
				for (var i = 0; i < this.tileValues[number]; i++) {
					numberList.push(number);
				}
			}
			numberList = Util.shuffle(numberList);

			var self = this;

			//synchronize
			this.game.connection.emit('doAction', {
				  game: self.game.uniqueKey
				, action: 'syncBoard'
				, playerNumber: self.game.activePlayer
				, args: {
					 tiles: tileList
					,values: numberList
				}
			});

			$('#hexes > polygon').each(function() {
				var hexId = $(this).attr('id');
				if (self.hiddenTiles.indexOf(hexId) < 0) {
					var tileClass = tileList.pop();
					$(this).attr('class', tileClass + ' tile');
					if (tileClass !== 'desert') {
						$(this).attr('value', numberList.pop());
					} else {
						$(this).attr('value', 7);
					}
				}
			});
		}

		this.createVertices(); 
		this.createEdges();
		this.renderTiles();
	},

	renderActions: function() {
		$('#actions').remove();
		$(this.game.element).append('\
			<div id="actions" class="hideActions">\
				<input id="placeRoad_button" value="Road" type="button">\
				<input id="placeCity_button" value="Settlement" type="button">\
				<input id="upgradeSettle_button" value="City" type="button">\
				<input id="buyDevCard_button" value="Dev. Card" type="button">\
			</div>');

		var self = this;
		$('#placeCity_button').click(function() {
			self.placeSettlement(self.game.state === GameState.FIRST_ROUND);
		});
		$('#placeCity_button').fastButton(function() {
			self.placeSettlement(self.game.state === GameState.FIRST_ROUND);
		});
	
		$('#placeRoad_button').click(function() {
			self.placeRoadMode(self.game.state === GameState.FIRST_ROUND);
		});
		$('#placeRoad_button').fastButton(function() {
			self.placeRoadMode(self.game.state === GameState.FIRST_ROUND);
		});
		
		$('#upgradeSettle_button').click(function() {
			self.placeCity();
		});
		$('#upgradeSettle_button').fastButton(function() {
			self.placeCity();
		});

		$('#buyDevCard_button').click(function() {
			self.purchaseDevelopmentCard();
		});
		$('#buyDevCard_button').fastButton(function() {
			self.purchaseDevelopmentCard();
		});
	},

	showControls: function() {
		$('#controls').css('display', 'block');
		$('#endTurn_button').css('display', 'block');
	},

	renderControls: function() {
		$('#controls').remove();
		$('#endTurn_button').remove();
		$('#purchaseControls').remove();
		$(this.game.element).append(' \
			<div id="controls"> \
				<input id="showActions_button" value="Actions" type="button">\
				<input id="showResources" value="Resources" type="button"/>\
				<input id="showDevCards" value="Dev Cards" type="button"/>\
			</div>\
			<input id="endTurn_button" value="End Turn" type="button">\
			<div id="purchaseControls">\
				<input id="cancelAction_button" value="cancel" type="button">\
			</div>'
		);
		var self = this;
		$('#endTurn_button').click(function() {
			self.endPlayerTurn();
		});
		
		$('#showActions_button').click(function() {
			$('#actions').toggleClass('hideActions');
		});
		$('#showActions_button').fastButton(function() {
			$('#actions').toggleClass('hideActions');
		});
		
		$('#cancelAction_button').click(function() {
			self.cancelAction();
		});
		$('#cancelAction_button').fastButton(function() {
			self.cancelAction();
		});

		$('#showResources').click(function() {
			var player = self.game.players[self.game.playerNumber];
			if (player.handDisplayed === DeckType.RESOURCE) {
				player.hideHand(DeckType.RESOURCE);
			} else {
				player.displayHand(DeckType.RESOURCE, true);
			}
		});
		$('#showResources').fastButton(function() {
			var player = self.game.players[self.game.playerNumber];
			if (player.handDisplayed === DeckType.RESOURCE) {
				player.hideHand(DeckType.RESOURCE);
			} else {
				player.displayHand(DeckType.RESOURCE, true);
			}
		});

		$('#showDevCards').click(function() {
			var player = self.game.players[self.game.playerNumber];
			if (player.handDisplayed === DeckType.DEVELOPMENT) {
				player.hideHand(DeckType.DEVELOPMENT);
			} else {
				player.displayHand(DeckType.DEVELOPMENT, false);
			}
		});
		$('#showDevCards').fastButton(function() {
			var player = self.game.players[self.game.playerNumber];
			if (player.handDisplayed === DeckType.DEVELOPMENT) {
				player.hideHand(DeckType.DEVELOPMENT);
			} else {
				player.displayHand(DeckType.DEVELOPMENT, false);
			}
		});
	},

	setupListeners: function() {
		var self = this;
		if(!Util.mobileCheck()) { //If a desktop browser, enable mouse hover to show debug info. This confuses touch events when trying to select vertex
			$('.tile').mouseover(function() {
				$('#debug').html($(this).attr('id') + " : " + $(this).attr('class'))
			})
		}
		
		$('.edge').fastButton(function() {
			self.edgeClicked(this);
		});
		$('.edge').click(function() {
			self.edgeClicked(this);
		});
		
		$('.vertex').fastButton(function() {
			self.vertexClicked(this);
		});
		$('.vertex').click(function() {
			self.vertexClicked(this);
		});
	
		Util.log('set up button listeners');

		this.game.connection.on('applyAction', function(data) {
			self.actions[data.action](self, data.element, data.playerNumber, data.args);
		});
	},
	
	hideModals: function() {
		this.hideModalHack();
	},

	showPurchaseControls: function() {
		$('#purchaseControls').css('display','block');
	},
	
	hidePurchaseControls: function() {
		$('#purchaseControls').css('display','none');
	},
		
	placeSettlement: function(isFree) {
		//1 brick, 1 wood, 1 grain, 1 sheep
		if (this.game.activePlayer === this.game.playerNumber) {
			var player = this.game.players[this.game.playerNumber];
			if (player.settlementPlaced || (!isFree && !this.canAfford(player, 'settlement'))) {
				return;
			}
			this.hideModals();
			Util.log('Waiting for player to place settlement...');
			this.disableControls();

			this.showPurchaseControls();
			
			$('#vertices .unassigned:not(.city)').css('display','block');
			var self = this;
			this.element.on('vertexClick',function(e, vid, player) {
				var vertex = $('#' + vid);
				var edges = vertex.attr('edges').split(' ');
				var tooClose = false;
				//prevent player from placing a settlement less than 2 spaces away from an existing settlement
				for( var i = 0; i < edges.length; i++) {
					var endPoints = $('#' + edges[i]).attr('endpoints').split(' ');
					for (var j = 0; j < endPoints.length; j++) {
						if ($('#' + endPoints[j]).attr('class').split(' ').indexOf('unassigned') < 0) {
							tooClose = true;
						}
					}
				}
				if (!tooClose && vertex.attr('class') == 'vertex unassigned') {
					vertex.attr('class', 'vertex ' + 'player' + player);
					vertex.show();
					$('#vertices .unassigned').css('display', 'none');
					self.element.off('vertexClick');
					self.enableControls();
					self.hidePurchaseControls();
					$('#actions').removeClass('hideActions');

					self.game.connection.emit('doAction', {
						  game: self.game.uniqueKey
						, action: 'placeSettlement'
						, playerNumber: self.game.playerNumber
						, element: vid
					});
					var player = self.game.players[self.game.playerNumber];
					player.removePiece(PieceType.SETTLEMENT);
					player.score++;
					Util.log('Player ' + self.game.playerNumber + ' score: ' + player.score);
					if (!isFree) {
						player.removeCard(DeckType.RESOURCE, ResourceType.BRICK);
						player.removeCard(DeckType.RESOURCE, ResourceType.WOOD);
						player.removeCard(DeckType.RESOURCE, ResourceType.SHEEP);
						player.removeCard(DeckType.RESOURCE, ResourceType.GRAIN);

						self.game.decks[DeckType.RESOURCE][ResourceType.BRICK]++;
						self.game.decks[DeckType.RESOURCE][ResourceType.WOOD]++;
						self.game.decks[DeckType.RESOURCE][ResourceType.SHEEP]++;
						self.game.decks[DeckType.RESOURCE][ResourceType.GRAIN]++;
						self.updateActionStates();
					} else {
						player.settlementPlaced = true;
						self.updateActionStates();
						if (player.roadPlaced) {
							self.endPlayerTurn();
						}
					}
				} else {
					alert('Location already chosen or too close, select an unassigned spot ');
				}
			});
		}
	},

	placeRoadMode: function(isFree){
		//1 brick, 1 wood
		if (this.game.activePlayer === this.game.playerNumber) {
			var player = this.game.players[this.game.playerNumber];

			if (player.roadPlaced || (!isFree && !this.canAfford(player, 'road'))) {
				return;
			}
			this.hideModals();
			Util.log('Waiting for player to place road...');
			this.disableControls();
			this.showPurchaseControls();
			$('#edges .unassigned').css('display', 'block');
			var self = this;	
			this.element.on('edgeClick', function(e, eid, player) {
				if($('#' + eid).attr('class') == 'edge unassigned') {
					$('#' + eid).attr('class','edge ' + 'player' + player);
					$('#edges .unassigned').css('display','none');
					self.element.off('edgeClick');
					self.enableControls();
					self.hidePurchaseControls();
					$('#actions').removeClass('hideActions');
					
					self.game.connection.emit('doAction', {
						 game: self.game.uniqueKey
						,action: 'placeRoad'
						,playerNumber: self.game.playerNumber
						,element: eid
					});

					var player = self.game.players[self.game.playerNumber];
					player.removePiece(PieceType.ROAD);
					if (!isFree) {
						player.removeCard(DeckType.RESOURCE, ResourceType.BRICK);
						player.removeCard(DeckType.RESOURCE, ResourceType.WOOD);
						self.game.decks[DeckType.RESOURCE][ResourceType.WOOD]++;
						self.game.decks[DeckType.RESOURCE][ResourceType.BRICK]++;
						self.updateActionStates();
					} else {
						player.roadPlaced = true;
						self.updateActionStates();
						if (player.settlementPlaced) { 
							self.endPlayerTurn();
						}
					}

					//check for longest road
					var previousLongestRoadHolder = self.game.longestRoadHolder;
					var longestRoad = self.getLongestRoad(player.playerNumber);
					if (longestRoad > this.longestRoad) {
						this.longestRoad = longestRoad;
						if (previousLongestRoadHolder !== player.playerNumber) {
							if (previousLongestRoadHolder) {
								//emit message to subtract 2 points from this player
								self.game.connection.emit('doAction', {
									 game: self.game.uniqueKey
									,action: 'loseLongestRoad'
									,playerNumber: previousLongestRoadHolder
									,element: eid
								});
							}
							player.score += 2;
							self.game.longestRoadHolder = player.playerNumber
						}
					}
				} else {
					alert('Location already chosen, select an unassigned spot ')
				}
			});
		}
	},

	placeCity: function() {
		//2 GRAIN, 3 ore
		if (this.game.activePlayer === this.game.playerNumber) {
			var player = this.game.players[this.game.playerNumber];
			if (!this.canAfford(player, 'city')) {
				return;
			}

			this.hideModals();
			Util.log('Waiting for player to place city...');
			this.disableControls();
			this.showPurchaseControls();

			var settlements = $('#vertices .player' + this.game.playerNumber);
			if (settlements.length) {
				settlements.css('display','block');

				var self = this;
				this.element.on('vertexClick',function(e, vid, player) {
					if($('#c' + vid).attr('class') == 'city vertex unassigned') {
						self.element.off('vertexClick');
						self.enableControls();
						self.hidePurchaseControls();
						$('#actions').removeClass('hideActions');
						
						$('#' + vid).hide();
						$('#c' + vid).show();
						$('#c' + vid).attr('class', 'city ' + $('#' + vid).attr('class'));

						var player = self.game.players[self.game.playerNumber];
						player.score++;
						player.removePiece(PieceType.CITY);
						Util.log('Player ' + self.game.playerNumber + ' score: ' + player.score);

						player.removeCard(DeckType.RESOURCE, ResourceType.GRAIN);
						player.removeCard(DeckType.RESOURCE, ResourceType.GRAIN);
						player.removeCard(DeckType.RESOURCE, ResourceType.ORE);
						player.removeCard(DeckType.RESOURCE, ResourceType.ORE);
						player.removeCard(DeckType.RESOURCE, ResourceType.ORE);
						self.game.decks[DeckType.RESOURCE][ResourceType.GRAIN] += 2;
						self.game.decks[DeckType.RESOURCE][ResourceType.ORE] += 3;

						self.updateActionStates();
					}
				});
			}
		}
	},

	purchaseDevelopmentCard: function() {
		//1 sheep, 1 ore, 1 GRAIN
		if (this.game.activePlayer === this.game.playerNumber) {
			var player = this.game.players[this.game.playerNumber];
			if (!this.canAfford(player, 'devCard')) {
				return;
			}
			if (this.timeout['hideHand']) {
				clearTimeout(this.timeout['hideHand']);
			}
			var devCardDeck = this.game.decks[DeckType.DEVELOPMENT];
			var card = devCardDeck.pop();

			player.removeCard(DeckType.RESOURCE, ResourceType.SHEEP);
			player.removeCard(DeckType.RESOURCE, ResourceType.ORE);
			player.removeCard(DeckType.RESOURCE, ResourceType.GRAIN);

			this.game.decks[DeckType.RESOURCE][ResourceType.SHEEP]++;
			this.game.decks[DeckType.RESOURCE][ResourceType.GRAIN]++;
			this.game.decks[DeckType.RESOURCE][ResourceType.ORE]++;

			player.addCard(DeckType.DEVELOPMENT, card);
			if (card === CardType.VICTORY_POINT) {
				player.score++;
				Util.log('Player ' + this.game.playerNumber + ' score: ' + player.score);
			}
			player.displayHand(DeckType.DEVELOPMENT);
			
			this.timeout['hideHand'] = setTimeout(function() {
				player.hideHand(DeckType.DEVELOPMENT);
			}, 2000);
			Util.log(devCardDeck.length + ' dev cards left');
			this.updateActionStates();
		}
	},

	canAfford: function(player, item) {
		var resources = {};
		if (typeof player.getHand(DeckType.RESOURCE) !== 'undefined') {
			for (var i = 0; i < player.getHand(DeckType.RESOURCE).length; i++) {
				var resource = player.getHand(DeckType.RESOURCE)[i];
				if (typeof resources[resource] === 'undefined') {
					resources[resource] = 0;
				}
				resources[resource] += 1;
			}

			switch (item) {
				case 'devCard':
					return (resources[ResourceType.SHEEP] >= 1 
						 && resources[ResourceType.ORE] >= 1
						 && resources[ResourceType.GRAIN] >= 1);
				case 'road':
					return (resources[ResourceType.BRICK] >= 1 
						 && resources[ResourceType.WOOD] >= 1);
				case 'settlement':
					return (resources[ResourceType.SHEEP] >= 1 
						 && resources[ResourceType.WOOD] >= 1
						 && resources[ResourceType.BRICK] >= 1
						 && resources[ResourceType.GRAIN] >= 1);
				case 'city':
					return (resources[ResourceType.ORE] >= 3
						 && resources[ResourceType.GRAIN] >= 2);

				default:
					break;
			}
		}
		return false;
	},

	addResourceCard: function(player, type) {
		var resources = this.game.decks[DeckType.RESOURCE];
		if (resources[type] > 0) {
			player.addCard(DeckType.RESOURCE, type);
			resources[type]--;
		} else {
			Util.log('Ran out of ' + type + ' cards');
		}
	},

	getLongestRoad: function(player) {
		var longestRoad = 0;
		var self = this;
		var startingCandidates = [];
		var backupCandidates = [];
		$('.edge.player' + player).each(function() {
			var edge = $(this);
			var connections = self.getNumEdgeConnections(edge);
			if (connections === 1) {
				startingCandidates.push(edge.attr('id'));
			} else if (connections >= 2) {
				backupCandidates.push(edge.attr('id'));
			}
		});
		Util.log('1 connection: ' + Util.logArray(startingCandidates));
		Util.log('2+ connections: ' + Util.logArray(backupCandidates));

		var roadTrees = {}; // starting points -> new tree of connected edges
		if (!startingCandidates.length && backupCandidates.length > 0) {
			//pick a road at random to start with
			Util.log('Picking road at random as a starting point for longest road');
			startingCandidates.push(backupCandidates.pop());
		} 

		Util.log('Have ' + startingCandidates.length + ' roads as starting point candidates for longest road');
		if (startingCandidates.length) {
			var root = startingCandidates.pop();
			var roadTree = {};
			roadTree[root] = this.buildRoadTree(root, player);
			Util.log('Road starting from ' + root + ': ' + Util.logObject(roadTree));
		}
		
		return longestRoad;
	},

	/* { e1: {e2: null, e3: {e4: null}}} */
	buildRoadTree: function(root, player, nodeList) {
		var tree = {};
		var children = {};
		if (typeof nodeList === 'undefined') {
			nodeList = [];
		}
		nodeList.push(root);
		var endPoints =  $('#' + root).attr('endpoints').split(' ');
		//debugger;
		for (var i = 0; i < endPoints.length; i++) {
			if (!this.isVertexBlocked($('#' + endPoints[i]))) {
				//check all edges connected to this endpoint (except the given edge)
				var edges = $('#' + endPoints[i]).attr('edges').split(' ');
				for (var j = 0; j < edges.length; j++) {
					//if at least one of the other edges is owned by the player, it is connected to the given edge
					if (edges[j] !== root && $('#' + edges[j]).attr('class').indexOf('player' + player) >= 0) {
						//make sure there aren't any cycles
						if (nodeList.indexOf(edges[j]) < 0) {
							children[edges[j]] = null;
						}
					}
				}
			}
		}
		//TODO: don't choose other edge connected to the endpoint yet, that's a different road
		for (var node in children) {
			if (!tree[node] && nodeList.indexOf(node) < 0) {
				nodeList.push(edges[j]); //mark as visited
				tree[node] = this.buildRoadTree(node, player, nodeList);
			}
		}

		return tree;
	},

	getNumEdgeConnections: function(edge) {
		var endPoints = edge.attr('endpoints').split(' ');
		var connected = [];
		//for both of the given edge's endpoints
		for (var i = 0; i < endPoints.length; i++) {
			//check if the endpoint is unassigned or owned by the player, otherwise it is blocked and this edge is not connected
			if (!this.isVertexBlocked($('#' + endPoints[i]))) {
				//check all edges connected to this endpoint (except the given edge)
				var edges = $('#' + endPoints[i]).attr('edges').split(' ');
				for (var j = 0; j < edges.length; j++) {
					//if at least one of the other edges is owned by the player, it is connected to the given edge
					if (edges[j] !== edge.attr('id') && $('#' + edges[j]).attr('class').indexOf('player' + this.game.playerNumber) >= 0) {
						if (!connected[i]) {
							connected.push(true);
							Util.log('Connected to ' + edges[j] + ' from ' + edge.attr('id'));
						} else {
							Util.log('Already connected to ' + edges[j] + ' from ' + edge.attr('id'));
						}
					}
				}
			} else {
				Util.log('Endpoint ' + endPoints[i] + ' blocked for ' + edge.attr('id'));
			}
		}
		//if an edge has 0 connections, it is a road of length 1; if it has 1 connection, it is an endpoint for a road; if it has 2, it's somewhere in the middle
		return connected.length;
	},

	existsInTree: function(tree, node) {
		for (var n in tree) {
			if (n === node) {
				return true;
			} else if (tree[n] !== null) {
				return this.existsInTree(tree[n], node);
			}
		}
		return false;
	},

	isVertexBlocked: function(vertex) {
		var vertexClasses = vertex.attr('class').split(' ');
		return !(vertexClasses.indexOf('player' + this.game.playerNumber) < 0 || vertexClasses.indexOf('unassigned') < 0);
	},

	startPlayerTurn: function() {
		if (!this.game.isGameOver()) {
			this.disableBuildControls();

			if (this.timeout['dice']) {
				clearTimeout(this.timeout['dice']);
			}
			$('#actions').addClass('hideActions');
			Util.log(this.game.state);
			var player = this.game.players[this.game.activePlayer];
			if (this.game.state !== GameState.FIRST_ROUND) {
				player.roadPlaced = false;
				player.settlementPlaced = false;
				//roll dice
				if (!$('#dice').length) {
					$(this.element).append('<input type="button" id="dice" />');
				}
				var dice = $('#dice');
				dice.removeAttr('disabled');
				dice.fadeIn('fast');
				dice.val('Roll');
				var self = this;
				dice.click(this.rollDice.bind(this));
			} else {
				//First round, take turns placing 1 settlement and 1 road in snake order (1, 2, 3, 3, 2, 1)
				Util.log('Placing initial settlements');
				player.roadPlaced = false;
				player.settlementPlaced = false;

				this.enableControls();
				$('#actions').removeClass('hideActions');
			}
		} else {
			//Game Over
			alert('Game Over');
		}
	},

	rollDice: function() {
		var dice = $('#dice');
		var player = this.game.players[this.game.activePlayer];
		if (player.handDisplayed) {
			player.hideHand(player.handDisplayed);
		}
		if (!dice.attr('disabled') && dice.is(':visible')) {
			dice.val();
			dice.attr('disabled', 'disabled');
			var result = 0;
			var sides = this.game.dice.sides;
			for (var i = 1; i <= this.game.dice.number; i++) {
				result += Math.floor(sides * Math.random()) + 1;
			}
			dice.val(result);
			this.game.connection.emit('doAction', {
				  game: this.game.uniqueKey
				, action: 'showRoll'
				, playerNumber: this.game.activePlayer
				, args: {
					value: result
				}
			});
			if (this.timeout['dice']) {
				clearTimeout(this.timeout['dice']);
			}
			this.timeout['dice'] = setTimeout(function() {
				dice.fadeOut('slow');
			}, 3000);
			
			if (result === 7) {
				//force everyone with > 7 resource cards to discard 4 or half
				var playerNumbers = {};
				for (var player in this.game.players) {
					var deck = this.game.players[player].getHand(DeckType.RESOURCE);
					var numCards = (deck) ? deck.length : 0;
					if (numCards > 7) {
						Util.log('Player' + player + ' has more than 7 cards');
						playerNumbers[player] = numCards / 2;
					}
				}
				if (Object.keys(playerNumbers).length > 0) {
					this.game.connection.emit('doAction', {
						  game: this.game.uniqueKey
						, action: 'updatePlayerResources'
						, playerNumber: this.game.activePlayer
						, args: {
							players: playerNumbers
						}
					});
				}

				//active player can move the robber
				this.disableControls();
				//display message "Click a tile to move the robber."

				this.game.state = GameState.MOVING_ROBBER;

				//temp 
				this.enableControls();
			} else {
				//assign resources
				this.produceResources(result);
				this.enableControls();

				//purchase/build, trade, or play dev card loop
				this.game.state = GameState.IDLE;
			}
		}
	},
	
	endPlayerTurn: function() {
		this.disableBuildControls();
		$('.player' + this.game.playerNumber).removeClass('player-turn');
		if (this.game.state === GameState.FIRST_ROUND) {
			if (this.interval !== -1 && this.game.activePlayer === this.game.getLastPlayer()) {
				this.interval = -1;
				Util.log('Moving turn in reverse order ' + this.game.activePlayer);
			} else {
				if (this.interval === -1 && this.game.activePlayer === this.game.getFirstPlayer()) {
					this.game.state = GameState.IDLE;
					this.interval = 1;
				} else {
					this.game.activePlayer = this.game.getNextPlayer(this.interval);
				}
			}
		} else {
			this.game.state = GameState.IDLE;
			//add starting resources


			this.game.activePlayer = this.game.getNextPlayer();
		}
		//ensure everyone has the same deck of development cards in the same order; might be better to add a sync function on the server instead
		this.game.connection.emit('doAction', {
		  	  game: this.game.uniqueKey
			, action: 'updateDeck'
			, playerNumber: this.game.activePlayer
			, args: {
					 deckType: DeckType.DEVELOPMENT
					,deck: this.game.getDevelopmentCards()
				}
		});

		this.game.connection.emit('doAction', {
			  game: this.game.uniqueKey
			, action: 'endTurn'
			, playerNumber: this.game.activePlayer
			, args: {
					 lastPlayer: this.game.playerNumber
					,interval: this.interval
					,state: this.game.state
				}
			}
		);
		
	},

	disableBuildControls: function() {
		$('#showActions_button').attr('disabled','disabled');
		$('#endTurn_button').attr('disabled','disabled');
		$('#actions').addClass('hideActions');
	},

	produceResources: function(value) {
		Util.log('Producing resources for ' + value);
		var receivedResource = false;
		var settlements = this.getSettlements(this.game.playerNumber);
		if (settlements) {
			var player = this.game.players[this.game.playerNumber];
			for (var i = 0; i < settlements.length; i++) {
				 var settlement = settlements[i];
				 var neighbors = this.getNeighbors($(settlement));
				 if (neighbors && settlement.style.display !== 'none') {
				 	for (var j = 0; j < neighbors.length; j++) {
				 		var tile = $('#' + neighbors[j]);
				 		var tileValue = tile.attr('value');
				 		if (tileValue && parseInt(tileValue) === value) {
				 			var resourceType = this.getTileType(tile);
							this.addResourceCard(player, resourceType);
							if ($(settlement).attr('class').split(' ').indexOf('city') > -1) {
								this.addResourceCard(player, resourceType);
							}
							receivedResource = true;
				 		}
				 	}
				}
			}

			if (receivedResource) {
				player.displayHand(DeckType.RESOURCE, true);
			}
			this.updateActionStates();
		}
	},
	
	updateActionStates: function() {
		var player = this.game.players[this.game.playerNumber];
		var buyRoad = $('#placeRoad_button');
		var buySettlement = $('#placeCity_button');
		var buyCity = $('#upgradeSettle_button');
		var buyDevCard = $('#buyDevCard_button');

		Util.log('Updating action button states');
		//settlements
		if ((this.game.state === GameState.FIRST_ROUND && !player.settlementPlaced) 
		 || (this.canAfford(player, 'settlement') && player.pieceCount(PieceType.SETTLEMENT) > 0)) {
			buySettlement.removeAttr('disabled');
		} else {
			buySettlement.attr('disabled', 'disabled');
		}
		//road
		if ((this.game.state === GameState.FIRST_ROUND && player.settlementPlaced && !player.roadPlaced) 
		 || (this.canAfford(player, 'road') && player.pieceCount(PieceType.ROAD) > 0)) {
			buyRoad.removeAttr('disabled');
		} else {
			buyRoad.attr('disabled', 'disabled');
		}
		//city
		if (this.canAfford(player, 'city') && player.pieceCount(PieceType.CITY) > 0) {
			buyCity.removeAttr('disabled');	
		} else {
			buyCity.attr('disabled', 'disabled');
		}
		//dev card
		if (this.canAfford(player, 'devCard') && this.game.decks[DeckType.DEVELOPMENT].length > 0) {
			buyDevCard.removeAttr('disabled');
		} else {
			buyDevCard.attr('disabled', 'disabled');
		}
	},

	cancelAction: function() {
		this.element.off('edgeClick');
		this.element.off('vertexClick');
		$('#edges .unassigned').css('display','none');
		$('#vertices .unassigned').css('display','none');
		this.hidePurchaseControls();
		this.enableControls();
	},
	
	disableControls: function() {
		//Use when you're asking a user to perform action
		$('#controls').css('display','none');
		$('#endTurn_button').css('display','none');
		$('#actions').addClass('hideActions');
		$('#showResources').css('display', 'none');
		$('#showDevCards').css('display', 'none');
	},
	
	enableControls: function() {
		$('#controls').css('display','block');
		$('#endTurn_button').css('display','block');
		$('#showResources').css('display', 'inline-block');
		$('#showDevCards').css('display', 'inline-block');
		$('#showActions_button').removeAttr('disabled');
		$('#endTurn_button').removeAttr('disabled');
		this.updateActionStates();
	},

	/* Game Board render functions */
	renderTiles: function() {
		// draw tile value inside each hex
		Util.log('rendering tile values...');
		var tileCount = 0;
		var self = this;
		$('.tile').each(function(){
			if($(this).attr('value')) {
				tileCount++;
				var hexPoints = $(this).attr('points').split(' ');
				for(var p in hexPoints) {
					hexPoints[p] = hexPoints[p].split(',');
					hexPoints[p][0] = parseInt(hexPoints[p][0]);
					hexPoints[p][1] = parseInt(hexPoints[p][1]);
				}

				var center = self.findCenterOfPolygon(hexPoints);

				var textColor = 'white';
				if($(this).attr('value') == 6 || $(this).attr('value') == 8) {
					textColor = 'red';
				}
				
				var tileContents = $(this).attr('value');
				if(tileContents == '7') {
					tileContents = '&#8226;';
				}
				
				// Render off screen to get width and use it to center text
				if (!$('#t' + tileCount).length) {
					$('#tiles').append('<text id="t' + tileCount + '" x="-1000" y="1000" fill="' + textColor + '">' + tileContents + '</text>');
				} else {
					$('#t' + tileCount).html(tileContents);
					$('#t' + tileCount).attr('fill', textColor);
				}
				self.element.html(self.element.html()); //hack to allow jquery to render elements
				
				var textDimensions = document.getElementById('t' + tileCount).getBoundingClientRect();
									
				var CONSTANT_X = parseInt(textDimensions.width / 2); //half of text width
				var CONSTANT_Y = +7; //parseInt(textDimensions.height / 2)
				
				$('#t' + tileCount).attr('x', (center[0] - CONSTANT_X)).attr('y', center[1] + CONSTANT_Y);
			}
		});
		this.element.html(this.element.html()); //hack to allow jquery to manipulate SVG elements
	
		Util.log('rendered ' + tileCount + ' tiles');
	},
	
	//somewhat complicated function, excessive commenting to follow
	createEdges: function() {
		Util.log('generating edges...');

		var totalEdgesCreated = 0;
		var vertexEdgeCount = {};
		var self = this;

		//for all vertices
		$('circle.vertex').each(function() {
			var vertexI = $(this);
			//initialize vertex element edge list
			vertexI.attr('edges', '');
			//initialize edge count for this vertex
			vertexEdgeCount[vertexI.attr('id')] = 0;

			//check all the other vertices to see if they are connected by an edge
			$('circle.vertex').each(function() {
				//keep track of how many edges have connected to this vertex already, only add 3 max
				if (vertexEdgeCount[vertexI.attr('id')] < 3) {
					var vertexJ = $(this);
					//don't bother if vertexJ is the same as vertexI, obviously no edge exists in that case
					if (vertexJ.attr('id') !== vertexI.attr('id')) {
						//get the distance between the two vertices on the x axis
						var horizontalDistance = Math.abs(parseInt(vertexI.attr('cx')) - parseInt(vertexJ.attr('cx')));
						//get the distance between the two vertices on the y axis
						var verticalDistance = Math.abs(parseInt(vertexI.attr('cy')) - parseInt(vertexJ.attr('cy')));

						//keep track of the two vertices for this edge so they can be quickily referenced later
						var endPoints = vertexI.attr('id') + ' ' + vertexJ.attr('id');

						var x1 = vertexI.attr('cx');
						var y1 = vertexI.attr('cy');
						var x2 = vertexJ.attr('cx');
						var y2 = vertexJ.attr('cy');

						//if the vertices have the same y position and they are not the middle vertices, then they are either the top or bottom edge of a tile
						if(vertexI.attr('cy') == vertexJ.attr('cy') && horizontalDistance < 100 && !self.isEdgeDuplicate(x1, y1, x2, y2)) {
							//create an edge, add the endpoints as an attribute
							$('#edges').append('<line endpoints="' + endPoints + '" id="e' + totalEdgesCreated + '" class="edge unassigned" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" />');
							
							//increase edge count for vertexI
							vertexEdgeCount[vertexI.attr('id')]++;
							totalEdgesCreated++;
						}
						
						//if vertical distance is less than the the height of the tile, the edge must exist on a side that is neither the top or bottom edge
						if(verticalDistance > 61 && verticalDistance < 64 && horizontalDistance < 50 && !self.isEdgeDuplicate(x1, y1, x2, y2)) { //These magic numbers need to be configurable based on tile size...
							//create an edge, add the endpoints as an attribute
							$('#edges').append('<line endpoints="' + endPoints + '" id="e' + totalEdgesCreated + '" class="edge unassigned" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" />');
							
							//increase edge count for vertexI
							vertexEdgeCount[vertexI.attr('id')]++;
							totalEdgesCreated++;
						}

						//a vertex of a hex tile can only have 3 connected edges so stop searching if 3 edges created
						if (vertexEdgeCount[vertexI.attr('id')] === 3) { 
							return false;
						}
					}
				}
			});
		});

		//assign edges to vertices
		$('.edge').each(function() {
			var edge = $(this);
			var id = edge.attr('id');
			var endPoints = edge.attr('endpoints').split(' ');

			for (var i = 0; i < endPoints.length; i++) {
				var vertexId = endPoints[i];
				var vertex = $('#' + vertexId);
				var city = $('#c' + vertexId);
				var edges = vertex.attr('edges').split(' ');

				if (edges.indexOf(id) < 0) {
					var existingEdges = (vertex.attr('edges').length > 0) ? vertex.attr('edges') + ' ' : '';
					vertex.attr('edges', existingEdges + id);
					city.attr('edges', existingEdges + id);
				}
			}
		});

		this.element.html(this.element.html()); //hack to allow jquery to manipulate SVG elements
		
		Util.log('finished making ' + totalEdgesCreated + ' edges...');
		
	},

	isEdgeDuplicate: function(x1, y1, x2, y2) {
		var duplicate = false;
		$('.edge').each(function() {
			var edge = $(this);
			var edgeX1 = edge.attr('x1');
			var edgeY1 = edge.attr('y1');
			var edgeX2 = edge.attr('x2');
			var edgeY2 = edge.attr('y2');
			if (edgeX1 === x2 && edgeY1 === y2 && edgeX2 === x1 && edgeY2 === y1) {
				duplicate = true;
				return true;
			}
		});
		return duplicate;
	},
	
	createVertices: function() {
		Util.log('generating verts...')
		var vertCount = 0;
		var self = this;
		$('.tile').each(function() {
			tid = $(this).attr('id')
			if(self.hiddenTiles.indexOf(tid) < 0) { //ignore hidden tiles
				var tileVertsString = $(this).attr('points');
				var tileVerts = tileVertsString.split(' ');
				var existingCityVertex;
				
				for(var v in tileVerts) {
					var xY = tileVerts[v].split(',');
					var duplicateVertex = false;
					var existingVertex = null;
					$('.vertex').each(function() {
						if($(this).attr('cx') == Math.round(parseFloat(xY[0])) && $(this).attr('cy') == Math.round(parseFloat(xY[1]))) {
							duplicateVertex = true;
							existingVertex = this;
							existingCityVertex = $('#c' + $(this).attr('id'));
							return false;

						}
					});
					var existingNeighbors =  (existingVertex && $(existingVertex).length && $(existingVertex).attr('neighbors')) ? $(existingVertex).attr('neighbors') + ' ' : '';	
					if(!duplicateVertex) {
						vertCount++;
						$('#vertices').append('<circle id="v'+vertCount+'" class="vertex unassigned" cx="'+Math.round(parseFloat(xY[0]))+'" cy="'+Math.round(parseFloat(xY[1]))+'" r="15"/>');
						$('#vertices').append('<rect id="cv'+vertCount+'" class="city vertex unassigned" x="'+Math.round(parseFloat(xY[0]) - 15)+'" y="'+Math.round(parseFloat(xY[1]) - 15)+'" width="30" height="30" />');
						existingVertex = $('#v' + vertCount);
						existingCityVertex = $('#cv' + vertCount);
					}
					$(existingVertex).attr('neighbors', existingNeighbors + tid);
					$(existingCityVertex).attr('neighbors', existingNeighbors + tid);
				}
			}
		});
		
		$(this).html($(this).html()); //hack to allow jquery to render SVG elements
		Util.log('finished making '+vertCount +' vertices');
	},

	getSettlements: function(playerNumber) {
		return $('#vertices .player' + playerNumber);
	},
	
	getNeighbors: function(vertex) {
		var neighbors = null;
		if ($(vertex).length) {
			neighbors = $(vertex).attr('neighbors');
			if (neighbors.length) {
				neighbors = neighbors.split(' ');
			}
		}
		return neighbors;
	},

	getTileType: function(tile) {
		var type = null;
		if (tile && tile.length) {
			type = tile.attr('class');
			if (type.length) {
				type = type.split('tile')[0].trim();
			}
			type = type.toUpperCase();
			type = ResourceType[type];
		}
		return type;
	},

	edgeClicked: function(edgeThis) {
		Util.log($(edgeThis).attr('id'));
	
		var pNumber = this.game.playerNumber; // current player
	
		this.element.trigger('edgeClick', [$(edgeThis).attr('id'), pNumber]);
	},
	
	vertexClicked: function(vertexThis) {
		Util.log($(vertexThis).attr('id'));
	
		var pNumber = this.game.playerNumber; // current player
	
		this.element.trigger('vertexClick', [$(vertexThis).attr('id'), pNumber]);
	},
	
	/* Utility Functions */
	
	hideModalHack: function() {
		$('#purchase_modal').removeClass('show_modal');
	},
	
	findCenterOfPolygon: function(coords) {
		//http://stackoverflow.com/questions/16282330/find-centerpoint-of-polygon-in-javascript
		/*var coords = [
		  [ -1.2, 5.1 ],
		  [ -1.3, 5.2 ],
		  [ -1.8, 5.9 ],
		  [ -1.9, 5.8 ]
		];*/
	
		var center = function(arr){
		    var minX, maxX, minY, maxY;
		    for(var i=0; i< arr.length; i++) {
		        minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
		        maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
		        minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
		        maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
		    }
		    return [(minX + maxX) / 2, (minY + maxY) / 2];
		}
		var c = center(coords);
		return c;	
	}
};