$(document).ready(function() {

	document.addEventListener("deviceready", onDeviceReady, false);
	
    function onDeviceReady() {
		
		/*bodyWidth = $('body').width();
		if (bodyWidth < 300) {
			slot = 3;
		} else if (bodyWidth >= 300 && bodyWidth < 320) {
			slot = 4;
		} else if (bodyWidth >= 320 && bodyWidth < 468) {
			slot = 15;
		} else if (bodyWidth >= 468 && bodyWidth < 728) {
			slot = 12;			
		} else {
			slot = 11;
		}

		window.inmobi_conf = {
			siteid : "408088441f634b6aa20343f5b906fa53",
			slot: slot,
			test: false,
			manual: true,
			autoRefresh: 20,
			targetWindow : "_blank",
			onError : function(code) {
				if (code == "nfr") {

				}
			}
		};

		$.getScript("lib/inmobi/inmobi.js", function() {
			_inmobi.getNewAd(document.getElementById('ads'));
		});*/
  	
		window.deviceReady = 1;
		
		document.addEventListener("pause", function () { 
			mus.pause() 
		}, false);
		
		document.addEventListener("resume", function () { 
			if (localStorage.getItem('musicEnabled') == 1 && localStorage.getItem('musicEnabled') != null) {
				mus.play();
			}
		}, false);
		
		document.addEventListener("backbutton", function() {
			$('#notification').stop().css({display : 'none'})		
			menuDisplay = $('#menu').css('display');
			tutorial1Display = $('#tutorial1').css('display');
			tutorial2Display = $('#tutorial2').css('display');
			tutorial3Display = $('#tutorial3').css('display');
			restartConfirmationDisplay = $('#restartConfirmation').css('display');
			if (menuDisplay == 'none' && tutorial1Display == 'none' && tutorial2Display == 'none' && tutorial3Display == 'none' && restartConfirmationDisplay == 'none') {
				if (localStorage.getItem('alreadyRated') != null) {
					$('.buttonRate').css({'display' : 'none'});
				} 
				$('#exitConfirmation').css({display: 'block'});
			} else {
				$('#menu, #tutorial1, #tutorial2, #tutorial3, #restartConfirmation').css({display: 'none'});				
			}
			playSound('dive');
		}, false);
		
		document.addEventListener("menubutton", function() {
			$('#notification').stop().css({display : 'none'});
			$('#menu').css({display: 'block'});
			playSound('dive');
		}, false);
    }

	//event: swipe
	$("#grid").swipe( {
        swipeStatus:function(event, phase, direction, distance) {
			if (phase == "move") {
				if (distance > 15) {
					if (direction == 'left') {
						gridMovements(direction, '-=');
					} else if (direction == 'right') {
						gridMovements(direction, '+=');
					} else if (direction == 'up') {
						gridMovements(direction, '-=');
					} else if (direction == 'down') {
						gridMovements(direction, '+=');
					}			  
				}
			}
			if (phase == "end") {
				return false;
			}
        },
        triggerOnTouchEnd:false,
        threshold: 20
      });
      
	//event: arrow keys
	$(document).keydown(function(e) {
		if (e.keyCode == 37) {
			gridMovements('left', '-=');
		} else if (e.keyCode == 39) {
			gridMovements('right', '+=');
		} else if (e.keyCode == 38) {
			gridMovements('up', '-=');
		} else if (e.keyCode == 40) {
			gridMovements('down', '+=');
		} else if (e.keyCode == 27) {
			$('#menu, #tutorial1, #tutorial2, #tutorial3, #restartConfirmation').css({display: 'none'});
		}
	});

	//event: click on block
	$('#grid').on('vclick', 'div', function () {
		if ($('#grid').attr("class") == 'inactive') {
			determineBlocksToClear(this.id);
		}
	});
	
	//menu, tutorial in restart
	$('#buttonMenu').fastClick(function() {
		$('#notification').stop().css({display : 'none'});
		$('#menu').css({display: 'block'});
		playSound('dive');
	});	

	$('#buttonRestart').fastClick(function() {
		if (localStorage.getItem('alreadyRated') != null) {
			$('.buttonRate').css({'display' : 'none'});
		} 
		$('#notification').stop().css({display : 'none'});
		$('#restartConfirmation').css({display: 'block'});
		playSound('dive');
	});
	
	$('.restartYes').fastClick(function() {
		localStorage.removeItem('hole');
		localStorage.removeItem('blocks');
		localStorage.removeItem('settings');
		$('#restartConfirmation, #menu').css({display: 'none'});
		initialize();
	});
	
	$('.exitYes').fastClick(function() {
		navigator.app.exitApp();
	});
	
	$('#next1, #proceed1').fastClick(function() {
		$('#tutorial1').css({display: 'none'});
		$('#tutorial2').css({display: 'block'});
		playSound('dive');
	});
	
	$('#next2, #proceed2').fastClick(function() {
		$('#tutorial2').css({display: 'none'});
		$('#tutorial3').css({display: 'block'});
		playSound('dive');
	});
	
	$('.close, #proceed3').fastClick(function() {
		$('#restartConfirmation').css({display: 'none'});
		$('#exitConfirmation').css({display: 'none'});
		$('#tutorial3').css({display: 'none'});
		playSound('dive');
	});
	
	$('#buttonCloseMenu').fastClick(function() {
		$('#menu').css({display: 'none'});
		playSound('dive');
	});

	$('#buttonHelp').fastClick(function() {
		$('#notification').stop().css({display : 'none'});
		$('#tutorial1').css({display: 'block'});
		playSound('dive');
	});	
	
	$('.buttonRate').fastClick(function() {
		localStorage.setItem('alreadyRated', 1);
		deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
		if (deviceType == 'iPad' || deviceType == 'iPhone') {
			window.open('https://itunes.apple.com/us/genre/ios/id36?mt=8', '_system', 'location=yes');
		} else {
			window.open('https://play.google.com/store', '_system', 'location=yes');
		}
	});	
		
	$('#buttonShare').fastClick(function() {
		playSound('dive');
		window.plugins.socialsharing.share(
			'An addictive Puzzle game! ', 
			'Sieve Master', 
			'data:image/png;base64,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',
			'http://sievemaster.comoj.com'
		);		
	});	

	//sounds and music
	$('#buttonSound').fastClick(function() {
		if (localStorage.getItem('soundsEnabled') == 0) {
			window.playSounds = 1;
			localStorage.setItem('soundsEnabled', 1);
			$('#buttonSound').html('Sounds ON');	
			playSound('dive');
		} else {
			window.playSounds = 0;
			localStorage.setItem('soundsEnabled', 0);	
			$('#buttonSound').html('Sounds OFF');		
		}
	});
	
	$('#buttonMusic').fastClick(function() {
		if (localStorage.getItem('musicEnabled') == 0 || localStorage.getItem('musicEnabled') == null) {
			localStorage.setItem('musicEnabled', 1);
			$('#buttonMusic').html('Music ON');	
			playMusic();
		} else {
			localStorage.setItem('musicEnabled', 0);	
			$('#buttonMusic').html('Music OFF');	
			pauseMusic();
		}

	});
	
});
