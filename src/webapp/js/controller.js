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
	
	function getJoystickDeg(canvasEl, mouseEvent) {
		const mousePos = getMousePos(canvasEl, mouseEvent);
		const CENTER_OFFSET = canvasEl.width;
		const adjacent = mousePos.x - CENTER_OFFSET;
		const opposite = CENTER_OFFSET - mousePos.y;
		return toDegrees(Math.atan(opposite/adjacent));
	}
	
	/**
	 * Draws a small circle indicating where the mouse is.
	 */
	function drawMouse(context, canvasEl, mousePos) {
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
	
	function draw(context, canvasEl, mouseEvent) {
		// Clears the canvas
		context.clearRect(0, 0, canvasEl.width, canvasEl.height);
		
		// Draws Background
		drawCircle(context);
		
		// Draws Mouse Location
		if (mouseEvent) {
			const mousePos = getMousePos(canvasEl, mouseEvent);
			drawMouse(context, canvasEl, mousePos);
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
	
	// Event Listeners
	joystick.addEventListener('mousemove', (e) => {
		onMouseEvent(e);
	});
	
	joystick.addEventListener('touchmove', (e) => {
		onMouseEvent(e);
	});
	
	
	
	
	// Init Draw
	draw(context, joystick);
	
	return {
		//joystick: joystick
	}
})();
	