const unirest = require('unirest');

describe('forward', () => {
    it('should succeed using valid data', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/forward')
            .type('json')
            .send({
                speed: 0.5
            })
            .end(function(res) {
                //console.log(`Error: ${res.error}`);
                expect(res.error).toBe(false);
                expect(res.body).toEqual(jasmine.objectContaining({
                    complete: true
                }));
                done();
            });
    });

    it('should fail with data above allowed range', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/forward')
            .type('json')
            .send({
                speed: 1.1
            })
            .end(function(res) {
                //console.log(`Error: ${res.error}`);
                expect(res.error).toBe(false);
                expect(res.body).toEqual(jasmine.objectContaining({
                    complete: false
                }));
                done();
            });
    });

    it('should fail with data below allowed range', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/forward')
            .type('json')
            .send({
                speed: -0.5
            })
            .end(function(res) {
                //console.log(`Error: ${res.error}`);
                expect(res.error).toBe(false);
                expect(res.body).toEqual(jasmine.objectContaining({
                    complete: false
                }));
                done();
            });
    });

    it('should fail when receiving wrong data', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/forward')
            .type('json')
            .send({
                wrong: 'data'
            })
            .end(function(res) {
                //console.log(`Error: ${res.error}`);
                expect(res.error).toBe(false);
                expect(res.body).toEqual(jasmine.objectContaining({
                    complete: false
                }));
                done();
            });
    });
});