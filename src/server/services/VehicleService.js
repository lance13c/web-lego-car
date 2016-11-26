
/*

*/
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
        speed <= 180 &&
        speed >= 0;

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
        speed <= 180 &&
        speed >= 0;

    // Logic

    return valid;
  }
}

module.exports = new VehicleService();
