function addNewBlocks() {

	settings = levelSettings();
	blocksToPlace = settings['blocksToPlace'];

	if (initialSetup == 1) {
		blocksToPlace = 30;
		window.initialSetup = 0;
	}

	var numberOfBlocksOnGrid = $('.block').length;
	freePositons = ((gridSize * gridSize) - numberOfBlocksOnGrid);
	
	if (placeNewBlocks == 1) {
		if (freePositons < blocksToPlace) {
			handleBestScores();
			showNotification('Game over', 3);
			playSound('gameover');
			localStorage.removeItem('hole');
			localStorage.removeItem('blocks');
			localStorage.removeItem('settings');
		} else {
			$('#grid').addClass('active').removeClass('inactive');
			for (i = 1; i <= blocksToPlace; i++ ) {

				randId = randomPosition();
				freePosition = true;
				$('.block').each(function() {
					if (this.id == randId) {
						freePosition = false;
					}
				});
				
				if (freePosition) {
					block = getRandomBlock();
					var ran = randId.split("-");
					randomPositionX = (ran[0] - 1) * blockWidth;
					randomPositionY = (ran[1] - 1) * blockWidth;
					if (block == 'bomb-black' || block == 'bomb-red' || block == 'bomb-green' || block == 'bomb-yellow' || block == 'bomb-purple' || block == 'bomb-blue' || block == 'bomb-brown') {
						$('#grid').append($('<div class="block" name="'+block+'" id="'+randId+'"><img src="svg/'+block+'.svg" width="'+blockWidth+'" /></div>').show());
						$('#' + randId).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : randomPositionX+'px', 'margin-top' : randomPositionY+'px'});
						$('#' + randId).addClass('bomb appear');
					} else {
						$('#grid').append($('<div class="block" name="'+block+'" id="'+randId+'"></div>').show());
						$('#' + randId).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : randomPositionX+'px', 'margin-top' : randomPositionY+'px', 'border-radius': (blockWidth / 10 * 2) + 'px', 'background-color' : getColorCode(block, 0), 'border': (blockWidth / 10) + 'px solid ' + getColorCode(block, 1)});
						$('#' + randId).addClass('appear');
					}
				} else {
					i = i - 1;
				}
			}

			if (i > blocksToPlace) {
				$('#grid').addClass('inactive').removeClass('active');
				freePositions();
				memorize();
			}
		}
	} else {
		window.placeNewBlocks = 1;	
		freePositions();
		memorize();
	}
}

function addNuggets(ilegalPositions) {

	//$('#grid').addClass('active').removeClass('inactive');

	if (typeof ilegalPositions === 'undefined') {
		ilegalPositions = [];
	}

	holeCoordinates = $('.hole').attr('id').split('-');
	ilegalPositions.push(holeCoordinates[0] + '-' + holeCoordinates[1]);

	function newNuggetsPosition(newPostionCords, ilegalPositions) {
		if (jQuery.inArray(newPostionCords, ilegalPositions) == -1) {
			return 1;
		} else {
			return 0;
		}
	}

	function placeNugget(nuggetType, newNugget) {
		$('#grid').append($('<div class="block nugget appear" name="'+nuggetType+'" id="'+newNugget+'"><img src="svg/'+nuggetType+'.svg" width="'+blockWidth+'"/></div>').show());
		var ran = newNugget.split("-");
		randomPositionX = (ran[0] - 1) * blockWidth;
		randomPositionY = (ran[1] - 1) * blockWidth;
		$('#' + newNugget).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : randomPositionX+'px', 'margin-top' : randomPositionY+'px'});
	}

	function removeObsticles(newNugget) {
		$('.block').each(function() {
			if (this.id == newNugget) {
				$('#' + this.id).remove();
			}
		});		
	}

	for (j = 0; j < gridSize * gridSize; j++) {
		newNugget = randomPosition();
		free = newNuggetsPosition(newNugget, ilegalPositions);
		if (free == 1) {
			break;
		}
	}
	removeObsticles(newNugget);
	placeNugget('nugget-gold', newNugget);

	ilegalPositions.push(newNugget);
	for (j = 0; j < gridSize * gridSize; j++) {
		newNugget = randomPosition();
		free = newNuggetsPosition(newNugget, ilegalPositions);
		if (free == 1) {
			break;
		}
	}
	removeObsticles(newNugget);
	placeNugget('nugget-silver', newNugget);

	memorize();
	setTimeout(function(){
		$('#grid').addClass('inactive').removeClass('active');
	}, 300);

}

function placeHole() {
	//randId = getHolePosition();
	ranX = Math.floor(Math.random() * gridSize) + 1;
	ranY = Math.floor(Math.random() * gridSize) + 1;
	randId = ranX + '-' + ranY;	
	$('#grid').append($('<div class="hole" id="'+randId+'-hole"></div>').show());
	var ran = randId.split("-");
	randomPositionX = (ran[0] - 1) * blockWidth;
	randomPositionY = (ran[1] - 1) * blockWidth;
	$('#' + randId + '-hole').css({'box-shadow': 'inset '+(blockWidth / 20)+'px '+(blockWidth / 20)+'px '+(blockWidth / 20)+'px '+(blockWidth / 20)+'px #6d5b45', 'width' : blockWidth, 'height' : blockWidth, 'margin-left' : randomPositionX+'px', 'margin-top' : randomPositionY+'px', 'background-color' : '#fff7ee'});					
}

