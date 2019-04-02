function memorize() {
	blocks = [];
	$.each($('.block'), function(index, value) {
		blocks.push({id: value.id, class: $('#' + value.id).attr('class'), name: $('#' + value.id).attr('name')});
	});

	settings = {
		scores: scores,
		level: level
	};

	localStorage.setItem('blocks', JSON.stringify(blocks));
	localStorage.setItem('settings', JSON.stringify(settings));
	localStorage.setItem('hole', $('.hole')[0].outerHTML);
}

function calculateGridSize() {

	gridWidth = Math.floor(($('.wrapper').width() - 20) / gridSize) * gridSize;

	for (i = 0; i < 100; i++) {
		gridWidth = gridWidth - i;
		rem = gridWidth % gridSize;
		if (rem == 0) {
			break;
		}
	}

	if (gridWidth > 600) {
		gridWidth = 600;
	}

	window.blockWidth = gridWidth / gridSize;

	$('#restartConfirmation, #exitConfirmation, .close, #next1, #next2, .menuButton, #appTitle').css({fontSize: (blockWidth / 3 * 2) + 'px'});
	$('#scoreCount, #bestScores, #level, #tutorial1, #tutorial2, #tutorial3, .footerInside, .right').css({fontSize: (blockWidth / 3 * 1.5) + 'px'});
	$('.consoleSmallSquare').css({fontSize: (blockWidth / 3 * 1.2) + 'px'});
	$('#grid, .consoleSmallSquare, .close, #next1, #next2, .menuButton').css({'border-radius': (blockWidth / 10 * 2) + 'px'});
	$('.consoleButton').css({'padding-top': (blockWidth / 10 * 2) + 'px', 'padding-left': (blockWidth / 10 * 2) + 'px'});
	$('#notification ').css({'font-size': blockWidth + 'px', 'margin-top': ((gridWidth - (blockWidth * 2)) / 2) + 'px'});
	$('.menuButton').css({fontSize: (blockWidth / 3 * 2) + 'px', 'padding': (blockWidth / 10) + 'px'});
	$('p').css({'min-height': (gridWidth / 6 * 2) + 'px'});

	$('#logo').width(blockWidth);
	$('#logo').height(blockWidth);

	$('#menu').css({'opacity': '0.9'});
	$('#grid').css({'width' : gridWidth, 'height' : gridWidth});
	$('.tutorialImage').css({'width' : gridWidth / 3 * 2, 'height' : gridWidth / 3 * 2});
	$('.block, .left').css({'width' : blockWidth, 'height' : blockWidth});
	//$('.wrapper').css({'height' : $('body').height() + 'px'});
	$('#grid').css({'display' : 'block'});
	//$('#adWrapper').css({'width' : gridWidth});

	deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if (deviceType == 'iPad' || deviceType == 'iPhone') {
		$('.platform').html("App Store");
	} else {
		$('.platform').html("Google Play");
	}

	$('#grid').css({'margin-bottom': '10px', 'margin-top': '10px'});
	//$('#consoleWrapper').css({'margin-bottom': (($('body').height() - gridWidth - $('#consoleWrapper').height() - $('#scoresWrapper').height() - 10) / 2) + 'px'});
}

function initialize() {

	$('.block, .hole').remove();
	window.gridSize = 8;
	calculateGridSize();

	blocks = localStorage.getItem('blocks');

	window.playSounds = 1;
	if (localStorage.getItem('soundsEnabled') == 0) {
		window.playSounds = 0;
		$('#buttonSound').html('Sounds OFF');
	}

	if (localStorage.getItem('musicEnabled') == 1) {
		$('#buttonMusic').html('Music ON');
		setTimeout(function(){
			playMusic();
		}, 2000);
	}

	if (blocks) {
		$('#grid').append(localStorage.getItem('hole'));
		blocks = JSON.parse(blocks);
		$.each(blocks, function(index, value) {

			coordinates = value.id.split("-");
			coordinates[0] = parseInt(coordinates[0]);
			coordinates[1] = parseInt(coordinates[1]);
			xPos = blockWidth * (coordinates[0] - 1);
			yPos = blockWidth * (coordinates[1] - 1);

			if (value.class == 'block appear') {
				$('#grid').append($('<div class="'+value.class+'" name="'+value.name+'" id="'+value.id+'"></div>').show());
				$('#' + value.id).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : xPos+'px', 'margin-top' : yPos+'px', 'border-radius': (blockWidth / 10 * 2) + 'px', 'background-color' : getColorCode(value.name, 0), 'border': (blockWidth / 10) + 'px solid ' + getColorCode(value.name, 1)});
			} else if (value.class == 'block nugget appear') {
				$('#grid').append($('<div class="'+value.class+'" name="'+value.name+'" id="'+value.id+'"><img src="svg/'+value.name+'.svg" width="'+blockWidth+'"/></div>').show());
				$('#' + value.id).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : xPos+'px', 'margin-top' : yPos+'px'});
			} else if (value.name == 'bomb-black' || value.name == 'bomb-red' || value.name == 'bomb-green' || value.name == 'bomb-yellow' || value.name == 'bomb-purple' || value.name == 'bomb-blue' || value.name == 'bomb-brown') {
				$('#grid').append($('<div class="'+value.class+'" name="'+value.name+'" id="'+value.id+'"><img src="svg/'+value.name+'.svg" width="'+blockWidth+'" /></div>').show());
				$('#' + value.id).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : xPos+'px', 'margin-top' : yPos+'px'});
			}
		});

		settings = localStorage.getItem('settings');
		settings = JSON.parse(settings);
		window.scores = settings['scores'];
		window.level = settings['level'];
		window.initialSetup = 0;
		window.placeNewBlocks = 1;
		$('#level').html(level);
		$('#scoreCount').html(scores);
		handleBestScores();
	} else {
		if (localStorage.getItem('initialHelpDisplay') == null) {
			$('#tutorial1').css({'display' : 'block'});
			localStorage.setItem('initialHelpDisplay', 1);
		}
		window.scores = 0;
		window.level = 1;
		$('#level').html(level);
		$('#scoreCount').html(scores);
		settings = levelSettings();
		window.placeNewBlocks = 1;
		window.initialSetup = 1;
		handleBestScores();
		placeHole();
		addNewBlocks(40);
		addNuggets();
	}
}
