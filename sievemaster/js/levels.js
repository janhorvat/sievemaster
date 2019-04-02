function levelSettings() {
	
	colors = Math.floor(Math.sqrt(level) / 2.5) + 3;
	if (colors > 6) {
		colors = 6;
	}
	
	possibilityOfBomb = 100 - ((Math.floor(Math.sqrt(level) / 2.5)) * 10);

	if (level < 7) {
		possibilityOfBomb = 0;
	}
	
	return {
		'blocksToPlace': Math.ceil((Math.sqrt(level) / 3) * 2),
		'numberOfColors': colors,
		'possibilityOfBomb': possibilityOfBomb
	};

}

function levelUp(nuggetCoordinates) {

	nugget = $('#' + nuggetCoordinates).attr('name');
	$('.nugget').remove();
	if (nugget == 'nugget-gold') {	
		blcks = $(".block:not(.bomb):not(.destroy):not(.nugget)").get();
		destroyable = [];
		if (blcks.length >= 9) {
			window.len = Math.floor(blcks.length / 3);
			blcks = blcks.sort(function(){ 
				return Math.round(Math.random()) - (len / 10)
			}).slice(0, len);
			$.each(blcks, function() { 
				destroyable.push(this.id);
			});
		}
		clearBlocks(destroyable, 'dive');
		countScores(0, 'nugget-gold');
	} else if (nugget == 'nugget-silver') {
		playSound('dive');
		countScores(0, 'nugget-silver');
		addNuggets();
	}

	window.level = level + 1;
	settings = levelSettings();
	$('#level').html(level);	
	showNotification('Level ' + level, 2);
	$('.hole').remove();
	placeHole();
}

function countScores(amountOfBlocks, type) {
	if (type == 'clear') {
		addScore = Math.ceil((amountOfBlocks * amountOfBlocks * level) / 10);
	} else if (type == 'bomb') {
		addScore = Math.ceil((amountOfBlocks * level) / 10);
	} else if (type == 'nugget-gold') {
		addScore = 30 * level;
	} else if (type == 'nugget-silver') {
		addScore = 10 * level;
	}
	window.scores = scores + addScore;
	showNotification(addScore, 2);
	$('#scoreCount').html(scores);
	handleBestScores();
}

function freePositions() {
	var numberOfBlocksOnGrid = $('.block').length;
	freePositons = ((gridSize * gridSize) - numberOfBlocksOnGrid);	
	settings = levelSettings();
	if (settings['blocksToPlace'] > freePositons) {
		showNotification('Danger!', 1);
	}
}

function showNotification(text, speed) {
	$('#notification').stop().css({display : 'block', color : '#fff7ee'}).html(text);
	if (speed == 3) {
		$('#notification').fadeIn("slow");
	} else if (speed == 2) {	
		$('#notification').fadeIn("slow", function(speed) {
			$('#notification').fadeOut("slow");
		});				
	} else if (speed == 1) {
		$('#notification').css({color : '#ecb413'});
		$('#notification').fadeIn("slow", function(speed) {
			$('#notification').fadeOut(1500);
		});		
	}
}

function handleBestScores() {
	bestScores = localStorage.getItem('bestScores');
	if (!bestScores) {
		bestScores = 0;
	}
	if (bestScores < window.scores) {
		localStorage.setItem('bestScores', scores);
		$('#bestScores').html(scores);
	} else {
		$('#bestScores').html(bestScores);
	}
}
