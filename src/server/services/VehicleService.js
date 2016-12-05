const _ = require('lodash');
const PythonShell = require('python-shell');
let pyshell = new PythonShell('turn.py', {
	mode: 'text',
	scriptPath: __dirname
});

// sends a message to the Python script via stdin
runPy(() =>{
	pyshell.send(0);
	console.log('Turn 0');
});
console.log('Turn 0');

setTimeout(() => {
	runPy(() =>{
		pyshell.send(120);
		console.log('Turn 120');
	});
}, 2000);

setTimeout(() => {
	runPy(() =>{
		pyshell.send(180);
		console.log('Turn 180');
	});
}, 4000);

pyshell.end(function (err) {
	if (err) {
		pyshell = undefined;
		console.log(err);
	}
	console.log('finished');
});

pyshell.on('message', function (message) {
	// received a message sent from the Python script (a simple "print" statement)
	console.log(message);
});

let rpio = undefined;
try {
  rpio = require('rpio');
} catch(e) {
  console.log(e);
}

const GPIO_FORWARD = 12;  // GPIO Pin 12 - PWM
const GPIO_BACKWARD = 13; // GPIO Pin 12 - PWM

/**
 * RPIO wrapper, only calls rpio commands if rpio exists
 * Allow the webapp to work on machines with no GPIO pins
 * @param callback - rpio call
 */
function runRPIO(callback) {
  if (rpio) {
    callback();
  }
}

/**
 * Able to run the python commands inside the callback
 * if pyshell isn't undefined
 * Keeps non rpi computer still able to run the webserver
 * @param callback - python call
 */
function runPy(callback) {
	if (pyshell) {
		callback();
	}
}

// INIT GPIO
runRPIO(() => {
	rpio.init({
		gpiomem: false,
		mapping: 'gpio'
	});
	rpio.open(GPIO_FORWARD, rpio.OUTPUT, rpio.LOW);
	
	//Servo
  const clockdiv = 64;
  const TURN_PIN = 19;
  const TURN_RANGE = 1024;
		
		rpio.open(TURN_PIN, rpio.PWM);
	rpio.pwmSetClockDivider(clockdiv);
	rpio.pwmSetRange(TURN_PIN, TURN_RANGE);
	
	let data = 0;
	let direction = 1;
	let times = 10;
	let interval = 5;
	
	
	let pulse = setInterval(function() {
		rpio.pwmSetData(TURN_PIN, data);
		if (data === 0) {
			direction = 1;
			if (times-- === 0) {
				clearInterval(pulse);
				//rpio.open(pin, rpio.INPUT);
				return;
			}
		} else if (data === TURN_RANGE) {
			direction = -1;
		}
		data += direction;
	}, interval, data, direction, times);
	
	// rpio.pwmSetData(TURN_PIN, 512);
	//
	// setTimeout(() => {
	// 	rpio.pwmSetData(TURN_PIN, 100);
	// }, 2000);
	//
	// setTimeout(() => {
	// 	rpio.pwmSetData(TURN_PIN, 512);
	// }, 4000);
	//
	// setTimeout(() => {
	// 	rpio.pwmSetData(TURN_PIN, 900);
	// }, 6000);
	
	
	
	//rpio.pwmSetData(12, 512);
	
	//rpio.pwmSetData(12, 512);
	
	console.log("GPIO Initalized");
});


class VehicleService {

/**
 * Move the vehicle forwards
 * @param speed {Number} - 0-1 range, 0 = off, 1 = fastest
 * @returns {boolean}
 */
  forward(speed) {
    const valid = speed != undefined &&
                  speed <= 1 &&
                  speed >= 0;

    // Logic
	 runRPIO(() => {
	   if (speed > 0) {
		   rpio.write(GPIO_FORWARD, rpio.HIGH);
		   console.log('Forward High');
     } else {
	     rpio.write(GPIO_FORWARD, rpio.LOW);
		   console.log('Forward Low');
     }
		 
   });

    return valid;
  }

    /**
     * Move the vehicle backwards
     * @param speed {Number} - 0-1 range, 0 = off, 1 = fastest
     * @returns {boolean}
     */
  backward(speed) {
    const valid = speed != undefined &&
        speed <= 1 &&
        speed >= 0;

    // Logic

    return valid;
  }

/**
 * Stops the vehicle
 * @returns {boolean}
 */
  stop() {

    // Logic

    return true;
  }

  /**
   * How much to turn the vehicle
   * @param dir {Number} - 0-180 range, degrees to turn vehicle
   * @returns {boolean}
   */
  turn(dir) {
    const valid = dir != undefined &&
        dir <= 180 &&
        dir >= 0;

    // Logic
    
    return valid;
  }

  /**
   * Offset the direction of the wheels
   * If the wheels at 0degs are 20degs off from being
   * horizontally aligned, offset the wheels so they are aligned.
   * @param offset - {Number} - 0-180 the value to offset
   * @returns {boolean}
   */
  turnOffset(dir) {
    const valid = dir != undefined &&
        dir <= 180 &&
        dir >= 0;

    // Logic

    return valid;
  }
}


module.exports = new VehicleService();