/*function getHolePosition() {
	
	settings = levelSettings();
	
	if (settings['holePlacement'] == 'all') {
		var ranX = Math.floor(Math.random() * gridSize) + 1;
		var ranY = Math.floor(Math.random() * gridSize) + 1;
		return ranX + '-' + ranY;	

	} else if (settings['holePlacement'] == 'onlyEdges') {
		var randomLine = Math.floor(Math.random() * (4)) + 1;
		if (randomLine == 1) {
			var ranX = Math.floor(Math.random() * (gridSize - 3)) + 2;
			var ranY = 1;
		} else if (randomLine == 2) {
			var ranX = Math.floor(Math.random() * (gridSize - 3)) + 2;
			var ranY = gridSize;			
		} else if (randomLine == 3) {
			var ranX = 1;	
			var ranY = Math.floor(Math.random() * (gridSize - 3)) + 2;	
		} else if (randomLine == 4) {
			var ranX = gridSize;	
			var ranY = Math.floor(Math.random() * (gridSize - 3)) + 2;				
		}
		return ranX + '-' + ranY;			
	} else if (settings['holePlacement'] == 'onlyCorners') {
		var randomCorner = Math.floor(Math.random() * (4)) + 1;		
		if (randomCorner == 1) {
			return '1-1';
		} else if (randomCorner == 2) {
			return '1-' + gridSize;
		} else if (randomCorner == 3) {
			return gridSize + '-1';
		} else if (randomCorner == 4) {
			return gridSize + '-' + gridSize;
		}
	}	
}*/

function randomPosition() {
	var ranX = Math.floor(Math.random() * (gridSize)) + 1;
	var ranY = Math.floor(Math.random() * (gridSize)) + 1;
	return ranX + '-' + ranY;
}

function getRandomBlock() {
	settings = levelSettings();
	
	if (settings['possibilityOfBomb'] == 0) {
		color = getRandomColor();
		return color;
	} else {
		var randomBlock = Math.floor(Math.random() * (settings['possibilityOfBomb'])) + 1;
		if (randomBlock == 1) {
			bomb = getRandomBomb();
			return bomb;
		} else {
			color = getRandomColor();
			return color;
		}
	}
}

function getRandomBomb() {
	settings = levelSettings();
	var randomBomb = Math.floor(Math.random() * (settings['numberOfColors']+1)) + 1;
	if (randomBomb == 1) {
		return 'bomb-black';
	} else if (randomBomb == 2) {
		return 'bomb-red';
	} else if (randomBomb == 3) {
		return 'bomb-green';
	} else if (randomBomb == 4) {
		return 'bomb-yellow';
	} else if (randomBomb == 5) {
		return 'bomb-brown';
	} else if (randomBomb == 6) {
		return 'bomb-blue';
	} else if (randomBomb == 7) {
		return 'bomb-purple';
	}
}

function getRandomColor() {
	settings = levelSettings();
	var randomColor = Math.floor(Math.random() * (settings['numberOfColors'])) + 1;
	if (randomColor == 1) {
		return 'red';
	} else if (randomColor == 2) {
		return 'green';
	} else if (randomColor == 3) {
		return 'yellow';
	} else if (randomColor == 4) {
		return 'brown';
	} else if (randomColor == 5) {
		return 'blue';
	} else if (randomColor == 6) {
		return 'purple';
	}
}	

/*function getColorCode(color) {
	if (color == 'red' || color == 'bomb-red') {
		return '#be7467';	
	} else if (color == 'green' || color == 'bomb-green') {
		return '#539770';
	} else if (color == 'yellow' || color == 'bomb-yellow') {
		return '#e2ae63';
	} else if (color == 'purple' || color == 'bomb-purple') {
		return '#956ea5';
	} else if (color == 'blue' || color == 'bomb-blue') {
		return '#7dc6db';
	} else if (color == 'brown' || color == 'bomb-brown') {
		return '#67402a';
	} else if (color == 'bomb-black') {
		return '#4d4d4d';
	}
}*/

function getColorCode(color, border) {
	if (color == 'red' || color == 'bomb-red') {
		colorCode = '#A23E2F';	
	} else if (color == 'green' || color == 'bomb-green') {
		colorCode =  '#68751F';
	} else if (color == 'yellow' || color == 'bomb-yellow') {
		colorCode =  '#DBBE00';
	} else if (color == 'purple' || color == 'bomb-purple') {
		colorCode =  '#A864F2';
	} else if (color == 'blue' || color == 'bomb-blue') {
		colorCode =  '#006A8A';
	} else if (color == 'brown' || color == 'bomb-brown') {
		colorCode =  '#704700';
	} else if (color == 'bomb-black') {
		colorCode =  '#4d4d4d';
	}
	
	if (border == 1) {
		return colorLuminance(colorCode, -0.2);
	} else {
		return colorCode;
	}
}

function colorLuminance(hex, lum) {

	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

