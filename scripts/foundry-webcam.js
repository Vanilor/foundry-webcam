$(document).ready(() => {
	'use strict';
	
	const templatePath = 'public/modules/foundry-webcam/templates/foundry-webcam.html';
	const showWebcamButton = '#chat-controls .roll-type-select .fa-camera';
	
	function hasGetUserMedia() {
		return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	}
	
	if (hasGetUserMedia()) {
		// Good to go!
	} else {
		alert('getUserMedia() is not supported by your browser');
	}
	const videoElement = document.querySelector('video');
	const videoSelect = document.querySelector('select#videoSource');
	
	navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream).catch(handleError);
	
	videoSelect.onchange = getStream;
	
	function gotDevices(deviceInfos) {
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			const option = document.createElement('option');
			option.value = deviceInfo.deviceId;
			if (deviceInfo.kind === 'videoinput') {
				option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
				videoSelect.appendChild(option);
			} else {
				console.log('Found another kind of device: ', deviceInfo);
			}
		}
	}
	
	function getStream() {
		if (window.stream) {
			window.stream.getTracks().forEach(function(track) {
			track.stop();
		});
	}
	
	const constraints = {
		video: {
			deviceId: {exact: videoSelect.value}
		}
	};
	
	navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
	}
	
	function gotStream(stream) {
		window.stream = stream; // make stream available to console
		videoElement.srcObject = stream;
	}
	
	function handleError(error) {
		console.error('Error: ', error);
	}

	// Render a modal on click.
	$(document).on('click', showWebcamButton, ev => {
		ev.preventDefault();
		const dialogOptions = {
			width: 400,
			top: event.clientY - 80,
			left: window.innerWidth - 710,
			classes: ['dialog']
		};
	
		let templateData = {
      
		};

		renderTemplate(templatePath, templateData).then(dlg => {
			new Dialog({
				title: 'GM Webcam',
				content: dlg,
			}, dialogOptions).render(true);
		});
	});
});

