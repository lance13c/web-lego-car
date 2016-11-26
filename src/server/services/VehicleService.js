
/*

*/
class VehicleService {
  forward(speed) {
    const valid = speed != undefined &&
                  speed <= 1 &&
                  speed >= 0;

    // Logic

    return valid;
  }

  backward(speed) {

  }

  stop() {

  }

  turn(dir) {

  }
}

module.exports = new VehicleService();
