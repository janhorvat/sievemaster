function gridMovements(direction, predicate) {
	
	animationActivity = $('#grid').attr("class");
	if (animationActivity == 'inactive') {

		$('#grid').toggleClass('inactive active');

		blocks = [];
		var i = 0;
		$('.block').each(function() {
			var coords = this.id.split("-");
			if (direction == 'right' || direction == 'left') {
				blocks.push({index: coords[0], coordinates: [], newPosition: [], moveFor: []});
			} else if (direction == 'up' || direction == 'down') { 
				blocks.push({index: coords[1], coordinates: [], newPosition: [], moveFor: []});
			}
			blocks[i].coordinates.push(coords[0] + '-' + coords[1]);
			i = i + 1;
		});
	
		if (direction == 'right' || direction == 'down') { 
			blocks.sort(function(b, a) {
			   return a.index - b.index;
			})
		} else if (direction == 'left' || direction == 'up') { 
			blocks.sort(function(a, b) {
			   return a.index - b.index;
			})		
		}
		
		determinePosition(blocks, direction);		
		amountOfBlocks = Object.keys(blocks).length;
		m = 1;

		$.each(blocks, function(index, value) {
			if (direction == 'left' || direction == 'right') {
				movement = {'x' : predicate + value['moveFor'][0]};	
			} else {
				movement = {'y' : predicate + value['moveFor'][0]};	
			}
			$('#'+value['coordinates'][0]).transition(movement, 300, "snap", function() {
				$('#'+value['coordinates'][0]).attr('id', value['newPosition'][0]);
				if (m == amountOfBlocks) {
					holeCoordinates = $('.hole').attr('id').split('-');
						
					$('.nugget').each(function() {
						if ((holeCoordinates[0] + '-' + holeCoordinates[1]) == this.id) {
							window.placeNewBlocks = 0;
							levelUp(this.id);
						}
					});
					addNewBlocks();
					playSound('swipe');
				} else {
					m = m + 1;
				}
			});		
		});	
		if (amountOfBlocks == 0) {
			playSound('swipe');
			addNewBlocks();
		}			
	}		
}

function determinePosition(blocks, direction) {

	var i = 0;
	$.each(blocks, function(index, value) {
		var coords = value['coordinates'][0].split("-");
		if (direction == 'right' || direction == 'down') {
			k = gridSize;
		} else if (direction == 'left' || direction == 'up') {
			k = 1;
		}
		for (j = 0; j <= gridSize; j++) {
			if (direction == 'right' || direction == 'left') {
				newPostionCords = k + '-' + coords[1];
			} else if (direction == 'down' || direction == 'up') {
				newPostionCords = coords[0] + '-' + k;
			}
			newPos = isPositionFree(newPostionCords, blocks);
			if (newPos) {
				
				moveFor = getNewPosition(value['coordinates'][0], newPos, direction);
				blocks[i].newPosition.push(newPos);
				blocks[i].moveFor.push(moveFor);
				break;
			}
			if (direction == 'right' || direction == 'down') {
				k = k - 1;
			} else if (direction == 'left' || direction == 'up') {
				k = k + 1;
			}
		}
		i = i + 1;
	});		
}
	
function getNewPosition(oldPositon, newPosition, direction) {

	if (direction == 'left' || direction == 'up') {
		
		var oldCoords = oldPositon.split("-");
		var newCoords = newPosition.split("-");
		if (direction == 'left') {
			moveFor = oldCoords[0] - newCoords[0];
		} else {
			moveFor = oldCoords[1] - newCoords[1];
		}
		moveFor = moveFor * blockWidth;
		return moveFor;
	} else if (direction == 'right' || direction == 'down') {	
		var oldCoords = oldPositon.split("-");
		var newCoords = newPosition.split("-");
		if (direction == 'right') {
			moveFor = newCoords[0] - oldCoords[0];
		} else {
			moveFor = newCoords[1] - oldCoords[1];
		}
		moveFor = moveFor * blockWidth;
		return moveFor;
	}
}

function isPositionFree(newPostionCords, blocks) {
	positionFree = true;
	$.each(blocks, function(index, value) {
		if (value['newPosition'][0] == newPostionCords) {
			positionFree = false;
		}
	});		
	
	if (positionFree) {
		return newPostionCords;
	} else {
		return false;
	}
}
