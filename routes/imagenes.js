var express = require('express');
var app = express();
const fs = require('fs');
const path = require('path');

app.get('/:type/:image', (req, res, next) => {
    var type = req.params.type;
    var image = req.params.image;

    var pathFile = `./uploads/${type}/${image}`;

    if (!fs.existsSync(pathFile)) {
        pathFile = './assets/no-img.jpg';
    }

    res.sendFile(path.resolve(pathFile));
})
module.exports = app;