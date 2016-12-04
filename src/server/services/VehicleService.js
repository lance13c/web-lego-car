const _ = require('lodash');


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

// INIT GPIO
runRPIO(() => {
	rpio.init({mapping: 'gpio'});
	rpio.open(GPIO_FORWARD, rpio.OUTPUT, rpio.LOW);
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


