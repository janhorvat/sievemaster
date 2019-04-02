function determineBlocksToClear(clickedObject) {
	coordinates = clickedObject.split("-");
	if (coordinates[2]) {
		clickedId = coordinates[0] + '-' + coordinates[1];
	} else {
		clickedId = clickedObject;
	}

	color = $('#' + clickedId).attr('name');
	
	if (color == 'red' || color == 'green' || color == 'yellow' || color == 'purple' || color == 'blue' || color == 'brown') {
		neighbours = [];			
		neighbours = getNeighbours(color, clickedId, neighbours);

		function distinctVal(neighbours) {
			var temp = [];
			for (i = 0, j = neighbours.length; i < j; i++) {
				if (temp.indexOf(neighbours[i]) == -1) {
					temp.push(neighbours[i]);
				}
			}
			return temp;
		}

		for (i = 0; i <= 50; i++) {
			oldLen = Object.keys(neighbours).length;
			$.each(neighbours, function(index, id) {
				getNeighbours(color, id, neighbours);
			});
			neighbours = distinctVal(neighbours);
			newLen = Object.keys(neighbours).length;
			if (oldLen == newLen) {
				break;
			}
		}
		clearBlocks(neighbours, 'clear');
	}
	
	if (color == 'bomb-black') {
		coordinates = clickedId.split("-");
		coordinates[0] = parseInt(coordinates[0]);
		coordinates[1] = parseInt(coordinates[1]);
		destroyable = { 
			0 : clickedId,
			1 : (coordinates[0] + 1) + '-' + coordinates[1], 
			2 : (coordinates[0] - 1) + '-' + coordinates[1], 
			3 : coordinates[0] + '-' + (coordinates[1] + 1), 
			4 : coordinates[0] + '-' + (coordinates[1] - 1),
			5 : (coordinates[0] + 2) + '-' + coordinates[1], 
			6 : (coordinates[0] - 2) + '-' + coordinates[1], 
			7 : coordinates[0] + '-' + (coordinates[1] + 2), 
			8 : coordinates[0] + '-' + (coordinates[1] - 2),
			9 : (coordinates[0] + 1) + '-' + (coordinates[1] + 2), 
			10 : (coordinates[0] - 1) + '-' + (coordinates[1] + 2), 
			11 : (coordinates[0] + 1) + '-' + (coordinates[1] - 2), 
			12 : (coordinates[0] - 1) + '-' + (coordinates[1] - 2),
			13 : (coordinates[0] + 2) + '-' + (coordinates[1] + 1), 
			14 : (coordinates[0] - 2) + '-' + (coordinates[1] + 1), 
			15 : (coordinates[0] + 2) + '-' + (coordinates[1] - 1), 
			16 : (coordinates[0] - 2) + '-' + (coordinates[1] - 1),
			17 : (coordinates[0] + 1) + '-' + (coordinates[1] + 1), 
			18 : (coordinates[0] - 1) + '-' + (coordinates[1] + 1), 
			19 : (coordinates[0] + 1) + '-' + (coordinates[1] - 1), 
			20 : (coordinates[0] - 1) + '-' + (coordinates[1] - 1)
		};
		clearBlocks(destroyable, 'bomb');
	}	
	if (color == 'bomb-red' || color == 'bomb-green' || color == 'bomb-yellow' || color == 'bomb-purple' || color == 'bomb-blue' || color == 'bomb-brown') {	
		destroyable = [];
		destroyable.push(clickedId);
		bombColor = color.split("-");
		$('.block').each(function() {
			blockColor = $('#' + this.id).attr('name');
			if (bombColor[1] == blockColor) {
				destroyable.push(this.id);
			}
		});
		clearBlocks(destroyable, 'bomb');
	}	
}

function clearBlocks(destroyable, type) {
	
	amountOfBlocks = Object.keys(destroyable).length;
	if (amountOfBlocks >= 3 || type == 'bomb') {
		$('#grid').addClass('active').removeClass('inactive');

		i = 1;
		$.each(destroyable, function(index, id) {

			if (($('#' + id).attr('class') == 'block appear' || $('#' + id).attr('class') == 'block bomb appear') && $('#' + id).attr('class') != 'block nugget appear') {

				blockType = $('#' + id).attr('name');
				$('#' + id).remove(); 

				var ran = id.split("-");
				randomPositionX = (ran[0] - 1) * blockWidth;
				randomPositionY = (ran[1] - 1) * blockWidth;
				if (blockType == 'bomb-black' || blockType == 'bomb-red' || blockType == 'bomb-green' || blockType == 'bomb-yellow' || blockType == 'bomb-purple' || blockType == 'bomb-blue' || blockType == 'bomb-brown') {
					$('#grid').append($('<div class="block" name="'+blockType+'" id="'+id+'"><img src="svg/'+blockType+'.svg" width="'+blockWidth+'" /></div>').show());
					$('#' + id).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : randomPositionX+'px', 'margin-top' : randomPositionY+'px'});
					$('#' + id).addClass('bomb');
				} else {
					$('#grid').append($('<div class="block" name="'+blockType+'" id="'+id+'"></div>').show());
					$('#' + id).css({'width' : blockWidth, 'height' : blockWidth, 'margin-left' : randomPositionX+'px', 'margin-top' : randomPositionY+'px', 'border-radius': (blockWidth / 10 * 2) + 'px', 'background-color' : getColorCode(blockType)});
				}

				$('#' + id).addClass('destroy');
		
				setTimeout(function() {
					$('#' + id).remove(); 
				}, 300);	
				
				if (blockType == 'bomb-black') {
					amountOfBlocks = 21;
					$.each(destroyable, function(index, id) {
						destroyableClass = $('#' + id).attr('class');
						if (typeof destroyableClass === 'undefined' || destroyableClass == 'block nugget appear') {
							amountOfBlocks = amountOfBlocks - 1;
						}
					});
				}

				if (i == amountOfBlocks) {
					setTimeout(function() {
						if (type == 'dive') {
							addNuggets(destroyable);	
						} else {
							$('#grid').addClass('inactive').removeClass('active');
						}
						
						memorize();
					}, 300);	
				}  else {
					i = i + 1;
				}
			}
		});
		playSound(type);
		if (type != 'dive') {
			countScores(amountOfBlocks, type);
		}
	} else if (amountOfBlocks < 3 && type == 'dive') {
		setTimeout(function() {
			addNuggets(destroyable);	
			memorize();
		}, 300);			
	}
}

function getNeighbours(color, id, neighbours) {

	coordinates = id.split("-");
	neighbours.push(id);

	coordinates[0] = parseInt(coordinates[0]);
	coordinates[1] = parseInt(coordinates[1]);
	
	possibleNeighbours = { 
		0 : (coordinates[0] + 1) + '-' + coordinates[1], 
		1 : (coordinates[0] - 1) + '-' + coordinates[1], 
		2 : coordinates[0] + '-' + (coordinates[1] + 1), 
		3 : coordinates[0] + '-' + (coordinates[1] - 1)
	};
	
	$.each(possibleNeighbours, function(index, neighbourId) {
		neighbourColor = $('#'+neighbourId).attr('name');
		if (neighbourColor == color) {
			if(jQuery.inArray(neighbourId,neighbours) == -1){
				neighbours.push(neighbourId);
			}
		}
	});
	
	neighbours = jQuery.unique(neighbours);

	return neighbours;	
}
