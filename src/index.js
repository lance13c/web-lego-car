/**
 * Created by dpc20 on 11/26/2016.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const VehicleService = require('./server/services/VehicleService');
const app = express();
const PORT = 3000;

// Turn data received into json
app.use( bodyParser.json() );

// Host the dist folder as static content
app.use( express.static('dist'));


// Host index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Post Endpoints

app.post('/vehicle/forward', (req, res) => {
    console.log("Forward:");
    console.log(req.body);
    const valid = VehicleService.forward(req.body.speed);
    res.send({complete: valid});
});

app.post('/vehicle/backward', (req, res) => {
	console.log("Backward:");
	console.log(req.body);
    const valid = VehicleService.backward(req.body.speed);
    res.send({complete: valid});
});

app.post('/vehicle/stop', (req, res) => {
	console.log("Stop:");
	console.log(req.body);
    const valid = VehicleService.stop();
    res.send({complete: valid});
});

app.post('/vehicle/turn', (req, res) => {
	console.log("Turn:");
	console.log(req.body);
    const valid = VehicleService.turn(req.body.dir);
    res.send({complete: valid});
});

app.post('/vehicle/turnoffset', (req, res) => {
	console.log("Turn Offset:");
	console.log(req.body);
    const valid = VehicleService.turnOffset(req.body.offset);
    res.send({complete: valid});
});

// Start the webserver
app.listen(PORT, () => {
    console.log(`Listening Port ${PORT}`);
});