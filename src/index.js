/**
 * Created by dpc20 on 11/26/2016.
 */
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/')

app.listen(PORT, () => {
    console.log(`Listening Port ${PORT}`);
});

