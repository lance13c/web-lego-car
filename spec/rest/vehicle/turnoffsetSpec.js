/**
 * Created by dpc20 on 11/26/2016.
 */
const unirest = require('unirest');

describe('turnoffset', () => {
    it('should succeed using valid data', function (done) {
        unirest.post('http://127.0.0.1:3000/vehicle/turnoffset')
            .type('json')
            .send({
                offset: 90
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
        unirest.post('http://127.0.0.1:3000/vehicle/turnoffset')
            .type('json')
            .send({
                offset: 181
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
        unirest.post('http://127.0.0.1:3000/vehicle/turnoffset')
            .type('json')
            .send({
                offset: -1
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
        unirest.post('http://127.0.0.1:3000/vehicle/turnoffset')
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