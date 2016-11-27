/**
 * Created by dpc20 on 11/26/2016.
 */
const unirest = require('unirest');

describe('turn', () => {
    it('should succeed using valid data', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/turn')
            .type('json')
            .send({
                dir: 90
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
        unirest.post('http://127.0.0.1:3000/vehicle/turn')
            .type('json')
            .send({
                dir: 181
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
        unirest.post('http://127.0.0.1:3000/vehicle/turn')
            .type('json')
            .send({
                dir: -1
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
        unirest.post('http://127.0.0.1:3000/vehicle/turn')
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
