/**
 * Created by dpc20 on 11/26/2016.
 */
const unirest = require('unirest');

describe('stop', () => {
    it('should return 200 status', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/stop')
            .end(function(res) {
                expect(res.error).toBe(false);
                expect(res.status).toEqual(200);
                done();
            });
    });
});
