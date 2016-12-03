/**
 * Created by Lance on 11/28/2016.
 */
const controller = (() => {
	
	// let analogStick = new TouchController.AnalogStick(
	// 	"ce-joystick",
	// 	{left: 100, bottom: 5}
	// );
	
	// Joystick Canvas Setup
	const joystick = document.getElementById('ce-joystick');
	let context = joystick.getContext('2d');
	const centerX = joystick.width / 2;
	const centerY = joystick.height / 2;
	const RADIUS_OFFSET = 5;
	const radius = centerX - RADIUS_OFFSET;
	const CENTER_OFFSET = joystick.width / 2;
	
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
	
	function getJoystickDeg(canvasEl, mouseEvent) {
		const mousePos = getMousePos(canvasEl, mouseEvent);
		const adjacent = mousePos.x - CENTER_OFFSET;
		const opposite = CENTER_OFFSET - mousePos.y;
		const angle = getAngle(opposite, adjacent);
		console.log("Center: " + CENTER_OFFSET);
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
		
		// Draw Horizontal X Axis
		// context.beginPath();
		// context.moveTo(CENTER_OFFSET, CENTER_OFFSET);
		// context.moveTo(CENTER_OFFSET * 2, CENTER_OFFSET);
		// context.fillStyle = 'purple';
		// context.fill();
		// context.lineWidth = 2;
		// context.strokeStyle = '#20285a';
		// context.stroke();
		
		// Draw Text
		context.font = '20pt Calibri';
		context.fillStyle = 'black';
		const TEXT_OFFSET = 10;
		context.fillText(angle, CENTER_OFFSET + TEXT_OFFSET, CENTER_OFFSET - TEXT_OFFSET);
	}
	
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
		const mousePos = getMousePos(joystick, e);
		draw(context, joystick, e);
		const deg = getJoystickDeg(joystick, e);
		console.log(`X: ${mousePos.x}\nY: ${mousePos.y}`);
		console.log(`Deg: ${deg}\n`);
	}
	
	/**
	 * Posts an angle to the server
	 * @param url - The url to POST to
	 * @param angle - The angle to send with the post
	 */
	function postTurn(url, angle) {
		request('POST', url, {
			json: {
				dir: angle
			},
		}).done(function (res) {
			console.log(res.getBody());
		});
	}
	
	// Event Listeners
	joystick.addEventListener('mousemove', (e) => {
		e.preventDefault();
		const deg = getJoystickDeg(joystick, e);
		postTurn('http://megaman.student.rit.edu:3000/vehicle/turn', deg);
		onMouseEvent(e);
	});
	
	joystick.addEventListener('touchmove', (e) => {
		const deg = getJoystickDeg(joystick, e);
		
		// Add lodash throttling
		postTurn('http://megaman.student.rit.edu:3000/vehicle/turn', deg);
		e.preventDefault();
		onMouseEvent(e);
	});
	
	
	
	
	// Init Draw
	draw(context, joystick);
	
	
	return {
		//joystick: joystick
	}
})();
	