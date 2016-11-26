/**
 * Created by dpc20 on 11/26/2016.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const VehicleService = require('./server/services/VehicleService');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use( bodyParser.json() );

app.post('/vehicle/forward', (req, res) => {
    console.log(req.body);
    const valid = VehicleService.forward(req.body.speed);
    res.send({complete: valid});
});

app.listen(PORT, () => {
    console.log(`Listening Port ${PORT}`);
});

