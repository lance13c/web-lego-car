const _ = require('lodash');
const serverConfig = require('./serverConfig');
const socket = require('socket.io-client')(serverConfig.SOCKET_URL);

// Socket.io Setup
socket.on('connect', () => {
	console.log('Socket Connected');
});
socket.on('disconnect', () => {
	console.log('Socket Disconnected');
});

// Setup rpio so the project able to run on machines that don't have GPIO pins.
let rpio = undefined;
try {
  rpio = require('rpio');
} catch(e) {
  console.log(e);
}

const GPIO_FORWARD = 12;  // GPIO Pin 12
const GPIO_BACKWARD = 13; // GPIO Pin 13

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

// INIT GPIO
runRPIO(() => {
	rpio.init({
		gpiomem: false,
		mapping: 'gpio'
	});
	rpio.open(GPIO_FORWARD, rpio.OUTPUT, rpio.LOW);
	rpio.open(GPIO_BACKWARD, rpio.OUTPUT, rpio.LOW);
});


class VehicleService {
	constructor(){
		this.movingForward = false;
		this.movingBackward = false;
	}

/**
 * Move the vehicle forwards
 * @param speed {Number} - 0-1 range, 0 = off, 1 = fastest
 * @returns {boolean}
 */
  forward(speed) {
  	// Important, otherwise a short circuit will happen
  	if (this.movingBackward) {
		  // Set backwards to 0
		  this.backward(0);
	  }
  	
    const valid = speed != undefined &&
                  speed <= 1 &&
                  speed >= 0;

    // Logic
		if (valid) {
			runRPIO(() => {
				if (speed > 0) {
					this.movingForward = true;
					rpio.write(GPIO_FORWARD, rpio.HIGH);
					console.log('Forward High');
				} else {
					this.movingForward = false;
					rpio.write(GPIO_FORWARD, rpio.LOW);
					console.log('Forward Low');
				}
				
			});
		}
		 

    return valid;
  }

    /**
     * Move the vehicle backwards
     * @param speed {Number} - 0-1 range, 0 = off, 1 = fastest
     * @returns {boolean}
     */
  backward(speed) {
	    // Important, otherwise a short circuit will happen
	    if (this.movingForward) {
		    // Set backwards to 0
		    this.forward(0);
	    }
  	
    const valid = speed != undefined &&
      speed <= 1 &&
      speed >= 0;

	    // Logic
	    if (valid) {
		    runRPIO(() => {
			    if (speed > 0) {
				    this.movingBackward = true;
				    rpio.write(GPIO_BACKWARD, rpio.HIGH);
				    console.log('Backward High');
			    } else {
				    this.movingBackward = false;
				    rpio.write(GPIO_BACKWARD, rpio.LOW);
				    console.log('Backward Low');
			    }
	      });
	    }

    return valid;
  }

/**
 * Stops the vehicle
 * No need, obsolete.
 * @returns {boolean}
 */
  stop() {

    // Logic
		runRPIO(() => {
			rpio.write(GPIO_FORWARD, rpio.LOW);
			rpio.write(GPIO_BACKWARD, rpio.LOW);
		});
	
		return true;
  }

  /**
   * Turns the vehicle a certain amount of degrees
   * @param dir {Number} - 0-180 range, degrees to turn vehicle
   * @returns {boolean}
   */
  turn(dir) {
    const valid = dir != undefined &&
                  dir <= 180       &&
                  dir >= 0;

    // Reverse the direction of the servo
	  // Keeps UI
	  dir = 180 - dir;
	  
    // Logic
	  if (valid) {
	  	console.log('Turn Called');
	    socket.emit('turn', dir);
	  } else {
		  console.log('Turn Not Called');
	  }
	
	  return valid;
  }

  /**
   * Offset the direction of the wheels
   * If the wheels at 0degs are 20degs off from being
   * horizontally aligned, offset the wheels so they are aligned.
   * No need, obsolete.
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


