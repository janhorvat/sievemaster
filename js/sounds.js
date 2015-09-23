if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	setTimeout(function(){
		var path = window.location.pathname;
		path = path.substr( path, path.length - 10 );
		var mus;
		var loop = function (status) {
			if (status === Media.MEDIA_STOPPED) {
				mus.play();
			}
		};
		var mus = new Media(path + 'sounds/fleva.mp3', null, null, loop);
		window.mus = mus;

	}, 2000);
} else {
	var mus = document.createElement('audio');
	mus.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);		
	mus.setAttribute('src', 'sounds/fleva.mp3');
}

function playSound(type) {
	if (playSounds) {
		if (deviceReady == 1) {
			var path = window.location.pathname;
			path = path.substr( path, path.length - 10 );
			//var snd = new Media("file://" + path + "/sounds/" + type + ".mp3");
			var snd = new Media(path + "sounds/" + type + ".mp3", function() {
			   this.release();
			});
			snd.play();	
		} else {
			audioElement = document.createElement('audio');
			audioElement.setAttribute('src', 'sounds/'+type+'.mp3');
			audioElement.setAttribute('autoplay', 'autoplay');
			audioElement.play();
		}	
	}
}

function playMusic() {
	mus.play();
}

function pauseMusic() {
	mus.pause();
}
