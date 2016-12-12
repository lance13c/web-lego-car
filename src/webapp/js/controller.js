/**
 * Created by Lance on 11/28/2016.
 */
const controller = (() => {
	
	// Joystick Canvas Setup
	const joystick = document.getElementById('ce-joystick');
	let context = joystick.getContext('2d');
	const centerX = joystick.width / 2;
	const centerY = joystick.height / 2;
	const RADIUS_OFFSET = 5;
	const radius = centerX - RADIUS_OFFSET;
	const CENTER_OFFSET = joystick.width / 2;
	const THROTTLE_DELAY = 100; // milli seconds
	const DEFAULT_SPEED = 1;
	
	// Buttons Setup
	const btnForward = document.getElementsByClassName("ce-btn-forward")[0];
	const btnBackward = document.getElementsByClassName("ce-btn-backward")[0];
	
	// Background Draw Circle representing the analog surface
	function drawCircle(context) {
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'orange';
		context.fill();
		context.lineWidth = 3;
		context.strokeStyle = '#003300';
		context.stroke();
	}
	
	/**
	 * Gets the current mouse position.
	 * Returns an object with an x, and y
	 * @param canvasEl - The canvas element
	 * @param event - The Mouse or Touch Event
	 * @returns {{x: number, y: number}}
	 */
	function getMousePos(canvasEl, event) {
		const rect = canvasEl.getBoundingClientRect();
		
		switch (event.type) {
			case 'mousemove':
				return {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top
				};
				break;
			case 'touchmove':
				return {
					x: event.changedTouches[0].pageX - rect.left,
					y: event.changedTouches[0].pageY - rect.top
				};
				break;
		}
	}
	
	/**
	 * Turns radians into degrees
	 * @param radians - number in radians
	 * @returns {number} - degrees
	 */
	function toDegrees(radians) {
		return radians * 180 / Math.PI;
	}
	
	/**
	 * Calculates the angle in degrees
	 * Changes the angle to be 0 Right, 90 Top, 180 Left
	 * @param opposite - Opposite side of the triangle
	 * @param adjacent - Adjacent side of the triangle
	 */
	function getAngle(opposite, adjacent) {
		
		let angle = toDegrees(Math.atan(opposite/adjacent));
		
		if (adjacent < 0) {    // If x is negative
			angle += 180;
		}
		
		return angle;
		
	}
	
	/**
	 * Gets the joystick angle in degrees
	 * @param canvasEl - The canvas element
	 * @param mouseEvent - A mouse event
	 * @returns {number} - The angle of the joystick in degrees
	 */
	function getJoystickDeg(canvasEl, mouseEvent) {
		const mousePos = getMousePos(canvasEl, mouseEvent);
		const adjacent = mousePos.x - CENTER_OFFSET;
		const opposite = CENTER_OFFSET - mousePos.y;
		const angle = getAngle(opposite, adjacent);
		return Math.floor(angle);
	}
	
	/**
	 * Draws a small circle indicating where the mouse is.
	 */
	function drawMouse(context, mousePos) {
		// Draw Circle
		const radius = 20;
		context.beginPath();
		context.arc(mousePos.x, mousePos.y, radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'blue';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#003300';
		context.stroke();
	}
	
	/**
	 * Draws a center circle on the joystick
	 * @param center_x - The x position
	 * @param center_y - The y position
	 */
	function drawCenter(center_x, center_y) {
		const RADIUS = 10;
		context.beginPath();
		context.arc(center_x, center_y, RADIUS, 0, 2 * Math.PI, false);
		context.fillStyle = 'black';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = '#003300';
		context.stroke();
	}
	
	/**
	 * Draws the line from center to mouse indicating the angle
	 * Draws Degree Text
	 * @param mousePos - The mouse position object
	 * @param angle {Int}- The angle in degrees
	 */
	function drawAngle(mousePos, angle) {
		context.beginPath();
		context.moveTo(CENTER_OFFSET, CENTER_OFFSET);
		context.lineTo(mousePos.x, mousePos.y);
		context.fillStyle = 'purple';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#20285a';
		context.stroke();
		
		// Draw Text
		context.font = '20pt Calibri';
		context.fillStyle = 'black';
		const TEXT_OFFSET = 10;
		context.fillText(angle, CENTER_OFFSET + TEXT_OFFSET, CENTER_OFFSET - TEXT_OFFSET);
	}
	
	/**
	 * Draws all the shapes that make up the joystick
	 * @param context - canvas context
	 * @param canvasEl - The canvas element
	 * @param mouseEvent - A mouse event
	 */
	function draw(context, canvasEl, mouseEvent) {
		// Clears the canvas
		context.clearRect(0, 0, canvasEl.width, canvasEl.height);
		
		// Draws Background
		drawCircle(context);
		
		// Draws Center Point
		drawCenter(CENTER_OFFSET, CENTER_OFFSET);
		
		// Draws Mouse Location
		if (mouseEvent) {
			const mousePos = getMousePos(canvasEl, mouseEvent);
			const angle = getJoystickDeg(canvasEl, mouseEvent);
			drawAngle(mousePos, angle);
			drawMouse(context, mousePos);
		}
	}
	
	/**
	 * What to do on a Mouse Event
	 * @param e - Mouse Event
	 */
	function onMouseEvent(e) {
		draw(context, joystick, e);
	}
	
	// REST FUNCTION CALLS
	
	/**
	 * Posts an angle to the server
	 * @param url - The url to POST to
	 * @param angle - The angle to send with the post
	 */
	function postTurn(url, angle) {
		
		console.log('turn');
		request('POST', `${url}/vehicle/turn`, {
			json: {
				dir: angle
			},
		}).done(function (res) {
			console.log(res.getBody());
		});
	}
	
	/**
	 * Posts the speed the vehicle will move forward
	 * @param url - The url to POST to
	 * @param speed - The speed of the vehicle from 0-1
	 */
	function postForward(url, speed) {
		
		console.log('forward');
		request('POST', `${url}/vehicle/forward`, {
			json: {
				speed: speed
			},
		}).done(function (res) {
			console.log(res.getBody());
		});
	}
	
	/**
	 * Posts the speed the vehicle will move backward
	 * @param url - The url to POST to
	 * @param speed - The speed of the vehicle from 0-1
	 */
	function postBackward(url, speed) {
		
		console.log('backward');
		request('POST', `${url}/vehicle/backward`, {
			json: {
				speed: speed
			},
		}).done(function (res) {
			console.log(res.getBody());
		});
	}
	
	// Event Listeners
	
	// Transmitting REST API Event Listeners
	joystick.addEventListener('mousemove', _.throttle((e) => {
		e.preventDefault();
		const deg = getJoystickDeg(joystick, e);
		postTurn(CONFIG.url, deg);
	}, THROTTLE_DELAY, {
		leading: true,
		trailing: false
	}));
	
	joystick.addEventListener('touchmove', _.throttle((e) => {
		e.preventDefault();
		const deg = getJoystickDeg(joystick, e);
		postTurn(CONFIG.url, deg);
	}, THROTTLE_DELAY, {
		leading: true,
		trailing: false
	}));
	
	// Mouse Event Listeners
	joystick.addEventListener('mousemove', (e) => {
		e.preventDefault();
		onMouseEvent(e);
	});
	
	joystick.addEventListener('touchmove', (e) => {
		e.preventDefault();
		onMouseEvent(e);
	});
	
	// Button Event Listeners
	
	// Forward Button
	btnForward.addEventListener('touchstart', (e) => {
		e.preventDefault();
		postForward(CONFIG.url, DEFAULT_SPEED);
	});
	
	btnForward.addEventListener('touchend', (e) => {
		e.preventDefault();
		postForward(CONFIG.url, 0);
	});
	
	btnForward.addEventListener('mousedown', (e) => {
		e.preventDefault();
		postForward(CONFIG.url, DEFAULT_SPEED);
	});

	btnForward.addEventListener('mouseup', (e) => {
		e.preventDefault();
		postForward(CONFIG.url, 0);
	});
	
	
	// Back Button
	btnBackward.addEventListener('touchstart', (e) => {
		e.preventDefault();
		postBackward(CONFIG.url, DEFAULT_SPEED);
	});
	
	btnBackward.addEventListener('touchend', (e) => {
		e.preventDefault();
		postBackward(CONFIG.url, 0);
	});
	
	btnBackward.addEventListener('mousedown', (e) => {
		e.preventDefault();
		postBackward(CONFIG.url, DEFAULT_SPEED);
	});
	
	btnBackward.addEventListener('mouseup', (e) => {
		e.preventDefault();
		postBackward(CONFIG.url, 0);
	});
	
	
	// Init Draw
	// Redraw
	draw(context, joystick);
	
	return {}
})();
	